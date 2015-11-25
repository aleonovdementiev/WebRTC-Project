var http = require('http'),
	url = require("url"),
	fs = require('fs');

function start() {
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;

		if (pathname === "/favicon.ico") {
	        response.writeHead(404);
	        response.end();
	        return;
	    } else if (pathname === '/') {
			file = new fs.ReadStream('WebRTCApp/index.html');

			file.pipe(response);
		} else {
			file = new fs.ReadStream('WebRTCApp' + pathname);

			file.pipe(response);
		}

    }

    http.createServer(onRequest).listen(3000);
}

start();
