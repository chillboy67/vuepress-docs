const express = require('express')
const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const path = require('path')

const app = express()
app.use(express.json())
app.use(cors())

// 初始化数据库
const db = new Database(path.join(__dirname, 'users.db'))

// 建表（如果不存在）
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`)

// 创建默认管理员账号（admin / 123456）
const admin = db.prepare('SELECT * FROM users WHERE username = ?').get('admin')
if (!admin) {
  const hashed = bcrypt.hashSync('123456', 10)
  db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run('admin', hashed)
  console.log('默认账号已创建: admin / 123456')
}

// 登录接口
app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username)

  if (!user) {
    return res.status(401).json({ message: '用户名或密码错误' })
  }

  const valid = bcrypt.compareSync(password, user.password)
  if (!valid) {
    return res.status(401).json({ message: '用户名或密码错误' })
  }

  res.json({ message: '登录成功' })
})

// 注册接口
app.post('/api/register', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码不能为空' })
  }

  try {
    const hashed = bcrypt.hashSync(password, 10)
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashed)
    res.json({ message: '注册成功' })
  } catch (e) {
    res.status(409).json({ message: '用户名已存在' })
  }
})

app.listen(3000, () => {
  console.log('后端服务启动在 http://localhost:3000')
})
