/* 단원 mlr: wk7 뒷부분 — 범주형 예측변수, 다중 회귀, 상호작용 (표 해석) */
(function () {

RS.setups.age = `slr_mod_age <- lm(RTlexdec ~ AgeSubject, data = english)`;
RS.setups.mlr1 = `mlr_mod_1 <- lm(RTlexdec ~ WrittenFrequency + AgeSubject, data = english)`;
RS.setups.mlr3 = `mlr_mod_3 <- lm(RTlexdec ~ WrittenFrequency*AgeSubject, data = english)`;
RS.setups.sjplot = `library(sjPlot)`;

const SUM_AGE = `Call:
lm(formula = RTlexdec ~ AgeSubject, data = english)

Residuals:
     Min       1Q   Median       3Q      Max
-0.25776 -0.08339 -0.01669  0.06921  0.52685

Coefficients:
                 Estimate Std. Error t value Pr(>|t|)
(Intercept)      6.660958   0.002324 2866.44   <2e-16 ***
AgeSubjectyoung -0.221721   0.003286  -67.47   <2e-16 ***
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

Residual standard error: 0.1111 on 4566 degrees of freedom
Multiple R-squared:  0.4992,\tAdjusted R-squared:  0.4991
F-statistic:  4552 on 1 and 4566 DF,  p-value: < 2.2e-16`;

const SUM_MLR1 = `Call:
lm(formula = RTlexdec ~ WrittenFrequency + AgeSubject, data = english)

Residuals:
     Min       1Q   Median       3Q      Max
-0.34622 -0.06029 -0.00722  0.05178  0.44999

Coefficients:
                   Estimate Std. Error t value Pr(>|t|)
(Intercept)       6.8467921  0.0039792 1720.64   <2e-16 ***
WrittenFrequency -0.0370103  0.0007033  -52.62   <2e-16 ***
AgeSubjectyoung  -0.2217215  0.0025930  -85.51   <2e-16 ***
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

Residual standard error: 0.08763 on 4565 degrees of freedom
Multiple R-squared:  0.6883,\tAdjusted R-squared:  0.6882
F-statistic:  5040 on 2 and 4565 DF,  p-value: < 2.2e-16`;

const SUM_MLR3 = `Call:
lm(formula = RTlexdec ~ WrittenFrequency * AgeSubject, data = english)

Residuals:
     Min       1Q   Median       3Q      Max
-0.34664 -0.06021 -0.00713  0.05190  0.45019

Coefficients:
                                   Estimate Std. Error  t value Pr(>|t|)
(Intercept)                       6.8463068  0.0053210 1286.669   <2e-16 ***
WrittenFrequency                 -0.0369136  0.0009948  -37.107   <2e-16 ***
AgeSubjectyoung                  -0.2207510  0.0075250  -29.336   <2e-16 ***
WrittenFrequency:AgeSubjectyoung -0.0001933  0.0014068   -0.137    0.891
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

Residual standard error: 0.08764 on 4564 degrees of freedom
Multiple R-squared:  0.6883,\tAdjusted R-squared:  0.6881
F-statistic:  3359 on 3 and 4564 DF,  p-value: < 2.2e-16`;

RS.units.push({
  id: 'mlr',
  title: '범주형 예측변수 · 다중 회귀 · 상호작용',
  short: 'old/young와 기준 수준, y ~ x1 + x2(평행한 두 직선), 상호작용 x1*x2(기울기의 차이), 예측 그림',
  desc: '`wk7_linear reg intro_rmld_freq.R` 104–153행. 이번엔 old·young **둘 다** 있는 `english` 전체(4,568행)로 나이 집단의 효과, 빈도와 나이를 함께 넣은 모델, "빈도 효과가 나이에 따라 다른가"(상호작용)를 표로 읽어요. 그림 연습 두 개는 실습의 [[mlr-practice-age|wk7 연습]]에 있어요.',
  setup: 'english',
  lessons: [
    {
      id: 'mlr-factor',
      title: '범주형 예측변수: Intercept = 기준 수준의 평균',
      src: 'wk7 107–113행',
      key: '예측변수가 범주(old/young)면 R은 **기준 수준(reference level)** 하나를 정한다(알파벳 순 첫 번째 = old). **Intercept = old의 평균**, `AgeSubjectyoung` = **young − old 차이**.',
      setup: ['english', 'age'],
      body: [
        { code: `slr_mod_age <- lm(RTlexdec ~ AgeSubject, data = english)
summary(slr_mod_age)`, run: false },
        { anno: SUM_AGE, marks: [
          { s: '(Intercept)', t: '**기준 수준 old의 평균** log RT = 6.661. 범주형만 있으면 "x = 0"이 곧 "기준 수준"이에요.' },
          { s: 'AgeSubjectyoung', t: '이름 = **변수 이름 + 수준 이름**. "young이면 1, old면 0"인 표시를 R이 만들어서 그 기울기를 구한 거예요. 이름에 붙은 쪽(young)이 기준이 **아닌** 쪽이에요.' },
          { s: '-0.221721', t: '**young − old = −0.222**. young이 old보다 log RT가 0.222 짧다(빠르다). young 평균 = 6.661 − 0.222 = 6.439.' },
          { s: '-67.47', t: '두 집단 차이의 t. p < 2e-16 → 나이 차이는 유의.' },
          { s: 'Multiple R-squared:  0.4992', t: '나이 집단 하나로 반응시간 변동의 **약 50%**를 설명. 나이 차이가 아주 크다는 뜻.' },
        ] },
        { table: { head: ['AgeSubject', '`AgeSubjectyoung` 표시', '예측값'], rows: [
          ['old (기준)', '0', '6.660958 + 0 = **6.661**'],
          ['young', '1', '6.660958 − 0.221721 = **6.439**'],
        ] } },
        { note: 't.test()와 같은 검정 (스크립트 113행)', kind: 'tip', t: '`t.test(RTlexdec ~ AgeSubject, data = english, var.equal = TRUE)`의 결과는 t = 67.468, df = 4566, 평균 old 6.660958 · young 6.439237. **lm의 표와 숫자가 같고 t의 부호만 반대**예요(t.test는 old − young 방향으로 빼요). `var.equal = TRUE`는 두 집단의 퍼짐이 같다고 보는 옵션으로, lm도 같은 가정을 해요.' },
      ],
      quiz: [
        { type: 'mcq', q: '이 모델의 Intercept `6.660958`은?', opts: [
          { t: 'old 집단의 평균 log RT', ok: true, why: '기준 수준(old)의 평균.' },
          { t: '전체 4,568행의 평균 log RT', why: '전체 평균은 6.550이에요.' },
          { t: 'young 집단의 평균', why: 'young은 Intercept + AgeSubjectyoung이에요.' },
        ] },
        { type: 'fill', q: 'young 평균 log RT를 표에서 계산하세요.', code: 'young 평균 = 6.660958 + (▢)', ans: [['-0.221721', '-0.2217', '-0.222', '-0.22172']], why: '= 6.439237. t.test 결과의 "mean in group young"과 같아요.' },
        { type: 'mcq', q: '계수 이름이 `AgeSubjectold`가 아니라 `AgeSubjectyoung`인 이유는?', opts: [
          { t: 'old가 기준 수준이라 Intercept 안에 들어가 있고, 기준이 아닌 young에 표시가 붙었다', ok: true, why: '이름에 붙은 수준 = 기준이 아닌 쪽.' },
          { t: 'young이 데이터에 먼저 나와서', why: '데이터 순서가 아니라 factor 수준 순서(알파벳)예요.' },
          { t: 'young의 효과가 더 커서', why: '크기와 무관해요.' },
        ] },
      ],
    },
    {
      id: 'mlr-mlr',
      title: '다중 회귀: 다른 변수를 고정했을 때의 효과',
      src: 'wk7 132–135행',
      key: '`y ~ x1 + x2`에서 각 계수는 **다른 예측변수를 고정했을 때**의 효과. 이 모델은 old·young에 **기울기가 같은(평행한) 직선 두 개**를 긋는다.',
      setup: ['english', 'mlr1'],
      body: [
        { code: `mlr_mod_1 <- lm(RTlexdec ~ WrittenFrequency + AgeSubject, data = english)
summary(mlr_mod_1)`, run: false },
        { anno: SUM_MLR1, marks: [
          { s: '(Intercept)', t: '**숫자 예측변수 = 0, 범주 = 기준일 때**: old 집단 + 빈도 0인 단어의 예측 log RT = 6.847.' },
          { s: '-0.0370103', label: 'WrittenFrequency  −0.0370103', t: '**나이 집단을 고정했을 때**(같은 집단 안에서) 빈도 1 증가 → log RT 0.037 감소. 두 집단 **공통** 기울기.' },
          { s: '-0.2217215', label: 'AgeSubjectyoung  −0.2217215', t: '**빈도가 같은 단어끼리 비교하면** young이 old보다 0.222 빠르다. 어느 빈도에서든 같은 차이(평행선 간격).' },
          { s: '4565 degrees of freedom', t: '4,568행 − 계수 3개.' },
          { s: 'Multiple R-squared:  0.6883', t: '나이만(0.499)이나 빈도만 넣었을 때보다 커져서 **68.8%**. 두 변수가 각자 다른 부분을 설명해요.' },
        ] },
        { table: { head: ['집단', '직선의 식 (예측 RTlexdec)'], rows: [
          ['old (기준)', '6.8468 − 0.0370 × WrittenFrequency'],
          ['young', '(6.8468 − 0.2217) − 0.0370 × WrittenFrequency = 6.6251 − 0.0370 × WrittenFrequency'],
        ] } },
        '기울기가 똑같으니 두 직선은 **평행**하고, 간격은 어디서나 0.2217이에요. 스크립트 135행 `confint(mlr_mod_1)`으로 보면 세 계수 모두 신뢰구간에 0이 없어요.',
      ],
      quiz: [
        { type: 'mcq', q: '`WrittenFrequency` −0.0370의 올바른 해석은?', opts: [
          { t: '나이 집단이 같을 때, 빈도 1 증가 → log RT 0.037 감소', ok: true, why: '다중 회귀의 계수는 "다른 변수를 고정했을 때".' },
          { t: 'old 집단에서만 빈도 효과가 −0.037', why: '상호작용이 없는 모델이라 두 집단 공통이에요.' },
          { t: '빈도가 반응시간 변동의 3.7%를 설명', why: '설명 비율은 R²예요.' },
        ] },
        { type: 'mcq', q: 'Intercept 6.8468은 누구의 예측값인가요?', opts: [
          { t: 'old 집단, WrittenFrequency = 0인 단어', ok: true, why: '숫자 예측변수 = 0, 범주형 = 기준 수준.' },
          { t: 'young 집단, 평균 빈도 단어', why: 'young은 기준이 아니고, 빈도도 0이에요.' },
          { t: '전체 평균', why: '절편은 평균이 아니에요.' },
        ] },
        { type: 'fill', q: 'young 집단, WrittenFrequency = 0인 단어의 예측값', code: '6.8467921 + (▢)', ans: [['-0.2217215', '-0.2217', '-0.222', '-0.22172']], why: '= 6.6251. young 직선의 절편.' },
      ],
    },
    {
      id: 'mlr-interaction',
      title: '상호작용: 기울기가 집단마다 다른가 (x1:x2, x1*x2)',
      src: 'wk7 139–153행',
      key: '**상호작용 항 `x1:x2` = x1의 기울기가 x2 수준에 따라 얼마나 달라지는가.** `x1 * x2`는 `x1 + x2 + x1:x2`의 줄임말. 이 모델은 집단마다 **직선을 따로** 긋는다.',
      setup: ['english', 'mlr3', 'sjplot'],
      body: [
        { code: `mlr_mod_2 <- lm(RTlexdec ~ WrittenFrequency + AgeSubject +
                WrittenFrequency:AgeSubject, data = english)
mlr_mod_3 <- lm(RTlexdec ~ WrittenFrequency*AgeSubject, data = english)`, run: false, cap: '139–143행: 쓰는 법만 다르고 결과가 완전히 같아요.' },
        { anno: SUM_MLR3, cap: '`summary(mlr_mod_3)` (mlr_mod_2와 같음)', marks: [
          { s: '(Intercept)', t: 'old 집단, 빈도 0의 예측값 6.8463. **old 직선의 절편.**' },
          { s: '-0.0369136', label: 'WrittenFrequency  −0.0369136', t: '⚠ **old 집단(기준 수준)의 기울기**. "빈도 효과 전체"가 아니에요. 상호작용이 있으면 이 행은 "상대 변수가 기준일 때"의 효과예요.' },
          { s: '-0.2207510', label: 'AgeSubjectyoung  −0.2207510', t: '⚠ **빈도 = 0인 지점에서의** young − old 차이.' },
          { s: 'WrittenFrequency:AgeSubjectyoung', t: '**상호작용**: young 기울기 − old 기울기 = −0.0002. 거의 0이에요.' },
          { s: '0.891', t: 'p = .891 → 기울기 차이는 **유의하지 않다**. 빈도 효과가 두 나이 집단에서 다르다고 할 근거가 없다.' },
          { s: 'Adjusted R-squared:  0.6881', t: 'R²는 mlr_mod_1과 같은 0.6883인데 수정 R²는 0.6882 → **0.6881로 내려감**. 쓸모없는 항을 넣은 벌점이에요.' },
        ] },
        { table: { head: ['집단', '절편', '기울기'], rows: [
          ['old (기준)', '6.8463068', '−0.0369136'],
          ['young', '6.8463068 + (−0.2207510) = **6.6255558**', '−0.0369136 + (−0.0001933) = **−0.0371069**'],
        ] } },
        'young의 절편과 기울기가 [[reg-lm|young만으로 만든 slr_mod_freq1]]의 6.6255559, −0.0371069와 **똑같아요**. 상호작용 모델 = 집단마다 직선을 따로 그린 것이에요.',
        { code: `plot_model(mlr_mod_3, type="pred", terms=c("WrittenFrequency","AgeSubject"))`, cap: '152행: 모델이 예측한 두 직선. 거의 평행해요 = 상호작용이 거의 0.' },
        { note: 'plot_model(type = "pred") 읽는 법 (스크립트 150–153행)', kind: 'tip', t: '모델이 **예측한 값**과 95% 신뢰구간을 그려요(원자료 산점도가 아니에요).\n- terms의 **첫 번째 = x축**, 두 번째 = 색(집단).\n- terms에 **없는** 변수는 고정돼요: 범주형 → **기준 수준**(그래서 150행 `terms = "WrittenFrequency"`의 선 하나는 old), 숫자 → 평균(151행 `terms = "AgeSubject"`의 두 점은 빈도 5.02에서의 예측).\n- 숫자 변수가 두 번째(색)로 가면 평균 − 1SD, 평균, 평균 + 1SD 세 값으로 나눠 그려요(153행: 3.18, 5.02, 6.86).' },
        { note: '자주 하는 실수', kind: 'warn', t: '상호작용이 있는 모델에서 `WrittenFrequency` 행의 p < 2e-16을 보고 "빈도 효과는 모든 집단에서 유의하다"고 쓰면 틀려요. 이 행은 **old의 기울기**에 대한 검정이에요. wk8에서 기준을 바꿔 가며 확인해요 → [[neut-relevel2|기준을 둘 다 바꾸면]].' },
      ],
      quiz: [
        { type: 'mcq', q: '상호작용 항 −0.0001933 (p = .891)의 해석은?', opts: [
          { t: '빈도 효과(기울기)가 old와 young에서 다르다는 증거가 없다', ok: true, why: '기울기 차이가 거의 0이고 유의하지 않아요.' },
          { t: '빈도 효과가 없다', why: '빈도 효과(기울기 −0.037)는 뚜렷해요. 차이가 없을 뿐.' },
          { t: '나이 효과가 없다', why: '나이 차이는 다른 행이에요.' },
        ] },
        { type: 'fill', q: 'young의 기울기를 표에서 계산하세요.', code: 'young 기울기 = −0.0369136 + (▢)', ans: [['-0.0001933', '-0.000193', '−0.0001933']], why: '= −0.0371069. young만으로 한 회귀와 같아요.' },
        { type: 'mcq', q: '`y ~ A*B`와 같은 모델은?', opts: [
          { t: '`y ~ A + B + A:B`', ok: true, why: '`*` = 각각 + 상호작용.' },
          { t: '`y ~ A:B`', why: '상호작용 항만 넣으면 다른 모델이에요.' },
          { t: '`y ~ A + B`', why: '상호작용이 빠졌어요.' },
        ] },
        { type: 'mcq', q: '이 모델에서 `AgeSubjectyoung` −0.2208은?', opts: [
          { t: '빈도 = 0인 지점에서의 young − old 차이', ok: true, why: '상호작용이 있으면 "상대 변수 = 0(기준)일 때"의 차이.' },
          { t: '모든 빈도에서 young − old 차이', why: '그건 상호작용이 없는 mlr_mod_1의 해석이에요.' },
          { t: 'young의 기울기', why: '기울기는 WrittenFrequency + 상호작용.' },
        ] },
      ],
    },
  ],
});

})();
