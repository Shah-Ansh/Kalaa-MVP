const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Serve folders
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));
app.use('/suggestions', express.static(path.join(__dirname, 'suggestions')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure upload dir exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Upload route
app.post('/api/upload', upload.fields([
  { name: 'foreground', maxCount: 1 },
  { name: 'background', maxCount: 1 },
]), (req, res) => {
  if (!req.files?.foreground || !req.files?.background) {
    return res.status(400).json({ error: 'Both images required.' });
  }

  const fg = req.files.foreground[0].filename;
  const bg = req.files.background[0].filename;

  res.status(200).json({ foreground: fg, background: bg });
});

// Generate route
app.post('/api/generate', (req, res) => {
  const { foreground, background } = req.body;
  if (!foreground || !background) {
    return res.status(400).json({ error: 'Missing image filenames.' });
  }

  const fgPath = path.join(__dirname, 'uploads', foreground);
  const bgPath = path.join(__dirname, 'uploads', background);
  const scriptPath = path.join(__dirname, 'generate.py');

  const cmd = `python "${scriptPath}" "${fgPath}" "${bgPath}"`;
  console.log('Running command:', cmd);

  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error('❌ Generate error:', err);
      return res.status(500).json({ error: 'Generation failed.' });
    }

    try {
      const output = JSON.parse(stdout.trim());
      res.status(200).json(output);
    } catch (e) {
      console.error('JSON parse error:', e);
      res.status(500).json({ error: 'Invalid response from script.' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
