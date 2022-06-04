// Initialize Express
const express = require('express')

// Method Override
const methodOverride = require('method-override')

// INITIALIZE BODY-PARSER AND ADD IT TO APP
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));

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


// app.get('/events/new', (req, res) => {
//     res.render('events-new', {});
// })

// CREATE
// app.post('/events', (req, res) => {
//     models.Events.create(req.body).then(event => {
//         res.redirect(`/`);
//     }).catch((err) => {
//         console.log(err)
//     });
// })

// // CREATE
// app.post('/events', (req, res) => {
//     models.Events.create(req.body).then(event => {
//         // Redirect to events/:id
//         res.redirect(`/events/${event.id}`)
//     }).catch((err) => {
//         console.log(err)
//     });
// })

// // SHOW
// app.get('/events/:id', (req, res) => {
//   // Search for the event by its id that was passed in via req.params
//     models.Events.findByPk(req.params.id).then((event) => {
//         res.render('events-show', { event: event })
//     }).catch((err) => {
//     // if the id was for an event not in our db, log an error
//         console.log(err.message);
//     })
// })

// // EDIT
// app.get('/events/:id/edit', (req, res) => {
//     models.Events.findByPk(req.params.id).then((event) => {
//         res.render('events-edit', { event: event });
//     }).catch((err) => {
//         console.log(err.message);
//     })
// });

// // UPDATE
// app.put('/events/:id', (req, res) => {
//     models.Events.findByPk(req.params.id).then(event => {
//             event.update(req.body).then(event => {
//             res.redirect(`/events/${req.params.id}`);
//         }).catch((err) => {
//             console.log(err);
//         });
//     }).catch((err) => {
//         console.log(err);
//     });
// });

// // DELETE
// app.delete('/events/:id', (req, res) => {
//     models.Events.findByPk(req.params.id).then(event => {
//         event.destroy();
//         res.redirect(`/`);
//     }).catch((err) => {
//         console.log(err);
//     });
// })

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('App listening on ' + port)
})