// Comando para crear el contenedor del servidor de mogno db
# Windows
docker run --name MONGOER -d -v $PWD\collections\restaurants.js:/docker-entrypoint-initdb.d/restaurants.js -v $PWD\collections\restaurantsOpening.js:/docker-entrypoint-initdb.d/restaurantsOpening.js -p 27017:27017 mongo

# Unix
docker run --name MONGOER -d -v $PWD/collections/restaurants.js:/docker-entrypoint-initdb.d/restaurants.js -v $PWD/collections/restaurantsOpening.js:/docker-entrypoint-initdb.d/restaurantsOpening.js -p 27017:27017 mongo


// Comando para ejecutar la terminal de mongodb

docker exec -it MONGOER mongosh 


