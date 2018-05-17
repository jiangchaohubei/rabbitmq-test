import {createServer} from 'class2api'
import publish from './Publish.js'

let port = 9999;

//创建微服务对象
createServer(publish)
    .then((server)=>{
        server.listen(port, "0.0.0.0", (err)=>{
            if (err) {console.error(err)}
            console.info("==> API Started ...", port);
            console.info("Test: ");
            //GET method
            console.info("==>$ curl 'http://127.0.0.1:%s/publish/sendMessage_work?message=test'", port);
            console.info("==>$ curl 'http://127.0.0.1:%s/publish/sendMessage_pubSub?message=test'", port);
            console.info("==>$ curl 'http://127.0.0.1:%s/publish/sendMessage_routing?message=test'", port);
            console.info("==>$ curl 'http://127.0.0.1:%s/publish/sendMessage_topic?message=test'", port);

        });
    })
