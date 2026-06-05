import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { getUserWithRepos } from './githubService.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/users/:username', async (req, res) => {
  try {
    const data = await getUserWithRepos(req.params.username);
    res.json(data);
  } catch (err) {
    const status = err.status || 500;
    const message =
      status === 404
        ? `No GitHub user found for '@${req.params.username}'`
        : err.message || 'Something went wrong';

    res.status(status).json({ message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
