const express = require('express')
const path = require('path')
const morgan = require('morgan')
const { engine } = require('express-handlebars')
var bodyParser = require('body-parser')

const route = require('./routes')
const db = require('./config/db')

// Connect to DB
db.connect()

const app = express()
const port = 3000

// HTTP logger
// app.use(morgan('combined'))

app.use(express.static(path.join(__dirname, 'public')));

//Pjax
// const pjax = require('express-pjax');
// app.use(pjax())


// Template engine
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    helpers: {
      json: function (context) {
        return JSON.stringify(context);
      },
      eq: (v1, v2) => v1 === v2,
      ne: (v1, v2) => v1 !== v2,
      lt: (v1, v2) => v1 < v2,
      gt: (v1, v2) => v1 > v2,
      lte: (v1, v2) => v1 <= v2,
      gte: (v1, v2) => v1 >= v2,
      and() {
        return Array.prototype.every.call(arguments, Boolean);
      },
      or() {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
      },
      sum: (a, b) => a + b
    }

  }
  ));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));


app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// Route init
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`, `http://localhost:${port}/`)
});