/* 단원 neut: wk8 — 범주형 예측변수 두 개와 상호작용 (neutralization, 표 해석) */
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
  title: '상호작용: 유성성 × 운율 경계',
  short: '첫 모델과 기준 수준, relevel(), 그림으로 보는 상호작용, 2×2 표로 네 칸 평균 복원, 기준 바꿔 읽기, 예측 그림',
  desc: '`wk8_linear reg intro_rmld_neut.R` 전체 (RMLD 4.5, 7.4). 독일어는 어말 유성 자음이 무성으로 발음돼요(어말 무성화). 그래도 **그 앞 모음의 길이**에 원래(기저) 유성성의 흔적이 남는지, 그 차이가 **운율 경계** 앞에서 더 커지는지를 표로 읽어요. 예측변수가 둘 다 범주형이에요.',
  setup: ['neut'],
  lessons: [
    {
      id: 'neut-data',
      title: '데이터와 첫 모델: voicing 하나로',
      src: 'wk8 8–28행',
      key: '수준은 알파벳 순 voiced < voiceless → 기준 = **voiced**. **Intercept 160.2 = voiced 평균**, `voicingvoiceless` −9.0 = **voiceless − voiced**. 유의하지만(p = .004) 설명력(R²)은 1%.',
      setup: ['neut', 'nslr1'],
      body: [
        { code: `neutralization <- read.csv("QuantAnalysis_data/neutralization_rmld.csv",stringsAsFactors = TRUE) %>%
  filter(!is.na(prosodic_boundary))`, run: false, cap: '스크립트 8–9행' },
        { table: { head: ['열', '역할', '값'], rows: [
          ['`vowel_dur`', '**반응변수**: 어말 자음 앞 모음의 길이', 'ms (로그 아님)'],
          ['`voicing`', '예측변수: 어말 자음의 **기저** 유성성', 'factor: `voiced`, `voiceless`'],
          ['`prosodic_boundary`', '예측변수: 운율 경계가 있었나', 'factor: `no`, `yes`'],
        ] } },
        { note: 'read.csv(..., stringsAsFactors = TRUE)', kind: 'tip', t: '글자 열을 처음부터 **factor**로 읽어요. 그래야 나중에 `relevel()`로 기준 수준을 바꿀 수 있어요. `filter(!is.na(prosodic_boundary))`는 경계 정보가 빈 1행을 빼서 749행으로 만들어요.' },
        { code: `neutralization %>%
  ggplot(aes(x = voicing, y = vowel_dur)) +
  geom_jitter(width = 0.1, height = 0, size = 0.5, alpha=0.5) +
  stat_summary(fun.y = "mean", geom = "point", color= "deeppink", size = 3) +
  labs(x = "Voicing", y = "Vowel duration (msec)")`, cap: '18–22행. 경고는 옛 인자 이름(`fun.y` → `fun`) 안내일 뿐, 그림은 정상이에요.' },
        { code: `slr_mod_1 <- lm(vowel_dur ~ voicing, data = neutralization)
summary(slr_mod_1)`, run: false },
        { anno: SUM_N1, marks: [
          { s: '(Intercept)', t: '**voiced(기준 수준) 평균** 모음 길이 = 160.2 ms.' },
          { s: 'voicingvoiceless', t: '**voiceless − voiced = −9.0 ms**. 기저 무성 자음 앞 모음이 평균 9 ms 짧다 → voiceless 평균 = 151.2 ms.' },
          { s: '0.00446 **', t: 'p = .004 → 차이는 유의. 발음은 같아졌어도(중화) 모음 길이에 흔적이 남았다 → **불완전 중화**의 증거.' },
          { s: '43.33', t: 'RSE: 개별 모음 길이가 예측(집단 평균)에서 보통 ±43 ms쯤 벗어나요.' },
          { s: 'Multiple R-squared:  0.01077', t: 'R² = **1.1%**. 유의하지만 설명력은 아주 작아요 (아래 상자).' },
        ] },
        { note: 'p는 작은데 R²는 1%', kind: 'warn', t: '"유의하다(p < .05)" ≠ "많이 설명한다". 관측이 749개라 9 ms 차이도 우연이 아니라고 말할 수 있지만(p), 화자·단어·모음에 따라 ±43 ms씩 흔들리는 가운데 9 ms는 작은 부분이에요(R²). 불완전 중화 연구의 질문은 "차이가 **있나**"라서 작은 R²도 문제가 아니에요.' },
        { note: 'glance() (스크립트 27행)', kind: 'tip', t: 'broom의 `glance(slr_mod_1)`는 summary의 **아래 세 줄**을 한 줄 tibble로 보여 줘요: `r.squared`, `adj.r.squared`, `sigma`(= RSE 43.3), `statistic`(= F 8.13), `p.value`, `nobs`(749) 등.' },
      ],
      quiz: [
        { type: 'mcq', q: 'Intercept `160.241`은?', opts: [
          { t: 'voiced(기준) 조건의 평균 모음 길이', ok: true, why: 'voiced가 알파벳 순 첫 수준이라 기준.' },
          { t: 'voiceless 조건의 평균', why: 'voiceless는 Intercept + (−9.032).' },
          { t: '전체 평균', why: '전체 평균은 155.7이에요.' },
        ] },
        { type: 'fill', q: 'voiceless 평균 모음 길이', code: '160.241 + (▢) = 151.209', ans: [['-9.032']], why: 'voiceless − voiced = −9.032.' },
        { type: 'tf', q: 'p값이 작을수록 R²도 크다.', ans: false, why: '관측이 많으면 작은 효과도 p가 작아져요. 이 모델: p = .004인데 R² = 0.011.' },
      ],
    },
    {
      id: 'neut-relevel',
      title: '기준 수준 바꾸기: relevel()',
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
        '같은 두 평균(151.2, 160.2)을 **어느 쪽에서 바라보느냐**만 바뀌었어요. 보통 비교의 출발점이 자연스러운 쪽을 기준으로 둬요.',
      ],
      quiz: [
        { type: 'mcq', q: 'relevel 후 **바뀌지 않는** 것은?', opts: [
          { t: 'p값과 R²', ok: true, why: '같은 데이터, 같은 두 평균. 바라보는 쪽만 바뀜.' },
          { t: 'Intercept', why: '기준 수준의 평균이라 바뀌어요 (160.2 → 151.2).' },
          { t: '두 번째 행의 이름과 부호', why: '`voicingvoiceless` −9 → `voicingvoiced` +9.' },
        ] },
        { type: 'mcq', q: 'relevel 후 `voicingvoiced` +9.032의 뜻은?', opts: [
          { t: 'voiced 앞 모음이 voiceless 앞 모음보다 평균 9 ms 길다', ok: true, why: '기준(voiceless)에서 voiced로 갈 때의 차이.' },
          { t: 'voiced 평균이 9 ms', why: '평균이 아니라 차이예요.' },
          { t: '앞 모델과 반대 결론', why: '같은 차이를 반대 방향에서 본 것뿐이에요.' },
        ] },
      ],
    },
    {
      id: 'neut-plot',
      title: '그림으로 먼저 보는 상호작용',
      src: 'wk8 41–51행',
      key: 'x = voicing, 색 = prosodic_boundary로 평균을 이으면 **두 선의 기울기 차이가 곧 상호작용**. 평행하면 상호작용 없음.',
      setup: ['neut', 'neut_vl'],
      body: [
        { code: `neutralization %>%
  ggplot(aes(x = voicing, y = vowel_dur, color = prosodic_boundary)) +
  stat_summary(fun.data = "mean_cl_boot", geom = "pointrange") +
  stat_summary(geom = "line", aes(group = prosodic_boundary, lty=prosodic_boundary)) +
  labs(x = "Voicing", y = "Vowel duration (msec)")`, cap: '47–51행 (41–45행은 같은 그림에 원자료 점을 흔들어 얹은 것)' },
        { note: '이 그림의 두 층', kind: 'tip', t: '- `mean_cl_boot` + `pointrange`: 점 = 평균, 세로선 = 평균의 95% 신뢰구간(데이터에서 다시 뽑기를 반복해 구한 구간).\n- `geom = "line"` + `aes(group = …)`: 같은 경계 조건의 평균끼리 선으로 이어요. `lty`는 linetype의 줄임말이라 선 모양도 조건마다 달라요.' },
        { table: { head: ['', 'voiceless', 'voiced', '선의 기울기 (voiced − voiceless)'], rows: [
          ['no (경계 없음)', '144.6', '150.3', '+5.7'],
          ['yes (경계 있음)', '164.7', '183.3', '**+18.7**'],
        ] } },
        '경계가 있을 때 선이 훨씬 가파르죠. "voicing 효과가 경계 조건에 따라 다르다" = **상호작용**. 이게 통계적으로도 유의한지 다음 레슨의 표로 확인해요.',
      ],
      quiz: [
        { type: 'mcq', q: '이런 그림에서 두 선이 **평행**하다면?', opts: [
          { t: 'voicing 효과가 경계 유무와 상관없이 같다 (상호작용 없음)', ok: true, why: '기울기가 같으면 차이가 같아요.' },
          { t: 'voicing 효과가 없다', why: '평행해도 기울어져 있으면 voicing 효과는 있어요.' },
          { t: '경계 효과가 없다', why: '경계 효과는 두 선의 높이 차이예요.' },
        ] },
        { type: 'mcq', q: '이 그림에서 경계 효과(yes − no)는 어디에 보이나요?', opts: [
          { t: '두 선의 높이 차이 (yes 선이 위에 있음)', ok: true, why: 'voiceless에서 164.7 − 144.6 = 20.1 ms.' },
          { t: '각 선의 기울기', why: '선의 기울기는 voicing 효과예요.' },
          { t: '세로선의 길이', why: '세로선은 신뢰구간이에요.' },
        ] },
      ],
    },
    {
      id: 'neut-inter',
      title: '2×2 상호작용 표: 네 칸 평균 복원하기',
      src: 'wk8 56–63행',
      key: '기준 = **voiceless & 경계 없음(no)**. **Intercept = 기준 칸의 평균**, 나머지 세 줄은 그 칸에서 출발해 **더하는 양**. 네 줄로 네 칸의 평균을 전부 복원할 수 있다.',
      setup: ['neut', 'neut_vl', 'nmod3'],
      body: [
        { code: `mlr_mod_3 <- lm(vowel_dur ~ prosodic_boundary + voicing +
    voicing:prosodic_boundary, data = neutralization)
summary(mlr_mod_3)`, run: false, cap: '56–59행. 이 시점에 voicing은 이미 voiceless가 기준이에요(32–33행). prosodic_boundary는 알파벳 순 no가 기준. 62행 `prosodic_boundary*voicing`도 같은 모델이에요.' },
        { anno: SUM_N3, marks: [
          { s: '(Intercept)', t: '**voiceless + 경계 없음** 칸의 평균 = 144.6 ms. 출발점.' },
          { s: '20.090', label: 'prosodic_boundaryyes  20.090', t: '**voiceless일 때** 경계 있음 − 없음 = +20.1 ms (p < .001).' },
          { s: '5.686', label: 'voicingvoiced  5.686', t: '**경계가 없을 때** voiced − voiceless = +5.7 ms. p = .12로 **유의하지 않음**.' },
          { s: '12.972', label: 'prosodic_boundaryyes:voicingvoiced  12.972', t: '**상호작용 = 차이의 차이**: 경계가 있을 때 voicing 효과가 경계 없을 때보다 13.0 ms **더 크다** (18.7 − 5.7).' },
          { s: '0.0472 *', t: '상호작용 p = .047 < .05 → voicing 효과의 크기는 경계 조건에 따라 **유의하게 다르다**.' },
          { s: 'Multiple R-squared:  0.09518', t: 'voicing만 넣었을 때(0.011)보다 커졌어요. 경계 효과가 꽤 커서요.' },
        ] },
        { table: { head: ['', 'voiceless (기준)', 'voiced', 'voicing 효과 (voiced − voiceless)'], rows: [
          ['**no (기준)**', '144.566', '144.566 + 5.686 = **150.252**', '5.686'],
          ['**yes**', '144.566 + 20.090 = **164.656**', '144.566 + 20.090 + 5.686 + 12.972 = **183.314**', '5.686 + 12.972 = **18.658**'],
          ['경계 효과 (yes − no)', '20.090', '20.090 + 12.972 = 33.062', ''],
        ] } },
        '이 네 숫자는 [[neut-plot|앞 레슨]] 그림의 네 평균과 **정확히 같아요**. 범주형 × 범주형 상호작용 모델은 각 칸의 평균을 그대로 맞춰요.',
        '**해석 요약**: 경계 없는 자리에서는 voiced 앞 모음이 5.7 ms 길 뿐이지만(유의하지 않음), 경계 앞에서는 18.7 ms나 길다. 그 차이(13.0 ms)는 유의하다(p = .047).',
      ],
      quiz: [
        { type: 'fill', q: 'voiced + 경계 있음 칸의 평균', code: '144.566 + 20.090 + 5.686 + ▢ = 183.314', ans: [['12.972']], why: '두 조건 모두 기준이 아닌 칸에는 상호작용 항까지 더해요.' },
        { type: 'mcq', q: '이 모델에서 `voicingvoiced` 5.686은?', opts: [
          { t: '경계가 없을 때의 voiced − voiceless', ok: true, why: '상대 변수(prosodic_boundary)가 기준(no)일 때의 효과.' },
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
          { s: '(Intercept)', t: '새 기준 칸 **voiceless + 경계 있음(yes)** = 164.656. (앞 표에서 144.566 + 20.090으로 계산한 값!)' },
          { s: '-20.090', label: 'prosodic_boundaryno  −20.090', t: 'voiceless에서 no − yes. 앞 모델의 +20.090과 부호만 반대.' },
          { s: '18.658', label: 'voicingvoiced  18.658', t: '**경계가 있을 때** voiced − voiceless = 18.7 ms. 앞 표에서 5.686 + 12.972로 계산하던 값이 이제 한 줄로, **자기 SE·p와 함께** 나와요.' },
          { s: '0.000578 ***', t: '경계 앞에서의 voicing 효과는 p < .001로 **뚜렷하게 유의**. (경계 없을 때는 p = .12였죠.)' },
          { s: '-12.972', label: '상호작용  −12.972', t: '경계가 **없으면** voicing 효과가 13.0 ms 작아진다. 앞 모델의 +12.972와 같은 내용, 방향만 반대.' },
          { s: '0.047214 *', t: '상호작용 p는 앞 모델과 **같아요** (.0472). 기준을 바꿔도 "차이의 차이"는 그대로니까요.' },
        ] },
        { table: { head: ['행', '`mlr_mod_3` (기준 no)', '`mlr_mod_5` (기준 yes)'], rows: [
          ['Intercept', '144.566 (voiceless·no)', '164.656 (voiceless·yes)'],
          ['경계 행', 'yes − no: +20.090', 'no − yes: −20.090'],
          ['`voicingvoiced`', '**경계 없을 때** +5.686 (p = .12)', '**경계 있을 때** +18.658 (p < .001)'],
          ['상호작용', '+12.972 (p = .047)', '−12.972 (p = .047)'],
          ['RSE · R² · F', '41.5 · 0.09518 · 26.12', '같음'],
        ] } },
        '같은 모델이라 예측값·R²는 그대로이고, 표의 각 줄이 대답하는 **질문**만 달라져요. 그래서 기준을 바꿔 가며 "각 조건에서의 효과"를 하나씩 꺼내 봐요.',
        { note: '교재 RMLD 7.4: 흔한 해석 실수', kind: 'warn', t: '"경계 있을 때는 유의, 없을 때는 유의하지 않음 → 그러므로 효과가 다르다"는 틀린 논리예요. "효과가 다르다"는 주장은 **상호작용 항의 p**(여기선 .047)로 해요.' },
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
        { type: 'tf', q: '"경계 있을 때 voicing 효과는 유의하고 없을 때는 유의하지 않다"는 것만으로 두 조건의 효과가 다르다고 결론 내릴 수 있다.', ans: false, why: '상호작용 항을 직접 봐야 해요.' },
      ],
    },
    {
      id: 'neut-pred',
      title: '모델 예측 그림과 실제 데이터',
      src: 'wk8 77–115행',
      key: '`plot_model()`로 모델의 예측을, `stat_summary()`로 실제 평균을 그려 나란히 놓으면 **같은 높이**가 나온다. 2×2 상호작용 모델은 네 칸의 평균을 그대로 맞추기 때문.',
      setup: ['neut', 'neut_vl', 'nmod3', 'sjplot', 'patch'],
      body: [
        { code: `plot_model(mlr_mod_3, type = "pred", terms = c("voicing", "prosodic_boundary"), title = "Model predictions")`, cap: '80행: 네 칸의 예측값 = 앞 레슨 표의 네 숫자.' },
        { note: 'terms를 하나만 주면 (78–79행)', kind: 'warn', t: 'terms에 없는 요인은 **기준 수준**에 고정돼요. `terms = "voicing"`의 두 점(144.6, 150.3)은 **경계 없음(no)** 조건의 예측이지, voicing별 전체 평균(151.2, 160.2)이 아니에요. `terms = "prosodic_boundary"`도 voiceless 조건만 보여 줘요.' },
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

p1 + p2 + plot_layout(guides = "collect")`, cap: '84–115행' },
        { note: '그림 두 개 나란히 (patchwork)', kind: 'tip', t: '`p1 + p2`는 두 그림을 옆으로 붙이고, `plot_layout(guides = "collect")`는 범례를 오른쪽 하나로 모아요. `color = "bw"`는 흑백(점 모양으로 구분), `show.legend = F`는 p1의 범례 끄기.' },
        '**두 그림의 점 높이가 같아요.** 세로선(신뢰구간)만 조금 달라요: 모델은 잔차 표준오차 **하나**(41.5)를 네 칸이 같이 쓰고, 오른쪽은 칸마다 따로 계산하거든요.',
      ],
      quiz: [
        { type: 'mcq', q: '78행 그림(`terms = "voicing"`)의 두 점은?', opts: [
          { t: '경계 없음(no) 조건에서의 voiceless·voiced 예측값', ok: true, why: '144.6, 150.3. terms에 없는 요인은 기준 수준에 고정.' },
          { t: 'voiceless·voiced 각각의 전체 평균', why: '전체 평균은 151.2, 160.2예요.' },
          { t: '경계 있음 조건의 예측값', why: '기준은 no예요(mlr_mod_3을 만들 때).' },
        ] },
        { type: 'mcq', q: '왼쪽(모델)과 오른쪽(실제) 그림의 점 위치가 같은 이유는?', opts: [
          { t: '2×2 상호작용 모델은 네 칸의 평균을 그대로 예측하기 때문', ok: true, why: '계수 4개 = 칸 4개.' },
          { t: '같은 데이터로 그려서 우연히', why: '우연이 아니라 모델 구조 때문이에요.' },
          { t: '오른쪽 그림이 모델을 사용해서', why: '오른쪽은 원자료만 써요.' },
        ] },
      ],
    },
  ],
});

})();
