import mongoose from "mongoose";

/** 
* @swagger
*     components:
*         schemas:
*             Post:
*                 type: object
*                 required:
*                     - author
*                     - title
*                     - content
*                     - link
*                     - needPeople
*                     - participants
*                     - price
*                     - category
*                 optional:
*                     - tags
*                 properties:
*                     author:
*                         type: string
*                         description: 작성자
*                     title:
*                         type: string
*                         description: 글 제목
*                     content:
*                         type: string
*                         description: 글 내용
*                     link:
*                         type: string
*                         description: 공동구매 링크
*                     longitude:
*                         type: number
*                         description: 구매 위치 정보(경도)
*                     latitude:
*                         type: number
*                         description: 구매 위치 정보(위도)
*                     needPeople:
*                         type: integer
*                         description: 희망 참여인원
*                     price:
*                         type: number
*                         description: 가격
*                     category:
*                         type: string
*                         description: 글 카테고리
*                     images:
*                         type: file
*                         description: 첨부 이미지
*                     tags:
*                         type: list
*                         description: 태그
*/
export default mongoose.model("posts", new mongoose.Schema({
    postid: { type: Number, required: true, unique: true },
    author: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    link: { type: String, required: true },
    longitude: { type: Number },
    latitude: { type: Number },
    view: { type: Number, required: true, default: 0 },
    nowPeople: { type: Number, required: true, default: 0 },
    needPeople: { type: Number, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: { type: [String], required: true },
    likes: { type: Number, required: true, default: 0 },
    tags: [String]
}, {
    timestamps: true
}));
