from flask import Flask, request, jsonify
from PyPDF2 import PdfReader
import io

app = Flask(__name__)

@app.route('/extract-text', methods=['POST'])
def extract_text():
    if 'file' not in request.files:
        return jsonify({'error': 'No se envió ningún archivo'}), 400
    
    file = request.files['file']
    
    if file.filename.split('.')[-1].lower() != 'pdf':
        return jsonify({'error': 'El archivo debe ser PDF'}), 400

    try:
        pdf_stream = io.BytesIO(file.read())
        pdf_reader = PdfReader(pdf_stream)
        text = ""
        
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        
        return text.strip()

    except Exception as e:
        return jsonify({'error': 'Error procesando el PDF: ' + str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)