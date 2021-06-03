import mongoose from "mongoose";

/** 
* @swagger
*     components:
*         schemas:
*             User:
*                 type: object
*                 required:
*                     - email
*                     - name
*                     - authProvider
*                     - isSeller
*                     - recentHistory
*                     - chatroomList
*                     - profileImageUrl
*                     - longitude
*                     - latitude
*                     - followers
*                     - following
*                     - posts
*                     - likes
*                 properties:
*                     email:
*                         type: string
*                         description: 유저 이메일
*                     name:
*                         type: string
*                         description: 유저 이름
*                     authProvider:
*                         type: string
*                         description: 소셜 로그인 경로
*                     isSeller:
*                         type: bool
*                         description: 판매자인지 확인하는 값
*                     recentHistory:
*                         type: list
*                         description: 최근 검색어
*                     chatroomList:
*                         type: list
*                         description: 참가 채팅방 리스트
*                     profileImageUrl:
*                         type: string
*                         description: 프로필 이미지 주소
*                     longitude:
*                         type: number
*                         description:
*                     latitude:
*                         type: number
*                         description:
*                     followers:
*                         type: list
*                         description: 팔로워 리스트
*                     following:
*                         type: list
*                         description: 팔로잉 리스트
*                     posts:
*                         type: list
*                         description: 작성 게시글 리스트
*                     likes:
*                         type: list
*                         description: 좋아요 한 게시글 리스트
*/
export default mongoose.model("users", new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    nickname: { type: String, unique: true },
    authProvider: { type: String, required: true },
    isSeller: { type: Boolean, default: false },
    recentHistory: [String],
    chatroomList: [Number],
    profileImageUrl: { type: String },
    longitude: { type: Number },
    latitude: { type: Number },
    followers: [String],
    following: [String],
    posts: [Number],
    likes: [Number]
}, {
    timestamps: true
}));