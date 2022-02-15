const express = require('express')
require('dotenv').config({ path: './config/config.env' })
const app = express()
const { sequelize, User, Post } = require('./models')
app.use(express.json())

app.get('/', (req, res) => {
  return res.json({ message: 'Everything is running ok :D' })
})

app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll()
    return res.json(users)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

app.get('/users/:userId', async (req, res) => {
  const uuid = req.params.userId
  try {
    const user = await User.findOne({ where: { uuid }, include: ['posts'] })
    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

app.post('/users', async (req, res) => {
  const { name, email, role } = req.body
  try {
    const user = await User.create({ name, email, role })
    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

app.post('/posts', async (req, res) => {
  const { userUuid, body } = req.body
  console.log(req.body)
  try {
    const user = await User.findOne({ where: { uuid: userUuid } })
    const post = await Post.create({ body, userId: user.id })
    return res.json(post)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

app.get('/posts', async (req, res) => {
  try {
    //const posts = await Post.findAll({ include: [User] })
    const posts = await Post.findAll({
      include: [{ model: User, as: 'user' }]
    })
    //afer included in the model
    //it can be an array if are more than one
    //or just a string
    //const posts = await Post.findAll({ include: ['user'] })
    return res.json(posts)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

app.put('/users/:userId', async (req, res) => {
  const uuid = req.params.userId
  const { name, email, role } = req.body
  try {
    let user = await User.findOne({ where: { uuid } })
    user.name = name || user.name
    user.email = email || user.email
    user.role = role || user.role
    await user.save()

    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

app.delete('/users/:userId', async (req, res) => {
  const uuid = req.params.userId
  try {
    const user = await User.findOne({ where: { uuid } })
    await user.destroy()
    return res.json({ message: 'User deleted' })
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

app.listen(process.env.PORT, async () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`)
  //await sequelize.sync({ force: true })
  //console.log('Database synced!')
  await sequelize.authenticate()
  console.log('Database connected')
})
