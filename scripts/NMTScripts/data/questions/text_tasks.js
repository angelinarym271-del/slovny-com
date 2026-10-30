const T  = `<svg width="24" height="24" viewBox="0 0 24 24"><polygon points="4,22 20,22 16,2 8,2" fill="none" stroke="#111" stroke-width="2"/></svg>`;
const S  = `<svg width="24" height="24" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" fill="none" stroke="#111" stroke-width="2"/></svg>`;
const TR = `<svg width="24" height="24" viewBox="0 0 24 24"><polygon points="12,2 22,22 2,22" fill="none" stroke="#111" stroke-width="2"/></svg>`;
const C  = `<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="#111" stroke-width="2"/></svg>`;
const D  = `<svg width="24" height="24" viewBox="0 0 24 24"><polygon points="12,2 22,12 12,22 2,12" fill="none" stroke="#111" stroke-width="2"/></svg>`;

function row(...figs) {
  return `<span class="figures-row">${figs.join("")}</span>`;
}

export const textTasks = [
  // ── ТЕКСТ 1: Вишнівець ──────────────────────────────────────────────────────
  // {
  //   id: "text_001",
  //   type: "multi",
  //   category: "textTasks",

  //   passages: [
  //     { fig: T,  text: "Історичні джерела свідчать, що далекого 1395 року родоначальник династії князів Вишневецьких Дмитро Корибут на правому березі річки Горинь заклав <strong><u>замок</u></strong>, який витримав не одну облогу татар." },
  //     { fig: S,  text: "З появою нового замку <strong><u>Вишнівець</u></strong> на кілька століть став гніздом великого й славного, знакового в українській і польській історії, роду князів Вишневецьких." },
  //     { fig: TR, text: "Окрасою і перлиною давнього містечка Вишнівця, що розкинулося на берегах річки Горинь, є розкішний палац – <strong><u>пам'ятка</u></strong> архітектури національного значення." },
  //     { fig: C,  text: "Аби твердиня стала недоступною для ворогів, 1494 року, на стрімкій горі на лівобережжі річки <strong><u>Горинь</u></strong> він зводить нову оборонну споруду." },
  //     { fig: D,  text: "Та спустошення Вишнівця змусило князя Михайла Васильовича Вишневецького перенести замок і <strong><u>поселення</u></strong> в надійнішу місцевість." },
  //   ],

  //   tasks: [
  //     {
  //       id: "text_001_t1",
  //       type: "single",
  //       question: "Первинний текст буде відновлено, якщо речення розташувати в послідовності, запропонованій у рядку",
  //       answerType: "svg",
  //       answers: [
  //         row(C, TR, S, T, D),   // А
  //         row(C, D, TR, S, T),   // Б
  //         row(C, T, D, TR, S),   // В
  //         row(TR, C, D, T, S),   // Г
  //         row(C, T, D, S, TR),   // Д
  //       ],
  //       correct: 0
  //     },
  //     {
  //       id: "text_001_t2",
  //       type: "single",
  //       question: "Роль підмета виконує виділене в тексті слово",
  //       answers: ["замок", "Вишнівець", "пам'ятка", "Горинь", "поселення"],
  //       correct: 0
  //     },
  //     {
  //       id: "text_001_t3",
  //       type: "single",
  //       question: "Простими є обидва речення, позначені",
  //       answerType: "svg",
  //       answers: [
  //         row(T, S),    // А
  //         row(S, TR),   // Б
  //         row(TR, C),   // В
  //         row(C, D),    // Г
  //         row(T, TR),   // Д
  //       ],
  //       correct: 1
  //     },
  //     {
  //       id: "text_001_t4",
  //       type: "single",
  //       question: "Пунктуаційна помилка є в реченні, позначеному",
  //       answerType: "svg",
  //       answers: [
  //         row(T),   // А
  //         row(S),   // Б
  //         row(TR),  // В
  //         row(C),   // Г
  //         row(D),   // Д
  //       ],
  //       correct: 3
  //     },
  //     {
  //       id: "text_001_t5",
  //       type: "single",
  //       question: "Відокремлена прикладка є в реченні, позначеному",
  //       answerType: "svg",
  //       answers: [
  //         row(T),   // А
  //         row(S),   // Б
  //         row(TR),  // В
  //         row(C),   // Г
  //         row(D),   // Д
  //       ],
  //       correct: 2
  //     },
  //   ]
  // },

  // ── ТЕКСТ 1: Червона рута / Івасюк ──────────────────────────────────────────
  {
    id: "text_001",
    type: "multi",
    category: "textTasks",

    passages: [
      { fig: T,  text: "<strong><u>Написання</u></strong> пісень з глибоким змістом у молодому віці – це абсолютний феномен який трапляється в музиці раз на 100 років." },
      { fig: S,  text: "Утім, <strong><u>«Червона рута»</u></strong> є піснею досить простою, і в цій простоті її <strong><u>геніальність</u></strong>." },
      { fig: TR, text: "Дивовижно, що свою найвідомішу пісню, найбільший український хіт останніх 60-ти років, «Червону руту», <strong><u>Володимир Івасюк</u></strong> написав у 19 років." },
      { fig: C,  text: "Але як кількома роками пізніше можна було створити музику до таких глибоких пісень, як-от: «Над морем», «Лиш раз цвіте любов», «Літа пізніх жоржин»?" },
      { fig: D,  text: "Мабуть, у 19 років можна любити так, щоб написати такі <strong><u>слова</u></strong>." },
    ],

    tasks: [
      {
        id: "text_002_t1",
        type: "single",
        question: "Первісний текст буде відновлено, якщо речення розташувати в послідовності, запропонованій у рядку",
        answerType: "svg",
        answers: [
          // TODO: заповни варіанти А–Д
          row(TR, D, C, S, T),   // А
          row(TR, S, C, D, T),   // Б
          row(TR, C, D, T, S),   // В
          row(TR, D, S, C, T),   // Г
          row(TR, C, S, D, T),   // Д
        ],
        correct: 3
      },
      {
        id: "text_002_t2",
        type: "single",
        question: "Усі речення складні, <strong>ОКРІМ</strong>",
        answerType: "svg",
        answers: [
          row(T),   // А
          row(S),   // Б
          row(TR),  // В
          row(C),   // Г
          row(D),   // Д
        ],
        correct: 3
      },
      {
        id: "text_002_t3",
        type: "single",
        question: "Пунктуаційну помилку допущено в реченні, позначеному",
        answerType: "svg",
        answers: [
          row(T),   // А
          row(S),   // Б
          row(TR),  // В
          row(C),   // Г
          row(D),   // Д
        ],
        correct: 0
      },
      {
        id: "text_002_t4",
        type: "multi",
        question: "Вставними словами ускладнено речення, позначені",
        answerType: "svg",
        answers: [
          row(T, S), 
          row(S, TR), 
          row(TR, C), 
          row(S, D), 
          row(T, TR)
        ],
        correct: 3
      },
      {
        id: "text_002_t5",
        type: "single",
        question: "Роль підмета виконують усі виділені слова та словосполуки, <strong>ОКРІМ</strong>",
        answers: ["написання", "«Червона рута»", "геніальність", "Володимир Івасюк", "слова"],
        correct: 4  // TODO
      },
    ]
  },

  // ── ТЕКСТ 2: ІТ vs miltech ───────────────────────────────────────────────────
  {
    id: "text_002",
    type: "multi",
    category: "textTasks",

    passages: [
      { fig: T,  text: "Інженери рвуть <strong><u>жили</u></strong> на кількох проєктах водночас, але задач настільки багато, що в них можна просто загубитися." },
      { fig: S,  text: "Чим відрізняється <strong><u>робота</u></strong> у класичному ІТ від miltech?" },
      { fig: TR, text: "Наприклад в одній з miltech-компаній бувало, коли одночасно стартували вісім <strong><u>проєктів</u></strong>." },
      { fig: C,  text: "Тоді доводиться працювати «<strong><u>у режимі</u></strong> накладання турнікета», тобто все потрібно робити дуже швидко." },
      { fig: D,  text: "Якщо в «айтішці» доволі розмірений <strong><u>темп</u></strong>, то в miltech 80% задач треба виконати на вчора." },
    ],

    tasks: [
      {
        id: "text_003_t1",
        type: "single",
        question: "Первісний текст буде відновлено, якщо речення розташувати в послідовності, запропонованій у рядку",
        answerType: "svg",
        answers: [
          // TODO: заповни варіанти А–Д
          row(S, D, TR, C, T),   // А
          row(S, D, C, TR, T),   // Б
          row(S, TR, C, D, T),   // В
          row(S, C, D, TR, T),   // Г
          row(S, D, TR, T, C),   // Д
        ],
        correct: 0
      },
      {
        id: "text_003_t2",
        type: "single",
        question: "Пунктуаційну помилку допущено в реченні, позначеному",
        answerType: "svg",
        answers: [
          row(T),   // А
          row(S),   // Б
          row(TR),  // В
          row(C),   // Г
          row(D),   // Д
        ],
        correct: 2
      },
      {
        id: "text_003_t3",
        type: "single",
        question: "Реченням з різними видами зв'язку є речення",
        answerType: "svg",
        answers: [
          row(T),   // А
          row(S),   // Б
          row(TR),  // В
          row(C),   // Г
          row(D),   // Д
        ],
        correct: 0
      },
      {
        id: "text_003_t4",
        type: "single",
        question: "Фразеологізм використано в реченні",
        answerType: "svg",
        answers: [
          row(T),   // А
          row(S),   // Б
          row(TR),  // В
          row(C),   // Г
          row(D),   // Д
        ],
        correct: 0
      },
      {
        id: "text_003_t5",
        type: "single",
        question: "У знахідному відмінку вжито виділене слово",
        answers: ["робота", "темп", "проєктів", "у режимі", "жили"],
        correct: 4
      },
    ]
  },
];