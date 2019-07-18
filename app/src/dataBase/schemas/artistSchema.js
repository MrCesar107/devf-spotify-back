const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ArtistSchema = new Schema({
	name: {
		type: String,
		required: true
	},

	bio: {
		type: String
	},

	profile: {
		type: String
  },

  albums: [{
    type: Schema.Types.ObjectId,
    ref: 'albums'
  }]
})

mongoose.Types.ObjectId.prototype.valueOf = function() {
  return this.toString()
}

module.exports = ArtistSchema
