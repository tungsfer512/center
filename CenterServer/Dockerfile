FROM python:3.9

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

ARG DJANGO_ALLOWED_HOSTS
ARG DJANGO_SECRET_KEY
ARG DJANGO_CORS_ORIGIN_WHITELIST

ENV DJANGO_ALLOWED_HOSTS $DJANGO_ALLOWED_HOSTS
ENV DJANGO_SECRET_KEY $DJANGO_SECRET_KEY
ENV DJANGO_CORS_ORIGIN_WHITELIST $DJANGO_CORS_ORIGIN_WHITELIST

RUN apt-get update
RUN apt-get install -y gcc python3-dev musl-dev  libffi-dev
RUN apt-get install -y libpcap-dev
# RUN apt-get --no-install-recommends install libreoffice -y
# RUN apt-get install -y libreoffice-java-common
# RUN apt-get install -y default-jdk

# RUN apt-get install -y graphviz

RUN mkdir /CenterServer
WORKDIR /CenterServer
RUN pip install --upgrade pip

COPY . .

RUN pip install -r requirements.txt
RUN pip install django==3.2
RUN pip install djangorestframework
# RUN pip install ksql


EXPOSE 9000
