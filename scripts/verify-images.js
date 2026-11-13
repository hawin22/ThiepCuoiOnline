import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const dir = 'd:/QuynhThu/ThiepCuoi/public/images';
const files = fs.readdirSync(dir, { recursive: true });

async function verify() {
  for (const f of files) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isFile() && /\.(webp|jpg|jpeg|png)$/i.test(f)) {
      try {
        const buf = fs.readFileSync(p);
        const m = await sharp(buf).metadata();
        await sharp(buf).raw().toBuffer();
        console.log(`OK: ${f} (${m.width}x${m.height}, ${(buf.length / 1024).toFixed(0)} KB, channels=${m.channels})`);
      } catch (e) {
        console.error(`ERROR in ${f}: ${e.message}`);
      }
    }
  }
}

verify();
