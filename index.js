//Creamos servidor
const express = require("express");
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const { getMovies, readMovies } = require("./src/crud");

const pathMovies = "./src/movies.json";
app.use(express.json());

/**
* @swagger
* paths:
*   /Movies:
*     get:
*       summary: Obtener las peliculas de la db
*       tags:
*         - Movies
*       responses:
*         '200':
*           description: Se obtuvieron todas las peliculas 
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   movies:
*                     type: array
*                     items:
*                       $ref: '#/components/schemas/Movie'
*         '500':
*           description: Internal server error
*           content:
*             text/plain:
*               schema:
*                 type: string
*                 example: Error al obtener las películas
* components:
*   schemas:
*     Movie:
*       type: object
*       properties:
*         id:
*           type: integer
*         titulo:
*           type: string
*         director:
*           type: string
*         fechaEstreno:
*           type: integer
*         genero:
*           type: string
*         calificacion:
*           type: number
*         critica:
*           type: string
*/

app.get("/Movies", (req, res) => {
  try {
    const all = getMovies(pathMovies);

    const movies = JSON.parse(all);

    res.send(movies.movies);
  } catch (error) {
    console.error("Error al obtener las películas:", error);
    res.status(500).send("Error al obtener las películas");
  }
});

/**
* @swagger
* paths:
*  /Movies/ById/{id}:
*    get:
*      summary: Obtener pelicula por id
*      tags: [Movies]
*      parameters:
*        - in: path
*          name: id
*          required: true
*          description: Numero id de la pelicula que se quiere buscar
*          schema:
*            type: integer
*            example: 1
*      responses:
*        '200':
*          description: Correcto, se obtiene el objeto de la pelicula buscada
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/Movie'
*        '404':
*          description: Movie not found
*          content:
*            text/plain:
*              schema:
*                type: string
*                example: No existe la película buscada
*        '500':
*          description: Internal server error
*          content:
*            text/plain:
*              schema:
*                type: string
*                example: Error al obtener la película
* components:
*  schemas:
*    Movie:
*      type: object
*      properties:
*         id:
*           type: integer
*         titulo:
*           type: string
*         director:
*           type: string
*         fechaEstreno:
*           type: integer
*         genero:
*           type: string
*         calificacion:
*           type: number
*         critica:
*           type: string
*/

app.get("/Movies/ById/:id", (req, res) => {
  try {
    const id = req.params.id;
    const movies = getMovies(pathMovies);
    const jsonObject = JSON.parse(movies);
    const moviesArray = jsonObject.movies;

    const getMovie = moviesArray.find((movie) => movie.id === parseInt(id));

    if (!getMovie) {
      res.status(404).send("No existe la pelicula buscada");
      return;
    }
    res.send(getMovie);
  } catch (error) {
    console.error("Error al obtene la película:", error);
    res.status(500).send("Error al obtener la película");
  }
});

/**
* @swagger
* paths:
*  /Movies/ByName/{name}:
*    get:
*      summary: Obtener películas por nombre
*      tags: [Movies]
*      parameters:
*        - in: path
*          name: name
*          required: true
*          description: Nombre o parte del nombre de la película a buscar
*          schema:
*            type: string
*      responses:
*        '200':
*          description: Respuesta exitosa con el objeto de película
*          content:
*            application/json:
*              schema:
*                type: array
*                items:
*                  $ref: '#/components/schemas/Movie'
*        '404':
*          description: Película no encontrada
*          content:
*            text/plain:
*              schema:
*                type: string
*                example: No existe una coincidencia con {name}
*        '500':
*          description: Error interno del servidor
*          content:
*            text/plain:
*              schema:
*                type: string
*                example: Error al obtener la película
* components:
*  schemas:
*    Movie:
*      type: object
*      properties:
*        id:
*          type: integer
*          description: ID de la película
*        nombre:
*          type: string
*          description: Nombre de la película
*        genero:
*          type: string
*          description: Género de la película
*        fechaEstreno:
*          type: string
*          format: date
*          description: Fecha de estreno de la película
*        director:
*          type: string
*          description: Director de la película
*        vista:
*          type: boolean
*          description: Indica si la película ha sido vista o no
*        calificacion:
*          
*/
app.get("/Movies/ByName/:name", (req, res) => {
  try {
    const name = req.params.name;
    const movies = getMovies(pathMovies);
    const jsonObject = JSON.parse(movies);
    const moviesArray = jsonObject.movies;

    const moviesFilter = moviesArray.filter((movie) =>
      movie.nombre.toLowerCase().includes(name.toLowerCase())
    );

    if (!moviesFilter || moviesFilter.length === 0) {
      res.status(404).send(`No existe una coincidencia con ${name}`);
      return;
    }
    res.send(moviesFilter);
  } catch (error) {
    console.error("Error al obtene la película:", error);
    res.status(500).send("Error al obtener la película");
  }
});

/**
* @swagger
* paths:
*  /Movies/SaveMovie:
*    post:
*      summary: Guardar una nueva película
*      tags: [Movies]
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/MovieInput'
*      responses:
*        '201':
*          description: Película creada con éxito
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/Movie'
*        '500':
*          description: Error interno del servidor
*          content:
*            text/plain:
*              schema:
*                type: string
*                example: Error al agregar la nueva película
* components:
*  schemas:
*    MovieInput:
*      type: object
*      properties:
*        nombre:
*          type: string
*          description: Nombre de la película
*        genero:
*          type: string
*          description: Género de la película
*        fechaEstreno:
*          type: string
*          format: date
*          description: Fecha de estreno de la película
*        director:
*          type: string
*          description: Director de la película
*        vista:
*          type: boolean
*          description: Indica si la película ha sido vista o no
*        calificacion:
*          type: number
*          description: Calificación de la película
*        critica:
*          type: string
*          description: Crítica de la película
*    Movie:
*      type: object
*      properties:
*        id:
*          type: integer
*          description: ID de la película
*        nombre:
*          type: string
*          description: Nombre de la película
*        genero:
*          type: string
*          description: Género de la película
*        fechaEstreno:
*          type: string
*          format: date
*          description: Fecha de estreno de la película
*        director:
*          type: string
*          description: Director de la película
*        vista:
*          type: boolean
*          description: Indica si la película ha sido vista o no
*        calificacion:
*          type: number
*          description: Calificación de la película
*        critica:
*          type: string
*          description: Crítica de la película
*/
app.post("/Movies/SaveMovie", (req, res) => {
  const movie = req.body;
  const movies = getMovies(pathMovies);
  const jsonObject = JSON.parse(movies.toString());
  const moviesData = jsonObject.movies;

  try {
    console.log("Lista de movies");
    console.log(jsonObject);
    const lastId =
    moviesData.length > 0 ? Math.max(...moviesData.map((m) => m.id)) : 0;
    const newMovie = { id: lastId + 1, ...movie };
    jsonObject.movies.push(newMovie);
    const setMovies ={movies: moviesData}
    readMovies(pathMovies, JSON.stringify(setMovies));
    res.status(201).send(newMovie);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al agregar la nueva película " + err);
  }
});

/**
* @swagger
* paths:
*  /movies/{id}:
*    put:
*      summary: Actualizar película por ID
*      tags: [Movies]
*      parameters:
*        - in: path
*          name: id
*          required: true
*          description: ID de la película a actualizar
*          schema:
*            type: integer
*            example: 1
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/MovieInput'
*      responses:
*        '200':
*          description: Película actualizada con éxito
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/Movie'
*        '404':
*          description: Película no encontrada
*          content:
*            text/plain:
*              schema:
*                type: string
*                example: Película no encontrada
*        '500':
*          description: Error interno del servidor
*          content:
*            text/plain:
*              schema:
*                type: string
*                example: Error al actualizar la película
* components:
*  schemas:
*    MovieInput:
*      type: object
*      properties:
*        nombre:
*          type: string
*          description: Nombre de la película
*        genero:
*          type: string
*          description: Género de la película
*        fechaEstreno:
*          type: string
*          format: date
*          description: Fecha de estreno de la película
*        director:
*          type: string
*          description: Director de la película
*        vista:
*          type: boolean
*          description: Indica si la película ha sido vista o no
*        calificacion:
*          type: number
*          description: Calificación de la película
*        critica:
*          type: string
*/
app.put('/movies/:id', (req, res) => {
  
  const movieId = req.params.id;
  const updatedMovie = req.body;

  const movies = getMovies(pathMovies);
  const jsonObject = JSON.parse(movies.toString());
  const moviesData = jsonObject.movies;

  try {
    // Busco el índice de la película a actualizar
    const movieIndex = moviesData.findIndex(movie => movie.id === parseInt(movieId));

    if (movieIndex !== -1) {

      moviesData[movieIndex] = { ...moviesData[movieIndex], ...updatedMovie };

      // Escribo los datos actualizados en el archivo movies.json
      const updatedJsonObject = { movies: moviesData };
      readMovies(pathMovies, JSON.stringify(updatedJsonObject, null, 2));

      res.status(200).send(moviesArray[movieIndex]);
    } else {
      res.status(404).send('Película no encontrada');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar la película');
  }
});


/**
* @swagger
* paths:
*  /Movies/{id}:
*    delete:
*      summary: Eliminar película por ID
*      tags: [Movies]
*      parameters:
*        - in: path
*          name: id
*          required: true
*          description: ID de la película a eliminar
*          schema:
*            type: integer
*            example: 1
*      responses:
*        '200':
*          description: Película eliminada con éxito
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/MovieList'
*        '402':
*          description: Película no encontrada
*          content:
*            text/plain:
*              schema:
*                type: string
*                example: Película no encontrada
*        '500':
*          description: Error interno del servidor
*          content:
*            text/plain:
*              schema:
*                type: string
*                example: Error al eliminar la 
*/
app.delete("/Movies/:id", (req, res) => {

  const movieId = req.params.id;
  const movies = getMovies(pathMovies);
  const jsonObject = JSON.parse(movies.toString());
  const moviesData = jsonObject.movies;

  try {
    // Busco el índice de la película a actualizar
    const moviesNew = moviesData.filter(movie => movie.id !== parseInt(movieId));

    if (moviesNew.length !== moviesData.length) {
      
      // Escribo los datos actualizados en el archivo movies.json
      const updatedJsonObject = { movies: moviesNew };
      readMovies(pathMovies, JSON.stringify(updatedJsonObject, null, 2));

      res.status(200).send(updatedJsonObject);
    } else {
      res.status(402).send('Película no encontrada');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar la película');
  }
  
});

//Subir servidor
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
