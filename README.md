
## Init

* Setup python env
```sh
conda create -n flask-app-demo  python=3.11
conda activate flask-app-demo 
poetry install
```

* Run backend
```sh
poetry run python app.py
```

* Run pytest

```sh
poetry run pytest
```

* Run frontend

```sh
cd weather-frontend
npm install
npm run dev
```
