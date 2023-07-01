const express = require("express");
const router = express.Router();
const passport = require("passport");


const {signup ,login } = require("../controller/auth")
const {createSong ,getMySong , getSongByArtist , getSongByName} = require("../controller/song");
 const {createPlaylist, getPlaylistById, addSongToPlaylist}  = require("../controller/playlist")

// this POST route will help to register a user
router.post("/register" , signup);
router.post("/login" , login);
router.post("/song/create" ,passport.authenticate("jwt" , {session:false}), createSong);
router.get("/get/mySongs" ,passport.authenticate("jwt" , {session:false}) ,getMySong);


// i will send the artist id and i want to see all songs that artist has publish
router.get("/getArtist/:artistId" ,passport.authenticate("jwt" ,{session:false}) ,getSongByArtist);


// get route to get a single song by name  
router.get("/get/:songName" ,passport.authenticate("jwt" , {session:false}), getSongByName);

// route for to create playlist 
router.post("/create/playlist" , passport.authenticate("jwt" , {session:false}) , createPlaylist);

// get all playlist by id
router.get("/getPlaylistById/:playlistId" , passport.authenticate("jwt" , {session:false}) , getPlaylistById)


// get all playlist made by an artist 
router.get("/getAllPlaylist/:artistId" , passport.authenticate("jwt" , {session:false}) , getSongByArtist)


// add a song made by an artist 
router.post("/addSong" , passport.authenticate("jwt" ,{session:false}) , addSongToPlaylist);


module.exports = router;

