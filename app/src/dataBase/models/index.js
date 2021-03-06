// importamos los paquetes que vamos a utilizar
const mongoose = require('mongoose')

//importamos los esquemas
const UserSchema = require('../schemas/userSchema')
const AdminSchema = require('../schemas/adminSchema')
const AlbumSchema = require('../schemas/albumSchema')
const ArtistSchema = require('../schemas/artistSchema')
const SongSchema = require('../schemas/songSchema')

// creacion de modelos, crea un modelo con el nombre de la coleccion y el
// esquema
const UserModel = mongoose.model("users", UserSchema)
const AdminModel = mongoose.model("admins", AdminSchema)
const AlbumModel = mongoose.model("albums", AlbumSchema)
const ArtistModel = mongoose.model("artists", ArtistSchema)
const SongModel = mongoose.model("songs", SongSchema)

// exportamos los objetos de los modelos
module.exports = { 
  UserModel,
  AdminModel,
  AlbumModel,
  ArtistModel,
  SongModel
}