import fs from 'fs';
let content = fs.readFileSync('src/components/RideScreens.css', 'utf-8');
content = content.replace(/\.map-section \{([^}]+)\}/, (match, body) => {
  if (!body.includes('flex-shrink')) {
    return `.map-section {${body}  flex-shrink: 0;\n}`;
  }
  return match;
});
fs.writeFileSync('src/components/RideScreens.css', content);
