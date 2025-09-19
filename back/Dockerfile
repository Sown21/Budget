FROM python:3.12-slim-bookworm

WORKDIR /app

RUN apt-get update && apt-get install -y cron

# RUN mkdir -p /app/data/

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8022

RUN crontab /app/utils/mycron

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]