import {createServer} from 'class2api'
import receiver2 from './Receiver2.js'

let port = 9997;

//创建微服务对象
createServer(receiver2)
    .then((server)=>{
        server.listen(port, "0.0.0.0", (err)=>{
            if (err) {console.error(err)}
            console.info("==> API Started ...", port);
            console.info("Test: ");
            //GET method
            console.info("==>$ curl 'http://127.0.0.1:%s/receiver2/receiveMessage_work'", port);
            console.info("==>$ curl 'http://127.0.0.1:%s/receiver2/receiveMessage_pubSub'", port);
            console.info("==>$ curl 'http://127.0.0.1:%s/receiver2/receiveMessage_routing'", port);
            console.info("==>$ curl 'http://127.0.0.1:%s/receiver2/receiveMessage_topic'", port);
        });
    })
