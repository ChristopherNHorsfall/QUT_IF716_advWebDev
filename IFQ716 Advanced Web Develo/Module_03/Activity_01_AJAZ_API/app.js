var http = require("http");
var fs = require("fs");
const data = [
    "Siamese",
    "Persian",
    "Maine Coon",
    "Bengal",
    "Scottish Fold",
    "British Shorthair",
    "Sphynx",
    "Abyssinian",
    "American Shorthair",
    "Russian Blue",
    "Ragdoll",
    "Devon Rex",
    "Birman",
    "Siberian",
    "Manx",
    "Exotic Shorthair",
    "Burmese",
    "Tonkinese",
    "Savannah",
    "Himalayan",
]

function routing(req,res){
    const url = req.url;
    const method = req.method;
    if (url.startsWith("/data")) {
        if (method == "GET") {
            // the form page
            res.writeHead(200, {"content-Type":"application/json"});
            res.write(JSON.stringify(data));
            res.end();
        }
    } else if (url.startsWith("/login")) {
        if (method == "POST") {
            // the add page
            res.write("Login");
            res.end();
        }
    } else if(url.startsWith("/client")) {
        if (method =="GET") {
            const filename = "client.html"; //filename to read from

            //try to read the file
            fs.readFile(filename, "binary", function (err,file){
                //if error, output message as JSON and return
                if (err) {
                    res.writeHead(500, {"Content-Type":"application/json"});
                    res.write(JSON.stringify({error:err}));
                    res.end();
                    return;
                }

                //respond with html file
                res.writeHead(200, {"content-Type":"text/html"});
                res.write(file, "binary");
                res.end();
            });
        }
    } else {
        // no page match url
        res.write("No matching page");
        res.end();
    }
};
http.createServer(routing).listen(3000,function(){
    console.log("server start at port 3000");
})