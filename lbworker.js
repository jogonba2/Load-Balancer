var zmq       = require('zmq')
  , requester = zmq.socket('req')
  , url_endpoint = process.argv[2]
  , identity     = process.argv[3]
  , msgdispon    = process.argv[4]
  , msgatenci    = process.argv[5]
  , verbose      = process.argv[6]
  , counter_rep  = 0;

requester.identity = identity
requester.connect('tcp://'+url_endpoint);
if(verbose=="true"){
    console.log("worker ( "+identity+" ) connected to tcp://"+url_endpoint + " ...");
}
requester.send(msgdispon);
if(verbose=="true"){
    console.log("worker ( "+identity+" ) has sent READY msg: \" "+msgdispon+"\"");
}

requester.on('message',function(){
						var msg = Array.prototype.slice.call(arguments);
						counter_rep++;
						if(verbose=="true"){
							console.log("worker ( "+identity+" ) has received request: \" "+msg[2].toString()+" \" from client ( "+msg[0].toString()+" )");
							for(var i in msg) console.log("Part "+i+" : " + msg[i].toString());
						}
	                    requester.send([msg[0].toString(),msgatenci]);  
						if(verbose=="true"){
							console.log("worker ( "+identity+" ) has send its reply");
							console.log("Reply: " + [msg[0].toString(),msgatenci].join(","));
							console.log("worker ( "+identity+" ) has sent " + counter_rep + " replies");
						}
					   });

