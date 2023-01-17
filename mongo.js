require('dotenv').config();

const mongoose = require('mongoose')
const Order = require('./models/Order')

const myDBkey = process.env.mongoPass;
const connectionString = 'mongodb+srv://lucasnm:'+myDBkey+'@orders.ndgxvhv.mongodb.net/tallerAle?retryWrites=true&w=majority'

//conexion a mongoDB
mongoose.set('strictQuery', false);
mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connected')
  }).catch(err => {
    console.error(err)
  })

process.on('uncaughtException', () => {
  mongoose.connection.close()
})