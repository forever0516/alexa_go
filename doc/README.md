# alexa go (test alexa)


### 架構

user speaking -> alexa -> lambda -> alexa -> device speaks to user

### 部署

#### lambda

使用serverless 將code deploy 至 lambda

```
sls deploy
```

#### alexa skill kit

將intent route 貼到express.js

執行node express.js

前往localhost8080會顯示目前的intent, utterances, 

貼至alexa portal即可
