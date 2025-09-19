# 1. Imagen base
# Se utiliza la misma imagen y versión que tenías en tu docker-compose.
FROM n8nio/n8n: 1.111.1

# --- Instalación de dependencias para el nodo Tesseract ---
# Se necesita el motor Tesseract OCR en el sistema.
# Cambiamos a usuario root para poder instalarlo.
USER root




# 3. Crear el directorio para los nodos personalizados
RUN mkdir -p /home/node/.n8n/nodes

# 4. Establecer ese directorio como el de trabajo
WORKDIR /home/node/.n8n/nodes

# 5. Instalar el nodo de Tesseract de forma limpia, sin dependencias conflictivas
RUN npm init -y  && npm install n8n-nodes-tesseractjs@0.1.0

# 2. Exponer el puerto
# Esta instrucción documenta que el contenedor escuchará en el puerto 5678.
# La asignación real al puerto de tu máquina (el "mapping") se sigue haciendo
# en el docker-compose.yml.
EXPOSE 5678

# 3. Declarar el volumen
# Esto define un punto de montaje para los datos de n8n. La vinculación
# con la carpeta local ./.n8n (bind mount) se mantiene en el docker-compose.yml,
# ya que es una configuración de tiempo de ejecución.
VOLUME /home/node/.n8n

# El comando para iniciar la aplicación (CMD) ya está definido en la imagen base,
# por lo que no es necesario añadirlo aquí a menos que quieras sobreescribirlo.

USER node