# 使用官方 Node.js 镜像作为基础镜像
FROM node:latest as build-stage

# 设置工作目录
WORKDIR /app

# 拷贝 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 拷贝所有文件到工作目录
COPY . .

# 构建生产环境代码
RUN npm run build

# 使用 Nginx 镜像作为生产环境镜像
FROM nginx:latest

# 复制构建阶段生成的静态文件到 Nginx 默认的静态文件目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 暴露 Nginx 默认的 HTTP 端口
EXPOSE 80

# 容器启动时运行 Nginx
CMD ["nginx", "-g", "daemon off;"]