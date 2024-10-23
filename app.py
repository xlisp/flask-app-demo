from flask import Flask, request, jsonify
from flask_cors import CORS
from flasgger import Swagger
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Swagger configuration
swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'apispec',
            "route": '/apispec.json',
            "rule_filter": lambda rule: True,
            "model_filter": lambda tag: True,
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/docs"
}

swagger = Swagger(app, config=swagger_config)

# Global error handler
class APIError(Exception):
    def __init__(self, status_code, message):
        self.status_code = status_code
        self.message = message

@app.errorhandler(APIError)
def handle_api_error(error):
    response = jsonify({
        'error': error.message
    })
    response.status_code = error.status_code
    return response

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# Weather API endpoint
@app.route('/api/weather/<city>', methods=['GET'])
def get_weather(city):
    """
    Get weather information for a specified city
    ---
    parameters:
      - name: city
        in: path
        type: string
        required: true
        description: Name of the city
    responses:
      200:
        description: Weather data retrieved successfully
      404:
        description: City not found
      500:
        description: Internal server error
    """
    try:
        # Using OpenWeatherMap API as an example
        api_key = os.getenv('OPENWEATHER_API_KEY')
        base_url = "http://api.openweathermap.org/data/2.5/weather"
        
        params = {
            'q': f"{city},CN",
            'appid': api_key,
            'units': 'metric'  # For Celsius
        }
        
        response = requests.get(base_url, params=params)
        
        if response.status_code == 404:
            raise APIError(404, 'City not found')
        elif response.status_code != 200:
            raise APIError(response.status_code, 'Weather service error')
            
        data = response.json()
        
        weather_data = {
            'city': city,
            'temperature': data['main']['temp'],
            'humidity': data['main']['humidity'],
            'description': data['weather'][0]['description'],
            'icon': data['weather'][0]['icon']
        }
        
        return jsonify(weather_data)
        
    except APIError as e:
        raise e
    except Exception as e:
        raise APIError(500, str(e))

if __name__ == '__main__':
    app.run(debug=True)

