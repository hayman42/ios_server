# server

## Prerequisites
- node.js

## How to
yarn install 후 루트 디렉토리에 .env 파일을 만들어 다음과 같이 작성 후 적절한 값 입력

```
DB_USER=<DB 유저이름>
DB_PASSWORD=<DB 암호>
ROOT_DIR=<프로젝트 최상위 디렉토리 경로>
GOOGLE_CID=<구글 Client ID> *optional
GOOGLE_CSECRET=<구글 Client 암호> *optional
KAKAO_CID=<카카오 <Client ID> *optional
KAKAO_CSECRET=<카카오 <Client 암호> *optional
JWT_SECRET=<JWT 비밀키>
```

optional 표시가 된 변수는 설정하실 필요가 없습니다.

JWT_SECRET=test 로 할 경우 인증 과정 없이 api 가 실행 됩니다.

이미지 파일 업로드 위해 루트 디렉토리에 static 디렉토리 생성

yarn start 로 서버 시작

yarn jest <원하는 테스트 파일 이름> 으로 테스트 코드를 실행 할 수 있습니다. 다만 서비스 유닛테스트가 아니라면 실패할 수 있습니다.

## TODO
- RESTful 하게 하기
- 유닛 테스트 코드
- 애플 로그인 방법 알아내기