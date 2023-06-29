const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
    type:String,
    required:true,
    },

    email:{
        type:String,
        trim:true,
        required:true,
    },
    userName:{
        type:String,
        required:true,
    },
    gender:{
    type:String,
    enum:["male" , "female" ,"other","  Non-binary","Prefer not to say"]
    },

    password:{
        type:String ,
        required:true,
        private:true
    },
    // ! it will change
    likedSong:[{
        type:String,
        default:""
    }] ,
    likedPlaylists:[{
        type:String,
        default:"",
    }],
    subscribedArtist:[{
        type:String,
        default:""
    }]
})

module.exports = mongoose.model("User" ,userSchema);