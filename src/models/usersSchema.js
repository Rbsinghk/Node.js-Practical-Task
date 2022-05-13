const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userMongoose = new mongoose.Schema({
    

    name: {
        type:String,
        required:true,
    },
    email: { 
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },
    password: {
        type:String,
        required:true,
    },
    phone: {
        type:Number,
        required:true,  
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})


//Generating tokens
userMongoose.methods.generateAuthToken = async function(){
  try {
      const token = jwt.sign({_id:this._id.toString()}, "mynameisrajbirsinghkhokharmanjitsingh")
      this.tokens = this.tokens.concat({token:token})
      await this.save();
      return token;
  } catch (error) {
      res.send("the error part" + error)
  }
}


//Converting password into Hash
userMongoose.pre("save", async function(next){

    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 5);
    }
    next();
})


const userSchema = new mongoose.model("userSchema", userMongoose);
module.exports=userSchema;