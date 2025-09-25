FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY pdf_reader.py .

EXPOSE 5000

CMD ["python", "pdf_reader.py"]