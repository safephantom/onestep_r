/* 단원 O: filter() — 행 고르기 */
RS.units.push({
  id: 'o',
  title: 'dplyr ②: filter()로 행 고르기',
  short: '== T, == "black", %in%, >, &, !( ), = 를 쓰면 생기는 일',
  desc: 'wk4_dplyr.R 75–92행. filter()는 **가로(행)**를 고르는 함수: 조건이 TRUE인 행만 남겨요.',
  setup: 'birds',
  lessons: [
    {
      id: 'o-basic',
      title: 'filter(데이터, 조건): TRUE인 행만',
      src: 'wk4_dplyr.R 77행 `filter(birds, is.sparrow==T)`',
      key: 'filter는 조건을 **행마다** 계산해서 TRUE인 행만 남긴다. 열은 그대로다.',
      body: [
        { code: `filter(birds, is.sparrow == T)` },
        '속에서 일어나는 일: `is.sparrow == T`를 8행 각각에 계산 → FALSE FALSE FALSE TRUE TRUE TRUE TRUE TRUE → TRUE인 4–8행만 남김. is.sparrow가 이미 TRUE/FALSE라서 `filter(birds, is.sparrow)`라고만 써도 같아요.',
        { note: 'Python과 비교', kind: 'py', t: 'pandas의 `birds[birds["is.sparrow"] == True]`와 같아요. dplyr에서는 열 이름을 바로 쓰고, 결과는 **새 표**예요 (원본 그대로 — N단원).' },
      ],
      quiz: [
        { type: 'mcq', q: '`filter(birds, is.sparrow == T)`의 결과 크기는?', opts: [
          { t: '5행 × 4열', ok: true, why: 'crow 3 + oriole 2, 열은 그대로.' },
          { t: '5행 × 1열', why: 'filter는 열을 건드리지 않아요.' },
          { t: '3행 × 4열', why: 'is.sparrow가 FALSE인 owl이 3행이에요.' },
        ] },
        { type: 'mcq', q: '다음 중 **다른 결과**가 나오는 것은?', opts: [
          { t: '`filter(birds, is.sparrow == TRUE)`', why: 'T = TRUE, 같아요.' },
          { t: '`filter(birds, is.sparrow)`', why: '이미 논리 열이라 같아요.' },
          { t: '`filter(birds, is.sparrow == "TRUE")`', why: '의외로 **같은** 결과예요. 논리값과 글자를 비교하면 R이 논리값을 글자 "TRUE"/"FALSE"로 바꿔서 비교하거든요. 그래도 논리 열은 T/TRUE와 비교하는 게 정석이에요.' },
          { t: '`filter(birds, !is.sparrow)`', ok: true, why: '`!`로 뒤집어서 owl 3행만 남아요.' },
        ] },
      ],
    },
    {
      id: 'o-eq',
      title: '글자 조건: color == "black" (그리고 = 실수)',
      src: 'wk4_dplyr.R 79–80행 `# == evaluate`',
      key: '글자 값과 비교할 때는 **따옴표**와 **`==`** 두 가지를 모두 챙긴다.',
      body: [
        { code: `filter(birds, color == "black")` },
        '가장 흔한 실수 두 가지:',
        { code: `filter(birds, color = "black")`, expect: 'error', cap: '① = 한 개 → dplyr가 "Did you mean `color == \\"black\\"`?"라고 알려 줌' },
        { code: `filter(birds, color == black)`, expect: 'error', cap: '② 따옴표 없음 → black이라는 객체를 찾음' },
      ],
      quiz: [
        { type: 'predict', q: '결과 행 수는?', code: `filter(birds, bird == "owl")`, opts: [
          { t: '3', ok: true, why: 'owl 세 마리.' },
          { t: '1', why: '같은 값의 행은 모두 남아요.' },
          { t: '0', why: '"owl"이 정확히 있어요.' },
        ] },
        { type: 'mcq', q: '`filter(birds, color = "black")`의 에러 메시지가 알려 주는 해결책은?', opts: [
          { t: '`color == "black"`으로 고쳐라', ok: true, why: 'dplyr가 직접 제안해 줘요.' },
          { t: 'color 열을 먼저 만들어라', why: 'color 열은 있어요.' },
          { t: '따옴표를 지워라', why: '따옴표는 필요해요.' },
        ] },
      ],
    },
    {
      id: 'o-in',
      title: '여러 값 중 하나: %in%',
      src: 'wk4_dplyr.R 82–84행',
      key: '`filter(birds, bird %in% c("oriole", "owl"))` → bird가 oriole **또는** owl인 행.',
      body: [
        { code: `filter(birds, bird %in% c("oriole","owl"))` },
        '결과가 원래 행 순서(owl 먼저)대로 나오는 것도 보세요. `c()` 안의 순서는 결과 순서와 무관해요 — filter는 행을 **고르기만** 하고 정렬하지 않아요 (정렬은 arrange, R단원).',
        '이 패턴은 wk4 practice plot에 그대로 쓰여요: 20명 중 5명(C21, CSY, E63, TFH, XSJ)만 고르기.',
      ],
      quiz: [
        { type: 'write', q: 'sibmerger에서 참가자(subject)가 **C21, CSY, E63, TFH, XSJ**인 행만 남긴 결과를 출력하세요.', setup: 'sibmerger', checks: [
          { r: 'ans_df()', m: '결과가 표로 출력되어야 해요 (filter 결과를 마지막 줄에).' },
          { r: 'setequal(unique(A()$subject), c("C21","CSY","E63","TFH","XSJ"))', m: 'subject가 그 다섯 명이어야 해요 (`%in% c(...)`).' },
          { r: 'ans_nrow(sum(sibmerger$subject %in% c("C21","CSY","E63","TFH","XSJ")))', m: '다섯 명의 행이 빠짐없이 남아야 해요.' },
        ], sol: `filter(sibmerger, subject %in% c("C21", "CSY", "E63", "TFH", "XSJ"))`, tips: '열 이름은 소문자 `subject` (M단원). 값들은 따옴표로 감싼 글자.' },
        { type: 'mcq', q: '`filter(birds, bird %in% c("owl", "oriole"))`와 `filter(birds, bird %in% c("oriole", "owl"))`의 결과는?', opts: [
          { t: '같다 (행 순서도 같다)', ok: true, why: 'filter는 원래 순서를 유지해요.' },
          { t: '행 순서가 다르다', why: 'c() 안의 순서는 결과 순서와 무관해요.' },
        ] },
      ],
    },
    {
      id: 'o-num',
      title: '숫자 조건: >, >=',
      src: 'wk4_dplyr.R 86행 `filter(birds, inches > 11.5)`',
      key: '`inches > 11.5`는 11.5를 **포함하지 않는다**. 포함하려면 `>=`.',
      body: [
        { compare: [
          { label: '`inches > 11.5`', code: `filter(birds, inches > 11.5)` },
          { label: '`inches >= 11.5`', code: `filter(birds, inches >= 11.5)` },
        ] },
        'oriole 한 마리(11.5)가 경계에 있어서 결과가 한 행 달라요. wk4 mpg 연습의 주석은 "greater than 5"인데 코드는 `diff >= 5`예요 — 이런 **경계 차이**가 과제에서 점수를 가르는 곳이에요 (R단원 연습에서 다시).',
      ],
      quiz: [
        { type: 'predict', q: '결과 행 수는?', code: `filter(birds, inches < 8)`, opts: [
          { t: '1', ok: true, why: '7인치 crow 한 마리 (8은 포함 안 됨).' },
          { t: '2', why: '8은 8보다 작지 않아요.' },
          { t: '0', why: '7이 있어요.' },
        ] },
      ],
    },
    {
      id: 'o-and',
      title: '두 조건 모두: &',
      src: 'wk4_dplyr.R 88행 `filter(birds, inches > 11.5 & bird=="owl")`',
      key: '`조건1 & 조건2` → 둘 다 TRUE인 행만.',
      body: [
        { code: `filter(birds, inches > 11.5 & bird=="owl")` },
        '11.5보다 큰 새는 owl 3 + oriole 1인데, 그중 owl인 것만 → 3행. (filter 안에서 쉼표로 조건을 나열해도 &와 같아요: `filter(birds, inches > 11.5, bird == "owl")`.)',
      ],
      quiz: [
        { type: 'predict', q: '결과 행 수는?', code: `filter(birds, color == "black" & inches > 8)`, opts: [
          { t: '3', ok: true, why: 'black이면서 8보다 큰: 8.5, 11.5, 12.' },
          { t: '5', why: 'black은 5마리지만 7, 8인치는 빠져요.' },
          { t: '6', why: '두 조건을 **모두** 만족해야 해요.' },
        ] },
        { type: 'write', q: 'mpg에서 **suv이면서 hwy가 20 이상**인 차만 남긴 결과를 출력하세요.', setup: [], checks: [
          { r: 'ans_df()', m: '결과 표를 출력하세요.' },
          { r: 'ans_equals(filter(mpg, class == "suv" & hwy >= 20), names = TRUE)', m: 'class == "suv" **그리고** hwy >= 20 (20 포함)인 행만.' },
        ], sol: `filter(mpg, class == "suv" & hwy >= 20)` },
      ],
    },
    {
      id: 'o-not',
      title: '빼고 남기기: !( )',
      src: 'wk4_dplyr.R 91–92행 "to remove certain levels"',
      key: '`!(조건)` → 조건에 맞는 행을 **빼고** 나머지를 남긴다.',
      body: [
        { code: `filter(birds, !(bird=="owl"))` },
        '`bird != "owl"`과 같은 결과예요. 괄호 형태는 조건이 복잡할 때(`!(class == "pickup" & diff >= 5)`) 특히 유용해요: "이 **조합**만 빼라".',
        'wk4 연습: `filter(!(model == "a4 quattro"))` → a4 quattro 8대를 빼고 226대.',
      ],
      quiz: [
        { type: 'mcq', q: '`filter(birds, !(bird == "owl"))`와 같은 결과는?', opts: [
          { t: '`filter(birds, bird != "owl")`', ok: true, why: '같지 않다 = 같다의 부정.' },
          { t: '`filter(birds, bird == "!owl")`', why: '"!owl"이라는 글자와 비교하게 돼요 (0행).' },
          { t: '`select(birds, -owl)`', why: 'select는 열을 다뤄요.' },
        ] },
        { type: 'predict', q: '결과 행 수는? (mpg는 234행, a4 quattro는 8행)', setup: [], code: `nrow(filter(mpg, !(model == "a4 quattro")))`, opts: [
          { t: '226', ok: true, why: '234 − 8.' },
          { t: '8', why: '그건 a4 quattro만 남겼을 때.' },
          { t: '234', why: '8행이 빠져요.' },
        ] },
      ],
    },
  ],
});
