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
*                     - nickname
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
*                     - deviceToken
*                 properties:
*                     email:
*                         type: string
*                         description: 유저 이메일
*                     name:
*                         type: string
*                         description: 유저 이름
*                     nickname:
*                         type: string
*                         description: 유저 닉네임
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
*                         description: 유저 위치 정보(경도)
*                     latitude:
*                         type: number
*                         description: 유저 위치 정보(위도)
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
*                     deviceToken:
*                         type: string
*                         description: 디바이스 토큰
*/
export default mongoose.model("users", new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    nickname: { type: String, unique: true },
    authProvider: { type: String, required: true },
    isSeller: { type: Boolean, default: false },
    recentHistory: [String],
    chatroomList: [Number],
    profileImageUrl: { type: String, default: "" },
    longitude: { type: Number, default: -1 },
    latitude: { type: Number, default: -1 },
    followers: [String],
    following: [String],
    posts: [Number],
    likes: [Number],
    deviceToken: { type: String, default: "" }
}, {
    timestamps: true
}));