const express = require('express');

const path = require('path');
const mongoose = require('mongoose')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');


const ExpressError = require('./utils/ExpressError');

const cookieParser = require('cookie-parser')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


const kiteRouter = require('./routes/kiteRouter');
const reviewsRouter = require('./routes/reviewsRouter');
const firmRouter = require('./routes/firmRouter');
const loginRouter = require('./routes/logInRouter');
const signinRouter = require('./routes/signInRouter');
const logoutRouter = require('./routes/logoutRouter');
const usedRouter = require('./routes/usedRouter');
const usedReviewsRouter = require('./routes/usedReviewsRouter');

mongoose.connect('mongodb://localhost:27017/kiteEquip', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();



// const shopBasket = [];
app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))


app.use(cookieParser())
const sessionConfig = {
    secret: 'thisissecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 3600000 * 24 * 7
    }
}



app.use(session(sessionConfig))
app.use(flash())


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
    usernameField: 'email'
},    User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    console.log(req.session)
    // console.log(req.originalUrl)

    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})






app.use("/kitesurf", kiteRouter)
app.use("/kitesurf/:id/reviews", reviewsRouter)
app.use("/firms", firmRouter)
app.use("/login", loginRouter)
app.use("/signin", signinRouter)
app.use("/logout", logoutRouter)
app.use("/used", usedRouter)
app.use("/used/:id/reviews", usedReviewsRouter)

app.get('/', (req, res) => {
    res.locals.title = "Home";
    res.render('home');
})



// app.get('/shoppingcart', async (req, res) => {  
//     const basket = await shopBasket.find({})
//     res.render('basket/cart', { basket })
// })

// app.post('/kitesurf/:id', async (req, res) => {
//     const { id } = req.params;
//     const kiteProduct = await Kitesurf.findById(id);
//     shopBasket.push(kiteProduct)
//     res.redirect('/shopingcart')
// })

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404))
})


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No, Someting Went Wrong!"
    res.locals.title = "Error";
    res.status(statusCode).render('error', { statusCode, err });

})




app.listen(3000, () => {
    console.log('serving on port 3000, ready!')
})