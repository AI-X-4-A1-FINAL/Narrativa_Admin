# 1. Node.js 18 공식 이미지 사용
FROM node:18 AS build

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 패키지 파일 복사
COPY package*.json ./

RUN npm install --legacy-peer-deps

# 4. 의존성 설치
RUN npm install

# 5. 소스 코드 복사
COPY . .

# 6. Babel 설정 파일 복사
COPY .babelrc .babelrc

# 7. OpenSSL Legacy Provider 활성화 및 React 애플리케이션 빌드
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

# 8. 'serve' 패키지 전역 설치
RUN npm install -g serve

# 9. 실행 단계: 빌드된 파일 제공
CMD ["serve", "-s", "build", "-l", "3030"]

# 10. 컨테이너 외부에 노출할 포트 설정
EXPOSE 3030
