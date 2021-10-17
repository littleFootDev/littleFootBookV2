import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Un utilisateur doit avoir un nom"]
    },
    lastName : {
        type : String,
        required : [true, "Un utilisateur doit avoir un prenom"]
    },
    email : {
        type : String,
        required : [true, "Un utilisateur doit avoir un email"],
        unique : true,
        lowercase: true,
        validate : [validator.isEmail, "Renseigner un email valide"]
    },
    birthday : {
        type : Date,
        required : [true, "Un utilisateur doit avoir une date de naisance"]
    },
    adress : {
        numberOfStreet : { type: Number,},
        nameOfStreet : {type: String, },
        zipCode : {type : Number,}
    },
    password : {
        type : String,
        required : [true, "Un utilisateur doit avoir un mot de passe"],
        minLength :6,
        select: false
    },
    roles : {
        type: String,
        enum: ["User", "Employé", "Admin"],
        default: "User"
    },
    active : {
        type : Boolean,
        default: false
    }

});
userSchema.pre("save", async function(next) {
    try {
        if(!this.isModified('password')) return next();
        
        this.password = await bcrypt.hash(this.password, 12);
    } catch (err) {
        console.log(`Une erreur c'est produite lors de la création du compte ${message.err}`);
        next(err);
    }
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    try {
        return await bcrypt.compare(candidatePassword, userPassword);
    } catch (err) {
        console.log(`Une erreur c'est produite : ${message.err}`);
        next(err);
    }
}

const User = mongoose.model('User', userSchema);

export default User;