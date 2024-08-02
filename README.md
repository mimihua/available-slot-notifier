C:\Users\xuhong\Documents\GitHub\available-slot-notifier 目录下执行

## Deploy

```
firebase deploy

firebase deploy --only functions:scheduledFunction
firebase deploy --only functions:helloWorld
```

根据这些不同文件中的值，随函数部署的环境变量集会因目标项目而异：

$ firebase use dev
$ firebase deploy --only functions