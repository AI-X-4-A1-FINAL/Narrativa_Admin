# 1. Node.js LTS 버전의 공식 이미지 사용
FROM node:18 AS build

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 패키지 파일 복사
COPY package*.json ./

# 4. 의존성 설치
RUN npm install

# 5. 소스 코드 복사
COPY . .

# 6. 환경 변수 파일 복사
COPY .env .env

# 7. React 애플리케이션 빌드
RUN npm run build

# 8. 'serve' 패키지 전역 설치
RUN npm install -g serve

# 9. 컨테이너 시작 시 'serve'를 통해 빌드된 파일 제공
CMD ["serve", "-s", "build", "-l", "3030"]

# 10. 컨테이너 외부에 노출할 포트 설정
EXPOSE 3030
