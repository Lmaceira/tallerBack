require('./mongo')
require('dotenv').config();

const express = require('express')
const app = express()
const Order = require('./models/Order')
const notFound = require('./middleware/notFound')
const errorsHandle = require('./middleware/errorsHandle')
const cors = require('cors')

app.use(cors())
app.use(express.json())

app.get('/api/orders', (request, response, next) => {
  Order.find({}).then(orders => {
    response.json(orders)
  }) .catch(err => {
    console.log(err)
  })
})


app.get('/api/orders/:id', (request, response, next) => {
  const id = request.params.id
  const order = Order.findById(id).then(order => {
    if(order) {
      return response.json(order)
    } else {
      response.status(404).end()
    }
  }).catch(err => {
    next(err)
    //console.log(err)
    //response.status(400).end()
  })
})

app.delete('/api/orders/:id', (request, response, next) => {
  const {id} = request.params
  Order.findByIdAndDelete(id).then(result => {
    if (result) {
      response.status(204).end()
      console.log("Order deleted");
    } else {
      response.status(404).send({error: 'El id especificado no existe'})
    }
  }).catch(err => next(err))
})

app.post('/api/orders', (request, response, next) => {
  const order = request.body

  //Ejemplo de como poner un campo obligatorio, en este caso el carPlate
  // if(!order || !order.carPlate) {
  //   return response.status(400).json({
  //     error: 'order.carPlate is missing'
  //   })
  // }

  const newOrder = new Order({
    client: {
      name: order.client.name,
      phone: order.client.phone,
      // Ejemplo de como poner un valor por defecto en algun campo si el usuario no lo manda
      email: typeof order.client.email !== 'undefined' ? order.client.email : "Client doesn't have email",
      city: order.client.city
    },
    vehicle: {
      brand: order.vehicle.brand,
      carPlate: order.vehicle.carPlate,
      chassis: order.vehicle.chassis
    },
    problemDesc: order.problemDesc,
    jobDesc: order.jobDesc,
    scannerFile: order.scannerFile,
    total: order.total,
    workDate: order.workDate,
    pieceRef: order.pieceRef
  })

  newOrder.save().then(savedOrder => {
    response.json(savedOrder)
  })
})

app.put('/api/orders/:id', (request, response, next) => {
  const {id} = request.params
  const order = request.body

  const newOrderInfo = {
    client: {
      name: order.client.name,
      phone: order.client.phone,
      // Ejemplo de como poner un valor por defecto en algun campo si el usuario no lo manda
      email: typeof order.client.email !== 'undefined' ? order.client.email : "Client doesn't have email",
      city: order.client.city
    },
    vehicle: {
      brand: order.vehicle.brand,
      carPlate: order.vehicle.carPlate,
      chassis: order.vehicle.chassis
    },
    problemDesc: order.problemDesc,
    jobDesc: order.jobDesc,
    scannerFile: order.scannerFile,
    total: order.total,
    workDate: order.workDate,
    pieceRef: order.pieceRef
  }

  Order.findByIdAndUpdate(id, newOrderInfo, {new: true}).then(result => {
    if (result) {
      response.status(200).end()
      console.log("Orden con ID: " + id + " editada correctamente.\n"+ result)
    } else {
      response.status(404).send({error: 'La orden que quiere editar no existe'})
    }
  }).catch(err => {
    next(err)
  })
})

//middlewares
//El orden de los middlewares es importante, porque siempre va a entrar de arriba a abajo, 
//entonces vamos del mas generico al menos
app.use(notFound)
app.use(errorsHandle)

const PORT = process.env.PORT || 3001

app.listen(PORT, function(){
  console.log("Server listening on: https://localhost:" + PORT);
});

//const PORT = process.env.PORT || 3001
// app.listen(PORT, () =>{
//   console.log(`Server running on port ${PORT}`)
// })
