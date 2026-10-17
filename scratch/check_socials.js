const fs = require('fs');
const path = require('path');

function searchSocials(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git') continue;
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      searchSocials(full);
    } else if (file.endsWith('.html') || file.endsWith('.js')) {
      const content = fs.readFileSync(full, 'utf8');
      const twitter = content.match(/twitter\.com[^\"]*|x\.com[^\"]*/g) || [];
      const fb = content.match(/facebook\.com[^\"]*/g) || [];
      const ig = content.match(/instagram\.com[^\"]*/g) || [];
      
      const unalignedFb = fb.filter(f => !f.includes('HasshCorporation'));
      const unalignedIg = ig.filter(i => !i.includes('hasshcorporation'));
      
      if (twitter.length > 0 || unalignedFb.length > 0 || unalignedIg.length > 0) {
        console.log('Socials check in', full, { twitter, unalignedFb, unalignedIg });
      }
    }
  }
}
searchSocials('.');
