import * as swaggerJsdoc from "swagger-jsdoc";
import * as fs from "fs";
import * as path from "path";

// Swagger set up
const options = {
    swaggerDefinition: {
      swagger: "2.0",
      info: {
        title: "SchoolSquirrel API Documentation",
        version: "1.0.0",
        description:
          "This is the documentation for the SchoolSquirrel API.",
        license: {
          name: "MIT",
          url: "https://github.com/SchoolSquirrel/SchoolSquirrel/blob/master/LICENSE"
        },
        contact: {
          name: "Hannes Rüger",
          url: "https://github.com/hrueger"
        }
      },
      servers: [
        {
          url: "http://localhost:3000/api/"
        }
      ]
    },
    apis: [
        "../../api/src/controllers/*.ts",
        "../../api/src/entity/*.ts",
    ]
};
const specs = swaggerJsdoc(options);
fs.writeFileSync(path.join(__dirname, "../docs/docs/developers/swagger.json"), JSON.stringify(specs, undefined, 4));