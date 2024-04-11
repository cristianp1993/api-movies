const moment = require("moment");
const fs = require("fs");
const Joi = require("joi");

const addCreatedAt = (req, res, next) => {
  const now = moment().format("YYYY-MM-DD HH:mm");

  if (req.body.hasOwnProperty("created_at")) {
    req.body.created_at = now;
  } else {
    // Agregar "created_at" si no existe
    req.body.created_at = now;
  }

  next();
};

const logger = (req, res, next) => {
  const now = moment().format("DD MM YYYY hh:mm:ss");
  const method = req.method;
  const url = req.url;
  const queryParams = JSON.stringify(req.query);
  const body = JSON.stringify(req.body);
  const ip = req.ip;

  const logLine = `${now} [${method}] ${url} ${queryParams} ${body} ${ip}\n`;
  //console.log("Linea a escribir " +logLine)
  //console.log("Entre a escribir en el archivo")

  fs.appendFile("access_log.txt", logLine, (err) => {
    if (err) {
      console.error("Error al registrar la petición:", err);
    }
  });

  next();
};

const validateMovie = (req, res, next) => {
  const method = req.method.toLowerCase();

  let error;

  if (method === "put") {
    const route = req.originalUrl;

    console.log(route)

    if (route !== "Movies/updateAt") {
      const { id } = req.params;

      //console.log("El id es " + id)
      if (id === undefined) {
        res.status(400).send("Falta el ID en la URL");
        return;
      }

      

      const idSchema = Joi.number().required();
      const { error: idError } = idSchema.validate(id);
      if (idError) {
        res.status(400).send(idError.details[0].message);
        return;
      }
    }
  }
  const movieSchema = Joi.object({
    nombre: Joi.string().min(2).max(255).required(),
    genero: Joi.string().min(3).max(255).required(),
    fechaEstreno: Joi.date().iso().required(),
    director: Joi.string().min(3).max(255).required(),
    vista: Joi.boolean().required(),
    calificacion: Joi.number().min(0).max(10).required(),
    critica: Joi.string().allow("").optional(),
  });

  const { error: bodyError } = movieSchema.validate(req.body);

  // Check for errors in both ID (if applicable) and body
  if (error || bodyError) {
    res
      .status(400)
      .send(error ? error.details[0].message : bodyError.details[0].message);
    return;
  }

  next();
};

module.exports = { addCreatedAt, logger, validateMovie };
