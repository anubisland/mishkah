const fs = require('fs');
let code = fs.readFileSync('scripts/inline_babel.js', 'utf8');

// Target around 3345-3350:
const target = `                      </div>
                    </div>
                  </div>
                )}

                {/* POST-RECITATION WHATSAPP BROADCAST TOOL */}`;

const replacement = `                      </div>
                    </div>
                )}

                {/* POST-RECITATION WHATSAPP BROADCAST TOOL */}`;

if (code.includes(target)) {
  console.log('Target found!');
  code = code.replace(target, replacement);
  fs.writeFileSync('scripts/inline_babel.js', code, 'utf8');
} else {
  console.log('Target not found in inline_babel.js');
}
