module.exports = function (app, models) {

    // INDEX
    app.get('/', (req, res) => {
        models.Events.findAll({ order: [['createdAt', 'DESC']] }).then(events => {
            res.render('events-index', { events: events });
        })
    })

    app.get('/events/new', (req, res) => {
        res.render('events-new', {});
    })

    // CREATE
    app.post('/events', (req, res) => {
        models.Events.create(req.body).then(event => {
            // Redirect to events/:id
            res.redirect(`/events/${event.id}`)
        }).catch((err) => {
            console.log(err)
        });
    })

    // SHOW
    app.get('/events/:id', (req, res) => {
    // Search for the event by its id that was passed in via req.params
        models.Events.findByPk(req.params.id, { include: [{ model: models.Rsvps }] }).then((event) => {
            res.render('events-show', { event: event })
        }).catch((err) => {
        // if the id was for an event not in our db, log an error
            console.log(err.message);
        })
    })

    // EDIT
    app.get('/events/:id/edit', (req, res) => {
        models.Events.findByPk(req.params.id).then((event) => {
            res.render('events-edit', { event: event });
        }).catch((err) => {
            console.log(err.message);
        })
    });

    // UPDATE
    app.put('/events/:id', (req, res) => {
        models.Events.findByPk(req.params.id).then(event => {
                event.update(req.body).then(event => {
                res.redirect(`/events/${req.params.id}`);
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);
        });
    });

    // DELETE
    app.delete('/events/:id', (req, res) => {
        models.Events.findByPk(req.params.id).then(event => {
            event.destroy();
            res.redirect(`/`);
        }).catch((err) => {
            console.log(err);
        });
    })

}