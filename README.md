# RepoExplorer

Exercise 3 — GitHub Repo Explorer, for the Studio Graphene Associate Software Engineer take-home.

A small full-stack app where you enter a GitHub username and see that user's public profile plus their public repositories. The React frontend never calls GitHub directly; an Express backend proxies the requests so a token stays server-side and rate limits can be handled in one place.

**Live demo**

- Deployed Link: `https://repo-explorer-nine.vercel.app/`
- Backend API: `https://repoexplorer-oxco.onrender.com`

---

## Tech stack

| Part | Choice | Why |
|------|--------|-----|
| Frontend | React + Vite | Fast dev setup, hooks-based components |
| Backend | Node.js + Express | Simple REST proxy, easy to deploy |
| Styling | Plain CSS | No extra dependencies, full control over layout |
| Hosting | Vercel (client) + Render (server) | Free tiers, straightforward GitHub deploys |


---

## Run locally

You need Node.js 18+ installed.

**1. Clone and install**

```bash
git clone https://github.com/rishidhama/RepoExplorer.git
cd RepoExplorer
```

**2. Backend**

```bash
cd server
cp .env.example .env
```

Add a GitHub token to `.env` if you have one (optional but recommended for higher rate limits):

```
GITHUB_TOKEN=your_token_here
```

```bash
npm install
npm run dev
```

Server runs on http://localhost:3001

**3. Frontend** (new terminal)

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173 — the Vite dev server proxies `/api` to the backend.

For a production-style local test, set `VITE_API_URL=http://localhost:3001` in `client/.env` and run `npm run build && npm run preview`.

---

## API

### `GET /health`

Health check.

**Response**

```json
{ "status": "ok" }
```

---

### `GET /api/users/:username`

Fetches a GitHub user profile and their first page of public repos (up to 30).

**Params**

| Name | In | Description |
|------|-----|-------------|
| username | path | GitHub username |

**Success — `200`**

```json
{
  "user": {
    "login": "octocat",
    "name": "The Octocat",
    "avatar_url": "https://...",
    "bio": null,
    "followers": 0,
    "following": 0,
    "public_repos": 0
  },
  "repos": [
    {
      "id": 123,
      "name": "Hello-World",
      "html_url": "https://github.com/octocat/Hello-World",
      "description": "...",
      "language": "JavaScript",
      "stargazers_count": 100,
      "updated_at": "2026-06-01T12:00:00Z",
      "open_issues_count": 5,
      "default_branch": "main"
    }
  ]
}
```

**Errors**

| Status | When |
|--------|------|
| 404 | Username not found |
| 429 | GitHub rate limit hit |
| 500 | Network or unexpected server error |

```json
{ "message": "No GitHub user found for '@xyz'" }
```

---

## Project structure

```
RepoExplorer/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.jsx         # Search, profile, repo list, sorting
│   │   ├── App.css
│   │   └── main.jsx
│   └── vite.config.js      # Dev proxy to backend
├── server/                 # Express backend
│   ├── index.js            # Routes and error handling
│   ├── githubService.js    # GitHub API calls
│   └── .env.example
└── README.md
```

---

## What works

- Search by GitHub username
- Profile: avatar, name, bio, followers, following, repo count
- Repo list: name, description, language, stars, last updated
- Sort repos by stars, name, or last updated (client-side)
- Repo names link out to GitHub
- Loading skeletons, error states, basic responsive layout
- 404 for invalid usernames
- Rate limit and network errors surfaced to the user
- Deployed frontend talking to deployed backend

---

## Repo

https://github.com/rishidhama/RepoExplorer
