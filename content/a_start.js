/* 단원 A: RStudio와 스크립트 */
RS.units.push({
  id: 'a',
  title: '시작: RStudio, 패키지, 주석',
  short: '스크립트 vs 콘솔, install vs library, # 주석, \'\'\' 함정, ? 도움말',
  desc: 'wk2 R intro 슬라이드와 wk3 "Things you should be able to do in R by now"의 첫 두 줄: **패키지를 설치하고 불러오기**, **스크립트에서 콘솔로 코드 보내기**.',
  lessons: [
    {
      id: 'a-script',
      title: '스크립트와 콘솔',
      src: 'wk3_Rproject.pdf — "Create a script in RStudio and send lines of code from script to console"',
      key: '스크립트(.R 파일)는 코드를 **적어 두는 곳**, 콘솔은 코드를 **실행하는 곳**. `Ctrl+Enter`가 스크립트의 코드를 콘솔로 보낸다.',
      body: [
        'RStudio 화면은 보통 네 칸이에요.',
        { table: { head: ['칸', '하는 일'], rows: [
          ['Source (왼쪽 위)', '`.R` 스크립트 파일. 수업 파일(`wk2_ggplot_intro.R` 등)을 여는 곳'],
          ['Console (왼쪽 아래)', '`>` 프롬프트. 여기로 들어온 코드만 **실제로 실행**돼요'],
          ['Environment (오른쪽 위)', '지금 만들어 둔 객체 목록 (`sibimit`, `birds` …)'],
          ['Plots / Files / Help (오른쪽 아래)', '그림, 파일 목록, 도움말'],
        ] } },
        '스크립트에 코드를 **적기만 해서는** 아무 일도 안 일어나요. 커서를 그 줄에 두고 `Ctrl+Enter`(맥은 `Cmd+Enter`)를 눌러야 콘솔로 보내져 실행돼요.',
        { table: { head: ['단축키', '동작'], rows: [
          ['`Ctrl+Enter`', '커서가 있는 **명령 하나**(여러 줄에 걸친 ggplot이면 그 전체) 또는 선택한 부분 실행'],
          ['`Ctrl+Shift+Enter`', '스크립트 **전체** 실행'],
          ['`Ctrl+Shift+C`', '선택한 줄들을 주석 처리/해제 (`#` 붙이기)'],
          ['`Ctrl+Shift+M`', '`%>%` 입력 (wk4)'],
          ['`Alt+-`', '` <- ` 입력'],
        ] } },
        { note: 'Python과 비교', kind: 'py', t: '`.py` 파일에 적어 둔 코드 vs 파이썬 REPL(`>>>`)의 관계와 같아요. Jupyter의 "셀 실행"과 비슷하게, RStudio는 한 명령씩 콘솔로 보내요. 그래서 **위에서부터 순서대로** 실행하지 않으면 "아직 없는 객체"를 쓰게 되는 일이 자주 생겨요.' },
        { note: '이 도구에서는', kind: 'tip', t: '오른쪽 위 **연습장**이 콘솔 역할이에요. 여기서도 `Ctrl+Enter`로 실행하고, 일부를 선택하고 누르면 그 부분만 실행돼요.' },
      ],
      quiz: [
        { type: 'mcq', q: '스크립트에 `x <- 4`라고 적고 **저장만** 했어요. 그다음 콘솔에 `x`를 치면?',
          opts: [
            { t: '`[1] 4`가 나온다', why: '저장은 파일에 글자를 남길 뿐이에요. 콘솔로 보내 실행하지 않았으니 R은 x를 몰라요.' },
            { t: '`Error: object \'x\' not found`', ok: true, why: '맞아요. `Ctrl+Enter`로 그 줄을 실행해야 x가 만들어져요.' },
            { t: '아무것도 안 나온다', why: '없는 이름을 부르면 R은 조용히 넘어가지 않고 에러를 내요.' },
          ] },
        { type: 'mcq', q: '아래처럼 세 줄짜리 ggplot 코드의 **두 번째 줄**에 커서를 두고 `Ctrl+Enter`를 누르면?', code: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy)) +
  facet_wrap(~ class, nrow = 2)`, run: false,
          opts: [
            { t: '두 번째 줄만 실행되어 에러가 난다', why: 'RStudio는 커서가 **명령의 중간**에 있으면 그 명령 전체를 찾아서 보내요.' },
            { t: '세 줄 전체(명령 하나)가 실행된다', ok: true, why: '`+`로 이어진 세 줄은 R 입장에서 **하나의 명령**이에요. RStudio가 그 범위를 알아서 보내요.' },
            { t: '스크립트 전체가 실행된다', why: '전체 실행은 `Ctrl+Shift+Enter`예요.' },
          ] },
        { type: 'tf', q: '콘솔에 직접 친 코드도 스크립트처럼 파일로 남으니, 과제 코드는 콘솔에서만 작업해도 된다.', ans: false,
          why: '콘솔 코드는 History에만 잠시 남아요. 다시 실행할 수 있는 분석(재현성)을 위해 코드는 **스크립트에** 적고 거기서 실행하세요.' },
      ],
    },
    {
      id: 'a-packages',
      title: 'install.packages()와 library()',
      src: 'wk2_R intro.pdf — R packages 슬라이드',
      key: '설치는 컴퓨터에 **딱 한 번** (`install.packages("tidyverse")`, 따옴표 필수). 불러오기는 **R을 켤 때마다** (`library(tidyverse)`, 스크립트 맨 위).',
      body: [
        '슬라이드의 두 문장을 정확히 구분해야 해요.',
        { table: { head: ['', '`install.packages("tidyverse")`', '`library(tidyverse)`'], rows: [
          ['언제', '처음 한 번 (또는 업데이트할 때)', 'R/RStudio를 **새로 켤 때마다**'],
          ['어디서', '콘솔 (스크립트에 남겨 두면 매번 다시 설치됨)', '**모든 스크립트 맨 위**'],
          ['따옴표', '필수: `"tidyverse"`', '없어도 됨 (있어도 됨)'],
          ['하는 일', '인터넷에서 내려받아 컴퓨터에 저장', '저장된 패키지를 **이번 세션에** 꺼내 놓기'],
        ] } },
        { code: `install.packages("tidyverse")   # 콘솔에서 한 번
library(tidyverse)              # 스크립트 맨 위, 매번`, run: false },
        { note: 'Python과 비교', kind: 'py', t: '`pip install pandas`(한 번) ↔ `install.packages("tidyverse")`, `import pandas`(매번) ↔ `library(tidyverse)`. 다른 점: R은 `library()` 한 번으로 패키지의 함수들을 **이름 그대로** 쓸 수 있어요 (`pd.` 같은 접두어 없이 `ggplot()`).' },
        'R을 새로 켜고 `library(tidyverse)`를 잊으면 가장 흔한 에러가 나요: `Error in ggplot(...) : could not find function "ggplot"`. 설치는 되어 있지만 **꺼내 놓지 않은** 상태예요.',
      ],
      quiz: [
        { type: 'mcq', q: '어제 tidyverse를 설치했어요. 오늘 RStudio를 새로 켜고 바로 `ggplot(mpg) + geom_point(aes(displ, hwy))`를 실행했더니 `could not find function "ggplot"`. 무엇을 해야 할까요?',
          opts: [
            { t: '`install.packages("tidyverse")`를 다시 한다', why: '이미 설치되어 있어요. 다시 설치해도 되긴 하지만 시간 낭비이고, 여전히 `library()`를 해야 해요.' },
            { t: '`library(tidyverse)`를 먼저 실행한다', ok: true, why: '맞아요. 새 세션마다 꺼내 놓아야 해요.' },
            { t: '`ggplot`을 `Ggplot`으로 고친다', why: 'R은 대소문자를 구분해요. 함수 이름은 `ggplot`이 맞아요.' },
          ] },
        { type: 'fill', q: '설치 명령을 완성하세요.', code: 'install.packages(▢)', ans: [['"tidyverse"']],
          why: '`install.packages()`에는 패키지 이름을 **글자(문자열)**로 줘야 해요. 따옴표가 없으면 R은 `tidyverse`라는 **객체**를 찾다가 `object \'tidyverse\' not found`를 내요.',
          hint: '패키지 이름을 문자열로 — 따옴표를 붙여서요.' },
        { type: 'mcq', q: '다음 중 **에러가 나는** 것은? (tidyverse는 설치되어 있음)',
          opts: [
            { t: '`library(tidyverse)`', why: 'library()는 따옴표 없이도 이름을 받아요.' },
            { t: '`library("tidyverse")`', why: '따옴표가 있어도 괜찮아요.' },
            { t: '`install.packages(tidyverse)`', ok: true, why: '맞아요. 따옴표가 없어서 `tidyverse`라는 객체를 찾다가 에러가 나요.' },
          ] },
      ],
    },
    {
      id: 'a-tidyverse',
      title: 'tidyverse는 패키지 묶음',
      src: 'wk2_R intro.pdf — "Tidyverse, from tidyverse.org · Collection of packages"',
      key: '`library(tidyverse)` 한 줄이 ggplot2(그림), dplyr(데이터 다루기), readr(파일 읽기), tibble(표) 등 여러 패키지를 한꺼번에 불러온다.',
      body: [
        '`library(tidyverse)`를 실행하면 콘솔에 대략 이런 안내가 떠요 (에러 아님):',
        { code: `── Attaching core tidyverse packages ─────────── tidyverse 2.0.0 ──
✔ dplyr     1.2.1     ✔ readr     2.2.0
✔ forcats   1.0.1     ✔ stringr   1.6.0
✔ ggplot2   4.0.3     ✔ tibble    3.3.1
✔ lubridate 1.9.5     ✔ tidyr     1.3.2
✔ purrr     1.2.2
── Conflicts ──────────────────────────── tidyverse_conflicts() ──
✖ dplyr::filter() masks stats::filter()
✖ dplyr::lag()    masks stats::lag()`, run: false, cap: 'library(tidyverse) 실행 시 콘솔 메시지 (예시)' },
        { table: { head: ['패키지', '이 수업에서 쓰는 함수', '주차'], rows: [
          ['ggplot2', '`ggplot()`, `aes()`, `geom_point()`, `facet_wrap()`, `labs()`, `theme_bw()` …', 'wk2–3'],
          ['readr', '`read_csv()`', 'wk3'],
          ['dplyr', '`select()`, `filter()`, `mutate()`, `summarise()`, `group_by()`, `arrange()`, `%>%`', 'wk4'],
          ['tibble', '`tibble()`, `view()` (데이터 표의 형식)', 'wk4'],
        ] } },
        '**Conflicts** 줄의 뜻: `filter`라는 이름의 함수가 원래 R(stats 패키지)에도 있는데, 이제부터 `filter()`라고 쓰면 **dplyr의 filter**가 쓰인다는 안내예요. 특정 패키지의 함수를 콕 집어 부를 땐 `패키지::함수` (예: `dplyr::filter()`)라고 써요.',
      ],
      quiz: [
        { type: 'mcq', q: '`geom_point()`는 어느 패키지의 함수일까요?', opts: [
          { t: 'dplyr', why: 'dplyr는 데이터 조작(select, filter …)이에요.' },
          { t: 'ggplot2', ok: true, why: '`geom_`으로 시작하는 함수는 모두 ggplot2예요.' },
          { t: 'readr', why: 'readr는 파일 읽기(read_csv)예요.' },
        ] },
        { type: 'mcq', q: '`✖ dplyr::filter() masks stats::filter()`의 뜻은?', opts: [
          { t: 'filter()가 망가져서 쓸 수 없다', why: '에러가 아니라 안내예요.' },
          { t: '앞으로 `filter()`라고 쓰면 dplyr 버전이 쓰인다', ok: true, why: '같은 이름이 두 개면 나중에 불러온 것이 앞을 "가려요(mask)". wk4의 `filter(birds, ...)`가 바로 dplyr 버전이에요.' },
          { t: 'stats 패키지를 지워야 한다', why: '지울 필요 없어요. `stats::filter()`로 여전히 부를 수 있어요.' },
        ] },
        { type: 'mcq', q: 'wk3에서 CSV 파일을 읽을 때 쓴 `read_csv()`는 어느 패키지?', opts: [
          { t: 'readr', ok: true, why: '맞아요. tidyverse의 readr. (R 기본 함수는 점이 들어간 `read.csv()` — M단원에서 비교해요.)' },
          { t: 'ggplot2', why: 'ggplot2는 그림만 그려요.' },
          { t: 'R 기본(base)', why: 'R 기본 함수는 `read.csv()`(점)예요. `read_csv()`(밑줄)는 readr.' },
        ] },
      ],
    },
    {
      id: 'a-comment',
      title: '# 주석: 한 줄씩 끄고 켜기',
      src: 'wk3_Rproject.R 39–42행, wk3_ggplot_practice.R 12–24행',
      key: '`#` 뒤의 글자는 R이 읽지 않는다. 코드 줄 앞에 `#`을 붙이면 그 줄을 **꺼 둘** 수 있다.',
      body: [
        '주석은 두 가지로 쓰여요: (1) 설명 메모, (2) 코드 한 줄을 **잠시 끄기**.',
        { code: `3 + 4    # 이 부분은 메모. R은 3 + 4만 계산
# 10 + 10  이 줄은 통째로 꺼져 있음`, cap: '주석이 섞인 코드' },
        'wk3 수업 코드에는 파이프라인 중간 한 줄이 꺼져 있어요:',
        { code: `sibimit_means <- sibimit %>%
  #filter(Gender == "F") %>%
  group_by(Subject, Gender, Place, Task, MergerStatus) %>%
  summarise(COGm = mean(COGm))`, run: false },
        '둘째 줄이 통째로 주석이라, R에게는 `sibimit %>% group_by(...) %>% summarise(...)`로 보여요. 첫 줄 끝의 `%>%`가 주석 줄을 건너뛰어 셋째 줄과 이어지죠. `#`을 지우면 **여성(F) 참가자만** 남긴 뒤 요약하게 돼요.',
        { note: '켜고 끌 때 주의', kind: 'warn', t: 'ggplot에서 줄을 켤 때는 `+`도 챙겨야 해요. wk3_ggplot_practice.R 12–14행은 이래요:\n\n`ggplot(mpg, aes(x=class, y=hwy, fill=class)) +`\n`  geom_violin()`\n`  # theme(legend.position="none")`\n\n세 번째 줄의 `#`만 지우면, `geom_violin()` 뒤에 `+`가 없어서 `theme(...)`은 **따로 떨어진 명령**이 돼요 (그림엔 반영 안 됨). `geom_violin() +`로 고쳐야 해요.' },
      ],
      quiz: [
        { type: 'predict', q: '이 코드를 실행하면 콘솔에 무엇이 나올까요?', code: `3 + 4    # 더하기
# 10 + 10
5 * 2`, opts: [
          { t: '`[1] 7`과 `[1] 10`', ok: true, why: '주석 줄(`# 10 + 10`)은 실행되지 않아요.' },
          { t: '`[1] 7`, `[1] 20`, `[1] 10`', why: '`#`로 시작하는 줄은 R이 무시해요.' },
          { t: '에러: 한글 주석은 쓸 수 없다', why: '주석에는 한글도 괜찮아요.' },
        ] },
        { type: 'mcq', q: '위 sibimit_means 코드에서 `#filter(Gender == "F") %>%` 줄의 `#`을 지우고 실행하면?', opts: [
          { t: '결과가 똑같다', why: '이제 filter가 실제로 실행돼요.' },
          { t: 'Gender가 "F"인 행만 남긴 뒤 요약한다', ok: true, why: '맞아요. filter는 조건에 맞는 행만 남겨요 (O단원).' },
          { t: '에러가 난다 (%>%가 두 번 연속이라서)', why: '각 줄 끝에 `%>%`가 하나씩 있어서 정상적으로 이어져요.' },
        ] },
        { type: 'mcq', q: 'wk3_ggplot_practice.R 21–24행을 보세요. `theme_bw()`까지 켜서 흰 배경을 쓰려면 무엇을 해야 할까요?', code: `ggplot(mpg, aes(x=class, y=hwy, fill=class)) +
  geom_violin(alpha = 0.5) +
  geom_point(aes(color = class), position="jitter") +
  labs(x = "class", y = "highway miles", title = "A Violin with individual datapoints")
  #theme_bw() +
  #theme(legend.position="none") +
  #xlab("")`, run: false, opts: [
          { t: '`#theme_bw() +` 줄의 `#`만 지운다', why: '`labs(...)` 줄 끝에 `+`가 없어서, theme_bw()는 그림과 이어지지 않은 **따로 된 명령**이 돼요. 게다가 `theme_bw() +`로 끝나 다음 줄을 기다리게 돼요.' },
          { t: '`labs(...)` 줄 끝에 `+`를 붙이고, `#theme_bw()` 줄의 `#`을 지우고, 그 줄 끝의 `+`는 없앤다', ok: true, why: '맞아요. 이어질 줄의 **앞 줄 끝**에 `+`, **마지막 줄**에는 `+`가 없어야 해요.' },
          { t: '세 줄의 `#`을 모두 지우기만 하면 된다', why: '그래도 `labs(...)` 뒤에 `+`가 없어서 세 줄이 그림과 끊겨요.' },
        ] },
      ],
    },
    {
      id: 'a-triple',
      title: "''' 는 주석이 아니다 (Python 습관 주의)",
      src: 'wk2_ggplot_ExerciseKey.R 14–20행, wk4_dplyr.R 50–63행',
      key: "R에는 여러 줄 주석이 없다. 수업 파일의 `'''`로 감싼 부분은 **실행하면 에러**가 난다 — 읽기용 메모로만 두었다고 보면 된다.",
      body: [
        "Python에서는 `'''...'''`가 여러 줄 문자열(사실상 주석)이지만, R에서 `'''`는 \"빈 문자열 `''` + 새 문자열 시작 `'`\"로 읽혀요. 그래서 이 덩어리를 통째로 실행하면:",
        { code: `'''
ggplot(data= mpg, mapping = aes(x = displ, y = hwy)) +
  geom_point(size = 3)
'''`, expect: 'error', cap: 'wk2_ggplot_ExerciseKey.R 14–20행과 같은 형태' },
        "`unexpected string constant`: 문자열 뒤에 또 문자열이 붙어 있다는 뜻이에요. 줄 하나씩 `Ctrl+Enter`로 보내면 더 헷갈려요: 첫 줄의 `'''`가 닫히지 않은 문자열로 남아 콘솔이 `+` 프롬프트로 **다음 줄을 기다리게** 되거든요 (Esc로 빠져나와요).",
        { note: '안에 든 코드를 실행해 보고 싶다면', kind: 'tip', t: "`'''` 줄은 빼고 **그 안쪽 줄들만** 드래그해서 `Ctrl+Enter`. 여러 줄을 진짜 주석으로 만들고 싶으면 드래그 후 `Ctrl+Shift+C`(각 줄에 `#`)." },
      ],
      quiz: [
        { type: 'predict', q: "wk4_dplyr.R처럼 `'''`로 감싼 이 덩어리를 통째로 실행하면?", setup: 'birds', code: `'''
select(birds, -(color:is.sparrow))
select(birds, !(color:is.sparrow))
'''`, expect: 'error', opts: [
          { t: '아무 일도 없다 (주석이니까)', why: "R에서 `'''`는 주석이 아니에요." },
          { t: '두 select 결과가 출력된다', why: '두 줄은 문자열 속 글자로 취급되어 실행조차 안 돼요.' },
          { t: '`unexpected string constant` 에러', ok: true, why: "`''` 다음에 `'...'` 문자열이 바로 붙어서 문법 에러가 나요." },
        ] },
        { type: 'mcq', q: '여러 줄을 한꺼번에 주석으로 만드는 RStudio 단축키는?', opts: [
          { t: '`Ctrl+Shift+C`', ok: true, why: '선택한 모든 줄 앞에 `#`을 붙이고, 다시 누르면 떼요.' },
          { t: '`Ctrl+Shift+M`', why: '그건 `%>%` 입력이에요.' },
          { t: "줄 앞뒤에 `'''` 입력", why: 'R에는 이런 문법이 없어요.' },
        ] },
        { type: 'mcq', q: "wk4_dplyr.R 55행 `select(birds, color, -(color:is.sparrow))`을 직접 실행해 보고 싶어요 (50–63행은 `'''` 안에 있음). 가장 좋은 방법은?", opts: [
          { t: '50행부터 63행까지 전부 드래그해 실행', why: "`'''`가 포함되어 에러가 나요." },
          { t: '55행만 드래그(또는 커서를 두고) `Ctrl+Enter`', ok: true, why: '그 줄만 콘솔로 가니 정상 실행돼요 (먼저 `birds`를 만들어 둬야 해요).' },
          { t: "`'''`를 `\"\"\"`로 바꾼다", why: 'R에서는 큰따옴표 세 개도 똑같이 에러예요.' },
        ] },
      ],
    },
    {
      id: 'a-help',
      title: '? 도움말 읽기',
      src: 'wk2_ggplot_intro.R 8행 `?mpg`, 194행 `?geom_boxplot`',
      key: '`?이름` → Help 창에 설명서가 뜬다. 특히 **Usage**의 인자 순서와 기본값이 코드를 줄여 쓰는 근거다.',
      body: [
        '`?mpg`는 데이터 설명서(각 열의 뜻), `?geom_boxplot`은 함수 설명서예요. 함수 설명서의 구조:',
        { table: { head: ['부분', '읽는 법'], rows: [
          ['Description', '무엇을 하는 함수인가'],
          ['Usage', '인자들의 **순서**와 **기본값**'],
          ['Arguments', '각 인자의 뜻'],
          ['Examples', '복사해서 돌려 볼 수 있는 예'],
        ] } },
        '`?geom_point`의 Usage는 이렇게 시작해요:',
        { code: `geom_point(
  mapping = NULL,
  data = NULL,
  stat = "identity",
  position = "identity",
  ...,
  na.rm = FALSE,
  show.legend = NA,
  inherit.aes = TRUE
)`, run: false, cap: '?geom_point의 Usage (요약)' },
        '여기서 두 가지를 읽어낼 수 있어요.',
        '- **첫 번째 인자가 `mapping`** → `geom_point(aes(x = displ, y = hwy))`처럼 `mapping =`을 생략해도 aes()가 mapping 자리에 들어가요.\n- **`position = "identity"`가 기본값** → 아무 말 안 하면 점을 제자리에 찍어요. `position = "jitter"`(I단원)는 이 기본값을 바꾸는 거예요.',
        { note: '이 도구에서는', kind: 'tip', t: '웹 연습장에서는 `?`가 동작하지 않아요. RStudio 콘솔에서 쳐 보세요.' },
      ],
      quiz: [
        { type: 'mcq', q: '`geom_point`의 Usage에서 첫 번째 인자가 `mapping`이라는 사실이 의미하는 것은?', opts: [
          { t: '`geom_point(aes(x = displ, y = hwy))`는 `geom_point(mapping = aes(x = displ, y = hwy))`와 같다', ok: true, why: '인자 이름을 빼면 순서대로 채워져요 (B단원 "위치 인자").' },
          { t: 'geom_point에는 반드시 mapping을 줘야 한다', why: '기본값이 `NULL`이라 생략 가능해요 (ggplot()의 전역 mapping을 물려받음, H단원).' },
          { t: '`geom_point(mpg)`처럼 데이터를 첫 인자로 줄 수 있다', why: '첫 자리는 mapping이라, 데이터를 주면 "mapping must be created by aes()" 에러가 나요. `data = mpg`로 이름을 붙여야 해요.' },
        ] },
        { type: 'mcq', q: 'Usage의 `position = "identity"`는 무엇을 뜻할까요?', opts: [
          { t: 'position은 반드시 "identity"로 써야 한다', why: '다른 값("jitter" 등)도 줄 수 있어요.' },
          { t: '아무것도 안 쓰면 "identity"가 쓰인다 (기본값)', ok: true, why: '`인자 = 값` 꼴은 기본값이에요.' },
          { t: 'identity라는 함수를 불러야 한다', why: '따옴표 안의 글자 값일 뿐이에요.' },
        ] },
        { type: 'mcq', q: '`?mpg` 설명서에서 `hwy`는 무엇이라고 되어 있을까요?', opts: [
          { t: 'highway miles per gallon (고속도로 연비)', ok: true, why: '`cty`는 city miles per gallon(도시 연비)이에요.' },
          { t: 'height (차 높이)', why: 'mpg에는 높이 정보가 없어요.' },
          { t: 'horsepower (마력)', why: '마력은 mtcars 같은 다른 데이터에 있어요.' },
        ] },
      ],
    },
  ],
});
