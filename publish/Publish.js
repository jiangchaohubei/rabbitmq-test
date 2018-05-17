import amqp from "amqplib";

let connOptions = {
    host:"localhost",
    port: 5672,
    login: "guest",
    password: "guest",
    authMechanism:"AMQPLAIN",
    vhost: "/",
    ssl: {
    enabled : false
    }
}
const amqpUrl="amqp://localhost:5672"
let count=0
    /**
     * 生产者
     */
class Publish {
    constructor() {
        throw '静态业务功能类无法实例化'
    }

    /**  简单模式与工作队列模式(取决于连接这个队列的消费者数量)
     *   多个消费者时交替执行队列中任务，每个消费者执行任务多少取决于其消费能力
     *   一个任务只会执行一次
     */
    static async sendMessage_work ({message,req}) {
        const queue="workQueue";

        const connection = await amqp.connect(amqpUrl);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue);
        await channel.sendToQueue(queue, new Buffer(`${message}${++count}`), {
                // RabbitMQ关闭时，消息会被保存到磁盘
                persistent: true
            });
        await channel.close();
        await connection.close();

        console.log(`sendMessage_work发布消息：${message}${count}`)
        return {message: `this is a message from Api: sendMessage_work: [${message}${count}]`}
    }

        /**发布订阅模式（publish&subscribe）
         * 一个任务可被多个消费者（订阅者）同时接收
         * 发布者通过管道（channel）把任务发布到交换机（exchange）,消费者创建各自的队列并绑定到该交换机是为订阅
         * exchange的类型fanout,路由（routingKey）为""就行
         */
    static async sendMessage_pubSub ({message,req}) {
        const ex="pubSubExchange"
        const connection = await amqp.connect(amqpUrl);
        const channel = await connection.createChannel();
        await channel.assertExchange(ex,"fanout")
        await channel.publish(ex,"",new Buffer(`${message}${++count}`))

        await channel.close();
        await connection.close();

        console.log(`sendMessage_pubSub发布消息：${message}${count}`)
        return {message: `this is a message from Api: sendMessage_pubSub: [${message}${count}]`}
    }

        /**路由模式（routing）
         * 通过路由发布的消息只能被绑定同样路由的队列接收
         * 通发布订阅模式，只是在发布消息到交换机时需要指定路由（routingKey）,消费者把队列绑定到交换机时也指定相同路由
         * exchange的类型direct
         */
    static async sendMessage_routing ({message,req}) {
        const ex="routingExchange"
        const connection = await amqp.connect(amqpUrl);
        const channel = await connection.createChannel();
        await channel.assertExchange(ex,"direct")
        await channel.publish(ex,"rout",new Buffer(`${message}${++count}`))

        await channel.close();
        await connection.close();

        console.log(`sendMessage_routing发布消息：${message}${count}`)

        return {message: `this is a message from Api: sendMessage_routing: [${message}${count}]`}
    }
        /**通配符模式（topic）
         * 同路由模式，只是路由为通配符匹配，路由由 "." 分隔，"*"匹配零到一个单词，"#"匹配零到多个单词
         * 通配符"* #"是用在消费者绑定队列与交换机的时候
         * exchange的类型topic
         */
    static async sendMessage_topic ({message,req}) {
        const ex="topicExchange"
        const connection = await amqp.connect(amqpUrl);
        const channel = await connection.createChannel();
        await channel.assertExchange(ex,"topic")
        await channel.publish(ex,"abb.b.fg",new Buffer(`${message}${++count}`))
        await channel.publish(ex,"abb.c.df",new Buffer(`${message}${++count}`))
        await channel.publish(ex,"abb.d.bg",new Buffer(`${message}${++count}`))

        await channel.close();
        await connection.close();
        console.log(`sendMessage_topic发布消息：${message}${count}`)
        return {message: `this is a message from Api: sendMessage_topic: [${message}${count}]`}
    }


}

export default Publish