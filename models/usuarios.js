const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    userlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "listas" }]
})

userSchema.statics.validateUser = async function(username,password){
    const userfind = await this.findOne({username});
    if(!userfind){
      return undefined;
    }
    const validuser = await bcrypt.compare(password, userfind.password);
    return validuser ? userfind : undefined;
}

userSchema.pre('save', async function(next){
    this.password = await bcrypt.hash(this.password, 12);
    next();
})
const usermodel = new mongoose.model('users', userSchema);
module.exports = usermodel;