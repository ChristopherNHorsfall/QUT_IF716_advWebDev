require("dotenv").config();

const http = require("http");
const WEATHERAPI_BASE = "http://api.weatherapi.com/v1";
const API_KEY = process.env.WEATHERAPI_KEY;

// Global variables for caching
let cachedWeatherData = null;
let lastAccessTime = 0

async function weather(res) {
    const currentTime = new Date().getTime();

    // Check if we have cached data and it's still valid (within 30 seconds)
    if (cachedWeatherData && currentTime - lastAccessTime < 30000){
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(cachedWeatherData));
        return;
    }
    try {
        // Fetch data from the Weather API
        const weatherResponse = await fetch(`${WEATHERAPI_BASE}/current.json?key=${API_KEY}&q=Brisbane`);
        const weatherData = await weatherResponse.json();

        // Extract necessary data for response
        const responseData = {"condition":weatherData.current.condition.text, "temperature": weatherData.current.temp_c};
        
        // Update cache
        cachedWeatherData = {
            condition: weatherData.current.condition,
            temperature: weatherData.current.temp_c
        };
        lastAccessTime = currentTime;

        // Send response with new data
        res.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin":"*"});
        res.write(JSON.stringify(responseData));
        res.end();

    } catch(error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: 'Error fetching weather data' }));
    }

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