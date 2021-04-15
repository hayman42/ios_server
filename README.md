# server

## Prerequisites
- node.js

## How to
yarn install 후 루트 디렉토리에 .env 파일을 만들어 다음과 같이 작성 후 적절한 값 입력

```
DB_USER=<DB 유저이름>
DB_PASSWORD=<DB 암호>
ROOT_DIR=<프로젝트 최상위 디렉토리 경로>
GOOGLE_CID=<구글 Client ID>
GOOGLE_CSECRET=<구글 Client 암호>
KAKAO_CID=<카카오 <Client ID>
KAKAO_CSECRET=<카카오 <Client 암호>
```

이 후 yarn start

## TODO
- RESTful 하게 하기
- API docs
- 유닛 테스트 코드