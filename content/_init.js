/* 콘텐츠 공통: 준비 코드(setup), 목표 목록, 안내 문구 */
window.RS = { units: [], setups: {}, tables: {}, goals: [] };
var RS = window.RS;

// 준비 코드: 예시·퀴즈·연습 문제 전에 조용히 실행된다 (학습자 화면에는 안 보임)
RS.setups.birds = `birds <- tibble(bird = rep(c("owl", "crow", "oriole"),
                                times =  c(3,3,2)),
                color = rep(c("orange","black","black"),
                                times = c(3,3,2)),
                inches = c(23, 25, 26, 7, 8, 8.5, 11.5, 12),
                is.sparrow = rep(c(F, T),
                                times=c(3,5)))`;
// 퀴즈에 data: 'birds' 를 적으면 문제 위에 보여 주는 표 (setups.birds 와 같은 값)
RS.tables.birds = {
  cap: '**birds** 데이터 (8행 × 4열). 맨 왼쪽 숫자는 행 번호예요 (열이 아님).',
  head: ['', 'bird', 'color', 'inches', 'is.sparrow'],
  rows: [
    [1, 'owl', 'orange', 23, 'FALSE'],
    [2, 'owl', 'orange', 25, 'FALSE'],
    [3, 'owl', 'orange', 26, 'FALSE'],
    [4, 'crow', 'black', 7, 'TRUE'],
    [5, 'crow', 'black', 8, 'TRUE'],
    [6, 'crow', 'black', 8.5, 'TRUE'],
    [7, 'oriole', 'black', 11.5, 'TRUE'],
    [8, 'oriole', 'black', 12, 'TRUE'],
  ],
};
RS.setups.adding = `adding <- function(x, y){
  x + y
}`;
RS.setups.sibimit = `sibimit <- read_csv("QuantAnalysis_data/sib_imit_data.csv", show_col_types = FALSE)`;
RS.setups.sibimit_means = `sibimit_means <- sibimit %>%
  group_by(Subject, Gender, Place, Task, MergerStatus) %>%
  summarise(COGm = mean(COGm))`;
RS.setups.sibmerger = `sibmerger <- read_csv("QuantAnalysis_data/sib_merger.csv", show_col_types = FALSE)`;
RS.setups.spec = `df <- read_csv("spectral_imitation_data.csv", show_col_types = FALSE)`;

// ---- wk5: tidyr ----
RS.setups.fruit = `fruit <- tibble(sociolinguist = c("Bill", "Gillian"),
                apples_bought = c(5, 3),
                apples_ate = c(1, 2),
                oranges_bought = c(5, 4),
                oranges_ate = c(3, 3))`;
RS.setups.fruit_longer = `fruit_longer <- fruit %>%
  pivot_longer(apples_bought:oranges_ate,
               names_to = "fruit_behavior",
               values_to = "number")`;
RS.setups.fruit_separate = `fruit_separate <- fruit_longer %>%
  separate(fruit_behavior, into = c("fruit", "behavior"))`;
RS.setups.wk5 = `data <- read_csv("QuantAnalysis_data/QuantAnalysis_wk5_data.csv", show_col_types = FALSE)`;
RS.setups.wk5_p1 = `spkr_word_durations <- data %>%
  pivot_longer(oh.caught:o.bot, names_to = "vowel.word", values_to = "time") %>%
  pivot_wider(names_from = time_point, values_from = time) %>%
  mutate(duration = end - start)`;
RS.setups.wk5_p2 = `spkr_vowel_durations <- spkr_word_durations %>%
  separate(vowel.word, into = c("vowel", "word")) %>%
  group_by(speaker_ID, vowel) %>%
  summarise(mean_dur = mean(duration), .groups = "drop")`;
RS.setups.wk5_p3 = `group_durations <- spkr_vowel_durations %>%
  separate(speaker_ID, into = c("spkr", "age", "gender")) %>%
  group_by(age, gender, vowel) %>%
  summarize(group_mean_dur = mean(mean_dur), .groups = "drop")`;
RS.setups.joinex = `set.seed(10)
word_rts <- tibble(word = c(rep("cat",3), rep("ball",2), rep("truck",4)),
                   trial_num = c(2,7,3,2,4,6,10,10,11),
                   rt = rnorm(9, 700, 50))
words <- tibble(word = c("cat","ball","truck"),
                freq = c(3383, 5353, 3716),
                pos = c(rep("noun",3)))`;

// ---- wk5: stringr · forcats ----
RS.setups.mpg2 = `mpg2 <- mpg %>%
  mutate(manufacturer = as_factor(manufacturer))`;
RS.setups.mpg3 = `mpg3 <- mpg2 %>%
  filter(manufacturer %in% c("audi","chevrolet","dodge")) %>%
  mutate(manufacturer = droplevels(manufacturer))`;
RS.setups.mpg4 = `mpg4 <- mpg3 %>%
  group_by(manufacturer) %>%
  summarize(mean.hwy = mean(hwy))`;

// ---- wk6: 네덜란드어 어휘판단 (실습·HW1 공통) ----
RS.setups.dutch = `trials <- read_csv("QuantAnalysis_data/QuantAnalysis_dutch_trials.csv", show_col_types = FALSE)
stims <- read_csv("QuantAnalysis_data/QuantAnalysis_dutch_stims.csv", show_col_types = FALSE)`;
RS.setups.wk6_rt = `rt_data <- trials %>%
  left_join(stims, by = "spelling")
word_rts <- rt_data %>%
  filter(response == "W") %>%
  group_by(spelling, subtlex.log10.frequency) %>%
  summarize(rt_mean = mean(rt.raw), N = n(), .groups = "drop")`;
RS.setups.wk6_rt2 = `word_rts2 <- rt_data %>%
  filter(response == "W") %>%
  group_by(spelling, OLD20, subtlex.log10.frequency) %>%
  summarize(rt_mean = mean(rt.raw), N = n(), .groups = "drop")`;
// HW1: 앞 문항의 결과를 다음 문항이 이어 쓴다
RS.setups.hw1 = `data <- trials %>%
  left_join(stims, by = "spelling")`;
RS.setups.hw2 = `data <- data %>%
  filter(response == "W")`;
RS.setups.hw3 = `data <- data %>%
  group_by(participant) %>%
  mutate(rt_z = as.numeric(scale(rt.raw))) %>%
  ungroup()`;
RS.setups.hw4 = `data_trim <- data %>%
  filter(abs(rt_z) <= 2.5)`;
RS.setups.hw5 = `data_trim <- data_trim %>%
  filter(!is.na(nsyl)) %>%
  mutate(nsyl = as_factor(nsyl))
word_rts <- data_trim %>%
  group_by(spelling, OLD20, subtlex.log10.frequency, nchar, nsyl) %>%
  summarise(mean_rt_z = mean(rt_z), .groups = "drop")`;
RS.setups.hw7 = `length_rts <- word_rts %>%
  group_by(nchar, nsyl) %>%
  summarise(mean_rt_z = mean(mean_rt_z), n = n(), .groups = "drop")`;
RS.setups.hw8 = `length_rts_15 <- length_rts %>%
  filter(n >= 15)`;

// ---- wk7: 선형회귀 (languageR의 english) ----
RS.setups.languageR = `library(languageR)`;
RS.setups.english = `library(languageR)
english_young <- english %>%
  filter(AgeSubject == "young")`;
RS.setups.lm1 = `slr_mod_freq1 <- lm(RTlexdec ~ WrittenFrequency, data = english_young)`;

RS.about = [
  '- **범위**: `baseline_data`의 wk2–8 스크립트(wk2_ggplot_intro, wk2_ggplot_ExerciseKey, wk3_Rproject, wk3_ggplot_practice, wk3 폴더, wk4_dplyr, wk5_1_tidyr와 Exercise key, wk5_2_stringr, wk6_data_manip_practice_key, wk7_linear reg intro와 key, wk8_linear reg intro_rmld_neut)와 실습·숙제 PDF(wk6 실습지, HW1)에 나온 것만 다뤄요. 개념만 있는 PDF(교재 장, 강의 슬라이드)는 코드를 읽는 데 필요한 만큼만 인용했어요. Practice에 꼭 필요한 몇 가지는 "Practice 도구 상자" 단원에 따로 모았어요.',
  '- **구성**: 단원은 기본 → wk2 … wk8 순서로 묶었고, 직접 풀어 채점받는 Practice·논문 그림·연습·숙제는 맨 아래 **실습**에 모았어요. 각 주의 마지막 레슨과 목차에 그 주 실습 바로가기가 있어요.',
  '- **wk7–8 (회귀)**: 코드를 쓰는 게 아니라 `summary()` 출력 표를 **읽고 해석**하는 게 목적이에요. 스크립트에 처음 나오는 통계 함수는 따로 레슨으로 만들지 않고 상자 안 설명으로만 다뤘어요. 스크립트 밖 심화 내용은 넣지 않았어요.',
  '- **결과**: 설명 속 코드의 결과(출력·그림)는 모두 이 컴퓨터의 R 4.6.1 · ggplot2 4.0.3 · dplyr 1.2.1로 **실제로 실행한 것**이에요. 손으로 그린 예상 그림이 아니에요.',
  '- **직접 실행**: "▶ 직접 실행"과 연습장은 브라우저 안에서 도는 진짜 R(webR 0.6, ggplot2 4.0.3)을 써요. 처음 한 번은 수십 MB를 내려받아서 30초~1분쯤 걸려요.',
  '- **공유용 페이지**: [claude.ai/artifact/5Rqr8ZGt8H9wAuKejLNg29](https://claude.ai/artifact/5Rqr8ZGt8H9wAuKejLNg29) (이 도구의 읽기 전용판 — 링크로 공유 가능)',
  '- **어디서 열까**: 내 컴퓨터의 `r-study/index.html`을 더블클릭해서 열면 모든 기능이 동작해요. claude.ai 공유 페이지에서는 설명·퀴즈·미리 실행된 결과만 되고, R 직접 실행과 "직접 써 보기" 채점은 막혀 있어요 (그때는 RStudio에서 해 보고 "성공했어요" 버튼으로 표시할 수 있어요).',
  '- **채점**: "직접 써 보기" 문제는 정해진 규칙으로만 채점해요 (예: 점 층이 있는가, color가 class에 매핑됐는가). 에러·경고가 나면 뜻을 풀어 주지만 **코드를 대신 써 주는 기능은 없어요.** 자동완성도 없어요.',
  '- **진도**: 브라우저에 저장돼요. 여러 컴퓨터에서 이어 하려면 왼쪽 위 **진도 옮기기**에서 `progress.js` 파일로 저장해 git으로 주고받으세요 (claude.ai 공유 페이지는 그 브라우저에만 저장돼요).',
].join('\n');

RS.playInfo = [
  '- 내장 데이터: `mpg`, `diamonds` (ggplot2와 함께 옴)',
  '- 파일 1: `read_csv("QuantAnalysis_data/sib_imit_data.csv")`',
  '- 파일 2: `read_csv("QuantAnalysis_data/sib_merger.csv")`',
  '- 파일 3: `read_csv("spectral_imitation_data.csv")` (wk3 폴더와 같은 경로)',
  '- wk5–6 파일: `QuantAnalysis_data/QuantAnalysis_wk5_data.csv`, `QuantAnalysis_dutch_trials.csv`, `QuantAnalysis_dutch_stims.csv` (모두 QuantAnalysis_data 폴더)',
  '- wk8 파일: `read.csv("QuantAnalysis_data/neutralization_rmld.csv", stringsAsFactors = TRUE)`',
  '- wk7 데이터: `library(languageR)` 후 `english`',
  '- 불러와 있는 패키지: ggplot2, dplyr, readr, tibble (`library(tidyverse)`도 그대로 쳐도 돼요). tidyr·stringr·forcats·languageR·broom·jtools·sjPlot·patchwork는 코드에 쓰이면 처음 한 번 자동으로 설치돼요 (sjPlot은 1분 가까이 걸려요).',
  '- `View(데이터)`는 아래에 표로 보여 줘요. `?도움말`, `install.packages()`, `file.choose()`는 웹에서는 안 돼요.',
].join('\n');
