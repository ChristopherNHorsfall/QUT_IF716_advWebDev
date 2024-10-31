const http = require('http');
const fs = require("fs");
const path = "guestBook.json";
// create server object
http
    .createServer(routing)
    .listen(3000, function (){
        console.log("server start at port 3000"); // the server object listens on port 3000
    });

function routing(req,res) {
    const url = req.url;

    if (url.startsWith("/form") && req.method === "GET") { // The Form Page
        res.writeHead(200,{"Content-Type":"text/html"}); //http header
        res.write(`
            <form action="/add" method="post">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name">
                <label for="age">Age:</label>
                <input type = "number" id ="age" name="age">
                <input type="radio" id="male" name="gender" value="male">
                <label for="male">male</label><br>
                <input type="radio" id="female" name="gender" value="female">
                <label for="female">female</label><br>
                <input type="radio" id="unsaid" name="gender" value="unsaid">
                <label for="unsaid">unsaid</label><br>
                <textarea name="comment" rows="6" columns="50">Please comment here
                </textarea>
                <input type="submit">
            </form>
            `);
        res.end();
    } else if (url.startsWith("/add") && req.method === "POST") { // The Add Page
        fs.readFile(path, function(err, data){
            if (err) {
                res.write("You should do some real error handling here");
                res.end();
                return;
            }
            // try to read from the guestbook, If it fails, set the guest book to empty
            let body ='';

            //collect data as it arrives
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', ()=> {
                //Parse the form data
                const params = new URLSearchParams(body);
                const name = params.get('name');

                //read and update the guest book
                fs.readFile(path, (err,data)=> {
                    if (err) {
                        res.write("error reading guestbook");
                        res.end();
                        return;
                    }

                    let guestBook = [];
                    try {
                        guestBook = JSON.parse(data);
                    } catch (e) {console.error("Failed to parse guest book data:", e);}

                    guestBook.push({name}); //add the new name to guestbook

                    //write the updated guestbook back to file
                    fs.writeFile(path, JSON.stringify(guestBook), (err)=>{
                        if (err) {
                            res.write("You should do some real error handling here");
                            res.end();
                            return;
                        }
                        res.write("Successfully updated guestbook");
                        res.end();
                    });
                });
            });
        });
    } else { //no page matching url
        res.write("No matching page");
        res.end();
    }
}