const Song = require("../model/Song");
const User = require("../model/User");
const jwt = require("jsonwebtoken");

//! create song 
exports.createSong = async (req, res) => {
  try {
    const { name, thumbnail, track } = req.body;

    const token = req.cookies.token || req.get('Authorization').replace('Bearer ','');
    console.log(`token `, token );
    

    const payload = jwt.decode(token);
    console.log('createSONG PAYLOAD ' , payload);
    const artist = payload.id;
    console.log('cretesong artist ',artist);

    //   validation
    if (!name || !thumbnail || !track || !artist) {
      return res.status(301).json({
        success: false,
        message: "please send all valid details to create song",
      });
    }

    const newSongCreate = await Song.create({ name, thumbnail, artist, track });

    return res.status(200).json({
      success: true,
      newSongCreate,
      message: `new song is created into the db`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "new song cannot added to db ",
    });
  }
};

//! get all song i have published
exports.getMySong = async (req, res) => {
  try {
    //
    const token = req.cookies.token || req.get('Authorization').replace('Bearer ', '');
    console.log(`currentUser` ,token );

    try {
      const payload = jwt.decode(token);
      console.log(`paylaod `,payload);
      
      const currentUserId = payload.id;
      console.log(`currentUserId ` ,  currentUserId )

      const allSongs = await Song.find({ artist: currentUserId }).populate("artist")

      return res.status(200).json({
        data: allSongs,
        success: true,
        message: `all song are fetch `,
      });
    
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `there is an error in get all song`,
    });
  }
};


// ! get song by artistID

exports.getSongByArtist = async (req, res) => {
  try {
    const  artistId = req.params.artistId;
//    check  artistID is present or not
const artist = await User.findOne({_id:artistId});
if(!artist){
    return res.status(301).json({
        success:false,
        message:"artist is not present with this id "
    })
}
    
    const songs = await Song.find({ artist: artistId });
   
    return res.status(200).json({
      success: true,
      message: "all songs of artist are fetched ",
      data: songs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error in getsong by artist ",
    
    });
  }
};


//! get songs by its name 
exports.getSongByName = async (req, res) => {
    try {
  
      const songName = req.params.songName;
      
    //  todo: pattern matching instead of direct-name-matching in song 

      const songs = await Song.find({name:songName});
      if(!songs){
        return res.status(301).json({
            success:false,
            message:`no song is found with this name`
        })
      }

      return res.status(200).json({
        success:true,
        message:"song is fetch successfully " ,
        data:songs
      })



    } catch (error) {
      console.log(error);
      return res.status(500).json({
          success:false,
          message:"error in the song by name ",
      })
    }
  };
