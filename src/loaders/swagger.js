import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "gdong",
            version: "1.0.0",
            description: "api docs",
            contact: {
                name: "hayman42",
                email: "hayman42@naver.com",
            }
        },
        servers: [
            {
                url: "http://localhost:5000/api/v0",
            },
        ],
    },
    apis: [process.env.ROOT_DIR + "/src/routes/*.js", process.env.ROOT_DIR + "/src/models/*.js"],
};

const specs = swaggerJsdoc(options);

export default app => {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
    return app;
};