module.exports = (app, models) => {
  // NEW
    app.get('/events/:eventId/rsvps/new', (req, res) => {
        models.Events.findByPk(req.params.eventId).then(event => {
        res.render('rsvps-new', { event: event });
        });
    });

  // Create
    app.post('/events/:eventId/rsvps', (req, res) => {
        req.body.EventId = req.params.eventId;
        models.Rsvps.create(req.body).then(rsvp => {
            res.redirect(`/events/${req.params.eventId}`);
        }).catch((err) => {
            console.log(err)
        });
    });

    
  // Delete
    app.delete('/events/:eventId/rsvps/:id', (req, res) => {
        models.Rsvps.findByPk(req.params.id).then(rsvp => {
            rsvp.destroy();
            res.redirect(`/events/${req.params.eventId}`);
        }).catch((err) => {
            console.log(err);
        });
    });
}