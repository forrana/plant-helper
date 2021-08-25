FROM python:3-slim
ENV PYTHONUNBUFFERED=1

#RUN apt-get update \
#    && apt-get install -y --no-install-recommends \
#        postgresql-client \
#    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .
RUN chmod +x docker-entrypoint.sh

EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app.wsgi"]