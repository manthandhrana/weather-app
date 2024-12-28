const express= require("express");
const path= require("path");
const hbs = require("hbs")
const app=express();
const port= process.env.PORT || 3000;
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const PORT = 3000;
const config = require("dotenv").config();
const API_KEY = process.env.API_KEY;

const staticPath= path.join(__dirname,"../public")
app.use(express.static(staticPath))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine','hbs');

app.get("/",(req,res)=>{
    res.render("index")
})
app.get("/home",(req,res)=>{
    res.render("index")
})
app.get("/about",(req,res)=>{
    res.render("about")
})
app.get("/getweather",(req,res)=>{
    res.redirect("/")
})

app.post("/getweather", async (req, res) => {
    var cityname = req.body.cityname;
    try {
        var response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API_KEY}`
        );
        const data = await response.json();
        if (data.cod !== 200) {
            throw new Error(data.message);
        }
        // const weatherData = {
        //     get_location: data.name,
        //     country: data.sys.country,
        //     temp_val: data.main.temp,
        //     temp_min: data.main.temp_min,
        //     temp_max: data.main.temp_max,
        //     temp_status: data.weather[0].main,
        // };
        // console.log(get_location)
        res.render("getweather",{
            location:data.name,
            country:data.sys.country,
            tempval:(data.main.temp-273.15).toFixed(2),
            tempmin:(data.main.temp_min-273.15).toFixed(2),
            tempmax:(data.main.temp_max-273.15).toFixed(2),
            tempstatus:data.weather.main
        });
    } catch (err) {
        res.json({ error: "Entered Correct Cityname" });
    }
});

app.listen(port,()=>{
    console.log(`listening to the port http://localhost:${port}`)
})  