FROM python:3.12-slim-bookworm

WORKDIR /app

RUN mkdir -p /app/data

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8022

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]