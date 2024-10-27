C:\Users\xxxx\Documents\GitHub\available-slot-notifier 目录下执行

## Deploy

```
firebase deploy

firebase deploy --only functions:scheduledFunction
firebase deploy --only functions:helloWorld
```

根据这些不同文件中的值，随函数部署的环境变量集会因目标项目而异：

$ firebase use dev
$ firebase deploy --only functions


1.Node.js (npm) install
2.firebase install

# firebase setting
npm install -g firebase-tools
firebase login (PowerShell execution policy is set to allow script execution： Set-ExecutionPolicy RemoteSigned -Scope CurrentUser)

# setup package
npm install (Execute under the package.jscon directory file)

Run API
# debug 
(cd functions && npm run serve)

# debug ts
vocode実行とデバッグ：Node.js
npm install -g ts-node
de index.ts