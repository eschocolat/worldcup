/* ============================================================
   WORLD CUP 2026 — interactions & data rendering
   ============================================================ */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------
     DATA
     ---------------------------------------------------------- */
  const ODDS = [
    { team: "프랑스", flag: "🇫🇷", pct: 17, cmt: "전력·토너먼트 경험·음바페 폼·시장 반영 모두 최상위", lead: true },
    { team: "스페인", flag: "🇪🇸", pct: 15, cmt: "Opta 1위였지만 Cape Verde전 0-0이 감점. 야말 회복 시 다시 1위권" },
    { team: "잉글랜드", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", pct: 13, cmt: "크로아티아전 4-2로 공격력 확인. 수비 안정성은 리스크" },
    { team: "아르헨티나", flag: "🇦🇷", pct: 12, cmt: "메시 해트트릭으로 시작, FIFA 랭킹 1위권. 연속 우승 부담만 변수" },
    { team: "브라질", flag: "🇧🇷", pct: 8, cmt: "모로코전 1-1은 경고등. 그래도 스쿼드 상한은 높음" },
    { team: "포르투갈", flag: "🇵🇹", pct: 7, cmt: "DR콩고전 1-1로 하락. 재능은 충분하지만 구조적 답답함" },
    { team: "독일", flag: "🇩🇪", pct: 6, cmt: "퀴라소 7-1 대승으로 상승. 상대 수준 감안 필요" },
    { team: "네덜란드", flag: "🇳🇱", pct: 5, cmt: "일본전 2-2로 불안하지만 토너먼트 체급은 유지" },
    { team: "벨기에", flag: "🇧🇪", pct: 3, cmt: "우승보다는 8강권 다크호스" },
    { team: "콜롬비아", flag: "🇨🇴", pct: 3, cmt: "우즈베키스탄전 3-1, 조 1위 가능성 상승" }
  ];

  const GROUPS = [
    { g: "A", rows: [["멕시코","🇲🇽",1,"in"],["대한민국","🇰🇷",2,"in"],["체코","🇨🇿",3,"out"]] },
    { g: "B", rows: [["스위스","🇨🇭",1,"in"],["캐나다","🇨🇦",2,"in"],["보스니아","🇧🇦",3,"out"]] },
    { g: "C", rows: [["브라질","🇧🇷",1,"in"],["모로코","🇲🇦",2,"in"],["스코틀랜드","🏴󠁧󠁢󠁳󠁣󠁴󠁿",3,"in"]] },
    { g: "D", rows: [["미국","🇺🇸",1,"in"],["호주","🇦🇺",2,"in"],["튀르키예","🇹🇷",3,"in"]] },
    { g: "E", rows: [["독일","🇩🇪",1,"in"],["코트디부아르","🇨🇮",2,"in"],["에콰도르","🇪🇨",3,"in"]] },
    { g: "F", rows: [["네덜란드","🇳🇱",1,"in"],["스웨덴","🇸🇪",2,"in"],["일본","🇯🇵",3,"in"]] },
    { g: "G", rows: [["벨기에","🇧🇪",1,"in"],["이집트","🇪🇬",2,"in"],["이란","🇮🇷",3,"out"]] },
    { g: "H", rows: [["스페인","🇪🇸",1,"in"],["우루과이","🇺🇾",2,"in"],["사우디","🇸🇦",3,"in"]] },
    { g: "I", rows: [["프랑스","🇫🇷",1,"in"],["노르웨이","🇳🇴",2,"in"],["세네갈","🇸🇳",3,"in"]] },
    { g: "J", rows: [["아르헨티나","🇦🇷",1,"in"],["오스트리아","🇦🇹",2,"in"],["알제리","🇩🇿",3,"out"]] },
    { g: "K", rows: [["콜롬비아","🇨🇴",1,"in"],["포르투갈","🇵🇹",2,"in"],["DR콩고","🇨🇩",3,"in"]] },
    { g: "L", rows: [["잉글랜드","🏴󠁧󠁢󠁥󠁮󠁧󠁿",1,"in"],["크로아티아","🇭🇷",2,"in"],["가나","🇬🇭",3,"in"]] }
  ];

  // bracket: each tie = [ [name,flag,winBool], [name,flag,winBool] ]
  const t = (a, af, aw, b, bf, bw) => [[a, af, aw], [b, bf, bw]];
  const ROUNDS = [
    { title: "32강 · R32", final: false, ties: [
      t("대한민국","🇰🇷",1, "캐나다","🇨🇦",0),
      t("독일","🇩🇪",1, "튀르키예","🇹🇷",0),
      t("네덜란드","🇳🇱",1, "모로코","🇲🇦",0),
      t("브라질","🇧🇷",1, "스웨덴","🇸🇪",0),
      t("프랑스","🇫🇷",1, "일본","🇯🇵",0),
      t("코트디부아르","🇨🇮",0, "노르웨이","🇳🇴",1),
      t("멕시코","🇲🇽",1, "스코틀랜드","🏴󠁧󠁢󠁳󠁣󠁴󠁿",0),
      t("잉글랜드","🏴󠁧󠁢󠁥󠁮󠁧󠁿",1, "DR콩고","🇨🇩",0),
      t("미국","🇺🇸",1, "세네갈","🇸🇳",0),
      t("벨기에","🇧🇪",1, "사우디","🇸🇦",0),
      t("포르투갈","🇵🇹",1, "크로아티아","🇭🇷",0),
      t("스페인","🇪🇸",1, "오스트리아","🇦🇹",0),
      t("스위스","🇨🇭",1, "에콰도르","🇪🇨",0),
      t("아르헨티나","🇦🇷",1, "우루과이","🇺🇾",0),
      t("콜롬비아","🇨🇴",1, "가나","🇬🇭",0),
      t("호주","🇦🇺",0, "이집트","🇪🇬",1)
    ]},
    { title: "16강 · R16", final: false, ties: [
      t("대한민국","🇰🇷",0, "네덜란드","🇳🇱",1),
      t("독일","🇩🇪",0, "프랑스","🇫🇷",1),
      t("브라질","🇧🇷",1, "노르웨이","🇳🇴",0),
      t("멕시코","🇲🇽",0, "잉글랜드","🏴󠁧󠁢󠁥󠁮󠁧󠁿",1),
      t("포르투갈","🇵🇹",0, "스페인","🇪🇸",1),
      t("미국","🇺🇸",0, "벨기에","🇧🇪",1),
      t("아르헨티나","🇦🇷",1, "이집트","🇪🇬",0),
      t("스위스","🇨🇭",0, "콜롬비아","🇨🇴",1)
    ]},
    { title: "8강 · QF", final: false, ties: [
      t("네덜란드","🇳🇱",0, "프랑스","🇫🇷",1),
      t("스페인","🇪🇸",1, "벨기에","🇧🇪",0),
      t("브라질","🇧🇷",0, "잉글랜드","🏴󠁧󠁢󠁥󠁮󠁧󠁿",1),
      t("아르헨티나","🇦🇷",1, "콜롬비아","🇨🇴",0)
    ]},
    { title: "4강 · SF", final: false, ties: [
      t("프랑스","🇫🇷",1, "스페인","🇪🇸",0),
      t("잉글랜드","🏴󠁧󠁢󠁥󠁮󠁧󠁿",0, "아르헨티나","🇦🇷",1)
    ]},
    { title: "결승 · FINAL", final: true, ties: [
      t("프랑스","🇫🇷",1, "아르헨티나","🇦🇷",0)
    ]}
  ];

  /* ----------------------------------------------------------
     helpers
     ---------------------------------------------------------- */
  const $ = (s, c) => (c || document).querySelector(s);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };

  /* ----------------------------------------------------------
     render: ODDS bars
     ---------------------------------------------------------- */
  function renderOdds() {
    const root = $("#oddsChart");
    if (!root) return;
    const max = Math.max.apply(null, ODDS.map((o) => o.pct));
    ODDS.forEach((o, i) => {
      const bar = el("div", "bar reveal" + (o.lead ? " bar--lead" : ""));
      bar.style.transitionDelay = i * 0.04 + "s";
      bar.innerHTML =
        '<span class="bar__rank">' + (i + 1) + "</span>" +
        '<span class="bar__flag">' + o.flag + "</span>" +
        '<span class="bar__name">' + o.team + "</span>" +
        '<span class="bar__track"><span class="bar__fill" data-w="' + (o.pct / max) * 100 + '"></span></span>' +
        '<span class="bar__pct">' + o.pct + "%</span>" +
        '<span class="bar__cmt">' + o.cmt + "</span>";
      root.appendChild(bar);
    });
  }

  /* ----------------------------------------------------------
     render: GROUP cards
     ---------------------------------------------------------- */
  function renderGroups() {
    const root = $("#groupsGrid");
    if (!root) return;
    GROUPS.forEach((grp, i) => {
      const card = el("div", "gcard reveal");
      card.style.transitionDelay = (i % 4) * 0.05 + "s";
      let rowsHtml = "";
      grp.rows.forEach((r) => {
        const [name, flag, pos, fate] = r;
        const fateLabel = pos === 3 ? (fate === "in" ? "진출" : "탈락") : (pos === 1 ? "1위" : "2위");
        const fateCls = pos === 3 ? (fate === "in" ? "gcard__fate fate--in" : "gcard__fate fate--out") : "gcard__fate";
        rowsHtml +=
          '<div class="gcard__row gcard__row--' + pos + '">' +
          '<span class="gcard__pos">' + pos + "</span>" +
          '<span class="gcard__flag">' + flag + "</span>" +
          '<span class="gcard__team">' + name + "</span>" +
          '<span class="' + fateCls + '">' + fateLabel + "</span>" +
          "</div>";
      });
      card.innerHTML =
        '<div class="gcard__head"><span class="gcard__letter">' + grp.g + "</span>" +
        '<span class="gcard__tag">GROUP</span></div>' + rowsHtml;
      root.appendChild(card);
    });
  }

  /* ----------------------------------------------------------
     render: BRACKET
     ---------------------------------------------------------- */
  function renderBracket() {
    const root = $("#bracketBoard");
    if (!root) return;
    ROUNDS.forEach((rnd) => {
      const col = el("div", "round reveal" + (rnd.final ? " round--final" : ""));
      let matchesHtml = "";
      rnd.ties.forEach((tie) => {
        let sides = "";
        tie.forEach((side) => {
          const [name, flag, win] = side;
          sides +=
            '<div class="tie__side' + (win ? " tie__side--win" : "") + '">' +
            '<span class="tie__flag">' + flag + "</span>" +
            '<span class="tie__name">' + name + "</span></div>";
        });
        matchesHtml += '<div class="tie">' + sides + "</div>";
      });
      col.innerHTML =
        '<div class="round__title">' + rnd.title + "</div>" +
        '<div class="round__matches">' + matchesHtml + "</div>";
      root.appendChild(col);
    });
  }

  /* ----------------------------------------------------------
     scroll reveal + bar fill (IntersectionObserver)
     ---------------------------------------------------------- */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach((e) => {
        e.classList.add("is-in");
        e.querySelectorAll(".bar__fill").forEach((f) => (f.style.width = f.dataset.w + "%"));
      });
      return;
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const node = entry.target;
          node.classList.add("is-in");
          node.querySelectorAll(".bar__fill").forEach((f) => {
            requestAnimationFrame(() => (f.style.width = f.dataset.w + "%"));
          });
          obs.unobserve(node);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((e) => io.observe(e));
  }

  /* ----------------------------------------------------------
     hero count-up
     ---------------------------------------------------------- */
  function countUp() {
    const node = document.querySelector("[data-count]");
    if (!node) return;
    const target = parseInt(node.dataset.count, 10);
    if (reduceMotion) { node.textContent = target; return; }
    const dur = 1400;
    let start = null;
    function step(ts) {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      node.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ----------------------------------------------------------
     nav stuck state + scroll progress + active link
     ---------------------------------------------------------- */
  function initNav() {
    const nav = $("#nav");
    const bar = $("#progressBar");
    const links = Array.prototype.slice.call(document.querySelectorAll(".nav__links a"));
    const sections = links
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || window.pageYOffset;
        if (nav) nav.classList.toggle("is-stuck", y > 40);
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";

        // active link
        let current = "";
        const mid = y + window.innerHeight * 0.35;
        sections.forEach((sec) => {
          if (sec.offsetTop <= mid) current = "#" + sec.id;
        });
        links.forEach((a) =>
          a.classList.toggle("is-active", a.getAttribute("href") === current)
        );
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------
     boot
     ---------------------------------------------------------- */
  function boot() {
    renderOdds();
    renderGroups();
    renderBracket();
    initReveal();
    initNav();
    countUp();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
