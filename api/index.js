// api/index.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async (req, res) => {
  try {
    // Contoh mengambil data dari tabel User
    const users = await prisma.user.findMany();
    
    // Mengambil data dari tabel Post
    const posts = await prisma.post.findMany();

    res.status(200).json({ users, posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
