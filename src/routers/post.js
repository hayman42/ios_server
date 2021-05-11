import express from "express";
import authService from "../services/authservice";
import postService from "../services/postservice";
import multer from "multer";

const app = express.Router();
let storage = multer.diskStorage({
    destination(req, file, cb) {
        const path = `src/static/`;
        cb(null, path);
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});
let upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }).array("images");

app.post("/upload", async (req, res) => {
    upload(req, res, async (err) => {
        try {
            if (err) throw new Error(err);
            const { name, email, token, ...postData } = req.body;
            const _id = await authService.authenticate(name, email, token);
            if (_id === null) return res.status(401).json({ msg: "unauthorized" });

            const { status, data } = await postService.upload(_id, postData, req.files);
            return res.status(status).json(data);
        } catch (e) {
            console.log(e);
            res.status(500).json({
                msg: "internal server error"
            });
        }
    });
});

app.get("/delete", async (req, res) => {
    try {
        var { postid, token } = req.query;
        postid = parseInt(postid);
        const { status, data } = await postService.delete(postid, token);
        res.status(status).json(data);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg: "internal server error"
        });
    }
});

export default app;