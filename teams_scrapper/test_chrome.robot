*** Settings ***
Library    SeleniumLibrary
Library    OperatingSystem
Library    RequestsLibrary
Variables   ./env_loader.py

*** Variables ***
${SUPABASE_URL}    https://uxikkcrsgpojdywpljwa.supabase.co
${SUPABASE_KEY}    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4aWtrY3JzZ3BvamR5d3BsandhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzU5OTI1OCwiZXhwIjoyMDczMTc1MjU4fQ.1TQSoJygPfp8CfU2HCv2fPRwgs9M9yvsJOUAV5h7PC8
${DOWNLOAD_DIR}      ${CURDIR}${/}downloads  
${FILENAME}    default_filename
${MEETING_ID}    default_meeting_id
${HEADLESS_ENABLED}    ${False}    # Cambia a ${False} para ver el navegador



*** Test Cases ***
MAIN
    DESCARGAR TRANSCRIPCION
    SUBIR TEXTO TRANSCRIPCION
    
        

*** Keywords ***
DESCARGAR TRANSCRIPCION
    Log To Console    \n🔍 DEBUG: MEETING_ID recibido = ${MEETING_ID}
    Log To Console    🔍 DEBUG: FILENAME recibido = ${FILENAME}
    
 # --- INICIO DE LA CONFIGURACIÓN HEADLESS ---
    
    # Crea un diccionario con las preferencias de Chrome.
    # Esto es VITAL para que las descargas funcionen en modo headless.
    # Le decimos a Chrome que descargue los archivos automáticamente en tu directorio especificado.
    ${prefs}=    Create Dictionary    download.default_directory=${DOWNLOAD_DIR}
    # Importamos las opciones de Chrome de Selenium y las instanciamos
    ${chrome_options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys


    # Añadimos los argumentos para el modo headless y otras buenas prácticas
    Run Keyword If    ${HEADLESS_ENABLED}    Call Method    ${chrome_options}    add_argument    --headless
    Call Method    ${chrome_options}    add_argument    --no-sandbox
    Call Method    ${chrome_options}    add_argument    --disable-dev-shm-usage
    Call Method    ${chrome_options}    add_argument    --disable-gpu
    Evaluate    $chrome_options.add_argument('--window-size=1920,1080')
    

    # Aplicamos las preferencias de descarga que creamos antes
    Call Method    ${chrome_options}    add_experimental_option    prefs    ${prefs}
    # --- FIN DE LA CONFIGURACIÓN HEADLESS ---


    Open Browser    https://teams.microsoft.com/l/chat/19:${MEETING_ID}@thread.v2    chrome    options=${chrome_options}
    Log To Console    HOLA SENIORES SDFASDFLKJAS JDKLFH
    Log To Console  https://teams.microsoft.com/l/chat/19:meeting_${MEETING_ID}@thread.v2   

    # Locator mucho más robusto apuntando directamente al botón
    ${locator}=    Set Variable    xpath=//button[@data-tid='joinOnWeb']
    ${elemento}=    Get Web Element    ${locator}
    # Espera a que el botón esté visible y listo para ser clickeado
    Wait Until Element Is Visible    ${locator}    timeout=120s
    Wait Until Element Is Enabled    ${locator}    timeout=120s
    Execute Javascript    arguments[0].click();    ARGUMENTS    ${elemento}
    #Log To Console      Página de inicio de sesión cargada correctamente.
    # Ingresar credenciales 
    Wait Until Element Is Visible    id=i0116    timeout=120s
    Wait Until Element Is Enabled    id=i0116    timeout=120s
    Input Text    id=i0116    ${ISTY_USERNAME}
    #Log To Console    ✅ CORREO COLOCADO correctamente

    Wait Until Element Is Visible    id=idSIButton9    timeout=120s
    Wait Until Element Is Enabled    id=idSIButton9    timeout=120s
    Click Element    id=idSIButton9
    #Log To Console    ✅ bOTON INICIAR SESION clickeado correctamente


    # Esperar y completar contraseña
    Wait Until Element Is Visible    id=i0118    timeout=120s
    Wait Until Element Is Enabled    id=i0118    timeout=120s
    Input Text    id=i0118    ${ISTY_PASSWORD}
    #Log To Console    ✅ contrasenia aniadida correctamente

    Wait Until Element Is Visible    id=idSIButton9    timeout=120s
    Wait Until Element Is Enabled    id=idSIButton9    timeout=120s
    Click Element    id=idSIButton9
    #Log To Console    ✅ BOTON iniciar  clickeado correctamente

    # Manejar "¿Quieres mantener la sesión iniciada?"
    Wait Until Element Is Visible    id=idSIButton9    timeout=120s
    Wait Until Element Is Enabled    id=idSIButton9    timeout=120s
    Click Element    id=idSIButton9
    #Log To Console    ✅ Botón ¿Quieres mantener la sesión iniciada? clickeado correctamente

# Esperar a que el botón esté disponible
    #${locator}=    Set Variable    xpath=//button[@aria-label='Transcript']
    ${locator}=    Set Variable    css:button.artifactsButtonContainer span.fui-Text
    Wait Until Element Is Visible    ${locator}    timeout=120s
    Wait Until Element Is Enabled    ${locator}    timeout=120s
    # Hacer clic en el botón
    Click Element    ${locator}
    #Log To Console    ✅ Botón Transcript clickeado correctamente



# Esperar a que el botón esté disponible
    ${locator}=    Set Variable    id=downloadTranscript
    Wait Until Element Is Visible    ${locator}    timeout=120s
    Wait Until Element Is Enabled    ${locator}    timeout=120s
    
    # Hacer clic en el botón
    Click Element    ${locator}
    #Log To Console    ✅ Botón Download clickeado correctamente


# Esperar a que el botón esté disponible
    ${locator}=    Set Variable    id=downloadAsVtt
    Wait Until Element Is Visible    ${locator}    timeout=120s
    Wait Until Element Is Enabled    ${locator}    timeout=120s
    
    # Hacer clic en el botón
    Click Element    ${locator}
    #Log To Console    ✅ Botón tovvt clickeado correctamente
    Wait Until Keyword Succeeds    120s    2s    La Carpeta De Descargas Debería Contener Un Archivo VTT
    #Log To Console    ✅ ¡Archivo .vtt descargado con éxito!
    Close Browser

*** Keywords ***
# ... (Aquí va tu keyword DESCARGAR TRANSCRIPCION) ...
# ... (Aquí va tu keyword SUBIR TEXTO TRANSCRIPCION) ...

La Carpeta De Descargas Debería Contener Un Archivo VTT
    ${archivos_vtt}=    List Files In Directory    ${DOWNLOAD_DIR}    *.vtt
    Should Not Be Empty    ${archivos_vtt}    msg=Aún no se ha descargado ningún archivo .vtt



*** Keywords ***
SUBIR TEXTO TRANSCRIPCION
    # Leer archivo
    ${archivos}=    List Files In Directory    ${DOWNLOAD_DIR}    *.vtt
    ${ruta_archivo}=    Set Variable    ${DOWNLOAD_DIR}${/}${archivos[-1]}
    ${texto}=    Get File    ${ruta_archivo}
    
    # Enviar a Supabase
    &{data}=    Create Dictionary
    ...    content=${texto}
    ...    filename=${FILENAME}
    ...    meeting_id=${MEETING_ID}

    &{headers}=    Create Dictionary
    ...    apikey=${SUPABASE_KEY}
    ...    Authorization=Bearer ${SUPABASE_KEY}
    ...    Content-Type=application/json


    #POST    ${SUPABASE_URL}/rest/v1/transcripts
    #...    json=${data}
    #...    headers=${headers}
    #
    #Log    ✅ Texto subido!
    Log To Console    \n=== TRANSCRIPT START ===
    Log To Console    ${texto}
    Log To Console    === TRANSCRIPT END ===
    ## Limpiar el directorio de descargas
    Empty Directory    ${DOWNLOAD_DIR}
    #Log    🗑️ Directorio de descargas limpiado.
