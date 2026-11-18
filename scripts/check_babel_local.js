const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Check with Babel parser
const babel = require('@babel/core');
try {
  // Extract inline script
  const startScript = html.indexOf('<script type="text/babel">');
  const endScript = html.indexOf('</script>', startScript);
  const code = html.substring(startScript + '<script type="text/babel">'.length, endScript);
  
  babel.transformSync(code, {
    presets: ['@babel/preset-react']
  });
  console.log('BABEL TRANSFORM PASSED WITH ZERO ERRORS!');
} catch (err) {
  console.error('Babel transform failed at:', err.message);
  process.exit(1);
}
