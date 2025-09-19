from flask import Flask, request, jsonify
import subprocess
import re

app = Flask(__name__)

def execute_robot_and_capture_output(meeting_id, filename):
    """
    Ejecuta Robot Framework y captura la salida incluyendo el texto de la transcripción
    """
    print(f"🤖 Iniciando automatización para meeting_id: {meeting_id}...")
    
    try:
        command = [
            "robot",
            "--variable", f"MEETING_ID:{meeting_id}",
            "--variable", f"FILENAME:{filename}",
            "test_chrome.robot"
        ]
        
        result = subprocess.run(command, capture_output=True, text=True, check=True)
        
        # Buscar el texto de la transcripción en la salida
        transcript = extract_transcript_from_output(result.stdout)
        
        print("✅ Automatización completada")
        return {
            "success": True,
            "output": result.stdout,
            "transcript": transcript
        }
        
    except subprocess.CalledProcessError as e:
        error_msg = f"Error en Robot Framework: {e.stderr}"
        print(f"❌ {error_msg}")
        return {
            "success": False,
            "error": error_msg
        }

def extract_transcript_from_output(output):
    """
    Extrae el texto de la transcripción de la salida de Robot Framework
    usando los marcadores que bota el script de Robot
    """
    pattern = r'=== TRANSCRIPT START ===(.*?)=== TRANSCRIPT END ==='
    match = re.search(pattern, output, re.DOTALL)
    
    if match:
        return match.group(1).strip()
    else:
        return "No se pudo extraer la transcripción de la salida"

@app.route('/run-automation', methods=['GET'])
def trigger_robot_automation():
    meeting_id = request.args.get('meeting_id', 'default_meeting_id')
    filename = request.args.get('filename', 'default_filename')

    # Ejecutar Robot Framework de forma síncrona
    result = execute_robot_and_capture_output(meeting_id, filename)
    
    if result['success']:
        response_message = {
            "status": "completado",
            "meeting_id": meeting_id,
            "transcript": result['transcript'],
            "output": result['output']
        }
        return jsonify(response_message), 200
    else:
        response_message = {
            "status": "error",
            "message": result['error']
        }
        return jsonify(response_message), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)