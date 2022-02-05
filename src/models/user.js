import crypto from 'crypto';
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
    books : {
        type : mongoose.Schema.ObjectId,
        ref : 'borrow', 
    },
    password : {
        type : String,
        required : [true, "Un utilisateur doit avoir un mot de passe"],
        minLength :6,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Confirmez votre mot de passe'],
        validate: {
          validator: function(el) {
            return el === this.password;
          },
          message: 'Les mots de passes ne sons pas identique§'
        }
      },
      passwordChangedAt: Date,
      passwordResetToken: String,
      passwordResetExpires: Date,
    roles : {
        type: String,
        enum: ["User", "Employé", "Admin"],
        default: "User"
    },
    active : {
        type : Boolean,
        default: true
    }

});

userSchema.virtual("fullName").get(function() {
    return `${this.name} ${this.lastName}`;
});

userSchema.pre("save", async function(next) {
    try {
        if(!this.isModified('password')) return next();
        
        this.password = await bcrypt.hash(this.password, 12);
        
        this.passwordConfirm = undefined;

        next();

    } catch (err) {
        console.log(`Une erreur c'est produite lors de la création du compte ${message.err}`);
        next(err);
    };
});

userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});



userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    try {
        return await bcrypt.compare(candidatePassword, userPassword);
    } catch (err) {
        console.log(`Une erreur c'est produite : ${message.err}`);
        next(err);
    };
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000, 
            10
        );

        return JWTTimestamp < changedTimestamp;
    };
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;