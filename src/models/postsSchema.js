const mongoose = require("mongoose");

const postMongoose = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    createdby:{
        type:String,
        required:true
    },
    status:{
        type: String,
        enum: ["active", "inactive"],
        required: true
    }

})

const postSchema = new mongoose.model("postSchema", postMongoose);
module.exports=postSchema;