require("dotenv").config();
require("./configs/db");
const express = require('express');
const bodyParser = require('body-parser');
const fileRoutes = require('./routes/fileRouter');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const cors = require('cors');

// app
const app = express();
const port = process.env.PORT || 3000;

// middlwares
app.use(cors());
app.use(bodyParser.json());


// Swagger options
const swaggerOptions = {
  swaggerDefinition: YAML.load(path.join(__dirname, 'swagger', 'swagger.yaml')),
  apis: ['./routes/*.js'], // Specify the routes containing Swagger annotations
};

// Initialize Swagger-jsdoc
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/files', fileRoutes);

// default route handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
