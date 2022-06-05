// Initialize Express
const express = require('express')

// Method Override
const methodOverride = require('method-override')

// INITIALIZE BODY-PARSER AND ADD IT TO APP
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));

// Styles
// app.use(express.static('public'));

// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))


// Require Handlebars
// require handlebars
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const models = require('./db/models');


// Define and use 'main' as the default layout
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main', handlebars: allowInsecurePrototypeAccess(Handlebars) }));
// Use handlebars to render :)
app.set('view engine', 'handlebars');

require('./controllers/events')(app, models);
require('./controllers/rsvps')(app, models);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('App listening on ' + port)
})