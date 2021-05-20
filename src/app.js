import express from "express";
import expressLoader from "./loaders/express.js";
import dbLoader from "./loaders/db.js";
import swaggerLoader from "./loaders/swagger.js";

let app = express()
let port = process.env.PORT || 5000;

dbLoader();
app = expressLoader(app);
app = swaggerLoader(app);

export default app.listen(port, () => {
    console.log(`
    index: http://localhost:${port}
    docs: http://localhost:${port}/docs
    api test: http://localhost:${port}/test
    `);
});;