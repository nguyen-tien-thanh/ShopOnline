const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const route = require('./routes');
const helpers = require('handlebars-helpers')();
const db = require('./config/db');
const methodOverride = require('method-override');
const { default: mongoose } = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const flash = require('req-flash');
const nodemailer = require('nodemailer');

db.connect();

const hbs = exphbs.create({  
  helpers:require('./ulti/helpers'),
  extname: '.hbs'
})

//--------- Server INITialization
const app = express();

//-----------------------------------
// Cấu hình thư viện + Data
//-----------------------------------
xPORT = process.env.PORT || 5000;


// Cấu hình MVC + Engine - View
app.engine('hbs', hbs.engine);
app.set("view engine", "hbs"); //setting view engine as handlebars
app.set("views", path.join(__dirname, 'resources/views'))

// Session for cart
app.use(session({
  secret: 'foo',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {maxAge: 180 * 60 * 1000}
}));
app.use(function(req, res, next){
  res.locals.session = req.session;
  next()
})

// khai báo tới thư mục Static / Public
// app.use(express.static('src/public')); 
app.use(express.static(path.join(__dirname, 'public')))

//HTTP Loggers
app.use(morgan('combined'));

//Msg Loggers
app.use(flash());

//Middleware to solve Body Form
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'));

//-----------------------------------
// ROUTING tới các chức năng
//-----------------------------------
const Router = express.Router();


route(app);

app.listen(xPORT, () => {
  console.log(``)
  console.log(`Shop online is available on http://localhost:${xPORT}`)
})