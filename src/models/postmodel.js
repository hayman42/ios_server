import mongoose from "mongoose";
import pointSchema from "./pointSchema";

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
*                     - price
*                     - category
*                 properties:
*                     author:
*                         type: string
*                         description: 작성자
*                     email:
*                         type: string
*                         description: 작성자 이메일
*                     title:
*                         type: string
*                         description: 글 제목
*                     content:
*                         type: string
*                         description: 글 내용
*                     link:
*                         type: string
*                         description: 공동구매 링크
*                     needPeople:
*                         type: integer
*                         description: 희망 참여인원
*                     price:
*                         type: integer
*                         description: 가격
*                     category:
*                         type: string
*                         description: 글 카테고리
*                     images:
*                         type: file
*                         description: 첨부 이미지
*                     likes:
*                         type: integer
*                         description: 좋아요 수
*                     tags:
*                         type: list
*                         description: 태그
*                     profileImg:
*                         type: string
*                         description: 대표이미지 파일명
*                     location:
*                         type: GeoJSON Point
*                         description: 위치 정보
*/
export default mongoose.model("posts", new mongoose.Schema({
    postid: { type: Number, required: true, unique: true },
    author: { type: String, required: true },
    email: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    link: { type: String, required: true },
    view: { type: Number, required: true, default: 0 },
    nowPeople: { type: Number, required: true, default: 0 },
    needPeople: { type: Number, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: { type: [String], required: true },
    likes: { type: Number, required: true, default: 0 },
    tags: [String],
    profileImg: { type: String, default: null },
    location: {
        type: pointSchema,
        index: "2dsphere"
    }
}, {
    timestamps: true
}));
