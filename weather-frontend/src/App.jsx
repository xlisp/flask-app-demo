import { useState } from 'react';
import { Search, Cloud, Droplets, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';

const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/api/weather/${encodeURIComponent(city)}`);
      
      if (!response.ok) {
        throw new Error(response.status === 404 ? 'City not found' : 'Failed to fetch weather data');
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              China Weather Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-6">
              <Input
                placeholder="Enter city name..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={fetchWeather}
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-spin">↻</span>
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {weather && (
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-xl font-semibold">{weather.city}</h2>
                  <img 
                    src={`http://openweathermap.org/img/w/${weather.icon}.png`}
                    alt="Weather icon"
                    className="mx-auto"
                  />
                  <p className="text-gray-600">{weather.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Cloud className="text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Temperature</p>
                      <p className="font-semibold">{weather.temperature}°C</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Droplets className="text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Humidity</p>
                      <p className="font-semibold">{weather.humidity}%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;

