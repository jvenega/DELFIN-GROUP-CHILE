import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Autenticación Intranet",
            version: "1.0.0",
            description: "Documentación de la API de autenticación"
        },
        servers: [
            {
                url: "http://localhost:4000",
            }
        ]
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        }
    },
    apis: ["./src/routes/*.ts", "./src/controllers/*.ts"]
};

export const swaggerSpec = swaggerJsdoc(options);