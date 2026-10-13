/* =====================================================================================================================
   THE ARCADE: its name and its games, in one place.
   - Rename the arcade: change `name`. The hall's marquee, the page title and the hub's messages all read it.
   - Add a game: give it a folder under games/ and one entry below (see README.md). The hub builds a cabinet for every
     entry, in this order. A game with status 'soon' gets a "Coming soon" cabinet that cannot be played yet.
     id        a short name that never changes (the hub remembers the last game played by it)
     title     the name on the cabinet          sub    a line under it
     path      the game's folder, from here     save   the game's OWN localStorage key (games never share a save)
     status    'ready' or 'soon'                blurb  the description shown when the cabinet is chosen
   ===================================================================================================================== */
window.Arcade=window.Arcade||{};
Arcade.config={
 name:'The Arcade',
 games:[
  {id:'dialbound',title:'DialBound',sub:'The War of the Silent Realm',path:'games/dialbound/',save:'longroad_v1',status:'ready',
   blurb:'A dark-fantasy journey powered by your calling day. Every dial is a step down the Road: log your deeds, grow your hero, and face a new foe every week.'},
  {id:'leadslinger',title:'Legend of the LeadSlinger',sub:'Coming soon',path:'games/leadslinger/',save:'leadslinger_v1',status:'soon',
   blurb:'A sunlit Western of fast draws and fresh leads. The saloon doors are still being hung.'}
 ]};
