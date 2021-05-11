import express from "express";
import expressLoader from "./loaders/express";
import dbLoader from "./loaders/db";


let app = express()
let port = process.env.PORT || 5000;

dbLoader();
app = expressLoader(app);

export default app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});;