import fs from 'fs';

let content = fs.readFileSync('src/components/Icons.jsx', 'utf-8');

const regex = /\/assets\/([0-9a-f]+)\.svg/g;
let match;
const ids = new Set();
while ((match = regex.exec(content)) !== null) {
  ids.add(match[1]);
}

const imports = Array.from(ids).map(id => `import { svg_${id} as Svg_${id} } from '../generatedIcons.jsx';`).join('\n');

let newContent = content.replace(/<img([^>]*)src="\/assets\/([0-9a-f]+)\.svg"([^>]*)\/>/g, (res, pre, id, post) => {
  return `<Svg_${id} className="svg-icon-part" ${pre} ${post} />`;
});

if (!newContent.includes('generatedIcons')) {
  newContent = imports + '\n\n' + newContent;
}

fs.writeFileSync('src/components/Icons.jsx', newContent);
