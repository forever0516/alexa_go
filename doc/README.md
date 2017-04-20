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
需手動去alexa portal貼上intent, 因為有使用alexa-app framework,
執行node express.js會顯示目前的intent, utterances, 貼至alexa portal即可
