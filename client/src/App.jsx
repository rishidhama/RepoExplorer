import { useState } from 'react'
import './App.css'

function sortRepos(repos, sortBy) {
  const list = [...repos]

  if (sortBy === 'stars') {
    return list.sort((a, b) => b.stargazers_count - a.stargazers_count)
  }

  if (sortBy === 'name') {
    return list.sort((a, b) => a.name.localeCompare(b.name))
  }

  return list.sort(
    (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
  )
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function App() {
  const [query, setQuery] = useState('')
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState('stars')

  async function handleSearch(event) {
    event.preventDefault()

    const username = query.trim()
    if (!username) return

    setLoading(true)
    setError('')
    setUser(null)
    setRepos([])

    try {
      const apiBase = import.meta.env.VITE_API_URL || ''
      const response = await fetch(
        `${apiBase}/api/users/${encodeURIComponent(username)}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      setUser(data.user)
      setRepos(data.repos)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const sortedRepos = sortRepos(repos, sortBy)

  return (
    <div className="app">
      <header className="header">
        <h1>RepoExplorer</h1>
        <p>Look up a GitHub user and browse their public repos.</p>
      </header>

      <main className="main">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="GitHub username"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            Search
          </button>
        </form>

        {loading && <p className="status">Loading...</p>}

        {error && <p className="error">{error}</p>}

        {user && (
          <section className="profile">
            <img src={user.avatar_url} alt="" className="avatar" />
            <div>
              <h2>{user.name || user.login}</h2>
              <p className="username">@{user.login}</p>
              {user.bio && <p className="bio">{user.bio}</p>}
              <ul className="stats">
                <li>{user.followers} followers</li>
                <li>{user.following} following</li>
                <li>{user.public_repos} repos</li>
              </ul>
            </div>
          </section>
        )}

        {user && repos.length > 0 && (
          <section className="repos">
            <div className="repos-header">
              <h3>Repositories</h3>
              <div className="sort-controls">
                <button
                  type="button"
                  className={sortBy === 'stars' ? 'active' : ''}
                  onClick={() => setSortBy('stars')}
                >
                  Stars
                </button>
                <button
                  type="button"
                  className={sortBy === 'name' ? 'active' : ''}
                  onClick={() => setSortBy('name')}
                >
                  Name
                </button>
                <button
                  type="button"
                  className={sortBy === 'updated' ? 'active' : ''}
                  onClick={() => setSortBy('updated')}
                >
                  Updated
                </button>
              </div>
            </div>

            <ul className="repo-list">
              {sortedRepos.map((repo) => (
                <li key={repo.id} className="repo-card">
                  <div className="repo-top">
                    <h4>{repo.name}</h4>
                    <span>{repo.stargazers_count} stars</span>
                  </div>
                  {repo.description && (
                    <p className="repo-desc">{repo.description}</p>
                  )}
                  <div className="repo-meta">
                    {repo.language && <span>{repo.language}</span>}
                    <span>Updated {formatDate(repo.updated_at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {user && repos.length === 0 && !loading && (
          <p className="status">No public repositories found.</p>
        )}
      </main>
    </div>
  )
}

export default App
