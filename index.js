import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from './models/Task.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error", err));

// Routes
app.get('/', async (req, res) => {
  const tasks = await Task.find();
  res.render('index', { tasks });
});

app.post('/add', async (req, res) => {
  const { title, priority } = req.body;
  if (!title.trim()) return res.redirect('/'); // Prevent empty titles

  await Task.create({ title, priority });
  res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  res.render('edit', { task });
});

app.post('/edit/:id', async (req, res) => {
  const { title, priority } = req.body;
  await Task.findByIdAndUpdate(req.params.id, { title, priority });
  res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
