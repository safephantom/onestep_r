/* 단원 V: wk3 Practice 2 — 논문 그림 따라 그리기 */

// ---- 준비 데이터 ----
// 실제 데이터가 있는 것: sib_merger(Lee-Kim & Chou), spectral_imitation_data(Kim & Clayards 모의 데이터, wk3 폴더).
// Davidson은 그림에 적힌 숫자를 그대로 옮겼고, 나머지는 논문 수치를 참고한 "연습용 모의 데이터"다.
RS.setups.spec6 = `df <- read_csv("spectral_imitation_data.csv", show_col_types = FALSE) %>%
  mutate(Category = factor(Category, levels = c("/ɛ/", "ambiguous", "/æ/")))`;

RS.setups.dav1 = `dav1 <- tibble(
  manner   = rep(c("fricative", "stop"), each = 9),
  position = rep(rep(c("word initial", "word medial", "word final"), each = 3), times = 2),
  voicing  = rep(c("voiced", "partial", "unvoiced"), times = 6),
  prop     = c(.50, .44, .06,  .51, .44, .05,  .21, .59, .20,
               .14, .51, .35,  .45, .45, .10,  .45, .40, .15)) %>%
  mutate(position = factor(position, levels = c("word initial", "word medial", "word final")),
         voicing  = factor(voicing, levels = c("unvoiced", "partial", "voiced")))`;

RS.setups.dav2 = `dav2 <- tibble(
  context = rep(c("(a) preceding vowel", "(b) following vowel"), each = 12),
  manner  = rep(rep(c("fric", "stop"), each = 6), times = 2),
  stress  = rep(rep(c("unstressed", "stressed"), each = 3), times = 4),
  voicing = rep(c("voiced", "partial", "unvoiced"), times = 8),
  prop    = c(.23, .59, .18,  .37, .51, .12,  .22, .58, .20,  .41, .38, .21,
              .43, .50, .08,  .23, .57, .20,  .51, .36, .12,  .22, .53, .25)) %>%
  mutate(stress  = factor(stress, levels = c("unstressed", "stressed")),
         voicing = factor(voicing, levels = c("unvoiced", "partial", "voiced")))`;

RS.setups.dav3 = `dav3 <- tibble(
  manner  = rep(c("fricative", "stop"), times = c(15, 18)),
  prev    = c(rep(c("sonor", "nasal", "vcdfric", "vcdstop", "vclsstop"), each = 3),
              rep(c("sonor", "nasal", "vcdfric", "vcdstop", "vclsfric", "vclsstop"), each = 3)),
  voicing = rep(c("voiced", "partial", "unvoiced"), times = 11),
  prop    = c(.35, .54, .11,  .16, .52, .32,  .30, .61, .09,  .23, .46, .31,  .53, .35, .12,
              .34, .53, .13,  .61, .28, .11,  .03, .31, .66,  .28, .42, .30,  .01, .21, .78,  .05, .20, .75)) %>%
  mutate(prev    = factor(prev, levels = c("sonor", "nasal", "vcdfric", "vcdstop", "vclsfric", "vclsstop")),
         voicing = factor(voicing, levels = c("unvoiced", "partial", "voiced")))`;

RS.setups.dav4 = `dav4 <- tibble(
  position = rep(c("word initial", "word medial", "word final"), times = 2),
  manner   = rep(c("Stops", "Frics"), each = 3),
  prop     = c(.500, .490, .355,  .455, .510, .495),
  se       = c(.025, .010, .007,  .007, .007, .013)) %>%
  mutate(position = factor(position, levels = c("word initial", "word medial", "word final")),
         manner   = factor(manner, levels = c("Stops", "Frics")))`;

RS.setups.kpogo = `set.seed(2025)
kpogo <- tibble(
  group    = rep(c("adults", "children"), each = 480),
  stoptype = rep(rep(c("simplex", "complex"), each = 240), times = 2),
  voicing  = rep(rep(c("voiceless stops", "voiced stops"), each = 120), times = 4),
  context  = rep(rep(c("phrase-initial context", "phrase-medial context"), each = 60), times = 8)) %>%
  mutate(f0 = ifelse(group == "adults", 200, 360) +
              ifelse(voicing == "voiced stops" & group == "adults", -8, 0) +
              ifelse(stoptype == "complex" & group == "children", 18, 0) +
              rnorm(n(), 0, ifelse(group == "adults", 42, 60)),
         stoptype = factor(stoptype, levels = c("simplex", "complex")),
         voicing  = factor(voicing, levels = c("voiceless stops", "voiced stops")))`;

RS.setups.strand = `set.seed(2021)
cells <- tibble(
  group = rep(c("bilingual", "monolingual"), each = 6),
  style = rep(rep(c("minimal pairs", "reading", "spontaneous speech"), each = 2), times = 2),
  vowel = rep(c("close", "open"), times = 6),
  f2 = c(1830, 1560,  1800, 1540,  1740, 1640,   1840, 1470,  1810, 1470,  1760, 1500),
  f1 = c( 405,  400,   410,  425,   395,  390,    405,  430,   400,  440,   400,  420),
  n  = rep(c(23, 35), each = 6))
strand <- cells[rep(seq_len(nrow(cells)), cells$n), ] %>%
  mutate(F2 = round(rnorm(n(), f2, 75)),
         F1 = round(rnorm(n(), f1, 22))) %>%
  select(group, style, vowel, F1, F2)`;

RS.setups.chung = `set.seed(2012)
cells <- expand.grid(age = c("2-year-olds", "5-year-olds", "Adults"),
                     vowel = c("a", "i", "u"),
                     language = c("Cantonese", "English", "Greek", "Japanese", "Korean"),
                     stringsAsFactors = FALSE)
cells$m <- c(.400, .466, .477,  .478, .682, .759,  .425, .640, .710,
             .515, .520, .494,  .437, .495, .490,  .454, .424, .337,
             .398, .404, .403,  .536, .559, .550,  .524, .565, .501,
             .374, .412, .452,  .362, .387, .422,  .324, .301, .347,
             .366, .386, .421,  .393, .477, .516,  .417, .478, .483)
chung <- as_tibble(cells[rep(seq_len(nrow(cells)), each = 40), ]) %>%
  mutate(radius = rnorm(n(), m, ifelse(age == "Adults", .07, ifelse(age == "5-year-olds", .10, .16))),
         age = factor(age, levels = c("Adults", "5-year-olds", "2-year-olds"))) %>%
  select(language, vowel, age, radius)`;

RS.setups.adem11 = `set.seed(2026)
adem11 <- tibble(
  model = rep(c("Static", "Direction-only", "Dynamic", "Combined"), each = 38),
  accuracy = sample(0:4, 152, replace = TRUE, prob = c(.14, .42, .34, .08, .02)) * 100 / 7) %>%
  mutate(model = factor(model, levels = c("Static", "Direction-only", "Dynamic", "Combined")))`;

RS.setups.adem13 = `set.seed(2026)
adem13 <- tibble(
  Model = rep(c("Static", "Direction-only", "Dynamic", "Combined"), each = 10),
  Accuracy = round(rnorm(40, rep(c(15.2, 14.8, 15.6, 14.7), each = 10),
                             rep(c(1.57, 2.46, 1.96, 1.79), each = 10)), 1))`;

RS.setups.pa1 = `set.seed(2018)
pa1 <- tibble(
  condition = rep(c("Condition 1", "Condition 2"), each = 500),
  value = c(rnorm(500, 450, 48), 400 + rnorm(500, 0, 14) + rexp(500, 1/46)))
pa1_sum <- pa1 %>%
  group_by(condition) %>%
  summarise(m = mean(value), sd = sd(value))`;

RS.setups.pa2 = `set.seed(2018)
pa2 <- bind_rows(
  tibble(panel = "Different SD", condition = rep(c("Condition 1", "Condition 2"), each = 40),
         value = c(rnorm(40, 15, 2.5), rnorm(40, 17.5, 7))),
  tibble(panel = "Different N", condition = rep(c("Condition 1", "Condition 2"), times = c(40, 4)),
         value = c(rnorm(40, 15, 2.5), rnorm(4, 18, 2.5)))) %>%
  mutate(panel = factor(panel, levels = c("Different SD", "Different N")))
pa2_sum <- pa2 %>%
  group_by(panel, condition) %>%
  summarise(m = mean(value), ci = qt(.975, n() - 1) * sd(value) / sqrt(n()), .groups = "drop")`;

const MOCK = '**연습용 모의 데이터**예요 (논문의 실제 데이터가 아니라, 보고된 수치를 참고해 만든 가짜 데이터). 목표는 **그림의 형식**을 재현하는 것이에요.';

RS.units.push({
  id: 'v',
  title: 'Practice 2: 논문 그림 따라 그리기',
  short: 'Kim & Clayards, Lee-Kim & Chou, Kpogo & Chang, Strandberg, Chung, Davidson, Adem, Politzer-Ahles',
  desc: 'wk3_ggplot_practice.R 117–127행의 목록. 각 레슨은 **원본 그림의 위치(PDF 쪽)** → 그림을 요소로 쪼개기 → 목표 그림(ggplot으로 재현) → 직접 쓰기 순서예요. 원본 PDF를 옆에 띄워 두고 보세요 (`wk3_practice2 plot examples/`).',
  lessons: [
    {
      id: 'v-kim-debug',
      title: 'wk3/practice.R 해부: 왜 원하는 그림이 안 나올까',
      src: 'wk3/practice.R (Kim & Clayards Fig. 6 연습 중인 코드)',
      key: '세 가지 문제: (1) aes에 **축 제목 글자**를 넣음, (2) 숫자 열 Duration을 fill에 그대로 넣음, (3) 색 값이 중복. 각각 B·C·U단원의 개념이다.',
      setup: [],
      body: [
        { code: `df <- read_csv("./spectral_imitation_data.csv")

ggplot(df, aes(x="Target vowel duration (ms)", y="Degree of spectral imitation (Hz)")) +
  geom_violin(aes(fill=Duration), color="grey", alpha=0.85) +
  scale_fill_manual(values=c("#A6D96A", "#66C2A5", "#3288BD", "#3288BD", "#08519C")) +
  labs(
    x="Target vowel duration (ms)",
    y="Degree of spectral imitation (Hz)"
  ) +
  theme_bw(base_size=14) +
  theme(
    legend.position="none",
  )`, cap: 'wk3/practice.R 그대로 실행한 결과' },
        '무슨 일이 일어났는지:',
        '1. **`aes(x = "Target vowel …", y = "Degree of …")`**: 따옴표 글자는 열이 아니라 **모든 행에서 같은 값**이에요 ([[b-quotes|B단원]]). x도 y도 범주 하나 → 데이터 없는 바이올린 한 개. y 값(SpectralImitation_Hz)이 아예 들어가지 않았어요.\n2. **`fill = Duration`**: Duration은 `<dbl>`(숫자) → 연속 → violin이 그룹을 못 나눠 fill을 버림 (경고 "aesthetics were dropped") ([[c-discrete|C단원]]). `factor(Duration)`이 필요해요.\n3. **`values = c(…, "#3288BD", "#3288BD", …)`**: 3·4번째 색이 같아요 — 220ms와 300ms가 같은 색이 돼요.\n4. 원본 Fig. 6E에는 박스플롯, 회귀선, Category별 패널이 더 있어요 (다음 레슨).',
        '고친 최소 버전:',
        { code: `df <- read_csv("./spectral_imitation_data.csv", show_col_types = FALSE)

ggplot(df, aes(x = factor(Duration), y = SpectralImitation_Hz)) +
  geom_violin(aes(fill = factor(Duration)), color = "grey", alpha = 0.85) +
  scale_fill_manual(values = c("#A6D96A", "#66C2A5", "#3288BD", "#2171B5", "#08519C")) +
  labs(x = "Target vowel duration (ms)",
       y = "Degree of spectral imitation (Hz)") +
  theme_bw(base_size = 14) +
  theme(legend.position = "none")` },
      ],
      quiz: [
        { type: 'mcq', q: 'practice.R 그림에 바이올린이 **하나뿐인** 가장 직접적인 이유는?', opts: [
          { t: 'x와 y에 따옴표 글자(축 제목)를 넣어서 모든 행이 한 범주가 됐기 때문', ok: true, why: '축 제목은 labs()에, aes에는 열 이름을.' },
          { t: 'scale_fill_manual의 색이 중복돼서', why: '색 중복은 색만 같게 만들 뿐 바이올린 수와 무관.' },
          { t: 'theme_bw 때문에', why: '테마는 모양만 바꿔요.' },
        ] },
        { type: 'mcq', q: '`fill = Duration`에서 "aesthetics were dropped" 경고가 난 이유는?', opts: [
          { t: 'Duration이 숫자(연속)라서 violin이 그룹을 나누지 못해 fill을 버림', ok: true, why: '`factor(Duration)`으로 범주화.' },
          { t: 'Duration 열이 없어서', why: '열은 있어요 (없으면 에러).' },
          { t: 'alpha = 0.85 때문에', why: '투명도와 무관.' },
        ] },
      ],
    },
    {
      id: 'v-kim',
      title: 'Kim & Clayards (2019) Fig. 6: A, B, E',
      src: 'Kim_Clayard_2019.pdf 11쪽 (Language, Cognition and Neuroscience 34(6), p. 779) · 데이터: wk3/spectral_imitation_data.csv (모의)',
      key: '6A: Category별 바이올린 + 흰 박스. 6B: Duration별 바이올린 + 박스 + 회귀선. 6E: 6B를 Category별 패널로.',
      setup: 'spec6',
      body: [
        '데이터는 wk3 폴더의 `generate_data.R`이 논문 수치를 흉내 내 만든 **모의 데이터**예요. 준비 코드가 `df`를 읽고 Category 순서(/ɛ/, ambiguous, /æ/)를 factor로 맞춰 두었어요.',
        { table: { head: ['그림 요소', '코드'], rows: [
          ['범주별 바이올린 + 흰 박스', '`geom_violin(aes(fill = …))` + `geom_boxplot(width = 0.15, fill = "white")`'],
          ['duration을 범주로', '`x = factor(Duration)`'],
          ['빨간 회귀선 하나', '`geom_smooth(aes(group = 1), method = "lm", se = FALSE, color = "firebrick")` ([[u-group1|U단원]])'],
          ['Category별 패널 가로 한 줄', '`facet_wrap(~ Category, nrow = 1)`'],
          ['범례 없음', '`theme(legend.position = "none")`'],
        ] } },
      ],
      quiz: [
        { type: 'write', q: 'Fig. 6A: x = Category, y = SpectralImitation_Hz. Category별 색 바이올린 위에 흰 박스플롯(폭 0.15). 범례 없이, theme_classic()으로.', target: `ggplot(df, aes(x = Category, y = SpectralImitation_Hz)) +
  geom_violin(aes(fill = Category), alpha = 0.6) +
  geom_boxplot(width = 0.15, fill = "white") +
  labs(x = "Target vowel spectral quality", y = "Degree of spectral imitation (Hz)") +
  theme_classic() +
  theme(legend.position = "none")`, checks: [
          { r: 'maps("x", "Category") && maps("y", "SpectralImitation_Hz")', m: 'x = Category, y = SpectralImitation_Hz' },
          { r: 'maps("fill", "Category", "violin")', m: '바이올린 fill = Category' },
          { r: 'geom_order("violin", "boxplot") && has_param("boxplot", "fill", "white")', m: '바이올린 위에 흰 박스플롯' },
          { r: 'legend_none()', m: '범례 없음' },
          { r: 'theme_is("classic")', opt: true, m: '`theme_classic()`', ok: 'theme_classic() 적용' },
        ], sol: `ggplot(df, aes(x = Category, y = SpectralImitation_Hz)) +
  geom_violin(aes(fill = Category), alpha = 0.6) +
  geom_boxplot(width = 0.15, fill = "white") +
  labs(x = "Target vowel spectral quality", y = "Degree of spectral imitation (Hz)") +
  theme_classic() +
  theme(legend.position = "none")` },
        { type: 'write', q: 'Fig. 6B: x = factor(Duration). Duration별 색 바이올린 + 흰 박스 + 빨간 회귀선 하나(띠 없음).', target: `ggplot(df, aes(x = factor(Duration), y = SpectralImitation_Hz)) +
  geom_violin(aes(fill = factor(Duration)), alpha = 0.6) +
  geom_boxplot(width = 0.15, fill = "white") +
  geom_smooth(aes(group = 1), method = "lm", se = FALSE, color = "firebrick") +
  labs(x = "Target vowel duration (ms)", y = "Degree of spectral imitation (Hz)") +
  theme_classic() +
  theme(legend.position = "none")`, checks: [
          { r: 'maps("x", "factor(Duration)")', m: 'x = factor(Duration)' },
          { r: 'maps("fill", "factor(Duration)", "violin")', m: '바이올린 fill = factor(Duration)' },
          { r: 'has_geom("boxplot") && geom_order("violin", "boxplot")', m: '바이올린 위에 박스플롯' },
          { r: 'has_geom("smooth") && identical(param("smooth", "method"), "lm")', m: '`geom_smooth(method = "lm")`' },
          { r: 'maps("group", "1", "smooth")', m: '회귀선 하나로 묶기 `aes(group = 1)`' },
        ], sol: `ggplot(df, aes(x = factor(Duration), y = SpectralImitation_Hz)) +
  geom_violin(aes(fill = factor(Duration)), alpha = 0.6) +
  geom_boxplot(width = 0.15, fill = "white") +
  geom_smooth(aes(group = 1), method = "lm", se = FALSE, color = "firebrick") +
  labs(x = "Target vowel duration (ms)", y = "Degree of spectral imitation (Hz)") +
  theme_classic() +
  theme(legend.position = "none")`, solNote: 'fill을 전역(ggplot 안)에 두면 geom_smooth도 fill을 물려받아 "aesthetics were dropped" 경고가 나요. 그래서 fill은 바이올린 층에만 두었어요 ([[h-extend|H단원]]).' },
        { type: 'write', q: 'Fig. 6E: 6B를 **Category별 패널(가로 한 줄)**로 나누세요.', target: `ggplot(df, aes(x = factor(Duration), y = SpectralImitation_Hz)) +
  geom_violin(aes(fill = factor(Duration)), alpha = 0.6) +
  geom_boxplot(width = 0.15, fill = "white", outlier.size = 0.8) +
  geom_smooth(aes(group = 1), method = "lm", se = FALSE, color = "firebrick") +
  facet_wrap(~ Category, nrow = 1) +
  labs(x = "Target vowel duration (ms)", y = "Degree of spectral imitation (Hz)") +
  theme_classic() +
  theme(legend.position = "none")`, checks: [
          { r: 'maps("x", "factor(Duration)") && has_geom("violin") && has_geom("boxplot")', m: '6B의 바이올린 + 박스' },
          { r: 'has_geom("smooth") && maps("group", "1", "smooth")', m: '패널마다 회귀선 하나 (`aes(group = 1)`)' },
          { r: 'facet_has("Category")', m: '`facet_wrap(~ Category)`' },
          { r: 'identical(facet_nrow(), 1) || identical(facet_nrow(), 1L)', m: '패널을 가로 한 줄로 (`nrow = 1`)' },
        ], sol: `ggplot(df, aes(x = factor(Duration), y = SpectralImitation_Hz)) +
  geom_violin(aes(fill = factor(Duration)), alpha = 0.6) +
  geom_boxplot(width = 0.15, fill = "white", outlier.size = 0.8) +
  geom_smooth(aes(group = 1), method = "lm", se = FALSE, color = "firebrick") +
  facet_wrap(~ Category, nrow = 1) +
  labs(x = "Target vowel duration (ms)", y = "Degree of spectral imitation (Hz)") +
  theme_classic() +
  theme(legend.position = "none")` },
      ],
    },
    {
      id: 'v-leekim',
      title: 'Lee-Kim & Chou (2002) Fig. 6: 병합 화자의 조건별 분포',
      src: 'LeeKim_Chou_2002.pdf 25쪽 · 데이터: sib_merger.csv (**실제 데이터**)',
      key: 'wk4 practice plot과 같은 데이터·같은 5명. 다른 점: 패널 순서·제목("Subj. CSY"), 평균 ± 1 SE 오차 막대, 패널마다 y축(free_y).',
      setup: 'sibmerger',
      body: [
        { table: { head: ['wk4 practice plot과 다른 점', '코드'], rows: [
          ['패널 순서 CSY, C21, XSJ, E63, TFH + 제목 "Subj. …"', '`factor(subject, levels = c(…), labels = c("Subj. CSY", …))`'],
          ['평균 ± 1 SE', '`stat_summary(fun.data = mean_se, geom = "errorbar", width = 0.2)` ([[u-meanse|U단원]])'],
          ['패널마다 y축', '`facet_wrap(~ subject, scales = "free_y")` ([[u-free|U단원]])'],
          ['y축 제목만, x축 제목 없음', '`labs(x = "", y = "spectral mean (Hz)")`'],
        ] } },
      ],
      quiz: [
        { type: 'write', q: 'Fig. 6를 그리세요. (wk4 practice plot 코드에서 출발해 위 표의 차이만 바꾸면 돼요.)', given: `sibmerger <- read_csv("QuantAnalysis_data/sib_merger.csv")`, target: `sibmerger %>%
  filter(task == "interactive",
         subject %in% c("CSY", "C21", "XSJ", "E63", "TFH")) %>%
  mutate(condition = factor(condition,
                            levels = c("control", "nw", "nc", "yc"),
                            labels = c("Control", "NoComp", "NoCont", "Context")),
         subject = factor(subject,
                          levels = c("CSY", "C21", "XSJ", "E63", "TFH"),
                          labels = c("Subj. CSY", "Subj. C21", "Subj. XSJ", "Subj. E63", "Subj. TFH"))) %>%
  ggplot(aes(x = condition, y = midSpecMean)) +
  geom_violin() +
  geom_jitter(aes(color = place), shape = 1, width = 0.1, height = 0, size = 1) +
  stat_summary(fun = mean, geom = "point", size = 2) +
  stat_summary(fun.data = mean_se, geom = "errorbar", width = 0.2) +
  scale_color_manual(values = c("grey50", "black")) +
  facet_wrap(~ subject, scales = "free_y") +
  labs(x = "", y = "spectral mean (Hz)") +
  theme(legend.position = "none")`, checks: [
          { r: 'x_order(c("Control", "NoComp", "NoCont", "Context"))', m: 'x축 순서: Control, NoComp, NoCont, Context' },
          { r: 'cond_ok()', m: '라벨 짝 확인: control → Control, **nw → NoComp**, **nc → NoCont**, yc → Context (levels와 labels는 같은 위치끼리 짝)' },
          { r: 'has_geom("violin") && jittered()', m: '바이올린 + 흔들린 개별 점' },
          { r: 'has_stat("summary")', m: '평균 (stat_summary)' },
          { r: 'has_geom("errorbar")', m: '오차 막대 (`fun.data = mean_se, geom = "errorbar"`)' },
          { r: 'facet_has("subject") && facet_free("y")', m: '`facet_wrap(~ subject, scales = "free_y")`' },
          { r: 'identical(as.character(data_unique("subject")), c("Subj. CSY", "Subj. C21", "Subj. XSJ", "Subj. E63", "Subj. TFH"))', opt: true, m: '패널 제목·순서 "Subj. CSY" … (factor의 levels/labels)', ok: '패널 제목과 순서까지 맞췄어요' },
        ], sol: `sibmerger %>%
  filter(task == "interactive",
         subject %in% c("CSY", "C21", "XSJ", "E63", "TFH")) %>%
  mutate(condition = factor(condition,
                            levels = c("control", "nw", "nc", "yc"),
                            labels = c("Control", "NoComp", "NoCont", "Context")),
         subject = factor(subject,
                          levels = c("CSY", "C21", "XSJ", "E63", "TFH"),
                          labels = c("Subj. CSY", "Subj. C21", "Subj. XSJ", "Subj. E63", "Subj. TFH"))) %>%
  ggplot(aes(x = condition, y = midSpecMean)) +
  geom_violin() +
  geom_jitter(aes(color = place), shape = 1, width = 0.1, height = 0, size = 1) +
  stat_summary(fun = mean, geom = "point", size = 2) +
  stat_summary(fun.data = mean_se, geom = "errorbar", width = 0.2) +
  scale_color_manual(values = c("grey50", "black")) +
  facet_wrap(~ subject, scales = "free_y") +
  labs(x = "", y = "spectral mean (Hz)") +
  theme(legend.position = "none")` },
      ],
    },
    {
      id: 'v-kpogo',
      title: 'Kpogo & Chang (2025) Fig. 5: 두 요인 격자 + 나란한 바이올린',
      src: 'Kpogo_Chang_2025.pdf 12쪽 (Journal of Phonetics 108, 101378)',
      key: 'x = group, fill = stop type(나란한 바이올린), 속 빈 원 = 평균(같은 폭으로 dodge), 패널 = context(행) × voicing(열).',
      setup: 'kpogo',
      body: [
        MOCK,
        { table: { head: ['그림 요소', '코드'], rows: [
          ['adults/children × simplex/complex 바이올린', '`aes(x = group, y = f0, fill = stoptype)` + `geom_violin()`'],
          ['바이올린마다 속 빈 평균 원', '`stat_summary(fun = mean, geom = "point", shape = 1, position = position_dodge(0.9))` ([[u-dodge|U단원]])'],
          ['행 = context, 열 = voicing', '`facet_grid(context ~ voicing)` ([[f-grid|F단원]])'],
          ['노랑/보라', '`scale_fill_manual(values = c("#FBE7A1", "#7E6BB5"))` ([[u-manual|U단원]])'],
          ['흰 배경', '`theme_bw()`'],
        ] } },
      ],
      quiz: [
        { type: 'write', q: 'Fig. 5를 그리세요. 데이터 `kpogo`: group, stoptype, voicing, context, f0.', target: `ggplot(kpogo, aes(x = group, y = f0, fill = stoptype)) +
  geom_violin() +
  stat_summary(fun = mean, geom = "point", shape = 1,
               position = position_dodge(width = 0.9)) +
  facet_grid(context ~ voicing) +
  scale_fill_manual(values = c("#FBE7A1", "#7E6BB5")) +
  labs(x = "Group", y = "F0 (Hz)", fill = "Stop Type") +
  theme_bw()`, checks: [
          { r: 'maps("x", "group") && maps("y", "f0") && maps("fill", "stoptype", "violin")', m: 'x = group, y = f0, fill = stoptype' },
          { r: 'has_geom("violin")', m: '바이올린' },
          { r: 'has_stat("summary") && has_param("point", "shape", 1)', m: '속 빈 원(shape = 1)으로 평균' },
          { r: 'pos_is("point", "dodge")', m: '평균 원도 dodge해서 각 바이올린 위에 (`position_dodge(width = 0.9)`)' },
          { r: 'identical(facet_rows(), "context") && identical(facet_cols(), "voicing")', m: '`facet_grid(context ~ voicing)`' },
          { r: 'theme_is("bw")', opt: true, m: '`theme_bw()`', ok: 'theme_bw() 적용' },
        ], sol: `ggplot(kpogo, aes(x = group, y = f0, fill = stoptype)) +
  geom_violin() +
  stat_summary(fun = mean, geom = "point", shape = 1,
               position = position_dodge(width = 0.9)) +
  facet_grid(context ~ voicing) +
  scale_fill_manual(values = c("#FBE7A1", "#7E6BB5")) +
  labs(x = "Group", y = "F0 (Hz)", fill = "Stop Type") +
  theme_bw()` },
      ],
    },
    {
      id: 'v-strand',
      title: 'Strandberg et al. (2021) Fig. 2: 모음 도표 + 95% 타원',
      src: 'Strandberga_EtAl_2021.pdf 11쪽 (Journal of Phonetics 88, 101095)',
      key: 'x = F2(뒤집기), y = F1(뒤집기), color = vowel, 점 + stat_ellipse, 패널 = group(행) × style(열).',
      setup: 'strand',
      body: [
        MOCK,
        { table: { head: ['그림 요소', '코드'], rows: [
          ['F2 가로(큰 값이 왼쪽), F1 세로(큰 값이 아래)', '`aes(x = F2, y = F1)` + `scale_x_reverse()` + `scale_y_reverse()` ([[u-reverse|U단원]])'],
          ['close/open 색 점', '`aes(color = vowel)` + `geom_point()`'],
          ['95% 타원', '`stat_ellipse()` ([[u-ellipse|U단원]])'],
          ['행 = bilingual/monolingual, 열 = 세 발화 스타일', '`facet_grid(group ~ style)`'],
        ] } },
      ],
      quiz: [
        { type: 'write', q: 'Fig. 2를 그리세요. 데이터 `strand`: group, style, vowel, F1, F2.', target: `ggplot(strand, aes(x = F2, y = F1, color = vowel)) +
  geom_point(size = 1.5) +
  stat_ellipse() +
  scale_x_reverse() +
  scale_y_reverse() +
  facet_grid(group ~ style) +
  labs(color = "Vowel") +
  theme_bw()`, checks: [
          { r: 'maps("x", "F2") && maps("y", "F1") && maps("colour", "vowel")', m: 'x = F2, y = F1, color = vowel' },
          { r: 'has_geom("point") && has_stat("ellipse")', m: '점 + `stat_ellipse()`' },
          { r: 'any(grepl("reverse", scale_fns()))', m: '축 뒤집기 (`scale_x_reverse()`, `scale_y_reverse()`)' },
          { r: 'sum(grepl("reverse", scale_fns())) >= 2', m: 'x와 y **둘 다** 뒤집기' },
          { r: 'identical(facet_rows(), "group") && identical(facet_cols(), "style")', m: '`facet_grid(group ~ style)`' },
        ], sol: `ggplot(strand, aes(x = F2, y = F1, color = vowel)) +
  geom_point(size = 1.5) +
  stat_ellipse() +
  scale_x_reverse() +
  scale_y_reverse() +
  facet_grid(group ~ style) +
  labs(color = "Vowel") +
  theme_bw()` },
      ],
    },
    {
      id: 'v-chung',
      title: 'Chung et al. (2012) Fig. 4: 선 모양으로 구분한 밀도 곡선 격자',
      src: 'Chung_EtAl_2012.pdf 8쪽 (JASA 131(1), p. 448)',
      key: 'x = radius 밀도 곡선, linetype = age, 패널 = language(행) × vowel(열). 새 도구 없이 J·G·F단원만으로 된다.',
      setup: 'chung',
      body: [
        MOCK + ' 평균은 논문 Table VI의 값이에요.',
        '원본은 lattice라는 다른 그래픽 패키지로 그려서 모양(주황 띠, 눈금 위치)이 조금 달라요. 형식은 같아요: 실선 = 성인, 파선 = 5세, 점선 = 2세.',
      ],
      quiz: [
        { type: 'write', q: 'Fig. 4를 그리세요. 데이터 `chung`: language, vowel, age, radius.', target: `ggplot(chung, aes(x = radius, linetype = age)) +
  geom_density() +
  facet_grid(language ~ vowel) +
  labs(x = "Radius", y = "Density", linetype = NULL) +
  theme_bw() +
  theme(legend.position = "top")`, checks: [
          { r: 'has_geom("density") && maps("x", "radius")', m: '`geom_density()`, x = radius' },
          { r: 'maps("linetype", "age")', m: '선 모양 = age ([[g-linetype|G단원]])' },
          { r: 'identical(facet_rows(), "language") && identical(facet_cols(), "vowel")', m: '`facet_grid(language ~ vowel)`' },
        ], sol: `ggplot(chung, aes(x = radius, linetype = age)) +
  geom_density() +
  facet_grid(language ~ vowel) +
  labs(x = "Radius", y = "Density", linetype = NULL) +
  theme_bw() +
  theme(legend.position = "top")` },
      ],
    },
    {
      id: 'v-davidson',
      title: 'Davidson (2016) Fig. 1–4: 비율 막대와 오차 막대',
      src: 'Davidson_2016.pdf 7–8쪽 (Journal of Phonetics 54, pp. 41–42)',
      key: 'Fig. 1–3: 이미 계산된 비율을 **쌓은 막대**(geom_col) + 회색조. Fig. 4: 평균을 **나란한 막대** + ±SE 오차 막대.',
      body: [
        '데이터는 **그림에 적힌 숫자를 그대로** 옮겼어요 (Fig. 3의 아주 작은 값 일부는 눈대중). voicing 순서(unvoiced 위, voiced 아래)와 x축 순서는 준비 코드에서 factor로 맞춰 두었어요.',
        { table: { head: ['그림', '코드'], rows: [
          ['비율을 그대로 막대 높이로 쌓기', '`geom_col()` (= stat identity, [[u-errorbar|U단원]]) — 쌓기가 기본'],
          ['회색 세 단계', '`scale_fill_manual(values = c("grey55", "grey85", "grey20"))`'],
          ['fricative / stop 나누기', '`facet_wrap(~ manner)` 또는 `facet_grid(context ~ manner)`'],
          ['Fig. 4 나란한 막대 + 오차', '`geom_col(position = "dodge")` + `geom_errorbar(…, position = position_dodge(0.9))` ([[u-errorbar|U단원]], [[u-dodge|U단원]])'],
        ] } },
      ],
      quiz: [
        { type: 'write', q: 'Fig. 1: 데이터 `dav1` (manner, position, voicing, prop). x = position, 비율을 쌓은 막대, manner별 패널, 회색조.', setup: 'dav1', target: `ggplot(dav1, aes(x = position, y = prop, fill = voicing)) +
  geom_col(color = "white") +
  facet_wrap(~ manner) +
  scale_fill_manual(values = c("grey55", "grey85", "grey20")) +
  labs(x = "", y = "", fill = "") +
  theme_classic() +
  theme(legend.position = "top")`, checks: [
          { r: 'maps("x", "position") && maps("y", "prop") && maps("fill", "voicing")', m: 'x = position, y = prop, fill = voicing' },
          { r: 'has_geom(c("col", "bar")) && has_stat("identity")', m: '값 그대로 막대: `geom_col()` (또는 `geom_bar(stat = "identity")`)' },
          { r: 'pos_is(c("col", "bar"), "stack")', m: '쌓기 (position 기본값)' },
          { r: 'facet_has("manner")', m: 'manner별 패널' },
          { r: 'has_scale("scale_fill_manual") || has_scale("scale_fill_grey")', opt: true, m: '회색조 (`scale_fill_manual`)', ok: '회색조 적용' },
        ], sol: `ggplot(dav1, aes(x = position, y = prop, fill = voicing)) +
  geom_col(color = "white") +
  facet_wrap(~ manner) +
  scale_fill_manual(values = c("grey55", "grey85", "grey20")) +
  labs(x = "", y = "", fill = "") +
  theme_classic() +
  theme(legend.position = "top")` },
        { type: 'write', q: 'Fig. 2: 데이터 `dav2` (context, manner, stress, voicing, prop). 위: 앞 모음 강세, 아래: 뒤 모음 강세 → `facet_grid(context ~ manner)`.', setup: 'dav2', target: `ggplot(dav2, aes(x = stress, y = prop, fill = voicing)) +
  geom_col(color = "white") +
  facet_grid(context ~ manner) +
  scale_fill_manual(values = c("grey55", "grey85", "grey20")) +
  labs(x = "", y = "", fill = "") +
  theme_classic()`, checks: [
          { r: 'maps("x", "stress") && maps("y", "prop") && maps("fill", "voicing")', m: 'x = stress, y = prop, fill = voicing' },
          { r: 'has_geom(c("col", "bar")) && has_stat("identity")', m: '`geom_col()`' },
          { r: 'identical(facet_rows(), "context") && identical(facet_cols(), "manner")', m: '`facet_grid(context ~ manner)`' },
        ], sol: `ggplot(dav2, aes(x = stress, y = prop, fill = voicing)) +
  geom_col(color = "white") +
  facet_grid(context ~ manner) +
  scale_fill_manual(values = c("grey55", "grey85", "grey20")) +
  labs(x = "", y = "", fill = "") +
  theme_classic()` },
        { type: 'write', q: 'Fig. 3: 데이터 `dav3` (manner, prev, voicing, prop). x = 앞 분절음(prev).', setup: 'dav3', target: `ggplot(dav3, aes(x = prev, y = prop, fill = voicing)) +
  geom_col(color = "white") +
  facet_wrap(~ manner) +
  scale_fill_manual(values = c("grey55", "grey85", "grey20")) +
  labs(x = "", y = "", fill = "") +
  theme_classic()`, checks: [
          { r: 'maps("x", "prev") && maps("y", "prop") && maps("fill", "voicing")', m: 'x = prev, y = prop, fill = voicing' },
          { r: 'has_geom(c("col", "bar")) && has_stat("identity")', m: '`geom_col()`' },
          { r: 'facet_has("manner")', m: 'manner별 패널' },
        ], sol: `ggplot(dav3, aes(x = prev, y = prop, fill = voicing)) +
  geom_col(color = "white") +
  facet_wrap(~ manner) +
  scale_fill_manual(values = c("grey55", "grey85", "grey20")) +
  labs(x = "", y = "", fill = "") +
  theme_classic()`, solNote: 'fricative에는 vclsfric 조건이 없어서 fricative 패널에 빈자리가 하나 생겨요 (원본도 fricative 쪽 막대가 5개).' },
        { type: 'write', q: 'Fig. 4: 데이터 `dav4` (position, manner, prop, se). Stops/Frics 막대를 **나란히**, 위에 **±SE** 오차 막대.', setup: 'dav4', target: `ggplot(dav4, aes(x = position, y = prop, fill = manner)) +
  geom_col(position = "dodge") +
  geom_errorbar(aes(ymin = prop - se, ymax = prop + se),
                position = position_dodge(width = 0.9), width = 0.1) +
  scale_fill_manual(values = c("grey40", "grey80")) +
  labs(x = "", y = "", fill = "") +
  theme_classic()`, checks: [
          { r: 'maps("x", "position") && maps("y", "prop") && maps("fill", "manner")', m: 'x = position, y = prop, fill = manner' },
          { r: 'has_geom(c("col", "bar")) && pos_is(c("col", "bar"), c("dodge", "dodge2"))', m: '나란한 막대 (`position = "dodge"`)' },
          { r: 'has_geom("errorbar") && maps("ymin", "prop - se", "errorbar") && maps("ymax", "prop + se", "errorbar")', m: '`geom_errorbar(aes(ymin = prop - se, ymax = prop + se))`' },
          { r: 'pos_is("errorbar", c("dodge", "dodge2"))', m: '오차 막대도 dodge해서 각 막대 위에 (`position_dodge(width = 0.9)`)' },
        ], sol: `ggplot(dav4, aes(x = position, y = prop, fill = manner)) +
  geom_col(position = "dodge") +
  geom_errorbar(aes(ymin = prop - se, ymax = prop + se),
                position = position_dodge(width = 0.9), width = 0.1) +
  scale_fill_manual(values = c("grey40", "grey80")) +
  labs(x = "", y = "", fill = "") +
  theme_classic()` },
      ],
    },
    {
      id: 'v-adem',
      title: 'Adem (2025) Fig. 11, 13: 박스 + 점, 바이올린 + 박스 + 색 점',
      src: 'Adem_2025.pdf 24–25쪽 (Journal of Phonetics 114, 101471)',
      key: 'Fig. 11: 회색 박스플롯 위 jitter 점, theme_minimal. Fig. 13: 회색 바이올린 + 좁은 박스 + 연속 변수로 칠한 점(plasma).',
      body: [
        MOCK + ' Fig. 11의 정확도가 14.3의 배수로 뭉쳐 있는 것(화자당 토큰 7개라서)도 흉내 냈어요.',
      ],
      quiz: [
        { type: 'write', q: 'Fig. 11: 데이터 `adem11` (model, accuracy). 회색 박스플롯 + 흔들린 검은 점, theme_minimal.', setup: 'adem11', target: `ggplot(adem11, aes(x = model, y = accuracy)) +
  geom_boxplot(fill = "grey75") +
  geom_jitter(width = 0.2, height = 1, alpha = 0.7) +
  labs(x = "Model Type", y = "Classification Accuracy (%)") +
  theme_minimal(base_size = 14)`, checks: [
          { r: 'maps("x", "model") && maps("y", "accuracy")', m: 'x = model, y = accuracy' },
          { r: 'has_geom("boxplot") && has_param("boxplot", "fill")', m: '회색으로 **설정**한 박스플롯 (`fill = "grey75"` 등)' },
          { r: 'jittered() && geom_order("boxplot", "point")', m: '박스 위에 흔들린 점' },
          { r: 'theme_is("minimal")', m: '`theme_minimal()`' },
          { r: 'lab_is("y", "Classification Accuracy (%)")', opt: true, m: 'y축 제목 "Classification Accuracy (%)"', ok: '축 제목까지 맞췄어요' },
        ], sol: `ggplot(adem11, aes(x = model, y = accuracy)) +
  geom_boxplot(fill = "grey75") +
  geom_jitter(width = 0.2, height = 1, alpha = 0.7) +
  labs(x = "Model Type", y = "Classification Accuracy (%)") +
  theme_minimal(base_size = 14)` },
        { type: 'write', q: 'Fig. 13: 데이터 `adem13` (Model, Accuracy). 연한 회색 바이올린 + 좁은 박스 + Accuracy 값으로 칠한 점(plasma).', setup: 'adem13', target: `ggplot(adem13, aes(x = Model, y = Accuracy)) +
  geom_violin(fill = "grey90") +
  geom_boxplot(width = 0.15) +
  geom_jitter(aes(color = Accuracy), width = 0.1, height = 0, size = 2) +
  scale_color_viridis_c(option = "plasma") +
  labs(y = "Accuracy (%)") +
  theme_minimal()`, checks: [
          { r: 'has_geom("violin") && has_geom("boxplot") && geom_order("violin", "boxplot")', m: '바이올린 위에 박스' },
          { r: 'param_between("boxplot", "width", 0.05, 0.3)', m: '좁은 박스 (`width = 0.15` 정도)' },
          { r: 'maps("colour", "Accuracy", "point")', m: '점 색 = Accuracy (연속 변수 매핑)' },
          { r: 'has_scale("scale_color_viridis_c") || has_scale("scale_colour_viridis_c")', m: '`scale_color_viridis_c(option = "plasma")` ([[u-viridis|U단원]])' },
        ], sol: `ggplot(adem13, aes(x = Model, y = Accuracy)) +
  geom_violin(fill = "grey90") +
  geom_boxplot(width = 0.15) +
  geom_jitter(aes(color = Accuracy), width = 0.1, height = 0, size = 2) +
  scale_color_viridis_c(option = "plasma") +
  labs(y = "Accuracy (%)") +
  theme_minimal()`, solNote: 'x축이 Combined → Direction-only → Dynamic → Static인 건 **알파벳 순**이라서예요. 원본 그림도 같은 순서예요.' },
      ],
    },
    {
      id: 'v-politzer',
      title: 'Politzer-Ahles & Piccinini (2018) Fig. 1, 2: 막대그래프가 숨기는 것',
      src: 'Politzer-Ahles_Piccinini_2018.pdf 3쪽 (Journal of Phonetics 70, p. 58)',
      key: 'Fig. 1: 같은 데이터를 ① 막대 ± SD, ② 박스플롯, ③ 개별 점으로. Fig. 2: 막대 + 개별 점 + 95% 신뢰구간 — 요약표(층 1·3)와 원자료(층 2)를 **한 그림에**.',
      body: [
        MOCK + ' 요약표(`pa1_sum`: m, sd / `pa2_sum`: m, ci)는 준비 코드가 만들어 두었어요.',
        '이 논문이 이 수업의 Practice 방향(개별 점을 꼭 보여라)의 근거예요. ①의 두 막대는 거의 같지만 ③을 보면 두 분포의 모양이 완전히 달라요.',
      ],
      quiz: [
        { type: 'write', q: 'Fig. 1 왼쪽: 요약표 `pa1_sum` (condition, m, sd)으로 막대 ± 1 SD.', setup: 'pa1', target: `ggplot(pa1_sum, aes(x = condition, y = m, fill = condition)) +
  geom_col(width = 0.9) +
  geom_errorbar(aes(ymin = m - sd, ymax = m + sd), width = 0.2) +
  scale_fill_manual(values = c("#7FD47F", "#DD7FDD")) +
  labs(x = "", y = "") +
  theme_classic() +
  theme(legend.position = "none")`, checks: [
          { r: 'maps("x", "condition") && maps("y", "m")', m: 'x = condition, y = m (요약표)' },
          { r: 'has_geom(c("col", "bar")) && has_stat("identity")', m: '값 그대로 막대 `geom_col()`' },
          { r: 'has_geom("errorbar") && maps("ymin", "m - sd", "errorbar") && maps("ymax", "m + sd", "errorbar")', m: '`geom_errorbar(aes(ymin = m - sd, ymax = m + sd))`' },
        ], sol: `ggplot(pa1_sum, aes(x = condition, y = m, fill = condition)) +
  geom_col(width = 0.9) +
  geom_errorbar(aes(ymin = m - sd, ymax = m + sd), width = 0.2) +
  scale_fill_manual(values = c("#7FD47F", "#DD7FDD")) +
  labs(x = "", y = "") +
  theme_classic() +
  theme(legend.position = "none")` },
        { type: 'write', q: 'Fig. 1 가운데·오른쪽: 원자료 `pa1` (condition, value)로 박스플롯을 그리고, 다음 줄에서 **같은 데이터의 개별 점** 그림(jitter, 색 = condition)도 그리세요.', setup: 'pa1', target: `ggplot(pa1, aes(x = condition, y = value, color = condition)) +
  geom_jitter(width = 0.25, height = 0, size = 0.8) +
  scale_color_manual(values = c("#2DB82D", "#B82DB8")) +
  labs(x = "", y = "") +
  theme_classic() +
  theme(legend.position = "none")`, checks: [
          { r: 'maps("x", "condition") && maps("y", "value")', m: '마지막 그림: x = condition, y = value' },
          { r: 'jittered() && maps("colour", "condition", "point")', m: '마지막 그림: 흔들린 점, color = condition' },
          { re: 'geom_boxplot', m: '박스플롯 그림도 그렸나요? (`geom_boxplot()`)' },
        ], sol: `ggplot(pa1, aes(x = condition, y = value, fill = condition)) +
  geom_boxplot() +
  theme_classic() +
  theme(legend.position = "none")

ggplot(pa1, aes(x = condition, y = value, color = condition)) +
  geom_jitter(width = 0.25, height = 0, size = 0.8) +
  scale_color_manual(values = c("#2DB82D", "#B82DB8")) +
  labs(x = "", y = "") +
  theme_classic() +
  theme(legend.position = "none")`, solNote: '원본의 "beeswarm"(점을 겹치지 않게 옆으로 펼침)은 수업 밖 패키지라, jitter로 비슷하게 흉내 냈어요. 채점은 마지막으로 만든 그림(개별 점)을 봐요.' },
        { type: 'write', q: 'Fig. 2: 요약표 `pa2_sum` (panel, condition, m, ci)로 흰 막대 + 95% CI를, 원자료 `pa2` (panel, condition, value)로 개별 점을 한 그림에. 패널 = panel.', setup: 'pa2', target: `ggplot(pa2_sum, aes(x = condition, y = m)) +
  geom_col(fill = "white", color = "black") +
  geom_jitter(data = pa2, aes(y = value), color = "#2DB82D", width = 0.15, height = 0) +
  geom_errorbar(aes(ymin = m - ci, ymax = m + ci), width = 0.2) +
  facet_wrap(~ panel) +
  labs(x = "", y = "") +
  theme_classic()`, checks: [
          { r: 'has_geom(c("col", "bar")) && has_param(c("col", "bar"), "fill", "white")', m: '흰 막대 (`geom_col(fill = "white", color = "black")`)' },
          { r: 'layer_own_data("point") && maps("y", "value", "point")', m: '점 층은 원자료: `geom_jitter(data = pa2, aes(y = value))` ([[h-data|H단원]])' },
          { r: 'has_geom("errorbar") && maps("ymin", "m - ci", "errorbar")', m: '`geom_errorbar(aes(ymin = m - ci, ymax = m + ci))`' },
          { r: 'facet_has("panel")', m: '`facet_wrap(~ panel)`' },
        ], sol: `ggplot(pa2_sum, aes(x = condition, y = m)) +
  geom_col(fill = "white", color = "black") +
  geom_jitter(data = pa2, aes(y = value), color = "#2DB82D", width = 0.15, height = 0) +
  geom_errorbar(aes(ymin = m - ci, ymax = m + ci), width = 0.2) +
  facet_wrap(~ panel) +
  labs(x = "", y = "") +
  theme_classic()`, solNote: '점 층에는 ggplot() 안의 매핑(x = condition, y = m)이 적용되지만, 층 안에 **y = value를 다시 써서 y만 바꾸고** 데이터도 pa2로 바꿨어요 (H단원 "층에 같은 aes를 다시 쓰면 그 층에서는 층의 값을 쓴다", "층마다 다른 데이터").' },
      ],
    },
  ],
});

RS.goals.push(
  { lesson: 'v-kim', src: 'Kim & Clayards 2019', title: 'Fig. 6 A·B·E' },
  { lesson: 'v-leekim', src: 'Lee-Kim & Chou 2002', title: 'Fig. 6 (sib_merger)' },
  { lesson: 'v-kpogo', src: 'Kpogo & Chang 2025', title: 'Fig. 5' },
  { lesson: 'v-strand', src: 'Strandberg et al. 2021', title: 'Fig. 2' },
  { lesson: 'v-chung', src: 'Chung et al. 2012', title: 'Fig. 4' },
  { lesson: 'v-davidson', src: 'Davidson 2016', title: 'Fig. 1–4' },
  { lesson: 'v-adem', src: 'Adem 2025', title: 'Fig. 11, 13' },
  { lesson: 'v-politzer', src: 'Politzer-Ahles & Piccinini 2018', title: 'Fig. 1, 2' },
);
