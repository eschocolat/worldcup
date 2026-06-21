/* ============================================================
   WORLD CUP 2026 — interactions & data rendering
   ============================================================ */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------
     DATA — TOURNAMENT (primary)
     ---------------------------------------------------------- */
  // 공동 개최 3개국
  const HOSTS = [
    { name: "멕시코", en: "MEXICO", flag: "🇲🇽", cities: 3, note: "개막전 개최 · 사상 첫 3회 월드컵 개최 도시" },
    { name: "미국", en: "USA", flag: "🇺🇸", cities: 11, note: "결승 개최 · 16개 도시 중 11개 도시 담당" },
    { name: "캐나다", en: "CANADA", flag: "🇨🇦", cities: 2, note: "토론토 · 밴쿠버 첫 월드컵 본선 개최" }
  ];

  // 핵심 숫자
  const FACTS = [
    { num: 48, label: "참가국", sub: "32개국에서 확대" },
    { num: 104, label: "경기 수", sub: "64경기 → 104경기" },
    { num: 16, label: "개최 도시", sub: "미 11 · 멕 3 · 캐 2" },
    { num: 12, label: "조 편성", sub: "각 조 4팀" }
  ];

  // 주요 개최 도시 · 경기장 (실사진은 로컬 assets/img/cities)
  const CITIES = [
    { city: "멕시코시티", country: "멕시코", flag: "🇲🇽", stadium: "에스타디오 아스테카", cap: "≈ 80,800", img: "assets/img/cities/mexicocity.jpg", tag: "개막전", note: "1970·1986·2026 — 세 번의 월드컵을 치르는 최초의 경기장." },
    { city: "뉴욕 / 뉴저지", country: "미국", flag: "🇺🇸", stadium: "메트라이프 스타디움", cap: "≈ 82,500", img: "assets/img/cities/newyork.jpg", tag: "결승", note: "2026년 7월 19일, 대망의 결승전이 열리는 무대." },
    { city: "로스앤젤레스", country: "미국", flag: "🇺🇸", stadium: "소파이 스타디움", cap: "≈ 70,500", img: "assets/img/cities/losangeles.jpg", tag: "", note: "약 50억 달러, 역대 최고 비용으로 지어진 최첨단 돔." },
    { city: "샌프란시스코 베이", country: "미국", flag: "🇺🇸", stadium: "리바이스 스타디움", cap: "≈ 70,900", img: "assets/img/cities/sanfrancisco.jpg", tag: "", note: "실리콘밸리 한복판의 친환경 스마트 경기장." },
    { city: "마이애미", country: "미국", flag: "🇺🇸", stadium: "하드록 스타디움", cap: "≈ 65,300", img: "assets/img/cities/miami.jpg", tag: "3·4위전", note: "라틴 열기가 가득한 남부 거점 도시." },
    { city: "토론토", country: "캐나다", flag: "🇨🇦", stadium: "BMO 필드", cap: "≈ 45,700", img: "assets/img/cities/toronto.jpg", tag: "", note: "캐나다 대표팀의 홈, 단풍의 도시." },
    { city: "밴쿠버", country: "캐나다", flag: "🇨🇦", stadium: "BC 플레이스", cap: "≈ 54,500", img: "assets/img/cities/vancouver.jpg", tag: "", note: "태평양 연안, 개폐식 지붕의 랜드마크 경기장." }
  ];

  // 주요국 · 스타 선수 — 나라별 그룹 (사진은 위키미디어 기반 실사진, 로컬 저장)
  // img가 없는 선수는 이니셜 폴백 카드로 표시
  const SQUADS = [
    { team: "프랑스", flag: "🇫🇷", players: [
      { player: "킬리안 음바페", pos: "FW", club: "레알 마드리드", img: "assets/img/players/mbappe.jpg", blurb: "압도적 결정력. 이번 대회 우승의 핵심 키." },
      { player: "앙투안 그리즈만", pos: "FW", club: "AT 마드리드", img: "assets/img/players/griezmann.jpg", blurb: "팀을 잇는 연결고리. 빅매치에 강한 베테랑." },
      { player: "우스만 뎀벨레", pos: "WG", club: "파리 생제르맹", img: "assets/img/players/dembele.jpg", blurb: "양발 드리블러. 2025 발롱도르 위너." }
    ]},
    { team: "아르헨티나", flag: "🇦🇷", players: [
      { player: "리오넬 메시", pos: "FW", club: "인터 마이애미", img: "assets/img/players/messi.jpg", blurb: "디펜딩 챔피언의 상징. 역대 최다 타이 6번째 월드컵." },
      { player: "라우타로 마르티네스", pos: "FW", club: "인터 밀란", img: "assets/img/players/martinez_l.jpg", blurb: "냉정한 마무리. 알비셀레스테의 9번." },
      { player: "훌리안 알바레스", pos: "FW", club: "AT 마드리드", img: "assets/img/players/alvarez.jpg", blurb: "지칠 줄 모르는 활동량의 멀티 공격수." }
    ]},
    { team: "스페인", flag: "🇪🇸", players: [
      { player: "라민 야말", pos: "WG", club: "FC 바르셀로나", img: "assets/img/players/yamal.jpg", blurb: "2025 발롱도르 2위. 첫 월드컵에 나서는 천재." },
      { player: "페드리", pos: "MF", club: "FC 바르셀로나", img: "assets/img/players/pedri.jpg", blurb: "경기 템포를 지배하는 중원의 지휘자." },
      { player: "로드리", pos: "MF", club: "맨체스터 시티", img: "assets/img/players/rodri.jpg", blurb: "2024 발롱도르. 수비형 미드필더의 교과서." }
    ]},
    { team: "잉글랜드", flag: "ENG_FLAG", players: [
      { player: "주드 벨링엄", pos: "MF", club: "레알 마드리드", img: "assets/img/players/bellingham.jpg", blurb: "중원을 지배하는 전천후 미드필더." },
      { player: "해리 케인", pos: "FW", club: "바이에른 뮌헨", img: "assets/img/players/kane.jpg", blurb: "잉글랜드 역대 최다 득점자. 확실한 9번." },
      { player: "부카요 사카", pos: "WG", club: "아스널", img: "assets/img/players/saka.jpg", blurb: "오른쪽을 책임지는 폭발적 윙어." }
    ]},
    { team: "브라질", flag: "🇧🇷", players: [
      { player: "비니시우스 주니오르", pos: "FW", club: "레알 마드리드", img: "assets/img/players/vinicius.jpg", blurb: "측면을 찢는 폭발적인 드리블러." },
      { player: "호드리구", pos: "FW", club: "레알 마드리드", img: "assets/img/players/rodrygo.jpg", blurb: "큰 경기에 강한 해결사형 공격수." },
      { player: "하피냐", pos: "WG", club: "FC 바르셀로나", img: "assets/img/players/raphinha.jpg", blurb: "득점과 도움을 겸비한 전천후 윙어." }
    ]},
    { team: "포르투갈", flag: "🇵🇹", players: [
      { player: "크리스티아누 호날두", pos: "FW", club: "알 나스르", img: "assets/img/players/ronaldo.jpg", blurb: "41세의 라스트 댄스. 살아있는 전설." },
      { player: "브루누 페르난드스", pos: "MF", club: "맨체스터 유나이티드", img: "assets/img/players/fernandes.jpg", blurb: "찬스를 만드는 창의적인 플레이메이커." },
      { player: "하파엘 레앙", pos: "WG", club: "AC 밀란", img: "assets/img/players/leao.jpg", blurb: "스피드와 힘을 갖춘 측면 파괴자." }
    ]},
    { team: "독일", flag: "🇩🇪", players: [
      { player: "자말 무시알라", pos: "MF", club: "바이에른 뮌헨", img: "assets/img/players/musiala.jpg", blurb: "부상 복귀 후 합류한 독일의 창의성." },
      { player: "플로리안 비르츠", pos: "MF", club: "리버풀", img: "assets/img/players/wirtz.jpg", blurb: "독일 차세대 10번. 탈압박과 침투의 달인." },
      { player: "요주아 키미히", pos: "MF", club: "바이에른 뮌헨", img: "assets/img/players/kimmich.jpg", blurb: "전술 지능과 패스의 사령탑이자 주장." }
    ]},
    { team: "네덜란드", flag: "🇳🇱", players: [
      { player: "버질 반다이크", pos: "DF", club: "리버풀", img: "assets/img/players/vandijk.jpg", blurb: "세계 최정상급 수비수이자 주장." },
      { player: "코디 학포", pos: "FW", club: "리버풀", img: "assets/img/players/gakpo.jpg", blurb: "왼발 슈팅이 일품인 멀티 공격수." },
      { player: "멤피스 데파이", pos: "FW", club: "코린치안스", img: "assets/img/players/depay.jpg", blurb: "오라녜 역대 최다 득점에 빛나는 에이스." }
    ]},
    { team: "대한민국", flag: "🇰🇷", players: [
      { player: "손흥민", pos: "FW", club: "LAFC", img: "assets/img/players/sonheungmin.jpg", blurb: "아시아 최고의 윙어. 대표팀의 주장이자 상징." },
      { player: "이강인", pos: "MF", club: "파리 생제르맹", img: "assets/img/players/leekangin.jpg", blurb: "왼발 킥과 창의성을 갖춘 중원의 핵." },
      { player: "김민재", pos: "DF", club: "바이에른 뮌헨", img: "assets/img/players/kimminjae.jpg", blurb: "‘괴물’이라 불리는 월드클래스 센터백." }
    ]},
    { team: "일본", flag: "🇯🇵", players: [
      { player: "미토마 카오루", pos: "WG", club: "브라이턴", img: "assets/img/players/mitoma.jpg", blurb: "현란한 드리블로 측면을 허무는 윙어." },
      { player: "쿠보 타케후사", pos: "WG", club: "레알 소시에다드", img: "assets/img/players/kubo.jpg", blurb: "탈압박과 연계가 뛰어난 기술형 공격수." },
      { player: "엔도 와타루", pos: "MF", club: "리버풀", img: "assets/img/players/endo.jpg", blurb: "중원을 단단히 잠그는 사무라이의 주장." }
    ]},
    { team: "크로아티아", flag: "🇭🇷", players: [
      { player: "루카 모드리치", pos: "MF", club: "AC 밀란", img: "assets/img/players/modric.jpg", blurb: "마지막 월드컵을 향하는 중원의 마에스트로." },
      { player: "마테오 코바치치", pos: "MF", club: "맨체스터 시티", img: "assets/img/players/kovacic.jpg", blurb: "탈압박이 일품인 박스 투 박스 미드필더." },
      { player: "이반 페리시치", pos: "WG", club: "PSV 에인트호번", img: "assets/img/players/perisic.jpg", blurb: "큰 무대에 강한 베테랑 측면 자원." }
    ]},
    { team: "벨기에", flag: "🇧🇪", players: [
      { player: "케빈 더브라위너", pos: "MF", club: "나폴리", img: "assets/img/players/debruyne.jpg", blurb: "세계 최고의 플레이메이커. 황금세대의 두뇌." },
      { player: "로멜루 루카쿠", pos: "FW", club: "나폴리", img: "assets/img/players/lukaku.jpg", blurb: "벨기에 역대 최다 득점자인 파워 스트라이커." },
      { player: "제레미 도쿠", pos: "WG", club: "맨체스터 시티", img: "assets/img/players/doku.jpg", blurb: "폭발적인 가속력의 차세대 드리블러." }
    ]},
    { team: "모로코", flag: "🇲🇦", players: [
      { player: "아슈라프 하키미", pos: "DF", club: "파리 생제르맹", img: "assets/img/players/hakimi.jpg", blurb: "공수를 넘나드는 세계 최고의 풀백." },
      { player: "하킴 지예시", pos: "MF", club: "알 두하일", img: "assets/img/players/ziyech.jpg", blurb: "정교한 왼발 킥의 창의적 미드필더." },
      { player: "브라힘 디아스", pos: "MF", club: "레알 마드리드", img: "assets/img/players/brahim.jpg", blurb: "좁은 공간을 뚫는 영리한 공격형 미드필더." }
    ]},
    { team: "나이지리아", flag: "🇳🇬", players: [
      { player: "빅터 오시멘", pos: "FW", club: "갈라타사라이", img: "assets/img/players/osimhen.jpg", blurb: "폭발적인 결정력의 정상급 스트라이커." },
      { player: "아데몰라 루크만", pos: "FW", club: "아탈란타", img: "assets/img/players/lookman.jpg", blurb: "2024 아프리카 올해의 선수. 측면의 해결사." },
      { player: "알렉스 이워비", pos: "MF", club: "풀럼", img: "assets/img/players/iwobi.jpg", blurb: "활동량과 연계가 좋은 공격형 미드필더." }
    ]}
  ];

  /* ----------------------------------------------------------
     DATA — PREDICTION (secondary)
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
     render: FACTS (count-up stat row)
     ---------------------------------------------------------- */
  function renderFacts() {
    const root = $("#factsRow");
    if (!root) return;
    FACTS.forEach((f, i) => {
      const card = el("div", "fact reveal");
      card.style.transitionDelay = i * 0.07 + "s";
      card.innerHTML =
        '<span class="fact__num" data-count="' + f.num + '">0</span>' +
        '<span class="fact__label">' + f.label + "</span>" +
        '<span class="fact__sub">' + f.sub + "</span>";
      root.appendChild(card);
    });
  }

  /* ----------------------------------------------------------
     render: HOSTS
     ---------------------------------------------------------- */
  function renderHosts() {
    const root = $("#hostsRow");
    if (!root) return;
    HOSTS.forEach((h, i) => {
      const card = el("div", "host reveal");
      card.style.transitionDelay = i * 0.08 + "s";
      card.innerHTML =
        '<span class="host__flag">' + h.flag + "</span>" +
        '<div class="host__body"><span class="host__en">' + h.en + "</span>" +
        '<h3 class="host__name">' + h.name + "</h3>" +
        '<span class="host__cities">' + h.cities + "개 도시</span>" +
        '<p class="host__note">' + h.note + "</p></div>";
      root.appendChild(card);
    });
  }

  /* ----------------------------------------------------------
     render: CITIES & stadiums (photo cards)
     ---------------------------------------------------------- */
  function renderCities() {
    const root = $("#citiesGrid");
    if (!root) return;
    CITIES.forEach((c, i) => {
      const card = el("article", "citycard reveal" + (c.tag ? " citycard--feat" : ""));
      card.style.transitionDelay = (i % 3) * 0.06 + "s";
      const tag = c.tag ? '<span class="citycard__tag">' + c.tag + "</span>" : "";
      card.innerHTML =
        '<div class="citycard__media">' +
          '<img loading="lazy" src="' + c.img + '" alt="' + c.city + " 전경" + '" />' +
          tag +
        "</div>" +
        '<div class="citycard__body">' +
          '<div class="citycard__top"><span class="citycard__flag">' + c.flag + "</span>" +
          '<span class="citycard__city">' + c.city + "</span></div>" +
          '<h3 class="citycard__stadium">' + c.stadium + "</h3>" +
          '<span class="citycard__cap">수용 ' + c.cap + "</span>" +
          '<p class="citycard__note">' + c.note + "</p>" +
        "</div>";
      root.appendChild(card);
    });
  }

  /* ----------------------------------------------------------
     render: SQUADS (country tabs + star player cards)
     ---------------------------------------------------------- */
  // 이름에서 이니셜 추출 (사진 폴백 카드용) — 한글은 성 한 글자, 그 외는 첫 글자
  function initialsOf(name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]);
    return name.slice(0, 2);
  }

  function buildPlayerCard(p, team, flag, i) {
    const card = el("article", "pcard reveal");
    card.style.transitionDelay = (i % 3) * 0.06 + "s";
    const media = p.img
      ? '<img loading="lazy" src="' + p.img + '" alt="' + p.player + '" />'
      : '<span class="pcard__initials" aria-hidden="true">' + initialsOf(p.player) + "</span>";
    card.innerHTML =
      '<div class="pcard__media' + (p.img ? "" : " pcard__media--noimg") + '">' + media +
        '<span class="pcard__pos">' + p.pos + "</span>" +
      "</div>" +
      '<div class="pcard__body">' +
        '<div class="pcard__nat"><span class="pcard__flag">' + flagOf(flag) + "</span>" + team + "</div>" +
        '<h3 class="pcard__name">' + p.player + "</h3>" +
        '<span class="pcard__club">' + p.club + "</span>" +
        '<p class="pcard__blurb">' + p.blurb + "</p>" +
      "</div>";
    return card;
  }

  function renderPlayers() {
    const tabsRoot = $("#playerTabs");
    const grid = $("#playersGrid");
    if (!grid || !tabsRoot) return;

    let active = 0;

    function paint() {
      // 탭 활성 상태 갱신
      Array.prototype.forEach.call(tabsRoot.children, (btn, idx) => {
        const on = idx === active;
        btn.classList.toggle("is-active", on);
        btn.setAttribute("aria-selected", on ? "true" : "false");
        btn.tabIndex = on ? 0 : -1;
      });
      // 선택 나라 선수만 렌더
      const sq = SQUADS[active];
      grid.innerHTML = "";
      sq.players.forEach((p, i) => grid.appendChild(buildPlayerCard(p, sq.team, sq.flag, i)));
      // 새로 그려진 카드에 reveal 적용
      revealNow(grid);
    }

    // 탭 버튼 생성
    SQUADS.forEach((sq, idx) => {
      const btn = el("button", "ptab");
      btn.type = "button";
      btn.setAttribute("role", "tab");
      btn.id = "ptab-" + idx;
      btn.innerHTML =
        '<span class="ptab__flag">' + flagOf(sq.flag) + "</span>" +
        '<span class="ptab__name">' + sq.team + "</span>";
      btn.addEventListener("click", () => { active = idx; paint(); });
      // 키보드 좌우 화살표 탐색
      btn.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          const dir = e.key === "ArrowRight" ? 1 : -1;
          active = (active + dir + SQUADS.length) % SQUADS.length;
          paint();
          tabsRoot.children[active].focus();
        }
      });
      tabsRoot.appendChild(btn);
    });

    paint();
  }

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
  function animateCount(node) {
    if (node.dataset.done) return;
    node.dataset.done = "1";
    const target = parseInt(node.dataset.count, 10);
    if (reduceMotion) { node.textContent = target; return; }
    const dur = 1300;
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

  function fillAndCount(node) {
    node.querySelectorAll(".bar__fill, .cmp__fill").forEach((f) => {
      requestAnimationFrame(() => (f.style.width = f.dataset.w + "%"));
    });
    node.querySelectorAll("[data-count]").forEach(animateCount);
    if (node.dataset.count) animateCount(node);
  }

  // 동적으로 추가된(탭 전환 등) reveal 요소를 즉시 노출 — 짧은 stagger 후 fade-in
  function revealNow(container) {
    const els = container.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach((e) => { e.classList.add("is-in"); fillAndCount(e); });
      return;
    }
    els.forEach((e) => {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        e.classList.add("is-in");
        fillAndCount(e);
      }));
    });
  }

  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach((e) => { e.classList.add("is-in"); fillAndCount(e); });
      return;
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const node = entry.target;
          node.classList.add("is-in");
          fillAndCount(node);
          obs.unobserve(node);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((e) => io.observe(e));
  }

  /* ----------------------------------------------------------
     hero count-up (fires immediately, not scroll-gated)
     ---------------------------------------------------------- */
  function countUp() {
    document.querySelectorAll(".hero [data-count]").forEach(animateCount);
    // pred-intro pick count-up fires when scrolled into view
    const pick = document.querySelector(".pred-intro [data-count]");
    if (pick) {
      if (reduceMotion || !("IntersectionObserver" in window)) { animateCount(pick); return; }
      const io = new IntersectionObserver((es, obs) => {
        es.forEach((e) => { if (e.isIntersecting) { animateCount(pick); obs.disconnect(); } });
      }, { threshold: 0.5 });
      io.observe(pick);
    }
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
    // tournament (primary)
    renderFacts();
    renderHosts();
    renderCities();
    renderPlayers();
    // prediction (secondary)
    renderOdds();
    renderCompare();
    renderKickoff();
    renderGroups();
    renderBracket();
    renderScenario();
    // interactions
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
