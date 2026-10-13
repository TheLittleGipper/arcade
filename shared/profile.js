/* =====================================================================================================================
   THE ARCADE: the shared player profile and settings (window.Arcade)

   One localStorage key, 'arcade_profile_v1', and never any other: every game keeps its own save under its own key
   (DialBound: 'longroad_v1'), and nothing here reads or writes those.

     {v:1, name:'Player One',
      settings:{music:true, sfx:true, volume:1, motion:'sys'|'on'|'off', theme:'sys'|'dark'|'light'},
      last:{game:'dialbound', at:1760000000000} | null}

   The API
     Arcade.profile.exists()          true once a profile has been stored (a game opened on its own, before the hub was
                                      ever visited, finds none and keeps its own settings)
     Arcade.profile.get()             the profile, every field filled and checked (a copy: change it through set)
     Arcade.profile.set(patch)        merge a change in (settings merge key by key), store it, tell the listeners
     Arcade.profile.seed(patch)       store a first profile only if there is none yet (the hub seeds it from a game's save)
     Arcade.settings.get(key)         one shared setting
     Arcade.settings.set(key, value)  change one shared setting
     Arcade.settings.motionReduced()  reduced motion right now ('sys' follows the system)
     Arcade.settings.theme()          'dark' or 'light' right now ('sys' follows the system)
     Arcade.played(gameId)            remember the game last played, and when
     Arcade.onChange(fn)              fn(profile) after every change, here or in another tab; returns a function to stop

   If the browser blocks storage (some private windows), the profile lives in memory for this page only.
   ===================================================================================================================== */
(function(){'use strict';
const KEY='arcade_profile_v1',MOTION=['sys','on','off'],THEME=['sys','dark','light'];
const DEF={v:1,name:'Player One',settings:{music:true,sfx:true,volume:1,motion:'sys',theme:'sys'},last:null};
let mem=null;
function read(){try{const t=localStorage.getItem(KEY);return t?JSON.parse(t):null}catch(e){return mem}}
function write(o){mem=o;try{localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}}
// every field checked: a profile written by hand, or by an older or newer page, can never break a game
function clean(o){o=o&&typeof o==='object'?o:{};const s=o.settings&&typeof o.settings==='object'?o.settings:{},d=DEF.settings;
 const nm=typeof o.name==='string'?o.name.replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,20):'';
 const vol=typeof s.volume==='number'&&isFinite(s.volume)?Math.round(Math.max(0,Math.min(1,s.volume))*20)/20:d.volume;
 const L=o.last&&typeof o.last==='object'&&typeof o.last.game==='string'&&isFinite(o.last.at)?{game:o.last.game.slice(0,40),at:+o.last.at}:null;
 return{v:1,name:nm||DEF.name,settings:{music:typeof s.music==='boolean'?s.music:d.music,sfx:typeof s.sfx==='boolean'?s.sfx:d.sfx,volume:vol,
  motion:MOTION.includes(s.motion)?s.motion:d.motion,theme:THEME.includes(s.theme)?s.theme:d.theme},last:L}}
const fns=new Set(),emit=p=>fns.forEach(f=>{try{f(p)}catch(e){}});
function exists(){return read()!=null}
function get(){return clean(read())}
function set(patch){const cur=get(),p=patch&&typeof patch==='object'?patch:{};
 const o=clean({...cur,...p,settings:{...cur.settings,...(p.settings&&typeof p.settings==='object'?p.settings:{})}});write(o);emit(o);return o}
function seed(patch){if(exists())return get();return set(patch||{})}
const mq=q=>{try{return matchMedia(q).matches}catch(e){return false}};
const settings={get:k=>get().settings[k],set:(k,v)=>set({settings:{[k]:v}}),
 motionReduced(){const m=get().settings.motion;return m==='on'||(m==='sys'&&mq('(prefers-reduced-motion: reduce)'))},
 theme(){const t=get().settings.theme;return t==='sys'?(mq('(prefers-color-scheme: light)')?'light':'dark'):t}};
// another tab changed the profile (the hub open beside a game, say)
try{addEventListener('storage',e=>{if(e.key===KEY)emit(get())})}catch(e){}
const A=window.Arcade=window.Arcade||{};
Object.assign(A,{KEY,profile:{exists,get,set,seed},settings,played:id=>set({last:{game:String(id),at:Date.now()}}),
 onChange(fn){fns.add(fn);return()=>fns.delete(fn)}});
})();
