FROM ppodgorsek/robot-framework:latest

# Cambiar al usuario root temporalmente para instalar dependencias
USER root

# Instalar dependencias de Python específicas de tu proyecto
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Crear directorio para la aplicación Flask
WORKDIR /app

# Copiar los archivos de tu proyecto
COPY . .

# Exponer el puerto de Flask
EXPOSE 5000
# Cambiar permisos para que el usuario robotframework pueda escribir

RUN chown -R root:root /app


# Comando para ejecutar la aplicación Flask
CMD ["python", "app.py"]