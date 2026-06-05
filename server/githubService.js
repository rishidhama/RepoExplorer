const GITHUB_API = 'https://api.github.com';

function githubHeaders() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'RepoExplorer',
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function fetchGithub(url) {
  const response = await fetch(url, { headers: githubHeaders() });

  if (response.status === 404) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  if (response.status === 403 || response.status === 429) {
    const error = new Error('GitHub rate limit reached. Try again later.');
    error.status = 429;
    throw error;
  }

  if (!response.ok) {
    const error = new Error('Failed to fetch from GitHub');
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export async function getUserWithRepos(username) {
  const user = await fetchGithub(`${GITHUB_API}/users/${username}`);
  const repos = await fetchGithub(
    `${GITHUB_API}/users/${username}/repos?per_page=30&page=1&sort=updated`
  );

  return {
    user: {
      login: user.login,
      name: user.name,
      avatar_url: user.avatar_url,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      public_repos: user.public_repos,
    },
    repos: repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      updated_at: repo.updated_at,
      open_issues_count: repo.open_issues_count,
      default_branch: repo.default_branch,
    })),
  };
}
