// Stitch 디자인 HTML 안의 이미지를 순서대로 내려받아 의미 있는 파일명으로 저장한다.
import { readFileSync, writeFileSync } from 'node:fs';

const NAMES = {
  home: ['avatar-default', 'hero-spring-picnic', 'char-pikachu', 'char-eevee', 'char-snorlax', 'char-ditto',
    'char-mew-togepi', 'char-squirtle-charmander', 'snorlax-pillow', 'ditto-mochi', 'eevee-lamp',
    'pikachu-airpods-case', 'curation-desk', 'curation-homecafe', 'review-snorlax', 'review-eevee-lamp',
    'review-ditto', 'review-pikachu-case'],
  list: [null, null, 'pikachu-keyring', 'ditto-reversible', 'slowpoke-cushion', 'togepi-egg', 'vulpix-twin',
    'gengar-pouch', 'eevee-blanket'],
  detail: [null, 'snorlax-main', 'snorlax-front', 'snorlax-embroidery', 'snorlax-size', 'snorlax-zipper',
    'snorlax-story', 'snorlax-point-1', 'snorlax-point-2', 'snorlax-point-3', 'snorlax-eyemask',
    'pikachu-slipper', 'eevee-pajama', 'snorlax-moodlight'],
};

for (const [page, names] of Object.entries(NAMES)) {
  const html = readFileSync(`.stitch/designs/${page}.html`, 'utf8');
  const urls = [...html.matchAll(/<img[^>]*src="(https:\/\/lh3[^"]+)"/g)].map((m) => m[1]);
  if (urls.length !== names.length) throw new Error(`${page}: expected ${names.length} images, found ${urls.length}`);
  for (const [i, name] of names.entries()) {
    if (!name) continue;
    const width = name.startsWith('avatar') || name.startsWith('char-') ? 400 : 1000;
    const res = await fetch(`${urls[i]}=w${width}-rj`);
    if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(`.stitch/images/${name}.jpg`, buf);
    console.log(name, res.headers.get('content-type'), buf.length);
  }
}
