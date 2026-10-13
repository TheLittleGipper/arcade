/* =====================================================================================================================
   THE ARCADE: pixel-art helpers shared by every page (window.Px).
   Art is drawn at its own small size, one canvas pixel per art pixel, then shown at a whole number of DEVICE pixels per
   art pixel (Px.show), so every pixel stays a crisp square on any screen. The same craft as DialBound: hand-built
   lettering, sprites outlined in a dark ink tinted by the colour they border, ordered dithering instead of blur.
     Px.hash(a,b)                 a steady noise value 0..1 for a pixel
     Px.dith(x,y)                 the 4x4 ordered-dither threshold for a pixel (about -0.47 .. 0.47)
     Px.canvas(w,h)               [canvas, context], smoothing off
     Px.show(dst, art, k)         draw art onto dst at k device pixels per art pixel (sizes dst to match)
     Px.sprite(rows, pal, ink)    a sprite from rows of palette letters ('.' is clear), outlined
     Px.outline(cv, ink, sh)      outline whatever is drawn on cv (and a hard shadow down-right if sh)
     Px.text(str, opt)            hand-built lettering as a canvas: opt.face 'std' (5x7), 'slab' (5x7 with Western slab
                                  serifs) or 'tiny' (3x5); opt.scale, opt.bold, opt.ramp (colours top to bottom),
                                  opt.ink (outline), opt.shadow
     Px.measure(str, opt)         its width in art pixels
     Px.hex / Px.mix / Px.rgba    colour helpers
   ===================================================================================================================== */
(function(){'use strict';
const hash=(a,b)=>{let h=(a*374761393+b*668265263)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967295};
const BY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v=>v/16-.47),dith=(x,y)=>BY[(y&3)*4+(x&3)];
const HC={},hex=h=>HC[h]||(HC[h]=[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]);
const toHex=c=>'#'+c.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
const mix=(a,b,t)=>{const A=hex(a),B=hex(b);return toHex(A.map((v,i)=>v+(B[i]-v)*t))};
const rgba=(h,a)=>{const c=hex(h);return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')'};
const lum=c=>.3*c[0]+.59*c[1]+.11*c[2];
function canvas(w,h){const c=document.createElement('canvas');c.width=Math.max(1,w|0);c.height=Math.max(1,h|0);const g=c.getContext('2d');g.imageSmoothingEnabled=false;return[c,g]}
function show(dst,art,k){const d=window.devicePixelRatio||1,W=art.width*k,H=art.height*k;if(dst.width!==W||dst.height!==H){dst.width=W;dst.height=H}
 dst.style.width=W/d+'px';dst.style.height=H/d+'px';const g=dst.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,W,H);g.drawImage(art,0,0,W,H)}
// an outline one art pixel wide around everything drawn, each outline pixel a dark ink tinted by the darkest colour it borders
function outline(cv,ink,sh){const w=cv.width,h=cv.height,g=cv.getContext('2d'),D=g.getImageData(0,0,w,h).data,I=hex(ink||'#0a0812'),A=i=>D[i*4+3]>40;
 const O=g.createImageData(w,h),E=O.data;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x;if(A(i))continue;let b=null,bl=1e9;
  for(const[dx,dy]of[[-1,0],[1,0],[0,-1],[0,1]]){const X=x+dx,Y=y+dy;if(X<0||Y<0||X>=w||Y>=h)continue;const j=Y*w+X;if(!A(j))continue;const c=[D[j*4],D[j*4+1],D[j*4+2]],L=lum(c);if(L<bl){bl=L;b=c}}
  if(b){const p=i*4;E[p]=b[0]*.38+I[0]*.62;E[p+1]=b[1]*.38+I[1]*.62;E[p+2]=b[2]*.38+I[2]*.62;E[p+3]=255}}
 if(sh){const S=hex(sh);for(let y=h-1;y>0;y--)for(let x=w-1;x>0;x--){const i=y*w+x,j=(y-1)*w+(x-1);if(!A(i)&&!E[i*4+3]&&(A(j)||E[j*4+3]===255)){const p=i*4;E[p]=S[0];E[p+1]=S[1];E[p+2]=S[2];E[p+3]=150}}}
 const[t,tg]=canvas(w,h);tg.putImageData(O,0,0);g.drawImage(t,0,0);return cv}
// a sprite from rows of palette letters, with a margin for its outline
function sprite(rows,pal,ink,sh){const n=rows.length,m=rows[0].length,[c,g]=canvas(m+2+(sh?1:0),n+2+(sh?1:0));
 for(let j=0;j<n;j++)for(let i=0;i<m;i++){const ch=rows[j][i];if(ch!=='.'&&pal[ch]){g.fillStyle=pal[ch];g.fillRect(i+1,j+1,1,1)}}return outline(c,ink,sh)}

/* ---------- the lettering: every glyph drawn by hand on a 5x7 grid (capitals; lower case is set in capitals) ---------- */
const G5={A:'.###.|#...#|#...#|#####|#...#|#...#|#...#',B:'####.|#...#|#...#|####.|#...#|#...#|####.',C:'.###.|#...#|#....|#....|#....|#...#|.###.',
 D:'####.|#...#|#...#|#...#|#...#|#...#|####.',E:'#####|#....|#....|####.|#....|#....|#####',F:'#####|#....|#....|####.|#....|#....|#....',
 G:'.###.|#...#|#....|#.###|#...#|#...#|.####',H:'#...#|#...#|#...#|#####|#...#|#...#|#...#',I:'.###.|..#..|..#..|..#..|..#..|..#..|.###.',
 J:'..###|...#.|...#.|...#.|...#.|#..#.|.##..',K:'#...#|#..#.|#.#..|##...|#.#..|#..#.|#...#',L:'#....|#....|#....|#....|#....|#....|#####',
 M:'#...#|##.##|#.#.#|#.#.#|#...#|#...#|#...#',N:'#...#|#...#|##..#|#.#.#|#..##|#...#|#...#',O:'.###.|#...#|#...#|#...#|#...#|#...#|.###.',
 P:'####.|#...#|#...#|####.|#....|#....|#....',Q:'.###.|#...#|#...#|#...#|#.#.#|#..#.|.##.#',R:'####.|#...#|#...#|####.|#.#..|#..#.|#...#',
 S:'.####|#....|#....|.###.|....#|....#|####.',T:'#####|..#..|..#..|..#..|..#..|..#..|..#..',U:'#...#|#...#|#...#|#...#|#...#|#...#|.###.',
 V:'#...#|#...#|#...#|#...#|#...#|.#.#.|..#..',W:'#...#|#...#|#...#|#.#.#|#.#.#|#.#.#|.#.#.',X:'#...#|#...#|.#.#.|..#..|.#.#.|#...#|#...#',
 Y:'#...#|#...#|.#.#.|..#..|..#..|..#..|..#..',Z:'#####|....#|...#.|..#..|.#...|#....|#####',
 '0':'.###.|#...#|#..##|#.#.#|##..#|#...#|.###.','1':'..#..|.##..|..#..|..#..|..#..|..#..|.###.','2':'.###.|#...#|....#|...#.|..#..|.#...|#####',
 '3':'####.|....#|....#|.###.|....#|....#|####.','4':'...#.|..##.|.#.#.|#..#.|#####|...#.|...#.','5':'#####|#....|####.|....#|....#|#...#|.###.',
 '6':'.###.|#....|#....|####.|#...#|#...#|.###.','7':'#####|....#|...#.|..#..|.#...|.#...|.#...','8':'.###.|#...#|#...#|.###.|#...#|#...#|.###.',
 '9':'.###.|#...#|#...#|.####|....#|....#|.###.',' ':'...|...|...|...|...|...|...','.':'.|.|.|.|.|.|#',',':'..|..|..|..|..|.#|#.',
 '!':'#|#|#|#|#|.|#','?':'.###.|#...#|....#|...#.|..#..|.....|..#..',"'":'#|#|.|.|.|.|.','-':'...|...|...|###|...|...|...',':':'.|.|#|.|.|#|.',
 '/':'....#|...#.|...#.|..#..|.#...|.#...|#....','·':'.|.|.|#|.|.|.','&':'.##..|#..#.|#.#..|.#...|#.#.#|#..#.|.##.#'};
// 3x5, the size of DialBound's combat numbers, for the smallest labels
const G3={A:'.#.|#.#|###|#.#|#.#',B:'##.|#.#|##.|#.#|##.',C:'.##|#..|#..|#..|.##',D:'##.|#.#|#.#|#.#|##.',E:'###|#..|##.|#..|###',F:'###|#..|##.|#..|#..',
 G:'.##|#..|#.#|#.#|.##',H:'#.#|#.#|###|#.#|#.#',I:'###|.#.|.#.|.#.|###',J:'..#|..#|..#|#.#|.#.',K:'#.#|#.#|##.|#.#|#.#',L:'#..|#..|#..|#..|###',
 M:'#...#|##.##|#.#.#|#...#|#...#',N:'#..#|##.#|#.##|#..#|#..#',O:'.#.|#.#|#.#|#.#|.#.',P:'##.|#.#|##.|#..|#..',Q:'.#.|#.#|#.#|##.|.##',
 R:'##.|#.#|##.|#.#|#.#',S:'.##|#..|.#.|..#|##.',T:'###|.#.|.#.|.#.|.#.',U:'#.#|#.#|#.#|#.#|###',V:'#.#|#.#|#.#|#.#|.#.',W:'#...#|#...#|#.#.#|##.##|#...#',
 X:'#.#|#.#|.#.|#.#|#.#',Y:'#.#|#.#|.#.|.#.|.#.',Z:'###|..#|.#.|#..|###','0':'###|#.#|#.#|#.#|###','1':'.#.|##.|.#.|.#.|###','2':'###|..#|###|#..|###',
 '3':'###|..#|.##|..#|###','4':'#.#|#.#|###|..#|..#','5':'###|#..|###|..#|###','6':'###|#..|###|#.#|###','7':'###|..#|.#.|.#.|.#.','8':'###|#.#|###|#.#|###',
 '9':'###|#.#|###|..#|###',' ':'..|..|..|..|..','.':'.|.|.|.|#','!':'#|#|#|.|#','-':'...|...|###|...|...',"'":'#|#|.|.|.',':':'.|#|.|#|.','/':'..#|..#|.#.|#..|#..','·':'.|.|#|.|.'};
const SG={};
// the Western slab: the same glyphs, with a serif struck at each end of every upright stroke
function slab(ch){if(SG[ch])return SG[ch];const R=(G5[ch]||G5[' ']).split('|'),w=R[0].length,h=R.length,at=(i,j)=>j>=0&&j<h&&i>=0&&i<w&&R[j][i]==='#';
 const O=Array.from({length:h},(_,j)=>Array.from({length:w+2},(_,i)=>at(i-1,j)?'#':'.'));
 if(w>1)for(let i=0;i<w;i++)for(const[j,k]of[[0,1],[h-1,h-2]])if(at(i,j)&&at(i,k)){O[j][i]='#';O[j][i+2]='#'}
 return SG[ch]=O.map(r=>r.join('')).join('|')}
function glyphs(str,face){const T=face==='tiny'?G3:G5;return[...String(str).toUpperCase()].map(ch=>(face==='slab'?slab(T[ch]?ch:' '):(T[ch]||T[' '])).split('|'))}
function measure(str,o){o=o||{};const s=o.scale||1,b=o.bold?1:0;return glyphs(str,o.face).reduce((a,g)=>a+(g[0].length+b+1)*s,0)-s}
// lettering as a canvas: the mask, coloured row by row from the ramp, then outlined and shadowed
function text(str,o){o=o||{};const s=o.scale||1,b=o.bold?1:0,G=glyphs(str,o.face),h=G[0].length*s,w=measure(str,o),pad=(o.ink?1:0)+(o.shadow?1:0),[c,g]=canvas(w+pad*2,h+pad*2);
 const ramp=o.ramp||['#ffffff'],col=y=>ramp[Math.min(ramp.length-1,Math.floor(y/h*ramp.length))];let x=pad;
 G.forEach(R=>{R.forEach((row,j)=>[...row].forEach((ch,i)=>{if(ch!=='#')return;for(let q=0;q<s;q++){g.fillStyle=col(j*s+q);g.fillRect(x+i*s,pad+j*s+q,s*(1+b),1)}}));x+=(R[0].length+b+1)*s});
 if(o.ink)outline(c,o.ink,o.shadow);return c}
window.Px={hash,dith,BY,hex,mix,rgba,canvas,show,outline,sprite,text,measure};
})();
