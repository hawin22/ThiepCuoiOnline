# 📸 HƯỚNG DẪN THÊM VÀ THAY ĐỔI ẢNH THIỆP CƯỚI

Toàn bộ ảnh của thiệp cưới đã được chuyển về lưu trữ cục bộ trong thư mục này (`public/images/`), **không còn phụ thuộc vào bất kỳ link ảnh online bên ngoài nào nữa**.

---

## 📁 Cấu trúc các thư mục ảnh:

```text
public/images/
├── hero/
│   └── cover.jpg         <- [Ảnh Bìa Chính] Kích thước gợi ý: 1200 x 800px (hoặc 1920 x 1080px, nằm ngang)
│
├── couple/
│   ├── bride.jpg         <- [Ảnh Chân Dung Cô Dâu] Gợi ý: 600 x 800px (tỷ lệ 3:4 đứng)
│   └── groom.jpg         <- [Ảnh Chân Dung Chú Rể] Gợi ý: 600 x 800px (tỷ lệ 3:4 đứng)
│
├── gallery/
│   ├── gallery-1.jpg     <- [Ảnh Album Cưới 1] Gợi ý: 1200 x 800px (ngang hoặc đứng đẹp mắt)
│   ├── gallery-2.jpg     <- [Ảnh Album Cưới 2]
│   ├── gallery-3.jpg     <- [Ảnh Album Cưới 3]
│   ├── gallery-4.jpg     <- [Ảnh Album Cưới 4]
│   ├── gallery-5.jpg     <- [Ảnh Album Cưới 5]
│   └── gallery-6.jpg     <- [Ảnh Album Cưới 6]
│
├── thankyou/
│   └── thankyou.jpg      <- [Ảnh Nền Mục Lời Cảm Ơn] Gợi ý: 1600 x 900px (nằm ngang)
│
└── qr/
    ├── qr-bride.png      <- (Tùy chọn) Mã QR mừng cưới Cô Dâu nếu muốn dùng ảnh riêng
    └── qr-groom.png      <- (Tùy chọn) Mã QR mừng cưới Chú Rể nếu muốn dùng ảnh riêng
```

---

## 🚀 Cách sử dụng:

### Cách 1 (Nhanh nhất - Không cần sửa code):
Bạn chỉ cần chép các file ảnh cưới thật của bạn vào đúng các thư mục tương ứng và đặt tên trùng với tên file có sẵn:
- Chép ảnh bìa vào `public/images/hero/` và đặt tên là `cover.jpg`
- Chép ảnh cô dâu vào `public/images/couple/` và đặt tên là `bride.jpg`
- Chép ảnh chú rể vào `public/images/couple/` và đặt tên là `groom.jpg`
- Chép 6 ảnh album vào `public/images/gallery/` và đặt tên từ `gallery-1.jpg` đến `gallery-6.jpg`
- Chép ảnh cảm ơn vào `public/images/thankyou/` và đặt tên là `thankyou.jpg`

### Cách 2 (Thêm/bớt ảnh hoặc đổi tên file tùy ý):
Nếu ảnh của bạn có định dạng khác (ví dụ `.png`, `.webp`, `.jpeg`) hoặc bạn muốn thêm 10-20 tấm ảnh vào Album cưới:
1. Bạn chép ảnh vào thư mục `public/images/gallery/` với tên bất kỳ (ví dụ `anh-1.jpg`, `anh-2.png`, ...).
2. Mở file cấu hình [`src/data/wedding.config.json`](file:///d:/QuynhThu/ThiepCuoi/src/data/wedding.config.json) tại mục `"gallery"`, bạn chỉ cần chỉnh sửa hoặc thêm dòng:
```json
"gallery": [
  { "url": "/images/gallery/anh-1.jpg", "title": "Ánh nhìn say đắm" },
  { "url": "/images/gallery/anh-2.png", "title": "Nụ cười rạng rỡ" },
  { "url": "/images/gallery/anh-moi.jpg", "title": "Khoảnh khắc ngọt ngào" }
]
```
Website sẽ tự động nhận diện và cập nhật ngay lập tức!
