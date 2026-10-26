/* 단원 Z: HW1 — 네덜란드어 어휘판단 숙제 (최종 목표) */
RS.units.push({
  id: 'z',
  title: 'HW1: 네덜란드어 어휘판단 숙제 풀기',
  short: '최종 목표 — 두 표 붙이기, 정답만, 참가자별 z점수, 2.5 SD 제외, 단어·길이별 요약, 그림 3개, pivot_wider 차이',
  desc: 'hw/wk6_DutchData_HW1.pdf의 9문제를 순서대로 풀어요. 숙제의 규칙: **앞 문제에서 만든 열이나 걸러 낸 데이터를 다음 문제로 그대로 이어 간다.** 그래서 각 문제의 "준비 코드"에는 앞 문제까지의 정답 코드가 미리 실행돼 있어요.\n\n필요한 부품은 대부분 앞 단원에 있어요: left_join(W단원), filter·mutate·summarise(O·Q·R단원), factor(X단원), wk6 실습(Y단원). 이 단원에서 새로 나오는 건 `nrow()`, `scale()`, `abs()`, `ungroup()`, `labeller = label_both`예요.',
  lessons: [
    {
      id: 'z-intro',
      title: '숙제 지도: 9문제가 이어지는 길',
      src: 'hw/wk6_DutchData_HW1.pdf 1–2쪽',
      key: '반응 50,000개 → 정답만 → 참가자별 z점수 → 너무 먼 값 제외 → 단어별 평균 → 길이별 평균 → 1음절과 2음절의 차이. **한 단계의 결과가 다음 단계의 재료**다.',
      body: [
        { table: { head: ['문제', '하는 일', '만드는 것'], rows: [
          ['1', 'trials와 stims를 spelling으로 붙이고 행 수 확인', '`data` (50,000행)'],
          ['2', '정답(W)만 남기고 행 수 확인', '`data` (41,993행)'],
          ['3', '참가자마다 반응 시간을 z점수로', '`data$rt_z`'],
          ['4', '|z| > 2.5인 반응 빼고, 뺀 비율(%)', '`data_trim`'],
          ['5', 'nsyl 빈 단어 빼고 factor로, 단어별 평균 rt_z', '`word_rts`'],
          ['6', '글자 수–RT 산점도 (nsyl 색, 직선 두 개)', '그림'],
          ['7', '글자 수 × 음절 수별 평균과 단어 수', '`length_rts`'],
          ['8', '막대그래프 → 비판 → 단어 15개 미만 빼고 다시', '그림 2개'],
          ['9', '1음절과 2음절의 차이를 길이마다, geom_col', '그림 + 결론'],
        ] } },
        { note: '제출', kind: 'src', t: 'PDF 1쪽: 2–4명이 한 조, 수업 전에 한 명이 LearnUs Week 6 Homework 폴더에 코드를 올리고 **파일 이름에 조원 이름(first name)**을 넣어요. 같은 쪽 위 문단에는 그래프 이미지도 올리라고 되어 있으니, 그림도 함께 저장해 두면 안전해요.' },
        '각 문제 레슨의 "직접 써 보기"를 모두 통과하면 처음 화면의 **최종 목표** 칸이 "완료"로 바뀌어요.',
      ],
    },
    {
      id: 'z-q1',
      title: 'HW1-1: 두 표 붙이고 행 수 확인 — nrow()',
      src: 'HW1 문제 1',
      key: '`nrow(데이터)`는 행 수를 숫자 하나로 돌려준다. left_join 뒤 행 수가 **trials와 같은지** 확인하는 게 이 문제의 핵심이다.',
      setup: [],
      body: [
        '"same number of rows as trials"가 되려면 trials의 모든 행을 남기는 **left_join**이어야 해요 (W단원). stims에 같은 단어가 두 번 있으면 행이 늘어나는데, 이 데이터는 단어마다 한 행이라 괜찮아요.',
        { code: `nrow(mpg)
nrow(diamonds)`, setup: [] },
        '`glimpse()`의 첫 줄 `Rows: …`로도 볼 수 있지만, 숙제는 "행 수를 구한 R 코드"를 요구하니 `nrow()`가 가장 깔끔해요.',
      ],
      quiz: [
        { type: 'write', q: 'trials, stims 두 tibble을 읽고, 붙여서 `data`를 만든 뒤 행 수를 확인하세요.', checks: [
          { r: 'obj_df("trials") && obj_df("stims")', m: '`trials`, `stims` 두 표 (read_csv로 읽어 tibble)' },
          { r: 'obj_df("data") && nrow(obj("data")) == 50000', m: '`data`가 trials와 같은 50,000행 (left_join)' },
          { r: 'all(c("rt.raw", "OLD20", "nchar", "nsyl") %in% names(obj("data")))', m: 'data에 stims의 단어 정보 열이 붙어 있기' },
          { re: 'nrow\\s*\\(', m: '행 수를 구하는 코드 `nrow(data)`' },
        ], sol: `trials <- read_csv("QuantAnalysis_data/QuantAnalysis_dutch_trials.csv")
stims <- read_csv("QuantAnalysis_data/QuantAnalysis_dutch_stims.csv")

data <- trials %>%
  left_join(stims, by = "spelling")

nrow(trials)
nrow(data)
## Answer: 50000 rows`, tips: '- [[w-join|left_join 레슨]]\n- [[y-data|두 파일 레슨]]' },
      ],
    },
    {
      id: 'z-q2',
      title: 'HW1-2: 정답 반응만 남기기',
      src: 'HW1 문제 2',
      key: '자극이 모두 진짜 단어라서 정답 = `response == "W"`. N(비단어라고 답함)과 T(시간 초과)는 오답이다.',
      setup: ['dutch', 'hw1'],
      body: [
        { code: `count(trials, response)`, setup: ['dutch'] },
        '`count(열)`은 값마다 행 수를 세 줘요 (= `group_by(response) %>% summarise(n = n())`). W가 41,993개, N 7,950개, T 57개예요.',
        { note: '더 일반적인 쓰기', kind: 'tip', t: '비단어 자극도 섞인 실험이라면 "정답 = 반응이 자극의 정체와 같음"이라 `filter(response == lexicality)`로 써요. 이 숙제 데이터는 lexicality가 모두 W라서 결과가 같아요.' },
      ],
      quiz: [
        { type: 'write', q: '`data`에서 정답 반응만 남겨 다시 `data`에 저장하고, 행 수를 확인하세요.', given: `data <- trials %>%
  left_join(stims, by = "spelling")`, checks: [
          { r: 'obj_df("data") && nrow(obj("data")) == 41993', m: '정답만 남은 data (41,993행)' },
          { r: 'all(obj("data")$response == "W")', m: 'response가 모두 W' },
          { re: 'nrow\\s*\\(', m: '행 수 확인 `nrow(data)`' },
        ], sol: `data <- data %>%
  filter(response == "W")

nrow(data)
## Answer: 41993 correct responses` },
        { type: 'mcq', q: 'response의 T(57개)는 어떻게 다뤄야 할까요?', opts: [
          { t: '오답으로 보고 뺀다', ok: true, why: '시간 안에 "단어"라고 답하지 못했으니 정답이 아니에요. `response == "W"`가 자연스럽게 빼 줘요.' },
          { t: '정답으로 남긴다', why: 'W라고 답하지 않았어요.' },
          { t: 'T만 따로 남긴다', why: '숙제는 정답 반응을 쓰라고 해요.' },
        ] },
      ],
    },
    {
      id: 'z-scale',
      title: '도구: scale()로 z점수, group_by + mutate, ungroup()',
      src: 'HW1 문제 3 힌트, wk7_transformation_trimming_Tamminga.pdf "z-scoring" 슬라이드',
      key: 'z점수 = (값 − 평균) / 표준편차. `scale(x)`가 그대로 해 준다. **group_by(참가자)** 뒤에 mutate하면 참가자마다 따로 계산된다.',
      setup: [],
      body: [
        { code: `scale(c(2, 4, 6))
as.numeric(scale(c(2, 4, 6)))` },
        '`scale()`은 결과를 **1열짜리 행렬**로 돌려주고 평균·표준편차를 꼬리표(attr)로 달아요. 데이터 열로 쓸 때는 `as.numeric()`으로 보통 숫자 벡터로 바꿔 두면 깔끔해요. 안 바꾸면 dplyr 1.1 이후 filter() 안에서 "one column matrices … deprecated" 경고가 나요.',
        { code: `tibble(who = c("A", "A", "A", "B", "B", "B"),
       rt = c(500, 600, 700, 900, 1000, 1100)) %>%
  group_by(who) %>%
  mutate(rt_z = as.numeric(scale(rt))) %>%
  ungroup()` },
        'A와 B의 반응 시간 크기가 전혀 다른데 z점수는 둘 다 −1, 0, 1이에요. 참가자마다 **자기 평균을 기준으로** 얼마나 빠르고 느린지로 바꾼 거예요. 그래서 빠른 사람·느린 사람이 섞여도 비교할 수 있어요.',
        { note: 'ungroup()', kind: 'tip', t: 'group_by()는 mutate가 끝나도 데이터에 **남아 있어요** (R단원). 참가자별 계산이 끝났으면 `ungroup()`으로 풀어 두세요. 안 풀면 다음 단계의 mutate·summarise가 계속 참가자별로 돌아가서 엉뚱한 결과가 날 수 있어요.' },
      ],
      quiz: [
        { type: 'predict', q: '결과는?', code: `as.numeric(scale(c(10, 20, 30)))`, opts: [
          { t: '`[1] -1  0  1`', ok: true, why: '평균 20, 표준편차 10 → (10−20)/10 = −1, 0, 1.' },
          { t: '`[1] 10 20 30`', why: 'scale은 평균을 빼고 표준편차로 나눠요.' },
          { t: '`[1] -10   0  10`', why: '그건 평균만 뺀 것(centering)이에요. 표준편차로도 나눠요.' },
        ] },
        { type: 'mcq', q: '"참가자 **안에서**" z점수를 구하려면?', opts: [
          { t: '`group_by(participant) %>% mutate(rt_z = …)`', ok: true, why: 'mutate는 행 수를 그대로 두고, 그룹마다 따로 계산해요.' },
          { t: '`group_by(participant) %>% summarise(rt_z = …)`', why: 'summarise는 참가자마다 한 행으로 줄여 버려요. 반응마다 z점수가 필요해요.' },
          { t: '`mutate(rt_z = scale(rt.raw))` (group_by 없이)', why: '그건 전체 평균 기준이에요.' },
        ] },
      ],
    },
    {
      id: 'z-q3',
      title: 'HW1-3: 참가자별 z점수 열 rt_z',
      src: 'HW1 문제 3',
      key: '`group_by(participant) %>% mutate(rt_z = as.numeric(scale(rt.raw))) %>% ungroup()`',
      setup: ['dutch', 'hw1', 'hw2'],
      body: [
        '막히면 바로 앞 [[z-scale|도구 레슨]]을 보세요. 결과의 행 수는 그대로 41,993이어야 해요 (mutate는 행을 줄이지 않아요).',
      ],
      quiz: [
        { type: 'write', q: '`data`에 참가자마다 따로 구한 z점수 열 `rt_z`를 만드세요.', given: `data <- trials %>%
  left_join(stims, by = "spelling")
data <- data %>%
  filter(response == "W")`, checks: [
          { r: 'obj_df("data") && nrow(obj("data")) == 41993 && "rt_z" %in% names(obj("data"))', m: '`data`에 rt_z 열 (행 수는 그대로 41,993)' },
          { r: '{ d <- obj("data"); z <- as.numeric(d$rt_z); all(abs(tapply(z, d$participant, mean)) < 1e-6) && all(abs(tapply(z, d$participant, sd) - 1) < 1e-6) }', m: '참가자마다 평균 0, 표준편차 1 (group_by(participant) 뒤 scale)' },
          { r: 'is.null(dim(obj("data")$rt_z))', m: 'rt_z를 보통 숫자 열로 (`as.numeric(scale(…))`)', opt: true },
          { r: '!dplyr::is_grouped_df(obj("data"))', m: '계산 뒤 `ungroup()`', opt: true },
        ], sol: `data <- data %>%
  group_by(participant) %>%
  mutate(rt_z = as.numeric(scale(rt.raw))) %>%
  ungroup()` },
      ],
    },
    {
      id: 'z-q4',
      title: 'HW1-4: 2.5 SD 밖의 반응 빼기와 비율 — abs()',
      src: 'HW1 문제 4, wk7_transformation_trimming_Tamminga.pdf "Part 2: Trimming"',
      key: '"평균에서 2.5 SD보다 멀다" = **|z| > 2.5**. 남길 행은 `abs(rt_z) <= 2.5` (정확히 2.5는 남김). 비율 = (전 − 후) / 전 × 100.',
      setup: ['dutch', 'hw1', 'hw2', 'hw3'],
      body: [
        { code: `abs(c(-3, -2.5, 0, 1.2))` },
        '`abs()`는 절댓값이에요. z점수는 아주 느린 쪽(+)과 아주 빠른 쪽(−) 모두 멀 수 있어서, 둘을 한 번에 거르려고 절댓값을 써요.',
        { code: `data_trim <- data %>%
  filter(abs(rt_z) <= 2.5)
nrow(data)
nrow(data_trim)
(nrow(data) - nrow(data_trim)) / nrow(data) * 100` },
        '41,993개 중 1,270개(약 **3.02%**)가 빠지고 40,723개가 남아요.',
        { note: '자주 하는 실수', kind: 'warn', t: '3번에서 z점수를 **정답만 남기기 전의** 50,000행으로 구하면, 오답 반응까지 평균·표준편차에 섞여 값이 달라져요 (그때는 3.036%가 나와요). 숙제 규칙대로 2번의 결과(정답만)에서 이어 가야 해요.' },
      ],
      quiz: [
        { type: 'write', q: '`data`에서 |rt_z|가 2.5 이하인 행만 남겨 `data_trim`을 만들고, 마지막 줄에서 **제외된 비율(%)**을 계산하세요.', given: `data <- data %>%
  group_by(participant) %>%
  mutate(rt_z = as.numeric(scale(rt.raw))) %>%
  ungroup()`, checks: [
          { r: 'obj_df("data_trim") && nrow(obj("data_trim")) == 40723', m: '`data_trim` 40,723행 (`abs(rt_z) <= 2.5`)' },
          { r: 'is.numeric(A()) && length(A()) == 1 && abs(A() - 3.024314) < 0.006', m: '마지막 줄의 결과가 제외 비율 약 3.02(%)' },
        ], sol: `data_trim <- data %>%
  filter(abs(rt_z) <= 2.5)

nrow(data_trim)
(nrow(data) - nrow(data_trim)) / nrow(data) * 100
## Answer: 1270 of 41993 excluded, about 3.02%` },
      ],
    },
    {
      id: 'z-q5',
      title: 'HW1-5: 단어별 평균 z점수 word_rts',
      src: 'HW1 문제 5',
      key: 'nsyl 빈 단어 빼기 → nsyl을 factor로 → **단어 정보 열을 모두 group_by에 넣고** 평균 rt_z.',
      setup: ['dutch', 'hw1', 'hw2', 'hw3', 'hw4'],
      body: [
        '"retains the word-level variables that were originally in stims" = stims의 열(spelling, OLD20, subtlex.log10.frequency, nchar, nsyl)을 결과에 남기라는 뜻이에요. summarise는 **묶은 열만** 남기니, 이 다섯 열을 모두 group_by에 넣어요 (Y단원 y-join 레슨과 같은 요령).',
        '단어마다 정보가 한 가지씩이라, 다섯 열로 묶어도 결국 "단어마다 한 묶음"이에요. 결과는 12,076단어.',
      ],
      quiz: [
        { type: 'write', q: '`data_trim`에서 nsyl이 빈 행을 빼고 nsyl을 factor로 바꾼 뒤, 단어 정보 열을 남긴 `word_rts`(단어별 `mean_rt_z`)를 만드세요.', given: `data_trim <- data %>%
  filter(abs(rt_z) <= 2.5)`, checks: [
          { r: 'obj_df("word_rts") && nrow(obj("word_rts")) == 12076', m: '`word_rts` 12,076행 (단어마다 한 행)' },
          { r: 'all(c("spelling", "OLD20", "subtlex.log10.frequency", "nchar", "nsyl", "mean_rt_z") %in% names(obj("word_rts")))', m: '열: stims의 단어 정보 5개 + mean_rt_z' },
          { r: 'is.factor(obj("word_rts")$nsyl)', m: 'nsyl은 factor (`as_factor(nsyl)`)' },
          { r: 'abs(mean(obj("word_rts")$mean_rt_z) - (-0.08216053)) < 1e-4', m: 'mean_rt_z = 단어별 rt_z 평균' },
        ], sol: `data_trim <- data_trim %>%
  filter(!is.na(nsyl)) %>%
  mutate(nsyl = as_factor(nsyl))

word_rts <- data_trim %>%
  group_by(spelling, OLD20, subtlex.log10.frequency, nchar, nsyl) %>%
  summarise(mean_rt_z = mean(rt_z),
            .groups = "drop")`, tips: '- [[x-na|NA 빼기]], [[x-factor|factor]]\n- [[y-join|group_by에 열을 같이 넣어 남기기]]' },
      ],
    },
    {
      id: 'z-q6',
      title: 'HW1-6: 글자 수와 반응 시간 산점도',
      src: 'HW1 문제 6',
      key: 'x = nchar, y = mean_rt_z, color = nsyl. 점은 흔들고(jitter) alpha 0.2, 위에 **직선 두 개**(nsyl별, `linewidth = 2`, 띠 없음).',
      setup: ['dutch', 'hw1', 'hw2', 'hw3', 'hw4', 'hw5'],
      body: [
        '조건을 하나씩 짝지으면:',
        '- "colored by nsyl" → 전역 `aes(color = nsyl)` (그래야 선도 nsyl별로 둘, H단원)\n- "Jitter … alpha 0.2" → `geom_point(position = position_jitter(…), alpha = 0.2)` 또는 `geom_point(position = "jitter", alpha = 0.2)`\n- "two straight smoothing lines of size 2 … Omit the confidence bands" → `geom_smooth(method = "lm", linewidth = 2, se = FALSE)`\n- 축 이름과 제목 → `labs()`',
        { note: 'size = 2 대신 linewidth = 2', kind: 'warn', t: 'PDF는 "size 2"라고 쓰지만, ggplot2 3.4.0부터 **선 굵기**는 `linewidth`예요. `size = 2`도 그려지긴 하지만 경고가 나요. wk6 실습 key도 linewidth를 써요.' },
        { note: '흔들 때 y는 그대로', kind: 'tip', t: 'nchar는 정수라 점이 세로줄로 겹쳐요. 가로로만 흔들려면 `position_jitter(width = 0.3, height = 0)`. 세로까지 흔들면 반응 시간 값 자체가 조금씩 바뀐 것처럼 보여요.' },
      ],
      quiz: [
        { type: 'write', q: 'word_rts로 6번 그림을 그리세요.', given: `word_rts <- data_trim %>%
  group_by(spelling, OLD20, subtlex.log10.frequency, nchar, nsyl) %>%
  summarise(mean_rt_z = mean(rt_z), .groups = "drop")`, target: `ggplot(word_rts, aes(x = nchar, y = mean_rt_z, color = nsyl)) +
  geom_point(position = position_jitter(width = 0.3, height = 0), alpha = 0.2) +
  geom_smooth(method = "lm", se = FALSE, linewidth = 2) +
  labs(x = "Word length (number of characters)",
       y = "Mean reaction time (z-score)",
       title = "Reaction time by word length and number of syllables") +
  theme_bw()`, checks: [
          { r: 'maps("x", "nchar") && maps("y", "mean_rt_z")', m: 'x = nchar, y = mean_rt_z' },
          { r: 'maps("colour", "nsyl", "point") && maps("colour", "nsyl", "smooth")', m: '점과 선 모두 nsyl 색 (선이 두 개)' },
          { r: 'jittered()', m: '점 흔들기 (jitter)' },
          { r: 'has_param("point", "alpha", 0.2)', m: '점 `alpha = 0.2`' },
          { r: 'has_param("smooth", "method", "lm")', m: '곧은 선 `method = "lm"`' },
          { r: 'has_param("smooth", "se", FALSE)', m: '띠 없음 `se = FALSE`' },
          { r: 'has_param("smooth", "linewidth", 2) || has_param("smooth", "size", 2)', m: '선 굵기 2 (`linewidth = 2`)' },
          { r: 'lab_set("x") && lab_set("y") && lab_set("title")', m: '축 이름과 제목' },
        ], sol: `ggplot(word_rts, aes(x = nchar, y = mean_rt_z, color = nsyl)) +
  geom_point(position = position_jitter(width = 0.3, height = 0), alpha = 0.2) +
  geom_smooth(method = "lm", se = FALSE, linewidth = 2) +
  labs(x = "Word length (number of characters)",
       y = "Mean reaction time (z-score)",
       title = "Reaction time by word length and number of syllables") +
  theme_bw()` },
      ],
    },
    {
      id: 'z-q7',
      title: 'HW1-7: 글자 수 × 음절 수별 평균 length_rts',
      src: 'HW1 문제 7',
      key: '`group_by(nchar, nsyl) %>% summarise(평균 = mean(mean_rt_z), n = n())` — 평균의 평균, 그리고 **몇 단어로 낸 평균인지**.',
      setup: ['dutch', 'hw1', 'hw2', 'hw3', 'hw4', 'hw5'],
      body: [
        '"the number of observations in each row"는 그 칸(예: 5글자 2음절)에 든 **단어 수**예요. word_rts가 단어마다 한 행이니 `n()`이 곧 단어 수예요. 8번에서 이 n이 아주 중요해져요.',
      ],
      quiz: [
        { type: 'write', q: 'word_rts로 `length_rts`를 만드세요. nchar, nsyl, 평균 mean_rt_z, 단어 수 n (18행).', given: `word_rts <- data_trim %>%
  group_by(spelling, OLD20, subtlex.log10.frequency, nchar, nsyl) %>%
  summarise(mean_rt_z = mean(rt_z), .groups = "drop")`, checks: [
          { r: 'obj_df("length_rts") && nrow(obj("length_rts")) == 18 && all(c("nchar", "nsyl") %in% names(obj("length_rts")))', m: '`length_rts` 18행, 열 nchar, nsyl' },
          { r: '{ d <- obj("length_rts"); any(vapply(d, function(v) is.numeric(v) && abs(mean(v) - (-0.06861962)) < 1e-4, TRUE)) }', m: '칸마다 mean_rt_z의 평균' },
          { r: '{ d <- obj("length_rts"); any(vapply(d, function(v) is.numeric(v) && isTRUE(sum(v) == 12076), TRUE)) }', m: '칸마다 단어 수 (`n = n()`, 합계 12,076)' },
        ], sol: `length_rts <- word_rts %>%
  group_by(nchar, nsyl) %>%
  summarise(mean_rt_z = mean(mean_rt_z),
            n = n(),
            .groups = "drop")
length_rts` },
      ],
    },
    {
      id: 'z-q8',
      title: 'HW1-8: 막대그래프, 비판, 그리고 15개 미만 빼고 다시',
      src: 'HW1 문제 8',
      key: '`geom_col()` + `facet_wrap(~nsyl, labeller = label_both)` → 패널 이름이 "nsyl: 1", "nsyl: 2". 그다음 `filter(n >= 15)`로 단어가 적은 칸을 빼고 다시 그린다.',
      setup: ['dutch', 'hw1', 'hw2', 'hw3', 'hw4', 'hw5', 'hw7'],
      body: [
        '숙제 PDF가 안내하는 labeller: `facet_wrap()`의 패널 이름을 바꾸는 인자예요. `label_both`는 "변수 이름: 값" 모양으로 붙여 줘요. 다른 방법으로는 X단원의 `fct_recode()`로 nsyl의 수준 이름을 "nsyl: 1"로 바꿔도 돼요.',
        { code: `ggplot(length_rts, aes(x = nchar, y = mean_rt_z)) +
  geom_col() +
  facet_wrap(~nsyl, labeller = label_both)` },
        '"fewer than 15 observations" 칸을 빼라 = **n이 15 이상인 칸만 남겨라**: `filter(n >= 15)`.',
      ],
      quiz: [
        { type: 'write', q: 'length_rts로 nchar(x)–평균 RT(y) 막대그래프를 nsyl별 패널로 그리세요. 축 이름, 제목, 그리고 (선택) 패널 이름 "nsyl: 1".', given: `length_rts <- word_rts %>%
  group_by(nchar, nsyl) %>%
  summarise(mean_rt_z = mean(mean_rt_z), n = n(), .groups = "drop")`, target: `ggplot(length_rts, aes(x = nchar, y = mean_rt_z)) +
  geom_col() +
  facet_wrap(~nsyl, labeller = label_both) +
  labs(x = "Word length (number of characters)",
       y = "Mean reaction time (z-score)",
       title = "Mean reaction time by word length and number of syllables") +
  theme_bw()`, checks: [
          { r: 'has_geom("col") || (has_geom("bar") && has_stat("identity"))', m: '막대: `geom_col()`' },
          { r: 'maps("x", "nchar") && maps("y", "mean_rt_z")', m: 'x = nchar, y = mean_rt_z' },
          { r: 'facet_has("nsyl")', m: 'nsyl별 패널' },
          { r: 'data_nrow() == 18', m: '아직은 모든 칸(18개)' },
          { r: 'lab_set("x") && lab_set("y") && lab_set("title")', m: '축 이름과 제목' },
          { re: 'label_both|nsyl: ', m: '패널 이름 "nsyl: 1" (`labeller = label_both`)', opt: true },
        ], sol: `ggplot(length_rts, aes(x = nchar, y = mean_rt_z)) +
  geom_col() +
  facet_wrap(~nsyl, labeller = label_both) +
  labs(x = "Word length (number of characters)",
       y = "Mean reaction time (z-score)",
       title = "Mean reaction time by word length and number of syllables") +
  theme_bw()` },
        { type: 'mcq', q: '이 그림에서 **가장 오해를 부르는** 점은? (length_rts의 n을 함께 보세요)', setup: ['dutch', 'hw1', 'hw2', 'hw3', 'hw4', 'hw5', 'hw7'], code: `length_rts`, reveal: true, opts: [
          { t: '단어 1~12개로 낸 막대(예: 1음절 9글자 = 단어 1개, −0.35)가 수천 단어로 낸 막대와 똑같이 믿을 만해 보인다', ok: true, why: '가장 눈에 띄는 막대들이 가장 적은 단어에서 나와요. 그림에는 n도, 퍼진 정도(오차 막대)도 없어요. 덧붙여 z점수라서 0은 "반응 0ms"가 아니라 참가자 평균이고, 두 패널의 글자 수 범위도 달라요.' },
          { t: '막대 색이 회색이다', why: '색은 해석을 바꾸지 않아요.' },
          { t: 'x축이 글자 수라서', why: 'x축 자체는 문제가 아니에요.' },
        ] },
        { type: 'write', q: '단어가 15개 미만인 칸을 뺀 `length_rts_15`를 만들고 같은 막대그래프를 다시 그리세요.', given: `length_rts <- word_rts %>%
  group_by(nchar, nsyl) %>%
  summarise(mean_rt_z = mean(mean_rt_z), n = n(), .groups = "drop")`, target: `length_rts_15 <- length_rts %>%
  filter(n >= 15)

ggplot(length_rts_15, aes(x = nchar, y = mean_rt_z)) +
  geom_col() +
  facet_wrap(~nsyl, labeller = label_both) +
  labs(x = "Word length (number of characters)",
       y = "Mean reaction time (z-score)",
       title = "Mean reaction time by word length and number of syllables (15+ words)") +
  theme_bw()`, checks: [
          { r: 'obj_df("length_rts_15") && nrow(obj("length_rts_15")) == 14', m: '`length_rts_15` 14행 (`filter(n >= 15)`)' },
          { r: 'data_nrow() == 14', m: '그림도 걸러 낸 데이터로' },
          { r: '(has_geom("col") || (has_geom("bar") && has_stat("identity"))) && facet_has("nsyl")', m: '막대 + nsyl 패널' },
          { r: 'lab_set("x") && lab_set("y") && lab_set("title")', m: '축 이름과 제목' },
        ], sol: `length_rts_15 <- length_rts %>%
  filter(n >= 15)

ggplot(length_rts_15, aes(x = nchar, y = mean_rt_z)) +
  geom_col() +
  facet_wrap(~nsyl, labeller = label_both) +
  labs(x = "Word length (number of characters)",
       y = "Mean reaction time (z-score)",
       title = "Mean reaction time by word length and number of syllables (15+ words)") +
  theme_bw()` },
      ],
    },
    {
      id: 'z-q9',
      title: 'HW1-9: 1음절과 2음절의 차이 — pivot_wider 디버깅',
      src: 'HW1 문제 9 "You may need to transform the dataset using pivot_wider(), which may require some debugging."',
      key: '빼고 싶은 두 값(1음절, 2음절 평균)을 **같은 행**에 놓으려면 nsyl로 pivot_wider. 그 전에 **n 열을 빼야** 한다.',
      setup: ['dutch', 'hw1', 'hw2', 'hw3', 'hw4', 'hw5', 'hw7', 'hw8'],
      body: [
        '숙제가 말하는 "debugging"은 이거예요. n을 남긴 채 펼치면:',
        { code: `length_rts_15 %>%
  pivot_wider(names_from = nsyl, values_from = mean_rt_z)` },
        'pivot_wider는 **남은 열(nchar, n)의 조합마다** 한 행을 만들어요. n은 칸마다 달라서 1음절 값과 2음절 값이 끝내 같은 행에 모이지 못하고, NA투성이 14행이 돼요. n을 빼면 nchar마다 한 행으로 모여요:',
        { code: `length_rts_15 %>%
  select(nchar, nsyl, mean_rt_z) %>%
  mutate(nsyl = fct_recode(nsyl, "syl1" = "1", "syl2" = "2")) %>%
  pivot_wider(names_from = nsyl, values_from = mean_rt_z) %>%
  mutate(diff = syl2 - syl1)` },
        '- `fct_recode`로 수준 이름을 syl1, syl2로 바꾼 이유: 그대로 펼치면 열 이름이 숫자 `1`, `2`가 되는데, 숫자로 시작하는 열 이름은 쓸 때마다 백틱 기호로 감싸야 해서 번거로워요.\n- 한쪽 음절만 남은 길이(2, 3, 8~11글자)는 diff가 NA예요. `filter(!is.na(diff))`로 빼고 그리면 경고가 안 나요.',
      ],
      quiz: [
        { type: 'write', q: 'length_rts_15로 글자 수마다 (2음절 평균 − 1음절 평균)을 구하고, `geom_col()`로 그리세요.', given: `length_rts_15 <- length_rts %>%
  filter(n >= 15)`, target: `length_diff <- length_rts_15 %>%
  select(nchar, nsyl, mean_rt_z) %>%
  mutate(nsyl = fct_recode(nsyl, "syl1" = "1", "syl2" = "2")) %>%
  pivot_wider(names_from = nsyl, values_from = mean_rt_z) %>%
  mutate(diff = syl2 - syl1) %>%
  filter(!is.na(diff))

ggplot(length_diff, aes(x = nchar, y = diff)) +
  geom_col() +
  labs(x = "Word length (number of characters)",
       y = "RT difference in z-scores (2-syllable minus 1-syllable)",
       title = "Difference in mean reaction time between 2- and 1-syllable words") +
  theme_bw()`, checks: [
          { r: 'has_geom("col") || (has_geom("bar") && has_stat("identity"))', m: '`geom_col()`' },
          { r: 'maps("x", "nchar")', m: 'x = nchar' },
          { r: '{ b <- built(); !is.null(b) && { y <- b$data[[1]]$y; y <- y[!is.na(y)]; length(y) == 4 && isTRUE(all.equal(sort(abs(y)), c(0.04715669, 0.06053881, 0.12797861, 0.2102315), tolerance = 1e-4)) } }', m: '막대 4개 = 4~7글자의 (2음절 − 1음절) 차이 (n을 빼고 pivot_wider)' },
          { r: 'lab_set("x") && lab_set("y") && lab_set("title")', m: '축 이름과 제목' },
        ], sol: `length_diff <- length_rts_15 %>%
  select(nchar, nsyl, mean_rt_z) %>%
  mutate(nsyl = fct_recode(nsyl, "syl1" = "1", "syl2" = "2")) %>%
  pivot_wider(names_from = nsyl, values_from = mean_rt_z) %>%
  mutate(diff = syl2 - syl1) %>%
  filter(!is.na(diff))

ggplot(length_diff, aes(x = nchar, y = diff)) +
  geom_col() +
  labs(x = "Word length (number of characters)",
       y = "RT difference in z-scores (2-syllable minus 1-syllable)",
       title = "Difference in mean reaction time between 2- and 1-syllable words") +
  theme_bw()`, tips: '- [[w-ex4|wk5 문제 4: 두 값의 차이를 pivot_wider로]]\n- [[x-recode|fct_recode]]' },
        { type: 'mcq', q: '그림에서 내릴 수 있는 결론으로 알맞은 것은? (4글자 0.21, 5글자 0.13, 6글자 0.06, 7글자 −0.05)', opts: [
          { t: '같은 글자 수라면 2음절 단어가 대체로 더 느리고, 그 차이는 단어가 길어질수록 줄어 7글자에서는 살짝 뒤집힌다 (비교할 수 있는 길이가 4개뿐이라 잠정적)', ok: true, why: '글자 수를 같게 놓고 비교했으니, 음절 수가 글자 수와 따로 반응 시간에 영향을 주는 것처럼 보여요. 다만 빈도 같은 다른 단어 특성은 통제하지 않았어요.' },
          { t: '음절 수는 반응 시간과 관계없다', why: '4~6글자에서 차이가 뚜렷해요.' },
          { t: '1음절 단어가 항상 더 느리다', why: '양수(2음절 − 1음절 > 0)면 2음절이 더 느린 거예요.' },
        ] },
      ],
    },
    {
      id: 'z-all',
      title: 'HW1 전체: 빈 화면에서 1번부터 9번까지 한 번에',
      src: 'HW1 문제 1–9',
      key: '앞 레슨들은 앞 문제의 정답을 **준비 코드로 미리 실행**해 줬어요. 여기서는 아무것도 없는 상태에서 **제출용 스크립트 하나**로 1–9번을 이어서 써요. 이게 통과되면 숙제를 혼자 처음부터 할 수 있다는 뜻이에요.',
      setup: [],
      body: [
        '- 파일 경로: `QuantAnalysis_data/QuantAnalysis_dutch_trials.csv`, `QuantAnalysis_data/QuantAnalysis_dutch_stims.csv`\n- 객체 이름은 숙제 그대로: `trials`, `stims`, `data`, `data_trim`, `word_rts`, `length_rts`, `length_rts_15`\n- 그림 6·8번은 중간에 그려 두고, **마지막 줄은 9번 그림**이 되게 써요 (채점은 마지막 그림만 봐요)\n- 숫자 답(1번 행 수, 2번 관측 수, 4번 제외 비율)은 각 문제 레슨에서 확인했던 값과 같은지 출력을 보며 확인하세요',
        '막히면 그 문제 레슨으로: [[z-q1|1]] · [[z-q2|2]] · [[z-q3|3]] · [[z-q4|4]] · [[z-q5|5]] · [[z-q6|6]] · [[z-q7|7]] · [[z-q8|8]] · [[z-q9|9]]',
        { note: 'RStudio에서도', kind: 'tip', t: '여기서 통과한 스크립트를 `baseline_data` 프로젝트(`baseline_data.Rproj`)를 연 RStudio에 그대로 붙여 넣으면 똑같이 돌아가요. 맨 위에 `library(tidyverse)`만 추가하세요.' },
      ],
      quiz: [
        { type: 'write', q: 'HW1 1–9번을 한 스크립트로 처음부터 쓰세요. (준비 코드 없음)', checks: [
          { r: 'obj_df("trials") && obj_df("stims") && nrow(obj("trials")) == 50000', m: '1. `trials`, `stims` 읽기' },
          { r: 'obj_df("data") && nrow(obj("data")) == 41993 && all(obj("data")$response == "W") && "OLD20" %in% names(obj("data"))', m: '1–2. `data` = 붙인 표에서 정답만 (41,993행)' },
          { r: '"rt_z" %in% names(obj("data")) && { d <- obj("data"); z <- as.numeric(d$rt_z); all(abs(tapply(z, d$participant, mean)) < 1e-6) && all(abs(tapply(z, d$participant, sd) - 1) < 1e-6) }', m: '3. 참가자별 z점수 `rt_z` (정답만 남긴 뒤에 계산)' },
          { r: 'obj_df("data_trim") && nrow(obj("data_trim")) %in% c(40723, 38935) && all(abs(obj("data_trim")$rt_z) <= 2.5)', m: '4. `data_trim`: |rt_z| ≤ 2.5 (40,723행, 5번에서 nsyl 빈 행까지 뺐다면 38,935행)' },
          { r: 'obj_df("word_rts") && nrow(obj("word_rts")) == 12076 && is.factor(obj("word_rts")$nsyl) && all(c("spelling", "OLD20", "subtlex.log10.frequency", "nchar", "nsyl", "mean_rt_z") %in% names(obj("word_rts")))', m: '5. `word_rts`: 12,076단어, nsyl은 factor, 단어 정보 열 + mean_rt_z' },
          { r: 'obj_df("length_rts") && nrow(obj("length_rts")) == 18', m: '7. `length_rts` 18행' },
          { r: 'obj_df("length_rts_15") && nrow(obj("length_rts_15")) == 14', m: '8. `length_rts_15` 14행 (n ≥ 15)' },
          { r: '(has_geom("col") || (has_geom("bar") && has_stat("identity"))) && { b <- built(); !is.null(b) && { y <- b$data[[1]]$y; y <- y[!is.na(y)]; length(y) == 4 && isTRUE(all.equal(sort(abs(y)), c(0.04715669, 0.06053881, 0.12797861, 0.2102315), tolerance = 1e-4)) } }', m: '9. 마지막 그림: 4~7글자의 (2음절 − 1음절) 차이 막대 4개' },
          { r: 'lab_set("x") && lab_set("y") && lab_set("title")', m: '9번 그림의 축 이름과 제목' },
        ], sol: `trials <- read_csv("QuantAnalysis_data/QuantAnalysis_dutch_trials.csv")
stims <- read_csv("QuantAnalysis_data/QuantAnalysis_dutch_stims.csv")

# 1
data <- trials %>%
  left_join(stims, by = "spelling")
nrow(data)

# 2
data <- data %>%
  filter(response == "W")
nrow(data)

# 3
data <- data %>%
  group_by(participant) %>%
  mutate(rt_z = as.numeric(scale(rt.raw))) %>%
  ungroup()

# 4
data_trim <- data %>%
  filter(abs(rt_z) <= 2.5)
(nrow(data) - nrow(data_trim)) / nrow(data) * 100

# 5
data_trim <- data_trim %>%
  filter(!is.na(nsyl)) %>%
  mutate(nsyl = as_factor(nsyl))
word_rts <- data_trim %>%
  group_by(spelling, OLD20, subtlex.log10.frequency, nchar, nsyl) %>%
  summarise(mean_rt_z = mean(rt_z), .groups = "drop")

# 6
ggplot(word_rts, aes(x = nchar, y = mean_rt_z, color = nsyl)) +
  geom_point(position = position_jitter(width = 0.3, height = 0), alpha = 0.2) +
  geom_smooth(method = "lm", se = FALSE, linewidth = 2) +
  labs(x = "Word length (number of characters)", y = "Mean reaction time (z-score)",
       title = "Reaction time by word length and number of syllables") +
  theme_bw()

# 7
length_rts <- word_rts %>%
  group_by(nchar, nsyl) %>%
  summarise(mean_rt_z = mean(mean_rt_z), n = n(), .groups = "drop")

# 8
ggplot(length_rts, aes(x = nchar, y = mean_rt_z)) +
  geom_col() +
  facet_wrap(~nsyl, labeller = label_both) +
  labs(x = "Word length (number of characters)", y = "Mean reaction time (z-score)",
       title = "Mean reaction time by word length and number of syllables") +
  theme_bw()
length_rts_15 <- length_rts %>%
  filter(n >= 15)
ggplot(length_rts_15, aes(x = nchar, y = mean_rt_z)) +
  geom_col() +
  facet_wrap(~nsyl, labeller = label_both) +
  labs(x = "Word length (number of characters)", y = "Mean reaction time (z-score)",
       title = "Mean reaction time by word length and number of syllables (15+ words)") +
  theme_bw()

# 9
length_diff <- length_rts_15 %>%
  select(nchar, nsyl, mean_rt_z) %>%
  mutate(nsyl = fct_recode(nsyl, "syl1" = "1", "syl2" = "2")) %>%
  pivot_wider(names_from = nsyl, values_from = mean_rt_z) %>%
  mutate(diff = syl2 - syl1) %>%
  filter(!is.na(diff))
ggplot(length_diff, aes(x = nchar, y = diff)) +
  geom_col() +
  labs(x = "Word length (number of characters)",
       y = "RT difference in z-scores (2-syllable minus 1-syllable)",
       title = "Difference in mean reaction time between 2- and 1-syllable words") +
  theme_bw()`, solNote: '중간 출력: 1번 50000, 2번 41993, 4번 약 3.02(%). 그림 6·8번은 화면 위쪽에 차례로 나와요.' },
      ],
    },
  ],
});

RS.goals.push(
  { lesson: 'z-q1', src: 'HW1 (wk6)', title: '1. 두 표 붙이고 행 수' },
  { lesson: 'z-q2', src: 'HW1 (wk6)', title: '2. 정답 반응만' },
  { lesson: 'z-q3', src: 'HW1 (wk6)', title: '3. 참가자별 z점수' },
  { lesson: 'z-q4', src: 'HW1 (wk6)', title: '4. 2.5 SD 밖 제외와 비율' },
  { lesson: 'z-q5', src: 'HW1 (wk6)', title: '5. 단어별 평균 word_rts' },
  { lesson: 'z-q6', src: 'HW1 (wk6)', title: '6. 글자 수–RT 산점도' },
  { lesson: 'z-q7', src: 'HW1 (wk6)', title: '7. 길이별 평균 length_rts' },
  { lesson: 'z-q8', src: 'HW1 (wk6)', title: '8. 막대그래프와 비판' },
  { lesson: 'z-q9', src: 'HW1 (wk6)', title: '9. 음절 수 차이' },
  { lesson: 'z-all', src: 'HW1 (wk6)', title: '전체: 빈 화면에서 1–9번 한 번에' },
);
