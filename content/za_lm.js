/* 단원 reg: wk7 앞부분 — 단순 회귀, summary() 표 해석 */
(function () {

RS.setups.eng2 = `english_young2 <- english_young %>%
  mutate(WrittenFrequency2 = WrittenFrequency-3)`;

// ---- 실제 출력 (로컬 R 4.6.1로 실행한 그대로) ----
const SUM_FREQ1 = `Call:
lm(formula = RTlexdec ~ WrittenFrequency, data = english_young)

Residuals:
     Min       1Q   Median       3Q      Max
-0.34664 -0.05523 -0.00546  0.05167  0.34877

Coefficients:
                   Estimate Std. Error t value Pr(>|t|)
(Intercept)       6.6255559  0.0049432 1340.34   <2e-16 ***
WrittenFrequency -0.0371069  0.0009242  -40.15   <2e-16 ***
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

Residual standard error: 0.08142 on 2282 degrees of freedom
Multiple R-squared:  0.414,\tAdjusted R-squared:  0.4137
F-statistic:  1612 on 1 and 2282 DF,  p-value: < 2.2e-16`;

const COEF_FREQ1 = `Coefficients:
                   Estimate Std. Error t value Pr(>|t|)
(Intercept)       6.6255559  0.0049432 1340.34   <2e-16 ***
WrittenFrequency -0.0371069  0.0009242  -40.15   <2e-16 ***
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1`;

const RES_FREQ1 = `Residuals:
     Min       1Q   Median       3Q      Max
-0.34664 -0.05523 -0.00546  0.05167  0.34877 `;

const FIT_FREQ1 = `Residual standard error: 0.08142 on 2282 degrees of freedom
Multiple R-squared:  0.414,\tAdjusted R-squared:  0.4137
F-statistic:  1612 on 1 and 2282 DF,  p-value: < 2.2e-16`;

RS.units.push({
  id: 'reg',
  title: '단순 회귀: lm()과 summary() 표 읽기',
  short: '질문과 데이터, 직선의 식(절편·기울기), summary() 표의 모든 줄, 원래 단위로 읽기, 중심화',
  desc: '`wk7_linear reg intro_rmld_freq.R` 1–86행 (RMLD 4장). young 참가자에게서 **단어 빈도가 어휘판단 반응시간을 얼마나 예측하는지** 보고, R이 내놓은 표를 **읽고 해석**해요. 코드는 스크립트 그대로 보여 주고, 처음 나오는 함수는 상자 안 설명으로만 다뤄요. 스크립트의 그림 연습은 실습의 [[reg-plot|wk7 연습]]에 있어요.',
  setup: 'english',
  lessons: [
    {
      id: 'reg-data',
      title: '질문과 데이터: 빈도가 높으면 더 빨리 알아볼까',
      src: 'wk7 4–16행, 29–30행',
      key: '`english`(languageR 패키지)는 영어 단어 **2,284개 × 참가자 집단 2개**(old/young) = 4,568행. 질문: **자주 쓰는 단어일수록 더 빨리 알아보는가?**',
      body: [
        { code: `library(languageR)
library(tidyverse)
library(broom)
library(sjPlot)
select <- dplyr::select # to prevent masking by MASS::select
library(jtools)`, run: false, cap: '스크립트 4–9행' },
        { note: '패키지 네 개', kind: 'tip', t: '- **languageR**: `english` 데이터\n- **broom**: 결과 표를 tibble로 (`tidy()`)\n- **sjPlot**: 모델 예측 그림 (`plot_model()`)\n- **jtools**: 보기 좋은 요약 (`summ()`)\n\n`select <- dplyr::select`는 다른 패키지(MASS)의 `select()`가 dplyr의 것을 가리지 않게 못 박는 줄이에요. RStudio에서 처음이면 `install.packages()`로 한 번 설치해요.' },
        { code: `glimpse(english)`, cap: '스크립트 15행. 열이 36개지만 이번 주에 쓰는 건 세 개예요.' },
        { table: { head: ['열', '뜻', '단위'], rows: [
          ['`RTlexdec`', '어휘판단(진짜 단어인가?) 반응시간. 그 집단 참가자들의 평균', '**로그** ms'],
          ['`WrittenFrequency`', '문어 말뭉치(CELEX)에서 그 단어의 빈도', '**로그** 빈도'],
          ['`AgeSubject`', '참가자 집단', 'factor: `old`, `young`'],
        ] } },
        { code: `english_young <- english %>%
  filter(AgeSubject == "young")`, run: false, cap: '스크립트 29–30행: young 집단만 → 단어 하나당 한 줄, 2,284행.' },
        { note: '두 변수 모두 로그', kind: 'warn', t: '`RTlexdec`와 `WrittenFrequency`는 둘 다 **자연로그** 값이에요. 그래서 회귀 결과의 숫자도 "로그 단위"로 읽어요 → [[reg-unit|원래 단위로 읽기]].' },
      ],
      quiz: [
        { type: 'mcq', q: '`english`가 4,568행인 이유는?', opts: [
          { t: '2,284단어 각각에 young 평균 한 행, old 평균 한 행', ok: true, why: '한 행 = 단어 × 집단이에요.' },
          { t: '참가자가 4,568명', why: '한 행은 참가자가 아니라 단어 × 집단이에요.' },
          { t: '단어가 4,568개', why: '같은 단어가 두 번(집단마다) 나와요.' },
        ] },
        { type: 'mcq', q: 'RTlexdec 값 6.5는 대략 몇 ms일까요?', opts: [
          { t: '`exp(6.5)` ≈ 665 ms', ok: true, why: '자연로그를 되돌리는 함수는 exp()예요.' },
          { t: '6.5 ms', why: '로그 값이라 그대로 읽으면 안 돼요.' },
          { t: '`10^6.5` ≈ 316만 ms', why: '상용로그(log10)가 아니라 자연로그예요.' },
        ] },
      ],
    },
    {
      id: 'reg-lm',
      title: 'lm(): 점들을 지나는 직선을 숫자 두 개로',
      src: 'wk7 32–40행, 49행',
      key: '`lm(반응변수 ~ 예측변수, data = )`는 그림의 직선을 숫자 두 개로 바꾼다. **예측값 = 절편 + 기울기 × x**. 절편 = **x가 0일 때**의 y, 기울기 = **x가 1 늘 때** y의 변화.',
      body: [
        { code: `(ggplot(english_young, aes(WrittenFrequency, RTlexdec)) +
    geom_point(size = 3, alpha=0.2, color = "darkgrey") +
    geom_smooth(method = "lm", color = 'black', fill = "darkgrey") +
    labs(x= "Word frequency", y= "Reaction time (log msec)") +
    ggtitle("Young subjects only"))`, cap: '스크립트 32–36행 (연습 1의 정답 그림)' },
        '직선이 오른쪽 아래로 기울어 있어요 → 빈도가 높은 단어일수록 반응시간이 짧다. `lm()`은 이 직선을 숫자로 구해요. 각 점에서 직선까지의 세로 거리(잔차)를 제곱해 더한 값이 가장 작은 직선이에요.',
        { code: `slr_mod_freq1 <- lm(RTlexdec ~ WrittenFrequency, data = english_young)
coefficients(slr_mod_freq1)`, cap: '스크립트 40행, 49행' },
        '**예측 RTlexdec = 6.6256 + (−0.0371) × WrittenFrequency**',
        { table: { head: ['WrittenFrequency', '예측 RTlexdec'], rows: [
          ['0', '**6.6256** ← 절편'],
          ['1', '6.5884'],
          ['5', '6.4400'],
          ['10', '6.2545'],
        ] } },
        '- **절편 6.6256**: 로그 빈도가 0인 단어의 예측 log RT\n- **기울기 −0.0371**: 로그 빈도가 1 오를 때마다 log RT가 0.0371씩 **줄어든다** (음수 = 빈도↑ → 반응시간↓)',
        { note: '공식 읽는 법', kind: 'tip', t: '`~` 왼쪽은 설명하려는 값(반응변수, y), 오른쪽은 설명에 쓰는 값(예측변수, x). `facet_wrap(~ class)`의 그 물결표예요. `slr` = simple linear regression(예측변수 하나짜리 회귀).' },
        { note: 'Python과 비교', kind: 'py', t: 'statsmodels의 `smf.ols("RTlexdec ~ WrittenFrequency", data=df).fit()`과 같아요. `fit.params` ↔ `coefficients(mod)`.' },
      ],
      quiz: [
        { type: 'mcq', q: 'Intercept `6.6255559`의 뜻은?', opts: [
          { t: 'WrittenFrequency가 0인 단어의 예측 log RT', ok: true, why: '절편 = x가 0일 때의 예측값.' },
          { t: '모든 단어의 평균 log RT', why: '절편은 평균이 아니에요 (young의 평균은 6.439).' },
          { t: '반응시간이 0일 때의 빈도', why: 'y와 x를 거꾸로 생각했어요.' },
        ] },
        { type: 'mcq', q: 'WrittenFrequency가 4인 단어와 5인 단어의 **예측값 차이**는?', opts: [
          { t: '0.0371 (5인 단어가 그만큼 짧다)', ok: true, why: 'x가 1 차이 나면 예측값은 기울기만큼 차이 나요. 어느 x에서든 같아요.' },
          { t: '6.6256', why: '절편은 x = 0일 때의 값이에요.' },
          { t: '알 수 없다', why: '직선이라 x 1 차이 = 항상 기울기만큼 차이.' },
        ] },
        { type: 'mcq', q: '`lm(WrittenFrequency ~ RTlexdec, …)`는 어떤 질문일까요?', opts: [
          { t: '반응시간으로 빈도를 설명하는, 방향이 거꾸로인 질문', ok: true, why: '`~` 왼쪽이 설명받는 쪽이에요.' },
          { t: '원래 모델과 같은 질문', why: '왼쪽(y)과 오른쪽(x)의 역할이 바뀌어요.' },
          { t: '에러가 난다', why: '문법은 맞아요. 질문이 다를 뿐이에요.' },
        ] },
      ],
    },
    {
      id: 'reg-map',
      title: 'summary() 표 지도: 어디에 무엇이 있나',
      src: 'wk7 42행 `summary(slr_mod_freq1)`',
      key: 'summary()는 위에서부터 **① 어떤 모델(Call) → ② 잔차 → ③ 계수 표 → ④ 모델 전체 성적**. 가장 많이 읽는 곳은 ③ 계수 표의 **Estimate와 Pr(>|t|)**.',
      setup: ['english', 'lm1'],
      body: [
        { code: `summary(slr_mod_freq1)`, run: false },
        { anno: SUM_FREQ1, cap: '실제 출력. 번호를 눌러 보세요.', marks: [
          { s: 'lm(formula = RTlexdec ~ WrittenFrequency, data = english_young)', label: 'Call', t: '어떤 공식·데이터로 만든 모델인지. 먼저 **반응변수가 무엇이고 단위가 무엇인지**(여기선 로그 ms) 확인해요.' },
          { s: 'Residuals:', t: '잔차(실제 − 예측)의 분포 요약 → [[reg-fit|모델 전체 성적]]' },
          { s: 'Estimate', t: '추정값: 절편과 기울기 숫자 그 자체 → [[reg-lm|직선의 식]]' },
          { s: 'Std. Error', t: '표준오차: 그 추정값이 표본에 따라 얼마나 흔들릴 수 있는지 → [[reg-coef|계수 표]]' },
          { s: 't value', t: '`Estimate ÷ Std. Error`. 추정값이 0에서 표준오차 몇 개만큼 떨어져 있는지.' },
          { s: 'Pr(>|t|)', t: 'p값. "진짜 값이 0이라면 이 정도 t가 나올 확률". 작을수록(< .05) "유의하다".' },
          { s: '(Intercept)', t: '절편 행: **x = 0일 때** 예측되는 y.' },
          { s: 'WrittenFrequency', n: 2, label: 'WrittenFrequency (행)', t: '기울기 행: x가 1 늘 때 y가 변하는 양. **연구 질문(빈도 효과)의 답이 이 줄**에 있어요.' },
          { s: 'Signif. codes', t: '별표 기준: `***` p < .001, `**` < .01, `*` < .05, `.` < .1.' },
          { s: 'Residual standard error: 0.08142', t: '예측이 보통 이만큼(로그 단위 0.08) 빗나간다 → [[reg-fit|모델 전체 성적]]' },
          { s: '2282 degrees of freedom', t: '자유도 = 관측 수 − 계수 개수 = 2284 − 2.' },
          { s: 'Multiple R-squared:  0.414', t: 'R²: 반응시간 변동의 **41.4%**를 이 모델이 설명.' },
          { s: 'Adjusted R-squared:  0.4137', t: '수정 R²: 예측변수 개수만큼 벌점을 준 R².' },
          { s: 'F-statistic:  1612 on 1 and 2282 DF,  p-value: < 2.2e-16', label: 'F-statistic', t: '모델 전체 검정: "예측변수가 하나도 없는 모델(평균만)보다 나은가?"' },
        ] },
      ],
      quiz: [
        { type: 'mcq', q: '이 표에서 "빈도가 반응시간에 미치는 효과"를 나타내는 숫자는?', opts: [
          { t: '`-0.0371069` (WrittenFrequency의 Estimate)', ok: true, why: '기울기가 효과의 크기와 방향이에요.' },
          { t: '`6.6255559` (Intercept의 Estimate)', why: '절편은 x = 0일 때의 예측값이에요.' },
          { t: '`0.414` (R²)', why: 'R²는 설명하는 비율이지 효과의 방향·크기가 아니에요.' },
          { t: '`1612` (F)', why: 'F는 모델 전체 검정 통계량이에요.' },
        ] },
        { type: 'mcq', q: '모델이 반응시간 변동의 몇 %를 설명하나요?', opts: [
          { t: '약 41%', ok: true, why: 'Multiple R-squared 0.414.' },
          { t: '약 8%', why: '0.08142는 잔차 표준오차예요.' },
          { t: '약 4%', why: '0.0371은 기울기예요.' },
        ] },
      ],
    },
    {
      id: 'reg-coef',
      title: '계수 표: Estimate · Std. Error · t · p',
      src: 'wk7 42행 Coefficients 표, key 55행 메모',
      key: '각 행은 "**이 계수가 사실은 0인데 우연히 이렇게 나왔을까?**"를 검정한다. **t = Estimate ÷ Std. Error**, p = 그런 우연의 확률. **p < .05면 "유의하다"**.',
      body: [
        { anno: COEF_FREQ1, marks: [
          { s: 'Std. Error', t: '**표준오차**: 데이터를 새로 모으면 이 추정값이 이 정도(±0.0009) 흔들린다. 작을수록 정밀해요.' },
          { s: '-40.15', t: '**t = −0.0371069 ÷ 0.0009242 = −40.15**. 추정값이 0에서 표준오차 40개만큼 떨어져 있어요. 관측이 많으면 대략 |t| > 2가 p < .05예요.' },
          { s: '<2e-16', n: 2, t: '**p < 2 × 10⁻¹⁶**. 진짜 기울기가 0(빈도와 RT가 무관)이라면 이런 t가 나올 확률은 사실상 0 → **빈도 효과는 유의하다**. R은 이보다 작은 p를 모두 `<2e-16`으로 보여 줘요.' },
          { s: '***', n: 2, t: '별표 세 개: p < .001.' },
          { s: '1340.34', t: '절편 행의 검정은 "절편이 0인가?"예요. log RT가 0일 리 없으니 보통 **관심 없는 검정**이에요.' },
        ] },
        'key 55행에 선생님이 남긴 메모도 같은 말이에요: `## Estimate (추정치) ÷ SE (Standard Error, 추정치의 불확실성의 정도) = t-value`.',
        { table: { head: ['단계', '이 모델에서'], rows: [
          ['① 귀무가설(H₀)', '진짜 기울기 = 0 (빈도는 RT와 무관)'],
          ['② 추정값과 그 흔들림', 'Estimate −0.0371, Std. Error 0.000924'],
          ['③ t = Estimate ÷ SE', '−40.15'],
          ['④ p값', '< 2e-16 → .05보다 훨씬 작음'],
          ['⑤ 결론', '빈도는 반응시간을 **유의하게** 예측한다'],
        ] } },
        { note: '논문에 쓸 때', kind: 'src', t: '"단어 빈도가 높을수록 반응시간이 유의하게 짧았다 (β = −0.037, SE = 0.0009, t = −40.15, p < .001)."' },
        { note: 'p값은 효과의 크기가 아니다', kind: 'warn', t: '효과가 **얼마나 큰지**는 Estimate로 말해요. p는 "0이 아니라고 얼마나 확신하는가"일 뿐이에요. wk8에서 p는 작은데 R²는 1%인 예를 봐요 → [[neut-data|wk8 첫 모델]].' },
        { note: '같은 표를 다른 모양으로 (스크립트 57–66행)', kind: 'tip', t: '- `tidy(slr_mod_freq1)`(broom): 이 계수 표를 **tibble**로. 열 이름만 달라요: `estimate` = Estimate, `std.error` = Std. Error, `statistic` = t value, `p.value` = Pr(>|t|). `write_csv()`로 저장할 수 있어요.\n- `summ(slr_mod_freq1)`(jtools): 같은 숫자를 깔끔한 표로. `p = 0.0000`은 반올림이지 0이 아니에요.\n- `sink("파일.txt")` … `sink()`: 그사이의 출력을 화면 대신 파일로 보내요. 끝에 `sink()`를 꼭 해야 화면으로 돌아와요.' },
      ],
      quiz: [
        { type: 'fill', q: 't value를 만드는 식', code: 't value = Estimate ÷ ▢', ans: [['Std. Error', 'Std.Error', 'SE', 'std. error', 'standard error', '표준오차']], why: '−0.0371069 ÷ 0.0009242 = −40.15.' },
        { type: 'mcq', q: '`<2e-16`의 뜻은?', opts: [
          { t: 'p가 2 × 10⁻¹⁶보다 작다 (아주 작다)', ok: true, why: 'R이 보여 주는 하한이에요.' },
          { t: 'p가 정확히 2', why: 'p는 0과 1 사이 확률이에요.' },
          { t: '효과 크기가 2 × 10⁻¹⁶', why: '효과 크기는 Estimate예요.' },
        ] },
        { type: 'mcq', q: '어떤 계수의 Estimate = 0.5, Std. Error = 1.0이라면?', opts: [
          { t: 't = 0.5 → 0과 구별하기 어렵다 (유의하지 않을 것)', ok: true, why: '0에서 표준오차 반 개만큼만 떨어져 있어요.' },
          { t: 't = 2 → 유의하다', why: 't = 0.5 ÷ 1.0 = 0.5예요.' },
          { t: 'Estimate가 양수이므로 유의하다', why: '부호와 유의성은 별개예요.' },
        ] },
      ],
    },
    {
      id: 'reg-fit',
      title: '모델 전체 성적: 잔차 · R² · RSE · F',
      src: 'wk7 42–46행',
      key: '표의 위(잔차)와 아래 세 줄은 계수 하나가 아니라 **모델 전체**의 성적표. **R² = 반응변수의 변동 중 모델이 설명한 비율** (0 ~ 1).',
      setup: ['english', 'lm1'],
      body: [
        { anno: RES_FREQ1, marks: [
          { s: 'Median', t: '잔차 = 실제 − 예측. 중앙값 −0.005 ≈ 0 → 직선이 점들의 한가운데를 지나요.' },
          { s: '1Q', t: '1사분위 −0.055와 3사분위 +0.052의 크기가 비슷 → 잔차가 0을 중심으로 **대칭**. 좋은 신호예요.' },
          { s: 'Max', t: '가장 크게 빗나간 단어: 예측보다 log RT가 0.349 길었어요(더 느렸어요).' },
        ] },
        { anno: FIT_FREQ1, marks: [
          { s: '0.08142', t: '**잔차 표준오차(RSE)**: 예측이 보통 이 정도 빗나가요(로그 단위 ±0.08). 반응변수와 같은 단위.' },
          { s: '2282 degrees of freedom', t: '**자유도** = 관측 수 − 계수 개수 = 2284 − 2.' },
          { s: '0.414', t: '**R² = 0.414**: 반응시간 차이의 41.4%를 빈도 하나로 설명. 나머지 58.6%는 다른 요인이나 잡음.' },
          { s: '0.4137', t: '**수정 R²**: 예측변수를 늘리면 R²는 쓸모없는 변수여도 올라가요. 그래서 개수만큼 벌점을 준 값이에요.' },
          { s: '1612', t: '**F**: "예측변수가 없는 모델(모든 단어를 평균으로 예측)"보다 나은가. 예측변수가 하나일 땐 **F = t²** (40.15² ≈ 1612)라서 계수 표의 검정과 같아요.' },
          { s: 'p-value: < 2.2e-16', t: 'F 검정의 p값. 모델 전체가 유의하다.' },
        ] },
        { code: `cor.test(english_young$WrittenFrequency, english_young$RTlexdec)`, cap: '스크립트 45행' },
        { note: '상관계수 r과 R² (스크립트 44–46행)', kind: 'tip', t: '`cor.test()`의 **r = −0.643**(음의 상관)을 제곱하면 0.414 = R². 예측변수가 하나인 회귀에서는 **R² = r²**이고, cor.test의 t(−40.152)·df(2282)도 기울기 검정과 같아요.\n\n46행 `-0.6434^2`가 −0.414로 나오는 건 `^`(거듭제곱)이 부호보다 먼저 계산되기 때문이에요. 제곱하려면 `(-0.6434)^2`. 파이썬 `-0.6434**2`도 같아요.' },
      ],
      quiz: [
        { type: 'mcq', q: 'R² = 0.414의 올바른 해석은?', opts: [
          { t: '반응시간 변동의 41.4%를 빈도로 설명한다', ok: true, why: '설명된 분산 비율.' },
          { t: '빈도가 1 오르면 반응시간이 41.4% 줄어든다', why: '그건 기울기를 읽는 방식이에요.' },
          { t: '예측이 41.4% 확률로 맞는다', why: 'R²는 확률이 아니에요.' },
        ] },
        { type: 'mcq', q: '잔차가 **양수(+)**인 단어는?', opts: [
          { t: '모델의 예측보다 실제 반응시간이 길었다 (더 느렸다)', ok: true, why: '잔차 = 실제 − 예측 > 0.' },
          { t: '예측보다 빨랐다', why: '그건 음수 잔차예요.' },
          { t: '빈도가 높은 단어다', why: '잔차의 부호는 빗나간 방향이에요.' },
        ] },
        { type: 'mcq', q: 'r = −0.6434일 때 (예측변수 하나인) 회귀의 R²는?', opts: [
          { t: '0.414', ok: true, why: '(−0.6434)² = 0.414. 제곱이라 부호가 사라져요.' },
          { t: '−0.414', why: 'R²는 0 이상이에요.' },
          { t: '−0.6434', why: 'r 그 자체는 R²가 아니에요.' },
        ] },
        { type: 'tf', q: 'R²만 보면 빈도와 반응시간의 관계가 양(+)인지 음(−)인지 알 수 있다.', ans: false, why: 'R²는 제곱이라 방향 정보가 없어요. 방향은 기울기(또는 r)의 부호로 봐요.' },
      ],
    },
    {
      id: 'reg-unit',
      title: '원래 단위로 읽기와 신뢰구간: exp() · confint()',
      src: 'wk7 50–54행',
      key: 'RTlexdec·WrittenFrequency는 자연로그 값. 절편을 ms로 보려면 `exp()`. `confint()`는 계수의 95% 신뢰구간이고, **0이 들어 있지 않으면** p < .05와 같은 결론.',
      setup: ['english', 'lm1'],
      body: [
        { note: '50행은 실행용 코드가 아니에요', kind: 'warn', t: '`ln(RTlexdec) = 6.62555588 - 0.03710692*ln(WrittenFrequency)`는 회귀식을 적어 둔 **메모**예요. R에는 `ln()`이 없어서(자연로그는 `log()`) 실행하면 에러가 나요. 스크립트 전체를 실행(Source)할 땐 앞에 `#`을 붙여 두세요.' },
        { code: `exp(6.6255559) ## raw.RT of the intercept
exp(1)`, cap: '스크립트 51–52행' },
        '- `exp(6.6255559)` ≈ **754 ms**: 로그 빈도가 0인 단어의 예상 반응시간(절편을 ms로).\n- `exp(1)` = e ≈ 2.718: 로그 빈도가 **1 늘어난다** = 원래 빈도가 **약 2.7배** 된다. 그래서 기울기 −0.0371은 "빈도가 2.7배 될 때마다 log RT가 0.0371 줄어든다".',
        { code: `confint(slr_mod_freq1)`, cap: '스크립트 54행' },
        '- 기울기의 95% 신뢰구간 **−0.0389 ~ −0.0353**: "진짜 빈도 효과는 아마 이 범위 안"이라고 읽어요.\n- 대략 Estimate ± 2 × Std. Error (−0.0371 ± 2 × 0.0009).\n- 구간 전체가 음수 → 0을 포함하지 않음 → 빈도 효과는 유의.\n- 두 열 `2.5 %`, `97.5 %`는 구간의 아래 끝과 위 끝이에요.',
      ],
      quiz: [
        { type: 'mcq', q: '`exp(6.6255559)` = 754.1의 뜻은?', opts: [
          { t: '로그 빈도가 0인 단어의 예측 반응시간 754 ms', ok: true, why: '절편(로그 ms)을 ms로 되돌린 값.' },
          { t: 'young 참가자의 평균 반응시간', why: '절편은 x = 0일 때의 예측값이에요.' },
          { t: '빈도가 754인 단어', why: 'exp()한 것은 반응시간(y) 쪽이에요.' },
        ] },
        { type: 'mcq', q: 'WrittenFrequency가 1 커진다는 것은 원래 빈도가?', opts: [
          { t: '약 2.7배(e배)가 된다', ok: true, why: '자연로그 1 = ×e. 그래서 스크립트에 `exp(1)`이 있어요.' },
          { t: '1번 더 나온다', why: '로그 척도에서 "더하기"는 원래 척도의 "곱하기"예요.' },
          { t: '10배가 된다', why: '그건 상용로그(log10)일 때.' },
        ] },
        { type: 'mcq', q: '어떤 계수의 95% 신뢰구간이 [−0.02, 0.05]라면?', opts: [
          { t: '0을 포함하므로 p > .05 (유의하지 않음)', ok: true, why: '"진짜 값이 0일 수도 있다"는 뜻.' },
          { t: '양수 쪽이 더 넓으므로 유의한 양의 효과', why: '0이 구간 안에 있으면 방향을 확신할 수 없어요.' },
          { t: '구간 폭이 좁으므로 유의', why: '폭이 아니라 0 포함 여부를 봐요.' },
        ] },
      ],
    },
    {
      id: 'reg-center',
      title: 'x를 옮기면 절편만 바뀐다 (WrittenFrequency − 3)',
      src: 'wk7 71–86행',
      key: 'x에서 3을 빼면 **기울기는 그대로**, **절편만** 바뀐다. 새 절편 = **원래 x가 3일 때**의 예측값. 그림도 x축 눈금만 3칸 밀린다.',
      setup: ['english', 'eng2'],
      body: [
        { code: `english_young2 <- english_young %>%
  mutate(WrittenFrequency2 = WrittenFrequency-3)
slr_mod_freq2 <- lm(RTlexdec ~ WrittenFrequency2, data = english_young2)
summary(slr_mod_freq2)`, setup: ['english'] },
        { table: { head: ['', '`slr_mod_freq1` (x 그대로)', '`slr_mod_freq2` (x − 3)'], rows: [
          ['Intercept Estimate', '6.6255559', '**6.5142351** ← 바뀜'],
          ['Intercept Std. Error', '0.0049432', '**0.0025281** ← 작아짐'],
          ['기울기 Estimate', '−0.0371069', '−0.0371069 (같음)'],
          ['기울기 SE · t · p', '0.0009242 · −40.15 · <2e-16', '같음'],
          ['Residuals, RSE, R², F', '0.08142 · 0.414 · 1612', '같음'],
        ] } },
        '- **새 절편 확인**: 원래 직선에서 x = 3일 때 = 6.6256 − 3 × 0.0371 = **6.5142** ✓ ("WrittenFrequency2 = 0"은 "원래 WrittenFrequency = 3").\n- **절편 SE가 작아진 이유**: 데이터의 가운데(빈도 평균 ≈ 5)에 가까운 곳일수록 예측이 정밀해요. x = 0은 데이터의 끝자락이었어요.\n- 직선 자체는 그대로이고, 그 직선을 **어디에서 읽느냐(절편의 위치)**만 바뀌었어요.',
        { compare: [
          { label: '`WrittenFrequency`', code: `ggplot(english_young2, aes(WrittenFrequency, RTlexdec)) +
  geom_point(size = 3, alpha=0.2, color = "darkgrey") +
  geom_smooth(method = "lm", color = 'black', fill = "darkgrey")` },
          { label: '`WrittenFrequency2` (75행)', code: `ggplot(english_young2, aes(WrittenFrequency2, RTlexdec)) +
  geom_point(size = 3, alpha=0.2, color = "darkgrey") +
  geom_smooth(method = "lm", color = 'black', fill = "darkgrey")` },
        ] },
      ],
      quiz: [
        { type: 'mcq', q: 'x에서 3을 빼고 다시 회귀하면 **바뀌는 것**은?', opts: [
          { t: '절편(과 그 SE·t)만', ok: true, why: '기울기, 잔차, R², F는 모두 그대로.' },
          { t: '기울기만', why: '모든 점이 똑같이 옆으로 옮겨질 뿐이라 기울기는 같아요.' },
          { t: 'R²', why: '설명력은 그대로예요.' },
        ] },
        { type: 'mcq', q: '`WrittenFrequency - 5`로 바꿔서 회귀하면 절편은 대략?', opts: [
          { t: '6.440 (원래 직선에서 x = 5일 때의 예측값)', ok: true, why: '6.6256 − 5 × 0.0371 = 6.440.' },
          { t: '6.6256 (그대로)', why: '0의 위치가 옮겨지면 절편이 바뀌어요.' },
          { t: '−0.0371', why: '그건 기울기예요.' },
        ] },
      ],
    },
  ],
});

})();
