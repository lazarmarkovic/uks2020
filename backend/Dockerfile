FROM python:3
ENV PYTHONUNBUFFERED 1

RUN mkdir /code
WORKDIR /code

COPY ./requirements.txt /code/

RUN pip install --upgrade pip
RUN pip uninstall psycopg2
RUN pip install --upgrade wheel
RUN pip install --upgrade setuptools
RUN pip install -r requirements.txt

ADD . /code

RUN ["chmod", "+x", "wait_for_postgres.sh"]
RUN ["chmod", "+x", "start.sh"]

ENTRYPOINT ["./wait_for_postgres.sh"]