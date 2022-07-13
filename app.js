const express = require('express')
const cors = require('cors')

const app = express()
const port = 3000

var numberRouter = require('./routes/numbers');

app.use(express.json())  
app.use(cors())

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use('/numbers', numberRouter);