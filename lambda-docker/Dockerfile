FROM public.ecr.aws/lambda/python:3.9

COPY requirements.txt ./

COPY app.py ./

RUN pip3 install -r requirements.txt &&\
    python -m spacy download en_core_web_md

CMD ["app.lambda_handler"]

