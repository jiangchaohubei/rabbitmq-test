import {createServer} from 'class2api'
import receiver1 from './Receiver1.js'

let port = 9998;

//创建微服务对象
createServer(receiver1)
    .then((server)=>{
        server.listen(port, "0.0.0.0", (err)=>{
            if (err) {console.error(err)}
            console.info("==> API Started ...", port);
            console.info("Test: ");
            //GET method
            console.info("==>$ curl 'http://127.0.0.1:%s/ClassA/hello?name=huangyong&age=23&year=1979'", port);
            //POST method
            console.info("==>$ curl -d 'name=huangyong&age=23&year=1979' 'http://127.0.0.1:%s/ClassA/hello'", port);
        });
    })
