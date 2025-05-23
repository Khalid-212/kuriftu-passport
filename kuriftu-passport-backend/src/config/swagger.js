const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Kuriftu Passport API",
      version: "1.0.0",
      description: "API documentation for Kuriftu Passport application",
      contact: {
        name: "API Support",
        email: "support@kuriftu.com",
      },
    },
    servers: [
      {
        url: process.env.BACKEND_URL_DEVELOPMENT,
        description: "Development server",
      },
      {
        url: process.env.BACKEND_URL_PRODUCTION,
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/features/*/routes/*.js", "./src/features/*/models/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
