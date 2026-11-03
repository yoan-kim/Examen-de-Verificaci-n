import { ExamEdition, RoundNumber } from '../../types/exam';

export const edition16: ExamEdition = {
  id: '16',
  editionNumber: 16,
  isLatest: false,
  verseQuestionId: 6,
  allQuestionIds: [1, 2, 3, 4, 5, 6],
  getRoundQuestionIds: (round: RoundNumber): number[] => {
    if (round === 1) return [6];
    if (round === 2) return [6, 1, 2, 3];
    return [6, 1, 2, 3, 4, 5];
  },
  locales: {
    ko: {
      editionBadge: '16차 (이전 차수)',
      title: '신 43년(16차) 인 맞음 확인 시험',
      subtitle: '범위: 복습, 계 22장, 핵심 성구',
      roundDescriptions: {
        1: '1회차(월): 핵심 성구(계 22:18~19) 토씨 암송 테스트입니다. (총 1문항 · 20점)',
        2: '2회차(화): 핵심 성구(계 22:18~19) + 1, 2, 3번 문제 테스트입니다. (총 4문항 · 75점)',
        3: '3회차(수): 핵심 성구(계 22:18~19) + 1, 2, 3, 4, 5번 전체 문제 테스트입니다. (총 6문항 · 100점)',
        4: '4회차(목): 핵심 성구(계 22:18~19) + 1, 2, 3, 4, 5번 전체 문제 테스트입니다. (총 6문항 · 100점)',
        5: '5회차(금): 핵심 성구(계 22:18~19) + 1, 2, 3, 4, 5번 전체 문제 테스트입니다. (총 6문항 · 100점)',
      },
      mockDescription:
        '모의시험: 요일과 관계없이 1번부터 6번까지 원래 번호 순서대로 전 문항을 응시합니다. (총 6문항 · 100점)',
      notesDescription:
        '학습 노트 (16차): 1번부터 6번까지 문제를 공부하며 이해를 돕는 나만의 노트나 암기 팁을 작성해 두세요. 채점 후 모든 문항 하단에 자동으로 표시되어 복습에 도움을 줍니다.',
      questions: {
        1: {
          id: 1,
          questionType: 'standard',
          title: '1. 계 21장, 계 22장의 제목은 무엇인지 쓰시오. [20점(1개당 10점)]',
          totalPoints: 20,
          parts: [
            {
              id: 'e16_q1_p1',
              label: '① 계 21장',
              answer: '약속한 새 하늘 새 땅 신천지',
              points: 10,
              keywords: [['약속'], ['새하늘새땅'], ['신천지']],
            },
            {
              id: 'e16_q1_p2',
              label: '② 계 22장',
              answer: '생명나무가 있는 거룩한 성',
              points: 10,
              keywords: [['생명나무'], ['거룩한성']],
            },
          ],
        },
        2: {
          id: 2,
          questionType: 'blank',
          sectionHeader: '[2~4번] 괄호 안에 알맞은 말을 쓰시오. (1개당 5점)',
          title: '2. 다음 괄호 안에 알맞은 말을 쓰시오. [20점(1개당 5점)]',
          passageWithBlanks:
            '계 21장의 핵심 내용은 ( ① )과 ( ② )이 ( ③ )에 임해 오심으로 신천지인에게 ( ④ )이 이루어지는 것이다.',
          totalPoints: 20,
          parts: [
            {
              id: 'e16_q2_p1',
              label: '① 빈칸',
              answer: '하나님',
              points: 5,
              keywords: [['하나님']],
            },
            {
              id: 'e16_q2_p2',
              label: '② 빈칸',
              answer: '천국',
              points: 5,
              keywords: [['천국']],
            },
            {
              id: 'e16_q2_p3',
              label: '③ 빈칸',
              answer: '신천지',
              points: 5,
              keywords: [['신천지']],
            },
            {
              id: 'e16_q2_p4',
              label: '④ 빈칸',
              answer: '영생',
              points: 5,
              keywords: [['영생']],
            },
          ],
        },
        3: {
          id: 3,
          questionType: 'blank',
          title: '3. 다음 괄호 안에 알맞은 말을 쓰시오. [15점(1개당 5점)]',
          passageWithBlanks:
            '달마다 열두 가지 열매 맺는 나무는 ( ① )이며(※ 관련 성구: ② ), 달마다 열매 맺지 못하는 나무는 ( ③ )이다.',
          totalPoints: 15,
          parts: [
            {
              id: 'e16_q3_p1',
              label: '① 빈칸',
              answer: '생명나무',
              points: 5,
              keywords: [['생명나무']],
            },
            {
              id: 'e16_q3_p2',
              label: '② 관련 성구',
              answer: '계 22:2',
              points: 5,
              keywords: [['22:2', '22장2절', '22장2']],
            },
            {
              id: 'e16_q3_p3',
              label: '③ 빈칸',
              answer: '선악나무',
              points: 5,
              keywords: [['선악나무']],
            },
          ],
        },
        4: {
          id: 4,
          questionType: 'blank',
          title: '4. 다음 괄호 안에 알맞은 말을 쓰시오. [15점(1개당 5점)]',
          passageWithBlanks:
            '( ① )에는 생명나무만 있고 ( ② )가 없다. 그 이유는 선악나무 바벨론이 (성경 장: ③ )에서 심판받았기 때문이다.',
          totalPoints: 15,
          parts: [
            {
              id: 'e16_q4_p1',
              label: '① 빈칸',
              answer: '계 22장',
              points: 5,
              keywords: [['계22장', '요한계시록22장', '계시록22장', '22장', '계22']],
            },
            {
              id: 'e16_q4_p2',
              label: '② 빈칸',
              answer: '선악나무',
              points: 5,
              keywords: [['선악나무']],
            },
            {
              id: 'e16_q4_p3',
              label: '③ 성경 장',
              answer: '계 16~18장',
              points: 5,
              keywords: [['16'], ['18']],
            },
          ],
        },
        5: {
          id: 5,
          questionType: 'standard',
          title: '5. 주 재림 때 계시록이 가장 중요한 이유와 증거 성구를 쓰시오. [10점]',
          totalPoints: 10,
          parts: [
            {
              id: 'e16_q5_p1',
              label: '가장 중요한 이유',
              answer: '가감하면 천국에 못 가기 때문',
              points: 5,
              keywords: [
                ['가감', '더하거나제하', '더하거나빼'],
                ['천국'],
                ['못가', '못들어가', '가지못', '들어가지못', '못감'],
              ],
            },
            {
              id: 'e16_q5_p2',
              label: '증거 성구',
              answer: '계 22:18~19',
              points: 5,
              keywords: [['22'], ['18'], ['19']],
            },
          ],
        },
        6: {
          id: 6,
          isExactVerse: true,
          questionType: 'verse',
          title: '6. 계 22:18~19을 성경대로 쓰시오. [20점(1구절당 10점)]',
          totalPoints: 20,
          parts: [
            {
              id: 'e16_q6_v18',
              label: '18절',
              answer:
                '내가 이 책의 예언의 말씀을 듣는 각인에게 증거하노니 만일 누구든지 이것들 외에 더하면 하나님이 이 책에 기록된 재앙들을 그에게 더하실 터이요',
              points: 10,
              keywords: [],
              rows: 3,
            },
            {
              id: 'e16_q6_v19',
              label: '19절',
              answer:
                '만일 누구든지 이 책의 예언의 말씀에서 제하여 버리면 하나님이 이 책에 기록된 생명 나무와 및 거룩한 성에 참예함을 제하여 버리시리라',
              points: 10,
              keywords: [],
              rows: 3,
            },
          ],
        },
      },
    },

    es: {
      editionBadge: '16.º (Edición anterior)',
      title: 'Examen de Verificación del ser sellado del Año 43 (16.º)',
      subtitle: 'Contenido: Repaso, Apocalipsis 22 y versículos clave',
      roundDescriptions: {
        1: 'Ronda 1 (Lun): Prueba de memorización exacta del versículo clave (Apocalipsis 22:18–19). (1 pregunta · 20 puntos)',
        2: 'Ronda 2 (Mar): Versículo clave (Apocalipsis 22:18–19) + Preguntas 1, 2 y 3. (4 preguntas · 75 puntos)',
        3: 'Ronda 3 (Mié): Versículo clave (Apocalipsis 22:18–19) + Preguntas 1, 2, 3, 4 y 5 completas. (6 preguntas · 100 puntos)',
        4: 'Ronda 4 (Jue): Versículo clave (Apocalipsis 22:18–19) + Preguntas 1, 2, 3, 4 y 5 completas. (6 preguntas · 100 puntos)',
        5: 'Ronda 5 (Vie): Versículo clave (Apocalipsis 22:18–19) + Preguntas 1, 2, 3, 4 y 5 completas. (6 preguntas · 100 puntos)',
      },
      mockDescription:
        'Simulacro: Examen completo en orden secuencial desde la pregunta 1 hasta la 6 sin importar el día. (6 preguntas · 100 puntos)',
      notesDescription:
        'Notas de Estudio (16.º): Mientras estudia las preguntas de la 1 a la 6, escriba aquí sus apuntes personales o consejos para comprender mejor cada pregunta. Sus notas aparecerán automáticamente en todas las preguntas después de calificar.',
      questions: {
        1: {
          id: 1,
          questionType: 'standard',
          title: '1. Escriba los títulos de Apocalipsis 21 y Apocalipsis 22. [20 puntos (10 puntos por cada respuesta)]',
          totalPoints: 20,
          parts: [
            {
              id: 'e16_q1_p1',
              label: '① Apocalipsis 21',
              answer: 'Shincheonji, el nuevo cielo y la nueva tierra prometidos',
              points: 10,
              keywords: [
                ['shincheonji'],
                ['nuevocielo', 'cielonuevo'],
                ['nuevatierra', 'tierranueva'],
                ['prometido', 'prometidos', 'prometida'],
              ],
            },
            {
              id: 'e16_q1_p2',
              label: '② Apocalipsis 22',
              answer: 'La santa ciudad donde está el árbol de la vida',
              points: 10,
              keywords: [
                ['santaciudad', 'ciudadsanta'],
                ['arboldelavida'],
              ],
            },
          ],
        },
        2: {
          id: 2,
          questionType: 'blank',
          sectionHeader: '[Preguntas 2–4] Escriba las palabras correctas en los espacios en blanco. (5 puntos por cada respuesta)',
          title: '2. Complete los espacios en blanco con las palabras correctas. [20 puntos (5 puntos por cada respuesta)]',
          passageWithBlanks:
            'El contenido central de Apocalipsis 21 es que ( ① ) y ( ② ) vienen y descienden sobre ( ③ ), haciendo que la ( ④ ) se cumpla en los miembros de Shincheonji.',
          totalPoints: 20,
          parts: [
            {
              id: 'e16_q2_p1',
              label: '① Espacio en blanco',
              answer: 'Dios',
              points: 5,
              keywords: [['dios']],
            },
            {
              id: 'e16_q2_p2',
              label: '② Espacio en blanco',
              answer: 'el reino de los cielos',
              points: 5,
              keywords: [['reinodeloscielos', 'cielo', 'cielos']],
            },
            {
              id: 'e16_q2_p3',
              label: '③ Espacio en blanco',
              answer: 'Shincheonji',
              points: 5,
              keywords: [['shincheonji']],
            },
            {
              id: 'e16_q2_p4',
              label: '④ Espacio en blanco',
              answer: 'vida eterna',
              points: 5,
              keywords: [['vidaeterna']],
            },
          ],
        },
        3: {
          id: 3,
          questionType: 'blank',
          title: '3. Complete los espacios en blanco con las palabras correctas. [15 puntos (5 puntos por cada respuesta)]',
          passageWithBlanks:
            'El árbol que da doce clases de frutos cada mes es ( ① ) (※ versículo relacionado: ② ), y el árbol que no da fruto cada mes es ( ③ ).',
          totalPoints: 15,
          parts: [
            {
              id: 'e16_q3_p1',
              label: '① Espacio en blanco',
              answer: 'el árbol de la vida',
              points: 5,
              keywords: [['arboldelavida']],
            },
            {
              id: 'e16_q3_p2',
              label: '② Versículo relacionado',
              answer: 'Ap 22:2',
              points: 5,
              keywords: [['22:2', '222']],
            },
            {
              id: 'e16_q3_p3',
              label: '③ Espacio en blanco',
              answer: 'el árbol del bien y del mal',
              points: 5,
              keywords: [['arboldelbienydelmal', 'arboldelconocimientodelbienydelmal', 'arboldecienciadelbienydelmal']],
            },
          ],
        },
        4: {
          id: 4,
          questionType: 'blank',
          title: '4. Complete los espacios en blanco con las palabras correctas. [15 puntos (5 puntos por cada respuesta)]',
          passageWithBlanks:
            'En ( ① ) solo está el árbol de la vida y no está el ( ② ). Esto se debe a que Babilonia, representada por el árbol del conocimiento del bien y del mal, fue juzgada en ( ③ ).',
          totalPoints: 15,
          parts: [
            {
              id: 'e16_q4_p1',
              label: '① Espacio en blanco',
              answer: 'Ap 22',
              points: 5,
              keywords: [['ap22', 'apocalipsis22', 'capitulo22', '22']],
            },
            {
              id: 'e16_q4_p2',
              label: '② Espacio en blanco',
              answer: 'árbol del bien y del mal',
              points: 5,
              keywords: [['arboldelbienydelmal', 'arboldelconocimientodelbienydelmal', 'arboldecienciadelbienydelmal']],
            },
            {
              id: 'e16_q4_p3',
              label: '③ Capítulos bíblicos',
              answer: 'Ap 16 a 18',
              points: 5,
              keywords: [['16'], ['18']],
            },
          ],
        },
        5: {
          id: 5,
          questionType: 'standard',
          title:
            '5. Escriba por qué el Apocalipsis es el libro más importante en el momento de la segunda venida del Señor y el versículo bíblico que lo demuestra. [10 puntos]',
          totalPoints: 10,
          parts: [
            {
              id: 'e16_q5_p1',
              label: 'Razón principal',
              answer: 'Porque si alguien le añade o le quita, no puede entrar en el cielo.',
              points: 5,
              keywords: [
                ['anade', 'anadiere', 'agrega'],
                ['quita', 'quitare'],
                ['cielo'],
              ],
            },
            {
              id: 'e16_q5_p2',
              label: 'Versículo bíblico que lo demuestra',
              answer: 'Ap 22:18–19',
              points: 5,
              keywords: [['22'], ['18'], ['19']],
            },
          ],
        },
        6: {
          id: 6,
          isExactVerse: true,
          questionType: 'verse',
          title: '6. Escriba Apocalipsis 22:18–19 tal como aparece en la Biblia. [20 puntos (10 puntos por cada versículo)]',
          totalPoints: 20,
          parts: [
            {
              id: 'e16_q6_v18',
              label: 'Versículo 18',
              answer:
                'Yo testifico a todo aquel que oye las palabras de la profecía de este libro: Si alguno añadiere a estas cosas, Dios traerá sobre él las plagas que están escritas en este libro.',
              points: 10,
              keywords: [],
              rows: 3,
            },
            {
              id: 'e16_q6_v19',
              label: 'Versículo 19',
              answer:
                'Y si alguno quitare de las palabras del libro de esta profecía, Dios quitará su parte del libro de la vida, y de la santa ciudad y de las cosas que están escritas en este libro.',
              points: 10,
              keywords: [],
              rows: 3,
            },
          ],
        },
      },
    },
  },
};
