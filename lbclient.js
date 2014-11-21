
var zmq       = require('zmq')
  , requester = zmq.socket('req')
  , url_endpoint = process.argv[2]
  , identity     = process.argv[3]
  , request      = process.argv[4];
  
requester.identity = identity;
requester.connect('tcp://'+url_endpoint);
console.log("client ( "+identity+" ) connected to tcp://"+url_endpoint+" ...");
requester.send(request);
console.log("client ( "+identity+" ) has sent its msg: \" "+request+"\"");

requester.on('message',function(){
						   var msg = Array.prototype.slice.call(arguments);
							console.log("client ( "+identity+" ) has received reply: \" "+msg[0].toString()+" \"");
	                       console.log("Ejecución finalizada.");
				           process.exit(0);
						});

