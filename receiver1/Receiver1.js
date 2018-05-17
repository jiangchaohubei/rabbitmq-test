import amqp from "amqplib";
const amqpUrl="amqp://localhost:5672"
/**
 * 消费者类
 */
class Receiver1 {
    /**
     * 简单模式与工作队列模式
     */
    static async receiveMessage_work({name,req}) {
        const queue="workQueue"
        const connection = await amqp.connect(amqpUrl);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue);
        await channel.consume(queue, function(message) {
            console.log(`receiveMessage_work接收消息：${message.content.toString()}`);
            channel.ack(message);
        });
        return {message: `this is a message from Api: got name [${name}]`}
    }

    /**
     * 发布订阅模式模式
     */
    static async receiveMessage_pubSub({name,req}) {
        const queue="pubSubQueue"
        const ex="pubSubExchange"

        const connection = await amqp.connect(amqpUrl);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue);
        await channel.bindQueue(queue,ex)
        await channel.consume(queue, function(message) {
            console.log(`receiveMessage_pubSub接收消息：${message.content.toString()}`);

            channel.ack(message);
        });
        return {message: `this is a message from Api: got name [${name}]`}
    }

    /**
     * 路由模式
     */
    static async receiveMessage_routing({name,req}) {
        const queue="routingQueue"
        const ex="routingExchange"

        const connection = await amqp.connect(amqpUrl);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue);
        await channel.bindQueue(queue,ex,"rout")
        await channel.consume(queue, function(message) {
            console.log(`receiveMessage_routing接收消息：${message.content.toString()}`);

            channel.ack(message);
        });
        return {message: `this is a message from Api: got name [${name}]`}
    }

    /**
     * 通配符模式
     */
    static async receiveMessage_topic({name,req}) {
        const queue="topicQueue"
        const ex="topicExchange"

        const connection = await amqp.connect(amqpUrl);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue);
        await channel.bindQueue(queue,ex,"abb.#")
        await channel.consume(queue, function(message) {
            console.log(`receiveMessage_topic接收消息：${message.content.toString()}`);
            channel.ack(message);
        });
        return {message: `this is a message from Api: got name [${name}]`}
    }
}

export default Receiver1