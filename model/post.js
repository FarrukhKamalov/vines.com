const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    PostedBy:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    }],
    title:{
        type: String,
        max: 120
    },
    desc:{
        type: String,
        max: 760
    },
    video:{
        type: String
    },
    commentedBy: [{
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Comment'
    }]
}, {timestamps:true});

module.exports = mongoose.model('Post', postSchema);