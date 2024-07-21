const express = require('express')
const { login_router } = require('./src/controller/login')
const { room_router } = require('./src/controller/rooms')
const db = require('./src/config/db')
const cors = require('cors')
app = express()
app.use(express.json())
app.use(cors({origin:"*"}))
db.sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

db.sequelize.sync()
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch(err => {
    console.error('Unable to synchronize the database:', err);
  });

app.use('/login',login_router)
app.use('/room',room_router)
app.use('/',(req,res,next)=>{
    res.json({"status":"connected"})
})
app.listen(3000,()=>{
    console.log("App started at 3000")
})