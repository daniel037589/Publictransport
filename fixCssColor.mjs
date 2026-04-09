import fs from 'fs';
let content = fs.readFileSync('src/index.css', 'utf-8');

// Add "color: var(--color-text-nav);" to .navbar__item
// Add "color: var(--color-brand-blue);" to .navbar__item--active

content = content.replace(/\.navbar__item \{([^}]+)\}/, (match, inside) => {
  if (!inside.includes('color: var(--color-text-nav)')) {
    return `.navbar__item {${inside}  color: var(--color-text-nav);\n}`;
  }
  return match;
});

content = content.replace(/\.navbar__item--active \{([^}]+)\}/, (match, inside) => {
  if (!inside.includes('color: var(--color-brand-blue)')) {
    return `.navbar__item--active {${inside}  color: var(--color-brand-blue);\n}`;
  }
  return match;
});

fs.writeFileSync('src/index.css', content);
