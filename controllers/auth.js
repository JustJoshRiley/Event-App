const jwt = require('jsonwebtoken');

function generateJWT(user) {
    const mpJWT = jwt.sign({ id: user.id }, "AUTH-SECRET", 
    { expiresIn: 60*60*24*60 });
    return mpJWT
}




module.exports = function (app, models) {

    app.get('/signup', (req, res) => {
    res.render('signup-form', {});
    });
    app.get('/login', (req, res) => {
        res.render('login-form', {});
    });



    // Login Post
    app.post('/login', (req, res, next) => {
        models.Users.findOne({ where: { email: req.body.email } }).then(user => {
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (!isMatch) {
                return res.redirect('/login');
            }
            const mpJWT = generateJWT(user);
            res.cookie('mpJWT', mpJWT);
            res.redirect('/');
            })
        })
        .catch((err) => {
            console.log(err)
            return res.redirect('/login')
        })
    });

    // Signup Post
    app.post('/signup', (req, res) => {
        models.Users.create(req.body).then(user => {
            // res.redirect('/')
            const mpJWT = generateJWT(user)
            res.cookie("mpJWT", mpJWT)
            res.redirect('/')
        }).catch((err) => {
            console.log(err)
        })
    })

    // logout
    app.get('/logout', (req, res, next) => {
        res.clearCookie('mpJWT');
        return res.redirect('/');
    });

    

}