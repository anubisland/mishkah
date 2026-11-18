const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// Replace body, #root, .islamic-screen-pattern CSS with exact mawaqeet-qibla body styles
const oldBodyCSS = `    body, #root, .islamic-screen-pattern {
      background-color: #F3F8F5 !important;
      /* Authentic Balanced Islamic Khatam Geometric Rosette from Mawaqeet & Qibla */
      background-image:
        radial-gradient(circle at 12% 8%, rgba(16, 185, 129, 0.08), transparent 36%),
        radial-gradient(circle at 88% 18%, rgba(217, 119, 6, 0.08), transparent 36%),
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Cg fill='none' stroke='%23064E3B' stroke-opacity='0.12' stroke-width='1.2'%3E%3Cpolygon points='48,6 60,36 90,48 60,60 48,90 36,60 6,48 36,36'/%3E%3Crect x='22' y='22' width='52' height='52'/%3E%3Crect x='22' y='22' width='52' height='52' transform='rotate(45 48 48)'/%3E%3Ccircle cx='48' cy='48' r='5' stroke='%23D97706' stroke-opacity='0.22' stroke-width='1' fill='%23D97706' fill-opacity='0.08'/%3E%3Ccircle cx='0' cy='0' r='5' stroke='%23D97706' stroke-opacity='0.22' stroke-width='1' fill='%23D97706' fill-opacity='0.08'/%3E%3Ccircle cx='96' cy='0' r='5' stroke='%23D97706' stroke-opacity='0.22' stroke-width='1' fill='%23D97706' fill-opacity='0.08'/%3E%3Ccircle cx='0' cy='96' r='5' stroke='%23D97706' stroke-opacity='0.22' stroke-width='1' fill='%23D97706' fill-opacity='0.08'/%3E%3Ccircle cx='96' cy='96' r='5' stroke='%23D97706' stroke-opacity='0.22' stroke-width='1' fill='%23D97706' fill-opacity='0.08'/%3E%3C/g%3E%3C/svg%3E") !important;
      background-attachment: fixed !important;
      color: #1E293B;
    }`;

const newBodyCSS = `    /* Exact Mawaqeet-Qibla Base Background: Soothing Sage-Ivory with Subtle Emerald Glow (No Distracting Tiled Stars on Body) */
    body, #root, .islamic-screen-pattern {
      background-color: #f3f8f5 !important;
      background-image:
        radial-gradient(circle at 12% 8%, rgba(16, 185, 129, 0.08), transparent 36%),
        radial-gradient(circle at 88% 18%, rgba(217, 119, 6, 0.08), transparent 36%) !important;
      background-attachment: fixed !important;
      color: #0a241c !important;
      min-height: 100vh;
    }`;

if (html.includes(oldBodyCSS)) {
  html = html.replace(oldBodyCSS, newBodyCSS);
  console.log('Replaced old body CSS successfully!');
} else {
  console.error('Could not find oldBodyCSS exactly, searching via regex...');
  html = html.replace(/body, #root, \.islamic-screen-pattern \{[\s\S]*?color: #1E293B;\s*\}/, newBodyCSS);
  console.log('Regex replaced body CSS!');
}

// Ensure header and emerald banners use exact Mawaqeet-Qibla Khatam patterns
const oldEmeraldBlock = `    /* Grand Emerald Header & Dark Sections with Intricate Visible Islamic Pattern */
    .emerald-pattern, .islamic-header-pattern {
      background-color: #04392B !important;
      background-image: 
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Cg fill='none' stroke='%23FBBF24' stroke-opacity='0.16' stroke-width='1.2'%3E%3Cpolygon points='48,6 60,36 90,48 60,60 48,90 36,60 6,48 36,36'/%3E%3Crect x='22' y='22' width='52' height='52'/%3E%3Crect x='22' y='22' width='52' height='52' transform='rotate(45 48 48)'/%3E%3Ccircle cx='48' cy='48' r='5' stroke='%23FBBF24' stroke-opacity='0.3' stroke-width='1' fill='%23F59E0B' fill-opacity='0.15'/%3E%3C/g%3E%3C/svg%3E"),
        linear-gradient(135deg, #02241A 0%, #064E3B 50%, #047857 100%) !important;
    }

    /* Big Green Hero Card with Rich Visible Islamic Tapestry Pattern */
    .islamic-hero-banner {
      background-color: #033224 !important;
      background-image: 
        radial-gradient(circle at 50% 20%, rgba(5, 150, 105, 0.45) 0%, rgba(3, 50, 36, 0.95) 75%, #011B13 100%),
        url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23FDE68A' stroke-width='1.5' stroke-opacity='0.32'%3E%3Cpath d='M40 0L49 23L73 31L49 39L40 62L31 39L7 31L31 23Z' fill='%23F59E0B' fill-opacity='0.15'/%3E%3Cpath d='M0 40L23 49L31 73L39 49L62 40L39 31L31 7L23 31Z' fill='%23F59E0B' fill-opacity='0.12'/%3E%3Ccircle cx='40' cy='40' r='7' stroke='%23FDE68A' stroke-opacity='0.5' stroke-width='1.6' fill='%23D97706' fill-opacity='0.25'/%3E%3Ccircle cx='0' cy='0' r='7' stroke='%23FDE68A' stroke-opacity='0.5' stroke-width='1.6' fill='%23D97706' fill-opacity='0.25'/%3E%3Ccircle cx='80' cy='0' r='7' stroke='%23FDE68A' stroke-opacity='0.5' stroke-width='1.6' fill='%23D97706' fill-opacity='0.25'/%3E%3Ccircle cx='0' cy='80' r='7' stroke='%23FDE68A' stroke-opacity='0.5' stroke-width='1.6' fill='%23D97706' fill-opacity='0.25'/%3E%3Ccircle cx='80' cy='80' r='7' stroke='%23FDE68A' stroke-opacity='0.5' stroke-width='1.6' fill='%23D97706' fill-opacity='0.25'/%3E%3C/g%3E%3C/svg%3E") !important;
      border: 2.5px solid rgba(245, 158, 11, 0.75) !important;
      box-shadow: 0 20px 40px -10px rgba(1, 27, 19, 0.6) !important;
      position: relative;
    }`;

const newEmeraldBlock = `    /* Exact Mawaqeet-Qibla Header & Islamic Accent Banners (Gold Khatam Rosettes on Rich Emerald Gradient) */
    header, .emerald-pattern, .islamic-header-pattern, .islamic-hero-banner {
      background-color: #064e3b !important;
      background-image:
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Cg fill='none' stroke='%23fbbf24' stroke-opacity='0.12' stroke-width='1.2'%3E%3Cpolygon points='48,6 60,36 90,48 60,60 48,90 36,60 6,48 36,36'/%3E%3Crect x='22' y='22' width='52' height='52'/%3E%3Crect x='22' y='22' width='52' height='52' transform='rotate(45 48 48)'/%3E%3C/g%3E%3C/svg%3E"),
        linear-gradient(135deg, #04392b 0%, #064e3b 50%, #047857 100%) !important;
      border-bottom: 2px solid rgba(251, 191, 36, 0.45) !important;
    }`;

html = html.replace(oldEmeraldBlock, newEmeraldBlock);

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Successfully aligned public/index.html background with mawaqeet-qibla!');
