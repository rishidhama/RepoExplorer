import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { get as getCached, set as setCache } from './cache.js';
import { getUserWithRepos } from './githubService.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/users/:username', async (req, res) => {
  const { username } = req.params;
  const cacheKey = username.toLowerCase();

  const cached = getCached(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    const data = await getUserWithRepos(username);
    setCache(cacheKey, data);
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
