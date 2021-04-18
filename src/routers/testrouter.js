import express from "express";
import testService from "../services/testservice"

const app = express.Router();

app.get("/test/:msg", async (req, res) => {
    var msg = req.params.msg;
    var ret = await testService.save(msg);
    console.log(ret);

    res.send("ok");
});

export default app;