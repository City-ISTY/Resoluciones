# Sistema Automatizado de Gestión de Resoluciones CITY
**Descripción del proyecto**
El sistema automatiza el proceso de generación de resoluciones del instituto, desde el agendamiento de reuniones, estracción de datos de la reunión y generación de documentos oficiales.

# A. MANUAL DE USUARIO
El funcionamiento del Bot se divide en tres etapas: 
**Etapa 1 - Agendamiento de Reunión:** Esta etapa permite el agendamiento de la sesión y notificación a todos los asistentes.
**Etapa 2 - Reunión:** Esta etapa no actúa el robot, se trata sobre el llenado de datos, toma de asistencia, notas de reunión por parte de secretaría.
**Etapa 3 - Elaboración de Resoluciones** Esta etapa se da luego de que se realice la reunión, y se encarga de procesar los datos de la reunión y generar el acta de reunión y las resoluciones..



# ETAPA 1: AGENDAMIENTO DE LA REUNIÓN
#### IMPORTANTE: No modifique el asunto de los correos que llegan en ninguna parte del proceso.

## **Paso 1:** Envío de correo inicial: 
Envíe un correo electrónico a la cuenta “city.isty.edu.ec” configurada con el asunto que contenga la palabra "**revisar**" y la siguiente estructura en el cuerpo:
```
1| Fecha: 5 de septiembre del 2025 a las 15:00
2| Tipo: Ordinaria 
3| Asistentes: 
	3.1| Juan Pérez - juan.perez@institucion.edu.ec - Presidente 
	3.2| María García - maria.garcia@institucion.edu.ec - Secretaria 
	3.3| Carlos López - carlos.lopez@institucion.edu.ec - Vocal 
4| Temas a resolver: 
	4.1| Aprobación del presupuesto anual 
		4.1.1| Revisión de partidas presupuestarias 
		4.1.2| Asignación de recursos por departamento 
	4.2| Evaluación de proyectos académicos 
		4.2.1| Proyecto de investigación A 
		4.2.2| Proyecto de extensión B

CAMBIOS
*Cambiar la sesion a extraordinaria
*Eliminar el punto 4.1.2
```
ANÁLISIS DE ESTRUCTURA: 
- **Fecha:** Siempre es el punto 1 y se puede colocar en cualquier formato, que indique de manera clara una fecha y una hora específica.
- **Tipo:** Siempre poner como punto 2. Puede ser: ordinaria o extraordinaria.
- **Asistentes:** Son las personas que van a participar en la convocatoria y siempre debe tener la siguiente estructura
```
3| Asistentes:
   3.1| [Nombre Completo] - [correo@isty.edu.ec] - [Rol]
   3.2| [Nombre Completo] - [correo@isty.edu.ec] - [Rol]
   ```
- **Temas a resolver** Son los temas que van a ser tratados en la reunión, esto se arma de acuerdo a las necesidades, siempre respetando los niveles numéricos.
```
4| Temas a resolver:
   4.1| [Tema Principal]
      4.1.1| [Subtema específico]
      4.1.2| [Subtema específico]
   4.2| [Tema Principal]
      4.2.1| [Subtema específico]
```
Al final de los puntos, se coloca la sección "**CAMBIOS**", en la cual se puede colocar o no algun cambio que se solicite, en caso de no haber cambios, se coloca "**Sin cambios**".
## **Paso 2:** Validación de la Información: 
El sistema procesa automáticamente su solicitud y responderá al usuario con un correo con el formato:
```
# CORREO RECIBIDO
Asunto: Revisión de Convocatoria - IDENTIFICADORUUID 
Por favor verificar que los cambios se hayan realizado correctamente 
-----PARÁMETROS PROPUESTOS----- 
[Parámetros estructurados extraídos por IA] 
---------- POR FAVOR RESPONDER: 
- Para continuar: Responda con "APROBADO" en el cuerpo del mensaje 
- Para realizar nuevos cambios, indicar el punto a cambiar y el cambio solicitado. 
- En caso de haber más cambios, le contestaré en un minuto para verificación.
```
A continuación el usuario puede realizar dos cosas: 
   1.  **Solicitar Cambios:**  Si necesita realizar cambios, responda al correo de confirmación indicando específicamente:
```
CAMBIOS:
* Cambiar fecha a 12 ENERO 2025 a las 16:00
* Agregar asistente: Ana Torres - ana.torres@isty.edu.ec - Vocal
* Modificar punto 4.1.2 por: Distribución de recursos tecnológicos
 ```

El robot analizará los cambios, y volverá a enviar un correo con los cambios realizados a espera de confirmación.

2. **Aprobación final:**  Para aprobar definitivamente, responda con: "APROBADO".

## **Paso 3:** Generación de la Convocatoria

El sistema analizará automaticamente la información y realizará varias actividades: 
1. Programa una reunion teams para todos los asistentes incluidos en el correo.
2. Se crea documentos excel para que secretaría lleve registro de Asistencia, y Votos.
3. Se notifica mediante correo a secretaría la creación de la convocatoria, enviando adicionalmente el enlace de los dos documentos excel creados. (Ver **Toma de Registros**)
4. Genera un documento formal en formato PDF, el cual lo envía a cada uno de los asistentes secuencialmente para que se firmen, una vez firmado por todos, se envía el documento listo a secretaría. (Ver **Firmado de Documentos**)
5. Una vez firmado el documento de convocatoria, se lo remite a secretaría.
6. Se almacenan metadatos en OneDrive que serán utilizados por el bot en la segunda etapa.


Como parte final del paso 3, a secretaría le llegaran 2 correos, los cuales no es necesario responder:

**NOTIFICACIÓN DE REUNIÓN**
```
Asunto: PROGRAMACIÓN SESIÓN EXTRAORDINARIA - [CODIGO_SESION]

Cuerpo: 
Buen día.  
Se informa la programación de la sesión Extraordinaria [CODIGO_SESION] para el día [FECHA] en el cual se notificó a los siguientes asistentes:  
[Nombre Asistente1] - [correoasistente1@isty.edu.ec]
[Nombre Asistente2] - [correoasistente2@isty.edu.ec]
  
Se adjunta los links para la toma de asistencia y votos:  
ASISTENCIA:  
[Link de acceso al documento para registrar asistencia] 
VOTOS:  
[Link de acceso al documento para registrar votación] 
  
NOTA: Se procederá al firmado del acta por parte de los asistentes, una vez listo, se le notificará por este medio. 
```
**DOCUMENTO FIRMADO**
```
Asunto: CONVOCATORIA SESIÓN FIRMADO - [CODIGO_SESION]
Cuerpo: 
Buen día, Se hace la entrega del documento CONVOCATORIA SESIÓN, correspondiente a la sesión con código [CODIGO_SESION].  
  **{DOCUMENTO_ADJUNTO.pdf}**
En el cual firmaron los siguentes asistentes:  
[Nombre Asistente1] - [correoasistente1@isty.edu.ec]
[Nombre Asistente2] - [correoasistente2@isty.edu.ec]
```

# ETAPA 2: REUNIÓN
En el correo enviado a secretaría bajo el asunto *PROGRAMACIÓN SESIÓN EXTRAORDINARIA* se proporcionó enlaces a 2 archivos excel, con los cuales se trabajan en esta sección.
#### IMPORTANTE: No modifique ningún dato adicional dentro de los archivos excel, salvo los que se indiquen a continuacion. Cualquier modificación adicional puede provocar fallos en el bot al momento de procesar la información.

En esta etapa, secretaría tiene que realizar 3 actividades clave.
## **Paso 1:** Grabación de reunión Teams
 En este paso es de suma importancia asegurarse de que al grabar la reunión se configure el idioma "Español-Mexico". 
 Toda la transcripción generada de la reunión el robot la obtiene para la generacion de los documentos, por lo que si se realiza mal este paso, no se podrá obtener la información tratada en la reunión.
 
## **Paso 2:** Registro de Asistencia
Para realizar el registro de asistencia, se marca con una "x" en la columna **attendance**, para los asistentes que no asistieron, se deja el campo vacío.

| id_assistant | name | role | attendance | table |
|--------------|------|------|------------|-------|
| mfxkguhmjxwrm17ztri | Mgtr Javier Hernando Espinoza Garzón | Rector |  | asistencia |
| mfxkguhmbrgs57ekugd | Dania Portelles Cobas | Vicerrectora Académica |  | asistencia |
| mfxkguhmp7i4eprk38q | Carlos Eduardo Estrella Carrera | Vicerrector Académico |  | asistencia |

## **Paso 3:** Registro de Votaciones
En el registro de votaciones secretaría tiene la tarea de llenar las columnas: 
**option:** Es la votación que realiza el asistente, únicamente se pueden insertar los siguientes valores textualmente
- A favor
- En contra
- Abstencion

**notification:** Es un texto explicando al área que se tiene que notificar, (*Posteriormente este texto se coloca textualmente en el "Artículo 2: Notificar a ..." del documento de resolucion generado*.)
**meeting_finished:** Permite activar la segunda parte del robot, para ello colocar "x" en cualquier sitio de la columna. Se llena únicamente cuando se haya acabado la reunión y se hayan rellenado todos los campos requeridos.

| name | id_topic | topic | option | table | notification | meeting_finished |
|------|----------|-------|--------|-------|--------------|------------------|
| Asistente 1 | mfxkguhme | Tema a tratar 1 | A favor | votos |  |  |
| Asistente 2 | mfxkguhme | Tema a tratar 1 | A favor | votos |  |  |
| Asistente 1 | mfxkguhm6 | Tema a tratar 2 | A favor | votos |  |  |
| Asistente 2 | mfxkguhm6 | Tema a tratar 2 | En contra | votos |  |  |

### Proceso Adicional 1: Agregar nuevos temas
Si durante la reunión surge la necesidad de tratar nuevos temas, es necesario colocarlos al final del documento, siempre llenando las columnas **"name"**, **"topic"**, **"table"**. La columna **"id_topic"** no debe ser llenada.

| name | id_topic | topic | option | table | notification | meeting_finished |
|------|----------|-------|--------|-------|--------------|------------------|
| Asistente 1 | mfxkguhme | Tema a tratar 1 | A favor | votos |  |  |
| Asistente 2 | mfxkguhme | Tema a tratar 1 | A favor | votos |  |  |
| Asistente 1 | mfxkguhm6 | Tema a tratar 2 | A favor | votos |  |  |
| Asistente 2 | mfxkguhm6 | Tema a tratar 2 | En contra | votos |  |  |
| Asistente 1 | | TEMA NUEVO |  | votos |  |  |
| Asistente 2 | | TEMA NUEVO |  | votos |  |  |


### Proceso Adicional 2: Eliminar temas
Si durante la reunión, algún tema se pospone para otra reunión, o no se trata, en necesario eliminar los registros.
Para este ejemplo no se trata el tema llamado *"Tema a tratar 2"*, por lo tanto se elimina todos los registros de dicho tema.
| name | id_topic | topic | option | table | notification | meeting_finished |
|------|----------|-------|--------|-------|--------------|------------------|
| Asistente 1 | mfxkguhme | Tema a tratar 1 | A favor | votos |  |  |
| Asistente 2 | mfxkguhme | Tema a tratar 1 | A favor | votos |  |  |
| Asistente 1 | | TEMA NUEVO |  | votos |  |  |
| Asistente 2 | | TEMA NUEVO |  | votos |  |  |


# ETAPA 3: ELABORACIÓN DE RESOLUCIONES.
Una vez activada esta fase, el robot se encarga de obtener y procesar toda la información registrada, con el fin de generar los documentos pertinentes.
## **Paso 1:** Generación de Acta:  
El primer documento generado es el *"Acta de reunión"* el cual pasa por el proceso de firmado con todos los asistentes que fueron a la reunión. Esta parte es la misma que el firmado de la *"Convocatoria"* terminando con el documento firmado por todos los asistentes siendo remitido a secretaría.

## **Paso 2:** Análisis de Considerandos:
El robot obtendrá distintos artículos referente a cada uno de los temas tratados en la reunión,  y remitirá un link a secretaría para que se analicen, se deberá abrir el link, utilizar el sistema para ordenar o filtrar los artículos y confirmar. 
## **Paso 3:** Generación de Resoluciones:
Posteriormente se generan los distindos documentos de resoluciones los cuales son remitidos a secretaría.





# **PROCEDIMIENTOS ADICIONALES: FIRMADO DE DOCUMENTOS
El proceso de firmado de documentos funciona de la misma manera para la convocatoria como para el acta de reunión, y el bot lo activa automáticamente cuando crea dichos documentos y necesitan ser firmados. Para ellos se sigue este proceso.
1. El bot envía al primer asistente el siguiente correo. 
```
Asunto: ACTA DE REUNIÓN - [CODIGO_SESION]
Cuerpo:
Buenos dias, se solicita su ayuda firmando la siguiente acta de reunión.  
  **{DOCUMENTO_ADJUNTO.pdf}**
Por favor, únicamente responder a este mensaje con el archivo adjunto firmado.
```
El asistente tiene que descargar el archivo, firmarlo y reenviarlo al mismo correo, el robot lo recibe, y lo reenvia consecutivamente a todos los asistentes de la reunión, y una vez firmado por todos, lo remite a secretaría.
### CASOS ESPECIALES:
Para validar que un documento haya sido firmado el bot analiza el nombre del archivo, por lo cual el asistente no deberá modificar el nombre del mismo, salvo por la etiqueta **<-signed>** que se genera en el archivo luego de ser firmado.

Analizando lo anterior, el bot no procesará la respuesta del asistente, si se llega a este punto, el asistente tendrá que enviar nuevamente el documento firmado en los siguientes casos:
CASO 1: Cuando el asistente envía el mismo archivo sin firmar. (Se envía el archivo con el mismo nombre que recibió)
CASO 2: Cuando el asistente envía otro archivo diferente. (Se envía un archivo con otro nombre)
En ambos casos se le notifica al asistente con el siguiente correo 
```
Asunto: AVISO NO SE RECIBIÓ CONVOCATORIA SESIÓN - [CODIGO_SESION]
Cuerpo:
No se recibió el documento firmado, por favor revisar nuevamente y reenviar el archivo por este medio o por el hilo principal. 
**{DOCUMENTO_ADJUNTO.pdf}** 
NOTA:  
Para poder dar un documento como válido, en su nombre deber contener el mismo nombre del archivo que se le envió anteriormente.
```
Si el asistente no responde al correo con el documento firmado en un plazo de tiempo, el bot realizará lo siguiente:
ACCIÓN 1:  Enviará un correo al asistente cada 30 minutos recordando enviar el archivo firmado
```
Asunto: Por favor su atencion - [CODIGO_SESION]
Cuerpo:
Se solicita su ayuda con la firma del convocatoria sesión OCS-SE-010-2025.  
Puede reenviarla por este medio, o respondiendo al correo principal que se le envió previamente.  
Muchas gracias.
**{DOCUMENTO_ADJUNTO.pdf}** 

```
ACCIÓN 2: Si el asistente no responde en los 3 avisos, se notificará a secretaría.
```
Asunto: NOTIFICACIÓN - Acta sin firmar
Cuerpo:
Buen día, La persona [Nombre Asistente] con el correo [correo@isty.edu.ec] ha superado el máximo de notificaciones, para continuar, favor notificarle personalmente que me ayude reenviando la convocatoria sesión firmada.  
Muchas gracias.
```



# B. MANUAL DE CONFIGURACIÓN
Se necesita tener instalado docker previamente para ejecutar los contenedores.
Para iniciar el proyecto descargar el proyecto desde github
```
git clone https://github.com/City-ISTY/Resoluciones.git
```
Una vez descargado el proyecto se necesita configurar las siguientes variables de entorno
ISTY_USERNAME= correo electrónico del robot para scrapping "city.isty@uce.edu.ec"
ISTY_PASSWORD= contraseña del correo.

Luego iniciar los contenedores con la siguiente instrucción en la ubicación donde se encuentra el archivo docker-compose.yml
```
docker-compose build
docker-compose up
```

El scrapper de teams, se inicia aparte ejecutando en la terminal
```
python teams_scrapper/app.py
```
Lo cual instanciará un servicio en el puerto 8000.
NOTA: Para hacer peticiones a este servicio, utilizar de preferencia la IP local de la máquina (se accede a ella mediante ipconfig)\

## BASE DE DATOS 
Para este proyecto se utiliza una base de datos supabase. Las conexiones las gestiona n8n mediante las api keys generadas en su paguina.

Para ello se utilizaron las siguientes tablas: 
**sessions_resolutions:** Almacena el número actual de la resolucion, sesión ordinaria y extraordinaria que maneja el instituto.
```
create table sessions_resolutions ( 
id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY, 
extraordinary_session_number integer, 
ordinary_session_number integer, 
resolution_number integer, last_session_type text ); 

insert into sessions_resolutions (extraordinary_session_number, ordinary_session_number, resolution_number, last_session_type) values (8, 12, 118, 'E');
```
**documents:** Almacena los embeddings de las leyes.
NOTA: El tamaño de **embedding** se configura de acuerdo al modelo embedding, para este caso se utiliza Gemini *"models/embedding-001"* el cual genera un embedding de 3072 dimensiones.
 
```
create  table documents (
	id bigserial primary key,
	content text,  -- contenido del artículo
	metadata jsonb,  -- metadata del artículo
	embedding vector(3072)  -- embedding del texto
);
-- Create a function to search for documents
CREATE FUNCTION match_documents (
    query_embedding vector(3072),
    match_count int DEFAULT NULL,
    filter jsonb DEFAULT '{}'
) 
RETURNS TABLE (
    id bigint,
    content text,
    metadata jsonb,
    similarity float
)
LANGUAGE plpgsql
AS $$
#variable_conflict use_column
BEGIN
    RETURN QUERY
    SELECT
        id,
        content,
        metadata,
        1 - (documents.embedding <=> query_embedding) AS similarity
    FROM documents
    WHERE metadata @> filter
    ORDER BY documents.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
```
**email_send_metadata:** lleva un registro de los emails mal enviados. (Lo utiliza el módulo para firmar en N8N)
```
CREATE TABLE email_send_metadata (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  ids_wrong_emails TEXT[], --guarda todos los id's de los correos que un usuario envía incorrectamtent (PDF MAL ENVIADOS)
  remaining_time TEXT, --tiempo restante antes de notificar al usuario
  lives_remaining INTEGER --cantidad de notificaciones que se le realizan antes de avisar a secretaría
);

INSERT INTO email_send_metadata (ids_wrong_emails, remaining_time, lives_remaining)
VALUES ('{}', '', 3);
```
**lastmodified:** Permite lleva un único registro de cúando fué la ultiza vez se subió un archivo en la carpeta *Normativas*. Lo utiliza el algoritmo de generación de embeddings para detectar un nuevo archivo. (Cuando se suben muchos de golpe). La fecha debe estar en formato ****ISO 8601****
```
CREATE TABLE lastmodified(
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  last_modified TEXT   --Fecha y hora del último documento procesado por el bot.
); 
INSERT INTO lastmodified(last_modified)
VALUES ('2025-09-22T13:41:47Z');
```
**whereas_clauses:** Lleva un registro de los considerandos que se le muestran a secretaría para se elija a los más óptimos o que más se ajusten con la resolucion
```
CREATE TABLE IF NOT EXISTS whereas_clauses (
    id BIGSERIAL PRIMARY KEY,
    resolution TEXT,
    whereasIA TEXT[],
    whereasUSER TEXT[]
);
```
**whereas_clauses_DATATRAINING:** Tabla para guardar datos para posterior entrenamiento de modelo
El modelo va a elegir de entre un grupo de artículos, los que elija se guardan en whereasUSER, los que no elija se guardan en whereasIA. 
Al final cuando el usuario elija cuáles son los artículos finales, se guardan en whereasFINALCHOICE
```
CREATE TABLE IF NOT EXISTS whereas_clauses_DATATRAINING (
    id BIGSERIAL PRIMARY KEY,
    resolution TEXT,
    whereasIA TEXT[],
    whereasUSER TEXT[],
    whereasFINALCHOICE TEXT[]
);
```
## N8N
Se accede mediante la url 
```
http://localhost:5678/home/workflows
```
Si se ejecuta por primera vez se tiene que crear una cuenta, los workflows se guardan en la cuenta creada, tener cuidado con perder la clave.

### ESTRUCTURA DE WORKFLOWS
El proyecto está dividido en multiples workflows que hacen tareas diversas
#### MAIN_CONVOCATORIA: 
Es el primer flujo que se ejecuta, encargado de crear la convocatoria y reuniones.
#### MAIN_ACTA_RESOLUCIÓN:
Es el segundo flujo que se ejecuta luego de la reunión, encargado de crear el Acta y las Resoluciones.
#### SEND_PDF_TO_SIGN:
Permite enviar consecutivamente un PDF para ser firmado por diferentes personas.
**ENTRADAS:**
- `subject`: Asunto del correo electrónico que se enviará a los firmantes
- `meeting_type`: Tipo de reunión (Ej: Ordinaria, Extraordinaria)
- `session_code`: Código único que identifica la sesión
- `binary_pdf_file_item`: Datos binarios del archivo.
- `attendees`: Lista de objetos con la información de las personas que deben firmar.
```
{
  "subject": "DOCUMENTACION TEST",
  "meeting_type": "Extraordinaria",
  "session_code": "OCS-SE-009-2025",
  "binary_pdf_file_item":{},
  "attendees": [
  {
    "name": "Andrés Tituana",
    "mail": "alvaro.andres1996@hotmail.com",
    "role": "Desarrollador",
    "id_assistant": "mfx2fwn9yvxdbrdn97"
  }...
]
}
``` 
#### CREATE_EXCEL: 
Permite crear y almacenar datos en un archivo excel en onedrive
**ENTRADAS:**
 - `array`: Array de objetos, donde se coloca los datos que va a contener el excel.
 - `file_name`: Nombre del excel (sin extensión).
 - `header_row`: Booleano que indica si se toma el encabezado de los datos ingresados.
 - `parent_folder`: id de la carpeta onedrive donde se guardará el archivo.
```
{
  "array":  [
  {
    "id_assistant": "Juan",
    "name": "Pérez",
    "role": 30,
    "attendance": false,
    "table": "asistencia"
  },
    {
    "id_assistant": "Juan",
    "name": "Pérez",
    "role": 30,
    "attendance": false,
    "table": "asistencia"
  }
],
  "file_name": "SDJFJASHDF",
  "header_row": true,
  "parent_folder": "01ZX2MQXNB22VZ2SIBENE25GIC4JVGCVFN"
}
```

#### SAVE_METADATA: 
Almacena metadatos de la reunión
**ENTRADAS:**
-   `id_meeting`: Identificador único de la reunión (UUID).
-   `meeting_url`: Enlace de acceso a la reunión de Teams.
-   `meeting_datetime_ISO8631`: Fecha y hora de la reunión en formato ISO 8631.
-   `convocation_date_ISO8631`: Fecha de convocatoria en formato ISO 8631.
-   `meeting_type`: Tipo de reunión (Ej: "Ordinaria").
-   `session_code`: Código único de la sesión.
-   `attendees`: Array de asistentes con nombre, correo y rol.
-   `topics`: Array de temas a tratar, cada uno con sus subtemas.

```
{
  "id_meeting": "e03dc9b9-f26f-4ff5-a0b6-7a464f908ed4",
  "meeting_url": "https://teams.microsoft.com/l/meetup-join/19%3ameeting_YjFmOGRkMGItNmI4Ni00YmI3LTgyNjgtZjg2NmI1ZGNlNGRj%40thread.v2/0?context=%7b%22Tid%22%3a%229d91e1e7-5249-4205-8c19-8d1d9e333a60%22%2c%22Oid%22%3a%228cb570fb-7f11-4fc7-9acf-8c1f5c0d22fa%22%7d",
  "meeting_datetime_ISO8631": "2025-09-24T13:00:00.0000000",
  "convocation_date_ISO8631": "2025-09-22",
  "meeting_type": "Ordinaria",
  "session_code": "OCS-SO-038-2025",
  "attendees": [
    {
      "name": "Andrés Tituana",
      "mail": "alvaro.andres1996@hotmail.com",
      "role": "Papá"
    }
  ],
  "topics": [
    {
      "topic": "Aprobación de la designacion de los miembros del comité de ética...",
      "sub_topics": [
        "Msc. Alfredo Armando Rodríquez Guzman, representante del Rector..."
      ]
    }
  ]
}
```

#### PDF_CONVOCATORIA
Crea un PDF de reunión con información de convocatoria, asistentes y temas a tratar.

**ENTRADAS:**
-   `meeting_type`: Tipo de reunión (Ej: "Ordinaria").
-   `meeting_datetime_ISO8631`: Fecha y hora de la reunión en formato ISO 8631.
-   `convocation_date_ISO8631`: Fecha de convocatoria en formato ISO 8631.
-   `session_code`: Código único de la sesión.
-   `attendees`: Array de asistentes con nombre y rol.
-   `teams_link`: Enlace de acceso a la reunión de Teams.
-   `meeting_topics`: Array de temas con sus respectivos subtemas.

```
{
  "meeting_type": "Ordinaria",
  "meeting_datetime_ISO8631": "2030-09-14T16:30:45.123-04:00",
  "convocation_date_ISO8631": "2000-09-14T16:30:45.123-04:00",
  "session_code": "OCS-SE-011-2025",
  "attendees": [
    {
      "name": "MSc. Dania Elena Portelles Cobas",
      "role": "Vicerrectora Académica Instituto Superior Tecnológico Yaruquí"
    }
  ],
  "teams_link": "https://teams.microsoft.com/l/meetup-join/19%3ameeting_MWRhZmU2OTAtODg1NC00MzZhLWFlZDUtNzg2ZWJlYTdkOTc2%40thread.v2/0?context=%7b%22Tid%22%3a%229d91e1e7-5249-4205-8c19-8d1d9e333a60%22%2c%22Oid%22%3a%228038f49d-8ca5-4b09-8893-163609f74dd1%22%7d",
  "meeting_topics": [
    {
      "topic": "Aprobación de la designacion de los miembros del comité de ética...",
      "sub_topics": [
        "Msc. Alfredo Armando Rodríquez Guzman, representante del Rector..."
      ]
    }
  ]
}
```

#### PDF_ACTA
Genera un archivo PDF del acta de reunión con toda la información de sesión, asistentes, temas tratados y resultados de votación.
**ENTRADAS:**
-   `id`: Identificador único de la reunión (UUID).
-   `meeting_datetime_ISO8631`: Fecha y hora de la reunión en formato ISO 8631.
-   `convocation_date_ISO8631`: Fecha de convocatoria en formato ISO 8631.
-   `meeting_type`: Tipo de reunión (Ej: "Ordinaria").
-   `session_code`: Código único de la sesión.
-   `attendees`: Array de asistentes con nombre, correo, rol e identificador.
-   `meeting_topics`: Array de temas tratados con detalles completos de votación, resolución y resultado.
-   `attendances`: Array de registros de asistencia confirmada.
```
{
  "id": "15ff9c50-5ba2-4149-a116-880fe2cdccbd",
  "meeting_datetime_ISO8631": "1996-12-12T12:00:00.0000000",
  "convocation_date_ISO8631": "2025-09-16",
  "meeting_type": "Ordinaria",
  "session_code": "OCS-SO-008-2025",
  "attendees": [
    {
      "name": "Andrés Tituana",
      "mail": "alvaro.andres1996@hotmail.com",
      "role": "Representante de Estudiantes",
      "id": "df9ac23b-0a40-4d7e-9a08-e3d7c7043236"
    }
  ],
  "meeting_topics": [
    {
      "topic": "Aprobación de la designacion de los miembros del comité de ética...",
      "sub_topics": ["Msc. Alfredo Armando Rodríquez Guzman..."],
      "id": "ce5168aa-5115-431b-b002-ba007ae01ace",
      "resolution_code": "R-OCS-SO-013-Nro.119-2025",
      "vote_count_object": {"AF": 1, "EC": 1, "AB": 0, "RECTOR_VOTE": "EC"},
      "votes": [...],
      "approved": false,
      "meeting_summary": "Resumen de la discusión...",
      "reformulacion": "Texto reformulado del tema",
      "desition": "Decisión final tomada"
    }
  ],
  "attendances": [
    {
      "id": "recAOh1pnAvzykAlg",
      "name": "Jennifer Tituana",
      "role": "Miembro de la comisión de Etica",
      "attendance": true
    }
  ]
}
```

#### PDF_RESOLUTION
Genera un archivo PDF de resolución oficial basado en los datos de la reunión y considerandos legales.
**ENTRADAS:**
-   `tipo_reunion`: Tipo de reunión (Ej: "Ordinaria").
-   `fecha_reunion`: Fecha de la reunión en formato ISO 8631.
-   `cod_sesion`: Código único de la sesión.
-   `tema_reunion`: Objeto con toda la información de la reunión y tema específico a resolver.
-   `considerandos`: Array de fundamentos legales que sustentan la resolución.
```
{
  "tipo_reunion": "Ordinaria",
  "fecha_reunion": "2025-09-24T13:00:00.0000000",
  "cod_sesion": "OCS-SO-038-2025",
  "tema_reunion": {
    "json": {
      "id_meeting": "e03dc9b9-f26f-4ff5-a0b6-7a464f908ed4",
      "meeting_datetime_ISO8631": "2025-09-24T13:00:00.0000000",
      "session_code": "OCS-SO-038-2025",
      "attendees": [
        {
          "name": "Andrés Tituana",
          "role": "Papá",
          "id_assistant": "mfumbx9avyrqw3jqn3i"
        }
      ],
      "number_sessions_updated": {
        "resol_number": 196,
        "ordinary_number_session": 38
      },
      "topic": {
        "topic": "Aprobación de cambio de fecha en la ceremonia de graduación...",
        "resolution_code": "R-OCS-SO-038-Nro.196-2025",
        "meeting_summary": "Resumen de la discusión del tema..."
      }
    }
  },
  "considerandos": [
    "Que, el artículo 353 de la Constitución de la República del Ecuador indica...",
    "Que, el artículo 14 de la Ley Orgánica de Educación Superior (LOES) indica..."
  ]
}
```
#### GENERACION_CONSIDERANDOS
Returna artículos legales que respalden alguna resolución
**ENTRADAS:**
-   `resolucion`: Tema o resolución, del cual se desea obtener artículos legales.
```
{
    "resolucion": "Revisión de la solicitud para el ingreso del estudiante mediante examen complexivo fuera del cronograma."
}
```

#### GENERACION_EMBEDDINGS
Escucha activamente una carpeta en búsqueda de nuevas leyes, las analiza, genera embeddings y los almacena en la base de datos vectorial para que el bot las utilice posteriormente.
- Se escucha activamente la carpeta **NORMATIVAS**.
- Es importante revisar los nombres de los archivos que se encuentran almacenados en dicha carpeta, ya que si se quiere sustituir una Ley, o actualizar, es importante subirla con el mismo nombre de archivo con el que se subió por primera vez.