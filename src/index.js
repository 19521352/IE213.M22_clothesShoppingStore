var Handlebars = require("handlebars");
var MomentHandler = require("handlebars.moment");
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const { engine, create } = require('express-handlebars')
const SortMiddleware = require('./app/middleware/SortMiddleware')

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

// Custom middlewares
app.use(SortMiddleware)
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
      sum: (a, b) => a + b,
      sortable: (field, sort) => {
        const sortType = field === sort.column ? sort.type : 'default'

        const icons = {
          default: 'bi bi-filter',
          asc: 'bi bi-sort-down',
          desc: 'bi bi-sort-up',
        }
        const types = {
          default: 'desc',
          asc: 'desc',
          desc: 'asc'
        }
        const paths = {
          default: '<path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />',
          asc: '<path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>',
          desc: '<path d="M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707V12.5zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>',

        }

        const icon = icons[sortType]
        const type = types[sortType]
        const path = paths[sortType]
        return `<a href="?_sort&column=${field}&type=${type}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="${icon}" viewBox="0 0 16 16">
                    ${path}
                  </svg>
                </a>`
      }
    }

  }
  ));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// handlebar helpers
MomentHandler.registerHelpers(Handlebars);
Handlebars.registerHelper('compareString', function (String1, String2) {
  return String1 == String2;
})


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route init
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`, `http://localhost:${port}/`)
});