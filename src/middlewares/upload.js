import multer from "multer";

let storage = multer.diskStorage({
    fileFilter: (req, file, cb) => {

    },
    destination(req, file, cb) {
        const path = `static/`;
        cb(null, path);
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});
export default multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }).array("images");