/* 단원 W: wk5 tidyr (pivot_longer, separate, pivot_wider) + left_join */
RS.units.push({
  id: 'w',
  title: 'tidyr: 표 모양 바꾸기와 left_join (wk5)',
  short: 'pivot_longer, separate, pivot_wider, geom_col, wk5 연습 4문제, left_join',
  desc: 'wk5_1_tidyr.R과 그 Exercise key. 같은 정보라도 **표 모양**에 따라 계산이 쉬워지기도, 막히기도 해요. 넓은 표 ↔ 긴 표를 오가는 세 함수와, 두 표를 열쇠 열로 붙이는 `left_join()`을 배워요. 이 단원의 함수는 HW1(Z단원)에 그대로 다시 나와요.',
  lessons: [
    {
      id: 'w-tidy',
      title: '넓은 표와 긴 표: 열 이름에 정보가 숨어 있을 때',
      src: 'wk5_1_tidyr.R 11–15행 `fruit <- tibble(...)`',
      key: '`apples_bought` 같은 열 이름에는 **과일(apples)과 행동(bought) 두 가지 정보**가 붙어 있다. 이런 정보를 값으로 꺼내 "한 행 = 관측 하나"로 만드는 게 tidyr의 일이다.',
      body: [
        { code: `(fruit <- tibble(sociolinguist = c("Bill", "Gillian"),
                 apples_bought = c(5, 3),
                 apples_ate = c(1, 2),
                 oranges_bought = c(5, 4),
                 oranges_ate = c(3, 3)))` },
        '사람 2명 × 숫자 4개 = 값 8개가 **넓게** 펼쳐져 있어요. 이대로는 "과일별로 몇 개 남았나(산 개수 − 먹은 개수)"를 계산하기 어려워요. 과일 종류가 **열 이름 속**에 있어서 group_by()로 묶을 수가 없거든요.',
        { table: { head: ['모양', '한 행', '언제 편한가'], rows: [
          ['넓은 표 (wide)', '사람 한 명', '사람끼리 한눈에 비교할 때'],
          ['긴 표 (long)', '사람 × 과일 × 행동 하나', 'group_by, ggplot의 aes에 변수로 쓸 때'],
        ] } },
        { note: '수업 출처', kind: 'src', t: 'wk5 파일 첫머리: tidyr의 `pivot_longer`, `pivot_wider`가 예전 함수 `spread`, `gather`(reshape2), `melt`, `cast`(reshape)를 대신한다고 적혀 있어요. 인터넷 예제에서 옛 함수를 보면 같은 일을 하는 거예요.' },
      ],
      quiz: [
        { type: 'mcq', q: '`oranges_ate` 열 이름에 들어 있는 정보는?', opts: [
          { t: '과일 종류와 행동, 두 가지', ok: true, why: 'oranges(과일) + ate(행동). 그래서 나중에 이 이름을 둘로 쪼개요 (separate).' },
          { t: '사람 이름', why: '사람은 sociolinguist 열의 값이에요.' },
          { t: '먹은 개수', why: '개수는 그 열의 **값**(3, 3)이에요. 이름에는 "무엇을 셌는지"가 들어 있어요.' },
        ] },
        { type: 'tf', q: 'fruit 표에서 "과일별 남은 개수"를 group_by(과일)로 바로 계산할 수 있다.', ans: false, why: '과일 종류가 열 이름 속에 있어서 묶을 열이 없어요. 먼저 긴 표로 바꿔야 해요.' },
      ],
    },
    {
      id: 'w-longer',
      title: 'pivot_longer(): 열 여러 개 → 이름 열 + 값 열',
      src: 'wk5_1_tidyr.R 18–21행',
      key: '`pivot_longer(바꿀 열들, names_to = "새 이름 열", values_to = "새 값 열")`. 고른 열의 **이름**은 names_to 열로, **값**은 values_to 열로 내려간다.',
      setup: 'fruit',
      body: [
        { code: `(fruit_longer <- fruit %>%
    pivot_longer(apples_bought:oranges_ate,
                 names_to = "fruit_behavior",
                 values_to = "number"))` },
        { table: { head: ['인자', '뜻'], rows: [
          ['`apples_bought:oranges_ate`', '바꿀 열들 (`:`는 select()처럼 "여기부터 저기까지", N단원)'],
          ['`names_to = "fruit_behavior"`', '원래 **열 이름**이 들어갈 새 열의 이름 (따옴표!)'],
          ['`values_to = "number"`', '원래 **값**이 들어갈 새 열의 이름'],
        ] } },
        '행 수 계산: 원래 2행 × 바꾼 열 4개 = **8행**. sociolinguist처럼 고르지 않은 열은 그대로 반복돼요.',
        { note: '따옴표가 필요한 이유', kind: 'warn', t: '`names_to`, `values_to`는 **아직 없는** 열의 이름을 새로 지어 주는 거라 글자(따옴표)로 써요. 반대로 바꿀 열(`apples_bought:oranges_ate`)은 이미 있는 열이라 따옴표 없이 써요 (B단원 "따옴표가 있으면 값, 없으면 이름").' },
      ],
      quiz: [
        { type: 'predict', q: '결과는 몇 행일까요?', code: `fruit %>%
  pivot_longer(apples_bought:apples_ate,
               names_to = "fruit_behavior",
               values_to = "number")`, opts: [
          { t: '4행', ok: true, why: '2행 × 고른 열 2개. oranges_ 두 열은 그대로 옆에 남아요.' },
          { t: '8행', why: '이번에는 apples 두 열만 골랐어요.' },
          { t: '2행', why: '고른 열마다 행이 늘어나요.' },
        ] },
        { type: 'fill', q: '원래 열 이름이 `fruit_behavior` 열로, 값이 `number` 열로 가도록 채우세요.', code: 'pivot_longer(apples_bought:oranges_ate, ▢ = "fruit_behavior", ▢ = "number")', ans: [['names_to'], ['values_to']], why: '이름 → names_to, 값 → values_to.', full: `fruit %>%
  pivot_longer(apples_bought:oranges_ate, names_to = "fruit_behavior", values_to = "number")` },
      ],
    },
    {
      id: 'w-separate',
      title: 'separate(): 한 열을 둘로 쪼개기',
      src: 'wk5_1_tidyr.R 24–28행 "separate() will split values wherever it sees a non-alphanumeric character"',
      key: '`separate(열, into = c("새 열1", "새 열2"))`. 글자·숫자가 아닌 기호(`_`, `.` 등)가 나오는 곳에서 자른다.',
      setup: ['fruit', 'fruit_longer'],
      body: [
        { code: `(fruit_separate <- fruit_longer %>%
    separate(fruit_behavior,
             into = c("fruit", "behavior")))` },
        '`"apples_bought"`가 `_`에서 잘려 `fruit = "apples"`, `behavior = "bought"`가 됐어요. 원래 열(fruit_behavior)은 사라지고 새 두 열이 그 자리에 들어가요.',
        '연습 데이터의 열 이름 `oh.caught`처럼 `.`이 있어도 똑같이 잘려요. wk5 Exercise key의 `separate(vowel.word, into = c("vowel","word"))`가 그 예예요.',
        { note: '조각 수가 안 맞으면', kind: 'warn', t: '`into`에 이름을 2개 줬는데 값이 3조각(`a_b_c`)이면 남는 조각을 버리고 경고(`Expected 2 pieces`)를 내요. 반대로 조각이 모자라면 빈자리는 NA. 경고가 나오면 into의 개수를 확인하세요.' },
      ],
      quiz: [
        { type: 'predict', q: '결과의 `vowel` 열 첫 값은?', setup: [], code: `tibble(vowel.word = c("oh.caught", "o.cot")) %>%
  separate(vowel.word, into = c("vowel", "word"))`, opts: [
          { t: '`oh`', ok: true, why: '`.`에서 잘려 앞 조각 oh가 vowel, 뒤 조각 caught가 word.' },
          { t: '`oh.caught`', why: 'separate가 잘라서 두 열로 나눠요.' },
          { t: '`caught`', why: '앞 조각이 into의 첫 이름(vowel)으로 가요.' },
        ] },
        { type: 'mcq', q: '`separate(speaker_ID, into = c("spkr", "age", "gender"))`가 `"spkrA_old_man"`을 자른 결과는?', opts: [
          { t: 'spkr = "spkrA", age = "old", gender = "man"', ok: true, why: '`_` 두 곳에서 잘려 세 조각.' },
          { t: 'spkr = "spkrA_old", gender = "man"', why: '기호가 나오는 곳마다 잘라요.' },
          { t: '에러: 조각이 3개라서', why: 'into에 이름을 3개 줬으니 딱 맞아요.' },
        ] },
      ],
    },
    {
      id: 'w-wider',
      title: 'pivot_wider(): 이름 열 + 값 열 → 열 여러 개',
      src: 'wk5_1_tidyr.R 32–35행',
      key: '`pivot_wider(names_from = 열, values_from = 열)`은 pivot_longer의 반대. names_from 열의 **값들이 새 열 이름**이 되고, values_from 열의 값이 그 칸을 채운다.',
      setup: ['fruit', 'fruit_longer', 'fruit_separate'],
      body: [
        { code: `fruit_separate %>%
  pivot_wider(names_from = behavior,
              values_from = number) %>%
  mutate(surplus = bought - ate)` },
        'behavior 열의 값(bought, ate)이 **열 이름**이 됐어요. 이제 같은 행에 bought와 ate가 나란히 있으니 Q단원의 `mutate()`로 빼기만 하면 남은 개수(surplus)예요.',
        '행 수: 나머지 열(sociolinguist, fruit)의 조합마다 한 행 → Bill·Gillian × apples·oranges = **4행**.',
        { note: '이 두 인자는 따옴표 없이', kind: 'tip', t: 'pivot_wider의 `names_from`, `values_from`은 **이미 있는** 열을 가리켜서 따옴표 없이 써요. pivot_longer의 `names_to`, `values_to`(새로 짓는 이름, 따옴표)와 반대예요.' },
      ],
      quiz: [
        { type: 'mcq', q: '`pivot_wider(names_from = behavior, values_from = number)`에서 새로 생기는 열 이름은?', opts: [
          { t: '`bought`, `ate`', ok: true, why: 'behavior 열에 들어 있던 **값들**이 열 이름이 돼요.' },
          { t: '`behavior`, `number`', why: '이 두 열은 오히려 사라져요.' },
          { t: '`fruit`, `behavior`', why: 'fruit 열은 그대로 남는 열이에요.' },
        ] },
        { type: 'fill', q: 'surplus(산 것 − 먹은 것)를 계산하려면 behavior의 값들이 열이 되어야 해요. 빈칸을 채우세요.', code: 'pivot_wider(names_from = ▢, values_from = ▢)', ans: [['behavior'], ['number']], why: '열 이름이 될 값이 있는 열 → names_from, 칸을 채울 값 → values_from.', full: `fruit_separate %>%
  pivot_wider(names_from = behavior, values_from = number) %>%
  mutate(surplus = bought - ate)` },
      ],
    },
    {
      id: 'w-col',
      title: 'geom_col() = geom_bar(stat = "identity")',
      src: 'wk5_1_tidyr.R 31–56행 (fruit 막대그래프 두 가지)',
      key: '값이 **이미 계산된** 표로 막대를 그릴 때는 `geom_col()`. `geom_bar()`는 기본이 "행 개수 세기"(J단원)라서 `stat = "identity"`를 붙여야 같은 그림이 된다.',
      setup: ['fruit', 'fruit_longer', 'fruit_separate'],
      body: [
        { compare: [
          { label: 'geom_bar(stat = "identity")', code: `(fruit_wider <- fruit_separate %>%
    pivot_wider(names_from = behavior, values_from = number) %>%
    mutate(surplus = bought - ate)) %>%
  ggplot(aes(fruit, surplus)) +
  geom_bar(stat = "identity", position = "dodge", aes(fill = fruit)) +
  facet_wrap(~sociolinguist) +
  ggtitle("Sociolinguists' fruit surpluses")` },
          { label: 'geom_col()', code: `(fruit_wider <- fruit_separate %>%
    pivot_wider(names_from = behavior, values_from = number) %>%
    mutate(surplus = bought - ate)) %>%
  ggplot(aes(fruit, surplus)) +
  geom_col(position = "dodge", aes(fill = fruit)) +
  facet_wrap(~sociolinguist) +
  ggtitle("Sociolinguists' fruit surpluses")` },
        ] },
        '두 그림이 똑같아요. 수업 주석 그대로: geom_col()의 기본 stat은 identity(값 그대로), geom_bar()의 기본 stat은 count(개수 세기).',
        { note: '괄호로 감싼 할당 + 파이프', kind: 'tip', t: '`(fruit_wider <- … ) %>% ggplot(…)`은 B단원의 "괄호로 감싸면 할당하면서 그 값을 내놓기"를 쓴 거예요. 괄호 안에서 fruit_wider를 저장하고, 그 결과를 바로 ggplot으로 넘겨요. 표도 남기고 그림도 그리는 한 줄짜리 요령이에요.' },
      ],
      quiz: [
        { type: 'mcq', q: 'surplus처럼 **이미 계산한 값**을 막대 높이로 쓰려면?', opts: [
          { t: '`geom_col()`', ok: true, why: '값 그대로(identity)가 기본이에요.' },
          { t: '`geom_bar()` (인자 없이)', why: 'geom_bar는 기본으로 행 수를 세서, y에 surplus를 주면 에러가 나요.' },
          { t: '`geom_histogram()`', why: '히스토그램은 연속 변수를 구간으로 나눠 세요.' },
        ] },
        { type: 'tf', q: '`geom_bar(stat = "identity")`와 `geom_col()`은 같은 그림을 그린다.', ans: true, why: '수업 파일이 두 버전을 나란히 보여 주는 이유예요.' },
      ],
    },
    {
      id: 'w-exdata',
      title: 'wk5 연습 데이터: 시작·끝 시각이 행에, 단어가 열에',
      src: 'wk5_1_tidyr.R Exercise, QuantAnalysis_wk5_data.csv',
      key: '한 행 = 화자 한 명의 **시작(start) 또는 끝(end)** 시각. 단어 4개(oh.caught, oh.bought, o.cot, o.bot)가 열로 펼쳐져 있다. 길이(끝 − 시작)를 구하려면 start와 end가 **같은 행**에 있어야 한다.',
      body: [
        { code: `data <- read_csv("QuantAnalysis_data/QuantAnalysis_wk5_data.csv")
data` },
        { table: { head: ['열', '뜻'], rows: [
          ['`speaker_ID`', '화자_나이_성별이 `_`로 붙은 이름 (예: spkrA_old_man) — 나중에 separate로 쪼개요'],
          ['`time_point`', 'start(시작) 또는 end(끝)'],
          ['`oh.caught` … `o.bot`', '모음 부류.단어 — oh 부류(caught, bought), o 부류(cot, bot)의 시각(초)'],
        ] } },
        '수업 주석 그대로 "the data format may stand in your way" — 지금 모양으로는 단어 길이를 바로 뺄 수 없어요. 그래서 문제 1은 **길게(pivot_longer) → 다시 넓게(pivot_wider)** 두 번 모양을 바꿔요.',
        { note: 'Exercise key의 파일 이름', kind: 'warn', t: 'Exercise key 첫 줄은 `QuantAnalysis_wk6_data.csv`를 읽는데, 실제 파일 이름은 `QuantAnalysis_wk5_data.csv`예요. key를 그대로 돌리면 파일이 없다는 에러가 나니 이름을 고쳐 쓰세요.' },
      ],
      quiz: [
        { type: 'mcq', q: '이 데이터에 화자는 몇 명일까요? (16행)', opts: [
          { t: '8명', ok: true, why: '화자마다 start 행과 end 행, 2행씩이에요.' },
          { t: '16명', why: '한 화자가 두 행(start, end)을 차지해요.' },
          { t: '4명', why: '4는 단어 열의 개수예요.' },
        ] },
        { type: 'mcq', q: '"단어 길이 = end − start"를 mutate로 구하려면 먼저 표가 어떤 모양이어야 할까요?', opts: [
          { t: 'start와 end가 각각 열로, 같은 행에 있어야 한다', ok: true, why: 'mutate는 같은 행의 값끼리 계산해요 (Q단원).' },
          { t: '단어 4개가 열로 펼쳐져 있으면 된다', why: '지금 모양이 그거예요. 그런데 start와 end가 서로 다른 행이라 뺄 수 없어요.' },
          { t: '모양은 상관없다', why: '같은 행에 없으면 빼기를 할 수 없어요.' },
        ] },
      ],
    },
    {
      id: 'w-ex1',
      title: 'wk5 문제 1: 화자별·단어별 길이',
      src: 'wk5_1_tidyr.R Problem 1, Exercise key 7–14행',
      key: '길게(단어 열 4개 → vowel.word + time) → 넓게(time_point → start, end) → `mutate(duration = end - start)`.',
      setup: 'wk5',
      body: [
        '단계별로 보면:',
        '1. `pivot_longer(oh.caught:o.bot, names_to = "vowel.word", values_to = "time")` → 16행 × 4단어 = 64행, 시각이 한 열(time)에\n2. `pivot_wider(names_from = time_point, values_from = time)` → start와 end가 열이 되어 32행\n3. `mutate(duration = end - start)`',
        '막히면 [[w-longer|pivot_longer]], [[w-wider|pivot_wider]]로 돌아가 보세요.',
      ],
      quiz: [
        { type: 'write', q: '`data`로 `spkr_word_durations`를 만드세요. 열: speaker_ID, vowel.word, start, end, duration (32행).', given: `data <- read_csv("QuantAnalysis_data/QuantAnalysis_wk5_data.csv")`, checks: [
          { r: 'obj_df("spkr_word_durations")', m: '`spkr_word_durations`라는 표를 만들기' },
          { r: 'nrow(obj("spkr_word_durations")) == 32', m: '32행 (화자 8 × 단어 4)' },
          { r: 'all(c("speaker_ID", "vowel.word", "start", "end", "duration") %in% names(obj("spkr_word_durations")))', m: '열 speaker_ID, vowel.word, start, end, duration' },
          { r: 'abs(sum(obj("spkr_word_durations")$duration) - 8.6) < 1e-6', m: 'duration = end − start (전체 합 8.6초)' },
        ], sol: `(spkr_word_durations <- data %>%
  pivot_longer(oh.caught:o.bot,
               names_to = "vowel.word",
               values_to = "time") %>%
  pivot_wider(names_from = time_point,
              values_from = time) %>%
  mutate(duration = end - start))`, tips: '- 첫 pivot 뒤에 몇 행인지 출력해 보세요 (64행이어야 해요).\n- 두 번째 pivot의 names_from은 start/end가 들어 있는 열이에요.' },
      ],
    },
    {
      id: 'w-ex2',
      title: 'wk5 문제 2: 모음 부류별 평균 길이 (화자마다)',
      src: 'wk5_1_tidyr.R Problem 2, Exercise key 19–23행',
      key: '`vowel.word`를 vowel과 word로 쪼갠 뒤, **화자 × 모음 부류**로 묶어 평균.',
      setup: ['wk5', 'wk5_p1'],
      body: [
        '`separate(vowel.word, into = c("vowel", "word"))` → `group_by(speaker_ID, vowel)` → `summarise(mean_dur = mean(duration))`. 결과는 화자 8 × 부류 2 = 16행이에요.',
        { note: 'summarise 뒤의 메시지', kind: 'tip', t: 'key를 그대로 돌리면 `summarise() has grouped output by \'speaker_ID\'` 메시지가 나와요. 결과에 그룹이 하나 남았다는 안내예요 (R단원). 신경 쓰이면 `.groups = "drop"`을 넣으세요.' },
      ],
      quiz: [
        { type: 'write', q: '`spkr_word_durations`로 `spkr_vowel_durations`를 만드세요. 열: speaker_ID, vowel, mean_dur (16행).', given: `spkr_word_durations <- data %>%
  pivot_longer(oh.caught:o.bot, names_to = "vowel.word", values_to = "time") %>%
  pivot_wider(names_from = time_point, values_from = time) %>%
  mutate(duration = end - start)`, checks: [
          { r: 'obj_df("spkr_vowel_durations") && nrow(obj("spkr_vowel_durations")) == 16', m: '`spkr_vowel_durations` 16행' },
          { r: 'all(c("speaker_ID", "vowel", "mean_dur") %in% names(obj("spkr_vowel_durations")))', m: '열 speaker_ID, vowel, mean_dur' },
          { r: 'setequal(unique(obj("spkr_vowel_durations")$vowel), c("o", "oh"))', m: 'vowel 값은 o, oh (separate로 쪼갠 앞 조각)' },
          { r: 'abs(mean(obj("spkr_vowel_durations")$mean_dur) - 0.26875) < 1e-6', m: 'mean_dur = 화자·부류별 duration 평균' },
        ], sol: `(spkr_vowel_durations <- spkr_word_durations %>%
    separate(vowel.word,
             into = c("vowel","word")) %>%
    group_by(speaker_ID, vowel) %>%
    summarise(mean_dur = mean(duration)))` },
      ],
    },
    {
      id: 'w-ex3',
      title: 'wk5 문제 3: 나이·성별 집단 평균 막대그래프',
      src: 'wk5_1_tidyr.R Problem 3, Exercise key 30–45행',
      key: '`speaker_ID`를 spkr, age, gender로 쪼개고 → 화자 평균들을 **다시** 평균(age × gender × vowel) → 막대 + `facet_grid(age ~ gender)`.',
      setup: ['wk5', 'wk5_p1', 'wk5_p2'],
      body: [
        '문제의 괄호 "after speaker-level averaging"은 문제 2에서 만든 **화자별 평균**을 다시 평균하라는 뜻이에요. 그래서 시작 표가 spkr_vowel_durations예요.',
        '문제는 축 이름과 제목도 요구해요 ("Make sure axes are labeled informatively and your graph has a helpful title!"). key는 제목만 달았지만, 여기서는 축 이름까지 붙여야 통과해요 (L단원).',
      ],
      quiz: [
        { type: 'write', q: '`group_durations`(age, gender, vowel, group_mean_dur)를 만들고, vowel별 막대를 age × gender 패널로 그리세요. 축 이름과 제목도 붙이세요.', given: `spkr_vowel_durations <- spkr_word_durations %>%
  separate(vowel.word, into = c("vowel", "word")) %>%
  group_by(speaker_ID, vowel) %>%
  summarise(mean_dur = mean(duration), .groups = "drop")`, target: `group_durations <- spkr_vowel_durations %>%
  separate(speaker_ID, into = c("spkr", "age", "gender")) %>%
  group_by(age, gender, vowel) %>%
  summarize(group_mean_dur = mean(mean_dur))

ggplot(group_durations, aes(vowel, group_mean_dur)) +
  geom_col(position = "dodge", aes(fill = vowel)) +
  facet_grid(age ~ gender) +
  labs(x = "Vowel class", y = "Mean word duration (s)",
       title = "Vowel duration by age & gender")`, checks: [
          { r: 'obj_df("group_durations") && nrow(obj("group_durations")) == 8 && "group_mean_dur" %in% names(obj("group_durations"))', m: '`group_durations` 8행 (나이 2 × 성별 2 × 부류 2), 열 group_mean_dur' },
          { r: 'maps("x", "vowel") && maps("y", "group_mean_dur")', m: 'x = vowel, y = group_mean_dur' },
          { r: 'has_geom("col") || (has_geom("bar") && has_stat("identity"))', m: '막대: geom_col() 또는 geom_bar(stat = "identity")' },
          { r: 'facet_has(c("age", "gender"))', m: 'age와 gender로 패널 나누기 (`facet_grid(age ~ gender)`)' },
          { r: 'lab_set("x") && lab_set("y")', m: '축 이름 붙이기 (`labs(x = …, y = …)`)' },
          { r: 'lab_set("title")', m: '제목 붙이기' },
          { r: 'maps("fill", "vowel")', m: '막대 색을 vowel로 (`fill = vowel`)', opt: true },
        ], sol: `group_durations <- spkr_vowel_durations %>%
  separate(speaker_ID, into = c("spkr", "age", "gender")) %>%
  group_by(age, gender, vowel) %>%
  summarize(group_mean_dur = mean(mean_dur))

ggplot(group_durations, aes(vowel, group_mean_dur)) +
  geom_col(position = "dodge", aes(fill = vowel)) +
  facet_grid(age ~ gender) +
  labs(x = "Vowel class", y = "Mean word duration (s)",
       title = "Vowel duration by age & gender")` },
      ],
    },
    {
      id: 'w-ex4',
      title: 'wk5 문제 4: 집단별 두 부류의 길이 차이',
      src: 'wk5_1_tidyr.R Problem 4, Exercise key 50–55행',
      key: '부류(vowel)를 열로 펼쳐(pivot_wider) oh와 o를 같은 행에 놓고 → `mutate(diff = round(oh - o, 2))`.',
      setup: ['wk5', 'wk5_p1', 'wk5_p2', 'wk5_p3'],
      body: [
        '"두 값의 차이"를 구할 때의 공식이 여기서 처음 나와요: **빼고 싶은 두 값이 다른 행에 있으면, 그 둘을 가르는 열을 names_from으로 펼친다.** HW1 9번(Z단원)이 똑같은 모양이에요.',
        '`round(값, 2)`는 소수 둘째 자리까지 반올림이에요 (문제의 "rounding to 2 decimal points").',
      ],
      quiz: [
        { type: 'write', q: '`group_durations`로 `group_dur_diffs`를 만드세요. 열 o, oh와 `diff = round(oh - o, 2)`가 있어야 해요 (4행).', given: `group_durations <- spkr_vowel_durations %>%
  separate(speaker_ID, into = c("spkr", "age", "gender")) %>%
  group_by(age, gender, vowel) %>%
  summarize(group_mean_dur = mean(mean_dur), .groups = "drop")`, checks: [
          { r: 'obj_df("group_dur_diffs") && nrow(obj("group_dur_diffs")) == 4', m: '`group_dur_diffs` 4행 (집단 하나에 한 행)' },
          { r: 'all(c("o", "oh", "diff") %in% names(obj("group_dur_diffs")))', m: '열 o, oh, diff' },
          { r: 'isTRUE(all.equal(sort(obj("group_dur_diffs")$diff), c(0, 0.02, 0.12, 0.19)))', m: 'diff = round(oh − o, 2) → 0.19, 0.12, 0.02, 0' },
        ], sol: `(group_dur_diffs <- group_durations %>%
  pivot_wider(
    names_from = vowel,
    values_from = group_mean_dur) %>%
  mutate(diff = round(oh - o, 2)))` },
        { type: 'mcq', q: '결과에서 oh 부류가 o 부류보다 가장 많이 긴 집단은?', setup: ['wk5', 'wk5_p1', 'wk5_p2', 'wk5_p3'], code: `group_durations %>%
  pivot_wider(names_from = vowel, values_from = group_mean_dur) %>%
  mutate(diff = round(oh - o, 2))`, reveal: true, opts: [
          { t: 'old man (0.19)', ok: true, why: '나이 든 남성 화자에서 차이가 가장 커요. young woman은 차이가 0이에요.' },
          { t: 'young woman', why: 'young woman의 diff는 0이에요.' },
          { t: '모두 같다', why: '0.19, 0.12, 0.02, 0으로 달라요.' },
        ] },
      ],
    },
    {
      id: 'w-join',
      title: 'left_join(): 두 표를 열쇠 열로 붙이기',
      src: 'wk5_1_tidyr.R 끝부분 "The most important thing you need to learn from Ch. 13 is left_join()"',
      key: '`left_join(왼쪽, 오른쪽, by = "열쇠 열")`: 왼쪽 표의 **모든 행을 그대로** 두고, 열쇠 값이 같은 오른쪽 행의 열을 옆에 붙인다.',
      setup: 'joinex',
      body: [
        '실험 자료에서 아주 흔한 모양이에요: **시행(trial)마다 한 행**인 반응 표와, **단어마다 한 행**인 단어 정보 표.',
        { code: `word_rts
words
left_join(word_rts, words, by = "word")` },
        '- word_rts의 9행이 그대로 9행으로 남고, 각 행에 그 단어의 freq, pos가 붙었어요.\n- 같은 단어(cat)가 여러 번 나오면 단어 정보도 여러 번 복사돼요.\n- 오른쪽에 없는 단어가 왼쪽에 있으면 붙일 값이 없어 **NA**가 돼요. HW1의 trials + stims에서 실제로 일어나요 (Z단원).',
        { note: '행 수가 늘어나는 경우', kind: 'warn', t: '오른쪽 표에 같은 열쇠 값이 **두 번** 있으면 왼쪽 행이 두 번 복사되어 행 수가 늘어나요. 그래서 붙인 뒤 `nrow()`로 행 수가 그대로인지 확인하는 습관이 좋아요 (HW1 1번이 바로 이걸 묻고 있어요).' },
      ],
      quiz: [
        { type: 'predict', q: '결과는 몇 행일까요?', code: `left_join(word_rts, words, by = "word")`, opts: [
          { t: '9행', ok: true, why: '왼쪽(word_rts)의 행 수 그대로예요.' },
          { t: '3행', why: '3은 오른쪽(words)의 행 수예요.' },
          { t: '27행', why: '열쇠가 겹치지 않으면 곱하기가 되지 않아요.' },
        ] },
        { type: 'mcq', q: 'words에 없는 단어 "dog"이 word_rts에 있다면, left_join 뒤 그 행의 freq는?', opts: [
          { t: 'NA', ok: true, why: '붙일 정보가 없으면 빈칸(NA). 행 자체는 남아요.' },
          { t: '그 행이 사라진다', why: 'left_join은 왼쪽 행을 모두 남겨요.' },
          { t: '에러', why: '에러 없이 NA로 채워요.' },
        ] },
        { type: 'fill', q: '반응 표 trials에 단어 정보 stims를 spelling 열로 붙이세요.', code: 'data <- ▢(trials, stims, by = ▢)', ans: [['left_join'], ['"spelling"']], why: '왼쪽(trials)의 모든 행을 남기는 left_join, 열쇠 열 이름은 따옴표로.', full: `left_join(word_rts, words, by = "word")` },
      ],
    },
  ],
});
