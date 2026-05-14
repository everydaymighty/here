# 🌌 VR World

A browser-based 3D walkable world built with Three.js. Deployable on Render.com in minutes.

## Controls
| Key | Action |
|-----|--------|
| WASD / Arrow Keys | Move |
| Mouse | Look around |
| Space | Jump |
| Shift | Sprint |
| ESC | Release mouse |

## Deploy to Render

### Step 1 — Prepare your files
Your project structure should look like:
```
vr-world/
├── server.js
├── package.json
└── public/
    └── index.html   ← move the index.html here!
```
⚠️ **Important**: Move `index.html` into a `public/` folder inside your project.

### Step 2 — Push to GitHub
1. Create a new GitHub repo (e.g. `my-vr-world`)
2. Push all files to it

### Step 3 — Deploy on Render
1. Go to [render.com](https://render.com) and sign up / log in
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Set these settings:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **Create Web Service**
6. Wait ~2 minutes → you'll get a live URL like `https://my-vr-world.onrender.com`

That's it! Share that URL with anyone and they can walk around your world in their browser.

## Customization Ideas
- Add more objects / rooms
- Change the colors (edit the hex values in index.html)
- Add sound with the Web Audio API
- Add multiplayer with Socket.io
- Add textures using THREE.TextureLoader
