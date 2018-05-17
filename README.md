#mac安装docker
$ brew cask install docker


#拉取带web管理界面的镜像
$ docker pull rabbitmq:management
$ docker images


#share 文件夹/data给docker，创建映射文件夹/data/rabbitmq-data
图标菜单menu -> Preferences -> File sharing

#创建容器运行，访问http://localhost:15672   guest:guest
$ docker run -d --name rabbitmq_web  --publish 5671:5671 --publish 5672:5672 --publish 4369:4369 --publish 25672:25672 --publish 15671:15671 --publish 15672:15672 -v /data/rabbitmq-data/:/var/rabbitmq/lib rabbitmq:management



#测试rabbitmq5种策略模式
分别启动：
发布者publish:
接受者receive1,receive2
npm install
npm start


#####简单模式######
打开发布者： http://127.0.0.1:9999/publish/sendMessage_work?message=test
打开一个接收者：  http://127.0.0.1:9998/receiver1/receiveMessage_work
此时便能收到打开发布者时发送的消息
再多次发送消息：   http://127.0.0.1:9999/publish/sendMessage_work?message=test
(打开后该队列将一直处于监听状态，除非手动关闭，自动接收消息)


#####工作队列模式######
打开发布者： http://127.0.0.1:9999/publish/sendMessage_work?message=test  （
打开接收者1：  http://127.0.0.1:9998/receiver1/receiveMessage_work
此时便能收到打开发布者时发送的消息
发送消息(可发多条)：   http://127.0.0.1:9999/publish/sendMessage_work?message=test
接受者1正常收到消息
再打开接收者2：http://127.0.0.1:9997/receiver2/receiveMessage_work
发现没有接收到之前的消息（因为被receive1处理掉了）
发送消息：   http://127.0.0.1:9999/publish/sendMessage_work?message=test
发现只有receiver1接收到消息（receive1先创建有优先级）
再次多次发送消息，发现交替获得消息，且一条消息只有一个接受者能收到

发布一条消息，只有一个receiver接收到消息，发布两条，分别接收到一条消息
多个消费者时交替执行队列中任务，每个消费者执行任务多少取决于其消费能力，一个任务只会被执行一次
(可尝试多次发送消息，查看两个消费者交替执行任务,可在消费者内加入延时函数模拟消费能力不同)

#简单模式与工作队列模式都是生产者直接将消息推送到队列中，此时队列已经创建，因此后创建的消费者监听该队列时会收到以往该队列中所有(未被处理)的消息


######发布订阅模式######
打开发布者： http://127.0.0.1:9999/publish/sendMessage_pubSub?message=test
先打开接收者1：  http://127.0.0.1:9998/receiver1/receiveMessage_pubSub
此时没有消息（之前没有订阅）
发送消息：   http://127.0.0.1:9999/publish/sendMessage_pubSub?message=test
接受者1正常收到消息
再打开接收者2：  http://127.0.0.1:9997/receiver2/receiveMessage_pubSub
发现没有接收到之前的消息（之前没有订阅）
发送消息：   http://127.0.0.1:9999/publish/sendMessage_pubSub?message=test
发现两个receiver同时接收到相同的消息

发布一条消息，两个receiver同时接收到消息
（只要各自队列绑定到同一个交换机，就都能接收到消息）

##发布者先把消息推送到交换机（exchange）中,当有队列与该交换机绑定时，再将消息推送到该队列中；
因此该模式只有订阅（即绑定队列和交换机）后才能收到消息，订阅之前的消息都不会收到；若交换机还没创建，提前订阅程序会报错


######路由模式######
打开发布者： http://127.0.0.1:9999/publish/sendMessage_routing?message=test
先打开接收者1：  http://127.0.0.1:9998/receiver1/receiveMessage_routing
此时没有消息（之前没有订阅）
发送消息：   http://127.0.0.1:9999/publish/sendMessage_routing?message=test
接受者1正常收到消息(已订阅且路由完全匹配)
再打开接收者2：  http://127.0.0.1:9997/receiver2/receiveMessage_routing
发现没有接收到之前的消息（之前没有订阅）
发送消息：   http://127.0.0.1:9999/publish/sendMessage_routing?message=test
发现只有receiver1收到消息（receiver2的路由不匹配）

发布消息，路由绑定为 "rout"  ,只有receiver1能接收到消息，尝试修改receiver2的receiveMessage_routing中的绑定路由为发布路由"rout",
再次启动receiver2调用receiveMessage_routing方法，发现都能接收到任务消息
（路由需要完全匹配）



######通配符模式######
打开发布者： http://127.0.0.1:9999/publish/sendMessage_topic?message=test
先打开接收者1：  http://127.0.0.1:9998/receiver1/receiveMessage_topic
此时没有消息（之前没有订阅）
发送消息：   http://127.0.0.1:9999/publish/sendMessage_topic?message=test
接受者1正常收到3条消息(已订阅且通配符路由能匹配三个)
再打开接收者2：  http://127.0.0.1:9997/receiver2/receiveMessage_topic
发现没有接收到之前的消息（之前没有订阅）
发送消息：   http://127.0.0.1:9999/publish/sendMessage_topic?message=test
发现receiver1收到3条消息，receiver2收到一条消息

同路由模式，只是路由不是完全匹配，而是根据通配符匹配，路由由 "." 分隔，"*"匹配零到一个单词，"#"匹配零到多个单词，
调用一次接口，代码中已发布三条消息，分别为三个路由: abb.b.fg    abb.c.df   abb.d.bg
receiver1 的通配符路由为："abb.#"  ，因此能接收到所有以 abb开头的路由 ，能接收3条消息
receiver2 的通配符路由为："*.b.#"  ，因此能接收到所有以 b为中间单词的路由 ，能接收1条消息
（可尝试自己修改通配符路由，熟悉匹配规则）

