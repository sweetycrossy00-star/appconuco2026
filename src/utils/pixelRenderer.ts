/**
 * Procedural 8-Bit Pixel Art Renderer
 * Generates ultra-detailed retro sprites and silhouettes on HTML5 canvas.
 */

type DrawFunc = (
  r: (x: number, y: number, w: number, h: number, col: string) => void,
  e: (cx: number, cy: number, rx: number, ry: number, col: string) => void,
  l: (x0: number, y0: number, x1: number, y1: number, w: number, col: string) => void
) => void;

const SPRITE_DEFINITIONS: Record<string, DrawFunc> = {
  // MAÍZ / JETSA
  corn: (r, e, l) => {
    // Stalk & husk
    r(22, 14, 4, 32, '#2e7d32');
    r(22, 14, 2, 32, '#66bb6a');
    l(24, 40, 8, 30, 3, '#388e3c');
    l(24, 34, 40, 24, 3, '#388e3c');
    l(24, 26, 10, 18, 3, '#4caf50');
    l(24, 20, 38, 12, 3, '#4caf50');
    // Golden ear
    e(24, 24, 6, 12, '#fbc02d');
    e(24, 24, 5, 11, '#ffeb3b');
    // Kernel texture
    for (let y = 16; y <= 32; y += 4) {
      for (let x = 20; x <= 28; x += 3) {
        r(x, y, 2, 2, '#f57f17');
      }
    }
    // Silk tassels
    l(24, 12, 21, 5, 1, '#d7ccc8');
    l(24, 12, 27, 4, 1, '#d7ccc8');
  },

  // YUCA BRAVA / NEWAJÜ
  cassava_brava: (r, e, l) => {
    // Green palm-like digitate leaves (ancestral Vichada icon)
    l(24, 26, 24, 46, 3, '#6d4c41');
    l(18, 28, 10, 42, 6, '#5d4037');
    l(30, 28, 38, 42, 6, '#5d4037');
    l(24, 30, 24, 46, 7, '#4e342e');
    r(8, 43, 3, 2, '#ffcc80');
    r(37, 43, 3, 2, '#ffcc80');
    r(23, 45, 3, 1, '#ffcc80');
    // Leaves radiating up
    r(23, 12, 3, 16, '#2e7d32');
    const leaf = (x1: number, y1: number) => l(24, 14, x1, y1, 3, '#43a047');
    leaf(24, 3);
    leaf(12, 7);
    leaf(36, 7);
    leaf(8, 16);
    leaf(40, 16);
    leaf(16, 23);
    leaf(32, 23);
    // Patterns
    r(23, 6, 2, 2, '#81c784');
  },

  // YUCA DULCE / BAWA
  cassava_dulce: (r, e, l) => {
    l(24, 24, 24, 45, 3, '#795548');
    l(19, 29, 12, 42, 5, '#6d4c41');
    l(29, 29, 36, 42, 5, '#6d4c41');
    r(11, 42, 3, 2, '#ffe0b2');
    r(35, 42, 3, 2, '#ffe0b2');
    // Lush green crown
    e(24, 14, 10, 10, '#388e3c');
    e(24, 14, 8, 8, '#4caf50');
    r(22, 10, 4, 4, '#81c784');
  },

  // PIÑA / DUNUSI
  pineapple: (r, e, l) => {
    // Body oval
    e(24, 30, 10, 12, '#ff8f00');
    e(24, 30, 9, 11, '#ffb300');
    // Diamond lattice pattern
    for (let y = 22; y <= 38; y += 4) {
      for (let x = 17; x <= 31; x += 4) {
        r(x, y, 2, 2, '#e65100');
      }
    }
    // Spiky crown leaves
    l(24, 20, 24, 6, 3, '#2e7d32');
    l(24, 20, 16, 8, 3, '#388e3c');
    l(24, 20, 32, 8, 3, '#388e3c');
    l(24, 21, 10, 13, 2, '#4caf50');
    l(24, 21, 38, 13, 2, '#4caf50');
  },

  // PLÁTANO / BALATUNU
  banana: (r, e, l) => {
    // Banana cluster
    l(24, 8, 24, 16, 4, '#5d4037');
    l(24, 14, 14, 34, 5, '#fbc02d');
    l(24, 14, 24, 38, 5, '#fdd835');
    l(24, 14, 34, 34, 5, '#fbc02d');
    // Tips
    r(13, 33, 3, 3, '#33691e');
    r(23, 37, 3, 3, '#33691e');
    r(33, 33, 3, 3, '#33691e');
    r(23, 18, 2, 16, '#fff59d');
  },

  // ÑAME / EMAIRI
  yam: (r, e, l) => {
    // Tubercle in earth
    e(24, 38, 14, 6, '#4e342e');
    e(24, 38, 12, 5, '#6d4c41');
    r(23, 14, 2, 24, '#2e7d32');
    // Heart shaped leaf
    e(18, 14, 4, 4, '#4caf50');
    e(28, 14, 4, 4, '#4caf50');
    r(20, 16, 8, 4, '#388e3c');
    r(22, 12, 4, 4, '#81c784');
  },

  // AJÍ / NONOJI
  chili: (r, e, l) => {
    // Bush
    e(24, 24, 14, 10, '#2e7d32');
    e(24, 24, 12, 8, '#388e3c');
    // Red peppers
    const pep = (x: number, y: number) => {
      r(x, y - 1, 1, 2, '#1b5e20');
      e(x, y + 4, 2, 4, '#d50000');
      r(x - 1, y + 2, 1, 3, '#ff5252');
    };
    pep(16, 22);
    pep(24, 28);
    pep(32, 22);
    pep(28, 16);
    pep(20, 16);
  },

  // AUYAMA / AYA
  squash: (r, e, l) => {
    e(24, 32, 14, 11, '#e65100');
    e(24, 32, 13, 10, '#f57c00');
    l(24, 22, 24, 42, 1, '#bf360c');
    l(18, 23, 15, 41, 1, '#bf360c');
    l(30, 23, 33, 41, 1, '#bf360c');
    r(23, 18, 3, 5, '#558b2f');
    l(26, 19, 31, 16, 2, '#558b2f');
  },

  // AGUA / MERA
  water_drop: (r, e) => {
    // Teardrop shape
    for (let j = 6; j < 26; j++) {
      const w = (j - 6) * 0.5;
      r(24 - w, j, w * 2 + 1, 1, '#0288d1');
    }
    e(24, 32, 11, 11, '#0288d1');
    e(24, 32, 9, 9, '#29b6f6');
    // Highlight reflection
    r(18, 28, 3, 6, '#e1f5fe');
    r(19, 26, 2, 2, '#ffffff');
  },

  // CONUCO / PABI
  conuco_field: (r, e, l) => {
    // Rich brown soil bed
    r(4, 32, 40, 12, '#3e2723');
    r(4, 34, 40, 8, '#4e342e');
    // Green plants sprouting in rhythm
    const plant = (x: number) => {
      r(x, 26, 2, 8, '#2e7d32');
      l(x + 1, 28, x - 5, 22, 2, '#4caf50');
      l(x + 1, 27, x + 6, 21, 2, '#4caf50');
    };
    plant(12);
    plant(24);
    plant(36);
    // Boundary fences of woven wood
    r(2, 28, 3, 16, '#8d6e63');
    r(43, 28, 3, 16, '#8d6e63');
    r(2, 32, 44, 2, '#a1887f');
  },

  // SEBUCÁN / WABATA
  sebucan: (r, e, l) => {
    // Long woven tube for cassava pressing
    for (let y = 8; y <= 40; y += 2) {
      const w = 8 + Math.sin(y * 0.2) * 2;
      r(24 - w / 2, y, w, 2, y % 4 === 0 ? '#ffb74d' : '#e65100');
    }
    // Top loop & bottom weight anchor
    e(24, 6, 4, 3, '#8d6e63');
    r(22, 42, 5, 4, '#5d4037');
    r(20, 44, 9, 2, '#4e342e');
  },

  // CATUMARE / KOTE
  catumare: (r, e, l) => {
    // Woven knapsack basket
    r(14, 16, 20, 26, '#a1887f');
    for (let y = 16; y <= 40; y += 4) {
      for (let x = 14; x <= 32; x += 4) {
        r(x, y, 2, 2, '#6d4c41');
        r(x + 2, y + 2, 2, 2, '#ffcc80');
      }
    }
    // Straps of cumare fiber
    l(14, 16, 8, 34, 2, '#d7ccc8');
    l(34, 16, 40, 34, 2, '#d7ccc8');
  },

  // HACHA / SIPALI
  axe: (r, e, l) => {
    // Wooden handle angled
    l(10, 38, 36, 12, 4, '#5d4037');
    l(10, 38, 36, 12, 2, '#8d6e63');
    // Stone/steel axe head
    r(32, 8, 8, 14, '#78909c');
    r(36, 9, 6, 12, '#b0bec5');
    l(42, 8, 42, 22, 2, '#eceff1');
    // Binding twine
    r(30, 14, 4, 4, '#ffb74d');
  },

  // CHIGÜIRO / CAPIBARA / JOMOKOBI
  capybara: (r, e, l) => {
    // Stout brown body
    e(22, 30, 14, 9, '#795548');
    e(22, 30, 12, 7, '#8d6e63');
    // Heavy head
    r(30, 20, 12, 10, '#6d4c41');
    r(32, 22, 8, 7, '#8d6e63');
    // Nostrils & eyes
    r(40, 24, 2, 2, '#212121');
    r(34, 22, 2, 2, '#212121');
    // Round ears
    r(30, 18, 3, 3, '#4e342e');
    // Short legs
    r(14, 38, 4, 6, '#5d4037');
    r(26, 38, 4, 6, '#5d4037');
    r(33, 38, 4, 6, '#5d4037');
    // Grass
    r(8, 44, 32, 2, '#43a047');
  },

  // CACHICAMO / ARMADILLO / TUJUBÜ
  armadillo: (r, e, l) => {
    // Dome shell
    e(22, 28, 14, 9, '#5d4037');
    // Armor bands
    for (let x = 12; x <= 30; x += 3) {
      l(x, 20, x, 36, 1, '#d7ccc8');
    }
    // Pointed head
    l(34, 29, 44, 32, 3, '#795548');
    r(40, 29, 2, 2, '#212121');
    // Pointy ears
    r(34, 22, 2, 5, '#8d6e63');
    // Tapered ringed tail
    l(10, 31, 2, 36, 2, '#6d4c41');
    // Claws
    r(16, 37, 3, 5, '#4e342e');
    r(28, 37, 3, 5, '#4e342e');
  },

  // OSO PALMERO / TSONÜ
  anteater: (r, e, l) => {
    // Body with white diagonal sash
    e(22, 28, 12, 8, '#3e2723');
    l(14, 32, 28, 22, 3, '#f5f5f5');
    // Long tube snout
    l(30, 24, 44, 20, 2, '#4e342e');
    r(43, 20, 2, 2, '#212121');
    // Huge bushy tail
    e(10, 24, 8, 8, '#212121');
    e(8, 22, 6, 6, '#3e2723');
    // Strong digging claws
    r(26, 36, 4, 6, '#212121');
    r(16, 36, 4, 6, '#212121');
  },

  // VENADO / OWEBI
  deer: (r, e, l) => {
    // Slender body & neck
    e(20, 28, 10, 6, '#a1887f');
    l(27, 26, 34, 16, 3, '#8d6e63');
    // Head & black eye
    r(33, 14, 6, 5, '#6d4c41');
    r(37, 15, 2, 2, '#212121');
    // Antlers
    l(33, 13, 31, 6, 2, '#5d4037');
    l(31, 8, 27, 6, 1, '#5d4037');
    l(31, 8, 33, 4, 1, '#5d4037');
    // Long graceful legs
    l(14, 34, 13, 44, 2, '#6d4c41');
    l(24, 34, 25, 44, 2, '#6d4c41');
  },

  // JAGUAR / TIGRE / NEWÜTJÜ
  jaguar: (r, e, l) => {
    // Muscular tawny body
    e(24, 28, 13, 8, '#f57f17');
    e(24, 28, 11, 6, '#fbc02d');
    // Rosette spots
    r(18, 26, 2, 2, '#212121');
    r(24, 25, 2, 2, '#212121');
    r(28, 28, 2, 2, '#212121');
    r(20, 30, 2, 2, '#212121');
    // Feline head
    r(32, 20, 8, 8, '#f57f17');
    r(34, 22, 2, 2, '#ffd600');
    r(38, 24, 2, 2, '#212121');
    r(32, 17, 3, 3, '#e65100');
    // Long curved tail
    l(12, 27, 4, 22, 2, '#f57f17');
    l(4, 22, 4, 16, 2, '#212121');
    // Paws
    r(16, 36, 4, 6, '#f57f17');
    r(28, 36, 4, 6, '#f57f17');
  },

  // PESCADO / DUJUAI
  fish: (r, e, l) => {
    // Streamlined river fish
    e(24, 24, 14, 7, '#0288d1');
    e(24, 24, 12, 5, '#4fc3f7');
    // Tail fin
    l(11, 24, 4, 16, 3, '#0277bd');
    l(11, 24, 4, 32, 3, '#0277bd');
    // Dorsal & pectoral fins
    l(22, 17, 26, 12, 2, '#0277bd');
    l(28, 26, 24, 31, 2, '#0277bd');
    // Eye & gills
    r(32, 22, 2, 2, '#ffffff');
    r(33, 23, 1, 1, '#000000');
    l(28, 21, 28, 27, 1, '#01579b');
  },

  // LORO REAL / J̈URA
  parrot: (r, e, l) => {
    // Perched body
    e(24, 26, 7, 11, '#2e7d32');
    e(24, 26, 5, 9, '#43a047');
    // Yellow head crown
    r(22, 14, 7, 6, '#ffd600');
    // Black hooked beak
    l(29, 16, 34, 19, 2, '#212121');
    r(25, 16, 2, 2, '#212121');
    // Red and blue shoulder accents
    r(19, 24, 3, 5, '#d50000');
    r(18, 29, 3, 5, '#29b6f6');
    // Long tail feather
    l(22, 36, 18, 46, 3, '#2e7d32');
    // Branch
    r(10, 36, 28, 3, '#795548');
  },

  // TORTUGA TERECAY / JARA
  river_turtle: (r, e) => {
    // Smooth olive shell
    e(24, 26, 14, 9, '#33691e');
    e(24, 26, 12, 7, '#558b2f');
    // Yellow markings on shell
    r(20, 24, 3, 2, '#c0ca33');
    r(26, 24, 3, 2, '#c0ca33');
    // Head & flippers
    r(36, 25, 6, 4, '#558b2f');
    r(39, 26, 1, 1, '#000000');
    e(14, 34, 4, 3, '#33691e');
    e(32, 34, 4, 3, '#33691e');
  },

  // HORMIGA BACHACO / PÜBÜ
  leaf_ant: (r, e, l) => {
    // Triple segment ant
    e(14, 32, 5, 4, '#b71c1c'); // abdomen
    e(22, 31, 3, 3, '#880e4f'); // thorax
    e(28, 29, 3, 3, '#b71c1c'); // head
    // Big green leaf carried high
    l(22, 26, 34, 12, 4, '#4caf50');
    l(28, 16, 38, 10, 3, '#81c784');
    // Legs
    l(20, 33, 16, 41, 1, '#212121');
    l(22, 33, 24, 41, 1, '#212121');
    l(24, 33, 30, 41, 1, '#212121');
  },

  // GUSANO / TOLENAITO
  worm: (r, e) => {
    // Segmented wriggling pink/tan worm
    for (let i = 0; i < 5; i++) {
      const y = 34 - Math.sin((i / 4) * Math.PI) * 12;
      e(14 + i * 5, y, 4, 4, i % 2 === 0 ? '#ff80ab' : '#f06292');
    }
    // Head with eyes
    e(36, 28, 5, 5, '#ff4081');
    r(38, 26, 2, 2, '#212121');
  },

  // ÁRBOL DE LA VIDA / KALIAWIRINAE
  sacred_tree: (r, e, l) => {
    // Vast ancient trunk
    r(20, 24, 8, 22, '#4e342e');
    r(22, 24, 4, 22, '#6d4c41');
    // Sacred sprawling canopy
    e(24, 16, 18, 12, '#1b5e20');
    e(24, 14, 16, 10, '#2e7d32');
    e(24, 12, 12, 7, '#43a047');
    // Fruit sparkles of all plants
    r(16, 14, 3, 3, '#ffeb3b'); // maize
    r(28, 12, 3, 3, '#ff5722'); // achiote
    r(22, 8, 3, 3, '#e91e63'); // fruits
    r(32, 18, 3, 3, '#ffca28'); // pineapple
  },

  // MARACA / TSITSITO
  maraca: (r, e, l) => {
    // Wooden handle
    l(12, 38, 22, 26, 3, '#8d6e63');
    // Totumo gourd head
    e(28, 18, 8, 11, '#ffb74d');
    e(28, 18, 7, 10, '#ffa726');
    // Geometric spiral markings
    r(26, 15, 4, 4, '#e65100');
    r(27, 16, 2, 2, '#fff3e0');
    // Feathers at the top
    l(30, 8, 36, 4, 2, '#d50000');
    l(32, 10, 40, 7, 2, '#29b6f6');
  },
};

/**
 * Render a sprite onto a canvas or create a new canvas
 */
export function renderPixelSprite(
  spriteId: string,
  canvas: HTMLCanvasElement,
  options?: { asSilhouette?: boolean; glowColor?: string; scale?: number }
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.imageSmoothingEnabled = false;

  // Temp offscreen canvas for 48x48 base
  const offscreen = document.createElement('canvas');
  offscreen.width = 48;
  offscreen.height = 48;
  const octx = offscreen.getContext('2d', { willReadFrequently: true });
  if (!octx) return;

  const r = (x: number, y: number, ww: number, hh: number, col: string) => {
    octx.fillStyle = col;
    octx.fillRect(Math.round(x), Math.round(y), ww, hh);
  };
  const e = (cx: number, cy: number, rx: number, ry: number, col: string) => {
    octx.fillStyle = col;
    for (let j = Math.ceil(cy - ry); j <= Math.floor(cy + ry); j++) {
      const d = 1 - Math.pow((j + 0.5 - cy) / ry, 2);
      if (d <= 0) continue;
      const q = rx * Math.sqrt(d);
      const a = Math.round(cx - q);
      const b = Math.round(cx + q);
      if (b > a) octx.fillRect(a, j, b - a, 1);
    }
  };
  const l = (x0: number, y0: number, x1: number, y1: number, wd: number, col: string) => {
    octx.fillStyle = col;
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
    for (let i = 0; i <= n; i++) {
      octx.fillRect(
        Math.round(x0 + ((x1 - x0) * i) / n - wd / 2),
        Math.round(y0 + ((y1 - y0) * i) / n - wd / 2),
        wd,
        wd
      );
    }
  };

  const draw = SPRITE_DEFINITIONS[spriteId] || SPRITE_DEFINITIONS.corn;
  draw(r, e, l);

  // If silhouette is requested, turn all colored pixels into solid dark obsidian silhouette with subtle outline
  if (options?.asSilhouette) {
    const imgData = octx.getImageData(0, 0, 48, 48);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] > 30) {
        // Dark retro shadow
        d[i] = 15;     // R
        d[i + 1] = 10; // G
        d[i + 2] = 25; // B
        d[i + 3] = 255;
      }
    }
    octx.putImageData(imgData, 0, 0);

    // Draw silhouette with neon mystery glow
    ctx.save();
    ctx.shadowColor = options.glowColor || '#ffd23f';
    ctx.shadowBlur = 12;
    ctx.drawImage(offscreen, 0, 0, w, h);
    ctx.restore();
  } else {
    // Crisp pixel art draw
    ctx.drawImage(offscreen, 0, 0, w, h);
  }
}
