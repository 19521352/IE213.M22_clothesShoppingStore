var Handlebars = require("handlebars");
var MomentHandler = require("handlebars.moment");
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const { engine , create } = require('express-handlebars')
var bodyParser = require('body-parser')

const route = require('./routes')
const db = require('./config/db')
const timeKeeper = require('handlebars-helpers');
const cookieparser = require('cookie-parser')

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


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieparser())
app.locals.user = '12'
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
  app.set('views', path.join(__dirname, 'resources', 'views'));
  
// handlebar helpers
MomentHandler.registerHelpers(Handlebars);
Handlebars.registerHelper('compareString', function(String1, String2){
  return String1 == String2;
})
Handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route init
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`, `http://localhost:${port}/`)
});