FROM python:3.11.8

WORKDIR /app/server/users

COPY . .

RUN pip install -r requirements.txt
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
EXPOSE 8000