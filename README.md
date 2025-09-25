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
