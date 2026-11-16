/**
 * 婚禮儀表板 ⇄ Notion 同步 Worker（Cloudflare Workers）
 *
 * 網站把密碼放在 X-Pass 標頭送來，這裡比對後才代為讀寫 Notion。
 * Notion 金鑰只存在 Cloudflare 的 Secret 裡，不會出現在網頁上。
 *
 * 需要在 Cloudflare 設定的變數（Settings → Variables and Secrets）：
 *   NOTION_TOKEN   (Secret)  Notion integration 的 Internal Integration Secret
 *   SITE_PASSWORD  (Secret)  跟網站同一組密碼
 *   ALLOWED_ORIGIN (Text)    https://willy110611-collab.github.io
 *   TOTAL_BUDGET   (Text)    總預算，例如 1000000（選填）
 *
 * API：
 *   GET  /data                         → 全部資料（與網站 data.json 同格式，另附 schema）
 *   POST /save   {kind, id?, fields}   → 有 id 就更新、沒有就新增
 *   POST /delete {kind, id}            → 移到 Notion 垃圾桶（可在 Notion 復原）
 */

const NOTION = "https://api.notion.com/v1";
const NOTION_VERSION = "2025-09-03";

const META = { date: "2027-10-10T18:00:00+08:00", venue: "一森 Evermore Wedding", city: "彰化田尾" };

/* 每個分頁對應的 Notion 資料來源與欄位（key：網站用的短名，p：Notion 欄位名，t：欄位型別） */
const KINDS = {
  tasks: {
    ds: "4e016323-992b-82d6-b465-07a146e28be6",
    fields: {
      n: { p: "任務名稱", t: "title", label: "任務名稱" },
      s: { p: "狀態", t: "status", label: "狀態" },
      st: { p: "所屬階段", t: "select", label: "所屬階段" },
      d: { p: "到期日", t: "date", label: "到期日" },
      who: { p: "負責確認者", t: "select", label: "負責確認者" },
      cat: { p: "類別", t: "select", label: "類別" },
      elder: { p: "長輩堅持度", t: "select", label: "長輩堅持度" },
      todo: { p: "待辦事項", t: "rich_text", label: "待辦事項" },
      c: { p: "最終結論", t: "rich_text", label: "最終結論" },
    },
  },
  budget: {
    ds: "38816323-992b-8048-8843-000b1177de2c",
    fields: {
      n: { p: "名稱", t: "title", label: "名稱" },
      cat: { p: "分類", t: "select", label: "分類" },
      e: { p: "預估花費", t: "number", label: "預估花費" },
      a: { p: "實際花費", t: "number", label: "實際花費" },
      s: { p: "付款狀態", t: "status", label: "付款狀態" },
      who: { p: "出資方", t: "select", label: "出資方" },
      pd: { p: "支付日期", t: "date", label: "支付日期" },
      note: { p: "備註", t: "rich_text", label: "備註" },
    },
  },
  vendors: {
    ds: "89716323-992b-833d-b032-87a31e579eb6",
    fields: {
      n: { p: "廠商名稱", t: "title", label: "廠商名稱" },
      t: { p: "服務類型", t: "select", label: "服務類型" },
      s: { p: "合作狀態", t: "status", label: "合作狀態" },
      u: { p: "網址", t: "url", label: "網址" },
      ct: { p: "聯絡窗口", t: "rich_text", label: "聯絡窗口" },
      sch: { p: "檔期", t: "rich_text", label: "檔期" },
      q: { p: "合約與報價單", t: "rich_text", label: "合約與報價單" },
      note: { p: "文字", t: "rich_text", label: "筆記（優缺點）" },
    },
  },
  guests: {
    ds: "c8b16323-992b-839f-b5a9-8780a999d4fb",
    fields: {
      n: { p: "賓客姓名", t: "title", label: "賓客姓名" },
      g: { p: "群組分類", t: "select", label: "群組分類" },
      s: { p: "出席意願", t: "status", label: "出席意願" },
      c: { p: "出席人數", t: "number", label: "出席人數" },
      v: { p: "素食人數", t: "number", label: "素食人數" },
      tb: { p: "預計桌號", t: "select", label: "預計桌號" },
      gift: { p: "需發喜餅", t: "checkbox", label: "需發喜餅" },
      amt: { p: "禮金金額", t: "number", label: "禮金金額" },
      tel: { p: "聯絡方式", t: "rich_text", label: "聯絡方式" },
      note: { p: "備註", t: "rich_text", label: "備註" },
    },
  },
};

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean);
    const cors = {
      "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : allowed[0] || "null",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,X-Pass",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    };
    const json = (body, status = 200) =>
      new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });

    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (!env.NOTION_TOKEN || !env.SITE_PASSWORD) return json({ error: "Worker 尚未設定 NOTION_TOKEN 或 SITE_PASSWORD" }, 500);
    if (!(await samePass(req.headers.get("X-Pass") || "", env.SITE_PASSWORD))) return json({ error: "密碼錯誤" }, 401);

    const path = new URL(req.url).pathname.replace(/\/+$/, "");
    try {
      if (req.method === "GET" && path === "/data") return json(await loadAll(env));
      if (req.method === "POST" && path === "/save") {
        const { kind, id, fields } = await req.json();
        const K = KINDS[kind];
        if (!K || !fields || typeof fields !== "object") return json({ error: "參數不正確" }, 400);
        const properties = toProps(K, fields);
        const page = id
          ? await notion(env, "PATCH", `/pages/${cleanId(id)}`, { properties })
          : await notion(env, "POST", "/pages", { parent: { type: "data_source_id", data_source_id: K.ds }, properties });
        return json({ ok: true, item: fromPage(K, page) });
      }
      if (req.method === "POST" && path === "/delete") {
        const { kind, id } = await req.json();
        if (!KINDS[kind] || !id) return json({ error: "參數不正確" }, 400);
        await notion(env, "PATCH", `/pages/${cleanId(id)}`, { in_trash: true });
        return json({ ok: true });
      }
      return json({ error: "not found" }, 404);
    } catch (e) {
      return json({ error: String((e && e.message) || e) }, 502);
    }
  },
};

/* ---------- password check (constant-time on SHA-256 digests) ---------- */
async function samePass(a, b) {
  const enc = new TextEncoder();
  const [x, y] = await Promise.all([crypto.subtle.digest("SHA-256", enc.encode(a)), crypto.subtle.digest("SHA-256", enc.encode(b))]);
  const u = new Uint8Array(x), v = new Uint8Array(y);
  let diff = 0;
  for (let i = 0; i < u.length; i++) diff |= u[i] ^ v[i];
  return diff === 0 && a.length > 0;
}

/* ---------- Notion ---------- */
async function notion(env, method, path, body) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const r = await fetch(NOTION + path, {
      method,
      headers: { Authorization: `Bearer ${env.NOTION_TOKEN}`, "Notion-Version": NOTION_VERSION, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (r.status === 429) { await new Promise((ok) => setTimeout(ok, 800 * (attempt + 1))); continue; }
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(`Notion ${r.status}: ${data.message || "未知錯誤"}`);
    return data;
  }
  throw new Error("Notion 忙線中，請稍後再試");
}
const cleanId = (id) => String(id).replace(/[^0-9a-fA-F-]/g, "");

async function queryAll(env, ds) {
  const out = [];
  let cursor;
  do {
    const r = await notion(env, "POST", `/data_sources/${ds}/query`, { page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) });
    out.push(...r.results);
    cursor = r.has_more ? r.next_cursor : null;
  } while (cursor);
  return out;
}

async function loadAll(env) {
  const kinds = Object.keys(KINDS);
  const [pages, sources] = await Promise.all([
    Promise.all(kinds.map((k) => queryAll(env, KINDS[k].ds))),
    Promise.all(kinds.map((k) => notion(env, "GET", `/data_sources/${KINDS[k].ds}`))),
  ]);
  const out = { meta: { ...META, totalBudget: Number(env.TOTAL_BUDGET) || 0, snapshot: nowTaipei(), live: true }, schema: {} };
  kinds.forEach((k, i) => {
    const K = KINDS[k];
    out[k] = pages[i].filter((p) => !p.in_trash && !p.archived).map((p) => fromPage(K, p));
    out.schema[k] = schemaOf(K, sources[i]);
  });
  // 待辦依期限、階段排序；廠商、賓客照 Notion 建立順序
  const stages = (out.schema.tasks.fields.find((f) => f.key === "st") || {}).options || [];
  const rank = (t) => { const i = stages.indexOf(t.st); return i < 0 ? 99 : i; };
  out.tasks.sort((a, b) => rank(a) - rank(b) || String(a.d || "9").localeCompare(String(b.d || "9")));
  return out;
}

function schemaOf(K, src) {
  const props = (src && src.properties) || {};
  const fields = Object.entries(K.fields).map(([key, f]) => {
    const p = props[f.p] || {};
    const opts = (p.select && p.select.options) || (p.status && p.status.options) || null;
    return { key, label: f.label, t: f.t, options: opts ? opts.map((o) => o.name) : undefined };
  });
  return { fields };
}

function fromPage(K, page) {
  const o = { id: page.id };
  const props = page.properties || {};
  for (const [key, f] of Object.entries(K.fields)) {
    const p = props[f.p];
    if (!p) continue;
    let v = null;
    switch (f.t) {
      case "title": v = plain(p.title); break;
      case "rich_text": v = plain(p.rich_text); break;
      case "number": v = p.number; break;
      case "select": v = p.select ? p.select.name : null; break;
      case "status": v = p.status ? p.status.name : null; break;
      case "date": v = p.date ? p.date.start : null; break;
      case "url": v = p.url; break;
      case "checkbox": v = !!p.checkbox; break;
    }
    if (v !== null && v !== "" && v !== undefined) o[key] = v;
  }
  return o;
}
const plain = (arr) => (arr || []).map((t) => t.plain_text || "").join("");

function toProps(K, fields) {
  const props = {};
  for (const [key, raw] of Object.entries(fields)) {
    const f = K.fields[key];
    if (!f) continue;
    const empty = raw === null || raw === undefined || raw === "";
    switch (f.t) {
      case "title": props[f.p] = { title: chunks(raw) }; break;
      case "rich_text": props[f.p] = { rich_text: chunks(raw) }; break;
      case "number": { const n = Number(raw); props[f.p] = { number: empty || !isFinite(n) ? null : n }; break; }
      case "select": props[f.p] = { select: empty ? null : { name: String(raw).replace(/,/g, "，").slice(0, 100) } }; break;
      case "status": if (!empty) props[f.p] = { status: { name: String(raw) } }; break;
      case "date": props[f.p] = { date: empty ? null : { start: String(raw).slice(0, 10) } }; break;
      case "url": props[f.p] = { url: empty ? null : String(raw).slice(0, 2000) }; break;
      case "checkbox": props[f.p] = { checkbox: raw === true || raw === "true" || raw === 1 }; break;
    }
  }
  return props;
}
function chunks(s) {
  s = s == null ? "" : String(s);
  const out = [];
  for (let i = 0; i < s.length && out.length < 100; i += 1900) out.push({ type: "text", text: { content: s.slice(i, i + 1900) } });
  return out;
}
function nowTaipei() {
  const d = new Date(Date.now() + 8 * 3600e3);
  return d.toISOString().slice(0, 16).replace("T", " ");
}
