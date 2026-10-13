# The Arcade

A small pixel-art arcade hall that is the front door to your games. Each game sits in its own cabinet and keeps its own save.

- **DialBound** (The War of the Silent Realm) is playable.
- **Legend of the LeadSlinger** is coming soon.

Everything is plain HTML, CSS and JavaScript. There are no build tools, frameworks or installs.

```
arcade/
  index.html                  The Arcade hub: the hall, a cabinet per game, your name and the shared settings
  README.md                   this file
  shared/
    arcade.css                the shared look: fonts, colours (dark and light), stone buttons, panels, dialogs
    fonts/                    Waystone and Waystone Small, DialBound's hand-built pixel fonts
    games.js                  the arcade's name and the list of games (rename the arcade or add a game here)
    pixel.js                  shared pixel-art helpers: hand-built lettering, outlined sprites, crisp scaling
    profile.js                the shared player profile and settings (window.Arcade)
  games/
    dialbound/index.html      DialBound, one self-contained file
    leadslinger/index.html    Legend of the LeadSlinger: a "Coming soon" page for now
```

## Run it on your computer

Open it through a tiny local web server rather than double-clicking the file. Browsers handle saved data inconsistently for files opened straight from disk, and the games load the shared files by relative path.

From inside the `arcade` folder:

```bash
python3 -m http.server 8000
```

Then open **http://localhost:8000/**. Stop the server with Ctrl+C.

If you have Node.js, `npx serve .` works too. It prints its own address, usually http://localhost:3000.

## Your saves belong to the address

Browsers keep each site's saved data (localStorage) separately for every **address**, meaning the scheme, host and port together. These are all different places to a browser, each with its own saves:

- `http://localhost:8000`
- `http://127.0.0.1:8000`
- `http://localhost:3000`
- a file opened from your Downloads folder (`file://…`)
- `https://you.github.io/arcade/`

To keep your progress:

- Use the **same browser** and the **same address** every time. A bookmark helps.
- Clearing your browser's site data, or playing in a private window, loses what's stored there.
- Back up now and then with DialBound's **Save Key**. It's a line of text you can keep anywhere and paste back.

### Moving your DialBound save into the Arcade (or to a new address)

1. Open DialBound where your progress is now, for example your old `dialbound-merged_43.html` file.
2. On its title screen, choose **Save Key**, then **Make key**, then **Copy**. Paste the key somewhere safe, like a note or an email to yourself.
3. Open the Arcade at its new address and play DialBound from its cabinet.
4. A brand-new address has no hero yet, so DialBound asks you to swear an Order first. Pick any; it is replaced in a moment.
5. Go back to the title screen (Esc menu, then **Exit to title**). Choose **Save Key**, paste your key into the box, and tap **Import key** twice (the second tap confirms).
6. "Progress restored!" Your level, gold, gear, streak and map are all back.

## The shared profile and settings

The Arcade remembers a few things for you under its own storage key, `arcade_profile_v1`:

- your **name**
- the **game you played last**, and when
- **Settings**:
  - Music
  - Sound effects
  - Master volume
  - Reduced motion (Match system / On / Off)
  - Theme (Match system / Dark / Light)

It never reads or writes a game's progress. Each game keeps its own save under its own key: DialBound uses `longroad_v1`, and LeadSlinger has `leadslinger_v1` set aside.

**DialBound and the shared settings.** Played from the Arcade, DialBound takes Music, Sound effects and Reduced motion from the shared Settings, and the master volume scales its own music and effect volumes.
- Flip one of those switches inside DialBound and the hall's Settings change to match.
- DialBound keeps its own theme and text size.
- The first time you visit the hall, its settings are copied from your DialBound save, so nothing you chose there changes.
- Opened outside the arcade folder, DialBound simply uses its own settings, exactly as before.

## Host it free on GitHub Pages, so coworkers can open a link

1. Make a free account at github.com and create a new repository, for example `arcade`.
2. Upload the **contents** of this `arcade` folder, so `index.html` sits at the top of the repository. Either use "Add file → Upload files" on the website, or push with git.
3. In the repository, go to **Settings → Pages**. Under "Build and deployment", choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. After a minute your arcade is live at **https://YOUR-NAME.github.io/arcade/**. Share that link.

How it works once it's live:

- Every coworker's progress is kept in their own browser. Nobody can see or change anyone else's save.
- To update the arcade, upload the changed files again. Saves are untouched by updates.
- Remember that saves belong to the address: progress made at `localhost` doesn't appear on the GitHub Pages link. Move it with the Save Key, as above.

## Rename the arcade

Change `name` in `shared/games.js`. The hall's marquee, the page title and the hub's messages all read it.

## Add a new game

1. Make a folder `games/your-game/` with an `index.html` that runs on its own.
2. Give it its **own** save key, for example `localStorage` key `'yourgame_v1'`. Never reuse another game's.
3. Add one entry to `shared/games.js`:
   ```js
   {id:'yourgame', title:'Your Game', sub:'A tagline', path:'games/your-game/', save:'yourgame_v1', status:'ready',
    blurb:'One or two sentences shown when the cabinet is chosen.'}
   ```
   Use `status:'soon'` to show a "Coming soon" cabinet until it's ready.
4. Give it a way home: a link or button to `../../index.html`.
5. **Optional: share the look and settings.**
   - Load `../../shared/arcade.css`, `../../shared/profile.js` and `../../shared/pixel.js`.
   - Read `Arcade.settings.get('music')`, `get('sfx')` and `get('volume')`, and `Arcade.settings.motionReduced()`.
   - Call `Arcade.played('yourgame')` when it opens.
6. **Optional: cabinet art.** In `index.html`, add a palette to `PAL` and an attract-screen function to `SCREENS`, both keyed by the game's `id`. Without them the game still gets a plain cabinet with its title.

### The Arcade API (shared/profile.js)

| Call | What it does |
|---|---|
| `Arcade.profile.exists()` | Whether a profile has been stored yet |
| `Arcade.profile.get()` | The whole profile, checked and with defaults filled in |
| `Arcade.profile.set({...})` | Change it; settings merge key by key |
| `Arcade.settings.get(key)` / `.set(key, value)` | One setting: `music`, `sfx`, `volume`, `motion`, `theme` |
| `Arcade.settings.motionReduced()` / `.theme()` | The setting as it applies right now ("Match system" resolved) |
| `Arcade.played(id)` | Remember the game last played |
| `Arcade.onChange(fn)` | Run `fn(profile)` after any change, including from another tab |

## Controls in the hall

- **Mouse:** hover a cabinet to light it, click to play.
- **Phone:** tap a cabinet to choose it, tap again (or tap Play) to play.
- **Keyboard:** Left and Right choose a cabinet, Enter plays, Esc closes a window.
- **Controller:** the d-pad or left stick chooses, A or Start plays, B closes a window.

Sound starts after your first tap or key press, as browsers require. The hum follows Music, and the blips follow Sound effects.
