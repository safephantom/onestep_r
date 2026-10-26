/* 단원 R: summarise()와 group_by() */
RS.units.push({
  id: 'r',
  title: 'dplyr ④: summarise()와 group_by()',
  short: '요약 → 1행, 그룹별 요약, n(), 순서대로 계산, arrange, 두 변수 그룹, group_by + mutate, sibimit_means 해부',
  desc: 'wk4_dplyr.R 147–200행 "Now add in the magic of group_by()!"와 wk3_Rproject.R 39–49행의 sibimit_means.',
  setup: 'birds',
  lessons: [
    {
      id: 'r-summ',
      title: 'summarise(): 표 전체를 한 줄로 요약',
      src: 'wk4_dplyr.R 149–152행',
      key: '`summarise(birds, size = mean(inches))` → 8행이 **1행**으로 줄어든다. 결과에는 **만든 요약 열만** 남는다.',
      body: [
        { code: `birds %>%
  summarise(size = mean(inches))` },
        'mutate와의 차이가 핵심이에요:',
        { table: { head: ['', 'mutate(size = mean(inches))', 'summarise(size = mean(inches))'], rows: [
          ['행 수', '그대로 8 (모든 행에 같은 평균값)', '1'],
          ['열', '기존 열 + size', 'size만'],
        ] } },
        'summarise 안에는 벡터를 **값 하나로** 줄이는 함수(mean, n 등)를 써요 (B단원 mean vs sqrt).',
      ],
      quiz: [
        { type: 'mcq', q: '`summarise(birds, size = mean(inches))`의 결과 크기는?', opts: [
          { t: '1행 × 1열', ok: true, why: '요약값 하나.' },
          { t: '8행 × 5열', why: '그건 mutate.' },
          { t: '3행 × 2열', why: 'group_by가 있어야 그룹별로 나뉘어요.' },
        ] },
        { type: 'tf', q: '`summarise()`와 `summarize()`는 같은 함수다.', ans: true, why: '영국식/미국식 철자. 수업 코드도 둘을 섞어 써요 (colour/color처럼).' },
      ],
    },
    {
      id: 'r-group',
      title: 'group_by() + summarise(): 그룹마다 한 줄',
      src: 'wk4_dplyr.R 156–159행 `## "size" is the new column`',
      key: '`group_by(bird)` 다음의 summarise는 **bird의 값마다** 따로 계산한다. 결과 행 수 = 그룹 수. 결과는 그룹 이름의 **알파벳 순**.',
      body: [
        { code: `birds %>%
  group_by(bird) %>%
  summarize(size = mean(inches))` },
        '결과 순서가 crow, oriole, owl(알파벳 순)인 것에 주목하세요. 원래 데이터의 순서(owl 먼저)가 아니에요.',
        { note: 'Python과 비교', kind: 'py', t: 'pandas `birds.groupby("bird").agg(size=("inches", "mean"))`와 같아요.' },
      ],
      quiz: [
        { type: 'mcq', q: '결과에서 oriole의 size는?', opts: [
          { t: '11.75', ok: true, why: '(11.5 + 12) / 2.' },
          { t: '15.125', why: '그건 전체 평균.' },
          { t: '7.83', why: '그건 crow.' },
        ] },
        { type: 'write', q: 'wk4 236–239행: mpg에서 **실린더 수(cyl)별 평균 도시 연비(cty)**를 구하세요. 요약 열 이름은 `new`.', setup: [], checks: [
          { r: 'ans_df()', m: '결과 표를 출력하세요.' },
          { r: 'ans_nrow(4)', m: 'cyl 값은 4, 5, 6, 8 → 4행이어야 해요 (`group_by(cyl)`).' },
          { r: 'ans_equals(mpg %>% group_by(cyl) %>% summarise(new = mean(cty)), names = TRUE)', m: '`summarise(new = mean(cty))` — 열 이름 cyl, new.' },
        ], sol: `mpg %>%
  group_by(cyl) %>%
  summarise(new = mean(cty))` },
      ],
    },
    {
      id: 'r-n',
      title: 'n(): 그룹의 행 개수',
      src: 'wk4_dplyr.R 161–165행 `count = n(), ## the number of observations in the current group`',
      key: '`n()`은 괄호 안에 아무것도 넣지 않는다. 지금 그룹에 **행이 몇 개인지** 센다.',
      body: [
        { code: `birds %>%
  group_by(bird) %>%
  summarize(size = mean(inches),
            count = n())` },
        '평균을 낼 때는 **몇 개로 낸 평균인지**를 함께 보는 습관이 중요해요 (Politzer-Ahles Fig. 2 "Different N": 표본 수가 적으면 오차 막대가 넓어져요).',
      ],
      quiz: [
        { type: 'predict', q: 'count 열의 값은? (crow, oriole, owl 순)', code: `birds %>%
  group_by(bird) %>%
  summarize(count = n())`, opts: [
          { t: '3, 2, 3', ok: true, why: 'crow 3, oriole 2, owl 3.' },
          { t: '8, 8, 8', why: '그룹마다 따로 세요.' },
          { t: '3, 3, 2', why: '알파벳 순이라 oriole이 두 번째예요.' },
        ] },
        { type: 'predict', q: '`n(inches)`처럼 괄호 안에 열을 넣으면?', code: `birds %>%
  group_by(bird) %>%
  summarize(count = n(inches))`, expect: 'error', opts: [
          { t: '같은 결과', why: 'n()은 인자를 받지 않아요.' },
          { t: '에러 (unused argument)', ok: true, why: '`n()`은 빈 괄호로 써요.' },
        ] },
      ],
    },
    {
      id: 'r-seq',
      title: 'summarise 안에서도 차례로 계산 (그리고 요약 뒤 mutate)',
      src: 'wk4_dplyr.R 161–174행 "internal ordering between variables"',
      key: 'summarise 안에서도 앞에서 만든 요약값(size, count)을 뒤에서 쓸 수 있다. 요약 **뒤에** mutate를 붙여도 같은 결과.',
      body: [
        { compare: [
          { label: 'summarise 안에서', code: `birds %>%
  group_by(bird) %>%
  summarize(size = mean(inches),
            count = n(),
            X = size/count)` },
          { label: 'summarise 뒤 mutate로', code: `birds %>%
  group_by(bird) %>%
  summarize(size = mean(inches),
            count = n()) %>%
  mutate(X = size/count)` },
        ] },
        '두 결과는 같아요. 오른쪽의 mutate는 **요약된 3행짜리 표**에 열을 더하는 거예요.',
      ],
      quiz: [
        { type: 'mcq', q: '오른쪽 코드의 mutate가 받는 표는?', opts: [
          { t: 'summarise 결과 (3행: bird, size, count)', ok: true, why: '파이프의 앞 단계 결과.' },
          { t: 'birds 원본 (8행)', why: '앞 단계들을 거친 결과가 들어와요.' },
        ] },
      ],
    },
    {
      id: 'r-arrange',
      title: 'arrange(): 정렬',
      src: 'wk4_dplyr.R 176–180행',
      key: '`arrange(size)` → size가 **작은 것부터**(오름차순) 행을 정렬한다.',
      body: [
        { code: `birds %>%
  group_by(bird) %>%
  summarize(size = mean(inches),
            count = n()) %>%
  arrange(size)` },
        '여기서는 알파벳 순과 크기 순이 우연히 같아요(crow < oriole < owl). `arrange(count)`로 바꿔 보면 차이가 보여요.',
      ],
      quiz: [
        { type: 'predict', q: '첫 행의 bird는?', code: `birds %>%
  arrange(inches)`, opts: [
          { t: 'crow (7인치)', ok: true, why: '가장 작은 값이 맨 위.' },
          { t: 'owl', why: '오름차순이라 큰 owl은 아래로.' },
          { t: 'oriole', why: 'oriole(11.5)보다 작은 crow가 있어요.' },
        ] },
      ],
    },
    {
      id: 'r-group2',
      title: '두 변수로 그룹 짓기와 "# Groups:" 줄',
      src: 'wk4_dplyr.R 183–196행',
      key: '`group_by(bird, color)` → 두 변수의 **조합**마다 한 행. 요약 뒤에도 **앞 변수(bird)로 그룹이 남아** "# Groups: bird [3]"이 보이고, 안내 메시지가 뜬다.',
      body: [
        { code: `birds %>%
  group_by(bird, color) %>%
  summarize(size = mean(inches),
            count = n())` },
        '메시지는 에러가 아니에요: "요약은 bird와 color 조합별로 했고, 결과는 여전히 bird로 그룹 지어져 있다"는 안내예요. 이 그룹이 남아 있으면 **다음 단계의 mutate·summarise가 그룹별로** 계산돼요. 이 수업 단계에서는 "이런 메시지가 뜬다"는 것만 알면 돼요.',
        { code: `birds %>%
  group_by(is.sparrow, color) %>%
  summarize(size = mean(inches),
            count = n())`, cap: 'wk4 193–196행: 참새목 여부 × 색' },
      ],
      quiz: [
        { type: 'mcq', q: '`group_by(is.sparrow)`만으로 summarize하면 결과는 몇 행?', opts: [
          { t: '2 (FALSE, TRUE)', ok: true, why: 'is.sparrow의 값 두 가지.' },
          { t: '3', why: '새 종류가 아니라 참새목 여부로 나눠요.' },
          { t: '8', why: '요약이라 줄어요.' },
        ] },
        { type: 'mcq', q: '"`summarise()` has regrouped the output" 메시지가 떴다. 어떻게 해야 할까?', opts: [
          { t: '그대로 두어도 된다 (안내일 뿐)', ok: true, why: '결과는 정상이에요. 결과 위의 "# Groups:" 줄이 남은 그룹을 알려 줘요.' },
          { t: '에러이므로 코드를 고쳐야 한다', why: 'message예요.' },
          { t: 'group_by를 지워야 한다', why: '그러면 그룹별 요약이 안 돼요.' },
        ] },
      ],
    },
    {
      id: 'r-groupmutate',
      title: 'group_by + mutate: 행은 그대로, 그룹 평균을 각 행에',
      src: 'wk4_dplyr.R 198–200행',
      key: 'group_by 다음에 **mutate**를 쓰면 행이 줄지 않는다. 각 행에 **자기 그룹의** 평균이 들어간다.',
      body: [
        { code: `birds %>%
  group_by(bird) %>%
  mutate(size = mean(inches))` },
        'owl 세 행에는 모두 owl 평균 24.7, crow 세 행에는 7.83. 이렇게 하면 "각 새가 자기 종의 평균보다 큰가?" 같은 계산을 이어서 할 수 있어요 (`inches - size`).',
      ],
      quiz: [
        { type: 'mcq', q: '결과의 행 수는?', opts: [
          { t: '8', ok: true, why: 'mutate는 행을 유지해요.' },
          { t: '3', why: '그건 summarise.' },
        ] },
        { type: 'mcq', q: '4번째 행(crow, 7인치)의 size 값은?', opts: [
          { t: '7.83 (crow 평균)', ok: true, why: '자기 그룹의 평균.' },
          { t: '15.125 (전체 평균)', why: 'group_by 때문에 그룹별 평균이에요.' },
          { t: '7', why: '자기 값이 아니라 그룹 평균.' },
        ] },
      ],
    },
    {
      id: 'r-sibimit',
      title: 'sibimit_means 해부 (wk3의 "Just run this code")',
      src: 'wk3_Rproject.R 39–49행',
      key: '토큰 3,223행 → **참가자 × 성별 × 조음위치 × 과제 × 합류여부** 조합마다 COGm 평균 1행. Practice 3·4의 데이터가 이것이다.',
      setup: 'sibimit',
      body: [
        { code: `sibimit_means <- sibimit %>%
  #filter(Gender == "F") %>%
  group_by(Subject, Gender, Place, Task, MergerStatus) %>%
  summarise(COGm = mean(COGm))

head(sibimit_means)` },
        '한 줄씩:',
        '1. `sibimit_means <-`: 결과에 이름 붙이기\n2. `sibimit %>%`: 토큰 데이터에서 시작\n3. `#filter(...)`: 꺼 둔 단계 (A단원)\n4. `group_by(5개 변수)`: 조합별로 묶기. Gender·MergerStatus는 참가자마다 하나라서 사실상 **참가자 × Place × Task**\n5. `summarise(COGm = mean(COGm))`: 평균을 내서 **같은 이름 COGm**으로 저장 — 오른쪽 COGm은 원래 토큰 값들, 왼쪽은 새 요약 열',
        '메시지 "`summarise()` has regrouped the output"과 "# Groups: Subject, Gender, Place, Task"가 보이죠 (R단원 두 변수 그룹 레슨). 그림 그리기에는 영향이 없어요.',
        { code: `glimpse(sibimit_means)`, setup: ['sibimit', 'sibimit_means'], cap: 'wk3 49행: "how does this compare to glimpse()?"' },
      ],
      quiz: [
        { type: 'mcq', q: '`summarise(COGm = mean(COGm))`에서 두 COGm의 관계는?', opts: [
          { t: '오른쪽은 원래 토큰 값들, 왼쪽은 그 평균을 담을 새 열 이름 (같은 이름을 재사용)', ok: true, why: '요약 결과에는 원래 COGm이 없으니 이름이 겹쳐도 괜찮아요.' },
          { t: '같은 열이라 아무 일도 안 일어난다', why: '평균을 내서 새 열을 만들어요.' },
          { t: '에러', why: '정상이에요.' },
        ] },
        { type: 'mcq', q: 'head(sibimit_means)와 glimpse(sibimit_means)의 차이로 맞는 것은?', setup: ['sibimit', 'sibimit_means'], opts: [
          { t: 'head는 앞 6행을 표로, glimpse는 열마다 한 줄로 모든 열과 전체 행 수를 보여 준다', ok: true, why: 'C단원 복습.' },
          { t: 'glimpse는 그룹 정보를 지운다', why: '보여 주는 방식만 달라요.' },
        ] },
        { type: 'mcq', q: '`#filter(Gender == "F") %>%`를 켜면 sibimit_means의 행 수는?', opts: [
          { t: '줄어든다 (여성 참가자의 조합만)', ok: true, why: '요약 전에 행을 거르니까요.' },
          { t: '그대로', why: '남성 참가자가 빠져요.' },
          { t: '늘어난다', why: 'filter는 행을 줄이기만 해요.' },
        ] },
      ],
    },
  ],
});
