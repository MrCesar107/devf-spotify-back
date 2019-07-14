// importamos los modelos de la base de datos
const { AdminModel } = require('../dataBase/models')
const { ArtistModel } = require('../dataBase/models')
const { AlbumModel } = require('../dataBase/models')

// importamos las acciones(logica de negocio para los resolvers)
const { loginAction, signUpAction } = require('../actions/userActions')
const { 
  adminLoginAction,
  adminSignUpAction,
  addArtistToAdminAction
} = require('../actions/adminActions')
const {
  createAlbumAction,
  addSongToAlbumAction
} = require('../actions/albumActions')
const {
  createArtistAction,
  addAlbumToArtist
} = require('../actions/artistActions')
const { createSongAction } = require('../actions/songActions')

// importamos las utilidades
const { storeUpload, musicStoreUpload } = require('../utils/uploader')

// Resolvers funciones que son la logica del negocio y son acciones que define
// como se comportan las queries y las mutations
// parent --- es lo que necesita la funcion para que funcione como un resolver
// args -- argumentos que recibe la funcion
// context -- se variables que se comparte atravez de todos los resolvers
// info

const register = (admin) => {
  return new Promise((resolve, reject) => {
    AdminModel.findOne(admin._id).populate('artists').exec(
      function (err, adminInfo) {
        resolve(adminInfo)
      }
    )
  })
}

const resolvers = {

  Query: {
    queryWithLogin: () => {
      return { message: 'Esto es un query con login' }
    },
    simpleQuery: () => {
      return { message: 'Esto es un simple query' }
    },

    getAdminArtists: (parent, args, context, info) => {
      const { admin } = context
      return register(admin).then(adminInfo => {
        const data = adminInfo.artists
        return data
      })
    },

    getArtists: (parent, args, context, info) => {
      return ArtistModel.find({}, (err, artists) => {
        return artists
      })
    }
  },

  Mutation: {
    userSignup: (parent, args, content, info) => {
      return signUpAction({ ...args.data }).then(result => {
        return result
      }).catch(err => {
        return err;
      })
    },

    userLogin: (parent, args, content, info) => {
      const { email, password } = args;
      return loginAction(email, password).then(result => {
        return result
      }).catch(err => {
        return err;
      })
    },

    adminSignup: (parent, args, content, info) => {
      return adminSignUpAction({ ...args.data }).then(result => {
        return result
      }).catch(err => {
        return err
      })
    },

    adminLogin: (parent, args, content, info) => {
      const { email, password } = args
      return adminLoginAction(email, password).then(result => {
        return result
      }).catch(err => {
        return err
      })
    },

    createAlbum: async (parent, args, context, info) => {
      const { createReadStream } = await args.albumData.coverPage
      const stream = createReadStream()
      const { url } = await storeUpload(stream)
      const albumInfo = {
        name: args.albumData.name,
        year: args.albumData.year,
        coverPage: url
      }
      ArtistModel.findById(args.artist).then((artist) => {
        return createAlbumAction(albumInfo).then(album => {
          return addAlbumToArtist(album, artist).then((message) => {
            return (message)
          })
        }).catch(err => {
          return err
        })
      })
    },

    createArtist: async (parent, args, context, info) => {
      const { admin } = context
      const { createReadStream } = await args.artistData.profile
      const stream = createReadStream()
      const { url } = await storeUpload(stream)
      const artistInfo = {
        name: args.artistData.name,
        bio: args.artistData.bio,
        profile: url
      }
      return createArtistAction(artistInfo).then(artist => {
        return addArtistToAdminAction(artist, admin).then((message) => {
          return (message)
        })
      }).catch(err => {
        return err
      })
    },

    createSong: async (parent, args, context, info) => {
      const { createReadStream } = await args.songData.source
      const stream = createReadStream()
      const { url } = await musicStoreUpload(stream)
      const songInfo = {
        name: args.songData.name,
        artist: args.songData.artist,
        source: url,
        duration: ""
      }
      AlbumModel.findById(args.album).then((album) => {
        return createSongAction(songInfo).then(song => {
          return addSongToAlbumAction(song, album)
            .then((message) => {
              return (message)
          })
        }).catch(err => {
          return err
        })
      })
    }
  }
}

// exportamos los resolvers
module.exports = resolvers;