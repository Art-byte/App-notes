const express = require('express');
const router = express.Router();
const Note = require('../models/Note')

router.get('/notes/add', (req,res) =>{
    res.render('notes/new-note')
})




//Obtener los registros de la base de datos
router.get('/notes', async(req,res) =>{
    await Note.find().sort({date:'desc'})
    .then(documentos =>{
        const context = {
            notes:documentos.map(documento=>{
                return{
                    //Cuidado con esto, los valores que estas declarando, son los que debes
                    // es una mamada pero manda a llamar en el hbs, asi que si queires el id, llamas el _id
                    id:documento._id,
                    title:documento.title,
                    description:documento.description
                }
            })
        }
        res.render('notes/all-notes', {notes:context.notes})
    })
})


//editar datos
router.get('/notes/edit/:id', async(req,res) =>{
    const dataNota = await Note.findById(req.params.id).lean()
    res.render('notes/edit-note',{dataNota})

    
})


//put de los datos 
router.put('/notes/edit-note/:id', async (req,res) =>{
    const {title,description} = req.body;
    await Note.findByIdAndUpdate(req.params.id,{title,description});
    req.flash('success_msg','Nota actualizada')
    res.redirect('/notes')
})

//Delete
router.delete('/notes/delete/:id', async(req,res) =>{
    await Note.findByIdAndDelete(req.params.id)
    req.flash('success_msg','Nota eliminada')
    res.redirect('/notes')
})


//Con este metodo guardamos los datos y hacemos validaciones de formulario
router.post('/notes/new-note', async (req,res) =>{
   const { title, description } = req.body
   const errors = [];
   if(!title){
       errors.push({text:'Por favor inserta un titulo'})
   }
   if(!description){
       errors.push({text:'Por favor inserta una descripcion'})
   }

   if(errors.length > 0){
       res.render('notes/new-note', {
           errors, title, description
       })
   }else{
    const newNote = new Note({ title, description });
    await newNote.save();
    req.flash('success_msg','Se agrego satisfactoriamente la nota')
    res.redirect('/notes');
   }
});



module.exports = router;

