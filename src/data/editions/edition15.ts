import { ExamEdition, RoundNumber } from '../../types/exam';

function pickRandom(arr: number[], count: number): number[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count).sort((a, b) => a - b);
}

export const edition15: ExamEdition = {
  id: '15',
  editionNumber: 15,
  isLatest: false,
  verseQuestionId: 10,
  allQuestionIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  getRoundQuestionIds: (round: RoundNumber): number[] => {
    if (round === 1) return [10];
    if (round === 2) return [10, 1, 2, 3];
    if (round === 3) {
      const rand2 = pickRandom([1, 2, 3], 2);
      return [10, ...rand2, 4, 5, 6];
    }
    if (round === 4) {
      const rand2 = pickRandom([1, 2, 3, 4, 5, 6], 2);
      return [10, ...rand2, 7, 8, 9];
    }
    const rand5 = pickRandom([1, 2, 3, 4, 5, 6, 7, 8, 9], 5);
    return [10, ...rand5];
  },
  locales: {
    ko: {
      editionBadge: '15차 (이전 차수)',
      title: '신 43년(15차) 인 맞음 확인 시험',
      subtitle: '범위: 복습, 계 21장, 핵심 성구(계 8:3~4)',
      roundDescriptions: {
        1: '1회차(월): 10번 핵심 성구(계 8:3~4) 토씨 암송 테스트입니다. (총 1문항 · 10점)',
        2: '2회차(화): 핵심 성구(계 8:3~4) + 1, 2, 3번 필수 문제입니다. (총 4문항 · 40점)',
        3: '3회차(수): 핵심 성구(계 8:3~4) + 1~3번 중 2문제 + 4, 5, 6번 필수 문제입니다. (총 6문항 · 60점)',
        4: '4회차(목): 핵심 성구(계 8:3~4) + 1~6번 중 2문제 + 7, 8, 9번 필수 문제입니다. (총 6문항 · 60점)',
        5: '5회차(금): 핵심 성구(계 8:3~4) + 1~9번 전체 중 5문제입니다. (총 6문항 · 60점)',
      },
      mockDescription:
        '모의시험: 요일과 관계없이 1번부터 10번까지 전체 문항을 순서대로 응시합니다. (총 10문항 · 100점)',
      notesDescription:
        '학습 노트 (15차): 1번부터 10번까지 모범 답안을 확인하고, 문제를 이해하는 데 필요한 개인 암기 팁과 메모를 작성하세요. 작성한 노트는 채점 후 모든 문항 하단에 자동으로 표시됩니다.',
      questions: {
        1: {
          id: 1,
          questionType: 'standard',
          title:
            '1. 계 20장은 천 년 안의 사건과 천 년 후의 사건으로 나누어지는데, 천 년 안에 있게 되는 사건의 핵심을 증거 성구와 함께 쓰시오. [10점]',
          totalPoints: 10,
          parts: [
            {
              id: 'e15_q1_p1',
              label: '첫 번째 사건 및 증거 성구',
              answer: '용을 무저갱에 가둠, 계 20:1~3',
              points: 5,
              keywords: [['용'], ['무저갱'], ['가둠', '가두', '가둔'], ['20:1', '20장1'], ['3']],
            },
            {
              id: 'e15_q1_p2',
              label: '두 번째 사건 및 증거 성구',
              answer: '영육이 하나되는 첫째 부활, 계 20:4~6',
              points: 5,
              keywords: [['영육', '영과육'], ['하나'], ['첫째부활'], ['20:4', '20장4'], ['6']],
            },
          ],
        },
        2: {
          id: 2,
          questionType: 'standard',
          title: '2. 천 년 후에 있게 되는 사건의 핵심을 증거 성구와 함께 쓰시오. [10점]',
          totalPoints: 10,
          parts: [
            {
              id: 'e15_q2_p1',
              label: '핵심 사건 및 증거 성구',
              answer: '심판, 영생과 영벌, 계 20:7~15',
              points: 10,
              keywords: [['심판'], ['영생'], ['영벌'], ['20:7', '20장7'], ['15']],
            },
          ],
        },
        3: {
          id: 3,
          questionType: 'standard',
          title: '3. 계 20장, 용이 잡힌 후 보좌들 위에 앉아 심판하는 권세자들은 누구인가? [10점]',
          totalPoints: 10,
          parts: [
            {
              id: 'e15_q3_p1',
              label: '답',
              answer: '예수님의 영⋅육 12제자들',
              points: 10,
              keywords: [['예수님', '예수'], ['영육', '영과육'], ['12제자', '열두제자']],
            },
          ],
        },
        4: {
          id: 4,
          questionType: 'standard',
          title:
            '4. 성경 66권 중 가장 중대한 예언은 ①무엇이며, 그중에서도 ②몇 장의 내용이 가장 중대하고, 그 이유는 ③무엇인가? [10점]',
          totalPoints: 10,
          parts: [
            {
              id: 'e15_q4_p1',
              label: '① 가장 중대한 예언',
              answer: '요한계시록',
              points: 3,
              keywords: [['요한계시록', '계시록']],
            },
            {
              id: 'e15_q4_p2',
              label: '② 가장 중대한 장',
              answer: '계 21장',
              points: 3,
              keywords: [['21장', '계21']],
            },
            {
              id: 'e15_q4_p3',
              label: '③ 그 이유',
              answer: '하나님의 목적인 새 하늘 새 땅 창조에 대한 약속이기 때문',
              points: 4,
              keywords: [['하나님'], ['목적'], ['새하늘새땅'], ['창조'], ['약속']],
            },
          ],
        },
        5: {
          id: 5,
          questionType: 'standard',
          title: '5. 계 21장의 제목은 ①무엇이며, 핵심 내용은 ②무엇인가? [10점(1개당 5점)]',
          totalPoints: 10,
          parts: [
            {
              id: 'e15_q5_p1',
              label: '① 계 21장의 제목',
              answer: '약속한 새 하늘 새 땅 신천지',
              points: 5,
              keywords: [['약속'], ['새하늘새땅'], ['신천지']],
            },
            {
              id: 'e15_q5_p2',
              label: '② 핵심 내용',
              answer: '하나님과 천국이 신천지에 임해 오심으로 신천지인에게 영생이 이루어지는 것',
              points: 5,
              keywords: [
                ['하나님'],
                ['천국'],
                ['신천지'],
                ['임해', '임하', '임함'],
                ['영생'],
                ['이루어', '이뤄'],
              ],
            },
          ],
        },
        6: {
          id: 6,
          questionType: 'standard',
          title: '6. ‘계시록의 완성’은 몇 장의 무슨 일인가? [10점]',
          totalPoints: 10,
          parts: [
            {
              id: 'e15_q6_p1',
              label: '답',
              answer: '계 21장의 하나님과 천국이 신천지에 임함',
              points: 10,
              keywords: [['21장', '계21'], ['하나님'], ['천국'], ['신천지'], ['임함', '임하', '임해']],
            },
          ],
        },
        7: {
          id: 7,
          questionType: 'standard',
          title:
            '7. 계 21:24에 ‘만국이 빛 가운데 다닌다’는 것은 누가 어디서 나오는 무엇대로 행한다는 것인가? [10점]',
          totalPoints: 10,
          parts: [
            {
              id: 'e15_q7_p1',
              label: '답',
              answer: '모든 교회가 거룩한 성에서 나오는 진리의 말씀대로 행한다는 것',
              points: 10,
              keywords: [['모든교회'], ['거룩한성'], ['진리의말씀', '진리말씀'], ['행한다', '행함', '행하는']],
            },
          ],
        },
        8: {
          id: 8,
          questionType: 'standard',
          title: '8. 계 21:25에 거룩한 성에 ‘밤이 없다’는 의미는 무엇인가? [10점]',
          totalPoints: 10,
          parts: [
            {
              id: 'e15_q8_p1',
              label: '답',
              answer: '말씀에 무지한 자가 없다',
              points: 10,
              keywords: [['말씀'], ['무지한자', '무지한사람'], ['없다', '없는것']],
            },
          ],
        },
        9: {
          id: 9,
          questionType: 'standard',
          title:
            '9. 생명책에 기록된 자만이 거룩한 성 천국에 들어간다(계 21:27)라고 한 이 ‘생명책’은 무엇인가? [10점]',
          totalPoints: 10,
          parts: [
            {
              id: 'e15_q9_p1',
              label: '답',
              answer: '천국 호적 곧 이긴자가 있는 신천지 12지파의 교적부',
              points: 10,
              keywords: [['천국호적'], ['이긴자'], ['신천지'], ['12지파', '열두지파'], ['교적부']],
            },
          ],
        },
        10: {
          id: 10,
          isExactVerse: true,
          questionType: 'verse',
          title: '10. 계 8:3~4을 성경대로 쓰시오. [10점(1구절당 5점)]',
          totalPoints: 10,
          parts: [
            {
              id: 'e15_q10_v3',
              label: '3절',
              answer:
                '또 다른 천사가 와서 제단 곁에 서서 금 향로를 가지고 많은 향을 받았으니 이는 모든 성도의 기도들과 합하여 보좌 앞 금단에 드리고자 함이라',
              points: 5,
              keywords: [],
              rows: 3,
            },
            {
              id: 'e15_q10_v4',
              label: '4절',
              answer: '향연이 성도의 기도와 함께 천사의 손으로부터 하나님 앞으로 올라가는지라',
              points: 5,
              keywords: [],
              rows: 3,
            },
          ],
        },
      },
    },

    es: {
      editionBadge: '15.º (Edición anterior)',
      title: 'Examen de Verificación del ser sellado del Año 43 (15.º)',
      subtitle: 'Contenido: Repaso, Apocalipsis 21 y versículo clave (Ap 8:3–4)',
      roundDescriptions: {
        1: 'Ronda 1 (Lun): Prueba de memorización exacta del versículo clave (Ap 8:3–4). (1 pregunta · 10 puntos)',
        2: 'Ronda 2 (Mar): Versículo clave (Ap 8:3–4) + Preguntas 1, 2 y 3. (4 preguntas · 40 puntos)',
        3: 'Ronda 3 (Mié): Versículo clave + 2 preguntas al azar (1–3) + Preguntas 4, 5 y 6. (6 preguntas · 60 puntos)',
        4: 'Ronda 4 (Jue): Versículo clave + 2 preguntas al azar (1–6) + Preguntas 7, 8 y 9. (6 preguntas · 60 puntos)',
        5: 'Ronda 5 (Vie): Versículo clave + 5 preguntas al azar entre la 1 y la 9. (6 preguntas · 60 puntos)',
      },
      mockDescription:
        'Simulacro: Examen completo en orden secuencial desde la pregunta 1 hasta la 10 sin importar el día. (10 preguntas · 100 puntos)',
      notesDescription:
        'Notas de Estudio (15.º): Revise las respuestas correctas de las preguntas 1 a 10 y escriba sus propios apuntes o consejos de comprensión. Sus notas se mostrarán automáticamente en todas las preguntas después de calificar.',
      questions: {
        1: {
          id: 1,
          questionType: 'standard',
          title:
            '1. El capítulo 20 del Apocalipsis se divide en eventos que ocurren dentro de los mil años y eventos que ocurren después de los mil años. Describa los eventos clave que ocurren dentro de los mil años, citando las Escrituras que los respaldan. [10 puntos]',
          totalPoints: 10,
          parts: [
            {
              id: 'e15_q1_p1',
              label: 'Primer evento y cita bíblica',
              answer: 'El dragón es arrojado al abismo — Ap 20:1-3',
              points: 5,
              keywords: [['dragon'], ['arrojado', 'lanzado', 'encerrado'], ['abismo'], ['20:1'], ['3']],
            },
            {
              id: 'e15_q1_p2',
              label: 'Segundo evento y cita bíblica',
              answer: 'La primera resurrección, en la que el espíritu y el cuerpo se unen — Ap 20:4-6',
              points: 5,
              keywords: [['primeraresurreccion'], ['espiritu'], ['cuerpo'], ['unen'], ['20:4'], ['6']],
            },
          ],
        },
        2: {
          id: 2,
          questionType: 'standard',
          title:
            '2. Describa los eventos clave que ocurren después de los mil años, citando las Escrituras que los respaldan. [10 puntos]',
          totalPoints: 10,
          parts: [
            {
              id: 'e15_q2_p1',
              label: 'Respuesta y cita bíblica',
              answer: 'El juicio, la vida eterna y el castigo eterno — Ap 20:7-15',
              points: 10,
              keywords: [['juicio'], ['vidaeterna'], ['castigoeterno'], ['20:7'], ['15']],
            },
          ],
        },
        3: {
          id: 3,
          questionType: 'standard',
          title:
            '3. Apocalipsis, capítulo 20: ¿Quiénes son las personas con autoridad que se sientan en tronos y juzgan después de que el dragón es capturado? [10 puntos]',
          totalPoints: 10,
          parts: [
            {
              id: 'e15_q3_p1',
              label: 'Respuesta',
              answer: 'Los doce discípulos de Jesús, en espíritu y cuerpo',
              points: 10,
              keywords: [['docediscipulos', '12discipulos'], ['jesus'], ['espiritu'], ['cuerpo']],
            },
          ],
        },
        4: {
          id: 4,
          questionType: 'standard',
          title:
            '4. ① ¿Cuál es la profecía más importante entre los 66 libros de la Biblia y ② qué capítulo es lo más importante y ③ por qué? [10 puntos]',
          totalPoints: 10,
          parts: [
            {
              id: 'e15_q4_p1',
              label: '① La profecía más importante',
              answer: 'Libro del Apocalipsis',
              points: 3,
              keywords: [['apocalipsis']],
            },
            {
              id: 'e15_q4_p2',
              label: '② Capítulo más importante',
              answer: 'Ap 21',
              points: 3,
              keywords: [['21']],
            },
            {
              id: 'e15_q4_p3',
              label: '③ ¿Por qué?',
              answer: 'Porque es una promesa del propósito de Dios de crear un cielo nuevo y una tierra nueva.',
              points: 4,
              keywords: [['promesa'], ['proposito'], ['dios'], ['crear'], ['cielonuevo', 'nuevocielo'], ['tierranueva', 'nuevatierra']],
            },
          ],
        },
        5: {
          id: 5,
          questionType: 'standard',
          title: '5. ① ¿Cuál es el título de Ap 21 y ② cuál es el contenido principal? [10 puntos (5 puntos cada uno)]',
          totalPoints: 10,
          parts: [
            {
              id: 'e15_q5_p1',
              label: '① Título de Ap 21',
              answer: 'Shincheonji, El Nuevo Cielo y la Nueva Tierra Prometidos',
              points: 5,
              keywords: [
                ['shincheonji'],
                ['nuevocielo', 'cielonuevo'],
                ['nuevatierra', 'tierranueva'],
                ['prometido', 'prometidos'],
              ],
            },
            {
              id: 'e15_q5_p2',
              label: '② Contenido principal',
              answer:
                'Como resultado de la llegada de Dios y el cielo a Shincheonji, la vida eterna se hace realidad para la gente de Shincheonji',
              points: 5,
              keywords: [['dios'], ['cielo'], ['shincheonji'], ['vidaeterna'], ['realidad', 'cumple']],
            },
          ],
        },
        6: {
          id: 6,
          questionType: 'standard',
          title: '6. ¿Cuál es «el cumplimiento del Apocalipsis»? [10 puntos]',
          totalPoints: 10,
          parts: [
            {
              id: 'e15_q6_p1',
              label: 'Respuesta',
              answer: 'Dios y el cielo vienen a Shincheonji en Ap 21',
              points: 10,
              keywords: [['dios'], ['cielo'], ['vienen', 'llegan', 'descienden'], ['shincheonji'], ['21']],
            },
          ],
        },
        7: {
          id: 7,
          questionType: 'standard',
          title:
            '7. “Las naciones andarán a su luz” en Ap 21:24 significa ¿quién actúa según lo que sale de dónde? [10 puntos]',
          totalPoints: 10,
          parts: [
            {
              id: 'e15_q7_p1',
              label: 'Respuesta',
              answer: 'Todas las iglesias actúan según la palabra de verdad que sale de la Ciudad Santa',
              points: 10,
              keywords: [['todaslasiglesias'], ['actuan'], ['palabradeverdad'], ['ciudadsanta', 'santaciudad']],
            },
          ],
        },
        8: {
          id: 8,
          questionType: 'standard',
          title: '8. ¿Qué significa “no habrá noche” en la Ciudad Santa en Apocalipsis 21:25? [10 puntos]',
          totalPoints: 10,
          parts: [
            {
              id: 'e15_q8_p1',
              label: 'Respuesta',
              answer: 'No hay nadie ignorante en la palabra',
              points: 10,
              keywords: [['nadie'], ['ignorante'], ['palabra']],
            },
          ],
        },
        9: {
          id: 9,
          questionType: 'standard',
          title:
            '9. ¿Qué es este “libro de la vida” en el que solo aquellos cuyos nombres estén escritos en él entrarán en la Ciudad Santa (Ap 21:27)? [10 puntos]',
          totalPoints: 10,
          parts: [
            {
              id: 'e15_q9_p1',
              label: 'Respuesta',
              answer:
                'El registro del cielo, es decir, el registro de la iglesia de Shincheonji, las 12 tribus donde el que vence está',
              points: 10,
              keywords: [
                ['registrodelcielo'],
                ['registrodelaiglesia'],
                ['shincheonji'],
                ['12tribus', 'docetribus'],
                ['elquevence'],
              ],
            },
          ],
        },
        10: {
          id: 10,
          isExactVerse: true,
          questionType: 'verse',
          title: '10. Escriba Apocalipsis 8:3–4 tal como aparece en la Biblia. [10 puntos (5 puntos por cada versículo)]',
          totalPoints: 10,
          parts: [
            {
              id: 'e15_q10_v3',
              label: 'Versículo 3',
              answer:
                'Otro ángel vino entonces y se paró ante el altar, con un incensario de oro; y se le dio mucho incienso para añadirlo a las oraciones de todos los santos, sobre el altar de oro que estaba delante del trono.',
              points: 5,
              keywords: [],
              rows: 3,
            },
            {
              id: 'e15_q10_v4',
              label: 'Versículo 4',
              answer:
                'Y de la mano del ángel subió a la presencia de Dios el humo del incienso con las oraciones de los santos.',
              points: 5,
              keywords: [],
              rows: 3,
            },
          ],
        },
      },
    },
  },
};
