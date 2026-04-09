import fs from 'fs';
import path from 'path';

const assetsDir = 'public/assets';
const files = fs.readdirSync(assetsDir).filter(f => f.endsWith('.svg'));

let out = '';
files.forEach(f => {
  let content = fs.readFileSync(path.join(assetsDir, f), 'utf-8');
  // convert style="" to style={{}}
  content = content.replace(/style="([^"]*)"/g, (_, style) => {
    let s = style.split(';').filter(Boolean).map(x => x.split(':')).reduce((acc, [k,v]) => {
      acc[k.trim()] = v.trim(); return acc;
    }, {});
    return `style={${JSON.stringify(s)}}`;
  });
  // convert dash-case props to camelCase (e.g. preserveAspectRatio to preserveAspectRatio)
  // actually preserving AspectRatio is already camelCase in standard.
  // let's just make it a raw export string
  content = content.replace(/fill-rule/g, 'fillRule')
                   .replace(/clip-rule/g, 'clipRule')
                   .replace(/stroke-width/g, 'strokeWidth')
                   .replace(/stroke-linecap/g, 'strokeLinecap')
                   .replace(/stroke-linejoin/g, 'strokeLinejoin');
  
  // replace var(--fill-0, ...) with currentColor
  content = content.replace(/var\(--fill-[^"]*\)/g, 'currentColor');

  out += `export const svg_${f.replace('.svg','')} = (props) => (\n  ${content.replace(/<svg /, '<svg {...props} ')}\n);\n\n`;
});

fs.writeFileSync('src/generatedIcons.jsx', out);
