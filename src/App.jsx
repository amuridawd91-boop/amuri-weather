import { useState  , useEffect} from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'


function App() {
  const [count, setCount] = useState(0)
  const [weather, setWeather] = useState()
  const [city, setCity] = useState("")
  const weatherDescriptions = ["Clear sky", "Mainly clear", "Partly cloudy" , "Overcast"];
  const [searchedCity , setSearchedCity] = useState('');
  const [loading, setLoading] = useState(false)
  const weatherIcons = ["☀️", "⛅" , "🌫️", "🌧️" , "❄️", "🌦️", "🌨️", "⛈️"]
    
  
    
  
  
  function cityName(event){
    setCity(event.target.value)
  }

  function submitCity(event)
  {
    event.preventDefault()
    
     if (city === "")
      {
      alert("ENTER A CITY NAME")
      } else 
        {
          setLoading(true)
      return fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`)
        
    .then((response) => response.json())
    .then((data) => 
        { 
         if (!data.results || data.results.length == 0 ){
            alert("ENTER VALID CITY NAME")
            throw new Error("Invalid City");
        } else {
            setSearchedCity(data.results[0].name)
            const longitude = data.results[0].longitude
            const latitude = data.results[0].latitude
            const coordinates = {latitude, longitude}
            return coordinates 
          }
        })
    .then((coordinates) => 
       {if (!coordinates){
         return
       } else {
        return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`)}
        })
    .then((response) => 
      {if (!response){
        return
          }
      else {  
       return response.json()}
        })
    .then((data) => {
      setLoading(false)
      return setWeather(data.current)})
    .catch( (error) => { setLoading(false) })
    }
    
}
function getWeatherIcon(){
    if (weather?.weather_code === 0){
      return weatherIcons[0]
    } else if (weather?.weather_code >=1 && weather?.weather_code <= 3){
      return weatherIcons[1]
    } else if (weather?.weather_code >=45 && weather?.weather_code <= 48){
      return weatherIcons[2]
    } else if (weather?.weather_code >=51 && weather?.weather_code <= 67){
       return weatherIcons[3]
    } else if (weather?.weather_code >=71 && weather?.weather_code <= 77){
       return weatherIcons[4]
    } else if (weather?.weather_code >=80 && weather?.weather_code <= 82){
       return weatherIcons[5]
    } else if (weather?.weather_code >=85 && weather?.weather_code <= 86){
       return weatherIcons[6]
    } else if (weather?.weather_code >=95 && weather?.weather_code <= 99){
       return weatherIcons[7]
    }
}
  return (
    <>
      <section id="center">
        <h1>WEATHER APP</h1>
        <div className="search-container">

          <form onSubmit={submitCity}>
            <input onChange = {cityName} name = "city" value = {city} placeholder='Enter City Name'/>
          </form>
        </div>
        
          <div className='weather-container'>
          {loading ? <>Loading<span className='dots'>...</span></> :
          
          <>
          <div className='weather-main'>
          <h1>{searchedCity}</h1>
          <p>{getWeatherIcon()}</p>
          <p>{weather?.temperature_2m}°C</p>
          <p>{weatherDescriptions[weather?.weather_code]}</p>
          </div>
          <div className='weather-details'>
          <p>{weather?.relative_humidity_2m}% humidity</p>
          <p>{weather?.wind_speed_10m} km/hr wind</p>
           </div>
           </>
          }
          
        </div>
        
      </section>

      
    </>
  )

}
export default App
