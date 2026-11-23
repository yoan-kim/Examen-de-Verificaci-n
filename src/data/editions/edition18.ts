import { ExamEdition, RoundNumber } from '../../types/exam';

export const edition18: ExamEdition = {
  id: '18',
  editionNumber: 18,
  isLatest: true,
  hidePoints: false,
  verseQuestionId: 4,
  allQuestionIds: [1, 2, 3, 4],
  getRoundQuestionIds: (round: RoundNumber): number[] => {
    if (round === 1) return [4];
    if (round === 2) return [4, 1];
    if (round === 3) return [4, 1, 2];
    return [4, 1, 2, 3];
  },
  locales: {
    ko: {
      isUploaded: true,
      editionBadge: '18차 (최신)',
      title: '신 43년(18차) 인 맞음 확인 시험',
      subtitle: '범위: 계 2장',
      roundDescriptions: {
        1: '1회차(월): 핵심 성구(계 2:17) 토씨 암송 테스트입니다. (총 1문항 · 10점)',
        2: '2회차(화): 핵심 성구(계 2:17) + 1번 문제 테스트입니다. (총 2문항 · 20점)',
        3: '3회차(수): 핵심 성구(계 2:17) + 1, 2번 문제 테스트입니다. (총 3문항 · 60점)',
        4: '4회차(목): 핵심 성구(계 2:17) + 1, 2, 3번 전체 문제 테스트입니다. (총 4문항 · 100점)',
        5: '5회차(금): 핵심 성구(계 2:17) + 1, 2, 3번 전체 문제 테스트입니다. (총 4문항 · 100점)',
      },
      mockDescription:
        '모의시험: 요일과 관계없이 1번부터 4번까지 원래 번호 순서대로 전 문항을 응시합니다. (총 4문항 · 100점)',
      notesDescription:
        '학습 노트 (18차): 1번부터 4번까지 문제를 공부하며 이해를 돕는 나만의 노트나 암기 팁을 작성해 두세요. 채점 후 모든 문항 하단에 자동으로 표시되어 복습에 도움을 줍니다.',
      questions: {
        1: {
          id: 1,
          questionType: 'standard',
          title: '1. 계 2장의 제목을 쓰시오. [10점]',
          totalPoints: 10,
          parts: [
            {
              id: 'e18_q1_p1',
              label: '계 2장의 제목',
              answer: '일곱 교회 사자에게 보낸 편지',
              points: 10,
              keywords: [['일곱', '7'], ['교회'], ['사자'], ['편지']],
            },
          ],
        },
        2: {
          id: 2,
          questionType: 'standard',
          title:
            '2. 계 2~3장에 보낸 편지 내용 ①세 가지는 무엇이며, 계 2~3장의 출현 인물 ②세 존재를 순차적으로 쓰고, 그들이 각자 ③한 일을 쓰시오. [40점(1개당 8점)]',
          totalPoints: 40,
          parts: [
            {
              id: 'e18_q2_p1',
              label: '① 보낸 편지 내용 세 가지',
              answer: '본 것, 이제 있는 일, 장차 될 일',
              points: 8,
              keywords: [['본것'], ['이제있는일'], ['장차될일']],
            },
            {
              id: 'e18_q2_p2',
              label: '② 출현 인물 세 존재 (순차적)',
              answer: '일곱 사자, 니골라당, 요한',
              points: 8,
              keywords: [
                ['일곱사자', '7사자'],
                ['니골라당'],
                ['요한', '새요한'],
              ],
            },
            {
              id: 'e18_q2_p3',
              label: '③ 일곱 사자',
              answer: '길 예비 등불 역사',
              points: 8,
              keywords: [['길예비'], ['등불'], ['역사']],
            },
            {
              id: 'e18_q2_p4',
              label: '③ 니골라당',
              answer: '우상의 제물과 교훈, 행음',
              points: 8,
              keywords: [['우상의제물', '우상제물'], ['교훈'], ['행음']],
            },
            {
              id: 'e18_q2_p5',
              label: '③ 요한',
              answer: '회개할 것과 약속의 말씀 편지',
              points: 8,
              keywords: [['회개'], ['약속의말씀', '약속말씀'], ['편지']],
            },
          ],
        },
        3: {
          id: 3,
          questionType: 'blank',
          title:
            '3. 성경에는 ①하나님의 목자가 주는 양식이 있고, ②마귀의 목자가 주는 양식이 있다. 두 가지 양식을 계시록에서는 무엇이라 기록하였는지 해당하는 내용의 성구(장)를 쓰시오. [40점(1개당 10점)]',
          passageWithBlanks:
            '답> ① 하나님의 목자가 주는 양식\n: ( ① ) 감추었던 만나, ( ② ) 계시 말씀, ( ③ ) 생명나무 과실\n② 마귀의 목자가 주는 양식\n: ( ④ ) 음행의 포도주',
          totalPoints: 40,
          parts: [
            {
              id: 'e18_q3_p1',
              label: '① ( 빈칸 ) 감추었던 만나',
              answer: '계 2:17',
              points: 10,
              keywords: [['2:17', '2장17절', '2장17']],
            },
            {
              id: 'e18_q3_p2',
              label: '② ( 빈칸 ) 계시 말씀',
              answer: '계 10장',
              points: 10,
              keywords: [['10장', '계10', '10']],
            },
            {
              id: 'e18_q3_p3',
              label: '③ ( 빈칸 ) 생명나무 과실',
              answer: '계 22장',
              points: 10,
              keywords: [['22장', '계22', '22']],
            },
            {
              id: 'e18_q3_p4',
              label: '④ ( 빈칸 ) 음행의 포도주',
              answer: '계 17:2, 계 18:3',
              points: 10,
              keywords: [
                ['17:2', '17장2절', '17장2'],
                ['18:3', '18장3절', '18장3'],
              ],
            },
          ],
        },
        4: {
          id: 4,
          questionType: 'verse',
          isExactVerse: true,
          title: '4. [계 2장 핵심 성구] 계 2:17을 성경대로 쓰시오. [10점]',
          totalPoints: 10,
          parts: [
            {
              id: 'e18_q4_p1',
              label: '17절',
              answer:
                '귀 있는 자는 성령이 교회들에게 하시는 말씀을 들을찌어다 이기는 그에게는 내가 감추었던 만나를 주고 또 흰 돌을 줄터인데 그 돌 위에 새 이름을 기록한 것이 있나니 받는 자 밖에는 그 이름을 알 사람이 없느니라',
              points: 10,
              keywords: [],
              rows: 4,
            },
          ],
        },
      },
    },

    es: {
      isUploaded: true,
      editionBadge: '18.º (Más reciente)',
      title: 'Examen de Verificación del Sello del Año S43 (18.º)',
      subtitle: 'contenido : Apocalipsis 2',
      roundDescriptions: {
        1: 'Ronda 1 (Lun): Prueba de memorización exacta del versículo clave (Apocalipsis 2:17). (1 pregunta · 10 puntos)',
        2: 'Ronda 2 (Mar): Versículo clave (Apocalipsis 2:17) + Pregunta 1. (2 preguntas · 20 puntos)',
        3: 'Ronda 3 (Mié): Versículo clave (Apocalipsis 2:17) + Preguntas 1 y 2. (3 preguntas · 60 puntos)',
        4: 'Ronda 4 (Jue): Versículo clave (Apocalipsis 2:17) + Preguntas 1, 2 y 3 completas. (4 preguntas · 100 puntos)',
        5: 'Ronda 5 (Vie): Versículo clave (Apocalipsis 2:17) + Preguntas 1, 2 y 3 completas. (4 preguntas · 100 puntos)',
      },
      mockDescription:
        'Simulacro: Examen completo en orden secuencial desde la pregunta 1 hasta la 4 sin importar el día. (4 preguntas · 100 puntos)',
      notesDescription:
        'Notas de Estudio (18.º): Anote libremente sus consejos de memorización o palabras clave para las preguntas 1 a la 4.',
      questions: {
        1: {
          id: 1,
          questionType: 'standard',
          title:
            '1. Escriba el título del Apocalipsis Capítulo 2. [10 puntos]',
          totalPoints: 10,
          parts: [
            {
              id: 'e18_q1_p1',
              label: 'Título del Apocalipsis Capítulo 2',
              answer:
                'Las cartas enviadas a los mensajeros de las siete iglesias',
              points: 10,
              keywords: [
                ['cartas', 'carta'],
                ['enviadas', 'enviada'],
                ['mensajeros', 'mensajero'],
                ['siete', '7'],
                ['iglesias', 'iglesia'],
              ],
            },
          ],
        },
        2: {
          id: 2,
          questionType: 'standard',
          title:
            '2. En Ap 2-3, ①¿Cuáles son los tres tipos de contenidos que se encuentran en las cartas enviadas? ②Escribe, en orden, los tres seres que aparecen en Ap 2-3 y ③la obra que realizó cada uno. [40 puntos (8 puntos por pregunta)]',
          totalPoints: 40,
          parts: [
            {
              id: 'e18_q2_p1',
              label: '① Tres tipos de contenidos en las cartas enviadas',
              answer:
                'Las cosas que has visto, las que son, las que han de ser después de estas',
              points: 8,
              keywords: [
                ['visto'],
                ['lasqueson', 'queson'],
                ['handeser', 'serdespues'],
              ],
            },
            {
              id: 'e18_q2_p2',
              label: '② Tres seres que aparecen en Ap 2-3 (en orden)',
              answer: 'Siete mensajeros, Nicolaitas, Juan',
              points: 8,
              keywords: [
                ['sietemensajeros', '7mensajeros'],
                ['nicolaitas', 'nicolaita'],
                ['juan'],
              ],
            },
            {
              id: 'e18_q2_p3',
              label: '③ Siete mensajeros',
              answer: 'la obra de lámparas que preparan el camino',
              points: 8,
              keywords: [
                ['lamparas', 'lampara'],
                ['preparan', 'preparar', 'preparacion'],
                ['camino'],
              ],
            },
            {
              id: 'e18_q2_p4',
              label: '③ Nicolaitas',
              answer:
                'los sacrificios a los ídolos, la doctrina y la fornicación',
              points: 8,
              keywords: [
                ['sacrificios', 'sacrificio'],
                ['idolos', 'idolo'],
                ['doctrina'],
                ['fornicacion'],
              ],
            },
            {
              id: 'e18_q2_p5',
              label: '③ Juan',
              answer:
                'Envió cartas que contenían un llamado al arrepentimiento y la palabra de promesa',
              points: 8,
              keywords: [['cartas', 'carta'], ['arrepentimiento'], ['promesa']],
            },
          ],
        },
        3: {
          id: 3,
          questionType: 'blank',
          title:
            '3. En la Biblia, hay ① el alimento dado por el pastor de Dios y ② el alimento dado por el pastor del diablo. Escribe el pasaje bíblico (capítulo) en el que se registra cómo se denominan estos dos tipos de alimento en Apocalipsis. [40 puntos (10 puntos por pregunta)]',
          passageWithBlanks:
            'R〉 ① El alimento que da el pastor de Dios :\n( ① ) El maná escondido, ( ② ) La palabra de revelación, ( ③ ) El fruto del árbol de la vida\n② El alimento que da el pastor del diablo:\n( ④ ) El vino de la fornicación',
          totalPoints: 40,
          parts: [
            {
              id: 'e18_q3_p1',
              label: '① ( ) El maná escondido',
              answer: 'Ap 2:17',
              points: 10,
              keywords: [['2:17', '217']],
            },
            {
              id: 'e18_q3_p2',
              label: '② ( ) La palabra de revelación',
              answer: 'Ap 10',
              points: 10,
              keywords: [['ap10', '10']],
            },
            {
              id: 'e18_q3_p3',
              label: '③ ( ) El fruto del árbol de la vida',
              answer: 'Ap 22',
              points: 10,
              keywords: [['ap22', '22']],
            },
            {
              id: 'e18_q3_p4',
              label: '④ ( ) El vino de la fornicación',
              answer: 'Ap 17:2, Ap 18:3',
              points: 10,
              keywords: [
                ['17:2', '172'],
                ['18:3', '183'],
              ],
            },
          ],
        },
        4: {
          id: 4,
          questionType: 'verse',
          isExactVerse: true,
          title:
            '4. [Versículos clave del Apocalipsis 2] Escriba Apocalipsis 2:17 según la Biblia. [10 puntos]',
          totalPoints: 10,
          parts: [
            {
              id: 'e18_q4_p1',
              label: 'Versículo 17',
              answer:
                'El que tiene oído, oiga lo que el Espíritu dice a las iglesias. Al que venciere, daré a comer del maná escondido, y le daré una piedrecita blanca, y en la piedrecita escrito un nombre nuevo, el cual ninguno conoce sino aquel que lo recibe.',
              points: 10,
              keywords: [],
              rows: 4,
            },
          ],
        },
      },
    },
  },
};
