const mongoose = require('mongoose');

const CommentSchema =  new mongoose.Schema({
    Comment: {
        type: String
    },   
    commentBy:[{
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User'
    }],
    owner:{
        type:mongoose.Types.ObjectId,
    }
})

module.exports = mongoose.model('Comment', CommentSchema)