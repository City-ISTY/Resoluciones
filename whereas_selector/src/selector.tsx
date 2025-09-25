import * as React from "react";
import { List, arrayMove, arrayRemove } from 'react-movable';

const initialState = [
  "Que, el artículo 76 de la Constitución de la República del Ecuador asegura el derecho al debido proceso que incluirá las siguientes garantías básicas: \"En todo proceso en el que se determinen derechos y obligaciones de cualquier orden, se asegurará el derecho al debido proceso que incluirá las siguientes garantías básicas: 1. Corresponde a toda autoridad administrativa o judicial, garantizar el cumplimiento de las normas y los derechos de las partes. 7. El derecho de las personas a la defensa incluirá las siguientes garantías: a) Nadie podrá ser privado del derecho a la defensa en ninguna etapa o grado del procedimiento. c) Ser escuchado en el momento oportuno y en igualdad de condiciones. k) Ser juzgado por una jueza o juez independiente, imparcial y competente. Nadie será juzgado por tribunales de excepción o por comisiones especiales creadas para el efecto. m) Recurrir el fallo o resolución en todos los procedimientos en los que se decida sobre sus derechos. Universal de Derechos Humanos y el artículo 8 de la Convención Americana sobre Derechos Humanos o Pacto de San José. Para Arturo Hoyos, a través del debido proceso '''debe asegurarse a las partes oportunidad razonable de ser oídas por un tribunal competente, predeterminado por la ley, independiente e imparcial de pronunciarse respecto de las pretensiones y manifestaciones de la parte contraria, de aportar pruebas lícitas relacionadas con el objeto del proceso y de contradecir las aportadas por la contraparte, de hacer uso de los medios de impugnación consagrados por la ley contra resoluciones judiciales motivadas y conformes a derecho, de tal manera que las personas puedan defender efectivamente sus derechos'''. En este sentido, Carlos Bernal Pulido manifiesta que de la extensa lista de derechos fundamentales contenidos en las constituciones actuales, se podría reducir a cinco los derechos fundamentales generales, estos son: el derecho general de libertad, el de igualdad, el de protección,\"",
  "Que, el artículo 59 del Estatuto ISTY indica lo siguiente sobre Garantías del debido proceso: \"Los estudiantes y/o docentes que hayan incurrido en las faltas tipificadas por la Ley, este Estatuto y/u otras normas vigentes se someterán, ante el Órgano Colegiado Superior, al procedimiento establecido en el Reglamento Especial de Faltas y Sanciones del Instituto Superior Tecnológico Yaruquí. En todos los procesos disciplinarios se garantizará el debido proceso, el derecho a la defensa y las instancias de revisión y/o apelación. CAPÍTULO III NIVEL SUSTANTIVO\"",
  "Que, el artículo 123 de la Ley Orgánica de Educación Superior (LOES) indica lo siguiente sobre Reglamento sobre el Régimen Académico: \"El Consejo de Educación Superior aprobará el Reglamento de Régimen Académico que regule los títulos y grados académicos, el tiempo de duración, número de créditos de cada opción y demás aspectos relacionados con grados y títulos, buscando la armonización y la promoción de la movilidad estudiantil, de profesores o profesoras e investigadores o investigadoras.\"",
  "Que, el artículo 26 del Reglamento de Régimen Académico 2023 indica lo siguiente sobre Requisitos y opciones de titulación en el tercer nivel: \"Cada IES determinará en su normativa interna los requisitos para acceder a la titulación, así como las opciones para su aprobación. Los créditos correspondientes a las opciones de titulación estarán incluidos en la totalidad de créditos de la carrera. Se podrá emitir el título respectivo únicamente cuando el estudiante apruebe todos los requisitos académicos y administrativos establecidos por las IES, lo que constará en el acta consolidada de finalización de estudios, de conformidad con el artículo 85 de este Reglamento.\"",
  "Que, el artículo 73 del Reglamento de Régimen Académico del ISTY indica lo siguiente sobre Obtención del título profesional: \"Los estudiantes que hayan cumplido con todos los requisitos académicos, aprobado la opción de titulación; así como con todas sus obligaciones administrativas con la Institución, serán habilitados para la obtención de su título profesional. Para la determinación de los estudiantes que se encuentran habilitados para la obtención del título profesional, la Dirección de Carreras se encargará de elaborar un listado, el que será revisado por el Vicerrectorado Académico, una vez concluida la revisión, esta instancia lo remitirá a la Secretaría General para que se proceda con la elaboración del acta de grado.\"",
  "Que, el artículo 25 del Reglamento para el Reconocimiento y Homologación de Estudios indica lo siguiente sobre De la Titulación: \"Una vez que el estudiante de validación de conocimientos haya homologado las asignaturas correspondientes de la malla curricular, deberá Realizar un examen complexivo teórico-práctico cuyo objetivo es evaluar de manera integral el conocimiento, las habilidades y competencias adquiridas al final de la carrera. Este examen podrá ser presencial o virtual en correspondencia con la modalidad de estudio de cada carrera y respondiendo a los intereses institucionales. CAPÍTULO V VALIDACIÓN POR EJERCICIO PROFESIONAL\"",
  "Que, el artículo 13 del Reglamento de Evaluación Estudiantil indica lo siguiente sobre De la Difusión: \"El calendario académico y las notas de evaluación serán publicados de manera oportuna en el Sistema Académico para conocimiento de las y los estudiantes.\"",
  "Que, el artículo 10 del Reglamento de Admisión, Matrícula, Registro, Acompañamiento Académico, Formación en Valores, Evaluación y Estímulos Positivos indica lo siguiente sobre Admisión extraordinaria: \"Se podrá admitir fuera de convocatoria por razones justificadas (traslados, convenios, casos fortuitos), previa resolución del Órgano Colegiado Superior.\"",
  "Que, la Disposición Segunda del Reglamento de Régimen Académico 2023 indica lo siguiente sobre Disposiciones: \"Los estudiantes que no hayan podido titularse en los tiempos establecidos para el efecto, podrán continuar sus estudios acogiéndose a los mecanismos de reconocimiento y homologación de asignaturas, cursos o sus equivalentes, según corresponda, en los plazos y términos establecidos en la norma.\"",
  "Que, el artículo 28 del Reglamento de Régimen Académico 2023 indica lo siguiente sobre Prórroga para opciones de titulación en cuarto nivel: \"La IES en su normativa interna establecerá el plazo adicional que tiene el estudiante para desarrollar su opción de titulación y los derechos y aranceles que deberá pagar para el efecto en el caso de solicitar prórrogas. La primera prórroga no requerirá de pago por concepto de derechos o aranceles, ni valor similar. Cuando el estudiante haya cumplido y aprobado la totalidad del plan de estudios excepto la opción de titulación y una vez transcurridos los plazos establecidos por la IES, deberá matricularse y tomar los cursos, asignaturas o equivalentes para la actualización de conocimientos en los plazos y condiciones que establezca la IES, siempre y cuando no hayan transcurrido diez (10) años desde que se cumplió y aprobó la totalidad del plan de estudios.\"",
  "Que, el artículo 9 del Reglamento de Aranceles, Matrículas indica lo siguiente sobre Criterio para la fijación del valor de los derechos: \"El valor de los derechos será fijado en función del arancel y será independiente del número de horas de las asignaturas, cursos o sus equivalentes que registre el estudiante. El valor que la IES cobrará por los derechos por la rendición de cada examen fuera del período académico ordinario de evaluación, así como por los exámenes de gracia, ubicación y recuperación será como máximo el diez por ciento (10%) del valor más alto de la matrícula ordinaria establecida del correspondiente período académico. Este valor no será aplicable en el caso de estudiantes que por circunstancias de caso fortuito, fuerza mayor, calamidad doméstica o enfermedad, debidamente justificadas, no hayan rendido los exámenes en el tiempo oportuno.\"",
  "Que, el artículo 68 del Reglamento de Régimen Académico del ISTY indica lo siguiente sobre Justificación de asistencia en asignaturas: \"Excepcionalmente, en casos de enfermedad grave, calamidad doméstica, caso fortuito o fuerza mayor, los estudiantes del ISTY podrán solicitar la justificación de faltas, para lo cual, deberán dirigir una solicitud a la Dirección de Carreras, en el término de 3 días hábiles luego de que el estudiante retorne a sus actividades académicas, debiendo adjuntar los documentos que justifiquen la causal alegada y el pago del rubro correspondiente. Recibida la solicitud, la Dirección de Carreras deberá analizarla y verificar la veracidad de los justificativos entregados por el estudiante en el término máximo de 3 días hábiles y emitir la resolución correspondiente y notificar a las instancias institucionales respectivas para su registro en el sistema académico. Únicamente se podrá justificar un máximo de $ faltas por periodo académico, considerando todas las asignaturas cursadas por el estudiante en el mismo.\"",
  "Que, el artículo 114 del Reglamento de Régimen Académico 2023 indica lo siguiente sobre Período académico extraordinario: \"Las IES podrán implementar, adicionalmente, períodos académicos extraordinarios de mínimo cuatro (4) semanas. En este período extraordinario se podrá contratar al personal académico y administrativo que se requiera según la planificación de las IES. Los períodos académicos extraordinarios no podrán ser implementados para adelantar la titulación de los estudiantes.\"",
  "Que, la Disposición Tercera del Reglamento de Elecciones de Representantes de Docentes y Estudiantes al OCS indica lo siguiente sobre Disposiciones: \"Los casos no previstos en el presente Reglamento serán resueltos por el Órgano Colegiado Superior.\"",
  "Que, la Disposición Primera del Reglamento de Educación Continua indica lo siguiente sobre Disposiciones: \"Todo aquello que no se encuentre previsto en el presente Reglamento será resuelto por el Órgano Colegiado Superior.\""
]

const RemovableByMove: React.FC = () => {
  const [items, setItems] = React.useState(initialState);

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0px auto",
        backgroundColor: "#FFF",
        padding: "3em",
        textAlign: "center",
      }}
    >
      <List
        removableByMove
        values={items}
        onChange={({ oldIndex, newIndex }) => {
          setItems(
            newIndex === -1
              ? arrayRemove(items, oldIndex)
              : arrayMove(items, oldIndex, newIndex),
          );
        }}
        renderList={({ children, props, isDragged }) => (
          <ul
            {...props}
            style={{
              padding: "0em 0em 1em 0em",
              cursor: isDragged ? "grabbing" : undefined,
            }}
          >
            {children}
          </ul>
        )}
        renderItem={({
          value,
          props,
          isDragged,
          isSelected,
          isOutOfBounds,
        }) => (
          <li
            {...props}
            key={props.key}
            style={{
              ...props.style,
              padding: "1.5em",
              textAlign: "left",
              margin: "0.5em 0em",
              listStyleType: "none",
              cursor: isDragged ? "grabbing" : "grab",
              border: "2px solid #CCC",
              boxShadow: "3px 3px #AAA",
              color: "#333",
              borderRadius: "5px",
              fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
              backgroundColor:
                isDragged || isSelected
                  ? isOutOfBounds
                    ? "#F08080"
                    : "#EEE"
                  : "#FFF",
            }}
          >
            {value}
          </li>
        )}
      />
      <button onClick={() => setItems(initialState)}>Reset</button>
    </div>
  );
};

export default RemovableByMove;