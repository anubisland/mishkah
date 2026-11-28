    // Decorative frames around the slides, chosen once for the whole deck in
    // the studio. The ornamented ones follow the style of printed mushaf
    // pages: a coloured band on each side holding a repeated floral arabesque
    // (or an eight-pointed star), with a thin rule across the top and bottom.
    // Drawn as inline SVG so they show the same on screen and in exports.
    const DECK_FRAMES = [
      { id: 'classic', label: 'ذهبي بسيط' },
      { id: 'violet-floral', label: 'زهري بنفسجي', band: '#6B3FA0', stripe: '#C9B3E6', rule: '#E2A93B', stem: '#2E8B83', leaf: '#8DA33A', petal: '#E5738F', petal2: '#9B6FD0', heart: '#F4C542' },
      { id: 'emerald-floral', label: 'زهري أخضر', band: '#1F5A46', stripe: '#BFD8C5', rule: '#C9A040', stem: '#2E7D6B', leaf: '#7FA04A', petal: '#D9785F', petal2: '#C9A040', heart: '#F2D27A' },
      { id: 'rose-floral', label: 'زهري وردي', band: '#9C3D5E', stripe: '#F1C6D3', rule: '#D9A441', stem: '#3B8C88', leaf: '#93A845', petal: '#E06C8A', petal2: '#B57BC9', heart: '#F5D06B' },
      { id: 'gold-star', label: 'نجمة ثمانية', band: '#16302A', stripe: '#D9B25F', rule: '#D9B25F', star: '#D9B25F', star2: '#F4EEDF' },
      // Different drawings, not only different colours (tile: which one).
      { id: 'tulip-crimson', label: 'خزامى عثماني', tile: 'tulip', band: '#7A1F2B', stripe: '#F3D9A4', rule: '#C9A040', stem: '#2F6B4F', leaf: '#4F8A5B', petal: '#C8323E', petal2: '#2E5E9E', heart: '#F2C14E' },
      { id: 'rumi-gold', label: 'أرابيسك ذهبي', tile: 'rumi', band: '#0F3B33', stripe: '#D9B25F', rule: '#D9B25F', fill: '#0F3B33', line: '#D9B25F', accent: '#F4EEDF' },
      { id: 'medallion-blue', label: 'شمسات زرقاء', tile: 'medallion', band: '#1D3F72', stripe: '#E7D7A8', rule: '#C9A040', fill: '#F7F1E1', line: '#1D3F72', accent: '#C9A040', petal: '#3E7CB1' },
      { id: 'lattice-sage', label: 'تشبيك هندسي', tile: 'lattice', band: '#3F5E4A', stripe: '#D8E3CF', rule: '#B8963E', fill: '#3F5E4A', line: '#E9DFC2', accent: '#B8963E' },
      { id: 'none', label: 'بلا إطار' }
    ];
    const DECK_FRAME_IDS = DECK_FRAMES.map((f) => f.id);

    // One repeat of the floral column, 120 wide and 160 tall: a stem, two
    // mirrored scrolls, a flower and a pair of leaves.
    function FloralTile({ f }) {
      const half = (
        <g fill="none" stroke={f.stem} strokeWidth="4" strokeLinecap="round">
          <path d="M60,18 C34,14 18,40 34,54 C46,64 58,52 50,44" />
          <path d="M60,112 C38,110 26,128 40,140 C50,148 58,138 52,132" />
          <ellipse cx="30" cy="80" rx="13" ry="6" fill={f.leaf} stroke="none" transform="rotate(-35 30 80)" />
          <g stroke="none" transform="translate(50,44)">
            <ellipse cx="-5" cy="-7" rx="4" ry="8" fill={f.petal2} transform="rotate(-25 -5 -7)" />
            <ellipse cx="5" cy="-7" rx="4" ry="8" fill={f.petal2} transform="rotate(25 5 -7)" />
            <ellipse cx="0" cy="-9" rx="4" ry="9" fill={f.petal} />
          </g>
          <ellipse cx="24" cy="124" rx="11" ry="5" fill={f.leaf} stroke="none" transform="rotate(30 24 124)" />
          <circle cx="52" cy="132" r="5" fill={f.petal} stroke="none" />
        </g>
      );
      return (
        <g>
          <line x1="60" y1="0" x2="60" y2="160" stroke={f.stem} strokeWidth="4" />
          {half}
          <g transform="translate(120,0) scale(-1,1)">{half}</g>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="60" cy="66" rx="9" ry="16" fill={f.petal} transform={'rotate(' + a + ' 60 82)'} />
          ))}
          <circle cx="60" cy="82" r="8" fill={f.heart} />
          <circle cx="60" cy="8" r="5" fill={f.petal2} />
        </g>
      );
    }

    function StarTile({ f }) {
      return (
        <g transform="translate(60,60)">
          <rect x="-30" y="-30" width="60" height="60" fill={f.star} />
          <rect x="-30" y="-30" width="60" height="60" fill={f.star} transform="rotate(45)" />
          <circle r="16" fill={f.band} />
          <circle r="7" fill={f.star2} />
          <circle cx="0" cy="60" r="5" fill={f.star} />
        </g>
      );
    }

    // Ottoman tulip and carnation on a waving stem, with long saz leaves (120 x 180).
    function TulipTile({ f }) {
      const leaf = 'M0,0 C15,-10 30,-5 40,10 C25,5 12,8 0,0 Z';
      return (
        <g>
          <path d="M60,0 C90,30 30,60 60,90 C90,120 30,150 60,180" fill="none" stroke={f.stem} strokeWidth="4" />
          <line x1="50" y1="55" x2="32" y2="44" stroke={f.stem} strokeWidth="3" />
          <g transform="translate(30,45) rotate(-35)">
            <path d="M0,0 C-11,-6 -13,-22 -9,-32 L-3,-21 L0,-36 L3,-21 L9,-32 C13,-22 11,-6 0,0 Z" fill={f.petal} />
            <path d="M-3,-4 L0,-20 L3,-4 Z" fill={f.heart} />
          </g>
          <line x1="70" y1="128" x2="88" y2="136" stroke={f.stem} strokeWidth="3" />
          <g transform="translate(90,136) rotate(40)">
            {[-48, -24, 0, 24, 48].map((a) => <ellipse key={a} cx="0" cy="-12" rx="4" ry="11" fill={f.petal2} transform={'rotate(' + a + ')'} />)}
            <path d="M-6,0 L6,0 L3,9 L-3,9 Z" fill={f.leaf} />
          </g>
          <path d={leaf} fill={f.leaf} transform="translate(66,78) rotate(-20)" />
          <path d={leaf} fill={f.leaf} transform="translate(54,104) scale(-1,1) rotate(-20)" />
          <circle cx="60" cy="90" r="5" fill={f.heart} />
        </g>
      );
    }

    // Arabesque: interlocking spiral scrolls ending in split leaves (120 x 140).
    function RumiTile({ f }) {
      const scroll = (
        <g>
          <path d="M60,0 C60,25 18,22 18,48 C18,70 46,72 48,57 C50,46 37,45 35,54" fill="none" stroke={f.line} strokeWidth="5" strokeLinecap="round" />
          <path d="M35,54 C27,50 22,58 26,66 C30,60 34,60 35,54 Z" fill={f.line} />
          <path d="M18,48 C8,40 4,30 10,22 C12,32 16,38 18,48 Z" fill={f.line} />
        </g>
      );
      return (
        <g>
          {scroll}
          <g transform="translate(120,70) scale(-1,1)">{scroll}</g>
          <path d="M60,60 L68,70 L60,80 L52,70 Z" fill={f.accent} />
          <circle cx="60" cy="0" r="4" fill={f.accent} />
        </g>
      );
    }

    // A lobed medallion with a rosette inside, joined by diamonds (120 x 150).
    function MedallionTile({ f }) {
      return (
        <g>
          <path d="M60,-10 L70,0 L60,10 L50,0 Z M60,140 L70,150 L60,160 L50,150 Z" fill={f.line} />
          <circle cx="60" cy="75" r="40" fill={f.accent} />
          <circle cx="60" cy="75" r="36" fill={f.fill} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <circle key={a} cx="60" cy="53" r="10" fill={f.petal} transform={'rotate(' + a + ' 60 75)'} />
          ))}
          <circle cx="60" cy="75" r="12" fill={f.accent} />
          <circle cx="60" cy="75" r="5" fill={f.line} />
          <circle cx="14" cy="75" r="4" fill={f.line} /><circle cx="106" cy="75" r="4" fill={f.line} />
        </g>
      );
    }

    // Geometric interlace: overlapping circles with a star point at each crossing (120 x 120).
    function LatticeTile({ f }) {
      const centres = [[30, 30], [90, 30], [30, 90], [90, 90], [60, 60], [60, 0], [60, 120], [0, 60], [120, 60]];
      return (
        <g>
          {centres.map(([x, y]) => <circle key={x + '-' + y} cx={x} cy={y} r="30" fill="none" stroke={f.line} strokeWidth="2.5" />)}
          {[[60, 60], [60, 0], [0, 60], [120, 60], [60, 120]].map(([x, y]) => (
            <path key={x + ':' + y} d={'M' + x + ',' + (y - 7) + ' L' + (x + 7) + ',' + y + ' L' + x + ',' + (y + 7) + ' L' + (x - 7) + ',' + y + ' Z'} fill={f.accent} />
          ))}
        </g>
      );
    }

    const ORNAMENT_TILES = {
      floral: { draw: FloralTile, height: 160 },
      star: { draw: StarTile, height: 120 },
      tulip: { draw: TulipTile, height: 180 },
      rumi: { draw: RumiTile, height: 140 },
      medallion: { draw: MedallionTile, height: 150 },
      lattice: { draw: LatticeTile, height: 120 }
    };

    let ornamentFrameCount = 0;

    // A side band 200 wide, the full 900 tall, drawn for the left side; the
    // right side is the same band mirrored.
    function OrnamentBand({ f, id, side }) {
      const tile = ORNAMENT_TILES[f.tile || (f.star ? 'star' : 'floral')];
      const Tile = tile.draw;
      const tileH = tile.height;
      return (
        <svg className={'mk-ornament-band ' + side} viewBox="0 0 200 900" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <pattern id={id} x="27" y="10" width="120" height={tileH} patternUnits="userSpaceOnUse" patternTransform="scale(1.333)">
              <Tile f={f} />
            </pattern>
          </defs>
          <g transform={side === 'right' ? 'translate(200,0) scale(-1,1)' : undefined}>
            <rect x="0" y="0" width="26" height="900" fill={f.band} />
            {/* A golden wave down the outer band, as on mushaf page borders. */}
            <path d={'M13,0 ' + Array.from({ length: 30 }, (_, i) => 'Q' + (i % 2 ? 5 : 21) + ',' + (i * 30 + 15) + ' 13,' + (i * 30 + 30)).join(' ')}
              fill="none" stroke={f.rule} strokeWidth="3" />
            <rect x="26" y="0" width="10" height="900" fill={f.stripe} />
            <rect x="36" y="0" width="160" height="900" fill={f.fill || (f.star ? f.band : 'transparent')} />
            <rect x="36" y="0" width="160" height="900" fill={'url(#' + id + ')'} />
            <rect x="196" y="0" width="4" height="900" fill={f.rule} />
          </g>
        </svg>
      );
    }

    function OrnamentFrame({ frameId }) {
      const f = DECK_FRAMES.find((x) => x.id === frameId);
      // Pattern ids must be unique: many slides can be on one page.
      const [id] = useState(() => 'mk-orn-' + (++ornamentFrameCount));
      if (!f || !f.band) return null;
      return (
        <div className="mk-ornament" style={{ '--mk-orn-rule': f.rule, '--mk-orn-band': f.band }}>
          <OrnamentBand f={f} id={id + 'l'} side="left" />
          <OrnamentBand f={f} id={id + 'r'} side="right" />
        </div>
      );
    }

    function isOrnamentFrame(frameId) {
      const f = DECK_FRAMES.find((x) => x.id === frameId);
      return !!(f && f.band);
    }

    // The studio's frame choice: a small preview of each frame.
    function DeckFramePicker({ value, onChange }) {
      return (
        <div className="space-y-2">
          <h4 className="font-black text-emerald-950">🖼 إطار العرض كله</h4>
          <div className="grid grid-cols-3 gap-2">
            {DECK_FRAMES.map((f) => (
              <button key={f.id} type="button" onClick={() => onChange(f.id)}
                className={'rounded-xl border-2 p-1 text-xs font-bold text-emerald-950 ' + (value === f.id ? 'border-gold-500 bg-gold-50' : 'border-slate-200 hover:border-gold-300')}>
                <span className="block h-10 rounded-md mb-1 relative overflow-hidden" style={{ background: '#F4EEDF' }}>
                  {f.band && <span className="absolute inset-y-0 right-0 w-3" style={{ background: f.band }} />}
                  {f.band && <span className="absolute inset-y-0 left-0 w-3" style={{ background: f.band }} />}
                  {f.band && <span className="absolute inset-y-0 right-3 w-1.5" style={{ background: f.accent || f.petal || f.star }} />}
                  {f.band && <span className="absolute inset-y-0 left-3 w-1.5" style={{ background: f.accent || f.petal || f.star }} />}
                  {f.id === 'classic' && <span className="absolute inset-1.5 border-2 border-gold-500" />}
                </span>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      );
    }
