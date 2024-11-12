const http = require("http");

async function weather(res) {
    const data = {"condition":"Partly cloudy", "temperature":28};
    res.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin":"*"});
    res.write(JSON.stringify(data));
    res.end();
}

function routing(req, res) {
    const url = req.url;
    const method = req.method;
    if (url.startsWith("/weather")&& method == "GET") {
        weather(res);
    } else {
        res.write("No matching page");
        res.end();
    }
}
http.createServer(routing).listen(3000, function (){
    console.log('server started at port 3000');
});