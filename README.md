# IE212 (BigData) Toxic-Comment-Detection-on-YouTube-Livestreams Using phoBERT model and streaming on pySpark
- Khoa Khoa học và Kỹ thuật thông tin, Trường Đại học Công nghệ Thông tin, Đại học Quốc gia Thành phố Hồ Chí Minh.
- GVHD: TS. Đỗ Trọng Hợp.
Sản phẩm của chúng tôi sử dụng các mô hình transformer ([phoBERT](https://huggingface.co/vinai/phobert-base)) kết hợp với các mô hình phân loại truyền thống để nhận diện các bình luận tiêu cực trong một livestream trên YouTube. Điều này giúp người xem đánh giá mức độ độc hại của livestream và giúp nhà sáng tạo nội dung nhận diện những người xem thường xuyên đăng bình luận tiêu cực.
## Danh sách thành viên 

| STT  | Họ và Tên  | MSSV  |
|------------|------------|------------|
| 01  | Phạm Đăng An  | 22520027  |
| 02  | Nguyễn Quang Đăng  | 22520191  |

## Giới Thiệu
Với sự phát triển nhanh chóng của công nghệ thông tin, mạng xã hội đã trở thành một phần không thể thiếu trong cuộc sống hàng ngày của nhiều người. Theo báo cáo của Statista, tính đến tháng 10 năm 2023, hơn 60% dân số toàn cầu sử dụng mạng xã hội. Sự gia tăng người dùng kéo theo một lượng bài viết khổng lồ được chia sẻ mỗi ngày, đồng thời nhịp sống hiện đại đầy căng thẳng từ công việc, học tập, gia đình và xã hội càng dễ dàng thúc đẩy những bình luận tiêu cực, gây tổn hại đến không gian mạng.

Trong bối cảnh đó, việc phát hiện và xử lý các bình luận độc hại (toxic comments) trở thành một vấn đề quan trọng. Nhằm mục tiêu giải quyết vấn đề này, dự án Toxic-Comment-Detection-on-YouTube-Livestreams Using phoBERT model and streaming on PySpark đã được xây dựng. Dự án sử dụng mô hình phoBERT, một biến thể của BERT được tối ưu cho tiếng Việt, kết hợp với PySpark để xử lý và phân tích dữ liệu livestream trên YouTube theo thời gian thực.

Với khả năng phân loại chính xác các bình luận tiêu cực, hệ thống giúp người dùng nhận diện mức độ độc hại của livestreams và hỗ trợ nhà sáng tạo nội dung kịp thời can thiệp với những người xem có hành vi tiêu cực. Đây là một bước tiến quan trọng trong việc duy trì một môi trường mạng xã hội lành mạnh và tích cực.

Dự án không chỉ dừng lại ở việc phân loại các bình luận mà còn tích hợp công nghệ streaming trên PySpark để xử lý và phân tích dữ liệu lớn trong thời gian thực, mở ra nhiều cơ hội ứng dụng trong việc cải thiện các hệ thống quản lý cộng đồng trực tuyến.
## Công nghệ và môi trường sử dụng
- Window 11
- Google Colab( Preprocessing)
- Python 3.9.7
- ReactJS (Front-end)
- NextJS (Back-end)
- MongoDB
## Cài Đặt
```bash
# Clone repository về máy của bạn
git clone https://github.com/phamdanganuit/IE212[Bigdata].git

# Di chuyển vào thư mục dự án
cd IE212[Bigdata]
```
- Sau khi clone được dự án, tải model phoBert từ [link drive này](https://drive.google.com/drive/u/0/folders/10Kh9XqVOoT4iGPGvXBzZIp__FHg1Esan) ( Tải model pb), di chuyển folder đã tải vào dự án

- Mở giao diện kết quả
```
# Mở 1 terminal di chuyển vào Interface
cd .\Interface\
pip install -r requirements.txt
```
```

# Mở terminal: di chuyển vào thư mục BE
cd .\BE\
npm i
npm app.js
```
```
# Mở terminal: di chuyển vào thư mục FE
cd .\FE\
npm i
npm run dev
```
- Truy cập trang [localhost](http://localhost:5173/).
![image](https://github.com/user-attachments/assets/36912f59-e1e3-4c50-8f3c-d8bf6a92f5d5)
- Nhập link livestream
- Kết quả sẽ được phân tích bằng 2 biểu đồ, màu đỏ và vàng chiếm tỉ lệ càng cao thì livestream đó sẽ chứa nhiều comment toxic
- Top 10 người comment toxic nhiều nhất sẽ được hiện ở bảng dưới:
![image](https://github.com/user-attachments/assets/7edad98a-cbe5-4020-a96b-9d17413625e2)

