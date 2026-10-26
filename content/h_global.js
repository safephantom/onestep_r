/* 단원 H: 전역 매핑 vs 지역 매핑 */
RS.units.push({
  id: 'h',
  title: '전역 매핑 vs 지역 매핑',
  short: 'ggplot() 안의 aes는 모든 층에 적용, 층 안의 aes는 그 층에만 매핑을 더하거나 바꿈, 층마다 다른 데이터',
  desc: 'wk2_ggplot_intro.R 97–117행. 수업 주석 "a local mapping extends (or overwrites) global mappings"는 "층 안에 쓴 매핑은 ggplot() 안의 매핑에 더해지고, 같은 aes를 다시 쓰면 그 층에서는 층 안의 것이 쓰인다"는 뜻이에요.',
  lessons: [
    {
      id: 'h-global',
      title: '반복을 줄이는 전역 매핑',
      src: 'wk2_ggplot_intro.R 99–107행 "this is too cumbersome"',
      key: '`ggplot()` 안에 쓴 aes(**전역 매핑**)는 그 뒤에 더하는 **모든 층에 적용된다**. 그래서 층마다 같은 aes를 다시 쓸 필요가 없다.',
      body: [
        { compare: [
          { label: '층마다 반복 (번거로움)', code: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy)) +
  geom_smooth(mapping = aes(x = displ, y = hwy))` },
          { label: 'ggplot() 안에 한 번', code: `ggplot(data = mpg, mapping = aes(x = displ, y = hwy)) +
  geom_point() +
  geom_smooth()` },
        ] },
        '두 코드는 같은 그림을 그려요. ggplot() 안에 한 번만 쓰면, x를 cty로 바꿀 때 그 한 곳만 고치면 돼요. 층마다 쓴 경우에는 한 층만 고치고 다른 층을 빠뜨리기 쉬운데, 그러면 점은 cty를, 선은 displ을 x로 쓰는 엉뚱한 그림이 나와요.',
      ],
      quiz: [
        { type: 'mcq', q: '`ggplot(mpg, aes(x = displ, y = hwy)) + geom_point() + geom_smooth()`에서 geom_smooth의 x, y는?', opts: [
          { t: 'displ, hwy (ggplot() 안의 aes가 적용됨)', ok: true, why: 'geom_smooth() 안에 aes가 없으니 ggplot() 안의 x = displ, y = hwy가 그대로 쓰여요.' },
          { t: '없음 → 에러', why: 'ggplot() 안의 x, y가 이 층에도 적용되니 에러가 나지 않아요.' },
          { t: '첫 번째 열과 두 번째 열', why: '열의 위치로 정해지지 않아요.' },
        ] },
        { type: 'write', q: 'ggplot() 안의 aes만 써서, 점과 추세선(띠 있음)을 x = cty, y = hwy로 그리세요. 층 안에는 aes를 쓰지 마세요.', target: `ggplot(mpg, aes(x = cty, y = hwy)) +
  geom_point() +
  geom_smooth()`, checks: [
          { r: 'gmaps("x", "cty") && gmaps("y", "hwy")', m: 'x, y는 **ggplot() 안의** aes()에 쓰세요.' },
          { r: 'has_geom("point") && has_geom("smooth")', m: '점과 smooth 두 층' },
          { r: 'length(lmap(idx("point")[1])) == 0 && length(lmap(idx("smooth")[1])) == 0', m: '층 안에는 aes가 없어야 해요.' },
        ], sol: `ggplot(data = mpg, mapping = aes(x = cty, y = hwy)) +
  geom_point() +
  geom_smooth()` },
      ],
    },
    {
      id: 'h-extend',
      title: '층 안의 aes는 그 층에만 매핑을 더한다',
      src: 'wk2_ggplot_intro.R 110–112행',
      key: '층 안에 쓴 aes(**지역 매핑**)는 ggplot() 안의 매핑에 더해져 **그 층에만** 적용된다. `geom_point(aes(color = class))`라고 쓰면 점만 class별로 색이 달라지고, smooth는 전체 데이터로 선을 하나만 그린다.',
      body: [
        { code: `ggplot(data = mpg, mapping = aes(x = displ, y = hwy)) +
  geom_point(mapping = aes(color = class)) +
  geom_smooth()` },
        '- 점 층: ggplot()의 x, y에 이 층의 color가 더해져서 매핑이 세 개(x, y, color)예요.\n- smooth 층: ggplot()의 x, y만 적용돼요. 데이터를 나눌 기준이 없으니 전체 데이터로 선을 **하나** 그려요.',
        { note: 'color를 어디에 쓰느냐에 따라 선의 개수가 달라진다', kind: 'map', t: '`color = class`를 **ggplot() 안**에 쓰면 smooth 층에도 적용되어, class별로 선 7개와 띠 7개를 그려요. 선을 하나만 그리려면 color를 점 층 안에만 쓰세요.' },
        { code: `ggplot(data = mpg, mapping = aes(x = displ, y = hwy, color = class)) +
  geom_point() +
  geom_smooth()`, cap: 'color를 ggplot() 안에 쓴 경우 → 선 7개' },
      ],
      quiz: [
        { type: 'pick', q: '`ggplot(mpg, aes(x = displ, y = hwy)) + geom_point(aes(color = drv)) + geom_smooth(se = FALSE)`의 결과는?', opts: [
          { code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point(aes(color = drv)) +
  geom_smooth(se = FALSE)`, ok: true, why: '색은 점에만 들어가고 선은 하나예요 (ExerciseKey 26–28행 그림).' },
          { code: `ggplot(mpg, aes(x = displ, y = hwy, color = drv)) +
  geom_point() +
  geom_smooth(se = FALSE)`, why: '이건 color를 ggplot() 안에 써서 선도 drv별로 3개예요.' },
          { code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  geom_smooth(aes(color = drv), se = FALSE)`, why: '이건 color를 선 층에만 써서 선에만 색이 있고 점은 검정이에요.' },
        ] },
        { type: 'mcq', q: '점은 class별 색으로, 추세선은 **전체 하나**로 그리려면 color = class를 어디에 써야 할까요?', opts: [
          { t: 'geom_point(aes(color = class))', ok: true, why: 'color가 점 층에만 더해져요. smooth 층에는 x, y만 적용돼요.' },
          { t: 'ggplot(mpg, aes(..., color = class))', why: 'ggplot() 안에 쓰면 smooth 층에도 적용되어 선이 7개로 나뉘어요.' },
          { t: 'geom_smooth(aes(color = class))', why: '그러면 선이 class별로 나뉘고 점은 검정이에요.' },
        ] },
      ],
    },
    {
      id: 'h-overwrite',
      title: '층에 같은 aes를 다시 쓰면 그 층에서는 층의 값을 쓴다',
      src: 'wk2_ggplot_intro.R 111행 주석 "extends (or overwrites)"',
      key: 'ggplot() 안에 쓴 aes를 층 안에서 **같은 이름**(예: color)으로 다시 쓰면, **그 층에서는** 층 안의 값이 쓰이고 ggplot() 안의 값은 쓰이지 않는다. 다른 층에는 여전히 ggplot() 안의 값이 적용된다.',
      body: [
        { code: `ggplot(mpg, aes(x = displ, y = hwy, color = drv)) +
  geom_point(aes(color = class)) +
  geom_smooth(se = FALSE)` },
        '- 점 층: color를 층 안에 다시 썼으므로 ggplot()의 `color = drv` 대신 `color = class`가 쓰여요 → class별 7색\n- smooth 층: color를 따로 쓰지 않았으므로 ggplot()의 `color = drv`가 그대로 적용돼요 → drv별 선 3개\n\ncolor 범례는 하나뿐이라서 drv의 값 3개(4, f, r)와 class의 값 7개가 한 범례에 섞여 나와 읽기 어려워요. 실제로 이렇게 쓸 일은 드물고, 규칙을 확인하기 위한 예예요.',
      ],
      quiz: [
        { type: 'mcq', q: 'ggplot() 안에 `aes(x = displ, y = hwy)`, 점 층에 `geom_point(aes(y = cty))`라고 쓰면 점의 y는?', opts: [
          { t: 'cty (층 안의 y가 쓰임)', ok: true, why: 'y를 점 층 안에 다시 썼으니 이 층에서는 cty를 써요.' },
          { t: 'hwy (ggplot() 안의 y가 쓰임)', why: '반대예요. 같은 aes를 층 안에 다시 쓰면 그 층에서는 층 안의 값을 써요.' },
          { t: '에러 (y가 두 번)', why: '층에서 같은 aes를 다시 쓰는 것은 허용돼요.' },
        ] },
        { type: 'tf', q: '층 안에 쓴 aes는 그 층에만 영향을 준다.', ans: true, why: '다른 층에는 여전히 ggplot() 안의 aes가 적용돼요.' },
      ],
    },
    {
      id: 'h-data',
      title: '층마다 다른 데이터: geom_smooth(data = filter(...))',
      src: 'wk2_ggplot_intro.R 115–117행',
      key: '층에 `data =`를 주면 그 층만 **다른 데이터**로 그린다. 매핑은 층 안에 따로 쓰지 않는 한 ggplot() 안의 aes가 그대로 적용된다.',
      body: [
        { code: `ggplot(data = mpg, mapping = aes(x = displ, y = hwy)) +
  geom_point(mapping = aes(color = class)) +
  geom_smooth(data = filter(mpg, class == "subcompact"), se = FALSE)` },
        '점은 mpg 전체(234행)로, 선은 `filter(mpg, class == "subcompact")`(subcompact 35행)로만 계산해요. `filter()`는 wk4에서 배우는 dplyr 함수로, 조건에 맞는 행만 남겨요 (O단원).',
        '**`data =` 이름을 꼭 붙여야 해요.** geom 함수의 첫 번째 인자는 mapping이라서 `geom_smooth(filter(mpg, ...))`라고 쓰면 "mapping must be created by aes()" 에러가 나요 (B단원).',
        { note: 'ExerciseKey의 주석 처리된 풀이', kind: 'src', t: 'ExerciseKey 14–20행(`\'\'\'` 안)은 drv별 선 3개를 그리려고 데이터를 drv 값마다 한 번씩 걸러 smooth 층을 세 개 더하는 방법이에요: `geom_smooth(data = filter(mpg, drv == "4"), …)` × 3. `aes(group = drv)` 한 줄이면 되는 일이라 주석으로 남겨 둔 것으로 보여요.' },
      ],
      quiz: [
        { type: 'mcq', q: '위 그림에서 추세선은 어떤 차들로 계산됐을까요?', opts: [
          { t: 'subcompact인 차들만', ok: true, why: '선 층에는 subcompact만 남긴 데이터를 줬어요.' },
          { t: '234대 전체', why: '점은 전체로 그리지만, 선은 층에 따로 준 데이터로 그려요.' },
          { t: 'subcompact를 뺀 나머지', why: '`class == "subcompact"`는 class가 subcompact인 행만 남겨요.' },
        ] },
        { type: 'predict', q: '`data =`를 빼먹으면?', code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  geom_smooth(filter(mpg, class == "subcompact"), se = FALSE)`, expect: 'error', opts: [
          { t: '똑같이 그려진다', why: 'geom 함수의 첫 번째 인자는 mapping이라, 이름 없이 넣은 데이터가 mapping 자리로 들어가요.' },
          { t: '"`mapping` must be created by `aes()`" 에러', ok: true, why: '걸러진 tibble이 mapping 자리에 들어갔어요.' },
        ] },
        { type: 'write', q: '모든 점을 그리고(색 없음), **suv**만으로 계산한 띠 없는 추세선을 더하세요.', target: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  geom_smooth(data = filter(mpg, class == "suv"), se = FALSE)`, checks: [
          { r: 'has_geom("point") && has_geom("smooth")', m: '점과 smooth 층' },
          { r: 'data_nrow() == 234', m: '점은 mpg 전체로 (ggplot()의 data는 mpg).' },
          { r: 'layer_own_data("smooth")', m: 'smooth 층에 `data = …`를 따로 줘야 해요.' },
          { r: 'identical(unique(layers()[[idx("smooth")[1]]]$data$class), "suv")', m: 'smooth의 데이터는 class == "suv"인 행만.' },
          { r: 'has_param("smooth", "se", FALSE)', m: '`se = FALSE`' },
        ], sol: `ggplot(data = mpg, mapping = aes(x = displ, y = hwy)) +
  geom_point() +
  geom_smooth(data = filter(mpg, class == "suv"), se = FALSE)` },
      ],
    },
    {
      id: 'h-exercise36',
      title: '종합: R4DS 3.6 연습문제 6개 그림 알아보기',
      src: 'wk2_ggplot_ExerciseKey.R 전체',
      key: '여섯 그림은 **aes를 어디에(ggplot() 안 / 층 안), 무엇으로(color·group·linetype) 썼는지**만 다르다.',
      body: [
        'ExerciseKey의 여섯 그림을 먼저 눈으로 구분해 보세요. (직접 그리기는 T단원 Practice에서.)',
        { compare: [
          { label: '① 점 + 선 하나', code: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(size = 4) +
  geom_smooth(se = FALSE)` },
          { label: '② 선을 drv별로 (group)', code: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(size = 4) +
  geom_smooth(aes(group = drv), se = FALSE)` },
          { label: '③ 점·선 모두 drv 색', code: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(aes(colour = drv), size = 3) +
  geom_smooth(aes(colour = drv), linewidth = 3, se = FALSE)` },
          { label: '④ 점만 drv 색, 선 하나', code: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(aes(colour = drv), size = 4) +
  geom_smooth(linewidth = 3, se = FALSE)` },
          { label: '⑤ 점은 색, 선은 linetype', code: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(aes(colour = drv), size = 3) +
  geom_smooth(aes(linetype = drv), linewidth = 3, se = FALSE)` },
          { label: '⑥ 흰 테두리 점', code: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(colour = "white", size = 10) +
  geom_point(aes(colour = drv), size = 5)` },
        ] },
        '(원본에서 선 굵기에 쓴 `size = 3`은 여기서 `linewidth = 3`으로 바꿔 경고가 나지 않게 했어요. G단원 참고.)',
      ],
      quiz: [
        { type: 'mcq', q: '④에서 선이 하나뿐인 이유는?', opts: [
          { t: 'colour = drv를 점 층 안에만 써서', ok: true, why: 'smooth 층에는 ggplot()의 x, y만 적용되어 데이터를 나눌 기준이 없어요.' },
          { t: 'se = FALSE라서', why: 'se는 신뢰 띠를 그릴지 정할 뿐이에요.' },
          { t: 'linewidth = 3이라서', why: '선 굵기만 정해요.' },
        ] },
        { type: 'mcq', q: '②와 ⑤의 공통점은?', opts: [
          { t: '선이 drv별로 3개로 나뉜다', ok: true, why: '②는 group, ⑤는 linetype으로 나눴어요.' },
          { t: '둘 다 범례가 있다', why: '②는 group이라 범례가 없어요.' },
          { t: '둘 다 점이 drv 색이다', why: '②의 점은 검정이에요.' },
        ] },
      ],
    },
  ],
});
