import pytest
from app import app
import json

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_get_weather_valid_city(client):
    response = client.get('/api/weather/Beijing')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'temperature' in data
    assert 'humidity' in data

def test_get_weather_invalid_city(client):
    response = client.get('/api/weather/NonExistentCity')
    assert response.status_code == 404

def test_get_weather_invalid_endpoint(client):
    response = client.get('/api/invalid')
    assert response.status_code == 404
