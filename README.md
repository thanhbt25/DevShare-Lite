# DevShare Lite

## Thông tin tác giả
- **Họ và tên:** Bùi Trung Thanh  
- **MSSV:** 23020706  
- **Trường:** Đại học Công nghệ - Đại học Quốc gia Hà Nội  

---

## Tổng quan dự án

**DevShare Lite** là một diễn đàn trực tuyến nơi người dùng có thể:

- Đăng tải bài viết chia sẻ kiến thức
- Đặt câu hỏi về các vấn đề kỹ thuật
- Tham gia thảo luận, bình luận, vote và lọc bài viết

Mục tiêu là xây dựng một cộng đồng nhỏ phục vụ trao đổi thông tin trong lĩnh vực CNTT.

---

## Các chức năng chính

### 1. Xác thực người dùng
- Đăng ký tài khoản mới (sử dụng email và mật khẩu)
- Đăng nhập hệ thống
- Đăng xuất khỏi hệ thống

### 2. Quản lý bài viết
- Tạo bài viết mới (Markdown, tags)
- Lưu ở trạng thái Draft hoặc Publish công khai
- Xem danh sách bài viết (phân trang)
- Xem chi tiết, chỉnh sửa, xóa bài viết
- Lưu bài viết yêu thích (new)
- Upvote / Downvote bài viết (newnew)
- Xem ai đã tương tác và số lượt xem bài viết (newnew)

### 3. Bình luận
- Bình luận bài viết (sau khi đăng nhập)
- Trả lời bình luận (nested comment)

### 4. Tìm kiếm
- Tìm kiếm bài viết theo tiêu đề hoặc nội dung

### 5. Trang cá nhân
- Hiển thị và cập nhật thông tin cá nhân (new)
- Danh sách bài viết đã đăng và đang Draft

### 6. Chế độ lọc bài viết (new)
- Lọc theo newest, unanswered, popular, top-voted

### 7. Bảng xếp hạng (new)
- Top 5 người dùng đóng góp nhiều nhất
- Top 10 tags phổ biến nhất

## 🛠️ Công nghệ sử dụng

### 1. Frontend

**Công nghệ chính:**

- Next.js (v15.3.4)
- React (v19)
- TypeScript (v5+)
- Tailwind CSS (v3.4.1)

**Thư viện UI & Markdown:**

- `@uiw/react-md-editor`: Markdown editor có preview
- `@uiw/react-markdown-preview`: Hiển thị nội dung markdown
- `react-icons`: Icon dạng component

**Thư viện HTTP & Cookie:**

- `axios`: Gửi HTTP request tới backend
- `js-cookie`: Lưu token xác thực vào cookie

**Thư viện cấu hình & môi trường:**

- `dotenv`: Đọc biến môi trường từ `.env`
- `postcss`, `autoprefixer`: Hỗ trợ Tailwind CSS

**Thư viện upload ảnh:**

- Sử dụng Cloudinary API để upload ảnh từ local lên cloud

---

### 2. Backend

**Công nghệ chính:**

- NestJS (v11+)
- TypeScript (v5.7.3)

**Thư viện xác thực & bảo mật:**

- `passport`, `passport-jwt`, `@nestjs/passport`, `@nestjs/jwt`
- `bcryptjs`: Mã hóa mật khẩu người dùng

**Tiện ích hệ sinh thái NestJS:**

- `dotenv`: Biến môi trường
- `class-validator`: Xác thực DTO
- `reflect-metadata`: Decorators
- `rxjs`: Reactive programming

---

### 3. Cơ sở dữ liệu

- **MongoDB** (NoSQL)
- `mongoose`: ODM tương tác với MongoDB
- `@nestjs/mongoose`: Tích hợp với NestJS

---

## Cấu trúc thư mục

```

backend/ (theo cáu trúc thư mục của Nest.js)
├── app/ (module ứng dụng, nơi sử dụng các module khác) 
│   ├── app.controller.ts
│   ├── app.module.ts
│   └── app.service.ts
├── auth/ (module xử lý đăng ký, đăng nhập)
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── comments/ (module xử lý cơ sở dữ liệu liên quan tới comments)
│   ├── comments.controller.ts
│   ├── comments.module.ts
│   └── comments.service.ts
├── posts/ (module xử lý cơ sở dữ liệu liên quan tới posts)
│   ├── drafts.controller.ts
│   ├── posts.controller.ts
│   ├── posts.module.ts
│   └── posts.service.ts
└── users/ (module xử lý cơ sở dữ liệu liên quan tới users)
    ├── users.controller.ts
    ├── users.module.ts
    └── users.service.ts

frontend/
├── components/ (các thành phân tách nhỏ ra từ page và các thành phần phổ biến, được dùng nhiều)
│   ├── common/ (Navbar, Footer, Sidebar, Layout, MarkdownEditor): c
│   ├── create-post/
│   ├── index/
│   ├── post\_id/ (CommentEditor, CommentList, etc.)
│   ├── review/
│   └── update-profile/
├── contexts/ (UserContext) (lưu thông tin của người dùng trong phiên làm việc)
├── pages/ (Next.js routing)
└── utils/ (api.ts kết nối backend)

````

---

## Hướng dẫn cài đặt và chạy dự án

### 1. Yêu cầu hệ thống

- Node.js >= 18
- npm (theo Node.js)
- MongoDB (local hoặc MongoDB Atlas)
- Cloudinary (tuỳ chọn nếu muốn upload ảnh)

---

### 2. Chạy Backend (NestJS)

**Bước 1:** Mở terminal, vào thư mục backend:

```bash
cd ./backend/
````

**Bước 2:** Cài dependencies:

```bash
npm install
```

**Bước 3:** Tạo file `.env` dựa trên `.example.env`:

**Bước 4:** Khởi chạy server:

```bash
npm start
```

---

### 3. Chạy Frontend (Next.js)

**Bước 1:** Mở terminal mới, vào thư mục frontend:

```bash
cd ./frontend/
```

**Bước 2:** Cài dependencies:

```bash
npm install
```

**Bước 3:** Tạo file `.env.local` dựa trên `.example.env.local`:

**Bước 4:** Khởi chạy giao diện:

```bash
npm run dev
```
