import { ExamEdition, RoundNumber } from '../../types/exam';

export const edition17: ExamEdition = {
  id: '17',
  editionNumber: 17,
  isLatest: true,
  hidePoints: true,
  verseQuestionId: 7,
  allQuestionIds: [1, 2, 3, 4, 5, 6, 7],
  getRoundQuestionIds: (round: RoundNumber): number[] => {
    if (round === 1) return [7];
    if (round === 2) return [7, 1, 2, 3];
    return [7, 1, 2, 3, 4, 5, 6];
  },
  locales: {
    ko: {
      editionBadge: '17차 (최신)',
      title: '신 43년(17차) 인 맞음 확인 시험',
      subtitle: '범위: 계 1장, 핵심 성구(계 1:1, 20)',
      roundDescriptions: {
        1: '1회차(월): 핵심 성구(계 1:1, 20) 토씨 암송 테스트입니다. (총 1문항)',
        2: '2회차(화): 핵심 성구(계 1:1, 20) + 1, 2, 3번 문제 테스트입니다. (총 4문항)',
        3: '3회차(수): 핵심 성구(계 1:1, 20) + 1, 2, 3, 4, 5, 6번 전체 문제 테스트입니다. (총 7문항)',
        4: '4회차(목): 핵심 성구(계 1:1, 20) + 1, 2, 3, 4, 5, 6번 전체 문제 테스트입니다. (총 7문항)',
        5: '5회차(금): 핵심 성구(계 1:1, 20) + 1, 2, 3, 4, 5, 6번 전체 문제 테스트입니다. (총 7문항)',
      },
      mockDescription:
        '모의시험: 요일과 관계없이 1번부터 7번까지 원래 번호 순서대로 전 문항을 응시합니다. (총 7문항)',
      notesDescription:
        '학습 노트 (17차): 1번부터 7번까지 문제를 공부하며 이해를 돕는 나만의 노트나 암기 팁을 작성해 두세요.',
      questions: {
        1: {
          id: 1,
          questionType: 'standard',
          title: '1. 해당 구절의 계시록 제목을 쓰시오.',
          totalPoints: 10,
          parts: [
            {
              id: 'e17_q1_p1',
              label: '계 1:1~8 ①',
              answer: '계시록 전장의 요약과 결론',
              points: 5,
              keywords: [['계시록'], ['전장'], ['요약'], ['결론']],
            },
            {
              id: 'e17_q1_p2',
              label: '계 1:9~20 ②',
              answer: '계시록 사건의 시작과 일곱 별과 일곱 금 촛대의 비밀',
              points: 5,
              keywords: [
                ['계시록'],
                ['사건'],
                ['시작'],
                ['일곱별', '7별'],
                ['일곱금촛대', '7금촛대', '일곱촛대'],
                ['비밀'],
              ],
            },
          ],
        },
        2: {
          id: 2,
          questionType: 'blank',
          title:
            '2. 계시가 전달되는 과정에서 해당되는 존재(인물) 또는 계시록 장을 쓰시오.',
          passageWithBlanks:
            '답> ① 하나님 ( ① )\n② ( ② ) (계 6, 8장)\n③ 천사 ( ③ )\n④ ( ④ ) (계 10장)\n⑤ ( ⑤ ) (계 7장)',
          totalPoints: 15,
          parts: [
            {
              id: 'e17_q2_p1',
              label: '① 하나님 ( 빈칸 )',
              answer: '계 5장',
              points: 3,
              keywords: [['5장', '계5', '5']],
            },
            {
              id: 'e17_q2_p2',
              label: '② ( 빈칸 ) (계 6, 8장)',
              answer: '예수님',
              points: 3,
              keywords: [['예수님', '예수']],
            },
            {
              id: 'e17_q2_p3',
              label: '③ 천사 ( 빈칸 )',
              answer: '계 10장',
              points: 3,
              keywords: [['10장', '계10', '10']],
            },
            {
              id: 'e17_q2_p4',
              label: '④ ( 빈칸 ) (계 10장)',
              answer: '새요한',
              points: 3,
              keywords: [['새요한', '요한']],
            },
            {
              id: 'e17_q2_p5',
              label: '⑤ ( 빈칸 ) (계 7장)',
              answer: '종들',
              points: 3,
              keywords: [['종들', '종']],
            },
          ],
        },
        3: {
          id: 3,
          questionType: 'blank',
          sectionHeader: '[3~5번] 괄호 안에 알맞은 말을 쓰시오.',
          title: '3. 계시록의 3가지 비밀은 무엇인지 성구와 함께 쓰시오.',
          passageWithBlanks:
            '답> ① 일곱 별과 일곱 금 촛대의 비밀, (성구: ① )\n② ( ② ), 계 17:5~7\n③ ( ③ ), (성구: ④ )',
          totalPoints: 20,
          parts: [
            {
              id: 'e17_q3_p1',
              label: '① (성구: 빈칸 )',
              answer: '계 1:20',
              points: 5,
              keywords: [['1:20', '1장20']],
            },
            {
              id: 'e17_q3_p2',
              label: '② ( 빈칸 ), 계 17:5~7',
              answer: '음녀 바벨론과 일곱 머리와 열 뿔 가진 짐승의 비밀',
              points: 5,
              keywords: [
                ['음녀바벨론', '바벨론'],
                ['일곱머리', '7머리'],
                ['열뿔', '10뿔'],
                ['짐승'],
                ['비밀'],
              ],
            },
            {
              id: 'e17_q3_p3',
              label: '③ 첫 번째 괄호 ( 빈칸 )',
              answer: '마지막 일곱째 나팔의 비밀',
              points: 5,
              keywords: [['마지막'], ['일곱째나팔', '7째나팔', '일곱번째나팔'], ['비밀']],
            },
            {
              id: 'e17_q3_p4',
              label: '③ 두 번째 괄호 (성구: 빈칸 )',
              answer: '계 10:7',
              points: 5,
              keywords: [['10:7', '10장7']],
            },
          ],
        },
        4: {
          id: 4,
          questionType: 'blank',
          title: '4. 다음 괄호 안에 알맞은 말을 쓰시오.',
          passageWithBlanks:
            '계 1:5~6에 예수님의 피의 효력은 계시록 성취 때 (① 누구: )에게 있고, 이와 관련된 성경 구절은 (② )이다.',
          totalPoints: 10,
          parts: [
            {
              id: 'e17_q4_p1',
              label: '① 누구',
              answer: '12지파 144,000과 흰 무리',
              points: 5,
              keywords: [
                ['12지파', '열두지파'],
                ['144000', '십사만사천', '14만4천'],
                ['흰무리'],
              ],
            },
            {
              id: 'e17_q4_p2',
              label: '② 성경 구절',
              answer: '계 5:9~10, 계 1:5~6 , 계 7:14',
              points: 5,
              keywords: [
                ['5:9', '5장9'],
                ['1:5', '1장5'],
                ['7:14', '7장14'],
              ],
            },
          ],
        },
        5: {
          id: 5,
          questionType: 'blank',
          title:
            '5. 계 1, 2, 3장에는 ①몇 존재가 출현하며, 출현 순서는 ②무엇인가?',
          passageWithBlanks:
            '답> ① ( ① )\n② 예수님, ( ② ), 니골라당, ( ③ )',
          totalPoints: 15,
          parts: [
            {
              id: 'e17_q5_p1',
              label: '① 몇 존재',
              answer: '네 존재',
              points: 5,
              keywords: [['네존재', '4존재', '네', '4']],
            },
            {
              id: 'e17_q5_p2',
              label: '② 첫 번째 괄호: 예수님, ( 빈칸 )',
              answer: '일곱 별',
              points: 5,
              keywords: [['일곱별', '7별']],
            },
            {
              id: 'e17_q5_p3',
              label: '② 두 번째 괄호: 니골라당, ( 빈칸 )',
              answer: '새요한',
              points: 5,
              keywords: [['새요한', '요한']],
            },
          ],
        },
        6: {
          id: 6,
          questionType: 'standard',
          title:
            '6. 계시록이 성취되기 시작한 이 일은 ①언제, ②어디에서 실상으로 이루어졌는지 쓰시오.',
          totalPoints: 10,
          parts: [
            {
              id: 'e17_q6_p1',
              label: '① 언제',
              answer: '1966년',
              points: 5,
              keywords: [['1966']],
            },
            {
              id: 'e17_q6_p2',
              label: '② 어디에서',
              answer: '과천 소재 청계산 하(下) 장막성전',
              points: 5,
              keywords: [['과천'], ['청계산'], ['장막성전']],
            },
          ],
        },
        7: {
          id: 7,
          isExactVerse: true,
          questionType: 'verse',
          title:
            '7. [계 1장 핵심 성구] 계 1:1, 20을 성경대로 쓰시오.',
          passageWithBlanks:
            '1절 ( ① ) 반드시 속히 될 일을\n( ② )\n20절 네 본 것은 내 오른손에 ( ③ )',
          totalPoints: 20,
          parts: [
            {
              id: 'e17_q7_v1_p1',
              label: '1절 ( ① 빈칸 )',
              answer: '예수 그리스도의 계시라 이는 하나님이 그에게 주사',
              points: 5,
              keywords: [],
              rows: 2,
            },
            {
              id: 'e17_q7_v1_p2',
              label: '1절 ( ② 빈칸 )',
              answer:
                '그 종들에게 보이시려고 그 천사를 그 종 요한에게보내어 지시하신 것이라',
              points: 5,
              keywords: [],
              rows: 2,
            },
            {
              id: 'e17_q7_v20_p1',
              label: '20절 ( ③ 빈칸 )',
              answer:
                '일곱 별의 비밀과 일곱 금 촛대라 일곱 별은 일곱 교회의 사자요 일곱 촛대는 일곱 교회니라',
              points: 10,
              keywords: [],
              rows: 3,
            },
          ],
        },
      },
    },

    es: {
      isUploaded: true,
      editionBadge: '17.º (Más reciente)',
      title: 'Examen de Verificación del Sello del Año S43 (17)',
      subtitle: 'Tema: Apocalipsis, Capítulo 1',
      roundDescriptions: {
        1: 'Ronda 1 (Lun): Prueba de memorización exacta de los versículos clave (Apocalipsis 1:1, 20). (1 pregunta)',
        2: 'Ronda 2 (Mar): Versículos clave (Apocalipsis 1:1, 20) + Preguntas 1, 2 y 3. (4 preguntas)',
        3: 'Ronda 3 (Mié): Versículos clave (Apocalipsis 1:1, 20) + Preguntas 1, 2, 3, 4, 5 y 6 completas. (7 preguntas)',
        4: 'Ronda 4 (Jue): Versículos clave (Apocalipsis 1:1, 20) + Preguntas 1, 2, 3, 4, 5 y 6 completas. (7 preguntas)',
        5: 'Ronda 5 (Vie): Versículos clave (Apocalipsis 1:1, 20) + Preguntas 1, 2, 3, 4, 5 y 6 completas. (7 preguntas)',
      },
      mockDescription:
        'Simulacro: Examen completo en orden secuencial desde la pregunta 1 hasta la 7 sin importar el día. (7 preguntas)',
      notesDescription:
        'Notas de Estudio (17.º): Preguntas de la 1 a la 7.',
      questions: {
        1: {
          id: 1,
          questionType: 'standard',
          title:
            '1. Escribe el título del Apocalipsis que corresponde al versículo.',
          totalPoints: 10,
          parts: [
            {
              id: 'e17_q1_p1',
              label: 'Apocalipsis 1:1-8 ①',
              answer:
                'El resumen y la conclusión de todos los capítulos del Apocalipsis',
              points: 5,
              keywords: [['resumen'], ['conclusion'], ['apocalipsis']],
            },
            {
              id: 'e17_q1_p2',
              label: 'Apocalipsis 1:9-20 ②',
              answer:
                'El comienzo de los eventos del Apocalipsis y el misterio de las siete estrellas y los siete candeleros de oro',
              points: 5,
              keywords: [
                ['comienzo', 'principio', 'inicio'],
                ['eventos', 'evento'],
                ['apocalipsis'],
                ['misterio'],
                ['sieteestrellas', '7estrellas'],
                [
                  'sietecandelerosdeoro',
                  'sietecandeleros',
                  'sietecandelabros',
                  '7candeleros',
                ],
              ],
            },
          ],
        },
        2: {
          id: 2,
          questionType: 'blank',
          title:
            '2. Escribe el ser (persona) o capítulo del Apocalipsis correspondiente en el proceso de la revelación que se transmite.',
          passageWithBlanks:
            'Respuestas: ① Dios ( ① )\n② ( ② ) (Apocalipsis 6, 8)\n③ Ángel ( ③ )\n④ ( ④ ) (Apocalipsis 10)\n⑤ ( ⑤ ) (Apocalipsis 7)',
          totalPoints: 15,
          parts: [
            {
              id: 'e17_q2_p1',
              label: '① Dios ( espacio en blanco )',
              answer: 'Apocalipsis 5',
              points: 3,
              keywords: [['apocalipsis5', 'ap5', '5']],
            },
            {
              id: 'e17_q2_p2',
              label: '② ( espacio en blanco ) (Apocalipsis 6, 8)',
              answer: 'Jesús',
              points: 3,
              keywords: [['jesus']],
            },
            {
              id: 'e17_q2_p3',
              label: '③ Ángel ( espacio en blanco )',
              answer: 'Apocalipsis 10',
              points: 3,
              keywords: [['apocalipsis10', 'ap10', '10']],
            },
            {
              id: 'e17_q2_p4',
              label: '④ ( espacio en blanco ) (Apocalipsis 10)',
              answer: 'Nuevo Juan',
              points: 3,
              keywords: [['nuevojuan', 'juan']],
            },
            {
              id: 'e17_q2_p5',
              label: '⑤ ( espacio en blanco ) (Apocalipsis 7)',
              answer: 'Siervos',
              points: 3,
              keywords: [['siervos', 'siervo']],
            },
          ],
        },
        3: {
          id: 3,
          questionType: 'blank',
          sectionHeader:
            '[Preguntas 3-5] Escribe la palabra adecuada entre paréntesis.',
          title:
            '3. Escriba cuáles son los tres misterios del Apocalipsis junto con sus versículos bíblicos correspondientes.',
          passageWithBlanks:
            'Respuesta: ① El misterio de las siete estrellas y los siete candeleros de oro (Escritura: ① )\n② ( ② ) (Escritura: Apocalipsis 17:5-7)\n③ ( ③ ) (Escritura: ④ )',
          totalPoints: 20,
          parts: [
            {
              id: 'e17_q3_p1',
              label: '① (Escritura: espacio en blanco )',
              answer: 'Apocalipsis 1:20',
              points: 5,
              keywords: [['1:20', '120']],
            },
            {
              id: 'e17_q3_p2',
              label: '② ( espacio en blanco ) (Escritura: Apocalipsis 17:5-7)',
              answer:
                'El misterio de la ramera Babilonia y de la bestia con siete cabezas y diez cuernos',
              points: 5,
              keywords: [
                ['misterio'],
                ['ramerababilonia', 'babilonia'],
                ['bestia'],
                ['sietecabezas', '7cabezas'],
                ['diezcuernos', '10cuernos'],
              ],
            },
            {
              id: 'e17_q3_p3',
              label: '③ Primer espacio en blanco (tercer misterio)',
              answer: 'El misterio de la séptima trompeta final',
              points: 5,
              keywords: [
                ['misterio'],
                ['septima', '7ma', 'ultima', 'final'],
                ['trompeta'],
              ],
            },
            {
              id: 'e17_q3_p4',
              label: '③ Segundo espacio en blanco (Escritura: )',
              answer: 'Apocalipsis 10:7',
              points: 5,
              keywords: [['10:7', '107']],
            },
          ],
        },
        4: {
          id: 4,
          questionType: 'blank',
          title:
            '4. Complete los espacios en blanco con las palabras correctas.',
          passageWithBlanks:
            'En Apocalipsis 1:5-6, la eficacia de la sangre de Jesús recae sobre (① Quienes: ) en el momento del cumplimiento del Apocalipsis, y los versículos bíblicos relacionados son (② ).',
          totalPoints: 10,
          parts: [
            {
              id: 'e17_q4_p1',
              label: '① Quienes',
              answer: 'los 144,000 y la multitud en blanco de las 12 Tribus',
              points: 5,
              keywords: [
                ['144000'],
                ['multitud', 'blanco', 'blanca'],
                ['12tribus', 'docetribus'],
              ],
            },
            {
              id: 'e17_q4_p2',
              label: '② Versículos bíblicos relacionados',
              answer:
                'Apocalipsis 5:9-10, Apocalipsis 1:5-6, Apocalipsis 7:14',
              points: 5,
              keywords: [['5:9'], ['1:5'], ['7:14']],
            },
          ],
        },
        5: {
          id: 5,
          questionType: 'blank',
          title:
            '5. En los capítulos 1, 2 y 3 del Apocalipsis, ① ¿cuántos seres aparecen y ② cuál es el orden de su aparición?',
          passageWithBlanks:
            'Respuesta: ① ( ① )\n② Jesús, ( ② ), Nicolaitas, ( ③ )',
          totalPoints: 15,
          parts: [
            {
              id: 'e17_q5_p1',
              label: '① ¿Cuántos seres aparecen?',
              answer: 'Cuatro seres (Cuatro)',
              points: 5,
              keywords: [['cuatro', '4', 'tuexistencia']],
            },
            {
              id: 'e17_q5_p2',
              label: '② Primer paréntesis: Jesús, ( espacio en blanco )',
              answer: 'Siete Estrellas',
              points: 5,
              keywords: [['sieteestrellas', '7estrellas']],
            },
            {
              id: 'e17_q5_p3',
              label: '② Segundo paréntesis: Nicolaitas, ( espacio en blanco )',
              answer: 'Nuevo Juan',
              points: 5,
              keywords: [['nuevojuan', 'juan']],
            },
          ],
        },
        6: {
          id: 6,
          questionType: 'standard',
          title:
            '6. Escribe ① Cuándo y ② Dónde se realizó este evento, en el que comenzó a cumplirse el Libro del Apocalipsis.',
          totalPoints: 10,
          parts: [
            {
              id: 'e17_q6_p1',
              label: '① Cuándo',
              answer: 'Año 1966',
              points: 5,
              keywords: [['1966']],
            },
            {
              id: 'e17_q6_p2',
              label: '② Dónde',
              answer:
                'Templo del Tabernáculo, debajo del Monte Cheonggye en Gwacheon',
              points: 5,
              keywords: [
                ['templodeltabernaculo', 'tabernaculo'],
                ['cheonggye'],
                ['gwacheon'],
              ],
            },
          ],
        },
        7: {
          id: 7,
          isExactVerse: true,
          questionType: 'verse',
          title:
            '7. [Pasaje clave del capítulo 1 del Apocalipsis] Escribe Apocalipsis 1:1, 20 según la Biblia.',
          passageWithBlanks:
            'Versículo 1: ( ① ) las cosas que deben suceder pronto;\n( ② )\nVersículo 20: El misterio de las siete estrellas que has visto en mi diestra, ( ③ )',
          totalPoints: 20,
          parts: [
            {
              id: 'e17_q7_v1_p1',
              label: 'Versículo 1 ( ① espacio en blanco )',
              answer:
                'La revelación de Jesucristo, que Dios le dio, para manifestar a sus siervos',
              points: 5,
              keywords: [],
              rows: 2,
            },
            {
              id: 'e17_q7_v1_p2',
              label: 'Versículo 1 ( ② espacio en blanco )',
              answer:
                'y la declaró enviándola por medio de su ángel a su siervo Juan,',
              points: 5,
              keywords: [],
              rows: 2,
            },
            {
              id: 'e17_q7_v20_p1',
              label: 'Versículo 20 ( ③ espacio en blanco )',
              answer:
                'y de los siete candeleros de oro: las siete estrellas son los ángeles de las siete iglesias, y los siete candeleros que has visto, son las siete iglesias.',
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
