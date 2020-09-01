const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const expresSession = require('express-session');
const { extname } = require('path');
const flash = require('connect-flash')
const passport = require('passport')



//Inicializaciones
const app = express();
require('./database');
require('./config/passport');


//Configuraciones
//Si existe puerto de servidor que lo tome, si no que se vaya al 3000
app.set('port',process.env.Port || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');



//Midelware (se ejecuta antes de que llegue al servidor)
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(expresSession({
    secret:'mysecretapp',
    resave:true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());




//Variables Global
app.use((req,res,next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    
    next();
})


//Routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));




//Estaticos
app.use(express.static(path.join(__dirname, 'public')));



//Servert init
app.listen(app.get('port'), () =>{
    console.log('server on port', app.get('port'))
})
