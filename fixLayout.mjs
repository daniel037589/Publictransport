import fs from 'fs';

let content = fs.readFileSync('src/components/Icons.jsx', 'utf-8');

// Replace the outer wrapper
content = content.replace(/<div className=\{className \|\| "icon-container"\} style=\{\{ width: '([^']+)', height: '([^']+)', position: 'relative' \}\}>/g, 
  (match, w, h) => `<svg className={className} width="${w.replace('px','')}" height="${h.replace('px','')}" viewBox="0 0 ${w.replace('px','')} ${h.replace('px','')}" style={{ flexShrink: 0, display: 'block' }}>`
);

// Replace the closing outer wrapper
content = content.replace(/<\/div>\n  \);\n\}/g, '</svg>\n  );\n}');

// Replace inner wrappers
// <div style={{ position: 'absolute', top: '48.3%', right: '0%', bottom: '0%', left: '0%' }}>
content = content.replace(/<div style=\{\{ position: 'absolute', top: '([^']+)', right: '([^']+)', bottom: '([^']+)', left: '([^']+)' \}\}>/g, 
  (match, t, r, b, l) => {
    let top = parseFloat(t);
    let right = parseFloat(r);
    let bottom = parseFloat(b);
    let left = parseFloat(l);
    
    // some might be 0 without %
    if (t === '0') top = 0;
    if (r === '0') right = 0;
    if (b === '0') bottom = 0;
    if (l === '0') left = 0;

    let width = 100 - left - right;
    let height = 100 - top - bottom;
    
    // fix rounding errors
    width = Math.round(width * 1000) / 1000;
    height = Math.round(height * 1000) / 1000;

    return `<svg x="${left}%" y="${top}%" width="${width}%" height="${height}%" overflow="visible">`;
  }
);

content = content.replace(/<\/div>/g, '</svg>');

// Fix Svg_ usage to just be standard JSX inner components
// wait, Svg_xxx are imported components that render `<svg>`. 
// If we place an `<Svg_...>` inside `<svg x="...">`, it's nested SVG, which is totally valid in browsers.
// But some wrappers don't have absolute inset, like in HomeIcon, it had an absolute style directly on Svg_...
// Let's check HomeIcon and RouteIcon.
content = content.replace(/<Svg_da5809e6f041433a024b18ee048931652f5866f4([^>]*)\/>/g, '<Svg_da5809e6f041433a024b18ee048931652f5866f4 width="100%" height="100%" />');
content = content.replace(/<Svg_4e1ca6c5c05d9e08f4612d2cbc25c2241d7cdaf4([^>]*)\/>/g, '<Svg_4e1ca6c5c05d9e08f4612d2cbc25c2241d7cdaf4 width="100%" height="100%" />');

// also clean style from other Svg_...
content = content.replace(/className="svg-icon-part"  alt="" style=\{\{ display: 'block', width: '100%', height: '100%', maxWidth: 'none' \}\} /g, 'width="100%" height="100%"');

fs.writeFileSync('src/components/Icons.jsx', content);
