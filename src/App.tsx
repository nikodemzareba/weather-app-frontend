import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import './App.css';
import LoginScreen from "./login";
import RegisterScreen from './register';


interface WeatherData {
  location: {
    name: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    pressure_mb: number;
    last_updated: string;
    wind_kph: number;
    uv: number;
  };
}

interface Photo {
  id: string;
  urls: {
    regular: string;
  };
}

interface CityOption {
  value: string;
  label: string;
}

const apiBaseUrl: string = 'http://localhost:8000/api';
const unsplashAccessKey: string = '6y_g9xm_0g-XNPqzSOY6Rosm_UVO8vUQCg3uc_ARGe4';
const googleMapsApiKey = 'AIzaSyAXwHWvvYlGz9rarjPyXZHh8O8ZMAQhMNs';

const HomeScreen: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [photo, setPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const fetchWeatherData = async (): Promise<void> => {
      try {
        if (selectedLocation) {
          const response = await axios.get<WeatherData>(`${apiBaseUrl}/weather/${selectedLocation}`);
          setWeatherData(response.data);
          updateMap(response.data.location.name);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchWeatherData();
  }, [selectedLocation]);

  useEffect(() => {
    const fetchPhoto = async (): Promise<void> => {
      try {
        if (selectedLocation) {
          const response = await axios.get<Photo>(
            `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
              selectedLocation
            )}&client_id=${unsplashAccessKey}`
          );
          setPhoto(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPhoto();

    const interval = setInterval(() => {
      fetchPhoto();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedLocation]);

  const handleLocationChange = (selectedOption: CityOption | null) => {
    if (selectedOption) {
      setSelectedLocation(selectedOption.value);
    } else {
      setSelectedLocation(null);
    }
  };

  const updateMap = async (location: string) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          location
        )}`
      );
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setMapCenter({ lat: parseFloat(lat), lng: parseFloat(lon) });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const cities: CityOption[] = [
    { value: 'london', label: 'London' },
    { value: 'manchester', label: 'Manchester' },
    { value: 'birmingham', label: 'Birmingham' },
    { value: 'glasgow', label: 'Glasgow' },
    { value: 'liverpool', label: 'Liverpool' },
    // Add more cities as needed
  ];

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-title">
          <h1>Weather App</h1>
        </div>
        <div className="auth-container">
          <div className="auth-buttons">
            <Link to="/login" className="login-button">
              Login
            </Link>
            <Link to="/register" className="register-button">
              Register
            </Link>
          </div>
        </div>
      </header>
      <div className="app-content">
        <div className="weather-container">
          <h2 className="weather-title">Current Weather</h2>
          <div className="weather-card">
            {weatherData && weatherData.current ? (
              <>
                <h3>{weatherData.location.name}</h3>
                <p className="weather-time">
                  {new Date(weatherData.current.last_updated).toLocaleTimeString()}
                </p>
                <div className="weather-details">
                  <img
                    src={weatherData.current.condition.icon}
                    alt={weatherData.current.condition.text}
                    className="weather-icon"
                  />
                  <p className="condition">{weatherData.current.condition.text}</p>
                  <p className="temperature">{weatherData.current.temp_c}°C</p>
                  <p className="humidity">Humidity: {weatherData.current.humidity}%</p>
                  <p className="pressure">Pressure: {weatherData.current.pressure_mb} mb</p>
                  <p className="wind">Wind: {weatherData.current.wind_kph} km/h</p>
                  <p className="uv">UV Index: {weatherData.current.uv}</p>
                </div>
              </>
            ) : (
              <div>Loading...</div>
            )}
          </div>
          <div className="location-dropdown">
            <Select
              placeholder="Select a location"
              options={cities}
              onChange={handleLocationChange}
            />
          </div>
        </div>
        <div className="content-container">
          <div className="map-container">
            {mapCenter && (
              <LoadScript googleMapsApiKey={googleMapsApiKey}>
                <GoogleMap center={mapCenter} zoom={12} mapContainerStyle={{ height: '100%' }}>
                  <Marker position={mapCenter} />
                </GoogleMap>
              </LoadScript>
            )}
          </div>
        </div>
        <div className="image-container">
          {photo && (
            <div className="photo-item">
              <img src={photo.urls.regular} alt={selectedLocation ?? ''} className="photo" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/" element={<HomeScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
