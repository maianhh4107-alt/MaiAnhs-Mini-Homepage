# 💾 Mai Anh's Mini Homepage

Trang portfolio cá nhân dạng tương tác của **Nguyễn Mai Anh**, được thiết kế như một trang chủ cá nhân đầy màu sắc của Hàn Quốc đầu những năm 2000 (kiểu "minihompy" của Cyworld).

🔗 **Xem trực tiếp:** https://maianhh4107-alt.github.io/MaiAnhs-Mini-Homepage/

---

## ✨ Giới thiệu

Thay vì một portfolio thông thường, dự án này giới thiệu học vấn, kinh nghiệm và sở thích của mình qua một "mini homepage" hoài cổ, vui nhộn. Người xem bước vào qua màn hình intro, sau đó khám phá căn phòng ảo, bấm vào từng đồ vật để mở các mục tương ứng, nghe nhạc nền và để lại lời nhắn trong guestbook.

## 🎮 Tính năng

- **Màn hình intro**: nút *Enter My World* (hoặc *Skip Intro*), bấm vào là nhạc nền bắt đầu phát.
- **Mini Room**: căn phòng ảo, bấm vào ảnh, máy tính, poster, đĩa CD, chậu cây,... để nhảy tới mục tương ứng.
- **Profile card**: thẻ hồ sơ với ảnh đại diện và bộ đếm khách ghé thăm (visitor counter).
- **Today's Mood**: ghi một ghi chú ngắn trong ngày, được lưu trong trình duyệt (`localStorage`).
- **Mini Calendar**: lịch tháng hiện tại, đánh dấu ngày hôm nay và các ngày có sự kiện.
- **Mini Photo Booth** 📸: chụp 3 ảnh liên tiếp bằng webcam (đếm ngược 3 giây), trang trí dải ảnh bằng sticker kéo thả, rồi tải về dạng ảnh PNG.
- **My Stage**: kho video biểu diễn, mở bằng cửa sổ video YouTube kiểu retro.
- **Guestbook**: để lại nickname và lời nhắn, thả tim cho từng tin nhắn (lưu cục bộ trên trình duyệt).
- **Nhạc nền**: phát lặp lại, có nút bật/tắt âm thanh, tự phát tiếp khi đóng video hoặc photo booth.
- **Responsive**: hiển thị tốt trên cả máy tính và điện thoại; nhấn `Esc` để đóng các cửa sổ pop-up.

## 🗂️ Các mục trong trang

| Mục | Mô tả |
|---|---|
| 🏠 **Home / Mini Room** | Căn phòng ảo, profile card, ghi chú tâm trạng, lịch, liên kết nhanh |
| 👤 **Profile** | Học vấn (Đại học Ngoại thương, chuyên ngành Kinh tế quốc tế), IELTS, ngôn ngữ (Việt · Anh · Hàn) |
| 💼 **Work** | Kinh nghiệm làm việc: NP Education (Customer Service Officer) và GTP Media (KOL/KOC Booker) |
| 🎤 **Stage** | Video biểu diễn, hoạt động cùng Red Dancing Club |
| 🏆 **Badges + Skills** | Giải thưởng, chứng chỉ và kỹ năng (Word, Excel, PowerPoint, Canva, AI tools) |
| 📓 **Diary** | Những dòng cập nhật nhỏ |
| 💬 **Guestbook** | Bảng lời nhắn của khách ghé thăm |
| 📬 **Contact** | Thông tin liên hệ |

## 🛠️ Công nghệ sử dụng

| Nhóm | Công nghệ |
|---|---|
| Giao diện | React 19, TypeScript, Vite 7 |
| Style | Tailwind CSS 4, CSS tùy chỉnh theo phong cách retro, Radix UI |
| Hiệu ứng / icon | Framer Motion, Lucide React, React Icons |
| Dữ liệu phía client | TanStack Query, `localStorage` |
| API (tùy chọn) | Express 5, Zod, OpenAPI + Orval (tự sinh client và schema) |
| CSDL (chưa dùng) | PostgreSQL + Drizzle ORM (đã cấu hình sẵn) |
| Triển khai | GitHub Pages + GitHub Actions |

Dự án được tổ chức dạng **npm workspaces** (monorepo).

## 📁 Cấu trúc thư mục

```
MaiAnhs-Mini-Homepage/
├── artifacts/
│   ├── mai-anh-homepage/      # Website chính (React + Vite)
│   │   └── src/
│   │       ├── App.tsx        # Toàn bộ trang và các tương tác
│   │       ├── index.css      # Phong cách retro, căn phòng, hình nền
│   │       └── components/MiniPhotoBooth/
│   ├── api-server/            # API Express (endpoint lịch, health check)
│   └── mockup-sandbox/        # Môi trường thử nghiệm giao diện
├── lib/
│   ├── api-spec/              # Đặc tả OpenAPI + cấu hình Orval
│   ├── api-client-react/      # Hook gọi API được sinh tự động
│   ├── api-zod/               # Schema Zod được sinh tự động
│   └── db/                    # Cấu hình Drizzle ORM
├── scripts/                   # Script build, đồng bộ và kiểm thử
├── attached_assets/           # Ảnh đại diện, CV, nhạc nền
├── docs/ , assets/ , dist/    # Bản build dùng cho GitHub Pages
└── .github/workflows/deploy.yml
```

## 🚀 Chạy trên máy cá nhân

**Yêu cầu:** Node.js 20 trở lên.

```bash
# 1. Clone repository
git clone https://github.com/maianhh4107-alt/MaiAnhs-Mini-Homepage.git
cd MaiAnhs-Mini-Homepage

# 2. Cài thư viện
npm install --legacy-peer-deps

# 3. Chạy ở chế độ phát triển (http://localhost:3000)
npm run dev
```

Các lệnh hữu ích khác:

| Lệnh | Tác dụng |
|---|---|
| `npm run dev` | Chạy website ở chế độ phát triển (cổng 3000) |
| `npm run build` | Build website và đồng bộ ra `dist/`, `docs/` và thư mục gốc |
| `npm run typecheck` | Kiểm tra kiểu TypeScript toàn bộ dự án |

Biến môi trường mẫu nằm trong `.env.example` (`PORT`, `BASE_PATH`). Chế độ dev đã có sẵn endpoint giả (mock) cho lịch nên không cần chạy API server.

## 🌐 Triển khai (GitHub Pages)

Mỗi lần push lên nhánh `main`, GitHub Actions (`.github/workflows/deploy.yml`) sẽ tự động cài thư viện, build và đăng thư mục `dist/` lên GitHub Pages.

> **Lưu ý:** GitHub Pages chỉ phục vụ file tĩnh nên không có API thật. Vì vậy mini calendar trên bản online có thể hiển thị trạng thái `OFFLINE`; các phần còn lại (guestbook, ghi chú, photo booth) đều chạy hoàn toàn trên trình duyệt.

## 🔒 Quyền riêng tư

- Guestbook và ghi chú tâm trạng chỉ lưu trong `localStorage` của trình duyệt, **không** gửi lên máy chủ.
- Photo Booth cần quyền truy cập camera; ảnh được xử lý ngay trên trình duyệt và không được tải lên đâu cả.

## 📬 Liên hệ

- **Tên:** Nguyễn Mai Anh
- **GitHub:** [@maianhh4107-alt](https://github.com/maianhh4107-alt)
- **Website:** https://maianhh4107-alt.github.io/MaiAnhs-Mini-Homepage/

---

⭐ Cảm ơn bạn đã ghé thăm mini homepage của mình!
