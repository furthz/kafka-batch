const express = require ('express')
const bodyParser = require('body-parser')
const { Kafka } = require('kafkajs')

const app = express()

const broker = process.env.BROKER_KAFKA

const kafka = new Kafka({
    clientId: 'my-kafka-example',
    brokers: [broker],
  })

const producer = kafka.producer()

const run = async (msg) => {
    // Producing
    await producer.connect()
    await producer.send({
      topic: 'test-topic',
      messages: [
        { 
          value: msg 
        },
      ],
    })
}

console.log('Iniciando Servicio...')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hello World ')
})

app.post('/datos', (req, res) => {
    console.log(req.body)
    run(JSON.stringify(req.body))
    res.send('Ok')
})

app.listen(3000)