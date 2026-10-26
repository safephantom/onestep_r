/* 단원 P: 파이프 %>% */
RS.units.push({
  id: 'p',
  title: '파이프 %>%: 단계 잇기',
  short: 'x %>% f(y) = f(x, y), |> 도 같다, 단계 순서가 중요, 줄 끝에 둔다',
  desc: 'wk4_dplyr.R 96–118행 "the pipe operator takes the output of the expression on its left and passes it as the first argument to the function on its right."',
  setup: 'birds',
  lessons: [
    {
      id: 'p-what',
      title: 'x %>% f(y)는 f(x, y)',
      src: 'wk4_dplyr.R 96–112행',
      key: '`%>%`는 **왼쪽의 결과를 오른쪽 함수의 첫 인자**로 넣는다. dplyr 함수의 첫 인자는 데이터라서 딱 맞는다.',
      body: [
        { compare: [
          { label: '파이프 없이', code: `select(birds, bird:inches)` },
          { label: '파이프로', code: `birds %>%
  select(bird:inches)` },
        ] },
        '"the two are the same". 파이프를 쓰면 괄호 안에 데이터를 적을 필요가 없어요. `%>%`를 "**그리고 나서**(and then)"라고 읽으면 편해요: birds, 그리고 나서 select.',
        { note: 'Python과 비교', kind: 'py', t: 'pandas의 메서드 체이닝 `birds.loc[...].query(...)`과 비슷한 흐름이에요. R은 메서드 대신 함수를 쓰니 `%>%`로 이어요.' },
      ],
      quiz: [
        { type: 'mcq', q: '`birds %>% filter(inches > 11.5)`와 같은 것은?', opts: [
          { t: '`filter(birds, inches > 11.5)`', ok: true, why: 'birds가 첫 인자로 들어가요.' },
          { t: '`filter(inches > 11.5, birds)`', why: '파이프는 **첫** 인자 자리에 넣어요.' },
          { t: '`birds(filter(inches > 11.5))`', why: 'birds는 함수가 아니에요.' },
        ] },
        { type: 'fill', q: '`select(birds, bird, color)`를 파이프로 바꾸세요.', code: 'birds ▢\n  select(bird, color)', ans: [['%>%', '|>']], why: '줄 끝에 파이프.', full: `birds %>%
  select(bird, color)` },
      ],
    },
    {
      id: 'p-native',
      title: '|> 와 %>%, 그리고 단축키',
      src: 'wk4_dplyr.R 97행 "|> = %>%, (cmd+shift+M for Mac; Ctrl+shift+M for Windows)"',
      key: '`|>`는 R 4.1부터 **기본 내장** 파이프, `%>%`는 tidyverse(magrittr)의 파이프. 이 수업 수준에서는 같다. 단축키 `Ctrl+Shift+M`.',
      body: [
        { compare: [
          { label: '`%>%`', code: `birds %>% filter(inches > 11.5)` },
          { label: '`|>`', code: `birds |> filter(inches > 11.5)` },
        ] },
        'RStudio의 `Ctrl+Shift+M`이 어느 쪽을 넣을지는 Tools → Global Options → Code의 "Use native pipe operator" 설정에 따라요. 이 도구의 입력창에서는 `%>%`가 들어가요.',
        'library(tidyverse)를 안 하면 `%>%`는 "could not find function" 에러가 나지만 `|>`는 동작해요 (물론 filter 자체가 dplyr라서 결국 library는 필요해요).',
      ],
      quiz: [
        { type: 'tf', q: '`birds |> select(bird)`와 `birds %>% select(bird)`의 결과는 같다.', ans: true, why: '이 수업에서 쓰는 모든 경우에 같아요.' },
      ],
    },
    {
      id: 'p-chain',
      title: '여러 단계 잇기',
      src: 'wk4_dplyr.R 115–117행',
      key: '각 단계의 **결과(표)**가 다음 단계의 입력이 된다. 위에서 아래로 읽으면 된다.',
      body: [
        { code: `birds %>%
  select(bird:inches) %>%
  filter(inches > 11.5)` },
        '1. birds (8 × 4)\n2. 그리고 나서 bird~inches만 → 8 × 3\n3. 그리고 나서 inches > 11.5인 행만 → 4 × 3',
        '파이프 없이 쓰면 안쪽부터 읽어야 해요: `filter(select(birds, bird:inches), inches > 11.5)`. 단계가 많아질수록 파이프가 읽기 쉬워요.',
      ],
      quiz: [
        { type: 'mcq', q: '위 코드의 결과 크기는?', opts: [
          { t: '4행 × 3열', ok: true, why: '열은 select, 행은 filter.' },
          { t: '4행 × 4열', why: 'is.sparrow는 select에서 빠졌어요.' },
          { t: '8행 × 3열', why: 'filter로 행이 줄어요.' },
        ] },
        { type: 'order', q: '"birds에서 black인 새만 남기고, bird와 inches 열만 보기"를 파이프로 조립하세요.', lines: ['birds %>%', '  filter(color == "black") %>%', '  select(bird, inches)'], why: '데이터 → filter → select. 마지막 줄에는 %>%가 없어요.' },
      ],
    },
    {
      id: 'p-order',
      title: '단계 순서가 중요하다',
      src: 'select로 열을 뺀 다음에 그 열로 filter하면?',
      key: '앞 단계에서 없앤 열은 뒤 단계에서 **쓸 수 없다**. filter에 필요한 열을 select로 먼저 지우지 말 것.',
      body: [
        { code: `birds %>%
  select(bird, color) %>%
  filter(inches > 10)`, expect: 'error' },
        '에러 메시지의 "In argument: `inches > 10`" + "object \'inches\' not found": 두 번째 단계 결과에는 inches가 없어요. 순서를 바꾸면 돼요: filter 먼저, select 나중.',
        { code: `birds %>%
  filter(inches > 10) %>%
  select(bird, color)` },
      ],
      quiz: [
        { type: 'predict', q: '결과는?', code: `birds %>%
  select(-is.sparrow) %>%
  filter(is.sparrow == T)`, expect: 'error', opts: [
          { t: '참새목 새 5행', why: 'is.sparrow를 이미 뺐어요.' },
          { t: '"object \'is.sparrow\' not found" 에러', ok: true, why: '두 번째 단계 결과에 그 열이 없어요.' },
          { t: '0행', why: '에러로 멈춰요.' },
        ] },
      ],
    },
    {
      id: 'p-lineend',
      title: '%>% 도 줄 끝에',
      src: 'B단원 "줄바꿈" 규칙',
      key: '`+`와 마찬가지로 `%>%`도 **줄 끝**에 둔다. 마지막 단계 뒤에는 쓰지 않는다.',
      body: [
        { code: `birds
  %>% filter(inches > 11.5)`, expect: 'error' },
        '첫 줄 `birds`가 완결된 명령이라 그냥 birds를 출력하고, 둘째 줄은 `%>%`로 시작하는 문법 에러예요.',
      ],
      quiz: [
        { type: 'mcq', q: '파이프 줄바꿈이 올바른 것은?', opts: [
          { t: '`birds %>%` / `  filter(inches > 11.5)`', ok: true, why: '줄 끝에 %>%.' },
          { t: '`birds` / `  %>% filter(inches > 11.5)`', why: '윗줄에서 명령이 끝나요.' },
          { t: '`birds %>%` / `  filter(inches > 11.5) %>%`', why: '마지막 줄이 %>%로 끝나 R이 다음 단계를 기다려요.' },
        ] },
      ],
    },
  ],
});
