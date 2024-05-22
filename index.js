import express from "express";
import axios from "axios";
import bodyParser from "body-parser";


const app = express();
const port = 3000;

const API_KEY = "b052e880191e90e03273c734ba5e7615";
const API_WEATHER_KEY = "c094e5551828462bbe2143853242205"

app.use(express.static("public"))

app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", async (req, res) => {
    res.render("index.ejs");
})

app.post("/get-info", async (req, res) => {
  const searchCity = req.body.city;
  console.log(searchCity);
  let cityLong;
  let cityLat;
  try {
    const result = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${searchCity}&limit=1&appid=${API_KEY}`);


    if (result.data.length === 0) {
      res.render("index.ejs", { error: "City not found" });
      return;
    }

    const city = result.data[0];
    const name = city.name;


      try {
        const weatherResult = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${API_WEATHER_KEY}&q=${name}`);
        console.log(weatherResult.data);
        const region = weatherResult.data.location.region;
        const temp = weatherResult.data.current.temp_c;
        const weatherCondition = weatherResult.data.current.condition.text;
        const humid =  weatherResult.data.current.humidity;
        const country = weatherResult.data.location.country;
        const wind_speed =  weatherResult.data.current.wind_kph;


        res.render("index.ejs", {
          cityName: name,
          countryName: country,
          regionName: region,
          temperature: temp,
          conditionText: weatherCondition,
          humidity: humid,
          windSpeed: wind_speed,
        });



      } catch (weatherError) {
        console.error("Error fetching weather data:", weatherError);
        console.error("FAILED");

      }
    

  } 

  catch (cityError) {
    console.error("Error fetching city data:", cityError);
  }
  


});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
