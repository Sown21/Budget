FROM python:3.12-slim-bookworm

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8022

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8022", "--workers", "1"]
