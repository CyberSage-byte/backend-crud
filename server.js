require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { Server } = require("socket.io");
const http = require("http");

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// WebSocket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

// Get all posts
app.get("/posts", async (req, res) => {
  const posts = await prisma.post.findMany();
  res.json(posts);
});

// Create post
app.post("/posts", async (req, res) => {
  const { title, content } = req.body;
  const newPost = await prisma.post.create({ data: { title, content } });
  io.emit("postUpdated"); // Kirim event real-time
  res.json(newPost);
});

// Delete post
app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.post.delete({ where: { id } });
  io.emit("postUpdated"); // Kirim event real-time
  res.json({ message: "Post deleted" });
});

// Edit post
app.put("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  console.log("Update request received:", { id, title, content }); // Debugging

  try {
    const updatedPost = await prisma.post.update({
      where: { id: String(id) }, // Pastikan ID dalam format string
      data: { title, content },
    });

    io.emit("postUpdated"); // Biar real-time
    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Failed to update post" });
  }
});



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
