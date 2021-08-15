FROM python:3
ENV PYTHONUNBUFFERED=1

#RUN apt-get update \
#    && apt-get install -y --no-install-recommends \
#        postgresql-client \
#    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .

EXPOSE 8000
CMD ["python", "./app/manage.py", "migrate"]
CMD ["python", "./app/manage.py", "runserver", "0.0.0.0:8000"]
