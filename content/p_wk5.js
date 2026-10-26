/* 단원 p5 (실습): wk5 연습 — 모음 길이 4문제 (wk5_1_tidyr.R Exercise와 key) */
RS.units.push({
  id: 'p5',
  title: 'wk5 연습: 모음 길이 4문제',
  short: 'wk5 Exercise 데이터, 문제 1–4 (pivot_longer → pivot_wider → mutate → group_by → 차이)',
  desc: '`wk5_1_tidyr.R`의 Exercise와 그 key. 앞의 tidyr 단원(W단원)에서 배운 `pivot_longer()`, `pivot_wider()`, `separate()`로 풀어요.',
  lessons: [
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
  ],
});

RS.goals.push(
  { lesson: 'w-ex1', src: 'wk5 연습', title: '1. 화자별·단어별 길이' },
  { lesson: 'w-ex2', src: 'wk5 연습', title: '2. 모음 부류별 평균 길이' },
  { lesson: 'w-ex3', src: 'wk5 연습', title: '3. 나이·성별 집단 평균 막대그래프' },
  { lesson: 'w-ex4', src: 'wk5 연습', title: '4. 집단별 두 부류의 길이 차이' },
);
