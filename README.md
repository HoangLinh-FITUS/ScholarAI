# ScholarAI

A web application that allows users to enter any description or query, and the system automatically finds and returns the research papers most similar in content.

# architecture diagram
![alt text](<assets/architecture.png>)

# use case diagram
![alt text](assets/use-case.png)

# link drive chứa key nhạy cảm, hoặc .env, ...v.v.. :> 
thay những file .example bằng những file trong [link drive](https://drive.google.com/drive/folders/14mXVBw-TFMgtKJ3yng_V9HZ98oszseGo?usp=sharing)

# cach chay project trong docker
***chạy server/predict -> điền đầy đủ file .env -> chạy docker***

Chạy project trong cmd
```docker
docker-compose up -d --build 
```
-> chương trình sẽ chạy ở: [http//localhost:3000](http://localhost:3000/)

Tắt Project 
```docker 
docker-compose down
```