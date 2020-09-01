const express = require('express');
const router = express.Router();
const User = require('../models/User')
const passport = require('passport')


router.get('/users/signin', (req,res) =>{
    res.render('users/signin')
});

router.get('/users/signup', (req,res) =>{
    res.render('users/signup')
});


//Autenticacion 
router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect:'/users/signin',
    failureFlash: true
}));






//Insertar usuario y validacion de formulario
router.post('/users/signup', async(req,res) =>{
    const { name, email, password, confirm_password } = req.body;
    const errors = []; 
    console.log(req.body)

    if(name.length <= 0){
        errors.push({text:'El campo nombre es obligatorio'})
    }
    if(email.length <= 0){
        errors.push({text:'El campo nombre es obligatorio'})
    }
    if(password.length <= 0){
        errors.push({text:'El campo nombre es obligatorio'})
    }
    if(confirm_password.length <= 0){
        errors.push({text:'El campo nombre es obligatorio'})
    }

    if(password != confirm_password){
        errors.push({text:'El password no coincide'})
    }

    if(password.length < 4){
        errors.push({text:'El password no puede medir mas de 4'})
    }

    if(errors.length > 0){
        res.render('users/signup',{errors, name, email, password, confirm_password})
    }else{


        const emailUser = await User.findOne({email:email});
        if(emailUser){
            req.flash('error_msg','El email ya existe')
            res.redirect('/users/signup')
        }

        const newUser = new User({name, email, password});
        newUser.password = await newUser.encryptPassword(password)
        await newUser.save();
        req.flash('success_msg', 'Usuario registrado')
        res.redirect('/users/signin');
    }


});

module.exports = router;