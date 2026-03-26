(function (global) {
  async function loadDashboardData() {
    try {
      const res = await fetch("./dashboard_data.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      if (global.__DASHBOARD_DATA__) return global.__DASHBOARD_DATA__;
      throw new Error("dashboard_data.json / dashboard_data.js の読み込みに失敗しました。");
    }
  }

  function pct(v) {
    return `${(Number(v || 0) * 100).toFixed(1)}%`;
  }

  function num(v) {
    return Number(v || 0).toLocaleString("ja-JP");
  }

  const PHASE_LABELS = {
    phase1: "テーマ",
    phase2a: "キャラクター",
    phase3: "世界観",
    phase4a: "あらすじ",
    phase4s: "ビジュアル",
  };

  function phaseLabel(phase) {
    const key = String(phase || "");
    if (!key) return "-";
    return PHASE_LABELS[key] || key;
  }

  function phaseWithId(phase) {
    const key = String(phase || "");
    if (!key) return "-";
    const label = phaseLabel(key);
    return label === key ? key : `${label} (${key})`;
  }

  function esc(v) {
    return String(v ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function topTokens(texts, limit = 8) {
    const stop = new Set([
      "こと",
      "それ",
      "これ",
      "ため",
      "よう",
      "もの",
      "ところ",
      "感じ",
      "自分",
      "相手",
      "今回",
      "理由",
      "する",
      "した",
      "して",
      "ある",
      "ない",
      "いる",
      "なる",
      "れる",
      "られる",
      "ように",
      "the",
      "and",
      "for",
      "with",
      "that",
      "this",
      "from",
      "into",
      "very",
      "more",
      "less",
      "have",
      "has",
      "had",
    ]);
    const freq = new Map();
    for (const t of texts || []) {
      const src = String(t || "").toLowerCase();
      const tokens = src.match(/[a-z][a-z0-9_+-]*|[ぁ-んァ-ヴー一-龥々]{2,}|[0-9]+(?:\.[0-9]+)?/g) || [];
      for (const raw of tokens) {
        const w = raw.trim();
        if (!w || stop.has(w)) continue;
        if (/^[a-z]/.test(w) && w.length < 3) continue;
        freq.set(w, (freq.get(w) || 0) + 1);
      }
    }
    return Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, limit)
      .map(([word, count]) => ({ word, count }));
  }

  function extractReasonElements(texts, limit = 6) {
    const dict = {
      共感: ["共感", "刺さ", "響", "心", "感情", "痛み", "苦し", "寄り添", "リアル"],
      新規性: ["新鮮", "意外", "驚", "斬新", "独創", "ユニーク", "面白"],
      物語性: ["物語", "ストーリー", "展開", "結末", "余韻", "伏線", "世界観"],
      視覚性: ["映像", "画", "ビジュアル", "色", "構図", "光", "影", "カメラ", "質感"],
      音楽適合: ["曲", "音", "リズム", "テンポ", "bpm", "歌詞", "メロディ"],
      説得力: ["自然", "納得", "説得", "違和感", "唐突", "無理", "浅い", "単調"],
      可読性: ["わかり", "理解", "複雑", "難解", "混乱", "曖昧"],
    };
    const counter = new Map();
    for (const text of texts || []) {
      const s = String(text || "");
      for (const [label, kws] of Object.entries(dict)) {
        if (kws.some((k) => s.includes(k))) {
          counter.set(label, (counter.get(label) || 0) + 1);
        }
      }
    }
    return Array.from(counter.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, limit)
      .map(([element, count]) => ({ element, count }));
  }

  function renderTokenList(arr, kind) {
    if (!arr || !arr.length) return "-";
    if (kind === "word") return arr.map((x) => `${esc(x.word)}(${num(x.count)})`).join(" / ");
    return arr.map((x) => `${esc(x.element)}(${num(x.count)})`).join(" / ");
  }

  function resolvePortraitUrl(rawUrl, personaId) {
    const url = String(rawUrl || "").trim();
    const out = [];
    const add = (v) => {
      const s = String(v || "").trim();
      if (!s) return;
      if (!out.includes(s)) out.push(s);
    };

    if (url) {
      if (/^https?:\/\//.test(url) || url.startsWith("data:")) {
        add(url);
      } else if (url.startsWith("file://")) {
        const p = decodeURI(url.replace(/^file:\/\//, ""));
        const marker = "/mv-orchestra-v0.9.1-work/";
        if (p.includes(marker)) add(`../../../${p.split(marker)[1]}`);
        if (p.includes("/sessions/")) add(`../../../sessions/${p.split("/sessions/")[1]}`);
      } else if (url.startsWith("/Users/")) {
        const marker = "/mv-orchestra-v0.9.1-work/";
        if (url.includes(marker)) add(`../../../${url.split(marker)[1]}`);
        if (url.includes("/sessions/")) add(`../../../sessions/${url.split("/sessions/")[1]}`);
      } else if (url.startsWith("sessions/")) {
        add(`../../../${url}`);
      } else if (url.startsWith("./sessions/")) {
        add(`../../../${url.replace(/^\.\//, "")}`);
      } else if (url.startsWith("/sessions/")) {
        add(`../../..${url}`);
      } else {
        add(url);
        add(`../../../${url}`);
      }
    }

    const pid = String(personaId || "").trim();
    if (pid) {
      add(`../../../sessions/persona_pool_v2/portraits/${pid}.png`);
      add(`../../../sessions/persona_pool_v2/portraits/${pid}.jpg`);
      add(`../../../sessions/persona_pool_v2/portraits/${pid}.webp`);
    }
    return out;
  }

  function buildPortraitImgTag(rawUrl, personaId, altText) {
    const sources = resolvePortraitUrl(rawUrl, personaId);
    const first = sources[0] || "";
    const payload = esc(JSON.stringify(sources));
    return `<img class="persona-avatar" src="${esc(first)}" alt="${esc(altText || "")}" data-sources="${payload}" data-source-index="0">`;
  }

  function wirePortraitFallback(rootEl) {
    if (!rootEl) return;
    const imgs = rootEl.querySelectorAll("img[data-sources]");
    imgs.forEach((img) => {
      img.addEventListener("error", () => {
        let list = [];
        try {
          list = JSON.parse(img.getAttribute("data-sources") || "[]");
        } catch (e) {
          list = [];
        }
        let idx = Number(img.getAttribute("data-source-index") || 0) + 1;
        while (idx < list.length && (!list[idx] || list[idx] === img.src)) idx += 1;
        if (idx < list.length) {
          img.setAttribute("data-source-index", String(idx));
          img.src = list[idx];
          return;
        }
        img.style.display = "none";
      });
    });
  }

  const UX_LOG_KEY = "goji_dashboard_ux_log_v1";
  const UX_TASK_KEY = "goji_dashboard_ux_task_v1";
  const UX_LOG_LIMIT = 800;

  function nowTs() {
    return Date.now();
  }

  function readJsonLS(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function writeJsonLS(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }

  function trackUXEvent(page, event, payload) {
    const logs = readJsonLS(UX_LOG_KEY, []);
    logs.push({
      ts: nowTs(),
      page: String(page || ""),
      event: String(event || ""),
      payload: payload || {},
    });
    if (logs.length > UX_LOG_LIMIT) logs.splice(0, logs.length - UX_LOG_LIMIT);
    writeJsonLS(UX_LOG_KEY, logs);
  }

  function startUXTask(taskId, meta) {
    const tasks = readJsonLS(UX_TASK_KEY, {});
    const id = String(taskId || "");
    if (!id) return;
    tasks[id] = {
      started_at: nowTs(),
      meta: meta || {},
      completed: false,
      completed_at: null,
    };
    writeJsonLS(UX_TASK_KEY, tasks);
    trackUXEvent("global", "task_start", { taskId: id, meta: meta || {} });
  }

  function completeUXTask(taskId, meta) {
    const tasks = readJsonLS(UX_TASK_KEY, {});
    const id = String(taskId || "");
    if (!id || !tasks[id]) return;
    tasks[id].completed = true;
    tasks[id].completed_at = nowTs();
    tasks[id].complete_meta = meta || {};
    writeJsonLS(UX_TASK_KEY, tasks);
    trackUXEvent("global", "task_complete", { taskId: id, meta: meta || {} });
  }

  function getUXSummary(days) {
    const logs = readJsonLS(UX_LOG_KEY, []);
    const tasks = readJsonLS(UX_TASK_KEY, {});
    const horizon = Math.max(1, Number(days || 7));
    const cutoff = nowTs() - horizon * 24 * 60 * 60 * 1000;
    const activeLogs = logs.filter((x) => Number(x.ts || 0) >= cutoff);
    const byPage = {};
    activeLogs.forEach((x) => {
      const p = String(x.page || "unknown");
      byPage[p] = (byPage[p] || 0) + 1;
    });
    const completed = Object.entries(tasks)
      .map(([id, t]) => ({ id, t }))
      .filter((x) => x.t && x.t.completed && Number(x.t.completed_at || 0) >= cutoff);
    const durations = completed
      .map((x) => Number(x.t.completed_at || 0) - Number(x.t.started_at || 0))
      .filter((v) => v >= 0);
    const avgMs = durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
    return {
      horizon_days: horizon,
      event_count: activeLogs.length,
      page_events: byPage,
      completed_tasks: completed.length,
      avg_task_ms: Math.round(avgMs),
      avg_task_sec: Math.round(avgMs / 100) / 10,
      samples: durations.length,
    };
  }

  function clearUXLogs() {
    try {
      localStorage.removeItem(UX_LOG_KEY);
      localStorage.removeItem(UX_TASK_KEY);
    } catch (e) {}
  }

  global.DashboardShared = {
    loadDashboardData,
    pct,
    num,
    phaseLabel,
    phaseWithId,
    esc,
    topTokens,
    extractReasonElements,
    renderTokenList,
    resolvePortraitUrl,
    buildPortraitImgTag,
    wirePortraitFallback,
    trackUXEvent,
    startUXTask,
    completeUXTask,
    getUXSummary,
    clearUXLogs,
  };
})(window);
