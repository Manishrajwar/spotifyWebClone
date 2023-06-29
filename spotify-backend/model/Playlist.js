const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
   
    name:{ 
        type:String,
        required:true,
    },
    thumbnail:{
        type:String,
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    // playlist mai song kon se hai 
    songs:[{
             type:mongoose.Schema.Types.ObjectId,
             ref:"Song",
    }],
    // playlist collaborators
    collaborators:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            
        }
    ]
})


module.exports = mongoose.model("Playlist" , playlistSchema);