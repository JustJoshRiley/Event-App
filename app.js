// Initialize Express
const express = require('express')

// Method Override
const methodOverride = require('method-override')

// INITIALIZE BODY-PARSER AND ADD IT TO APP
const bodyParser = require('body-parser');

// Cookies
const cookieParser = require('cookie-parser');

const jwt = require('jsonwebtoken');

const app = express()

const session = require('express-session');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());


// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))


// Require Handlebars
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const models = require('./db/models');

require('dotenv').config()

const hbs = exphbs.create({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    helpers: {
        if_eq: function (a, b, opts) {
            // return a === b
            if (a === b) {
                return opts.fn(this);
            }
            return opts.inverse(this);
        },
    },
});


// Define and use 'main' as the default layout
app.engine('handlebars', hbs.engine);
// Use handlebars to render :)
app.set('view engine', 'handlebars');


// Middleware
app.use(function authenticateToken(req, res, next) {
    const token = req.cookies.mpJWT;

    if (token) {
        jwt.verify(token, "AUTH-SECRET", (err, user) => {
        if (err) {
            console.log(err)
            // redirect to login if not logged in
            res.redirect('/login')
        }
        req.user = user
        next();
        })
    } else {
        next();
    }
});

app.use((req, res, next) => {
  // if a valid JWT token is present
    if (req.user) {
    // Look up the user's record
    models.Users.findByPk(req.user.id).then(CurrentUser => {
        // make the user object available in all controllers and templates
        res.locals.CurrentUser = CurrentUser;
        // console.log(res.locals.CurrentUser, "current user")
        next()
    }).catch(err => {
        console.log(err)
    })
    } else {    
    next();
    }
});

app.use(cookieParser(process.env.SESSION_SECRET));
const expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 60);
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        cookie: { expires: expiryDate },
        resave: false,
        saveUninitialized: true,
    })
);
app.use(function (req, res, next) {
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});

require('./controllers/events')(app, models);
require('./controllers/rsvps')(app, models);
require('./controllers/auth')(app, models);

const port = process.env.PORT;

app.listen(port, (err) => {
    if (err) {
        console.log(err)
    }
    console.log('App listening on ' + port)
})