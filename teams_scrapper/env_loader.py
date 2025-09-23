# env_loader.py
from dotenv import load_dotenv
import os

# Cargar .env automáticamente desde el mismo directorio
load_dotenv(dotenv_path=".env")

# Asignar variables que Robot Framework puede usar
ISTY_USERNAME = os.getenv("ISTY_USERNAME")
ISTY_PASSWORD = os.getenv("ISTY_PASSWORD")

# Opcional: comprobar que se cargaron correctamente
if not all([ ISTY_USERNAME, ISTY_PASSWORD]):
    raise ValueError("Faltan variables en el archivo .env")
