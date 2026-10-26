/* 단원 reg: wk7 앞부분 — lm() 단순 회귀와 summary() 표 읽기 */
(function () {

// ---- 준비 코드 (wk7·wk8 단원 공통) ----
RS.setups.eng2 = `english_young2 <- english_young %>%
  mutate(WrittenFrequency2 = WrittenFrequency-3)`;
RS.setups.broom = `library(broom)`;
RS.setups.jtools = `library(jtools)`;

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

const FIT_FREQ1 = `Residual standard error: 0.08142 on 2282 degrees of freedom
Multiple R-squared:  0.414,\tAdjusted R-squared:  0.4137
F-statistic:  1612 on 1 and 2282 DF,  p-value: < 2.2e-16`;

const RES_FREQ1 = `Residuals:
     Min       1Q   Median       3Q      Max
-0.34664 -0.05523 -0.00546  0.05167  0.34877 `;

RS.units.push({
  id: 'reg',
  title: '회귀 입문: lm()과 summary() 표 읽기',
  short: '패키지와 english 데이터, 연습 1, y ~ x, 절편과 기울기, summary() 표의 모든 줄(잔차·계수·t·p·R²·F), r과 R², exp(), confint, tidy/summ, 중심화, 변환·다듬기',
  desc: '`wk7_linear reg intro_rmld_freq.R` 1–86행과 그 key(빈칸 연습의 정답), 교재 RMLD 4장, 슬라이드 wk7_transformation_trimming_Tamminga. 젊은 참가자(`english_young`)에게서 **단어 빈도가 어휘판단 반응시간을 얼마나 예측하는지** 단순 선형 회귀로 알아보고, `summary()` 표를 한 줄씩 읽어요.',
  setup: 'english',
  lessons: [
    {
      id: 'reg-data',
      title: 'english 데이터: 무엇을 무엇으로 예측하나',
      src: 'wk7 4–16행, 29–30행',
      key: '`english`(languageR 패키지)는 영어 단어 **2,284개 × 참가자 집단 2개**(old/young) = 4,568행. 이번 주의 질문은 **자주 쓰는 단어일수록 더 빨리 알아보는가?**',
      body: [
        { code: `library(languageR)
library(tidyverse)
library(broom)
library(sjPlot)
select <- dplyr::select # to prevent masking by MASS::select
library(jtools)`, run: false, cap: '스크립트 4–9행' },
        '- **languageR**: `english` 데이터가 들어 있는 패키지\n- **broom**: 모델 결과를 tibble로 정리 (`tidy()`, `glance()`)\n- **sjPlot**: 모델 예측 그림 (`plot_model()`)\n- **jtools**: 보기 좋은 모델 요약 (`summ()`)\n- `select <- dplyr::select`: 통계 패키지 MASS에도 `select()`가 있어서, 나중에 불러온 쪽이 dplyr의 select를 **가려 버려요**. 그래서 "select는 dplyr 것"으로 못 박아 두는 줄이에요.',
        { note: '처음 한 번은 설치', kind: 'tip', t: 'RStudio에서 처음이면 `install.packages(c("languageR", "broom", "sjPlot", "jtools", "patchwork"))`를 한 번 해요 (A단원). 이 도구의 연습장은 코드에 `library(languageR)` 같은 줄이 보이면 처음 한 번 자동으로 설치해요 (sjPlot은 1분 가까이 걸려요).' },
        { code: `glimpse(english)`, cap: '스크립트 15행. 열이 36개지만 이번 주에 쓰는 건 세 개뿐이에요.' },
        { code: `english %>%
  select(Word, AgeSubject, RTlexdec, WrittenFrequency) %>%
  head()
table(english$AgeSubject)`, cap: '필요한 열만 보기. `table()`은 값마다 개수를 세요: old 2,284, young 2,284.' },
        { table: { head: ['열', '뜻', '단위'], rows: [
          ['`RTlexdec`', '어휘판단(진짜 단어인가?) 반응시간. 그 집단 참가자들의 평균', '**로그** ms (6.54 → `exp(6.54)` ≈ 692 ms)'],
          ['`WrittenFrequency`', '문어 말뭉치(CELEX)에서 그 단어의 빈도', '**로그** 빈도 (0 = 빈도 1)'],
          ['`AgeSubject`', '참가자 집단', 'factor: `old`, `young`'],
        ] } },
        { code: `english_young <- english %>%
  filter(AgeSubject == "young")`, cap: '스크립트 29–30행: young 집단만 남기면 단어 하나당 한 줄 → 2,284행.' },
        { note: '두 변수 모두 로그', kind: 'warn', t: '`RTlexdec`와 `WrittenFrequency`는 둘 다 **자연로그** 값이에요. 그래서 회귀 결과의 숫자도 "로그 단위"로 읽어야 해요. 원래 단위로 돌리는 법은 [[reg-log|로그 단위 되돌리기]] 레슨에서.' },
      ],
      quiz: [
        { type: 'mcq', q: '`english`가 4,568행인 이유는?', opts: [
          { t: '2,284단어 각각에 young 평균 한 행, old 평균 한 행', ok: true, why: '`table(english$AgeSubject)`가 old 2,284, young 2,284예요.' },
          { t: '참가자가 4,568명', why: '한 행은 참가자가 아니라 단어 × 집단이에요.' },
          { t: '단어가 4,568개', why: '같은 단어가 두 번(집단마다) 나와요.' },
        ] },
        { type: 'predict', q: 'RTlexdec 값 6.5는 몇 ms일까요?', setup: [], code: `exp(6.5)`, opts: [
          { t: '`[1] 665.1416`', ok: true, why: '자연로그를 되돌리는 함수는 exp()예요.' },
          { t: '`[1] 6.5`', why: 'RTlexdec는 로그값이라 ms로 보려면 exp()를 해요.' },
          { t: '`[1] 3162278`', why: '그건 10^6.5예요. RTlexdec는 log10이 아니라 자연로그예요.' },
        ] },
        { type: 'mcq', q: '`english_young`은 몇 행일까요?', opts: [
          { t: '2,284', ok: true, why: '단어 2,284개 × young 한 집단.' },
          { t: '4,568', why: '그건 old + young 전체(`english`)예요.' },
          { t: '36', why: '36은 열 개수예요.' },
        ] },
      ],
    },
    {
      id: 'reg-plot',
      title: '그림 먼저: geom_smooth(method = "lm")',
      src: 'wk7 19–36행 (Practice), 정답: wk7 key 30–37행',
      key: '회귀는 점들을 **가장 잘 지나는 직선 하나**를 찾는 일. `geom_smooth(method = "lm")`이 그 직선(과 95% 신뢰띠)을 그려 준다.',
      body: [
        { code: `(ggplot(english_young, aes(WrittenFrequency, RTlexdec)) +
    geom_point(size = 3, alpha=0.2, color = "darkgrey") +
    geom_smooth(method = "lm", color = 'black', fill = "darkgrey") +
    labs(x= "Word frequency", y= "Reaction time (log msec)") +
    ggtitle("Young subjects only"))` },
        '**읽는 법:** 직선이 오른쪽 아래로 기울어 있어요 → 빈도가 높은 단어일수록 반응시간이 짧다(더 빨리 알아본다).',
        '**"가장 잘 지나는"의 뜻:** 각 점에서 직선까지의 **세로 거리**(잔차)를 제곱해서 모두 더한 값이 가장 작은 직선이에요(최소제곱법). `lm()`이 하는 일이 바로 이 직선의 절편과 기울기를 계산하는 거예요.',
        '지시를 짝지으면: "straight smoothing line" → `method = "lm"`, "Black smoothing line" → `color = "black"`, "grey confidence band" → `fill = "grey"`(또는 `"darkgrey"`).',
        { note: '바깥 괄호', kind: 'tip', t: '스크립트처럼 `( ... )`로 전체를 감싸면 "만들고 바로 출력"이에요. 괄호가 없어도 할당(`<-`)이 없으면 그대로 그려지니 결과는 같아요.' },
      ],
      quiz: [
        { type: 'mcq', q: '이 그림에서 `method = "lm"`을 빼면?', opts: [
          { t: '직선 대신 구불구불한 곡선(gam)이 그려진다', ok: true, why: '데이터가 1,000행 이상이면 기본 방법이 gam이에요 (적으면 loess). `"lm"`이어야 회귀 직선.' },
          { t: '선이 사라진다', why: 'geom_smooth는 기본 방법으로라도 선을 그려요.' },
          { t: '에러가 난다', why: '기본값이 있어서 에러는 아니에요.' },
        ] },
        { type: 'write', q: '스크립트 21–27행 Practice: `english_young`을 **직접 만들고**(빈칸이었던 29–30행), young 참가자의 빈도(x)–반응시간(y) 산점도에 직선을 그리세요.\n\n1. 진회색, 반투명한 점\n2. 검은 직선 + 회색 신뢰띠\n3. 축 이름', setup: ['languageR'], given: `library(languageR)`, checks: [
          { r: 'data_nrow() == 2284', m: 'young 참가자 행만 (`filter(AgeSubject == "young")`, 2,284행)' },
          { r: 'maps("x", "WrittenFrequency") && maps("y", "RTlexdec")', m: 'x = WrittenFrequency, y = RTlexdec' },
          { r: 'any(vapply(c("darkgray", "darkgrey", "gray40", "grey40", "gray30", "grey30", "dimgray", "dimgrey"), function(v) has_param("point", "colour", v), TRUE))', m: '점: 진회색 (`color = "darkgrey"`)' },
          { r: 'param_between("point", "alpha", 0.01, 0.9)', m: '점: 반투명 (`alpha`)' },
          { r: 'has_param("smooth", "method", "lm") && has_param("smooth", "colour", "black")', m: '검은 직선 (`method = "lm"`, `color = "black"`)' },
          { r: 'any(vapply(c("grey", "gray", "darkgrey", "darkgray", "grey50", "grey60", "grey70", "lightgrey", "lightgray"), function(v) has_param("smooth", "fill", v), TRUE))', m: '회색 띠 (`fill = "grey"`)' },
          { r: 'lab_set("x") && lab_set("y")', m: '축 이름 (`labs(x = , y = )`)' },
        ], sol: `english_young <- english %>%
  filter(AgeSubject == "young")

(ggplot(english_young, aes(WrittenFrequency, RTlexdec)) +
  geom_point(size = 3, alpha=0.2, color = "darkgrey") +
  geom_smooth(method = "lm", color = 'black', fill = "darkgrey") +
  labs(x= "Word frequency", y= "Reaction time (log msec)") +
  ggtitle("Young subjects only"))`, solNote: 'wk7 key 30–37행 그대로예요.' },
        { type: 'mcq', q: '스크립트 24행 "take-home point"로 알맞은 한 문장은?', opts: [
          { t: '자주 쓰이는 단어일수록 young 참가자가 더 빨리 알아본다 (빈도↑ → 반응시간↓)', ok: true, why: '직선이 오른쪽 아래로 내려가요.' },
          { t: '빈도가 높을수록 느리다', why: '선이 내려가요.' },
          { t: '빈도와 반응시간은 관계없다', why: '기울기가 뚜렷해요.' },
        ] },
      ],
    },
    {
      id: 'reg-lm',
      title: 'lm(): 공식 y ~ x',
      src: 'wk7 39–40행',
      key: '`lm(반응변수 ~ 예측변수, data = 데이터)`. `~`는 "왼쪽을 오른쪽으로 설명한다(예측한다)". 결과(모델)는 객체에 저장해 두고 다른 함수로 꺼내 본다.',
      setup: ['english'],
      body: [
        { code: `slr_mod_freq1 <- lm(RTlexdec ~ WrittenFrequency, data = english_young)
slr_mod_freq1`, cap: '모델 이름만 치면 공식(Call)과 계수 두 개만 짧게 보여 줘요.' },
        { table: { head: ['용어', '이 모델에서', '다른 이름'], rows: [
          ['반응변수 (`~` 왼쪽)', '`RTlexdec`', '종속변수, y, outcome'],
          ['예측변수 (`~` 오른쪽)', '`WrittenFrequency`', '독립변수, x, predictor'],
          ['단순 선형 회귀 (SLR)', '예측변수가 **하나**', 'simple linear regression'],
        ] } },
        '모델 객체를 받는 함수들: `summary()`(전체 표), `coefficients()`(계수만), `confint()`(신뢰구간), `tidy()`(표를 tibble로), `plot_model()`(예측 그림). 모두 이번 주에 나와요.',
        { note: '~는 처음이 아니에요', kind: 'tip', t: 'F단원 `facet_wrap(~ class)`의 그 물결표예요. R에서 `~`가 들어간 식은 "공식(formula)"이라 부르고, "왼쪽을 오른쪽에 따라"로 읽어요. `slr_mod_freq1`의 slr = simple linear regression.' },
        { note: 'Python과 비교', kind: 'py', t: 'statsmodels의 `smf.ols("RTlexdec ~ WrittenFrequency", data=df).fit()`과 같아요. 공식 문법(`y ~ x`)도 R에서 빌려 온 거예요. `fit.summary()` ↔ `summary(mod)`, `fit.params` ↔ `coefficients(mod)`.' },
      ],
      quiz: [
        { type: 'fill', q: '반응시간을 빈도로 예측하는 모델을 만드세요.', code: 'lm(▢ ~ ▢, data = english_young)', ans: [['RTlexdec'], ['WrittenFrequency']], why: '`~` 왼쪽이 예측하고 싶은 것(반응변수).' },
        { type: 'mcq', q: '`lm(WrittenFrequency ~ RTlexdec, data = english_young)`은?', opts: [
          { t: '반응시간으로 빈도를 예측하는 (질문이 거꾸로 된) 모델', ok: true, why: '`~` 양쪽을 바꾸면 다른 질문, 다른 직선이에요.' },
          { t: '원래 모델과 똑같다', why: '왼쪽(y)과 오른쪽(x)의 역할이 바뀌어요.' },
          { t: '에러가 난다', why: '문법은 맞아요. 질문이 이상할 뿐.' },
        ] },
        { type: 'mcq', q: '`slr_mod_freq1 <- lm(...)` 한 줄만 실행하면 콘솔에는?', opts: [
          { t: '아무것도 안 나온다', ok: true, why: '`<-` 할당은 출력이 없어요. 이름을 치거나 `summary()`로 봐요.' },
          { t: 'summary 표 전체가 나온다', why: '저장만 해요.' },
          { t: '그림이 그려진다', why: 'lm은 그림을 그리지 않아요.' },
        ] },
      ],
    },
    {
      id: 'reg-map',
      title: 'summary() 표 지도: 어디에 무엇이 있나',
      src: 'wk7 42행 `summary(slr_mod_freq1)`',
      key: 'summary()는 위에서부터 **① 어떤 모델(Call) → ② 잔차 → ③ 계수 표 → ④ 모델 전체 성적**. 시험에서 가장 많이 읽는 곳은 ③ 계수 표, 그중에서도 **Estimate와 Pr(>|t|)**.',
      setup: ['english', 'lm1'],
      body: [
        { code: `summary(slr_mod_freq1)`, run: false },
        { anno: SUM_FREQ1, cap: '실제 출력. 번호를 눌러 보세요.', marks: [
          { s: 'lm(formula = RTlexdec ~ WrittenFrequency, data = english_young)', label: 'Call', t: '어떤 공식·데이터로 만든 모델인지. 표를 읽기 전에 **반응변수가 무엇이고 단위가 무엇인지**(여기선 로그 ms) 먼저 확인해요.' },
          { s: 'Residuals:', t: '잔차(실제 − 예측)의 분포 요약. → [[reg-residuals|잔차 레슨]]' },
          { s: 'Estimate', t: '추정값. 절편과 기울기 숫자 그 자체. 해석의 중심. → [[reg-coef-est|절편과 기울기]]' },
          { s: 'Std. Error', t: '표준오차: 그 추정값이 표본에 따라 얼마나 흔들릴 수 있는지. → [[reg-coef-test|계수 검정]]' },
          { s: 't value', t: '`Estimate ÷ Std. Error`. 추정값이 0에서 표준오차 몇 개만큼 떨어져 있는지.' },
          { s: 'Pr(>|t|)', t: 'p값. "진짜 값이 0이라면 이 정도 t가 나올 확률". 작을수록(< .05) "유의하다".' },
          { s: '(Intercept)', t: '절편 행: **x = 0일 때** 예측되는 y.' },
          { s: 'WrittenFrequency', n: 2, label: 'WrittenFrequency (행)', t: '기울기 행: x가 1 늘 때 y가 변하는 양. **연구 질문(빈도 효과)의 답이 이 줄**에 있어요.' },
          { s: 'Signif. codes', t: '별표 기준: `***` p < .001, `**` < .01, `*` < .05, `.` < .1.' },
          { s: 'Residual standard error: 0.08142', t: '예측이 보통 이만큼(로그 단위 0.08) 빗나간다. → [[reg-fit|모델 전체 성적]]' },
          { s: '2282 degrees of freedom', t: '자유도 = 관측 수 − 계수 개수 = 2284 − 2.' },
          { s: 'Multiple R-squared:  0.414', t: 'R²: 반응시간의 변동 중 **41.4%**를 이 모델이 설명.' },
          { s: 'Adjusted R-squared:  0.4137', t: '수정 R²: 예측변수 개수만큼 벌점을 준 R².' },
          { s: 'F-statistic:  1612 on 1 and 2282 DF,  p-value: < 2.2e-16', label: 'F-statistic', t: '모델 전체 검정: "예측변수가 하나도 없는 모델(평균만)보다 나은가?"' },
        ] },
      ],
      quiz: [
        { type: 'mcq', q: '이 표에서 "빈도가 반응시간에 미치는 효과"를 나타내는 숫자는?', opts: [
          { t: '`-0.0371069` (WrittenFrequency의 Estimate)', ok: true, why: '기울기가 효과의 크기와 방향이에요.' },
          { t: '`6.6255559` (Intercept의 Estimate)', why: '절편은 x = 0일 때의 예측값이에요.' },
          { t: '`0.414` (R²)', why: 'R²는 모델이 설명하는 비율이지 효과의 방향·크기가 아니에요.' },
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
      id: 'reg-coef-est',
      title: '절편(Intercept)과 기울기: 직선의 식',
      src: 'wk7 49–50행 `coefficients()`',
      key: '예측값 = **절편** + **기울기** × x. **절편(Intercept) = x가 0일 때** 예측되는 y. **기울기 = x가 1 늘 때** y가 변하는 양.',
      setup: ['english', 'lm1'],
      body: [
        { code: `coefficients(slr_mod_freq1)` },
        '그래서 이 모델의 직선은:\n\n**예측 RTlexdec = 6.6256 + (−0.0371) × WrittenFrequency**',
        { table: { head: ['WrittenFrequency', '계산', '예측 RTlexdec'], rows: [
          ['0', '6.6256 + (−0.0371) × 0', '**6.6256** ← 절편'],
          ['1', '6.6256 − 0.0371', '6.5884'],
          ['5', '6.6256 − 0.0371 × 5', '6.4400'],
          ['10', '6.6256 − 0.0371 × 10', '6.2545'],
        ] } },
        '- **절편 6.6256**: 로그 빈도가 0인(= 말뭉치에 1번 나온) 단어의 예측 log RT. 이 데이터에는 실제로 빈도 0인 단어도 있어서 의미가 통해요.\n- **기울기 −0.0371**: 로그 빈도가 1 오를 때마다 log RT가 0.0371씩 **줄어든다**. 음수 = 빈도↑ → 반응시간↓.',
        { note: '절편은 "x = 0"이 말이 될 때만 의미가 있다', kind: 'warn', t: '예를 들어 x가 키(cm)라면 "키 0 cm인 사람의 예측값"은 해석할 수 없죠. 이럴 때 x를 옮겨서(빼서) 0이 의미 있는 곳이 되게 하는 것이 [[reg-center|중심화]]예요.' },
      ],
      quiz: [
        { type: 'mcq', q: 'Intercept `6.6255559`의 뜻은?', opts: [
          { t: 'WrittenFrequency가 0인 단어의 예측 log RT', ok: true, why: '절편 = x가 0일 때의 예측값.' },
          { t: '모든 단어의 평균 log RT', why: 'young의 평균은 6.439예요. 절편은 평균이 아니에요.' },
          { t: '반응시간이 0일 때의 빈도', why: 'y와 x를 거꾸로 생각했어요.' },
        ] },
        { type: 'mcq', q: 'WrittenFrequency가 4인 단어와 5인 단어의 **예측 RTlexdec 차이**는?', opts: [
          { t: '0.0371 (5인 단어가 그만큼 짧다)', ok: true, why: 'x가 1 차이 나면 예측값은 기울기만큼 차이 나요. 어느 x에서든 같아요.' },
          { t: '6.6256', why: '절편은 x = 0일 때의 값이에요.' },
          { t: '알 수 없다', why: '직선이라서 x 1 차이 = 항상 기울기만큼 차이.' },
        ] },
        { type: 'tf', q: '기울기가 음수이므로 빈도가 높은 단어일수록 반응이 빠르다(RT가 짧다).', ans: true, why: '−0.0371: x↑ → y↓.' },
      ],
    },
    {
      id: 'reg-residuals',
      title: '잔차(Residuals): 모델이 빗나간 만큼',
      src: 'wk7 42행 summary 출력 윗부분',
      key: '**잔차 = 실제 값 − 모델의 예측값**. Residuals 줄은 잔차 2,284개의 최솟값·1사분위·중앙값·3사분위·최댓값.',
      body: [
        { anno: RES_FREQ1, marks: [
          { s: 'Median', t: '중앙값 −0.005 ≈ 0. 직선이 점들의 한가운데를 지나고 있다는 뜻.' },
          { s: '1Q', t: '1사분위 −0.055와 3사분위 +0.052가 크기가 거의 같다 → 잔차가 0을 중심으로 **대칭**. 좋은 신호예요.' },
          { s: 'Max', t: '가장 크게 빗나간 단어: 예측보다 log RT가 0.349 길었어요(더 느렸어요). Min은 반대로 0.347 짧았던 단어.' },
        ] },
        '예: WrittenFrequency가 5인 단어의 예측은 6.440이에요. 실제 RTlexdec가 6.50이면 잔차 = 6.50 − 6.440 = **+0.06** (예측보다 느렸음), 6.40이면 **−0.04** (예측보다 빨랐음).',
        '`lm()`은 이 잔차들을 **제곱해서 더한 값이 가장 작아지도록** 절편과 기울기를 고른 거예요.',
      ],
      quiz: [
        { type: 'mcq', q: '잔차가 **양수(+)**인 단어는?', opts: [
          { t: '모델의 예측보다 실제 RT가 길었다 (더 느렸다)', ok: true, why: '잔차 = 실제 − 예측 > 0.' },
          { t: '모델의 예측보다 실제 RT가 짧았다', why: '그건 음수 잔차예요.' },
          { t: '빈도가 높은 단어다', why: '잔차의 부호는 빈도와 상관없이 "빗나간 방향"이에요.' },
        ] },
        { type: 'mcq', q: 'Median이 0에 가깝고 1Q와 3Q의 크기가 비슷하다는 것은?', opts: [
          { t: '잔차가 0을 중심으로 대략 대칭이다', ok: true, why: '직선이 한쪽으로 치우치지 않았어요.' },
          { t: '모델이 데이터를 100% 설명한다', why: '그러면 잔차가 전부 0이어야 해요.' },
          { t: '빈도 효과가 유의하다', why: '유의성은 계수 표의 p값으로 봐요.' },
        ] },
      ],
    },
    {
      id: 'reg-coef-test',
      title: '계수 표: Std. Error · t value · p값 · 별표',
      src: 'wk7 42행 Coefficients 표',
      key: '각 행은 "**이 계수가 사실은 0인데 우연히 이렇게 나왔을까?**"를 검정한다. **t = Estimate ÷ Std. Error**, p = 그런 우연의 확률. **p < .05면 "유의하다"**.',
      body: [
        { anno: COEF_FREQ1, marks: [
          { s: 'Std. Error', t: '**표준오차**: 데이터를 새로 모으면 이 기울기 추정값이 이 정도(±0.0009) 흔들린다. 작을수록 정밀. 관측이 많을수록, 잡음이 적을수록 작아져요.' },
          { s: '-40.15', t: '**t = −0.0371069 ÷ 0.0009242 = −40.15**. 추정값이 0에서 표준오차 40개만큼 떨어져 있어요. 대략 |t| > 2면 p < .05예요 (관측이 많을 때).' },
          { s: '<2e-16', n: 2, t: '**p < 2 × 10⁻¹⁶**. 진짜 기울기가 0(빈도와 RT가 무관)이라면 |t|가 40이나 나올 확률은 사실상 0 → "0이다"라는 가정(귀무가설)을 기각 → **빈도 효과는 유의하다**. R은 이보다 작은 p를 모두 `<2e-16`으로 보여 줘요.' },
          { s: '***', n: 2, t: '별표 세 개: p < .001.' },
          { s: '1340.34', t: '절편 행의 검정은 "절편이 0인가?"예요. log RT가 0일 리 없으니 보통 **관심 없는 검정**이에요. 해석은 기울기 행에서.' },
        ] },
        { table: { head: ['단계', '이 모델에서'], rows: [
          ['① 귀무가설(H₀)', '진짜 기울기 = 0 (빈도는 RT와 무관)'],
          ['② 추정값과 그 흔들림', 'Estimate −0.0371, Std. Error 0.000924'],
          ['③ t = Estimate ÷ SE', '−40.15'],
          ['④ p값', '< 2e-16 → .05보다 훨씬 작음'],
          ['⑤ 결론', 'H₀ 기각: 빈도는 반응시간을 **유의하게** 예측한다'],
        ] } },
        'wk7 key 55행에 선생님이 남긴 메모도 같은 말이에요: `## Estimate (추정치) ÷ SE (Standard Error, 추정치의 불확실성의 정도) = t-value`.',
        { note: '논문에 쓸 때', kind: 'src', t: '"단어 빈도가 높을수록 반응시간이 유의하게 짧았다 (β = −0.037, SE = 0.0009, t = −40.15, p < .001)." p가 아주 작으면 정확한 값 대신 `p < .001`이라고 써요.' },
        { note: 'p값은 효과의 크기가 아니다', kind: 'warn', t: '효과가 **얼마나 큰지**는 Estimate(−0.037)로 말해요. p는 "0이 아니라고 얼마나 확신하는가"일 뿐이에요. wk8에서 p는 작은데 효과·R²는 작은 예를 봐요 → [[neut-small|p는 작은데 R²는 1%]].' },
      ],
      quiz: [
        { type: 'fill', q: 't value를 만드는 식', code: 't value = Estimate ÷ ▢', ans: [['Std. Error', 'Std.Error', 'SE', 'std. error', 'standard error', '표준오차']], why: '−0.0371069 ÷ 0.0009242 = −40.15.' },
        { type: 'mcq', q: '`<2e-16`의 뜻은?', opts: [
          { t: 'p가 2 × 10⁻¹⁶보다 작다 (아주 작다)', ok: true, why: 'R이 보여 주는 하한이에요. `tidy()`로 보면 실제 값(3.88e-267)이 나와요.' },
          { t: 'p가 정확히 2', why: 'p는 0과 1 사이 확률이에요.' },
          { t: '효과 크기가 2 × 10⁻¹⁶', why: '효과 크기는 Estimate예요.' },
        ] },
        { type: 'mcq', q: '어떤 계수의 Estimate = 0.5, Std. Error = 1.0이라면?', opts: [
          { t: 't = 0.5 → 0과 구별하기 어렵다 (유의하지 않을 것)', ok: true, why: '0에서 표준오차 반 개만큼만 떨어져 있어요. 흔들림 범위 안이에요.' },
          { t: 't = 2 → 유의하다', why: 't = 0.5 ÷ 1.0 = 0.5예요.' },
          { t: 'Estimate가 양수이므로 유의하다', why: '부호와 유의성은 별개예요.' },
        ] },
      ],
    },
    {
      id: 'reg-fit',
      title: '아래 세 줄: RSE · R² · F (모델 전체 성적)',
      src: 'wk7 42–44행',
      key: '아래 세 줄은 계수 하나가 아니라 **모델 전체**의 성적표. **R² = 반응변수의 변동 중 모델이 설명한 비율** (0 ~ 1).',
      setup: ['english', 'lm1'],
      body: [
        { anno: FIT_FREQ1, marks: [
          { s: '0.08142', t: '**잔차 표준오차(RSE)**: 예측이 보통 이 정도 빗나간다(로그 단위 ±0.08). 대략 잔차들의 표준편차예요. 반응변수와 같은 단위.' },
          { s: '2282 degrees of freedom', t: '**자유도** = 관측 수 − 추정한 계수 개수 = 2284 − 2 (절편, 기울기).' },
          { s: '0.414', t: '**R² = 0.414**: young 참가자 반응시간 차이의 41.4%를 빈도 하나로 설명. 나머지 58.6%는 다른 요인이나 잡음.' },
          { s: '0.4137', t: '**수정 R²**: 예측변수가 늘수록 R²는 (쓸모없는 변수여도) 무조건 올라가요. 그래서 개수만큼 벌점을 준 값. 예측변수 하나일 땐 거의 같아요.' },
          { s: '1612', t: '**F = 1612**: "예측변수가 없는 모델(모든 단어를 평균으로 예측)"보다 이 모델이 나은가. 예측변수가 하나일 땐 **F = t²** (−40.15² ≈ 1612)라서 계수 표의 검정과 같아요.' },
          { s: '1 and 2282 DF', t: 'F의 자유도 두 개: (예측변수 개수, 잔차 자유도).' },
          { s: 'p-value: < 2.2e-16', t: 'F 검정의 p값. 모델 전체가 유의하다.' },
        ] },
        { code: `summary(slr_mod_freq1)$r.squared`, cap: '스크립트 44행: summary 결과에서 R²만 꺼내기 (`$`로 리스트 성분 꺼내기).' },
      ],
      quiz: [
        { type: 'mcq', q: 'R² = 0.414의 올바른 해석은?', opts: [
          { t: '반응시간 변동의 41.4%를 빈도로 설명한다', ok: true, why: '설명된 분산 비율.' },
          { t: '빈도가 1 오르면 반응시간이 41.4% 줄어든다', why: '그건 기울기의 해석 방식이에요.' },
          { t: '예측이 41.4% 확률로 맞는다', why: 'R²는 확률이 아니에요.' },
        ] },
        { type: 'fill', q: '이 모델의 잔차 자유도', code: '2282 = 2284 − ▢', ans: [['2']], why: '계수 2개(절편, 기울기)를 추정했으니까.' },
        { type: 'mcq', q: '예측변수가 하나인 회귀에서 F 검정과 기울기 t 검정의 관계는?', opts: [
          { t: '같은 검정이다 (F = t², p도 같다)', ok: true, why: '40.15² ≈ 1612, 둘 다 p < 2e-16.' },
          { t: '전혀 다른 질문이다', why: '예측변수가 하나면 "모델이 쓸모 있나" = "기울기가 0이 아닌가".' },
          { t: 'F가 항상 더 엄격하다', why: '하나일 땐 정확히 같아요.' },
        ] },
      ],
    },
    {
      id: 'reg-cor',
      title: '상관계수 r과 R²: cor.test()',
      src: 'wk7 45–46행',
      key: '예측변수가 하나인 회귀에서는 **R² = r²**. cor.test의 t(−40.152)·df(2282)도 기울기 검정과 똑같다.',
      body: [
        { code: `cor.test(english_young$WrittenFrequency, english_young$RTlexdec)` },
        '- **r = −0.643**: 음의 상관(빈도↑ RT↓), 꽤 강한 편 (−1 ~ 1)\n- **95% 신뢰구간** −0.667 ~ −0.619: 0을 포함하지 않음 → 유의\n- **t = −40.152, df = 2282**: summary의 기울기 행과 같은 숫자! 둘 다 "빈도와 RT가 무관한가"를 검정해요.',
        '스크립트 46행은 r을 제곱해서 R²와 비교하려는 줄인데, 함정이 하나 있어요:',
        { compare: [
          { label: '스크립트 그대로: `-0.6434^2`', code: `-0.6434^2` },
          { label: '괄호를 친 `(-0.6434)^2`', code: `(-0.6434)^2` },
        ] },
        '`^`(거듭제곱)이 `-`(부호)보다 **먼저** 계산돼서 `-0.6434^2`는 `-(0.6434^2)` = −0.414가 돼요. 제곱은 음수가 될 수 없으니, 제대로 하려면 괄호를 쳐야 해요. 숫자 크기 0.414는 R²(0.4139963)와 같아요.',
        { note: 'Python과 비교', kind: 'py', t: '파이썬도 똑같아요: `-0.6434**2` → `-0.41396...`. `**`가 단항 `-`보다 우선.' },
      ],
      quiz: [
        { type: 'predict', q: '결과는?', setup: [], code: `-0.5^2`, opts: [
          { t: '-0.25', ok: true, why: '`-(0.5^2)`로 계산돼요.' },
          { t: '0.25', why: '그러려면 `(-0.5)^2`.' },
          { t: '에러', why: '문법은 맞아요.' },
        ] },
        { type: 'mcq', q: 'r = −0.6434일 때 (예측변수 하나인) 회귀의 R²는?', opts: [
          { t: '0.414', ok: true, why: '(−0.6434)² = 0.414. 제곱이라 부호가 사라져요.' },
          { t: '−0.414', why: 'R²는 0 이상이에요.' },
          { t: '−0.6434', why: 'r 그 자체는 R²가 아니에요.' },
        ] },
        { type: 'tf', q: 'R²만 보면 빈도와 RT의 관계가 양(+)인지 음(−)인지 알 수 있다.', ans: false, why: 'R²는 제곱이라 방향 정보가 없어요. 방향은 기울기(또는 r)의 부호로 봐요.' },
      ],
    },
    {
      id: 'reg-log',
      title: '로그 단위 되돌리기: exp() (그리고 50행의 정체)',
      src: 'wk7 50–52행',
      key: 'RTlexdec와 WrittenFrequency는 **자연로그** 값. 원래 단위로 돌리려면 `exp()`. 50행 `ln(...) = ...`은 R 코드가 아니라 **회귀식 메모**라서 실행하면 에러.',
      body: [
        { code: `ln(RTlexdec) = 6.62555588 - 0.03710692*ln(WrittenFrequency)`, expect: 'error', cap: '스크립트 50행을 그대로 실행하면' },
        'R에는 `ln()`이 없어요(자연로그는 `log()`). 이 줄은 **"log RT = 6.6256 − 0.0371 × log(빈도)"라는 식을 적어 둔 메모**예요. Ctrl+Enter로 한 줄씩 실행할 땐 에러만 나고 넘어가지만, 스크립트 전체를 Source로 실행하면 여기서 멈춰요 → 앞에 `#`을 붙여 두세요.',
        { code: `exp(6.6255559) ## raw.RT of the intercept`, cap: '51행: 절편을 원래 단위(ms)로' },
        '→ 빈도가 1번(로그 0)인 단어의 예상 반응시간 ≈ **754 ms**.',
        { code: `exp(1)`, cap: '52행: e ≈ 2.718' },
        '로그 빈도가 **1 늘어난다** = 원래 빈도가 **e배(약 2.7배)** 된다는 뜻이에요. 그래서 기울기 −0.0371은 "빈도가 2.7배 될 때마다 log RT가 0.0371 줄어든다".',
        '로그와 exp()의 관계는 wk7 슬라이드 그대로예요: `exp(log(10))` → 10, `2^(log2(10))` → 10. **로그를 씌운 값은 exp로 되돌린다.** [[reg-transform|변환 레슨]]에서 더 봐요.',
        { note: '참고: 기울기를 % 로 (스크립트 밖 한 줄)', kind: 'tip', t: '`exp(-0.0371)` = 0.964. 반응변수도 로그라서, 빈도가 2.7배 되면 RT가 약 0.964배 = **약 3.6% 짧아진다**고 말할 수 있어요.' },
      ],
      quiz: [
        { type: 'mcq', q: '`exp(6.6255559)` = 754.1의 뜻은?', opts: [
          { t: 'WrittenFrequency가 0인(빈도 1) 단어의 예측 반응시간 754 ms', ok: true, why: '절편(로그 ms)을 ms로 되돌린 값.' },
          { t: 'young 참가자의 평균 반응시간', why: '절편은 x = 0일 때의 예측값이에요.' },
          { t: '빈도가 754인 단어', why: 'exp()한 것은 반응시간(y) 쪽이에요.' },
        ] },
        { type: 'predict', q: '결과는?', setup: [], code: `ln(10)`, expect: 'error', opts: [
          { t: 'Error in ln(10) : could not find function "ln"', ok: true, why: 'R의 자연로그는 `log(10)` = 2.302585.' },
          { t: '2.302585', why: '그건 `log(10)`의 결과예요.' },
          { t: '1', why: '상용로그는 `log10(10)`.' },
        ] },
        { type: 'mcq', q: 'WrittenFrequency가 1 커진다는 것은 원래 빈도가?', opts: [
          { t: '약 2.7배(e배)가 된다', ok: true, why: '자연로그 1 = ×e. 그래서 스크립트에 `exp(1)`이 있어요.' },
          { t: '1번 더 나온다', why: '로그 척도에서는 "더하기"가 원래 척도의 "곱하기"예요.' },
          { t: '10배가 된다', why: '그건 상용로그(log10)일 때.' },
        ] },
        { type: 'predict', q: '결과는?', setup: [], code: `exp(log(500))`, opts: [
          { t: '`[1] 500`', ok: true, why: 'log를 씌웠다가 exp로 되돌렸어요.' },
          { t: '`[1] 6.214608`', why: '그건 `log(500)`이에요.' },
        ] },
      ],
    },
    {
      id: 'reg-confint',
      title: 'confint(): 계수의 95% 신뢰구간',
      src: 'wk7 54행',
      key: 'confint()는 각 계수의 95% 신뢰구간. 대략 **Estimate ± 2 × Std. Error**. 구간에 **0이 없으면** p < .05와 같은 결론.',
      setup: ['english', 'lm1'],
      body: [
        { code: `confint(slr_mod_freq1)` },
        '- 기울기: **−0.0389 ~ −0.0353**. "진짜 빈도 효과는 아마 이 범위 안"이라고 읽어요.\n- 손으로: −0.0371 ± 1.96 × 0.000924 = −0.0389 ~ −0.0353 (1.96은 관측이 많을 때의 95% 기준값)\n- 구간 전체가 음수 → 0을 포함하지 않음 → 빈도 효과는 유의 (p < .05와 같은 결론)',
        { note: '두 열 이름', kind: 'tip', t: '`2.5 %`와 `97.5 %`: 가운데 95%를 남기고 양쪽 끝 2.5%씩 잘라낸 위치, 즉 구간의 **아래 끝**과 **위 끝**이에요.' },
      ],
      quiz: [
        { type: 'mcq', q: '어떤 계수의 95% 신뢰구간이 [−0.02, 0.05]라면?', opts: [
          { t: '0을 포함하므로 p > .05 (유의하지 않음)', ok: true, why: '"진짜 값이 0일 수도 있다"는 뜻.' },
          { t: '양수 쪽이 더 넓으므로 유의한 양의 효과', why: '0이 구간 안에 있으면 방향을 확신할 수 없어요.' },
          { t: '구간 폭이 좁으므로 유의', why: '폭이 아니라 0 포함 여부를 봐요.' },
        ] },
        { type: 'mcq', q: 'Estimate = −0.0371, Std. Error = 0.0009일 때 95% 신뢰구간에 가장 가까운 것은?', opts: [
          { t: '−0.0389 ~ −0.0353', ok: true, why: '−0.0371 ± 2 × 0.0009.' },
          { t: '−0.0380 ~ −0.0362', why: '± 1 × SE만 했어요. 95%는 약 ± 2 × SE.' },
          { t: '−0.0742 ~ 0', why: 'Estimate의 2배가 아니라 SE의 2배를 더하고 빼요.' },
        ] },
      ],
    },
    {
      id: 'reg-save',
      title: '결과 저장: tidy() · write_csv(), summ() · sink()',
      src: 'wk7 57–66행',
      key: '`tidy()`(broom)는 계수 표를 **tibble**로 바꿔 준다 → `write_csv()`로 저장. `summ()`(jtools)은 보기 좋은 표, `sink()`는 콘솔 출력을 파일로 보낸다.',
      setup: ['english', 'lm1', 'broom'],
      body: [
        { code: `tidy(slr_mod_freq1, conf.int = FALSE, digits = 4)` },
        { table: { head: ['tidy() 열', 'summary()에서', '설명'], rows: [
          ['`term`', '행 이름', '`(Intercept)`, `WrittenFrequency`'],
          ['`estimate`', 'Estimate', '추정값'],
          ['`std.error`', 'Std. Error', '표준오차'],
          ['`statistic`', 't value', 't 값'],
          ['`p.value`', 'Pr(>|t|)', 'p값 — `<2e-16` 대신 실제 계산값 `3.88e-267`. 너무 작으면 `0`으로 보여요'],
        ] } },
        '- tibble이라서 `filter()`, `mutate()` 같은 dplyr 함수를 그대로 쓸 수 있어요.\n- `conf.int = TRUE`로 바꾸면 `conf.low`, `conf.high`(= confint) 열이 추가돼요.\n- `digits = 4`는 tidy()가 쓰지 않는 인자라 넣어도 자릿수가 바뀌지 않아요(위 출력도 그대로).',
        { code: `write_csv(slr_mod_1_summary, "slr_mod_1_summary1.csv")`, run: false, cap: '59행: 프로젝트 폴더(작업 폴더)에 CSV 파일이 생겨요. 엑셀로 열 수 있어요.' },
        { code: `summ(slr_mod_freq1, model.info = FALSE, digits = 4)`, setup: ['english', 'lm1', 'jtools'], cap: '63행: jtools의 summ(). 모델 성적(MODEL FIT)과 계수 표를 정리해서 보여 줘요.' },
        '`p = 0.0000`은 "0.00005보다 작아서 넷째 자리까지 반올림하면 0"이라는 뜻이지, p가 정확히 0이라는 뜻이 아니에요.',
        { code: `sink("slr_mod_1_summary2.txt")
print(a)
sink()`, run: false, cap: '64–66행: `sink("파일")` 이후의 출력은 콘솔 대신 파일로 가요. `sink()`로 다시 콘솔로 되돌려요.' },
        '`a = summ(...)`의 `=`는 `<-`와 같은 할당이에요 (B단원). 모델 전체 성적(R², F 등)을 tibble 한 줄로 보고 싶으면 broom의 `glance()` → [[neut-slr|wk8 레슨]].',
        { note: 'sink() 닫기를 잊으면', kind: 'warn', t: '그 뒤로 무엇을 실행해도 콘솔에 아무것도 안 나와서 R이 고장 난 것처럼 보여요. 빈 `sink()`를 한 번 실행하면 돌아와요.' },
      ],
      quiz: [
        { type: 'mcq', q: '`tidy()` 결과의 `statistic` 열은 summary()의 어느 열?', opts: [
          { t: 't value', ok: true, why: 'lm에서는 t 통계량.' },
          { t: 'Estimate', why: '그건 `estimate` 열.' },
          { t: 'Pr(>|t|)', why: '그건 `p.value` 열.' },
        ] },
        { type: 'mcq', q: '`sink("a.txt")`만 하고 `sink()`를 안 하면?', opts: [
          { t: '이후 출력이 계속 파일로 가서 콘솔에 안 보인다', ok: true, why: '빈 `sink()`로 닫아야 해요.' },
          { t: '파일이 비어 있다', why: '출력은 파일에 쌓여요.' },
          { t: '에러가 난다', why: '조용히 파일로 보내요.' },
        ] },
        { type: 'tf', q: 'summ() 출력의 `p = 0.0000`은 p가 정확히 0이라는 뜻이다.', ans: false, why: '반올림 결과예요. 보고할 땐 p < .001.' },
      ],
    },
    {
      id: 'reg-center',
      title: '중심화: WrittenFrequency − 3 하면 무엇이 바뀌나',
      src: 'wk7 69–86행',
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
        '- **새 절편 확인**: 원래 직선에서 x = 3일 때 = 6.6256 − 3 × 0.0371 = **6.5142** ✓. "WrittenFrequency2 = 0"은 "원래 WrittenFrequency = 3"이니까요.\n- **절편 SE가 작아진 이유**: 데이터의 중심(빈도 평균 ≈ 5)에 가까운 곳일수록 예측이 정밀해요. x = 0은 데이터 끝자락이라 덜 확실했어요.\n- 직선 자체는 그대로이고, 그 직선을 **어디에서 읽느냐(절편의 위치)**만 바뀐 거예요.',
        { compare: [
          { label: '`WrittenFrequency` (75행 이전)', code: `ggplot(english_young2, aes(WrittenFrequency, RTlexdec)) +
  geom_point(size = 3, alpha=0.2, color = "darkgrey") +
  geom_smooth(method = "lm", color = 'black', fill = "darkgrey")` },
          { label: '`WrittenFrequency2` (75행)', code: `ggplot(english_young2, aes(WrittenFrequency2, RTlexdec)) +
  geom_point(size = 3, alpha=0.2, color = "darkgrey") +
  geom_smooth(method = "lm", color = 'black', fill = "darkgrey")` },
        ] },
        { note: 'wk7 슬라이드: 평균 중심화', kind: 'tip', t: '실제 연구에서는 3 같은 임의의 수 대신 **평균**을 빼는 경우(centering)가 많아요. 그러면 절편 = "평균 빈도인 단어의 예측값"이 돼요 → [[reg-transform|변환 레슨]].' },
      ],
      quiz: [
        { type: 'mcq', q: 'x에서 3을 빼고 다시 회귀하면 **바뀌는 것**은?', opts: [
          { t: '절편(과 그 SE·t)만', ok: true, why: '기울기, 잔차, R², F는 모두 그대로.' },
          { t: '기울기만', why: '모든 점이 똑같이 옆으로 옮겨질 뿐이라 기울기는 같아요.' },
          { t: 'R²', why: '설명력은 그대로예요.' },
        ] },
        { type: 'fill', q: '`WrittenFrequency2 = 0`인 단어는 원래 빈도로 얼마?', code: 'WrittenFrequency = ▢', ans: [['3']], why: 'WrittenFrequency2 = WrittenFrequency − 3.' },
        { type: 'mcq', q: '`WrittenFrequency - 5`로 바꿔서 회귀하면 절편은 대략?', opts: [
          { t: '6.440 (원래 직선에서 x = 5일 때의 예측값)', ok: true, why: '6.6256 − 5 × 0.0371 = 6.440.' },
          { t: '6.6256 (그대로)', why: '절편은 0의 위치가 옮겨지면 바뀌어요.' },
          { t: '−0.0371', why: '그건 기울기예요.' },
        ] },
      ],
    },
    {
      id: 'reg-transform',
      title: '변환과 다듬기: 중심화 · z점수 · 로그 (wk7 슬라이드)',
      src: 'wk7_transformation_trimming_Tamminga.pdf',
      key: '변환 = 열에 함수를 씌우기. **중심화**(x − 평균)와 **z점수**(평균을 빼고 SD로 나누기)는 직선의 모양은 그대로 두고 **읽는 기준**만 바꾼다. **로그**는 한쪽으로 쏠린 분포를 펴 주고, `exp()`로 되돌린다.',
      setup: ['english'],
      body: [
        { table: { head: ['변환', 'R 코드', '결과 읽기'], rows: [
          ['중심화 (centering)', '`x - mean(x)`', '0 = 평균. +는 평균보다 큼, −는 작음'],
          ['z점수 (z-scoring)', '`(x - mean(x)) / sd(x)` 또는 `scale(x)`', '평균에서 **표준편차 몇 개**만큼 떨어졌나 (HW1 3번)'],
          ['로그', '`log(x)`(자연로그, R 기본), `log2(x)`, `log10(x)`', '+1 = ×e / ×2 / ×10. **0 이하 값에는 못 씀**'],
          ['되돌리기', '`exp(x)`, `2^x`, `10^x`', '슬라이드: "To transform back… exponentiate!"'],
        ] } },
        { code: `english_young_c <- english_young %>%
  mutate(WF_c = WrittenFrequency - mean(WrittenFrequency))
coefficients(lm(RTlexdec ~ WF_c, data = english_young_c))
mean(english_young$RTlexdec)`, cap: '평균으로 중심화하면 절편 = 평균 빈도인 단어의 예측값 = 반응시간의 **평균**과 같아져요.' },
        'wk7 스크립트의 `WrittenFrequency - 3`([[reg-center|중심화 레슨]])과 같은 원리예요. 빼는 수가 평균이면 절편이 "평균적인 단어"의 값이 되어 읽기 쉬워요. 기울기 −0.0371은 그대로예요.',
        { code: `log(c(1, 10, 100))
log10(c(1, 10, 100))
log(0)
log(0 + 1)`, setup: [], cap: '0의 로그는 `-Inf`(음의 무한대), 음수의 로그는 `NaN`. 0이 섞인 데이터는 `log(x + 1)`로 피해요.' },
        '**다듬기(trimming)**: 연구하려는 과정과 상관없이 생긴 극단값(예: 휴대폰을 보다가 3초 걸린 반응)을 빼는 것. 기준의 예:\n- 절대 기준 (예: 3,000 ms 넘으면 제외)\n- **표준편차 기준** (자기 평균에서 2.5 SD보다 먼 반응 제외 = HW1 4번)\n- 로그 같은 변환으로 긴 꼬리를 줄이기',
        { note: '순서', kind: 'tip', t: '슬라이드의 결론: **먼저 변환하고**, 그다음 다듬기가 아직 필요한지 판단해요. 로그를 씌우면 긴 꼬리가 줄어서 극단값처럼 보이던 값이 평범해지기도 하거든요.' },
      ],
      quiz: [
        { type: 'mcq', q: 'x를 **평균으로** 중심화하고 `lm(y ~ x_c)`를 하면 Intercept는?', opts: [
          { t: 'y의 평균 (평균적인 x에서의 예측값)', ok: true, why: '이 데이터에서 6.4392 = young의 평균 RTlexdec.' },
          { t: '0', why: '0이 되는 건 x_c의 평균이에요. 절편은 y 쪽 값이에요.' },
          { t: '원래 모델의 절편과 같다', why: '0의 위치가 옮겨져서 바뀌어요.' },
        ] },
        { type: 'predict', q: '결과는?', setup: [], code: `log(0)`, opts: [
          { t: '`[1] -Inf`', ok: true, why: '0의 로그는 음의 무한대. 그래서 0이 있으면 `log(x + 1)`.' },
          { t: '`[1] 0`', why: '0이 되는 건 `log(1)`이에요.' },
          { t: '에러', why: '에러 대신 -Inf를 돌려줘요.' },
        ] },
        { type: 'mcq', q: 'HW1 4번 "자기 평균에서 2.5 SD보다 먼 반응 제외"는 슬라이드의 어느 방법?', opts: [
          { t: '표준편차 기준 다듬기 (z점수의 절댓값 > 2.5인 행 빼기)', ok: true, why: '참가자별 z점수를 먼저 만들어야 하는 이유예요.' },
          { t: '로그 변환', why: '값을 빼지 않고 바꾸는 방법이에요.' },
          { t: '절대 기준', why: '모든 참가자에게 같은 ms 기준을 쓰는 방법이에요.' },
        ] },
        { type: 'fill', q: '로그를 원래 값으로 되돌리기', code: '▢(log(500))', ans: [['exp']], why: '`exp(log(500))` = 500.', full: `exp(log(500))` },
      ],
    },
  ],
});

RS.goals.push(
  { lesson: 'reg-plot', src: 'wk7 Practice', title: '빈도–반응시간 산점도 + 회귀 직선' },
);

})();
