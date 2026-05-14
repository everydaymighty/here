const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ── In-memory guestbook (persists while server is running) ──
const guestbook = [];

app.get('/guestbook', (req, res) => res.json(guestbook.slice(-50)));
app.post('/guestbook', (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) return res.status(400).json({ error: 'Missing fields' });
  const entry = { name: name.slice(0,24), message: message.slice(0,120), time: Date.now() };
  guestbook.push(entry);
  io.emit('guestbook:new', entry); // broadcast to all
  res.json(entry);
});

// ── Multiplayer ──
const players = {};

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  socket.on('player:join', (data) => {
    players[socket.id] = {
      id: socket.id,
      name: data.name || 'Visitor',
      color: data.color || '#b5913a',
      x: 0, y: 1.65, z: 8,
      ry: 0,
    };
    // Send existing players to the new joiner
    socket.emit('players:init', Object.values(players).filter(p => p.id !== socket.id));
    // Tell everyone else about the new player
    socket.broadcast.emit('player:joined', players[socket.id]);
  });

  socket.on('player:move', (data) => {
    if (players[socket.id]) {
      players[socket.id].x  = data.x;
      players[socket.id].y  = data.y;
      players[socket.id].z  = data.z;
      players[socket.id].ry = data.ry;
      socket.broadcast.emit('player:moved', { id: socket.id, ...data });
    }
  });

  socket.on('chat:message', (data) => {
    if (!data.text || typeof data.text !== 'string') return;
    socket.broadcast.emit('chat:message', { id: socket.id, text: data.text.slice(0, 80) });
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('player:left', socket.id);
    console.log('Player left:', socket.id);
  });
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`The Museum running on port ${PORT}`));
