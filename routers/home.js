const router = require('express').Router()
const cloudinary = require('cloudinary');
const Post = require('../model/post');
const User = require('../model/users');
const verify = require('../verify')

router.get('/home', verify, async(req,res)=>{
try{
    await Post.find().populate('PostedBy')
    .sort({createdAt: -1})
    .then(result =>{
        res.render('home', {result})
    }).catch((err)=>{
        res.send(err)
    })
}catch(err){
    console.log(err)
}
});

router.get('/video/:id', async(req,res)=>{
    try{
    const {id} = req.params
    await Post.find({_id: id}).populate('PostedBy').then(result =>{
        res.render('video', {result})
    }).catch(err =>{
        console.log(err)
    })
}catch(err){
    console.log(err)
}
})
router.post('/postsave', verify,async(req,res)=>{
    try{
    console.log(req.files)
    cloudinary.v2.uploader.upload(req.files.video.tempFilePath , {resource_type: "video", chunk_size: 6000000})
    .then((result)=>{
        const newPost = new Post({
            PostedBy: req.user,
            title: req.body.title,
            desc: req.body.desc,
            video: result.secure_url
        })
        newPost.save().then((result)=>{ res.redirect('/home');}).catch(err=>{
            console.log(err)
        })
    }).catch((err)=>{
        res.status(500).json({message: "failure", err})
    })
}catch(err){
    console.log(err)
}
})

router.get('/search', async(req,res) =>{
    try{
    const regexQuery = {
        author: new RegExp(req.query.search, 'i')
    }
    const title = req.query.search
    await User.find({"Username": regexQuery.author}).then((result)=>{
        res.render('search', {title, result})
    }).catch(err=>{
        console.log(err)
    });
}catch(err){
    console.log(err)
}
});


router.get('/me', verify, async(req,res)=>{
    try{
    const id = req.user._id
    
    await Post.find({PostedBy: id}).populate('PostedBy').sort({createdAt: -1}).then(result =>{    
        const postcount = result.length;
        const followers = result[0].PostedBy[0].followers.length;
        const followings = result[0].PostedBy[0].followings.length;

        res.render('profile', {result, postcount, followers, followings});
    }).catch(err=>{
        console.log(err)
    })
}catch(err){
    console.log(err)
}
});
router.get('/me/update', verify, async(req,res)=>{
    try{
    const id = req.user._id;
    await User.find({_id:id}).then(result => {
        res.render('userUpdate', {result})
    }).catch(err =>{
        console.log(err)
    })
}catch(err){
    console.log(err)
}
})
router.put('/me/update', verify,async(req,res)=>{
  try{
    const id = req.user._id
    await User.findOneAndUpdate({_id:id},{
        $set: {
            Username: req.body.username,
            image: req.body.img,
        }
    }).then(result=>{
        res.redirect('/home')
    }).catch(err=>{
        console.log(err)
    })
    }catch(err){
        console.log(err)
    }
})

router.get('/me/delete/:id', async(req,res)=>{
try{
    const id = req.params.id;
    await Post.findOneAndDelete({_id:id}).then(result=>{
         res.redirect('/me');
    }).catch(err=>{
        console.log('err: ', err)
    })
}catch(err){
    console.log(err)
}
})

router.get('/me/update/:id', async(req,res)=>{
    try{
    const id =req.params.id;
    await Post.find({_id: id}).then(result =>{
        res.render('update', {result})
    }).catch(err=>{
        console.log('err ', err)
    })
}catch(err){
    console.log(err)
}
})


router.put('/me/update/:id', async(req, res) => {
try{
    const id = req.params.id;
    await Post.findOneAndUpdate({_id:id},{
        $set: {
            title: req.body.title,
            desc: req.body.desc,
        }
    }).then(result=>{
        res.redirect('/home')
    }).catch(err=>{
        console.log(err)
    })
}catch(err){
    console.log(err)
}
});

router.get('/user/:id', verify, async(req,res)=>{
try{  
    const id = req.params.id;
    await Post.find({PostedBy: id}).populate('PostedBy').sort({createdAt: -1}).then(result =>{
        const postcount = result.length;
        const userId = req.user._id
        const followers = result[0].PostedBy[0].followers.length;
        const followings = result[0].PostedBy[0].followings.length;
        res.render('user', {result, postcount, followers, followings, id, userId});
    }).catch(err=>{
        console.log(err)
    })
}catch(err){
    console.log(err)
}
})

router.get('/user/:id/followers', async(req,res)=>{
    try{
        const id = req.params.id;
        await User.find({_id: id}).then(result => {
            const followers = result[0].followers
            console.log(followers)

            res.render('followers', { followers});
        }).catch(err=>{
            console.log(err)
        })
    }catch(err){
        console.log(err)
    }
})

router.get('/user/:id/followings', async(req,res)=>{
    try{
        const id = req.params.id;
        await User.find({_id: id}).then(result => {
            const followings = result[0].followings
            
            res.render('followings', { followings});
        }).catch(err=>{
            console.log(err)
        })
    }catch(err){
        console.log(err)
    }
})





router.put('/follow/:id', verify, async(req,res)=>{

    try{
    if(req.user._id !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.user._id);
            if(!user.followers.includes(req.user._id)){
                await user.updateOne({$push: { followers: req.user._id}})
                await currentUser.updateOne({$push: {followings: req.params.id}})
                res.redirect(`/user/${req.params.id}`)
            }else{
                if(user.followers.includes(req.user._id)){
                    await user.updateOne({$pull: { followers: req.user._id}})
                    await currentUser.updateOne({$pull: {followings: req.params.id}})
                    res.redirect(`/user/${req.params.id}`)
                }
            }
        }catch(err){
            res.status(500).send(err);
        }
}
}catch(err){
    console.log(err)
}
})




module.exports = router;