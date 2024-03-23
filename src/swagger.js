const swaggerDoc = require('swagger-jsdoc')

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Movies API',
        version: '1.0.0',
        description: 'API para gestionar películas vistas y por ver',
      },
    },
    apis: ['./index.js'], // Archivos donde se definen las rutas
  };
  
  const specs = swaggerDoc(options);
  module.exports = specs;