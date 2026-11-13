import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGES_DIR = path.resolve(__dirname, '../public/images');
const BACKUP_DIR = path.resolve(__dirname, '../public/images_original_backup');

// Cấu hình kích thước mục tiêu cho từng thư mục (< Full HD, siêu nhẹ, cực nét)
const RULES = {
  // Ảnh chân dung cô dâu chú rể (khung oval hiển thị ~200x260px)
  couple: {
    maxWidth: 900,
    maxHeight: 1200,
    quality: 84,
  },
  // Album ảnh cưới (khổ dọc xem trên toàn màn hình laptop & điện thoại)
  gallery: {
    maxWidth: 1200,
    maxHeight: 1600,
    quality: 82,
  },
  // Ảnh bìa mở đầu thiệp
  hero: {
    maxWidth: 3840,
    maxHeight: 2160,
    quality: 82,
  },
  // Ảnh nền lời cảm ơn
  thankyou: {
    maxWidth: 3840,
    maxHeight: 2160,
    quality: 82,
  },
  // Mã QR ngân hàng (cần nét rõ từng chấm đen trắng để app ngân hàng quét nhạy)
  qr: {
    maxWidth: 700,
    maxHeight: 700,
    quality: 90,
  },
};

function getRuleForPath(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/').toLowerCase();
  for (const [key, rule] of Object.entries(RULES)) {
    if (normalized.includes(`/${key}/`) || normalized.startsWith(`${key}/`)) {
      return rule;
    }
  }
  return { maxWidth: 1600, maxHeight: 1600, quality: 82 };
}

function getAllImageFiles(dir, base = '') {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const relPath = path.join(base, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllImageFiles(fullPath, relPath));
    } else if (/\.(webp|jpg|jpeg|png)$/i.test(file)) {
      results.push({ fullPath, relPath, size: stat.size });
    }
  }
  return results;
}

async function main() {
  console.log('====================================================');
  console.log('   BẮT ĐẦU NÉN ẢNH CHO THIỆP CƯỚI (< FULL HD)');
  console.log('====================================================\n');

  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`Không tìm thấy thư mục ảnh: ${IMAGES_DIR}`);
    return;
  }

  // 1. Tạo thư mục sao lưu ảnh gốc an toàn
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const images = getAllImageFiles(IMAGES_DIR);
  console.log(`Tìm thấy ${images.length} ảnh cần tối ưu.\n`);

  let totalOriginalBytes = 0;
  let totalOptimizedBytes = 0;

  for (const img of images) {
    totalOriginalBytes += img.size;
    const rule = getRuleForPath(img.relPath);

    // Sao lưu file gốc nếu chưa có bản sao
    const backupPath = path.join(BACKUP_DIR, img.relPath);
    const backupSubdir = path.dirname(backupPath);
    if (!fs.existsSync(backupSubdir)) {
      fs.mkdirSync(backupSubdir, { recursive: true });
    }
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(img.fullPath, backupPath);
    }

    try {
      // Ưu tiên đọc từ file gốc nguyên bản (backup) để khi tăng độ phân giải sẽ lấy từ bản nét nhất
      const sourcePath = fs.existsSync(backupPath) ? backupPath : img.fullPath;
      const inputBuffer = fs.readFileSync(sourcePath);
      const metadata = await sharp(inputBuffer).metadata();
      const origW = metadata.width;
      const origH = metadata.height;
      const origMb = (fs.statSync(sourcePath).size / (1024 * 1024)).toFixed(2);

      // Thuật toán nén thông minh:
      // - Giữ nguyên 100% tỉ lệ khung hình gốc (fit: inside)
      // - Giới hạn kích thước tối đa <= Full HD (1920x1080 hoặc 1200x1600 cho ảnh đứng)
      // - Không phóng to nếu ảnh nhỏ hơn (withoutEnlargement: true)
      // - Tự động xoay chuẩn chiều ảnh theo EXIF (rotate())
      // - Dùng thuật toán nén WebP cấp độ cao (effort: 6) giúp giảm 90-95% dung lượng mà độ nét giữ nguyên
      const pipeline = sharp(inputBuffer)
        .rotate()
        .resize({
          width: rule.maxWidth,
          height: rule.maxHeight,
          fit: 'inside',
          withoutEnlargement: true,
        });

      let outputBuffer;
      const ext = path.extname(img.fullPath).toLowerCase();

      if (ext === '.webp') {
        outputBuffer = await pipeline.webp({ quality: rule.quality, effort: 6 }).toBuffer();
      } else if (ext === '.png') {
        outputBuffer = await pipeline.png({ quality: rule.quality, compressionLevel: 9 }).toBuffer();
      } else {
        outputBuffer = await pipeline.jpeg({ quality: rule.quality, mozjpeg: true }).toBuffer();
      }

      // Ghi đè file ảnh đã nén vào thư mục public/images/
      fs.writeFileSync(img.fullPath, outputBuffer);

      const newSize = outputBuffer.length;
      totalOptimizedBytes += newSize;
      const newKb = (newSize / 1024).toFixed(0);
      const savedPercent = (((img.size - newSize) / img.size) * 100).toFixed(1);

      const newMeta = await sharp(outputBuffer).metadata();
      console.log(`✓ ${img.relPath.padEnd(28)} | ${origW}x${origH} (${origMb}MB) -> ${newMeta.width}x${newMeta.height} (${newKb}KB) | Tiết kiệm: ${savedPercent}%`);
    } catch (err) {
      console.error(`✗ Lỗi nén ${img.relPath}:`, err.message);
      totalOptimizedBytes += img.size;
    }
  }

  const origTotalMb = (totalOriginalBytes / (1024 * 1024)).toFixed(2);
  const newTotalMb = (totalOptimizedBytes / (1024 * 1024)).toFixed(2);
  const totalSaved = (((totalOriginalBytes - totalOptimizedBytes) / totalOriginalBytes) * 100).toFixed(1);

  console.log('\n====================================================');
  console.log(`🎉 HOÀN TẤT NÉN ẢNH:`);
  console.log(`   Dung lượng ban đầu:  ${origTotalMb} MB`);
  console.log(`   Dung lượng sau nén:  ${newTotalMb} MB`);
  console.log(`   Tiết kiệm được:      ${totalSaved}% dung lượng mạng!`);
  console.log(`   (Đã lưu bản sao ảnh gốc tại: public/images_original_backup/)`);
  console.log('====================================================\n');
}

main().catch(console.error);
