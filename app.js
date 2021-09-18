const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json())
app.use(urlencodedParser)
const morgan = require('morgan');
const PORT = process.env.PORT || 2000
const chalk = require('chalk')
app.use(morgan(chalk`:method :url {green :status} :response-time ms - :res[content-length]`));
const { connect } = require('./connection')
connect()

app.use('/', require('./routes/index'))

app.listen(PORT, () => {
    console.log(`Application is running at PORT: ${PORT}`)
})

