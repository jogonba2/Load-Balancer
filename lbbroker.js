const zmq = require('zmq');
var frontend = zmq.socket("router");
var backend  = zmq.socket("router");
var port_frontend  = process.argv[2];
var port_backend   = process.argv[3];
var verbose        = process.argv[4]; // Pasar 0 o 1 //

var disponibles    = []

frontend.bind("tcp://*:"+port_frontend);
backend.bind("tcp://*:"+port_backend);

if(verbose=="true"){
    console.log("broker: frontend-router listening on tcp://*:"+port_backend);
	console.log("broker: frontend-router listening on tcp://*:"+port_frontend);
}

frontend.on('message',function(){
	var msg = Array.prototype.slice.call(arguments);
	var c_identity = msg[0].toString();
	if(verbose=="true"){
		console.log("received request: "+msg[2].toString()+ " from client (" + c_identity + ")");
		for(var i in msg) console.log("Part "+i+" : " + msg[i].toString());
	}		
	if(disponibles.length==0) frontend.send([c_identity,"","No hay trabajadores"]);		
	else{
		var worker = disponibles.pop();
		if(verbose=="true"){
			console.log("sending client ( "+c_identity+" ) req to worker ( "+worker+" ) through bakend");
			for(var i in msg) console.log("Part "+i+" : " + msg[i].toString());
		}
		backend.send([worker,""].concat(msg));
	}
	});

backend.on('message',function(){
	var msg = Array.prototype.slice.call(arguments);
	var identity = msg[0].toString();
	var text = msg.pop().toString(); msg.unshift(text);
	if(text==='ready'){ 
		 disponibles.push(identity);
		 if(verbose=="true"){		
			console.log("received request: ready from worker ("+identity+")");
			for(var i in msg) console.log("Part "+i+" : " + msg[i].toString());
		}
	}
	else{
		var client_identity = msg.pop().toString();
		if(verbose=="true"){
			console.log("received request: "+text+" from worker ( "+identity+" )");
			for(var i in msg) console.log("Part "+i+" : " + msg[i].toString());
		}
		frontend.send([client_identity,"",text]);
		disponibles.unshift(identity);
	}
	});

