/* 단원 neut: wk8 — 범주형 예측변수 두 개와 상호작용 (neutralization) */
(function () {

RS.setups.neut = `neutralization <- read.csv("QuantAnalysis_data/neutralization_rmld.csv",stringsAsFactors = TRUE) %>%
  filter(!is.na(prosodic_boundary))`;
RS.setups.neut_vl = `neutralization <- neutralization %>%
  mutate(voicing = relevel(voicing, "voiceless"))`;
RS.setups.nslr1 = `slr_mod_1 <- lm(vowel_dur ~ voicing, data = neutralization)`;
RS.setups.nmod3 = `mlr_mod_3 <- lm(vowel_dur ~ prosodic_boundary + voicing +
    voicing:prosodic_boundary, data = neutralization)`;
RS.setups.patch = `library(patchwork)`;

const SUM_N1 = `Call:
lm(formula = vowel_dur ~ voicing, data = neutralization)

Residuals:
     Min       1Q   Median       3Q      Max
-105.329  -31.055   -4.352   24.765  145.775

Coefficients:
                 Estimate Std. Error t value Pr(>|t|)
(Intercept)       160.241      2.241  71.511  < 2e-16 ***
voicingvoiceless   -9.032      3.167  -2.852  0.00446 **
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

Residual standard error: 43.33 on 747 degrees of freedom
Multiple R-squared:  0.01077,\tAdjusted R-squared:  0.009447
F-statistic: 8.134 on 1 and 747 DF,  p-value: 0.004464`;

const SUM_N3 = `Call:
lm(formula = vowel_dur ~ prosodic_boundary + voicing + voicing:prosodic_boundary,
    data = neutralization)

Residuals:
    Min      1Q  Median      3Q     Max
-95.340 -29.964  -6.316  22.467 145.149

Coefficients:
                                   Estimate Std. Error t value Pr(>|t|)
(Intercept)                         144.566      2.619  55.189  < 2e-16 ***
prosodic_boundaryyes                 20.090      4.555   4.410 1.18e-05 ***
voicingvoiced                         5.686      3.669   1.550   0.1216
prosodic_boundaryyes:voicingvoiced   12.972      6.526   1.988   0.0472 *
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

Residual standard error: 41.5 on 745 degrees of freedom
Multiple R-squared:  0.09518,\tAdjusted R-squared:  0.09154
F-statistic: 26.12 on 3 and 745 DF,  p-value: 4.489e-16`;

const SUM_N5 = `Call:
lm(formula = vowel_dur ~ prosodic_boundary * voicing, data = neutralization)

Residuals:
    Min      1Q  Median      3Q     Max
-95.340 -29.964  -6.316  22.467 145.149

Coefficients:
                                  Estimate Std. Error t value Pr(>|t|)
(Intercept)                        164.656      3.727  44.181  < 2e-16 ***
prosodic_boundaryno                -20.090      4.555  -4.410 1.18e-05 ***
voicingvoiced                       18.658      5.397   3.457 0.000578 ***
prosodic_boundaryno:voicingvoiced  -12.972      6.526  -1.988 0.047214 *
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

Residual standard error: 41.5 on 745 degrees of freedom
Multiple R-squared:  0.09518,\tAdjusted R-squared:  0.09154
F-statistic: 26.12 on 3 and 745 DF,  p-value: 4.489e-16`;

RS.units.push({
  id: 'neut',
  title: 'wk8 상호작용: 유성성 × 운율 경계',
  short: 'stringsAsFactors, 알파벳 순 기준 수준, relevel(), p와 R²는 다르다, 2×2 상호작용 표로 네 칸 평균 복원, 기준 바꾸기, plot_model, patchwork',
  desc: '`wk8_linear reg intro_rmld_neut.R` 전체 (RMLD 4.5, 7.4). 독일어는 어말 유성 자음이 무성으로 발음돼요(어말 무성화). 그래도 **그 앞 모음의 길이**에 원래(기저) 유성성의 흔적이 남는지, 그리고 그 차이가 **운율 경계** 앞에서 더 커지는지를 봐요. 예측변수가 둘 다 범주형이에요.',
  setup: ['neut'],
  lessons: [
    {
      id: 'neut-data',
      title: 'neutralization 데이터와 stringsAsFactors = TRUE',
      src: 'wk8 1–13행',
      key: '`read.csv(..., stringsAsFactors = TRUE)`는 글자 열을 처음부터 **factor**로 읽는다 → 수준(level)이 생겨서 나중에 `relevel()`로 기준 수준을 바꿀 수 있다.',
      body: [
        { code: `neutralization <- read.csv("QuantAnalysis_data/neutralization_rmld.csv",stringsAsFactors = TRUE) %>%
  filter(!is.na(prosodic_boundary))
glimpse(neutralization)`, setup: [] },
        { table: { head: ['열', '역할', '값'], rows: [
          ['`vowel_dur`', '**반응변수**: 어말 자음 앞 모음의 길이', 'ms (로그 아님)'],
          ['`voicing`', '예측변수: 어말 자음의 **기저** 유성성', 'factor: `voiced`, `voiceless`'],
          ['`prosodic_boundary`', '예측변수: 운율 경계가 있었나', 'factor: `no`, `yes`'],
        ] } },
        '- `glimpse()`에서 `<fct>`로 보이는 열들이 factor예요. `read_csv()`로 읽었다면 `<chr>`였을 거예요.\n- `filter(!is.na(prosodic_boundary))`: 운율 경계 정보가 비어 있는(NA) 1행을 빼서 750 → **749행**.\n- `!`는 "아니다": `is.na()`가 TRUE인 행을 **빼고** 남겨요.',
      ],
      quiz: [
        { type: 'mcq', q: '`stringsAsFactors = TRUE`를 쓰는 이유는?', opts: [
          { t: '글자 열을 factor로 읽어서 수준 순서·기준 수준을 다룰 수 있게', ok: true, why: '`relevel()`은 factor에만 돼요.' },
          { t: '숫자 열을 글자로 바꾸려고', why: '숫자 열은 그대로예요.' },
          { t: 'NA를 없애려고', why: 'NA는 filter 줄이 빼요.' },
        ] },
        { type: 'mcq', q: '`filter(!is.na(prosodic_boundary))`가 남기는 행은?', opts: [
          { t: 'prosodic_boundary 값이 **있는** 행', ok: true, why: '`!` = NOT. NA가 아닌 행만.' },
          { t: 'prosodic_boundary가 NA인 행', why: '`!`가 앞에 있어서 반대예요.' },
          { t: 'prosodic_boundary가 yes인 행', why: 'yes/no 둘 다 남아요.' },
        ] },
      ],
    },
    {
      id: 'neut-slr',
      title: 'voicing 하나로: 기준은 알파벳 순 voiced',
      src: 'wk8 16–28행',
      key: '수준은 알파벳 순 voiced < voiceless → 기준 = **voiced**. **Intercept 160.2 = voiced 평균**, `voicingvoiceless` −9.0 = **voiceless − voiced**.',
      setup: ['neut', 'nslr1'],
      body: [
        { code: `neutralization %>%
  ggplot(aes(x = voicing, y = vowel_dur)) +
  geom_jitter(width = 0.1, height = 0, size = 0.5, alpha=0.5) +
  stat_summary(fun.y = "mean", geom = "point", color= "deeppink", size = 3) +
  labs(x = "Voicing", y = "Vowel duration (msec)")`, cap: '18–22행. 경고가 나지만 그림은 정상이에요 (`fun.y` → `fun`).' },
        '`geom_jitter(width = 0.1, height = 0)`: 옆으로만 살짝 흩고 **세로(height)는 0** → 모음 길이 값 자체는 그대로 유지돼요.',
        { code: `slr_mod_1 <- lm(vowel_dur ~ voicing, data = neutralization)
summary(slr_mod_1)`, run: false },
        { anno: SUM_N1, marks: [
          { s: '(Intercept)', t: '**voiced(기준 수준) 평균** 모음 길이 = 160.2 ms.' },
          { s: 'voicingvoiceless', t: '**voiceless − voiced = −9.0 ms**. 기저 무성 자음 앞 모음이 평균 9 ms 짧다 → voiceless 평균 = 160.241 − 9.032 = 151.2 ms.' },
          { s: '0.00446 **', t: 'p = .004 → 차이는 유의. 발음은 같아졌어도(중화) 모음 길이에 흔적이 남았다 → **불완전 중화**의 증거.' },
          { s: '43.33', t: 'RSE: 개별 모음 길이가 예측(집단 평균)에서 보통 ±43 ms쯤 벗어나요.' },
          { s: 'Multiple R-squared:  0.01077', t: 'R² = **1.1%**. 유의하지만 설명력은 아주 작아요 → [[neut-small|다음 레슨]].' },
        ] },
        { code: `glance(slr_mod_1)`, setup: ['neut', 'nslr1', 'broom'], cap: '27행: broom의 glance()는 모델 전체 성적을 한 줄 tibble로.' },
        { table: { head: ['glance() 열', 'summary()에서'], rows: [
          ['`r.squared`, `adj.r.squared`', 'Multiple / Adjusted R-squared'],
          ['`sigma`', 'Residual standard error (43.3)'],
          ['`statistic`, `p.value`', 'F-statistic (8.13)과 그 p값'],
          ['`df`, `df.residual`, `nobs`', '예측변수 자유도(1), 잔차 자유도(747), 관측 수(749)'],
          ['`logLik`, `AIC`, `BIC`, `deviance`', 'summary에는 없음 — 나중에 모델 비교(model selection) 때 써요'],
        ] } },
      ],
      quiz: [
        { type: 'mcq', q: 'Intercept `160.241`은?', opts: [
          { t: 'voiced(기준) 조건의 평균 모음 길이', ok: true, why: 'voiced가 알파벳 순 첫 수준이라 기준.' },
          { t: 'voiceless 조건의 평균', why: 'voiceless는 Intercept + (−9.032).' },
          { t: '전체 평균', why: '전체 평균은 155.7이에요.' },
        ] },
        { type: 'fill', q: 'voiceless 평균 모음 길이', code: '160.241 + (▢) = 151.209', ans: [['-9.032']], why: 'voiceless − voiced = −9.032.' },
        { type: 'mcq', q: '`glance()`의 `sigma`는 summary의 어느 값?', opts: [
          { t: 'Residual standard error', ok: true, why: '43.3 = 43.33.' },
          { t: 'Std. Error', why: '그건 계수마다 있는 표준오차예요.' },
          { t: 'F-statistic', why: '그건 `statistic`.' },
        ] },
      ],
    },
    {
      id: 'neut-small',
      title: 'p는 작은데 R²는 1%: 유의성 ≠ 설명력',
      src: 'wk8 27–28행',
      key: '"유의하다(p < .05)" ≠ "많이 설명한다". voicing 효과는 유의하지만(p = .004) 모음 길이 변동의 **1%**만 설명한다. 둘은 다른 질문에 답한다.',
      body: [
        { table: { head: ['', 'wk7 빈도 모델', 'wk8 voicing 모델'], rows: [
          ['효과 (Estimate)', '−0.037 log ms / 로그 빈도 1', '−9.0 ms'],
          ['p', '< 2e-16', '.004'],
          ['R²', '0.414', '**0.011**'],
          ['RSE (잔차의 퍼짐)', '0.081', '43.3 ms'],
        ] } },
        '- **p**: "차이가 0이 아니라고 확신할 수 있나?" → 관측이 749개나 되니 9 ms 차이도 우연이 아니라고 말할 수 있어요.\n- **R²**: "모음 길이가 왜 들쭉날쭉한지 이 변수로 얼마나 설명되나?" → 화자·단어·모음 종류에 따라 ±43 ms씩 흔들리는 가운데 9 ms 차이는 작은 부분이에요.\n- 불완전 중화 연구의 질문은 "차이가 **있나**"라서 작은 R²도 문제가 아니에요. 모음 길이를 **예측**하는 게 목적이었다면 이 모델은 부족해요.',
        { note: '보고할 때', kind: 'src', t: '효과의 **크기**(9 ms)와 **불확실성**(SE 3.2, CI)을 p값과 함께 쓰세요. "유의했다"만 쓰면 효과가 큰지 작은지 독자가 알 수 없어요.' },
      ],
      quiz: [
        { type: 'tf', q: 'p값이 작을수록 R²도 크다.', ans: false, why: '관측이 많으면 작은 효과도 p가 작아져요. wk8 voicing 모델: p = .004인데 R² = 0.011.' },
        { type: 'mcq', q: '"효과가 얼마나 큰가"에 답하는 숫자는?', opts: [
          { t: 'Estimate (−9.0 ms)', ok: true, why: '단위가 있는 효과 크기. R²는 "얼마나 설명하나".' },
          { t: 'p값 (.004)', why: 'p는 크기가 아니라 "0이 아니라는 확신"이에요.' },
          { t: 't값 (−2.852)', why: 't는 Estimate를 SE로 나눈 것이라 단위가 없어요.' },
        ] },
      ],
    },
    {
      id: 'neut-relevel',
      title: 'relevel(): 기준 수준 바꾸기',
      src: 'wk8 31–36행',
      key: '`relevel(voicing, "voiceless")` → voiceless가 기준. **Intercept = voiceless 평균 151.2**, `voicingvoiced` = **+9.0**. 이름과 부호만 바뀌고 SE·|t|·p·R²는 **그대로**.',
      body: [
        { code: `neutralization <- neutralization %>%
  mutate(voicing = relevel(voicing, "voiceless"))

slr_mod_2 <- lm(vowel_dur ~ voicing, data = neutralization)
summary(slr_mod_2)` },
        { table: { head: ['', '`slr_mod_1` (기준 voiced)', '`slr_mod_2` (기준 voiceless)'], rows: [
          ['Intercept', '160.241 = voiced 평균', '**151.209 = voiceless 평균**'],
          ['두 번째 행', '`voicingvoiceless` −9.032', '`voicingvoiced` **+9.032**'],
          ['그 행의 SE · t · p', '3.167 · −2.852 · .00446', '3.167 · **+**2.852 · .00446'],
          ['RSE · R² · F', '43.33 · 0.01077 · 8.134', '같음'],
        ] } },
        '같은 두 평균(151.2, 160.2)을 **어느 쪽에서 바라보느냐**만 바뀌었어요. 보통 비교의 출발점이 자연스러운 쪽(통제 조건, 무표적인 쪽)을 기준으로 둬요.',
        { note: 'factor가 아니면', kind: 'warn', t: '`read_csv()`로 읽어서 voicing이 chr이면 `relevel()`이 에러 ("only for (unordered) factors")를 내요. 그래서 1행에서 `stringsAsFactors = TRUE`를 썼어요.' },
      ],
      quiz: [
        { type: 'mcq', q: 'relevel 후 **바뀌지 않는** 것은?', opts: [
          { t: 'p값과 R²', ok: true, why: '같은 데이터, 같은 두 평균. 관점만 바뀜.' },
          { t: 'Intercept', why: '기준 수준의 평균이라 바뀌어요 (160.2 → 151.2).' },
          { t: '두 번째 행의 이름과 부호', why: '`voicingvoiceless` −9 → `voicingvoiced` +9.' },
        ] },
        { type: 'fill', q: 'voiceless를 기준 수준으로', code: 'mutate(voicing = relevel(voicing, "▢"))', ans: [['voiceless']], why: '두 번째 인자 = 새 기준 수준(따옴표 필요).' },
        { type: 'write', q: '**prosodic_boundary**의 기준을 `yes`로 바꾼 뒤, `vowel_dur ~ prosodic_boundary` 모델을 `slr_mod_pb`에 저장하고 summary를 보세요.', checks: [
          { r: 'is.factor(obj("neutralization")$prosodic_boundary) && levels(obj("neutralization")$prosodic_boundary)[1] == "yes"', m: '`relevel(prosodic_boundary, "yes")`로 기준 = yes' },
          { r: 'inherits(obj("slr_mod_pb"), "lm")', m: '`slr_mod_pb <- lm(...)`' },
          { r: 'identical(names(coef(obj("slr_mod_pb"))), c("(Intercept)", "prosodic_boundaryno"))', m: '계수 이름이 `prosodic_boundaryno` (기준 yes)' },
          { r: 'inherits(A(), "summary.lm")', m: '마지막에 `summary(slr_mod_pb)`' },
        ], sol: `neutralization <- neutralization %>%
  mutate(prosodic_boundary = relevel(prosodic_boundary, "yes"))
slr_mod_pb <- lm(vowel_dur ~ prosodic_boundary, data = neutralization)
summary(slr_mod_pb)`, solNote: 'Intercept = 경계 있음(yes) 평균, `prosodic_boundaryno` = no − yes (음수: 경계가 없으면 모음이 짧아요).' },
      ],
    },
    {
      id: 'neut-plot2',
      title: '두 요인 그림: 선이 평행하지 않으면 상호작용',
      src: 'wk8 39–51행',
      key: 'x = voicing, 색 = prosodic_boundary로 평균을 이으면 **두 선의 기울기 차이가 곧 상호작용**. 평행하면 상호작용 없음.',
      setup: ['neut', 'neut_vl'],
      body: [
        { code: `neutralization %>%
  ggplot(aes(x = voicing, y = vowel_dur, color = prosodic_boundary)) +
  geom_jitter(width = 0.1, height = 0, size = 0.5, alpha=0.5) +
  stat_summary(fun = "mean", geom = "point", size = 3, aes(color = prosodic_boundary)) +
  labs(x = "Voicing", y = "Vowel duration (msec)")` },
        { code: `neutralization %>%
  ggplot(aes(x = voicing, y = vowel_dur, color = prosodic_boundary)) +
  stat_summary(fun.data = "mean_cl_boot", geom = "pointrange") +
  stat_summary(geom = "line", aes(group = prosodic_boundary, lty=prosodic_boundary)) +
  labs(x = "Voicing", y = "Vowel duration (msec)")`, cap: '47–51행' },
        '- `mean_cl_boot`: 평균과 **부트스트랩 95% 신뢰구간**(데이터에서 다시 뽑기를 수천 번 반복해 구한 구간). Hmisc 패키지가 계산해요.\n- `geom = "pointrange"`: 점(평균) + 세로선(구간).\n- 두 번째 stat_summary: 같은 경계 조건의 평균끼리 선으로 이어요. `lty`는 linetype의 줄임말이라 선 모양도 조건마다 달라져요. fun을 안 주면 평균 ± SE를 쓰는데 선은 평균만 이어요("No summary function supplied" 메시지).',
        { table: { head: ['', 'voiceless', 'voiced', '선의 기울기 (voiced − voiceless)'], rows: [
          ['no (경계 없음)', '144.6', '150.3', '+5.7'],
          ['yes (경계 있음)', '164.7', '183.3', '**+18.7**'],
        ] } },
        '경계가 있을 때 선이 훨씬 가파르죠. "voicing 효과가 경계 조건에 따라 다르다" = **상호작용**. 이게 통계적으로도 유의한지 다음 레슨의 모델로 확인해요.',
      ],
      quiz: [
        { type: 'mcq', q: '이런 그림에서 두 선이 **평행**하다면?', opts: [
          { t: 'voicing 효과가 경계 유무와 상관없이 같다 (상호작용 없음)', ok: true, why: '기울기가 같으면 차이가 같아요.' },
          { t: 'voicing 효과가 없다', why: '평행해도 기울어져 있으면 voicing 효과는 있어요.' },
          { t: '경계 효과가 없다', why: '경계 효과는 두 선의 높이 차이예요.' },
        ] },
        { type: 'mcq', q: '`mean_cl_boot`가 그리는 세로선은?', opts: [
          { t: '평균의 부트스트랩 95% 신뢰구간', ok: true, why: 'cl = confidence limits, boot = bootstrap.' },
          { t: '최솟값 ~ 최댓값', why: '데이터 범위가 아니에요.' },
          { t: '평균 ± 표준편차', why: '그건 `mean_sdl`.' },
        ] },
      ],
    },
    {
      id: 'neut-inter',
      title: '2×2 상호작용 모델: 표로 네 칸 평균 복원하기',
      src: 'wk8 55–63행',
      key: '기준 = **voiceless & 경계 없음(no)**. **Intercept = 기준 칸의 평균**, 나머지 세 줄은 그 칸에서 출발해 **더하는 양**. 네 줄로 네 칸의 평균을 전부 복원할 수 있다.',
      setup: ['neut', 'neut_vl', 'nmod3'],
      body: [
        { code: `mlr_mod_3 <- lm(vowel_dur ~ prosodic_boundary + voicing +
    voicing:prosodic_boundary, data = neutralization)
summary(mlr_mod_3)`, run: false, cap: '56–59행. 이 시점에 voicing은 이미 voiceless가 기준이에요(32–33행). prosodic_boundary는 알파벳 순 no가 기준.' },
        { anno: SUM_N3, marks: [
          { s: '(Intercept)', t: '**voiceless + 경계 없음** 칸의 평균 = 144.6 ms. 출발점.' },
          { s: '20.090', label: 'prosodic_boundaryyes  20.090', t: '**voiceless일 때** 경계 있음 − 없음 = +20.1 ms (p < .001). "경계 효과"지만 voiceless에서만의 값이에요.' },
          { s: '5.686', label: 'voicingvoiced  5.686', t: '**경계가 없을 때** voiced − voiceless = +5.7 ms. p = .12로 **유의하지 않음**. 경계 없는 자리에서는 불완전 중화의 증거가 약해요.' },
          { s: '12.972', label: 'prosodic_boundaryyes:voicingvoiced  12.972', t: '**상호작용 = 차이의 차이**: 경계가 있을 때 voicing 효과가 경계 없을 때보다 13.0 ms **더 크다** (18.7 − 5.7).' },
          { s: '0.0472 *', t: '상호작용 p = .047 < .05 → voicing 효과의 크기는 경계 조건에 따라 **유의하게 다르다** (α = .05 기준).' },
          { s: 'on 3 and 745 DF', t: '계수 4개 → 예측변수 쪽 3, 잔차 749 − 4 = 745.' },
          { s: 'Multiple R-squared:  0.09518', t: 'voicing만 넣었을 때(0.011)보다 커졌어요. 경계 효과가 꽤 커서요.' },
        ] },
        { table: { head: ['', 'voiceless (기준)', 'voiced', 'voicing 효과 (voiced − voiceless)'], rows: [
          ['**no (기준)**', '144.566', '144.566 + 5.686 = **150.252**', '5.686'],
          ['**yes**', '144.566 + 20.090 = **164.656**', '144.566 + 20.090 + 5.686 + 12.972 = **183.314**', '5.686 + 12.972 = **18.658**'],
          ['경계 효과 (yes − no)', '20.090', '20.090 + 12.972 = 33.062', ''],
        ] } },
        '이 네 숫자는 [[neut-plot2|앞 레슨]] 그림의 네 평균과 **정확히 같아요**. 범주형 × 범주형 상호작용 모델은 각 칸의 평균을 그대로 맞춰요.',
        '**해석 요약**: 경계 없는 자리에서는 voiced 앞 모음이 5.7 ms 길 뿐이지만(유의하지 않음), 경계 앞에서는 18.7 ms나 길다. 그 차이(13.0 ms)는 유의하다(p = .047).',
        { code: `mlr_mod_4 <- lm(vowel_dur ~ prosodic_boundary*voicing, data = neutralization)`, run: false, cap: '62행: `*`로 줄여 쓴 같은 모델. summary가 똑같아요.' },
      ],
      quiz: [
        { type: 'fill', q: 'voiced + 경계 있음 칸의 평균', code: '144.566 + 20.090 + 5.686 + ▢ = 183.314', ans: [['12.972']], why: '두 조건 모두 기준이 아닌 칸에는 상호작용 항까지 더해요.' },
        { type: 'mcq', q: '이 모델에서 `voicingvoiced` 5.686은?', opts: [
          { t: '경계가 **없을 때**의 voiced − voiceless', ok: true, why: '상대 변수(prosodic_boundary)가 기준(no)일 때의 효과.' },
          { t: '전체 데이터에서의 voiced − voiceless', why: '그건 slr_mod_2의 +9.032예요.' },
          { t: '경계가 있을 때의 voiced − voiceless', why: '그건 5.686 + 12.972 = 18.658.' },
        ] },
        { type: 'mcq', q: '상호작용 항 12.972의 해석은?', opts: [
          { t: '경계가 있으면 voicing 효과가 13.0 ms 더 커진다', ok: true, why: '차이(voiced − voiceless)의 차이(yes − no).' },
          { t: 'voiced이고 경계가 있으면 모음이 13.0 ms다', why: '칸의 평균은 네 줄을 다 더한 183.3.' },
          { t: '경계 효과가 13.0 ms다', why: '경계 효과(voiceless에서)는 20.090.' },
        ] },
        { type: 'mcq', q: 'voiceless + 경계 있음 칸의 평균은?', opts: [
          { t: '164.656 (144.566 + 20.090)', ok: true, why: 'voicing은 기준(voiceless)이라 voicing 줄과 상호작용 줄은 안 더해요.' },
          { t: '144.566', why: '그건 경계 없음 칸이에요.' },
          { t: '177.628 (144.566 + 20.090 + 12.972)', why: '상호작용은 두 조건이 **모두** 기준이 아닐 때만 더해요.' },
        ] },
      ],
    },
    {
      id: 'neut-relevel2',
      title: '기준을 둘 다 바꾸면: 같은 모델, 다른 질문',
      src: 'wk8 66–72행',
      key: '상호작용 모델의 단독 행은 **상대 변수의 기준 수준에서의 효과**. 경계 기준을 yes로 바꾸면 `voicingvoiced` = **경계 있을 때의 voicing 효과 18.658 (p < .001)**. 상호작용 행은 부호만 바뀐다.',
      body: [
        { code: `neutralization <- neutralization %>%
  mutate(voicing = relevel(voicing, "voiceless"),
         prosodic_boundary = relevel(prosodic_boundary, "yes"))

mlr_mod_5 <- lm(vowel_dur ~ prosodic_boundary*voicing, data = neutralization)
summary(mlr_mod_5)`, run: false },
        { anno: SUM_N5, marks: [
          { s: '(Intercept)', t: '새 기준 칸 **voiceless + 경계 있음(yes)** = 164.656. (mod_3 표에서 144.566 + 20.090으로 계산한 값!)' },
          { s: '-20.090', label: 'prosodic_boundaryno  −20.090', t: 'voiceless에서 no − yes. mod_3의 +20.090과 부호만 반대.' },
          { s: '18.658', label: 'voicingvoiced  18.658', t: '**경계가 있을 때** voiced − voiceless = 18.7 ms. mod_3에서 5.686 + 12.972로 계산하던 값이 이제 한 줄로, **자기 SE·p와 함께** 나와요.' },
          { s: '0.000578 ***', t: '경계 앞에서의 voicing 효과는 p < .001로 **뚜렷하게 유의**. (경계 없을 때는 p = .12였죠.)' },
          { s: '-12.972', label: '상호작용  −12.972', t: '경계가 **없으면** voicing 효과가 13.0 ms 작아진다. mod_3의 +12.972와 같은 내용, 방향만 반대.' },
          { s: '0.047214 *', t: '상호작용 p는 mod_3과 **같아요** (.0472). 기준을 바꿔도 "차이의 차이"는 그대로니까요.' },
        ] },
        { table: { head: ['행', '`mlr_mod_3` (기준 no)', '`mlr_mod_5` (기준 yes)'], rows: [
          ['Intercept', '144.566 (voiceless·no)', '164.656 (voiceless·yes)'],
          ['경계 행', 'yes − no: +20.090', 'no − yes: −20.090'],
          ['`voicingvoiced`', '**경계 없을 때** +5.686 (p = .12)', '**경계 있을 때** +18.658 (p < .001)'],
          ['상호작용', '+12.972 (p = .047)', '−12.972 (p = .047)'],
          ['RSE · R² · F', '41.5 · 0.09518 · 26.12', '같음'],
        ] } },
        '그래서 상호작용 모델에서는 **기준 수준을 바꿔 가며** "각 조건에서의 효과"를 하나씩 꺼내 볼 수 있어요. 같은 모델이라 예측값·R²는 그대로이고, 표의 각 줄이 대답하는 **질문**이 달라질 뿐이에요.',
        { note: '교재 RMLD 7.4.4.2: 흔한 해석 실수', kind: 'warn', t: '"경계 있을 때는 유의(p < .001), 없을 때는 유의하지 않음(p = .12) → 그러므로 경계에 따라 voicing 효과가 다르다"는 **틀린 논리**예요. 유의와 비유의의 차이가 그 자체로 유의하다는 보장은 없거든요. "효과가 다르다"는 주장은 **상호작용 항의 p**로 해요. 여기선 p = .047이라 α = .05면 유의하지만, 교재처럼 α = .01을 쓰면 유의하지 않아요.' },
      ],
      quiz: [
        { type: 'mcq', q: 'mod_5의 `voicingvoiced`(18.658)가 mod_3의 `voicingvoiced`(5.686)와 다른 이유는?', opts: [
          { t: '경계 기준이 바뀌어서, "경계 있을 때"의 voicing 효과를 보고 있기 때문', ok: true, why: '단독 행 = 상대 변수가 기준일 때의 효과.' },
          { t: 'relevel이 데이터를 바꿔서', why: '값은 그대로, 수준 순서만 바뀌었어요.' },
          { t: '`*`로 써서', why: '`*`와 `+ :`는 같은 모델이에요.' },
        ] },
        { type: 'mcq', q: '기준을 바꿔도 **그대로인** 것은?', opts: [
          { t: '상호작용 항의 |t|와 p, 그리고 RSE·R²', ok: true, why: '"차이의 차이"는 어느 쪽에서 봐도 13.0 ms.' },
          { t: 'Intercept', why: '기준 칸이 바뀌니 바뀌어요.' },
          { t: '`voicingvoiced`의 p', why: '다른 조건의 효과라 p도 달라요 (.12 → .0006).' },
        ] },
        { type: 'tf', q: '"경계 있을 때 voicing 효과는 유의하고 없을 때는 유의하지 않다"는 것만으로 두 조건의 효과가 다르다고 결론 내릴 수 있다.', ans: false, why: '상호작용 항을 직접 검정해야 해요 (RMLD 7.4.4.2).' },
        { type: 'write', q: 'voicing 기준 = voiceless, prosodic_boundary 기준 = yes로 바꾸고 `mlr_mod_5`를 만들어 summary를 보세요 (스크립트 67–72행을 보지 말고).', checks: [
          { r: 'levels(obj("neutralization")$voicing)[1] == "voiceless"', m: 'voicing 기준 = voiceless' },
          { r: 'levels(obj("neutralization")$prosodic_boundary)[1] == "yes"', m: 'prosodic_boundary 기준 = yes' },
          { r: 'inherits(obj("mlr_mod_5"), "lm")', m: '`mlr_mod_5 <- lm(...)`' },
          { r: 'length(coef(obj("mlr_mod_5"))) == 4 && any(grepl(":", names(coef(obj("mlr_mod_5")))))', m: '상호작용 포함 (`*` 또는 `+ ... + a:b`)' },
          { r: 'isTRUE(all.equal(unname(coef(obj("mlr_mod_5"))["(Intercept)"]), 164.6559, tolerance = 1e-4))', m: 'Intercept = 164.656 (voiceless·yes 칸)' },
          { r: 'inherits(A(), "summary.lm")', m: '마지막에 `summary(mlr_mod_5)`' },
        ], sol: `neutralization <- neutralization %>%
  mutate(voicing = relevel(voicing, "voiceless"),
         prosodic_boundary = relevel(prosodic_boundary, "yes"))
mlr_mod_5 <- lm(vowel_dur ~ prosodic_boundary*voicing, data = neutralization)
summary(mlr_mod_5)` },
      ],
    },
    {
      id: 'neut-plotmodel',
      title: 'plot_model: terms 하나면 다른 요인은 기준 수준에 고정',
      src: 'wk8 77–80행',
      key: '`terms = "voicing"` 그림의 두 점(144.6, 150.3)은 **경계 없음(no, 기준)** 조건의 예측이지 voicing별 전체 평균(151.2, 160.2)이 **아니다**.',
      setup: ['neut', 'neut_vl', 'nmod3', 'sjplot'],
      body: [
        { code: `plot_model(mlr_mod_3, type = "pred", terms = c("voicing"))`, cap: '78행: prosodic_boundary = no(모델을 만들 때의 기준)에 고정.' },
        { code: `plot_model(mlr_mod_3, type = "pred", terms = c("prosodic_boundary"))`, cap: '79행: voicing = voiceless에 고정 → no 144.6, yes 164.7.' },
        { code: `plot_model(mlr_mod_3, type = "pred", terms = c("voicing", "prosodic_boundary"), title = "Model predictions")`, cap: '80행: 네 칸 전부. 앞 레슨 표의 네 숫자예요.' },
        '상호작용이 있는 모델에서 terms를 하나만 주면 **상대 변수의 기준 조건 하나만** 보여 줘요. 그림 제목이 "voicing의 효과"처럼 보여도 실제론 "경계 없을 때의 voicing 효과"예요. 상호작용 모델은 보통 세 번째 그림처럼 **두 변수를 함께** 그려요.',
      ],
      quiz: [
        { type: 'mcq', q: '78행 그림(terms = "voicing")의 두 점은?', opts: [
          { t: '경계 없음(no) 조건에서의 voiceless·voiced 예측값', ok: true, why: '144.6, 150.3. terms에 없는 요인은 기준 수준에 고정.' },
          { t: 'voiceless·voiced 각각의 전체 평균', why: '전체 평균은 151.2, 160.2예요.' },
          { t: '경계 있음 조건의 예측값', why: '기준은 no예요(mlr_mod_3을 만들 때).' },
        ] },
        { type: 'mcq', q: '79행 그림(terms = "prosodic_boundary")에서 두 점의 차이(20.1)는 표의 어느 줄?', opts: [
          { t: '`prosodic_boundaryyes` 20.090 (voiceless에서의 경계 효과)', ok: true, why: 'voicing이 기준(voiceless)에 고정돼 있어요.' },
          { t: '상호작용 12.972', why: '상호작용은 기울기 차이예요.' },
          { t: 'Intercept 144.566', why: '그건 no 쪽 점 하나의 높이.' },
        ] },
      ],
    },
    {
      id: 'neut-compare',
      title: '모델 예측 vs 실제 데이터: p1 + p2 (patchwork)',
      src: 'wk8 84–115행',
      key: '`p1 + p2`(patchwork)로 그림 두 개를 나란히, `plot_layout(guides = "collect")`로 범례를 하나로. 2×2 상호작용 모델의 예측은 네 칸의 **실제 평균과 같다**.',
      setup: ['neut', 'neut_vl', 'nmod3', 'sjplot', 'patch'],
      body: [
        { code: `neutralization <- neutralization %>%
  mutate(voicing = relevel(voicing, "voiceless"),
         prosodic_boundary = relevel(prosodic_boundary, "no"))

p1<-plot_model(
    mlr_mod_3,
    type = "pred",
    terms = c("voicing", "prosodic_boundary"),
    title = "Model predictions",
    color = "bw", show.legend = F
  ) +
  labs(x = "Voicing",
       y = "Vowel duration (msec)",
       color = "Prosodic\\nboundary", shape = "Prosodic\\nboundary")

p2<-neutralization %>%
  ggplot(aes(x = voicing, y = vowel_dur, shape = prosodic_boundary)) +
  stat_summary(
    fun.data = "mean_cl_boot",
    geom = "pointrange"
  ) +
  stat_summary(
    fun.data = "mean_cl_boot",
    geom = "errorbar", width = .1
  ) +
  ggtitle("Empirical data") +
  labs(x = "Voicing",
       y = "Vowel duration (msec)",shape = "Prosodic\\nboundary")

p1 + p2 + plot_layout(guides = "collect")` },
        '- `color = "bw"`: 흑백(점 모양으로 구분), `show.legend = F`: p1의 범례 끄기 → p2의 범례 하나만 남아요.\n- `"Prosodic\\nboundary"`: `\\n`은 줄바꿈 → 범례 제목이 두 줄.\n- 85–87행 relevel: 경계 기준을 다시 no로. p2의 범례 순서(no → yes)를 위해서예요. 이미 만든 `mlr_mod_3`은 바뀌지 않아요.\n- `+ plot_layout(guides = "collect")`: 두 그림의 범례를 오른쪽 하나로 모아요.',
        '**두 그림의 점 높이가 같아요**: 범주형 × 범주형 상호작용 모델은 네 칸 각각의 평균을 그대로 예측하기 때문이에요. 세로선(신뢰구간)은 조금 달라요: 모델은 잔차 표준오차 **하나**(41.5)를 네 칸이 같이 쓰고, 부트스트랩은 칸마다 따로 계산하거든요.',
      ],
      quiz: [
        { type: 'mcq', q: '`plot_layout(guides = "collect")`가 하는 일은?', opts: [
          { t: '여러 그림의 범례를 하나로 모은다', ok: true, why: '같은 범례가 두 번 나오지 않게.' },
          { t: '그림을 세로로 쌓는다', why: '그건 `p1 / p2`.' },
          { t: '두 그림의 y축을 같게 맞춘다', why: '축과는 무관해요.' },
        ] },
        { type: 'mcq', q: '왼쪽(모델)과 오른쪽(실제) 그림의 점 위치가 같은 이유는?', opts: [
          { t: '2×2 상호작용 모델은 네 칸의 평균을 그대로 예측하기 때문', ok: true, why: '계수 4개 = 칸 4개. 남는 제약이 없어요.' },
          { t: '같은 데이터로 그려서 우연히', why: '우연이 아니라 모델 구조 때문이에요.' },
          { t: 'mean_cl_boot가 모델을 사용해서', why: 'mean_cl_boot는 원자료만 써요.' },
        ] },
      ],
    },
  ],
});

})();
