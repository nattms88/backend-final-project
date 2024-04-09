import { Express } from "express";
import swaggerJsdoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export default function setupSwagger(app: Express) {
  const options: Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API Documentation - Movie Library",
        version: "1.0.0",
      },
      components: {
        schemas: {
          UserInput: {
            type: "object",
            properties: {
              username: { type: "string" },
              email: { type: "string", format: "email" },
              password: { type: "string", format: "password" },
              role: { type: "string" },
              isActive: { type: "boolean" }
            },
            required: ["username", "email", "password", "role"],
          },
          MovieInput: {
              type: "object",
              properties: {
                title: { type: "string" },
                releaseDate: { type: "string" },
                trailerLink: { type: "string" },
                poster: { type: "string" },
                genders: { type: "string" },
                isActive: { type: "boolean" }
              },
              required: ["title", "releaseDate", "trailerLink", "poster", "genders"],
          }
        }
      }
    },
    apis: ["./src/**/*.ts"],
  };
  const specs = swaggerJsdoc(options);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}
