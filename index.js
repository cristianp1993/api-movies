//Creamos servidor
const express = require("express");
const { getMovies } = require("./src/crud");

const app = express();

app.use(express.json());

app.get("/Movies", (req, res) => {
  try {
    const all = getMovies("./src/movies.json");

    const movies = JSON.parse(all);

    res.send(movies.movies);
  } catch (error) {
    console.error("Error al obtener las películas:", error);
    res.status(500).send("Error al obtener las películas");
  }
});

app.get("/Movies/ById/:id", (req, res) => {
  try {
    const id = req.params.id;
    const movies = getMovies("./src/movies.json");
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

app.get("/Movies/ByName/:name", (req, res) => {
  try {
    const name = req.params.name;
    const movies = getMovies("./src/movies.json");
    const jsonObject = JSON.parse(movies);
    const moviesArray = jsonObject.movies;

    const moviesFilter = moviesArray.filter((movie) =>
      movie.nombre.toLowerCase().includes(name.toLowerCase())
    );

    if (!moviesFilter || moviesFilter.length ===0) {
      res.status(404).send(`No existe una coincidencia con ${name}`);
      return;
    }
    res.send(moviesFilter);
  } catch (error) {
    console.error("Error al obtene la película:", error);
    res.status(500).send("Error al obtener la película");
  }
});

app.post("/Movies", (req, res) => {
  const todo = req.body;
  const todos = readFileSync("./db.json");
  todo.id = todos.length + 1;
  todos.push(todo);

  escribirArchivo("./db.json", todos);
  res.status(201).send(todo);
});

app.put("/Movies/:id", (req, res) => {
  res.send("Hello from PUT");
});

app.delete("/Movies/:id", (req, res) => {
  res.send("Hello from DELETE");
});

//Subir servidor
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
