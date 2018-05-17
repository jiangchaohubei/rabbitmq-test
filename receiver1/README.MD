最基础的API网关Demo 
 
在 $ Class2api init 初始化时被拉取

```javascript
$ class2api init
 脚手架模版类型：
 - base   ——精简型，不带before/after拦截器
 - normal ——普通型，带before/after拦截器、API缓存机制
 - super  ——增强型，带before/after拦截器、API缓存机制、数据库访问
 - admin  ——管理后台权限认证型，super的基础上附带管理身份权限校验
 
选择以上哪种模版？（base/normal/super/admin）: normal
给创建的新项目取个名字(normalDemo86837):

 远程提取模版文件 ...

 √ 项目创建成功!

 开始体验:

 $ cd normalDemo86837 && npm install && npm start
```
 
 #开发环境 #
 `
 $ NODE_ENV=development REDIS_SESSION=1 node ./src/index.js  
 $ pm2 ecosystem/ecosystem_dev.json
 `
 #测试环境 #
 `
 $ NODE_ENV=test REDIS_SESSION=1 node ./src/index.js 
 $ pm2 ecosystem/ecosystem_test.json
 `
 #正式环境#
 ` 
 $ NODE_ENV=production REDIS_SESSION=1 node ./src/index.js
 $ pm2 ecosystem/ecosystem.json
 `
# 初始化或重置数据库 #
 $ DB_RESET_1=123234537569 DB_RESET_2=wrq5hfoiuy12344376 node toolscript/run-resetModel.js      

#本地启动redis：
cd /usr/local/redis && src/redis-server
cd /usr/local/redis && src/redis-cli 

#nginx
重启 pkill -9 nginx

$ npm i class2api@latest --registry=https://registry.npm.taobao.org   

