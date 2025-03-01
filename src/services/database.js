const Database = require('better-sqlite3')
const path = require('path')
const { app } = require('electron')

class DatabaseService {
  constructor() {
    const userDataPath = app.getPath('userData')
    const dbPath = path.join(userDataPath, 'moly-blogger.db')
    this.db = new Database(dbPath)
    this.initDatabase()
  }

  initDatabase() {
    // Create tables if they don't exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        status TEXT DEFAULT 'draft',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        workspace_path TEXT
      );

      CREATE TABLE IF NOT EXISTS workspaces (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)
  }

  // Workspace methods
  addWorkspace(path) {
    const stmt = this.db.prepare('INSERT OR IGNORE INTO workspaces (path) VALUES (?)')
    return stmt.run(path)
  }

  getWorkspaces() {
    const stmt = this.db.prepare('SELECT * FROM workspaces ORDER BY created_at DESC')
    return stmt.all()
  }

  // Posts methods
  createPost(title, content, workspacePath) {
    const stmt = this.db.prepare(`
      INSERT INTO posts (title, content, workspace_path) 
      VALUES (?, ?, ?)
    `)
    return stmt.run(title, content, workspacePath)
  }

  updatePost(id, title, content) {
    const stmt = this.db.prepare(`
      UPDATE posts 
      SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `)
    return stmt.run(title, content, id)
  }

  getPosts(workspacePath) {
    const stmt = this.db.prepare('SELECT * FROM posts WHERE workspace_path = ? ORDER BY updated_at DESC')
    return stmt.all(workspacePath)
  }

  getPost(id) {
    const stmt = this.db.prepare('SELECT * FROM posts WHERE id = ?')
    return stmt.get(id)
  }

  deletePost(id) {
    const stmt = this.db.prepare('DELETE FROM posts WHERE id = ?')
    return stmt.run(id)
  }
}

module.exports = DatabaseService 