import mongoose from 'mongoose';


const bookSchema = new mongoose.Schema({
    title : {
        type: String,
        required: [true,"Un livre doit avoir un titre"]
    }, 
    image : {
        type: String,
        //required: [true,"Un livre doit avoir une image de premiére de couverture"]
    },
    relaseDate : {
        type : Date,
        required: [true,"Un livre doit avoir une date de parution"]
    },
    description : {
        type: String,
        required: [true,"Un livre doit avoir une description"],
        minLength:[10, "La description doit comptenir au moins 10 caractére"],
        maxLength:[250, "La description doit pas dépasser les 255 caractére"]
    },
    author : {
        name : {type: String, required: [true, "Un autheur doit avoir un nom"]},
        lastName : {type: String, required : [true, "un autheur doit avoir un prenom"]},
    },
    type : {
        type: String,
        enum : ["Policier", "Fantastique", "Thriller", "Documentaire"]
    },
    available : {
        type : Boolean,
        default : true
    }
});

const Book = mongoose.model('Book', bookSchema);

export default Book;