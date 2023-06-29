const Playlist = require("../model/Playlist");
const User = require("../model/User");
const Song = require("../model/Song");

// ! create playlist 
exports.createPlaylist = async (req, res) => {
  try {
    const currentUser = req.user;

    //  fetch the data
    const { name, thumbnail, songs } = req.body;
    if (!name || !thumbnail || !songs) {
      return res.status(301).json({
        success: false,
        message: "please send all the data ",
      });
    }

    const newPlaylist = await Playlist.create({
      name,
      thumbnail,
      songs,
      owner: currentUser._id,
      collaborators:undefined,
    });

    return res.status(200).json({
      success: true,
      message: "successfully created the playlist",
      newPlaylist,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error in creating a playlist",
    });
  }
};

// ! get a playlist by id
exports.getPlaylistById = async (req, res) => {
  try {
    const playlistId = req.params.playlistId;

    const playlist = await Playlist.find({_id:playlistId });
    if (!playlist) {
      return res.status(301).json({
        success: false,
        message: "invalid playlist ID",
      });
    }

    return res.status(200).json({
      success: true,
      message: "successfully fetch the playlist ",
      playlist,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error in get playlist by id ",
    });
  }
};

// ! get all playlists made by an artist
exports.getAllPlaylist = async (req, res) => {
  try {
    const artistId = req.params.artistId;
    const playlists = await Playlist.find({ owner: artistId });

    const artist = await User.find({ artistId });
    if (!artist) {
      return res.status(304).json({
        success: false,
        message: "no user exist with this id ",
      });
    }

    return res.status(200).json({
      success: true,
      message: "successfully get all playlist ",
      playlists,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error in the get all playlist by artist ",
    });
  }
};

//  ! add a song to a playlist

exports.addSongToPlaylist = async (req, res) => {
  try {
    const currentUser = req.user;

    const { playlistId, songId } = req.body;

    // step0: check validation wheather playlist is write or wrong
    const playlist = await Playlist.findOne({ _id: playlistId });
    if (!playlist) {
      return res.status(304).json({
        success: false,
        message: "cannot find any playlist , please try again ",
      });
    }


    // step1 : check if current user own this playlist or collaborater
    if (
      !playlist.owner.equals(currentUser._id) &&
      !playlist.collaborators.includes(currentUser)
    ) {
      return res.status(400).json({
        success: false,
        message: "the current user is not a owner or collaborator ",
      });
    }

    // step2 : check if song is valid song 
    const song = await Song.findOne({_id:songId});
    if(!song){
        return res.status(304).json({
            success:false,
            messsage:"songId is invalid "
        })
    }

    //   step3:now song is valid and playlist is also valid  , now add the song to playlist 
    playlist.songs.push(songId);
        await playlist.save();

    return res.status(200).json({
        success:true,
        message:"successfully join the song to playlist",
        playlist
    })



  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error in the add song to playlist",
    });
  }
};
