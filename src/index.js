var Handlebars = require("handlebars");
var MomentHandler = require("handlebars.moment");
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const { engine } = require('express-handlebars')
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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieparser())
// Template engine
app.engine(
  'hbs',
  engine({
    extname: '.hbs'
  }
  ));
  
  app.set('view engine', 'hbs');
  app.set('views', path.join(__dirname, 'resources', 'views'));
  
// handlebar helpers
MomentHandler.registerHelpers(Handlebars);
Handlebars.registerHelper('compareString', function(String1, String2){
  return String1 == String2;
})

// Route init
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`, `http://localhost:${port}/`)
});