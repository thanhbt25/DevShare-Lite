# *DevShareLite*
"DevShare Lite" là một diễn đàn trực tuyến nơi người dùng có thể đăng tải các bài viết chia sẻ kiến thức, đặt câu hỏi về các vấn đề kỹ thuật, và tham gia trả lời, bình luận. Mục tiêu là xây dựng một cộng đồng nhỏ, tập trung vào việc trao đổi thông tin trong lĩnh vực CNTT

## *Yêu cầu chức năng*
1. Xác thực Người dùng:
- Đăng ký tài khoản mới (sử dụng email và mật khẩu).
- Đăng nhập vào hệ thống.
- Đăng xuất khỏi hệ thống.

2. Quản lý Bài viết (Posts):
- Người dùng đã đăng nhập có thể tạo bài viết mới (tiêu đề, nội dung sử dụng Markdown cơ bản, gắn thẻ (tags) liên quan).
- Bài viết có thể lưu trữ ở trạng thái nháp (Draft), và có thể được công khai (Publish) cho mọi người cùng xem
- Xem danh sách các bài viết (có phân trang).
- Xem chi tiết một bài viết.
- Người tạo bài viết có thể chỉnh sửa hoặc xóa bài viết của mình.

3. Bình luận:
- Người dùng đã đăng nhập có thể bình luận về bài viết
- Người dùng có thể trả lời cho một comment bên trong bài viết

4. Tìm kiếm Cơ bản:
- Tìm kiếm bài viết và câu hỏi dựa trên tiêu đề hoặc nội dung.

5. Trang Cá nhân Người dùng (Basic User Profile):
- Hiển thị thông tin cơ bản của người dùng (tên, email).
- Danh sách các bài viết đã đăng, danh sách bài viết đang ở trạng thái Draft chờ đăng.

## *Công nghệ sử dụng*
1. Frontend
- Sử dụng React.js với framework Next.js
2. Backend 
- Sử dụng Node.js với Nest.js (TypeScript)
3. Cơ sở dữ liệu

4. Quản lý mã nguồn 
- Git 