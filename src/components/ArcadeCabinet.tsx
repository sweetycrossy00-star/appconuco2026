import React, { useEffect, useRef, useState } from 'react';
import { sound } from '../services/sound';
import { Volume2, VolumeX, Pause, Play, RotateCcw, Award, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onEarnXp: (amount: number, reason: string) => void;
  playerName: string;
  arcadeStars: number;
  onUpdateStars: (stars: number[]) => void;
  savedStars: number[];
}

export const ArcadeCabinet: React.FC<Props> = ({
  onEarnXp,
  playerName,
  onUpdateStars,
  savedStars,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const diplomaCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.isMuted);
  const [showDiplomaModal, setShowDiplomaModal] = useState(false);
  const [joystickAngle, setJoystickAngle] = useState(0);

  // We mount the retro arcade engine on canvasRef
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const c = cv.getContext('2d');
    if (!c) return;

    c.imageSmoothingEnabled = false;
    const W = 320;
    const H = 200;

    let animId: number;
    let f = 0;
    let sc = 'menu'; // 'intro', 'coin', 'menu', 'game', 'go'
    let cf = 0;
    let cc = 3;
    let deaths = 0;
    let gof = 0;
    let pz = false;
    let gi = 0;
    let g: any = null;
    let L = 0;
    let lives = 3;
    let prog = 0;
    let goal = 1;
    let ph = 'play';
    let t0 = 0;
    let sel = -1;
    let going = -1;
    let gw = 0;
    let lau = -1;
    let mx = 160;
    let my = 100;
    let warp = 0.004;
    let pt: any[] = [];
    let shk = 0;
    let ban = 0;

    const keys: Record<string, number> = {};
    const stars = Array.from({ length: 150 }, () => ({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: Math.random(),
    }));

    let SV = [...savedStars];

    const saveStarsLocal = () => {
      try {
        localStorage.setItem('arcv', JSON.stringify(SV));
        onUpdateStars(SV);
      } catch {}
    };

    const tot = () => SV.reduce((a, b) => a + b, 0);

    const burst = (x: number, y: number, n: number) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.28;
        const s = 0.6 + Math.random() * 2.4;
        pt.push({
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s - 1,
          l: 40 + Math.random() * 40,
          c: ['#ffd23f', '#ffffff', '#ff9f1c', '#4cc9f0', '#ff4d6d'][i % 5],
          z: 1 + Math.random() * 1.4,
        });
      }
    };

    const ok = () => {
      if (ph !== 'play') return;
      prog++;
      if (prog >= goal) {
        ph = 'lvl';
        t0 = f;
        sound.levelUp();
        burst(160, 100, 70);
        SV[gi] = Math.max(SV[gi], L + 1);
        saveStarsLocal();
        onEarnXp(80, `Nivel Superado: ${GN[gi]}`);
      }
    };

    const hit = () => {
      if (ph !== 'play') return;
      lives--;
      sound.hurt();
      shk = 10;
      if (lives <= 0) {
        deaths++;
        ph = 'over';
        t0 = f;
      }
    };

    const begin = () => {
      prog = 0;
      ph = 'play';
      shk = 0;
      g.lv = 0;
      goal = g.init();
      lives = g.lv || 3;
      ban = g.nb ? 0 : 70;
    };

    const startG = (i: number) => {
      gi = i;
      g = GS[i];
      L = Math.min(SV[i], 2);
      sc = 'game';
      pz = false;
      begin();
    };

    const toMenu = () => {
      if (sc === 'intro' || sc === 'coin' || sc === 'go') return;
      sc = 'menu';
      going = -1;
      pz = false;
    };

    const R = (x: number, y: number, w: number, h: number, col: string) => {
      c.fillStyle = col;
      c.fillRect(Math.round(x), Math.round(y), w, h);
    };

    const T = (s: string, x: number, y: number, z: number, k?: string, a?: CanvasTextAlign) => {
      c.font = `${z}px "Press Start 2P", monospace`;
      c.textAlign = a || 'left';
      c.fillStyle = '#000a';
      c.fillText(s, x + 1, y + 1);
      c.fillStyle = k || '#fff';
      c.fillText(s, x, y);
    };

    const GN = ['GUSANOS', 'MALEZA', 'SIEMBRA', 'MEMORIA', 'LLUVIA', 'LETRAS', 'CAPIBARA'];
    const GC = ['#ff8fab', '#b388ff', '#5be37d', '#4cc9f0', '#4aa3ff', '#ffd23f', '#ff9f1c'];

    const WD: [string, string, number][] = [
      ['maíz', 'jetsa', 1],
      ['piña', 'dunusi', 3],
      ['ñame', 'emairi', 4],
      ['ají', 'nonoji', 5],
      ['auyama', 'aya', 7],
      ['plátano', 'balatunu', 0],
      ['agua', 'mera', 8],
      ['casabe', 'peri', 11],
      ['conuco', 'pabi', 15],
      ['sembrar', 'uba', 14],
      ['monte', 'unu', 9],
      ['cortar', 'ükuta', 10],
      ['gusano', 'tolenaito', 12],
      ['hueco', 'mütjü', 13],
      ['yuca dulce', 'bawa', 16],
      ['yuca brava', 'newajü', 17],
    ];

    const star = (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, col: string) => {
      ctx.fillStyle = col;
      const SPAT = ['0001000', '0011100', '1111111', '0111110', '0011100', '0110110', '0100010'];
      SPAT.forEach((r, j) => {
        for (let i = 0; i < 7; i++) {
          if (r[i] === '1') {
            ctx.fillRect(Math.round(x + i * s), Math.round(y + j * s), Math.ceil(s), Math.ceil(s));
          }
        }
      });
    };

    // Games definition array
    const GS = [
      // 0: Gusanos
      {
        tip: 'TOLENAITO = GUSANO · MÜTJÜ = HUECO',
        h: [] as any[],
        sp: 70,
        lf: 110,
        st: 0,
        t: 0,
        fx: [] as any[],
        init() {
          const co = [3, 3, 4][L];
          const ro = [2, 3, 3][L];
          this.h = [];
          for (let r = 0; r < ro; r++) {
            for (let q = 0; q < co; q++) {
              this.h.push({ x: ((q + 1) * W) / (co + 1), y: 26 + ((r + 0.5) * 158) / ro + 6, k: 0, t: 0, u: 0 });
            }
          }
          this.sp = [70, 50, 38][L];
          this.lf = [110, 85, 65][L];
          this.st = [0, 0.22, 0.3][L];
          this.t = 0;
          this.fx = [];
          return [8, 12, 16][L];
        },
        upd() {
          this.t++;
          if (this.t % this.sp === 0) {
            const e = this.h.filter((o) => !o.k);
            if (e.length) {
              const o = e[Math.floor(Math.random() * e.length)];
              o.k = Math.random() < this.st ? 's' : 'w';
              o.t = this.lf;
              o.u = 0;
            }
          }
          this.h.forEach((o) => {
            if (!o.k) return;
            o.t--;
            if (o.t > 0) o.u = Math.min(1, o.u + 0.12);
            else {
              o.u -= 0.12;
              if (o.u <= 0) o.k = 0;
            }
          });
          this.fx = this.fx.filter((q) => --q.t > 0);
        },
        clk(x: number, y: number) {
          this.h.forEach((o) => {
            if (o.k && o.u > 0.4 && Math.hypot(x - o.x, y - o.y + 8) < 20) {
              if (o.k === 'w') {
                this.fx.push({ s: '¡TOLENAITO!', x: o.x, y: o.y - 24, t: 40 });
                burst(o.x, o.y - 8, 12);
                sound.correct();
                o.k = 0;
                ok();
              } else {
                this.fx.push({ s: '¡PIEDRA!', x: o.x, y: o.y - 24, t: 40 });
                o.k = 0;
                hit();
              }
            }
          });
        },
        drw() {
          R(0, 16, W, H - 16, '#6b3f1f');
          R(0, 16, W, 6, '#5be37d');
          this.h.forEach((o) => {
            c.fillStyle = '#2b1608';
            c.beginPath();
            c.ellipse(o.x, o.y, 18, 8, 0, 0, 6.29);
            c.fill();
            if (o.k) {
              const u = o.u;
              if (o.k === 'w') {
                R(o.x - 6, o.y - 18 * u, 12, 14, '#ff80ab');
                R(o.x - 3, o.y - 18 * u, 2, 2, '#000');
                R(o.x + 1, o.y - 18 * u, 2, 2, '#000');
              } else {
                R(o.x - 8, o.y - 14 * u, 16, 12, '#90a4ae');
              }
            }
          });
          this.fx.forEach((q) => T(q.s, q.x, q.y - (40 - q.t) / 3, 7, '#ffd23f', 'center'));
        },
      },

      // 1: Maleza
      {
        tip: 'ARRANCA LA MALEZA · CUIDA JETSA, DUNUSI Y EMAIRI',
        s: [] as any[],
        sp: 55,
        lf: 150,
        pp: 0.3,
        t: 0,
        fx: [] as any[],
        init() {
          this.s = [];
          for (let i = 0; i < 12; i++) {
            this.s.push({ x: 34 + (i % 4) * 84, y: 58 + Math.floor(i / 4) * 50, k: 0, t: 0, u: 0 });
          }
          this.sp = [55, 42, 30][L];
          this.lf = [150, 120, 95][L];
          this.pp = [0.3, 0.35, 0.4][L];
          this.t = 0;
          this.fx = [];
          return [8, 12, 16][L];
        },
        upd() {
          this.t++;
          if (this.t % this.sp === 0) {
            const e = this.s.filter((o) => !o.k);
            if (e.length) {
              const o = e[Math.floor(Math.random() * e.length)];
              o.k = Math.random() < this.pp ? 'p' : 'w';
              o.nm = ['JETSA', 'DUNUSI', 'EMAIRI', 'NONOJI', 'AYA'][Math.floor(Math.random() * 5)];
              o.t = this.lf;
              o.u = 0;
            }
          }
          this.s.forEach((o) => {
            if (!o.k) return;
            o.t--;
            if (o.t > 0) o.u = Math.min(1, o.u + 0.1);
            else {
              o.u -= 0.1;
              if (o.u <= 0) o.k = 0;
            }
          });
          this.fx = this.fx.filter((q) => --q.t > 0);
        },
        clk(x: number, y: number) {
          this.s.forEach((o) => {
            if (o.k && o.u > 0.4 && Math.hypot(x - o.x, y - o.y + 6) < 17) {
              if (o.k === 'w') {
                burst(o.x, o.y - 6, 10);
                sound.correct();
                o.k = 0;
                ok();
              } else {
                this.fx.push({ s: '¡' + o.nm + ' ES PLANTA!', x: o.x, y: o.y - 26, t: 50 });
                o.k = 0;
                hit();
              }
            }
          });
        },
        drw() {
          R(0, 16, W, H - 16, '#2f7d3a');
          this.s.forEach((o) => {
            c.fillStyle = '#4a2c15';
            c.beginPath();
            c.ellipse(o.x, o.y + 2, 16, 6, 0, 0, 6.29);
            c.fill();
            if (o.k) {
              if (o.k === 'w') {
                R(o.x - 7, o.y - 18, 14, 18, '#880e4f');
                T('MALEZA', o.x, o.y - 20, 5, '#ff4d6d', 'center');
              } else {
                R(o.x - 6, o.y - 20, 12, 20, '#4caf50');
                T(o.nm, o.x, o.y - 22, 6, '#ffd23f', 'center');
              }
            }
          });
          this.fx.forEach((q) => T(q.s, q.x, q.y - (50 - q.t) / 4, 6, '#ff4d6d', 'center'));
        },
      },

      // 2: Siembra
      {
        tip: 'UBA = SEMBRAR · ELIGE LA PLANTA Y TOCA UNA PARCELA',
        nS: 4,
        p: [] as any[],
        tmax: 600,
        tm: 600,
        sl: -1,
        rq: 0,
        m: '',
        mt: 0,
        nr() {
          this.rq = Math.floor(Math.random() * this.nS);
          this.tm = this.tmax;
        },
        init() {
          const n = [3, 4, 6][L];
          this.nS = [4, 5, 6][L];
          this.p = [];
          for (let i = 0; i < n; i++) {
            this.p.push({ x: 50 + (i % 3) * 85, y: i < 3 ? 84 : 124, w: -1, g: 0 });
          }
          this.tmax = [11, 9, 7][L] * 60;
          this.sl = -1;
          this.m = '';
          this.mt = 0;
          this.nr();
          return [5, 7, 9][L];
        },
        upd() {
          this.tm--;
          if (this.mt > 0) this.mt--;
          if (this.tm <= 0) {
            this.m = '¡TIEMPO!';
            this.mt = 50;
            hit();
            this.nr();
          }
        },
        clk(x: number, y: number) {
          for (let i = 0; i < this.nS; i++) {
            if (Math.abs(x - ((i + 0.5) * W) / this.nS) < 20 && Math.abs(y - 172) < 17) {
              this.sl = i;
              sound.pop();
              return;
            }
          }
          if (this.sl < 0) return;
          this.p.forEach((p) => {
            if (p.w < 0 && Math.abs(x - p.x) < 28 && Math.abs(y - p.y) < 17) {
              if (this.sl === this.rq) {
                p.w = this.sl;
                this.sl = -1;
                sound.correct();
                burst(p.x, p.y, 8);
                ok();
                this.nr();
              } else {
                this.m = 'ESA ES ' + WD[this.sl][1].toUpperCase();
                this.mt = 60;
                this.sl = -1;
                hit();
              }
            }
          });
        },
        drw() {
          R(0, 16, W, H - 16, '#3d8f3d');
          R(0, 16, W, 46, '#1c1250');
          T('SIEMBRA: ' + WD[this.rq][1].toUpperCase(), 160, 42, 10, '#ffd23f', 'center');
          T('(' + WD[this.rq][0] + ')', 160, 56, 7, '#9ad2f8', 'center');

          this.p.forEach((p) => {
            R(p.x - 24, p.y - 13, 48, 26, '#7a4a24');
            if (p.w >= 0) {
              R(p.x - 8, p.y - 10, 16, 20, '#5be37d');
              T(WD[p.w][1], p.x, p.y + 4, 6, '#fff', 'center');
            }
          });

          for (let i = 0; i < this.nS; i++) {
            const x = ((i + 0.5) * W) / this.nS;
            R(x - 17, 158, 34, 28, this.sl === i ? '#ffd23f' : '#fdf3d0');
            T(WD[i][1], x, 174, 5, '#1a1030', 'center');
          }
          if (this.mt > 0) T(this.m, 160, 146, 8, '#ff4d6d', 'center');
        },
      },

      // 3: Memoria
      {
        tip: 'EMPAREJA LA PLANTA CON SU NOMBRE SIKUANI',
        nb: 1,
        cd: [] as any[],
        ch: 45,
        a: null as any,
        b: null as any,
        lk: 0,
        init() {
          const n = [4, 6, 8][L];
          const ids = [0, 1, 2, 3, 4, 5, 6, 7].slice(0, n);
          this.cd = [];
          ids.forEach((w) => {
            this.cd.push({ w, t: 0, f: 0, m: 0 });
            this.cd.push({ w, t: 1, f: 0, m: 0 });
          });
          this.cd.sort(() => Math.random() - 0.5);
          this.cd.forEach((q, i) => {
            q.x = 11 + (i % 4) * 76;
            q.y = 22 + Math.floor(i / 4) * 44;
          });
          this.a = this.b = null;
          this.lk = 0;
          return n;
        },
        upd() {
          if (this.b && --this.lk <= 0) {
            const a = this.a;
            const b = this.b;
            this.a = this.b = null;
            if (a.w === b.w) {
              a.m = b.m = 1;
              sound.correct();
              burst(a.x + 35, a.y + 20, 8);
              ok();
            } else {
              a.f = b.f = 0;
              hit();
            }
          }
        },
        clk(x: number, y: number) {
          if (this.b) return;
          this.cd.forEach((q) => {
            if (!q.f && !q.m && x > q.x && x < q.x + 70 && y > q.y && y < q.y + 40) {
              q.f = 1;
              sound.pop();
              if (!this.a) this.a = q;
              else {
                this.b = q;
                this.lk = 24;
              }
            }
          });
        },
        drw() {
          R(0, 16, W, H - 16, '#1c1250');
          this.cd.forEach((q) => {
            if (!q.f && !q.m) {
              R(q.x, q.y, 70, 40, '#ffd23f');
              R(q.x + 2, q.y + 2, 66, 36, '#5a2a8a');
              T('?', q.x + 35, q.y + 24, 12, '#ffd23f', 'center');
            } else {
              R(q.x, q.y, 70, 40, q.m ? '#5be37d' : '#ff4d6d');
              R(q.x + 2, q.y + 2, 66, 36, '#fdf3d0');
              if (q.t === 0) {
                T(WD[q.w][0].toUpperCase(), q.x + 35, q.y + 24, 6, '#1a1030', 'center');
              } else {
                T(WD[q.w][1].toUpperCase(), q.x + 35, q.y + 24, 7, '#d81b60', 'center');
              }
            }
          });
        },
      },

      // 4: Lluvia Mera
      {
        tip: 'MERA = AGUA · ATRAPA LAS GOTAS Y ESQUIVA LAS PIEDRAS',
        bx: 160,
        it: [] as any[],
        sp: 1.2,
        rt: 35,
        pr: 0.15,
        t: 0,
        init() {
          this.bx = 160;
          this.it = [];
          this.sp = [1.1, 1.5, 1.9][L];
          this.rt = [38, 28, 20][L];
          this.pr = [0.1, 0.2, 0.28][L];
          this.t = 0;
          return [10, 15, 20][L];
        },
        mv(x: number) {
          this.bx = Math.max(20, Math.min(300, x));
        },
        upd() {
          this.t++;
          if (this.t % this.rt === 0) {
            this.it.push({
              x: 14 + Math.random() * 292,
              y: 18,
              k: Math.random() < this.pr ? 1 : 0,
              v: this.sp * (0.9 + Math.random() * 0.3),
            });
          }
          this.it.forEach((o) => (o.y += o.v));
          this.it = this.it.filter((o) => {
            if (o.y > 164 && o.y < 178 && Math.abs(o.x - this.bx) < 20) {
              if (o.k) hit();
              else {
                sound.correct();
                ok();
                burst(o.x, o.y, 6);
              }
              return false;
            }
            return o.y < 205;
          });
        },
        drw() {
          R(0, 16, W, H - 16, '#3a6fd0');
          R(0, 186, W, 14, '#6b3f1f');
          this.it.forEach((o) => {
            if (o.k) {
              R(o.x - 5, o.y, 10, 8, '#78909c');
            } else {
              R(o.x - 3, o.y, 6, 9, '#4cc9f0');
            }
          });
          // Basket (Catumare / Guapa)
          R(this.bx - 16, 176, 32, 10, '#ffd23f');
          R(this.bx - 14, 178, 28, 6, '#ff9f1c');
        },
      },

      // 5: Letras Sikuani
      {
        tip: 'FORMA LA PALABRA TOCANDO LAS LETRAS EN ORDEN',
        q: [] as any[],
        n: 0,
        sk: 0,
        w: null as any,
        ch: [] as string[],
        z: 20,
        ty: 0,
        tl: [] as any[],
        nw() {
          const w = WD[this.q[this.n]];
          this.w = w;
          this.ch = [...w[1]];
          const m = this.ch.length;
          const z = Math.min(26, (W - 16) / m - 3);
          this.z = z;
          this.ty = 0;
          this.tl = this.ch.map((l) => ({ l, u: 0 })).sort(() => Math.random() - 0.5);
          this.tl.forEach((t, j) => {
            t.x = (W - m * (z + 3)) / 2 + j * (z + 3);
            t.y = 152;
          });
        },
        init() {
          this.q = [[4, 9, 10, 6, 7], [8, 0, 3, 1, 14], [2, 5, 12, 11, 13, 15]][L];
          this.n = 0;
          this.sk = 0;
          this.nw();
          return this.q.length;
        },
        pick(l: string) {
          if (this.sk > 0) return;
          const t = this.tl.find((t) => !t.u && t.l === this.ch[this.ty]);
          if (t && t.l === l) {
            t.u = 1;
            this.ty++;
            sound.pop();
            if (this.ty >= this.ch.length) {
              sound.correct();
              burst(160, 110, 14);
              ok();
              this.n++;
              if (this.n < this.q.length) this.nw();
            }
          } else {
            this.sk = 14;
            hit();
          }
        },
        clk(x: number, y: number) {
          this.tl.forEach((t) => {
            if (!t.u && x > t.x && x < t.x + this.z && y > t.y && y < t.y + this.z) {
              this.pick(t.l);
            }
          });
        },
        upd() {
          if (this.sk > 0) this.sk--;
        },
        drw() {
          R(0, 16, W, H - 16, '#1c1250');
          T('PALABRA EN ESPAÑOL:', 160, 48, 8, '#9ad2f8', 'center');
          T(this.w[0].toUpperCase(), 160, 75, 15, '#ffd23f', 'center');

          const m = this.ch.length;
          const z = this.z;
          for (let j = 0; j < m; j++) {
            const x = (W - m * (z + 3)) / 2 + j * (z + 3);
            R(x, 116, z, z, '#2d1b69');
            R(x, 116 + z - 2, z, 2, '#ffd23f');
            if (j < this.ty) T(this.ch[j].toUpperCase(), x + z / 2, 116 + z * 0.72, z * 0.5, '#5be37d', 'center');
          }

          this.tl.forEach((t) => {
            if (t.u) return;
            R(t.x, t.y, z, z, '#ffd23f');
            R(t.x + 2, t.y + 2, z - 4, z - 4, '#f5e6b8');
            T(t.l.toUpperCase(), t.x + z / 2, t.y + z * 0.72, z * 0.5, '#3a2412', 'center');
          });
        },
      },

      // 6: Capibara Jomokobi
      {
        tip: 'JOMOKOBI (CAPIBARA): COME FRUTOS DEL CONUCO',
        cx: 160,
        cy: 100,
        fr: [] as any[],
        init() {
          this.cx = 160;
          this.cy = 100;
          this.fr = [];
          for (let i = 0; i < 20; i++) {
            this.fr.push({
              x: 20 + Math.random() * 280,
              y: 30 + Math.random() * 150,
              c: ['#ff4d6d', '#ffd23f', '#5be37d'][i % 3],
            });
          }
          return 20;
        },
        mv(x: number, y: number) {
          this.cx += (x - this.cx) * 0.15;
          this.cy += (y - this.cy) * 0.15;
        },
        upd() {
          this.fr = this.fr.filter((item) => {
            if (Math.hypot(this.cx - item.x, this.cy - item.y) < 14) {
              sound.pop();
              burst(item.x, item.y, 4);
              ok();
              return false;
            }
            return true;
          });
        },
        drw() {
          R(0, 16, W, H - 16, '#0d2818');
          // Draw fruits
          this.fr.forEach((item) => {
            R(item.x - 3, item.y - 3, 6, 6, item.c);
          });
          // Draw Capibara
          R(this.cx - 10, this.cy - 7, 20, 14, '#795548');
          R(this.cx + 6, this.cy - 10, 8, 8, '#5d4037');
          R(this.cx + 10, this.cy - 8, 2, 2, '#000');
          T('JOMOKOBI', this.cx, this.cy - 12, 6, '#ffd23f', 'center');
        },
      },
    ];

    const hud = () => {
      R(0, 0, W, 16, '#000d');
      T('NV' + (L + 1) + '/3', 8, 12, 7, '#4cc9f0');
      T(GN[gi], 80, 12, 7, GC[gi]);
      T(prog + '/' + goal, 190, 12, 7, '#ffd23f');
      for (let i = 0; i < 3; i++) {
        star(c, 266 + i * 16, 2, 2, i < SV[gi] ? '#ffd23f' : '#555');
      }
    };

    const drawMenu = () => {
      R(0, 0, W, H, '#0a0620');
      T('ARCADE DEL CONUCO VIVO', 160, 26, 10, '#ffd23f', 'center');
      T('ELIGE UN JUEGO · CONSIGUE 3 ★ EN CADA UNO', 160, 38, 5, '#9ad2f8', 'center');

      for (let i = 0; i < 7; i++) {
        const cx = i < 4 ? 40 + i * 80 : 80 + (i - 4) * 80;
        const cy = i < 4 ? 74 : 136;
        const isSel = sel === i;

        R(cx - 36, cy - 28, 72, 56, isSel ? '#ffffff' : GC[i]);
        R(cx - 34, cy - 26, 68, 52, isSel ? '#2d1b69' : '#1c1250');
        T(GN[i], cx, cy - 2, 7, GC[i], 'center');

        for (let j = 0; j < 3; j++) {
          star(c, cx - 18 + j * 14, cy + 12, 1.6, j < SV[i] ? '#ffd23f' : '#555');
        }
      }

      // Diploma button
      const allDone = tot() === 21;
      R(80, 180, 160, 15, allDone ? '#ffd23f' : '#333');
      T(
        allDone ? '🎓 ¡RECLAMA TU DIPLOMA!' : `★ ${tot()}/21 · DIPLOMA 🔒`,
        160,
        191,
        6,
        allDone ? '#2d1b69' : '#aaa',
        'center'
      );
    };

    // Main animation loop
    const loop = () => {
      f++;
      if (!pz) {
        if (sc === 'menu') {
          drawMenu();
          if (going >= 0) {
            gw++;
            if (gw > 20) {
              startG(going);
              going = -1;
            }
          }
        } else if (sc === 'game') {
          if (ph === 'play') g.upd();
          else if (ph === 'lvl' && f - t0 > 90) {
            if (L < 2) {
              L++;
              begin();
            } else {
              ph = 'done';
              t0 = f;
              sound.victory();
              burst(160, 90, 80);
            }
          } else if (ph === 'over' && f - t0 > 90) {
            toMenu();
          } else if (ph === 'done' && f - t0 > 180) {
            toMenu();
          }

          g.drw();
          hud();
          T(g.tip, 160, 196, 6, '#e8dcc0', 'center');

          if (ban > 0 && ph === 'play') {
            ban--;
            R(70, 76, 180, 38, '#000d');
            T('NIVEL ' + (L + 1), 160, 100, 14, '#ffd23f', 'center');
          }
        }

        // Particle update & draw
        pt = pt.filter((p) => p.l > 0);
        pt.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.04;
          p.l--;
          R(p.x, p.y, p.z, p.z, p.c);
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    // Canvas click & touch interactions
    const handlePointerDown = (e: PointerEvent) => {
      const rect = cv.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * W;
      const y = ((e.clientY - rect.top) / rect.height) * H;
      mx = x;
      my = y;

      setJoystickAngle(Math.max(-25, Math.min(25, (x - 160) / 6)));

      if (sc === 'menu') {
        for (let i = 0; i < 7; i++) {
          const cx = i < 4 ? 40 + i * 80 : 80 + (i - 4) * 80;
          const cy = i < 4 ? 74 : 136;
          if (Math.abs(x - cx) < 36 && Math.abs(y - cy) < 28) {
            sound.btnClick();
            going = i;
            gw = 0;
            return;
          }
        }
        if (Math.abs(x - 160) < 80 && y > 175) {
          sound.btnClick();
          setShowDiplomaModal(true);
        }
      } else if (sc === 'game' && ph === 'play') {
        if (g.clk) g.clk(x, y);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = cv.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * W;
      const y = ((e.clientY - rect.top) / rect.height) * H;
      if (sc === 'game' && ph === 'play' && g.mv) {
        g.mv(x, y);
      }
      setJoystickAngle(Math.max(-25, Math.min(25, (x - 160) / 6)));
    };

    cv.addEventListener('pointerdown', handlePointerDown);
    cv.addEventListener('pointermove', handlePointerMove);

    return () => {
      cancelAnimationFrame(animId);
      cv.removeEventListener('pointerdown', handlePointerDown);
      cv.removeEventListener('pointermove', handlePointerMove);
    };
  }, [savedStars]);

  // Generate diploma on canvas
  useEffect(() => {
    if (showDiplomaModal && diplomaCanvasRef.current) {
      const cv = diplomaCanvasRef.current;
      const c = cv.getContext('2d');
      if (!c) return;

      const W = 800;
      const H = 566;
      c.textAlign = 'center';
      c.fillStyle = '#fff8e7';
      c.fillRect(0, 0, W, H);

      // Border tiles
      const cl = ['#5be37d', '#ffd23f', '#ff4d6d', '#4cc9f0'];
      for (let i = 0; i < W / 16; i++) {
        c.fillStyle = cl[i % 4];
        c.fillRect(i * 16, 0, 16, 16);
        c.fillRect(i * 16, H - 16, 16, 16);
      }
      for (let i = 1; i < H / 16 - 1; i++) {
        c.fillStyle = cl[i % 4];
        c.fillRect(0, i * 16, 16, 16);
        c.fillRect(W - 16, i * 16, 16, 16);
      }

      c.strokeStyle = '#2d1b69';
      c.lineWidth = 6;
      c.strokeRect(28, 28, W - 56, H - 56);

      c.font = '36px "Press Start 2P", monospace';
      c.fillStyle = '#ff4d6d';
      c.fillText('DIPLOMA', W / 2 + 3, 114);
      c.fillStyle = '#2d1b69';
      c.fillText('DIPLOMA', W / 2, 110);

      c.font = '14px "Press Start 2P", monospace';
      c.fillText('ARCADE DEL CONUCO VIVO SIKUANI', W / 2, 146);

      c.font = '10px "Press Start 2P", monospace';
      c.fillStyle = '#555';
      c.fillText('Se otorga con honor y orgullo a:', W / 2, 186);

      c.font = '24px "Press Start 2P", monospace';
      c.fillStyle = '#c2185b';
      c.fillText(playerName.toUpperCase() || 'SABEDOR SIKUANI', W / 2, 236);

      c.fillStyle = '#2d1b69';
      c.fillRect(100, 252, 600, 4);

      c.font = '11px "Press Start 2P", monospace';
      c.fillStyle = '#333';
      c.fillText('por dominar los 7 juegos del Arcade Conuco Vivo,', W / 2, 290);
      c.fillText('preservar las palabras botánicas y zoológicas en sikuani,', W / 2, 314);
      c.fillStyle = '#c2185b';
      c.fillText('¡y consagrarse como GUARDIÁN ANCESTRAL DEL VICHADA!', W / 2, 345);

      c.font = '9px "Press Start 2P", monospace';
      c.fillStyle = '#555';
      c.fillText(
        new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }),
        W / 2,
        480
      );
      c.fillText('Resguardo Indígena Cumaribo & Puerto Carreño', W / 2, 500);
    }
  }, [showDiplomaModal, playerName]);

  const downloadDiploma = () => {
    sound.btnClick();
    if (diplomaCanvasRef.current) {
      const a = document.createElement('a');
      a.href = diplomaCanvasRef.current.toDataURL('image/png');
      a.download = `Diploma_Sikuani_${playerName}.png`;
      a.click();
    }
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto">
      {/* Cabinet Marquee */}
      <div className="w-full bg-gradient-to-r from-[#ff4d8d] via-[#f03a7c] to-[#ff4d8d] border-4 border-[#ffd23f] border-b-0 p-2 text-center shadow-[inset_0_4px_0_#fff4] pixel-corners">
        <span className="text-white font-bold text-xs tracking-wider shadow-sm">
          ARCADE · CONUCO VIVO
        </span>
      </div>

      {/* Screen Frame with CRT Overlay */}
      <div className="w-full bg-[#000000] p-2 border-4 border-[#ff4d8d] border-t-0 crt-overlay relative shadow-[0_0_30px_#4cc9f066]">
        <canvas
          ref={canvasRef}
          width={640}
          height={400}
          className="w-full aspect-[8/5] pixel-art block bg-[#0a0620]"
        />
      </div>

      {/* Arcade Control Panel Bar */}
      <div className="w-full bg-gradient-to-r from-[#4a2280] to-[#52288c] border-4 border-[#ff4d8d] border-t-2 border-t-[#4cc9f0] p-2 flex items-center justify-around shadow-[inset_0_4px_0_#0005]">
        {/* Animated Joystick representation */}
        <div className="flex flex-col items-center gap-1">
          <div
            className="w-7 h-7 rounded-full bg-[#ff4d6d] border-2 border-white transition-transform duration-100"
            style={{ transform: `rotate(${joystickAngle}deg) translateX(${joystickAngle / 4}px)` }}
          />
          <span className="text-[7px] text-[#fff8e7]">JOYSTICK</span>
        </div>

        {/* Buttons */}
        <button
          onClick={() => {
            setIsPaused(!isPaused);
            sound.btnClick();
          }}
          className="flex flex-col items-center gap-1 arcade-btn"
        >
          <span className="w-7 h-7 rounded-full bg-[#ff4d6d] border-2 border-[#fff7] flex items-center justify-center text-white text-[9px]">
            {isPaused ? <Play size={12} /> : <Pause size={12} />}
          </span>
          <span className="text-[6px] text-white">PAUSA</span>
        </button>

        <button
          onClick={() => {
            const next = sound.toggleMute();
            setIsMuted(next);
            sound.btnClick();
          }}
          className="flex flex-col items-center gap-1 arcade-btn"
        >
          <span className="w-7 h-7 rounded-full bg-[#4cc9f0] border-2 border-[#fff7] flex items-center justify-center text-black text-[9px]">
            {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </span>
          <span className="text-[6px] text-white">SONIDO</span>
        </button>

        <button
          onClick={() => {
            sound.coin();
            sound.btnClick();
          }}
          className="flex flex-col items-center gap-1 arcade-btn"
        >
          <span className="w-7 h-7 rounded-full bg-[#ffd23f] border-2 border-[#fff7] flex items-center justify-center text-black font-bold text-[9px]">
            🪙
          </span>
          <span className="text-[6px] text-white">MONEDA</span>
        </button>
      </div>

      {/* Diploma Modal */}
      {showDiplomaModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 animate-fade-in text-xs">
          <div className="bg-[#120a26] border-4 border-[#ffd23f] p-3 max-w-sm w-full flex flex-col gap-2">
            <div className="flex justify-between items-center border-b border-[#ffd23f]/50 pb-1">
              <span className="text-[#ffd23f] font-bold text-[10px]">DIPLOMA ANCESTRAL SIKUANI</span>
              <button
                onClick={() => setShowDiplomaModal(false)}
                className="px-2 py-0.5 bg-[#ff4d6d] text-white text-[8px] pixel-corners"
              >
                ✕
              </button>
            </div>

            <canvas ref={diplomaCanvasRef} width={800} height={566} className="w-full h-auto border-2 border-[#ffd23f]" />

            <div className="flex gap-2">
              <button
                onClick={downloadDiploma}
                className="flex-1 py-1.5 bg-[#ffd23f] text-black font-bold text-[8px] pixel-corners arcade-btn flex items-center justify-center gap-1"
              >
                <Download size={12} /> DESCARGAR PNG
              </button>
              <button
                onClick={() => setShowDiplomaModal(false)}
                className="px-3 py-1.5 bg-[#2d1b69] text-white text-[8px] pixel-corners arcade-btn"
              >
                VOLVER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
