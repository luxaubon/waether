"use client";
import { useState,useEffect,useRef } from "react"
import styles from './page.module.css';

function getCurrentDate(){
  return new Date().toLocaleDateString('th-TH',{
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function Home() {
  const ref = useRef(null);
  const date = getCurrentDate();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [city, setCity] = useState<any>();

  async function fetchData(cityName : string) {
    try{
      const response = await fetch(`http://localhost:3000/api/weather?city=${cityName}`);
      const jsonData = (await response.json()).data;  
      setWeatherData(jsonData);
    }catch(error){
      console.log(error);
    }
  }

  async function fetchDataLatLon(lat : number,lon : number) {
    try{
      const response = await fetch(`http://localhost:3000/api/weather?lat=${lat}&lon=${lon}`);
      const jsonData = (await response.json()).data;  
      setWeatherData(jsonData);
    }catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    //fetchData('Bangkok');
    if("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const {latitude,longitude} = position.coords;
          fetchDataLatLon(latitude,longitude);
        },
        (error) => {
            console.log(error);
        }
      );
    }
  },[])
  return (
    <main  className={styles.main}>
      <article className={styles.widget}>

        <form className={styles.weatherLocation} >
          <input
            className={styles.input_field}
            type="text"
            placeholder="Enter city Bangkok"
            onChange={(e) => setCity(e.target.value)}
            ref={ref}
          />
          <button 
            className={styles.search_button}
            type="button"
            onClick={() => fetchData(city)}
            >Search</button>
        </form>
        {weatherData && weatherData.weather && weatherData.weather[0] ? (
          <>
          <div className={styles.icon_and_weatherInfo}>
            <div className={styles.weatherIcon}>
              {weatherData?.weather[0]?.description === "rain" || weatherData?.weather[0]?.description === "fog" ? (
                <i className={`wi wi-day-${weatherData?.weather[0]?.description}`}></i>
              ) : (
                <i className="wi wi-day-cloudy" ></i>
              )}
            </div>
            <div className={styles.weatherInfo}>
              <div className={styles.temperature}>
                  <span>
                    {(weatherData?.main?.temp - 273.5).toFixed(2)}°C
                  </span>
              </div>
              <div className={styles.weatherCondition}> 
                  {weatherData?.weather[0]?.description?.toUpperCase()}
              </div>
            </div>
           
          </div>

          <div className={styles.place}>{weatherData?.name}</div>
          <div className={styles.date}>{date}</div>

          </>
        ):(
          <div className={styles.place}>
              Loading...
          </div>
          )}
       </article>
    </main>
  )
}
