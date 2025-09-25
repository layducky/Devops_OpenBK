# Hệ thống học tập trực tuyến OPENBK

Chào mừng bạn đến với **Hệ thống học tập trực tuyến OPENBK**. Đây là một nền tảng học trực tuyến được xây dựng nhằm cung cấp các khóa học đa dạng và môi trường học tập tương tác.

Ứng dụng đã được triển khai tại: [openbk.me](openbk.me)

---
Link repo front-end & backend:
* [https://github.com/layducky/Open_BK_FE](https://github.com/layducky/Open_BK_FE)
* [https://github.com/layducky/Open_BK_BE](https://github.com/layducky/Open_BK_BE)

---
## Chức năng của hệ thống

### 1. **Tạo tài khoản và đăng nhập**

* Người dùng có thể đăng ký tài khoản mới và đăng nhập vào hệ thống.
* Đăng nhập sử dụng **JWT** (JSON Web Tokens) và **Cookies** để xác thực và duy trì phiên làm việc.

### 2. **Guest User**

* Người dùng không đăng nhập (guest) có thể xem thông tin chi tiết của các khóa học có sẵn.
* Guest không thể tham gia khóa học hoặc thực hiện các hành động quản lý.

### 3. **Learner Role (Học viên)**

* Tham gia các khóa học có sẵn.
* Xem bài kiểm tra của khóa học.
* Quản lý các khóa học đã đăng ký, theo dõi tiến độ học tập.

### 4. **Collaborator Role (Giảng viên)**

* Tạo khóa học mới với các **đơn vị học (unit)**.
* Mỗi unit có thể chứa các câu hỏi (question) cho bài kiểm tra.
* Quản lý và chỉnh sửa nội dung các khóa học đã tạo.

---

## Công nghệ sử dụng

* **Frontend**: [Next.js](https://github.com/layducky/Open_BK_FE)
* **Backend**: [Node.js](https://github.com/layducky/Open_BK_BE)
* **Database**: PostgreSQL
* **Authentication**: JWT + Cookies
* **Triển khai**: Docker + Docker Compose + Nginx + Certbot (SSL)

---

## Cách chạy dự án

### 1. Clone dự án

Clone cả **frontend**, **backend** và repo cấu hình Docker:

```bash
git clone https://github.com/layducky/Open_BK_FE
git clone https://github.com/layducky/Open_BK_BE
```

### 2. Tạo file .env .env.be và .env.fe trong thư mục Devops_OpenBK
Cấu trúc gồm:
* .env:
```bash
DB_USER=<...>
DB_PASS=<...>
DB_NAME=<...>
DB_PORT=<...>
```
* .env.be:
```bash
PORT = <...>
ACCESS_TOKEN_SECRET = '11111'
ACCESS_TOKEN_LIFETIME = '1d'
DB_DIALECT = 'postgres'
DB_URL='postgres://postgres:<dbpassword>@<db_container_name>:<port>/opbk'
FE_ORIGIN = <frontend_origin>
```

* .env.fe:
```bash
NEXT_PUBLIC_API_URL=http://<ip>:<port>/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<...>
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=<...>
NEXTAUTH_SECRET=<...>
```

### 3. Chạy dự án

```bash
docker compose up -d --build
```

Sau khi khởi chạy thành công:

* Ứng dụng : [openbk.me](openbk.me)

---

