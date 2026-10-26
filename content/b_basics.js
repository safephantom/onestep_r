/* 단원 B: 이 수업 코드에 나온 R 문법만 */
RS.units.push({
  id: 'b',
  title: 'R 문법 기초 (수업에 나온 것만)',
  short: '<-, 함수와 인자, c(), rep(), 비교·논리, %in%, $, [ , ], 따옴표, 줄바꿈',
  desc: 'wk2–4 코드에 **실제로 등장한** 문법만 모았어요. 파이썬을 안다는 전제에서, 파이썬과 **다르게 동작하는 부분**을 중심으로 짚어요.',
  lessons: [
    {
      id: 'b-assign',
      title: '<- 로 이름 붙이기 (할당)',
      src: 'wk3_Rproject.R 6행 `sibimit <- read_csv(...)`, wk4 `birds <- tibble(...)`',
      key: '`이름 <- 값`: 오른쪽을 계산해서 그 결과에 왼쪽 이름을 붙인다. 파이썬의 `x = 4`와 같은 역할.',
      body: [
        '수업 코드에서 `<-`는 항상 "만들어서 저장"이에요: `sibimit <- read_csv(...)`, `birds <- tibble(...)`, `adding <- function(x, y){...}`, `nosparrow <- select(...)`.',
        { code: `x <- 4
x
x * 2` },
        '출력 앞의 `[1]`은 "이 줄은 1번째 원소부터 시작"이라는 번호예요. R에서는 숫자 하나도 길이 1짜리 **벡터**라서 이렇게 표시돼요.',
        { note: '= 와 <- 는 어떻게 다른가', kind: 'py', t: '맨 바깥에서 `x = 4`라고 써도 할당은 돼요. 하지만 R 관례는 `<-`이고, **함수 괄호 안의 `=`는 할당이 아니라 인자 이름 붙이기**예요. `aes(x = displ)`은 x라는 변수를 만들지 않아요 — "aes의 x 자리에 displ 열"이라는 뜻이에요.' },
        { note: '단축키', kind: 'tip', t: 'RStudio에서 `Alt + -`(마이너스)를 누르면 ` <- `가 입력돼요. 이 도구의 입력창에서도 똑같이 돼요.' },
      ],
      quiz: [
        { type: 'predict', q: '마지막 줄의 출력은?', code: `y <- 3
y <- y + 1
y`, opts: [
          { t: '`[1] 3`', why: '둘째 줄이 y를 3+1로 **덮어써요**.' },
          { t: '`[1] 4`', ok: true, why: '오른쪽(`y + 1` = 4)을 먼저 계산하고, 그 값을 다시 y에 붙여요.' },
          { t: '에러: y가 양쪽에 있어서', why: '오른쪽을 먼저 계산하므로 문제없어요 (파이썬 `y = y + 1`과 같아요).' },
        ] },
        { type: 'mcq', q: '`geom_point(mapping = aes(x = displ, y = hwy))`를 실행한 뒤 콘솔에 `x`를 치면?', opts: [
          { t: 'displ 값들이 나온다', why: '`x = displ`은 aes()의 x 인자에 displ을 넘긴 것일 뿐, x라는 객체를 만들지 않아요.' },
          { t: '`object \'x\' not found` (다른 곳에서 x를 만든 적이 없다면)', ok: true, why: '괄호 안의 `=`는 할당이 아니라 **인자 이름**이에요.' },
          { t: '`[1] "displ"`', why: '어떤 할당도 일어나지 않았어요.' },
        ] },
        { type: 'mcq', q: '출력 `[1] 4`에서 `[1]`의 뜻은?', opts: [
          { t: '결과가 1개라는 뜻', why: '개수가 아니라 **위치 번호**예요. 긴 벡터는 줄마다 `[1]`, `[13]`처럼 그 줄 첫 원소의 번호가 붙어요.' },
          { t: '그 줄에 보이는 첫 값이 1번째 원소라는 뜻', ok: true, why: 'R은 1부터 세요 (파이썬은 0부터).' },
          { t: '첫 번째 실행 결과라는 뜻', why: '실행 횟수와는 관계없어요.' },
        ] },
      ],
    },
    {
      id: 'b-paren',
      title: '(x <- 4): 괄호로 감싸면 할당하면서 출력',
      src: 'wk3_Rproject.R 13행 `(x <- 4) ## printing as well as assigning`',
      key: '할당은 원래 **조용하다**(아무것도 안 보여 줌). 통째로 괄호로 감싸면 저장한 값을 바로 보여 준다.',
      body: [
        { compare: [
          { label: '할당만: 출력 없음', code: `z <- 10 * 2` },
          { label: '괄호로 감싸기: 저장 + 출력', code: `(z <- 10 * 2)` },
        ] },
        '그래서 `sibimit <- read_csv(...)`를 실행해도 데이터가 화면에 쏟아지지 않아요 (read_csv의 **안내 메시지**만 나올 뿐). 내용을 보려면 `head(sibimit)`, `glimpse(sibimit)`처럼 따로 봐야 해요.',
      ],
      quiz: [
        { type: 'predict', q: '이 한 줄을 실행하면 콘솔에 무엇이 나올까요?', code: `w <- 5 + 5`, opts: [
          { t: '`[1] 10`', why: '할당은 조용해요. 괄호가 없으니 아무것도 안 나와요.' },
          { t: '아무것도 안 나온다', ok: true, why: 'w에 10이 저장되긴 했어요. `w`를 치면 보여요.' },
          { t: '`w`', why: '이름이 출력되지는 않아요.' },
        ] },
        { type: 'predict', q: '이번에는?', code: `(w <- 5 + 5)`, opts: [
          { t: '`[1] 10`', ok: true, why: '괄호가 "이 식의 값을 보여 줘"가 되어 저장과 출력이 동시에 돼요.' },
          { t: '아무것도 안 나온다', why: '괄호로 감싸면 출력돼요.' },
          { t: '에러', why: '문법적으로 올바른 코드예요.' },
        ] },
      ],
    },
    {
      id: 'b-rm',
      title: 'rm(): 객체 지우기',
      src: 'wk3_Rproject.R 12행 `rm(sibimit) ## removing objects`',
      key: '`rm(이름)`은 그 객체를 **R 세션에서** 지운다. 파일은 그대로다.',
      body: [
        { code: `x <- 4
rm(x)
x`, expect: 'error' },
        '`rm(sibimit)`을 해도 `sib_imit_data.csv` 파일은 컴퓨터에 그대로 있어요. Environment 창의 목록에서만 사라지고, 다시 `read_csv()`로 불러오면 돼요.',
      ],
      quiz: [
        { type: 'mcq', q: '`rm(sibimit)` 직후에 `head(sibimit)`를 실행하면?', opts: [
          { t: '앞 6행이 나온다', why: '방금 지웠어요.' },
          { t: '`object \'sibimit\' not found`', ok: true, why: '세션에서 사라졌으니 read_csv()로 다시 만들어야 해요.' },
          { t: 'CSV 파일이 삭제되었다는 메시지', why: 'rm()은 파일을 건드리지 않아요.' },
        ] },
        { type: 'tf', q: '`rm(sibimit)`을 하면 QuantAnalysis_data 폴더의 sib_imit_data.csv도 지워진다.', ans: false, why: 'rm()은 R 메모리 속 객체만 지워요.' },
      ],
    },
    {
      id: 'b-names',
      title: '이름 규칙: 점(.)과 대소문자',
      src: 'wk4_dplyr.R `is.sparrow`, `sqrt.inch`, `in.less2`; 데이터 열 `Subject`(sib_imit) vs `subject`(sib_merger)',
      key: 'R에서 `.`은 **이름의 일부**다 (`is.sparrow`는 한 덩어리 이름). 그리고 대소문자가 다르면 다른 이름이다.',
      body: [
        '파이썬에서 `a.b`는 "a의 속성 b"지만, R에서 `is.sparrow`는 그냥 한 단어짜리 이름이에요. wk4의 `sqrt.inch`, `in.less2`, `sqrt.inch.less2`도 모두 그냥 열 이름이에요.',
        { code: `sqrt.inch <- 5
Sqrt.inch <- 7
sqrt.inch` },
        { note: '실제로 걸리기 쉬운 곳', kind: 'warn', t: '두 데이터 파일의 열 이름 대소문자가 달라요.\n\n- `sib_imit_data.csv`: `Subject`, `Gender`, `Place`, `Task` (대문자 시작)\n- `sib_merger.csv`: `subject`, `place`, `task`, `condition` (전부 소문자)\n\n`sibmerger`에 `Subject`라고 쓰면 "object \'Subject\' not found"가 나요.' },
        '`View()`(대문자, R 기본)와 `view()`(소문자, tibble 패키지)는 **다른 함수**인데 둘 다 존재해서 둘 다 동작해요. wk2는 `View(mpg)`, wk4는 `view(birds)`를 써요.',
      ],
      quiz: [
        { type: 'predict', q: '파이썬 습관대로 `birds.inches`라고 쓰면? (birds는 만들어져 있음)', setup: 'birds', code: `birds.inches`, expect: 'error', opts: [
          { t: 'inches 열 값이 나온다', why: 'R은 `birds.inches`를 한 덩어리 이름으로 읽어요. 열을 꺼내는 기호는 `$`예요 (`birds$inches`).' },
          { t: '`object \'birds.inches\' not found`', ok: true, why: '그런 이름의 객체는 없어요.' },
          { t: 'birds 전체가 나온다', why: '`.`은 연산자가 아니에요.' },
        ] },
        { type: 'mcq', q: '`sibmerger <- read_csv("QuantAnalysis_data/sib_merger.csv")`로 불러온 데이터에서 참가자 열을 가리키는 이름은?', setup: 'sibmerger', opts: [
          { t: '`Subject` (sib_imit_data와 같게)', why: 'sib_merger의 열 이름은 전부 소문자라서 `subject`예요. `Subject`라고 쓰면 "object \'Subject\' not found"가 나요.' },
          { t: '`subject`', ok: true, why: '맞아요. sib_imit_data(`Subject`)와 달리 전부 소문자예요.' },
          { t: '둘 다 된다 (R은 대소문자 무시)', why: 'R은 대소문자를 구분해요.' },
        ] },
        { type: 'tf', q: '`is.sparrow`는 "is라는 객체의 sparrow 속성"이다.', ans: false, why: '그냥 `is.sparrow`라는 한 개의 열 이름이에요.' },
      ],
    },
    {
      id: 'b-call',
      title: '함수 부르기: 함수(인자 = 값, …)',
      src: 'wk2_ggplot_intro.R 전체',
      key: '`함수이름(인자이름 = 값, 인자이름 = 값)` — 인자는 **쉼표**로 구분하고, 함수 안에 함수를 넣을 수 있다. 괄호는 반드시 짝이 맞아야 한다.',
      body: [
        '수업 코드의 대부분은 이 한 가지 모양의 반복이에요.',
        { code: `geom_point(mapping = aes(x = displ, y = hwy), color = "blue")`, run: false },
        { table: { head: ['조각', '뜻'], rows: [
          ['`geom_point( … )`', '바깥 함수'],
          ['`mapping = aes(…)`', '첫 인자: 이름 `mapping`, 값은 **aes() 함수를 부른 결과**'],
          ['`x = displ, y = hwy`', 'aes()의 인자 두 개'],
          ['`color = "blue"`', 'geom_point()의 또 다른 인자'],
        ] } },
        '괄호 짝이 안 맞으면 `unexpected \')\'`(닫는 괄호가 많음) 또는 `unexpected end of input`(덜 닫음)이 나요. RStudio는 커서를 괄호 옆에 두면 짝 괄호를 강조해 줘요.',
      ],
      quiz: [
        { type: 'mcq', q: '`geom_point(mapping = aes(x = displ, y = hwy))`에 등장하는 **함수**는 몇 개?', opts: [
          { t: '1개', why: 'aes도 함수예요 (괄호가 붙어 있죠).' },
          { t: '2개 (geom_point, aes)', ok: true, why: '`mapping`, `x`, `y`는 인자 이름, `displ`, `hwy`는 열 이름이에요.' },
          { t: '4개', why: 'x, y는 인자 이름이지 함수가 아니에요.' },
        ] },
        { type: 'predict', q: '이 코드를 실행하면?', code: `ggplot(mpg, aes(x = displ, y = hwy))) + geom_point()`, expect: 'error', opts: [
          { t: '산점도가 그려진다', why: '닫는 괄호가 하나 더 있어요.' },
          { t: "`unexpected ')'` 에러", ok: true, why: '`hwy)))` — aes, ggplot을 닫고도 하나가 남아요.' },
          { t: '빈 캔버스만 그려진다', why: '문법 에러라 아무것도 실행되지 않아요.' },
        ] },
        { type: 'fill', q: '빈칸에 들어갈 기호는? (위 표의 코드예요)', code: 'geom_point(mapping = aes(x = displ, y = hwy)▢ color = "blue")', ans: [[',']], why: '`aes(…)`가 닫힌 뒤에도 geom_point()의 인자 `color`가 이어지니, 인자 사이에 쉼표를 넣어요. 쉼표가 없으면 `unexpected symbol` 에러가 나요.', full: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy), color = "blue")` },
      ],
    },
    {
      id: 'b-positional',
      title: '인자 이름 생략하기 (순서로 전달)',
      src: 'wk2 초반 `ggplot(data = mpg, mapping = aes(...))` → 후반 `ggplot(mpg, aes(...))`',
      key: '인자 이름을 빼면 **정해진 순서대로** 채워진다. ggplot()은 (data, mapping), geom_*()는 (mapping, data) 순서.',
      body: [
        'wk2 파일 앞부분은 이름을 다 쓰고, 121행부터는 줄여 써요. 두 줄은 완전히 같아요:',
        { code: `ggplot(data = mpg, mapping = aes(x = displ, y = hwy)) + geom_point()
ggplot(mpg, aes(x = displ, y = hwy)) + geom_point()`, run: false },
        '순서를 바꾸면 이름을 꼭 붙여야 해요. 이름 없이 순서를 바꾸면:',
        { code: `ggplot(aes(x = displ, y = hwy), mpg) +
  geom_point()`, expect: 'error' },
        'ggplot은 첫 자리(data)에 aes가, 둘째 자리(mapping)에 tibble이 들어왔다고 불평해요. **geom 함수는 순서가 반대**라는 것도 기억하세요 (`?geom_point` Usage의 첫 인자가 mapping). 그래서 wk2 117행처럼 geom에 데이터를 줄 때는 `geom_smooth(data = filter(mpg, ...))`로 **이름을 붙여요**.',
        { note: 'aes()의 순서', kind: 'tip', t: 'aes()의 첫 두 인자는 x, y라서 `aes(displ, hwy)` = `aes(x = displ, y = hwy)`예요. 수업 코드는 항상 이름을 써요 — 읽기 쉬우니 그 습관을 권해요.' },
      ],
      quiz: [
        { type: 'mcq', q: '`ggplot(data = mpg, mapping = aes(x = displ, y = hwy)) + geom_point()`와 **다른 결과**를 내는 것은?', opts: [
          { t: '`ggplot(mpg, aes(x = displ, y = hwy)) + geom_point()`', why: '순서대로 data, mapping — 같아요.' },
          { t: '`ggplot(mapping = aes(x = displ, y = hwy), data = mpg) + geom_point()`', why: '이름을 붙이면 순서는 상관없어요.' },
          { t: '`ggplot(aes(x = displ, y = hwy), mpg) + geom_point()`', ok: true, why: '이름 없이 순서를 바꿔서 data 자리에 aes가 들어가요 → 에러.' },
          { t: '`ggplot(mpg) + geom_point(aes(x = displ, y = hwy))`', why: 'mapping을 geom에 줘도 같은 그림이에요 (H단원).' },
        ] },
        { type: 'predict', q: 'geom에 데이터를 이름 없이 주면?', code: `ggplot() +
  geom_point(mpg, aes(x = displ, y = hwy))`, expect: 'error', opts: [
          { t: '산점도가 그려진다', why: 'geom_point의 첫 자리는 mapping이에요.' },
          { t: '"`mapping` must be created by `aes()`" 에러', ok: true, why: 'mapping 자리에 tibble(mpg)이 들어갔어요. `geom_point(data = mpg, aes(...))`로 고쳐요.' },
        ] },
        { type: 'mcq', q: '`aes(displ, hwy)`는 무엇과 같을까요?', opts: [
          { t: '`aes(x = displ, y = hwy)`', ok: true, why: 'aes의 인자 순서는 x, y예요.' },
          { t: '`aes(y = displ, x = hwy)`', why: '첫 번째가 x예요.' },
          { t: '에러 (이름이 꼭 필요)', why: '순서대로 채워져서 괜찮아요.' },
        ] },
      ],
    },
    {
      id: 'b-function',
      title: '함수 만들기: function(x, y){ x + y }',
      src: 'wk2_ggplot_intro.R 21–30행',
      key: '`이름 <- function(매개변수){ 본문 }`. **마지막 식의 값**이 자동으로 결과가 된다 (return 없이).',
      setup: 'adding',
      body: [
        { code: `adding <- function(x, y){
  x + y
}

adding(1, 2)`, setup: [] },
        { note: 'Python과 비교', kind: 'py', t: '파이썬의 `def adding(x, y): return x + y`와 같아요. 다른 점: (1) 들여쓰기 대신 `{ }`, (2) `return`을 안 써도 마지막 줄 값이 반환, (3) 함수도 `<-`로 **이름에 붙이는 값**이에요.' },
        '인자 이름을 붙여서 부르면 순서를 바꿔도 돼요: `adding(y = 2, x = 1)`. 하나를 빼먹으면 에러예요:',
        { code: `adding(1)`, expect: 'error' },
        '이 수업에서 함수를 직접 만들 일은 거의 없지만, 이 예시는 **"함수(인자)" 구조와 인자라는 말**을 설명하려는 것이에요. `ggplot()`, `geom_point()`도 누군가 이렇게 만든 함수예요.',
      ],
      quiz: [
        { type: 'predict', q: '`adding`이 위처럼 정의되어 있을 때 결과는?', code: `adding(10, -3)`, opts: [
          { t: '`[1] 7`', ok: true, why: 'x = 10, y = -3 → 10 + (-3).' },
          { t: '`[1] 13`', why: '-3을 더하면 7이에요.' },
          { t: '에러: 음수는 안 됨', why: '숫자라면 무엇이든 돼요.' },
        ] },
        { type: 'predict', q: '글자를 넣으면?', code: `adding("a", 2)`, expect: 'error', opts: [
          { t: '`[1] "a2"`', why: 'R의 `+`는 글자를 이어 붙이지 않아요 (파이썬과 다름!).' },
          { t: '`non-numeric argument to binary operator` 에러', ok: true, why: '`+`는 숫자 전용이에요.' },
          { t: '`[1] NA`', why: 'NA가 아니라 에러로 멈춰요.' },
        ] },
        { type: 'mcq', q: 'R 함수에서 파이썬의 `return` 역할을 하는 것은?', opts: [
          { t: '본문의 마지막 식', ok: true, why: '`{ x + y }`의 마지막 식 `x + y`의 값이 결과예요. (R에도 `return()`이 있긴 하지만 보통 생략해요.)' },
          { t: '`<-`', why: '`<-`는 이름 붙이기예요.' },
          { t: '중괄호 `}`', why: '중괄호는 본문의 끝을 표시할 뿐이에요.' },
        ] },
      ],
    },
    {
      id: 'b-params',
      title: '매개변수(x, y)와 인자(1, 2)',
      src: 'wk2_ggplot_intro.R 29–30행 `## x, y: variables  ## 1, 2: arguments`',
      key: '함수를 **만들 때** 적는 이름(x, y) = 매개변수(parameter). 함수를 **부를 때** 넣는 값(1, 2) = 인자(argument).',
      setup: 'adding',
      body: [
        '수업 주석은 x, y를 "variables"라고 적었는데, 정확한 이름은 **매개변수**(parameter, formal argument)예요. 도움말(`?geom_point`)의 Usage에 나오는 `mapping`, `data`, `position`이 바로 매개변수 목록이에요.',
        { table: { head: ['코드', '매개변수', '인자(넣은 값)'], rows: [
          ['`adding(1, 2)`', 'x, y', '1, 2'],
          ['`geom_point(mapping = aes(…), color = "blue")`', 'mapping, color', '`aes(…)`의 결과, `"blue"`'],
          ['`geom_point(position = "jitter")`', 'position', '`"jitter"`'],
        ] } },
        '매개변수 x, y는 **함수 안에서만** 존재해요. 함수를 부르고 나서 밖에서 `x`를 찾으면 없어요:',
        { code: `adding(1, 2)
x`, expect: 'error', setup: 'adding' },
      ],
      quiz: [
        { type: 'mcq', q: '`geom_point(color = "blue")`에서 `"blue"`는?', opts: [
          { t: '매개변수', why: '매개변수는 `color`(이름)예요.' },
          { t: '인자 (color 매개변수에 넣은 값)', ok: true, why: '맞아요.' },
          { t: '함수', why: '괄호가 붙어 있지 않아요. 여기서 함수는 `geom_point`예요.' },
        ] },
        { type: 'mcq', q: '`?geom_boxplot`의 Usage에 적힌 `outlier.colour`, `width` 같은 이름들은?', opts: [
          { t: '그 함수가 받을 수 있는 매개변수 목록', ok: true, why: '그래서 `geom_boxplot(width = 0.1)`처럼 쓸 수 있어요 (wk3 Practice 1).' },
          { t: '데이터의 열 이름', why: '열 이름은 데이터마다 달라요. Usage는 함수의 설계도예요.' },
          { t: '만들어 둔 객체', why: '함수를 부를 때만 쓰이는 이름이에요.' },
        ] },
      ],
    },
    {
      id: 'b-c',
      title: 'c(): 값 여러 개를 하나로 묶기 (벡터)',
      src: 'wk4_dplyr.R 10–16행, 82행 `c("oriole","owl")` — "c: concatenate"',
      key: '`c()`는 값들을 한 줄로 이은 **벡터**를 만든다. 벡터 안의 값은 **모두 같은 종류**여야 해서, 섞으면 한 종류로 바뀐다.',
      body: [
        { code: `inches <- c(23, 25, 26, 7, 8, 8.5, 11.5, 12)
inches
length(inches)` },
        { note: 'Python 리스트와 다른 점', kind: 'py', t: '- 종류를 섞으면 **자동 변환**: `c(1, "a")` → `"1" "a"` (둘 다 글자)\n- 중첩되지 않음: `c(c(1, 2), 3)` → `1 2 3` (파이썬 `[[1,2],3]`과 다름)\n- 계산이 원소별로 됨 (다음 레슨)' },
        '수업에서 c()가 쓰인 곳: `tibble()`의 열 값들, `rep(…, times = c(3,3,2))`, `%in% c("oriole","owl")`, `scale_fill_manual(values = c("#A6D96A", …))`.',
      ],
      quiz: [
        { type: 'predict', q: '결과는?', code: `c(1, "a", TRUE)`, opts: [
          { t: '`[1] 1 "a" TRUE`', why: '벡터는 한 종류만 담아요.' },
          { t: '`[1] "1"    "a"    "TRUE"`', ok: true, why: '글자가 하나라도 섞이면 전부 글자(character)가 돼요.' },
          { t: '에러', why: '에러 없이 조용히 변환돼요 — 그래서 더 조심해야 해요.' },
        ] },
        { type: 'predict', q: '결과는?', code: `c(c(1, 2), 3)`, opts: [
          { t: '`[1] 1 2 3`', ok: true, why: 'c()는 안쪽 벡터를 풀어서 이어 붙여요.' },
          { t: '`[[1]] 1 2  [[2]] 3`', why: '중첩된 구조가 되지 않아요.' },
        ] },
        { type: 'mcq', q: '`length(c("owl", "crow", "oriole"))`의 값은?', opts: [
          { t: '3', ok: true, why: '원소 3개.' },
          { t: '14 (글자 수 합)', why: 'length는 원소 개수예요. 글자 수는 nchar().' },
          { t: '1', why: '벡터 하나지만 원소는 3개예요.' },
        ] },
      ],
    },
    {
      id: 'b-vector',
      title: '벡터 계산은 원소마다 한꺼번에',
      src: 'wk4_dplyr.R 133행 `in.less2 = inches - 2  ## whatever the values in the column, subtract 2`',
      key: '`inches - 2`는 **모든 원소**에서 2를 뺀다. 같은 길이의 두 벡터끼리는 **같은 위치끼리** 계산한다.',
      body: [
        { code: `inches <- c(23, 25, 26, 7)
inches - 2
sqrt(inches)` },
        '같은 길이 두 벡터: wk4 연습의 `diff = hwy - cty`는 각 행의 hwy에서 **같은 행의** cty를 빼요.',
        { code: `hwy <- c(29, 29, 31)
cty <- c(18, 21, 20)
hwy - cty` },
        { note: 'Python과 비교', kind: 'py', t: '파이썬 리스트 `[23, 25] - 2`는 TypeError지만, R 벡터는 numpy 배열처럼 동작해요. 나중에 mutate()(Q단원)로 열을 만들 때 반복문 없이 열 전체를 한 번에 계산하는 것도 이 성질 덕분이에요.' },
      ],
      quiz: [
        { type: 'predict', q: '결과는?', code: `c(10, 20, 30) / 10`, opts: [
          { t: '`[1] 1 2 3`', ok: true, why: '각 원소를 10으로 나눠요.' },
          { t: '`[1] 6`', why: '합계를 나누는 게 아니라 원소마다 나눠요.' },
          { t: '에러', why: '벡터 ÷ 숫자는 정상이에요.' },
        ] },
        { type: 'predict', q: '결과는?', code: `c(29, 29, 31) - c(18, 21, 20)`, opts: [
          { t: '`[1] 11  8 11`', ok: true, why: '29−18, 29−21, 31−20.' },
          { t: '`[1] 30`', why: '합계끼리 빼는 게 아니에요.' },
        ] },
        { type: 'mcq', q: '`inches <- c(23, 25, 26, 7, 8, 8.5, 11.5, 12)`일 때, `sqrt(inches)`가 반복문 없이 8개 값 모두의 제곱근을 구할 수 있는 이유는?', opts: [
          { t: 'sqrt()가 벡터의 원소마다 계산하기 때문', ok: true, why: '함수가 원소별로 동작해서 벡터 전체가 한 번에 계산돼요.' },
          { t: 'R이 몰래 for문을 만들어 주기 때문', why: '반복문이 아니라 벡터 연산 덕분이에요.' },
          { t: '값이 8개뿐이라서', why: '값이 몇 개든 똑같이 돼요.' },
        ] },
      ],
    },
    {
      id: 'b-rep',
      title: 'rep(): 반복해서 벡터 만들기',
      src: 'wk4_dplyr.R 10–16행 (birds 만들기)',
      key: '`rep(값들, times = n)`은 전체를 n번 반복. `times`가 **벡터**면 각 값을 **따로** 그 횟수만큼 반복한다.',
      body: [
        { code: `rep(c("owl", "crow", "oriole"), times = c(3, 3, 2))
rep(c("x", "y"), times = 3)
rep(c(F, T), times = c(3, 5))` },
        'birds의 네 열은 모두 길이 8이어야 해요: `times = c(3,3,2)`의 합 8, `inches`의 원소 8개, `times = c(3,5)`의 합 8. 하나라도 다르면 tibble()이 에러를 내요 (N단원).',
      ],
      quiz: [
        { type: 'predict', q: '결과는?', code: `rep(c("a", "b"), times = c(1, 3))`, opts: [
          { t: '`[1] "a" "b" "b" "b"`', ok: true, why: 'a를 1번, b를 3번.' },
          { t: '`[1] "a" "b" "a" "b" "a" "b"`', why: 'times가 벡터면 원소별 횟수예요. 이건 `times = 3`일 때.' },
          { t: '`[1] "a" "a" "a" "b"`', why: '순서대로 1번, 3번이에요.' },
        ] },
        { type: 'mcq', q: '`rep(c("owl", "crow", "oriole"), times = c(3, 3, 2))`의 길이는?', opts: [
          { t: '3', why: '반복된 결과의 길이예요.' },
          { t: '8', ok: true, why: '3 + 3 + 2.' },
          { t: '6', why: '2도 더해야 해요.' },
        ] },
        { type: 'fill', q: 'orange 3번 다음 black 5번이 되도록 채우세요.', code: 'rep(c("orange", "black"), times = c(▢, ▢))', ans: [['3'], ['5']], why: '각 값의 반복 횟수를 순서대로 줘요.', full: 'rep(c("orange", "black"), times = c(3, 5))' },
      ],
    },
    {
      id: 'b-types',
      title: '값의 종류: 숫자·글자·논리',
      src: 'glimpse() 출력의 `<dbl>`, `<chr>`, `<lgl>`',
      key: '숫자(numeric: dbl/int), 글자(character: 따옴표), 논리(logical: TRUE/FALSE). 종류가 다르면 쓸 수 있는 연산이 다르다.',
      body: [
        { table: { head: ['종류', '예', 'glimpse 표시', '수업 속 예'], rows: [
          ['실수 (double)', '`23`, `8.5`', '`<dbl>`', 'birds$inches, mpg$displ, COGm'],
          ['정수 (integer)', '`4L` (보통 데이터에서 옴)', '`<int>`', 'mpg$cyl, mpg$hwy, mpg$year'],
          ['글자 (character)', '`"owl"`', '`<chr>`', 'bird, class, Subject, Place'],
          ['논리 (logical)', '`TRUE`, `FALSE`', '`<lgl>`', 'is.sparrow'],
        ] } },
        '`"23"`(글자)과 `23`(숫자)은 다른 값이에요. 글자에는 산술이 안 돼요:',
        { code: `"23" + 1`, expect: 'error' },
      ],
      quiz: [
        { type: 'mcq', q: '아래 birds 데이터에서 `is.sparrow` 열의 종류는?', data: 'birds', opts: [
          { t: 'logical (`<lgl>`)', ok: true, why: '`rep(c(F, T), …)`로 만들었으니 TRUE/FALSE.' },
          { t: 'character', why: '따옴표로 감싼 "TRUE"가 아니라 진짜 논리값이에요.' },
          { t: 'double', why: '숫자가 아니에요.' },
        ] },
        { type: 'mcq', q: 'mpg의 `hwy`는 `<int>`, `displ`은 `<dbl>`. 차이는?', opts: [
          { t: 'int는 정수만, dbl은 소수도 담는 숫자', ok: true, why: '둘 다 숫자라서 계산·평균은 똑같이 돼요. ggplot에서도 둘 다 **연속**으로 취급해요.' },
          { t: 'int는 글자다', why: 'int는 정수예요.' },
          { t: 'int는 범주형이다', why: '숫자형이에요. (범주는 `<chr>`이나 `<fct>`)' },
        ] },
        { type: 'tf', q: '`"23" + 1`의 결과는 `24`이다.', ans: false, why: '"23"은 글자라서 `non-numeric argument to binary operator` 에러가 나요.' },
      ],
    },
    {
      id: 'b-tf',
      title: 'TRUE / FALSE 와 T / F',
      src: 'wk4 `c(F, T)`, `is.sparrow==T`; wk3 `read.csv(..., header=T)`',
      key: '`T`, `F`는 `TRUE`, `FALSE`의 줄임말. 대문자로 써야 한다.',
      body: [
        '수업 코드는 짧게 `T`, `F`를 써요. 정식 이름은 `TRUE`, `FALSE`예요. `true`(소문자)나 파이썬식 `True`는 **없는 이름**이에요.',
        { note: '작은 함정', kind: 'warn', t: '`TRUE`는 바꿀 수 없는 예약어지만 `T`는 그냥 변수라서 누가 `T <- 0`을 해 버리면 의미가 바뀌어요. 그래서 공식 문서들은 `TRUE`/`FALSE`를 권해요. 수업 코드처럼 T/F를 써도 평소엔 문제없어요.' },
      ],
      quiz: [
        { type: 'mcq', q: '`filter(birds, is.sparrow == T)`와 같은 결과는?', setup: 'birds', opts: [
          { t: '`filter(birds, is.sparrow == TRUE)`', ok: true, why: 'T = TRUE.' },
          { t: '`filter(birds, is.sparrow == "T")`', why: '"T"는 글자라서 논리값 TRUE와 달라요.' },
          { t: '`filter(birds, is.sparrow == True)`', why: '`True`라는 이름은 R에 없어요 (파이썬 표기).' },
        ] },
        { type: 'predict', q: '결과는?', code: `true`, expect: 'error', opts: [
          { t: '`[1] TRUE`', why: 'R은 대소문자를 구분해요.' },
          { t: '`object \'true\' not found`', ok: true, why: '소문자 true는 그냥 (없는) 이름이에요.' },
        ] },
      ],
    },
    {
      id: 'b-compare',
      title: '비교: == != > >= < <=',
      src: 'wk4 `color=="black"`, `inches > 11.5`, `diff >= 5`; wk2 `class == "subcompact"`',
      key: '비교의 결과는 TRUE/FALSE (벡터면 원소마다). "같다"는 **`==`**(등호 두 개).',
      body: [
        { code: `inches <- c(23, 25, 26, 7, 8, 8.5, 11.5, 12)
inches > 11.5
inches >= 11.5` },
        '`filter()`는 이 TRUE/FALSE를 받아서 TRUE인 행만 남겨요 (O단원). `11.5 > 11.5`는 FALSE라는 점(경계값)을 꼭 기억하세요.',
        { table: { head: ['기호', '뜻'], rows: [['`==`', '같다'], ['`!=`', '같지 않다'], ['`>` `>=`', '크다, 크거나 같다'], ['`<` `<=`', '작다, 작거나 같다']] } },
        '글자 비교는 대소문자까지 정확해야 해요: `"owl" == "Owl"`은 FALSE.',
      ],
      quiz: [
        { type: 'predict', q: '결과는?', code: `c(7, 11.5, 12) > 11.5`, opts: [
          { t: '`[1] FALSE FALSE  TRUE`', ok: true, why: '11.5는 11.5보다 "크지" 않아요.' },
          { t: '`[1] FALSE  TRUE  TRUE`', why: '경계값 11.5는 `>`에서 FALSE예요. `>=`였다면 TRUE.' },
          { t: '`[1] TRUE`', why: '원소마다 결과가 나와요.' },
        ] },
        { type: 'predict', q: '결과는?', code: `"owl" == "Owl"`, opts: [
          { t: '`[1] TRUE`', why: '대소문자가 달라요.' },
          { t: '`[1] FALSE`', ok: true, why: 'R의 글자 비교는 정확히 같아야 TRUE.' },
        ] },
        { type: 'fill', q: '"같지 않다"를 나타내는 기호로 채우세요.', code: 'c("owl", "crow") ▢ "owl"', ans: [['!=']], why: '결과는 `FALSE TRUE`예요.', full: 'c("owl", "crow") != "owl"' },
      ],
    },
    {
      id: 'b-logic',
      title: '& (그리고) 와 ! (아니다)',
      src: 'wk4 `inches > 11.5 & bird=="owl"`, `!(bird=="owl")`, `!(class == "pickup" & diff >= 5)`',
      key: '`A & B`는 둘 다 TRUE일 때만 TRUE. `!A`는 TRUE↔FALSE 뒤집기. 괄호로 범위를 정한다.',
      body: [
        { code: `x <- c(TRUE, TRUE, FALSE, FALSE)
y <- c(TRUE, FALSE, TRUE, FALSE)
x & y
!x` },
        'wk4 마지막 연습의 조건 `!(class == "pickup" & diff >= 5)`를 풀어 보면:',
        '1. `class == "pickup" & diff >= 5` → "픽업이면서 차이가 5 이상"인 행만 TRUE\n2. `!( … )` → 그 행들만 FALSE, 나머지는 TRUE\n3. filter()는 TRUE인 행을 남기니 → **그 픽업들만 빠져요**',
        { note: 'Python과 비교', kind: 'py', t: '파이썬의 `and`, `not`에 해당하지만, R의 `&`, `!`는 **벡터 원소마다** 동작해요 (pandas의 `&`, `~`와 비슷).' },
      ],
      quiz: [
        { type: 'predict', q: '결과는?', code: `!(c(5, 8) > 6)`, opts: [
          { t: '`[1]  TRUE FALSE`', ok: true, why: '`c(5,8) > 6` → FALSE TRUE, 뒤집으면 TRUE FALSE.' },
          { t: '`[1] FALSE  TRUE`', why: '`!`로 뒤집었어요.' },
        ] },
        { type: 'mcq', q: '`filter(mpg, !(class == "pickup" & diff >= 5))`에서 **지워지는** 행은? (diff는 hwy − cty)', opts: [
          { t: '모든 pickup', why: 'diff < 5인 pickup은 남아요.' },
          { t: 'diff가 5 이상인 모든 차', why: 'pickup이 아닌 차는 diff와 관계없이 남아요.' },
          { t: 'pickup이면서 diff가 5 이상인 차', ok: true, why: '괄호 안이 TRUE인 행 = 지워지는 행.' },
        ] },
        { type: 'predict', q: '결과는?', code: `TRUE & !FALSE`, opts: [
          { t: '`[1] TRUE`', ok: true, why: '`!FALSE`는 TRUE, TRUE & TRUE = TRUE.' },
          { t: '`[1] FALSE`', why: '`!`가 FALSE를 TRUE로 바꿔요.' },
        ] },
      ],
    },
    {
      id: 'b-in',
      title: '%in%: 여러 값 중 하나인가',
      src: 'wk4_dplyr.R 82–84행 `filter(birds, bird %in% c("oriole","owl"))`',
      key: '`x %in% c(a, b)` → x의 각 원소가 a나 b 중 하나면 TRUE.',
      body: [
        { code: `"owl" %in% c("oriole", "owl")
c("owl", "crow", "oriole") %in% c("oriole", "owl")` },
        '결과의 길이는 **왼쪽**의 길이와 같아요. 그래서 filter() 안에서 "이 값들 중 하나인 행"을 고를 때 딱 맞아요.',
        { note: '== 로는 안 되는 이유', kind: 'warn', t: '`bird == c("oriole", "owl")`은 "oriole인가?"와 "owl인가?"를 행마다 **번갈아** 물어봐요 (짧은 벡터가 반복되는 R 규칙). 겉으로는 에러 없이 이상한 결과가 나와요. 여러 값 중 하나인지 물을 때는 항상 `%in%`.' },
        { note: 'Python과 비교', kind: 'py', t: '파이썬 `x in ["oriole", "owl"]` 또는 pandas `df["bird"].isin([...])`와 같아요.' },
      ],
      quiz: [
        { type: 'predict', q: '결과는?', code: `c("crow", "owl") %in% c("oriole", "owl")`, opts: [
          { t: '`[1] FALSE  TRUE`', ok: true, why: 'crow는 목록에 없고 owl은 있어요.' },
          { t: '`[1] TRUE`', why: '왼쪽 원소마다 결과가 나와요.' },
          { t: '`[1] FALSE FALSE  TRUE`', why: '결과 길이는 왼쪽(2개)을 따라요.' },
        ] },
        { type: 'mcq', q: '아래 birds 데이터에서 `bird %in% c("oriole", "owl")`이 TRUE인 행은 몇 개?', data: 'birds', opts: [
          { t: '2개', why: 'oriole 2행만 센 거예요. owl 3행도 TRUE예요.' },
          { t: '5개', ok: true, why: 'owl 3행 + oriole 2행. 나중에 배우는 `filter(birds, bird %in% c("oriole", "owl"))`(O단원)는 바로 이 TRUE인 5행만 남겨요.' },
          { t: '8개', why: 'crow 3행은 목록에 없어서 FALSE예요.' },
        ] },
      ],
    },
    {
      id: 'b-dollar',
      title: '$: 데이터에서 열 하나 꺼내기',
      src: 'wk4_dplyr.R 28–29행 `n_distinct(birds$bird)`',
      key: '`데이터$열이름` → 그 열의 값들(벡터). 단, ggplot의 aes()나 dplyr 함수 안에서는 `$` 없이 **열 이름만** 쓴다.',
      setup: 'birds',
      body: [
        { code: `birds$bird
birds$inches` },
        { note: 'Python과 비교', kind: 'py', t: 'pandas의 `df["bird"]` 또는 `df.bird`에 해당해요 (R에서 점은 이름의 일부라서 `$`를 써요).' },
        '`$` 뒤의 이름이 틀리면 tibble은 에러 대신 **경고 + NULL**을 줘요. 조용히 틀리기 쉬운 곳이에요:',
        { code: `mpg$Hwy` },
        'ggplot·dplyr 안에서는 데이터를 이미 알려 줬기 때문에 `$`가 필요 없어요: `aes(x = displ)`, `filter(birds, inches > 11.5)`. `aes(x = mpg$displ)`처럼 써도 그려지긴 하지만 facet이나 filter와 섞이면 행이 어긋나는 문제가 생겨요.',
      ],
      quiz: [
        { type: 'predict', q: '아래 birds 데이터에서 결과는?', data: 'birds', code: `birds$is.sparrow`, opts: [
          { t: '`[1] FALSE FALSE FALSE  TRUE  TRUE  TRUE  TRUE  TRUE`', ok: true, why: 'owl 3마리는 FALSE, 나머지 5마리는 TRUE.' },
          { t: '`[1] FALSE TRUE`', why: '중복을 없애는 건 unique()예요. $는 값을 전부 꺼내요.' },
          { t: '에러: 점이 들어간 이름', why: '`is.sparrow`는 정상적인 열 이름이에요.' },
        ] },
        { type: 'mcq', q: '`ggplot(mpg, aes(x = displ, y = hwy))`에서 `mpg$displ`이라고 안 써도 되는 이유는?', opts: [
          { t: 'ggplot()에 이미 데이터(mpg)를 줬고, aes()는 그 데이터 안에서 열 이름을 찾기 때문', ok: true, why: '이게 tidyverse의 핵심 편의예요.' },
          { t: 'displ이 전역 변수라서', why: '콘솔에서 `displ`만 치면 없다고 나와요. 데이터 안의 열일 뿐이에요.' },
          { t: '$는 R에 없는 기호라서', why: '$는 R 기본 문법이에요 (birds$bird).' },
        ] },
        { type: 'predict', q: '대문자 오타를 내면?', code: `mpg$Hwy`, opts: [
          { t: '에러로 멈춘다', why: 'tibble은 경고만 하고 NULL을 돌려줘요.' },
          { t: '`NULL`과 경고 `Unknown or uninitialised column`', ok: true, why: '조용히 틀리니 조심해야 해요.' },
          { t: 'hwy 값이 나온다', why: '대소문자를 구분해요.' },
        ] },
      ],
    },
    {
      id: 'b-unique',
      title: 'unique(), length(), n_distinct()',
      src: 'wk4_dplyr.R 28–30행',
      key: '`unique(x)`: 중복 없앤 값들. `length(x)`: 원소 개수. `n_distinct(x)` = `length(unique(x))`: 서로 다른 값의 개수.',
      setup: 'birds',
      body: [
        { code: `unique(birds$bird)
length(unique(birds$bird))
n_distinct(birds$bird)` },
        '수업 주석: `n_distinct`는 "잘 안 씀", `length(unique())`가 "더 많이 사용". 결과는 같아요. 안쪽부터 읽으세요: `unique()`로 3개 남기고 → `length()`로 세기.',
      ],
      quiz: [
        { type: 'predict', q: '아래 birds 데이터에서 결과는?', data: 'birds', code: `length(birds$bird)`, opts: [
          { t: '`[1] 3`', why: 'unique 없이 세면 전체 원소 수예요.' },
          { t: '`[1] 8`', ok: true, why: 'birds는 8행이에요.' },
        ] },
        { type: 'predict', q: '아래 birds 데이터에서 결과는?', data: 'birds', code: `unique(birds$color)`, opts: [
          { t: '`[1] "orange" "black"`', ok: true, why: '처음 나온 순서대로 한 번씩.' },
          { t: '`[1] "black" "orange"`', why: 'unique는 정렬하지 않아요 — 등장 순서예요.' },
          { t: '`[1] 2`', why: '개수는 length(unique())예요.' },
        ] },
        { type: 'mcq', q: 'sibimit 데이터의 **참가자 수**를 세는 코드는?', setup: 'sibimit', opts: [
          { t: '`length(sibimit$Subject)`', why: '이건 전체 행 수(3,223)예요.' },
          { t: '`length(unique(sibimit$Subject))`', ok: true, why: '서로 다른 참가자 ID의 개수.' },
          { t: '`unique(length(sibimit$Subject))`', why: '순서가 거꾸로예요: 3223 하나에 unique를 해 봐야 3223.' },
        ] },
      ],
    },
    {
      id: 'b-index',
      title: '[행, 열]: 위치로 꺼내기',
      src: 'wk4_dplyr.R 206–208행 `birds[ ,1] == birds[ ,3]  ## [row,column]`',
      key: '`데이터[행, 열]`. 한쪽을 비우면 "전부". 번호는 **1부터** 센다.',
      setup: 'birds',
      body: [
        { code: `birds[ , 1]
birds[1, ]
birds[2, 3]` },
        '- `birds[ , 1]`: 모든 행, 1번째 열 → bird 열\n- `birds[1, ]`: 1번째 행, 모든 열\n- `birds[2, 3]`: 2번째 행의 3번째 열(inches) → 25',
        'tibble에 `[ , 1]`을 쓰면 벡터가 아니라 **1열짜리 tibble**이 나와요 (`birds$bird`는 벡터). 이 차이 때문에 wk4 206행의 결과가 특이하게 보여요 (Q단원에서 해부).',
        { note: 'Python과 비교', kind: 'py', t: 'pandas `df.iloc[0, :]` ↔ R `birds[1, ]`. 번호가 하나씩 밀려요 (R은 1부터).' },
      ],
      quiz: [
        { type: 'mcq', q: '아래 birds 데이터에서 `birds[ , 3]`은 어느 열?', data: 'birds', opts: [
          { t: 'color', why: 'color는 2번째 열.' },
          { t: 'inches', ok: true, why: 'bird(1), color(2), inches(3), is.sparrow(4).' },
          { t: 'is.sparrow', why: '4번째 열이에요.' },
        ] },
        { type: 'predict', q: '아래 birds 데이터에서 결과로 나오는 값은?', data: 'birds', code: `birds[4, 1]`, opts: [
          { t: 'owl', why: '1–3행이 owl이에요.' },
          { t: 'crow', ok: true, why: '4번째 행(첫 crow)의 bird 열.' },
          { t: 'orange', why: '1번째 열은 bird예요.' },
        ] },
      ],
    },
    {
      id: 'b-math',
      title: 'sqrt(), mean() — 그리고 글자에 mean을 쓰면',
      src: 'wk4 `sqrt(inches)`, `mean(inches)`, `mean(cty)`; wk3 `mean(COGm)`',
      key: '`sqrt()`는 원소마다 제곱근, `mean()`은 벡터 전체의 평균(값 하나). 둘 다 숫자에만 쓴다.',
      setup: 'birds',
      body: [
        { code: `sqrt(c(4, 9, 16))
mean(birds$inches)` },
        'mean은 벡터 → 숫자 **하나**로 줄이는 함수라서 summarise()(요약) 안에서 주로 써요. sqrt는 길이가 그대로라서 mutate()(열 추가) 안에서 써요. 이 구분이 R단원에서 중요해져요.',
        '글자 열에 mean을 쓰면 에러가 아니라 **경고 + NA**예요:',
        { code: `mean(birds$bird)` },
      ],
      quiz: [
        { type: 'predict', q: '결과는?', code: `mean(c(7, 8, 8.5))`, opts: [
          { t: '`[1] 7.833333`', ok: true, why: '(7 + 8 + 8.5) / 3 = 23.5 / 3.' },
          { t: '`[1] 8`', why: '그건 중앙값(median)이에요.' },
          { t: '`[1] 7 8 8.5`', why: 'mean은 값 하나로 줄여요.' },
        ] },
        { type: 'mcq', q: '다음 중 **입력과 같은 길이**의 결과를 내는 함수는?', opts: [
          { t: '`mean()`', why: '하나로 줄여요.' },
          { t: '`sqrt()`', ok: true, why: '원소마다 계산하니 길이가 그대로예요.' },
          { t: '`length()`', why: '숫자 하나(개수)를 내요.' },
        ] },
        { type: 'mcq', q: '`mean(birds$bird)`의 결과는?', opts: [
          { t: '에러로 멈춘다', why: '멈추지 않아요 — 그래서 더 위험해요.' },
          { t: 'NA와 경고 "argument is not numeric or logical"', ok: true, why: '글자에는 평균이 없어요.' },
          { t: '가장 많이 나온 새 이름', why: '그런 기능은 없어요.' },
        ] },
      ],
    },
    {
      id: 'b-quotes',
      title: '따옴표가 있으면 값, 없으면 이름',
      src: '수업 전체 — `bird == "owl"`, `aes(color = "blue")` 문제(wk2 49–51행)의 뿌리',
      key: '`"owl"`은 **글자 값**, `owl`은 **이름**(객체나 열을 찾으라는 뜻). aes()·filter() 버그의 대부분이 이 차이에서 나온다.',
      setup: 'birds',
      body: [
        { table: { head: ['쓴 것', 'R이 하는 일'], rows: [
          ['`bird`', '"bird라는 이름의 열/객체를 찾아서 그 값을 써라"'],
          ['`"bird"`', '"b, i, r, d 네 글자로 된 값"'],
          ['`bird == "owl"`', 'bird 열의 값이 owl이라는 글자와 같은가?'],
          ['`bird == owl`', 'bird 열 == owl이라는 **이름의 객체** → 없으면 에러'],
        ] } },
        { code: `filter(birds, bird == owl)`, expect: 'error' },
        'ggplot에서는 에러 없이 **엉뚱한 그림**이 나와서 더 헷갈려요. 따옴표로 감싼 `"displ"`은 열이 아니라 모든 행에서 똑같은 글자 하나예요:',
        { compare: [
          { label: '`x = displ` (열)', code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point()` },
          { label: '`x = "displ"` (글자 하나)', code: `ggplot(mpg, aes(x = "displ", y = hwy)) +
  geom_point()` },
        ] },
        '오른쪽 그림은 x축에 "displ"이라는 범주 하나만 있고, 234개 점이 한 줄로 쌓였어요. wk3 폴더의 `practice.R` 9행 `aes(x="Target vowel duration (ms)", …)`이 바로 이 상황이에요 (축 **제목**을 쓰고 싶었다면 labs()에 써야 해요, L단원).',
      ],
      quiz: [
        { type: 'predict', q: '결과는?', code: `filter(birds, color == black)`, expect: 'error', opts: [
          { t: 'black인 5행', why: '따옴표가 없으면 black이라는 **객체**를 찾아요.' },
          { t: '`object \'black\' not found` 에러', ok: true, why: '`color == "black"`으로 고쳐요.' },
          { t: '0행', why: '값 비교까지 가지도 못하고 에러가 나요.' },
        ] },
        { type: 'pick', q: '`ggplot(mpg, aes(x = class, y = "hwy")) + geom_point()`의 결과는?', opts: [
          { code: `ggplot(mpg, aes(x = class, y = "hwy")) +
  geom_point()`, ok: true, why: 'y가 "hwy"라는 글자 하나라서 모든 점이 같은 높이의 한 줄에 놓여요.' },
          { code: `ggplot(mpg, aes(x = class, y = hwy)) +
  geom_point()`, why: '이건 따옴표 없는 진짜 hwy 열이에요.' },
          { code: `ggplot(mpg, aes(x = "class", y = hwy)) +
  geom_point()`, why: '이건 x 쪽에 따옴표를 쓴 경우예요.' },
        ] },
        { type: 'mcq', q: '축 제목을 "Target vowel duration (ms)"로 하고 싶어서 `aes(x = "Target vowel duration (ms)")`라고 썼어요. 무엇이 문제일까요?', opts: [
          { t: '괜찮다. x축 제목이 바뀐다', why: 'aes()는 데이터를 연결하는 곳이지 제목을 쓰는 곳이 아니에요.' },
          { t: 'x축이 그 글자 하나짜리 범주가 되어 데이터가 한 곳에 몰린다', ok: true, why: 'aes에는 열 이름(따옴표 없이)을, 제목은 `labs(x = "…")`에.' },
          { t: '괄호가 들어 있어서 에러가 난다', why: '문자열 안의 괄호는 문제없어요.' },
        ] },
      ],
    },
    {
      id: 'b-quotetypes',
      title: '"…" 와 \'…\' 는 같다 — 짝만 맞으면',
      src: '수업 코드는 주로 `"…"`, R 출력은 항상 `"…"`로 보여 준다',
      key: '큰따옴표와 작은따옴표 모두 문자열. 시작한 따옴표와 **같은 종류**로 닫아야 한다.',
      body: [
        { code: `"blue" == 'blue'` },
        '짝이 안 맞으면 문자열이 끝나지 않아 R이 다음 줄을 기다리거나 에러를 내요:',
        { code: `color <- "blue'`, expect: 'error' },
        '`INCOMPLETE_STRING`은 "문자열이 안 닫혔다"는 뜻이에요. 한글 입력 상태의 둥근 따옴표(“ ”)는 아예 다른 글자라서 `unexpected input`이 나요.',
      ],
      quiz: [
        { type: 'mcq', q: "`geom_point(color = 'blue')`와 `geom_point(color = \"blue\")`의 차이는?", opts: [
          { t: '없다', ok: true, why: '둘 다 같은 문자열 "blue".' },
          { t: '작은따옴표는 열 이름을 뜻한다', why: 'R에서 열 이름에 쓰는 특수 기호는 백틱(`)이에요. 작은따옴표는 그냥 문자열.' },
          { t: '작은따옴표는 에러', why: '둘 다 문자열이에요.' },
        ] },
        { type: 'mcq', q: '`labs(title = “My plot”)`(둥근 따옴표)을 실행하면?', opts: [
          { t: '제목이 My plot이 된다', why: '둥근 따옴표는 R이 모르는 글자예요.' },
          { t: '`unexpected input` 에러', ok: true, why: '영문 입력 상태에서 곧은 따옴표 `"`를 쓰세요.' },
        ] },
      ],
    },
    {
      id: 'b-lines',
      title: '여러 줄 코드: 어디서 줄을 바꿔도 되나',
      src: 'wk2 ggplot 코드들, wk4 파이프 코드들',
      key: 'R은 **괄호가 아직 열려 있거나**, 줄이 **`+`, `%>%`, 쉼표 같은 연산자로 끝나면** 다음 줄까지 이어서 읽는다. 그 외에는 줄 끝 = 명령 끝.',
      body: [
        { table: { head: ['줄 끝 모양', 'R의 판단'], rows: [
          ['`ggplot(mpg, aes(x = displ,`', '괄호가 열려 있음 → 다음 줄 계속'],
          ['`ggplot(mpg, aes(x = displ, y = hwy)) +`', '`+`로 끝남 → 다음 줄 계속'],
          ['`birds %>%`', '`%>%`로 끝남 → 다음 줄 계속'],
          ['`ggplot(mpg, aes(x = displ, y = hwy))`', '완결된 식 → **여기서 끝**'],
        ] } },
        '그래서 `+`와 `%>%`는 **줄 끝**에 두어요. 줄 맨 앞에 두면 윗줄은 이미 끝난 명령이 돼요 (D단원에서 실제 에러 확인). 반대로 **마지막 줄**이 `+`로 끝나면 R은 영원히 다음 줄을 기다려요:',
        { code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +`, expect: 'error' },
        'RStudio 콘솔에서는 이 상태가 에러 대신 `+` 프롬프트로 나타나요. 다음에 실행하는 코드가 엉뚱하게 이어 붙으니, 그럴 땐 콘솔을 클릭하고 **Esc**.',
      ],
      quiz: [
        { type: 'mcq', q: '올바르게 이어지는 것은?', opts: [
          { t: '`ggplot(mpg, aes(x = displ, y = hwy))`\n`  + geom_point()`', why: '윗줄이 완결돼서 끝나요. 아랫줄은 따로 된 명령.' },
          { t: '`ggplot(mpg, aes(x = displ,`\n`                y = hwy)) +`\n`  geom_point()`', ok: true, why: '괄호가 열린 채 줄이 바뀌고, `+`가 줄 끝에 있어요.' },
          { t: '`birds`\n`  %>% filter(inches > 11.5)`', why: '윗줄 `birds`만으로 완결된 명령이에요 (birds를 출력하고 끝). %>%는 줄 끝에.' },
        ] },
        { type: 'predict', q: '마지막 줄이 `+`로 끝난 채 실행하면? (이 도구 기준)', code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +`, expect: 'error', opts: [
          { t: '그림이 그려진다', why: 'R은 `+` 뒤에 올 층을 기다려요.' },
          { t: '`unexpected end of input` 에러', ok: true, why: '코드가 중간에 끊겼다는 뜻. RStudio 콘솔에서는 `+` 프롬프트로 기다려요.' },
        ] },
        { type: 'order', q: '줄 순서를 맞춰 올바른 ggplot 코드를 만드세요.', lines: ['ggplot(data = mpg,', '       mapping = aes(x = displ, y = hwy)) +', '  geom_point() +', '  geom_smooth()'], why: '괄호가 열린 줄 → 닫고 `+` → 층 → 마지막 층은 `+` 없이.' },
      ],
    },
  ],
});
