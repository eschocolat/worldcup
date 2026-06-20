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

  // 우승확률 추정 vs 사전 모델 vs 시장: 세 관점 비교
  // opta = 대회 전 Opta 슈퍼컴퓨터 %, market = 06.18 베팅 American odds
  const COMPARE = [
    { team: "프랑스", flag: "🇫🇷", mine: 17, opta: 13.0, market: "+410", marketRank: 1, lead: true },
    { team: "스페인", flag: "🇪🇸", mine: 15, opta: 16.1, market: "+450", marketRank: 2 },
    { team: "잉글랜드", flag: "ENG_FLAG", mine: 13, opta: 11.2, market: "+550", marketRank: 3 },
    { team: "아르헨티나", flag: "🇦🇷", mine: 12, opta: 10.4, market: "+650", marketRank: 4 }
  ];

  // 1차전 출발 현황
  const KICKOFF = {
    win: [
      { team: "멕시코", flag: "🇲🇽" }, { team: "대한민국", flag: "🇰🇷" },
      { team: "미국", flag: "🇺🇸" }, { team: "독일", flag: "🇩🇪" },
      { team: "프랑스", flag: "🇫🇷" }, { team: "아르헨티나", flag: "🇦🇷" },
      { team: "콜롬비아", flag: "🇨🇴" }, { team: "잉글랜드", flag: "ENG_FLAG" }
    ],
    draw: [
      { team: "스페인", flag: "🇪🇸" }, { team: "브라질", flag: "🇧🇷" },
      { team: "포르투갈", flag: "🇵🇹" }, { team: "네덜란드", flag: "🇳🇱" }
    ]
  };

  // 시나리오 토글: 기본(현재) vs 야말 복귀 시
  const SCENARIO = {
    base: {
      label: "현재 기준",
      note: "1차전 결과 · 06.18 시장 평가를 그대로 반영한 기본 시나리오.",
      rows: [
        { team: "프랑스", flag: "🇫🇷", pct: 17 },
        { team: "스페인", flag: "🇪🇸", pct: 15 },
        { team: "잉글랜드", flag: "ENG_FLAG", pct: 13 },
        { team: "아르헨티나", flag: "🇦🇷", pct: 12 }
      ]
    },
    yamal: {
      label: "야말 정상 복귀 시",
      note: "야말이 정상 컨디션으로 돌아오고 스페인이 조 1위를 안정적으로 회복하면 프랑스–스페인은 거의 동률로 좁혀집니다.",
      rows: [
        { team: "스페인", flag: "🇪🇸", pct: 16.5, up: true },
        { team: "프랑스", flag: "🇫🇷", pct: 16.5 },
        { team: "잉글랜드", flag: "ENG_FLAG", pct: 12.5, down: true },
        { team: "아르헨티나", flag: "🇦🇷", pct: 12 }
      ]
    }
  };

  // 2026 본선 실제 조 추첨 결과(각 조 4팀) + 분석가 예상 순위.
  // pos: 1·2 = 진출, 3 = in/out, 4 = 탈락
  const GROUPS = [
    { g: "A", hot: false, rows: [["멕시코","🇲🇽",1,"in"],["대한민국","🇰🇷",2,"in"],["체코","🇨🇿",3,"out"],["남아공","🇿🇦",4,"out"]] },
    { g: "B", hot: false, rows: [["스위스","🇨🇭",1,"in"],["캐나다","🇨🇦",2,"in"],["보스니아","🇧🇦",3,"out"],["카타르","🇶🇦",4,"out"]] },
    { g: "C", hot: true, rows: [["브라질","🇧🇷",1,"in"],["모로코","🇲🇦",2,"in"],["스코틀랜드","🏴󠁧󠁢󠁳󠁣󠁴󠁿",3,"in"],["아이티","🇭🇹",4,"out"]] },
    { g: "D", hot: false, rows: [["미국","🇺🇸",1,"in"],["호주","🇦🇺",2,"in"],["튀르키예","🇹🇷",3,"in"],["파라과이","🇵🇾",4,"out"]] },
    { g: "E", hot: false, rows: [["독일","🇩🇪",1,"in"],["코트디부아르","🇨🇮",2,"in"],["에콰도르","🇪🇨",3,"in"],["쿠라소","🇨🇼",4,"out"]] },
    { g: "F", hot: true, rows: [["네덜란드","🇳🇱",1,"in"],["스웨덴","🇸🇪",2,"in"],["일본","🇯🇵",3,"in"],["튀니지","🇹🇳",4,"out"]] },
    { g: "G", hot: false, rows: [["벨기에","🇧🇪",1,"in"],["이집트","🇪🇬",2,"in"],["이란","🇮🇷",3,"out"],["뉴질랜드","🇳🇿",4,"out"]] },
    { g: "H", hot: false, rows: [["스페인","🇪🇸",1,"in"],["우루과이","🇺🇾",2,"in"],["사우디","🇸🇦",3,"in"],["카보베르데","🇨🇻",4,"out"]] },
    { g: "I", hot: false, rows: [["프랑스","🇫🇷",1,"in"],["노르웨이","🇳🇴",2,"in"],["세네갈","🇸🇳",3,"in"],["이라크","🇮🇶",4,"out"]] },
    { g: "J", hot: false, rows: [["아르헨티나","🇦🇷",1,"in"],["오스트리아","🇦🇹",2,"in"],["알제리","🇩🇿",3,"out"],["요르단","🇯🇴",4,"out"]] },
    { g: "K", hot: true, rows: [["콜롬비아","🇨🇴",1,"in"],["포르투갈","🇵🇹",2,"in"],["DR콩고","🇨🇩",3,"in"],["우즈베키스탄","🇺🇿",4,"out"]] },
    { g: "L", hot: true, rows: [["잉글랜드","🏴󠁧󠁢󠁥󠁮󠁧󠁿",1,"in"],["크로아티아","🇭🇷",2,"in"],["가나","🇬🇭",3,"in"],["파나마","🇵🇦",4,"out"]] }
  ];

  // bracket: each tie = { sides:[[name,flag,winBool],...], cmt, big }
  const t = (a, af, aw, b, bf, bw, cmt, big) => ({ sides: [[a, af, aw], [b, bf, bw]], cmt: cmt || "", big: !!big });
  const ROUNDS = [
    { title: "32강 · R32", final: false, ties: [
      t("대한민국","🇰🇷",1, "캐나다","🇨🇦",0, "한국, 32강까지는 충분히 해볼 만한 대진", true),
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
      t("대한민국","🇰🇷",0, "네덜란드","🇳🇱",1, "한국, 객관 전력상 난도 급상승 구간", true),
      t("독일","🇩🇪",0, "프랑스","🇫🇷",1, "사실상 결승급 전력 대결", true),
      t("브라질","🇧🇷",1, "노르웨이","🇳🇴",0),
      t("멕시코","🇲🇽",0, "잉글랜드","🏴󠁧󠁢󠁥󠁮󠁧󠁿",1, "개최국 멕시코의 빅매치", true),
      t("포르투갈","🇵🇹",0, "스페인","🇪🇸",1, "스페인 점유·압박 구조가 더 안정적", true),
      t("미국","🇺🇸",0, "벨기에","🇧🇪",1),
      t("아르헨티나","🇦🇷",1, "이집트","🇪🇬",0),
      t("스위스","🇨🇭",0, "콜롬비아","🇨🇴",1)
    ]},
    { title: "8강 · QF", final: false, ties: [
      t("네덜란드","🇳🇱",0, "프랑스","🇫🇷",1),
      t("스페인","🇪🇸",1, "벨기에","🇧🇪",0),
      t("브라질","🇧🇷",0, "잉글랜드","🏴󠁧󠁢󠁥󠁮󠁧󠁿",1, "거의 50:50 — 잉글랜드 공격 생산성에 무게", true),
      t("아르헨티나","🇦🇷",1, "콜롬비아","🇨🇴",0)
    ]},
    { title: "4강 · SF", final: false, ties: [
      t("프랑스","🇫🇷",1, "스페인","🇪🇸",0, "음바페 결정력 vs 스페인 xG의 결정력 부재", true),
      t("잉글랜드","🏴󠁧󠁢󠁥󠁮󠁧󠁿",0, "아르헨티나","🇦🇷",1, "메시 폼·토너먼트 DNA가 가른다", true)
    ]},
    { title: "결승 · FINAL", final: true, ties: [
      t("프랑스","🇫🇷",1, "아르헨티나","🇦🇷",0, "예상 스코어 2-1 · 상한 + 안정성의 프랑스", true)
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
  // England flag uses invisible subdivision tag chars that are fragile to edit;
  // store as a token and resolve to the real emoji at render time.
  const ENG = "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}";
  const flagOf = (f) => (f === "ENG_FLAG" ? ENG : f);

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
      const card = el("div", "gcard reveal" + (grp.hot ? " gcard--hot" : ""));
      card.style.transitionDelay = (i % 4) * 0.05 + "s";
      let rowsHtml = "";
      grp.rows.forEach((r) => {
        const [name, flag, pos, fate] = r;
        let fateLabel, fateCls;
        if (pos === 1) { fateLabel = "1위"; fateCls = "gcard__fate"; }
        else if (pos === 2) { fateLabel = "2위"; fateCls = "gcard__fate"; }
        else if (pos === 3) { fateLabel = fate === "in" ? "진출" : "탈락"; fateCls = "gcard__fate " + (fate === "in" ? "fate--in" : "fate--out"); }
        else { fateLabel = "탈락"; fateCls = "gcard__fate fate--gone"; }
        rowsHtml +=
          '<div class="gcard__row gcard__row--' + pos + '">' +
          '<span class="gcard__pos">' + pos + "</span>" +
          '<span class="gcard__flag">' + flagOf(flag) + "</span>" +
          '<span class="gcard__team">' + name + "</span>" +
          '<span class="' + fateCls + '">' + fateLabel + "</span>" +
          "</div>";
      });
      const hotBadge = grp.hot ? '<span class="gcard__hot">접전</span>' : '<span class="gcard__tag">GROUP</span>';
      card.innerHTML =
        '<div class="gcard__head"><span class="gcard__letter">' + grp.g + "</span>" + hotBadge + "</div>" + rowsHtml;
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
        tie.sides.forEach((side) => {
          const [name, flag, win] = side;
          sides +=
            '<div class="tie__side' + (win ? " tie__side--win" : "") + '">' +
            '<span class="tie__flag">' + flagOf(flag) + "</span>" +
            '<span class="tie__name">' + name + "</span></div>";
        });
        const cmt = tie.cmt ? '<p class="tie__cmt">' + tie.cmt + "</p>" : "";
        matchesHtml += '<div class="tie' + (tie.big ? " tie--big" : "") + '">' + sides + cmt + "</div>";
      });
      col.innerHTML =
        '<div class="round__title">' + rnd.title + "</div>" +
        '<div class="round__matches">' + matchesHtml + "</div>";
      root.appendChild(col);
    });
  }

  /* ----------------------------------------------------------
     render: COMPARE (내 픽 vs Opta vs 시장)
     ---------------------------------------------------------- */
  function renderCompare() {
    const root = $("#compareChart");
    if (!root) return;
    const max = Math.max.apply(null, COMPARE.map((c) => Math.max(c.mine, c.opta)));
    COMPARE.forEach((c, i) => {
      const row = el("div", "cmp reveal" + (c.lead ? " cmp--lead" : ""));
      row.style.transitionDelay = i * 0.06 + "s";
      const diff = (c.mine - c.opta);
      const diffStr = (diff >= 0 ? "+" : "") + diff.toFixed(1);
      const diffCls = diff > 0 ? "cmp__diff cmp__diff--up" : diff < 0 ? "cmp__diff cmp__diff--down" : "cmp__diff";
      row.innerHTML =
        '<div class="cmp__head"><span class="cmp__flag">' + flagOf(c.flag) + "</span>" +
        '<span class="cmp__name">' + c.team + "</span>" +
        '<span class="cmp__market">시장 ' + c.market + " · #" + c.marketRank + "</span></div>" +
        '<div class="cmp__bars">' +
          '<div class="cmp__line"><span class="cmp__tag cmp__tag--mine">내 픽</span>' +
            '<span class="cmp__track"><span class="cmp__fill cmp__fill--mine" data-w="' + (c.mine / max) * 100 + '"></span></span>' +
            '<span class="cmp__val">' + c.mine.toFixed(1) + "%</span></div>" +
          '<div class="cmp__line"><span class="cmp__tag cmp__tag--opta">Opta</span>' +
            '<span class="cmp__track"><span class="cmp__fill cmp__fill--opta" data-w="' + (c.opta / max) * 100 + '"></span></span>' +
            '<span class="cmp__val">' + c.opta.toFixed(1) + "%</span></div>" +
        "</div>" +
        '<span class="' + diffCls + '">' + diffStr + "p</span>";
      root.appendChild(row);
    });
  }

  /* ----------------------------------------------------------
     render: KICKOFF (1차전 출발 현황)
     ---------------------------------------------------------- */
  function renderKickoff() {
    const wrap = $("#kickoffWin");
    const wrap2 = $("#kickoffDraw");
    if (!wrap || !wrap2) return;
    const chip = (x) => '<span class="chip"><span class="chip__flag">' + flagOf(x.flag) + "</span>" + x.team + "</span>";
    wrap.innerHTML = KICKOFF.win.map(chip).join("");
    wrap2.innerHTML = KICKOFF.draw.map(chip).join("");
    const w = $("#kickoffWinCount");
    const d = $("#kickoffDrawCount");
    if (w) w.textContent = KICKOFF.win.length;
    if (d) d.textContent = KICKOFF.draw.length;
  }

  /* ----------------------------------------------------------
     render: SCENARIO toggle
     ---------------------------------------------------------- */
  function renderScenario() {
    const root = $("#scenarioBars");
    const note = $("#scenarioNote");
    const btns = document.querySelectorAll("[data-scenario]");
    if (!root) return;

    function draw(key) {
      const sc = SCENARIO[key];
      const max = Math.max.apply(null, sc.rows.map((r) => r.pct));
      root.innerHTML = "";
      sc.rows.slice().sort((a, b) => b.pct - a.pct).forEach((r) => {
        const move = r.up ? '<span class="scn__move scn__move--up">▲</span>' : r.down ? '<span class="scn__move scn__move--down">▼</span>' : "";
        const bar = el("div", "scn");
        bar.innerHTML =
          '<span class="scn__flag">' + flagOf(r.flag) + "</span>" +
          '<span class="scn__name">' + r.team + move + "</span>" +
          '<span class="scn__track"><span class="scn__fill" style="width:0%"></span></span>' +
          '<span class="scn__val">' + r.pct + "%</span>";
        root.appendChild(bar);
        requestAnimationFrame(() => {
          const f = bar.querySelector(".scn__fill");
          if (f) f.style.width = (r.pct / max) * 100 + "%";
        });
      });
      if (note) note.textContent = sc.note;
      btns.forEach((b) => b.classList.toggle("is-active", b.dataset.scenario === key));
    }

    btns.forEach((b) => b.addEventListener("click", () => draw(b.dataset.scenario)));
    draw("base");
  }

  /* ----------------------------------------------------------
     scroll reveal + bar fill (IntersectionObserver)
     ---------------------------------------------------------- */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    const fillSel = ".bar__fill, .cmp__fill";
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach((e) => {
        e.classList.add("is-in");
        e.querySelectorAll(fillSel).forEach((f) => (f.style.width = f.dataset.w + "%"));
      });
      return;
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const node = entry.target;
          node.classList.add("is-in");
          node.querySelectorAll(fillSel).forEach((f) => {
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
    renderCompare();
    renderKickoff();
    renderGroups();
    renderBracket();
    renderScenario();
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
