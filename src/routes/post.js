import express from "express";
import AuthService from "../services/authservice";
import PostService from "../services/postservice";
// import UserService from "../services/userservice";
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
let upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }).array("images");

const postService = new PostService;
const authService = new AuthService;

const app = express.Router();

/**
 * @swagger
 *  /post/upload:
 *    post:
 *      summary: 게시글 업로드 api. 작성자 정보를 요청에 추가하면 보안문제 있으므로 배포 때 변경 필요.
 *      tags: [Post]
 *      description: 게시글을 업로드하고 이미지를 저장합니다.
 *      
 *      requestBody:
 *        description: 게시글 업로드 요청 포맷
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema: 
 *              $ref: '#/components/schemas/Post'
 *      responses:
 *       200:
 *        description: 업로드 성공
 */
app.post("/upload", authService.verifyToken, upload, async (req, res) => {
    try {
        const { author, ...postData } = req.body;
        const post = await postService.upload(author, postData, req.files);
        res.status(200)
            .cookie("token", req.newToken)
            .json({ post: post, });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ msg: e.message });
    }
});

/**
 * @swagger
 *  /post/delete:
 *    get:
 *      summary: 게시글 삭제 api
 *      tags: [Post]
 *      description: 게시글 삭제
 *      parameters:
 *        - in: query
 *          name: postid
 *          required: true
 *          description: 삭제할 게시글의 번호
 *          schema:
 *            type: integer
 *            example: 4
 *      responses:
 *       200:
 *        description: 게시글 삭제 성공
 */
app.get("/delete", authService.verifyToken, async (req, res) => {
    try {
        let { postid } = req.query;
        const { email } = req.cookies;
        postid = parseInt(postid);
        await postService.delete(postid, email);
        res.status(200)
            .cookie("token", req.newToken)
            .send();
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ msg: e.message });
    }
});

/**
 * @swagger
 *  /post/recent:
 *    get:
 *      summary: 최근 게시글을 가져오는 api
 *      tags: [Post]
 *      description: 게시글을 가져온다. 
 *                   응답으로 게시글에 대한 정보가 있는데, 이 때 images 에는 게시글에 첨부된 이미지 파일의 이름이 있다.
 *                   이를 이용하여 api를 통해 받아올 수 있다.
 *      parameters:
 *        - in: query
 *          name: num
 *          required: true
 *          description: 받아올 최근 게시글의 게수
 *          schema:
 *            type: integer
 *            example: 4
 *      responses:
 *       200:
 *        description: 게시글 받아오기 성공
 */
/**
 * @swagger
 *  /static/{filename}:
 *    get:
 *      summary: 파일 받아오기 api
 *      tags: [Post, Image]
 *      description: 첨부 파일을 받아온다.
 *      parameters:
 *        - in: path
 *          name: filename
 *          required: true
 *          description: 첨부 파일 이름
 *          schema:
 *            type: string
 *            example: some_image.jpg
 *      responses:
 *       200:
 *        description: 파일 받기 성공
 */
app.get("/recent", authService.verifyToken, async (req, res) => {
    try {
        let { num } = req.query;
        const posts = await postService.getRecentPosts(num);
        res.status(200)
            .cookie("token", req.newToken)
            .json({ posts: posts });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ msg: e.message });
    }
});

/**
 * @swagger
 *  /post/category:
 *    get:
 *      summary: 특정 카테고리의 게시글을 가져오는 api
 *      tags: [Post]
 *      description: 게시글을 가져온다. 
 *                   응답으로 게시글에 대한 정보가 있는데, 이 때 images 에는 게시글에 첨부된 이미지 파일의 이름이 있다.
 *                   이를 이용하여 api를 통해 받아올 수 있다.
 *      parameters:
 *        - in: query
 *          name: category
 *          required: true
 *          description: 검색할 게시글의 카테고리
 *          schema:
 *            type: string
 *            example: food
 *        - in: query
 *          name: num
 *          required: true
 *          description: 받아올 최근 게시글의 게수
 *          schema:
 *            type: integer
 *            example: 4
 *      responses:
 *       200:
 *        description: 게시글 받아오기 성공
 */
app.get("/category", authService.verifyToken, async (req, res) => {
    try {
        let { category, num } = req.query;
        const posts = await postService.getPostsByCategory(category, num);
        res.status(200)
            .cookie("token", req.newToken)
            .json({ posts: posts });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ msg: e.message });
    }
});

/**
 * @swagger
 *  /post/search:
 *    get:
 *      summary: 특정 검색어에 해당하는 게시글을 가져오는 api
 *      tags: [Post]
 *      description: 게시글을 가져온다. 
 *                   응답으로 게시글에 대한 정보가 있는데, 이 때 images 에는 게시글에 첨부된 이미지 파일의 이름이 있다.
 *                   이를 이용하여 api를 통해 받아올 수 있다.
 *      parameters:
 *        - in: query
 *          name: word
 *          required: true
 *          description: 검색어
 *          schema:
 *            type: string
 *            example: hello
 *        - in: query
 *          name: num
 *          required: true
 *          description: 받아올 최근 게시글의 게수
 *          schema:
 *            type: integer
 *            example: 10
 *      responses:
 *       200:
 *        description: 게시글 받아오기 성공
 */
app.get("/search", authService.verifyToken, async (req, res) => {
    try {
        let { word, num } = req.query;
        const posts = await postService.searchPostsByWords(word, num);
        res.status(200)
            .cookie("token", req.newToken)
            .json({ posts: posts });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ msg: e.message });
    }
});

/**
 * @swagger
 *  /post/author:
 *    get:
 *      summary: 특정 글쓴이의 게시글을 가져오는 api
 *      tags: [Post]
 *      description: 게시글을 가져온다. 
 *                   응답으로 게시글에 대한 정보가 있는데, 이 때 images 에는 게시글에 첨부된 이미지 파일의 이름이 있다.
 *                   이를 이용하여 api를 통해 받아올 수 있다.
 *      parameters:
 *        - in: query
 *          name: author
 *          required: true
 *          description: 검색할 글쓴이의 이름
 *          schema:
 *            type: string
 *            example: hayman42
 *        - in: query
 *          name: num
 *          required: true
 *          description: 받아올 최근 게시글의 게수
 *          schema:
 *            type: integer
 *            example: 4
 *      responses:
 *       200:
 *        description: 게시글 받아오기 성공
 */
app.get("/author", authService.verifyToken, async (req, res) => {
    try {
        let { author, num } = req.query;
        const posts = await postService.getPostsByAuthor(author, num);
        res.status(200)
            .cookie("token", req.newToken)
            .json({ posts: posts });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ msg: e.message });
    }
});

app.get("/like", authService.verifyToken, async (req, res) => {
    try {
        let { postid } = req.query;
        let { email } = req.cookies;
        await postService.likePost(postid, email);
        res.status(200)
            .cookie("token", req.newToken);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ msg: e.message });
    }
});

export default app;