const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const mongoose = require('mongoose');
const cloudinary = require('cloudinary')
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override')

mongoose.connect(`mongodb+srv://user:${process.env.mongodbPsw}@cluster0.lpki6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, (err, result) => {
    try{
        console.log('mongodb ishlamoqda!')
    }catch(err){
        console.log(err)
    }
})

app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('./static/'));
app.use(fileUpload({useTempFiles: true}));
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')

cloudinary.config({
    cloud_name :'file-upload',
    api_key: process.env.cloudinarykey,
    api_secret:process.env.cloudinarysecret 
});
app.use('/', require('./routers/home'));

app.use('/auth/', require('./routers/auth'))
app.use((req, res, next)=>{
    res.redirect('/auth/login')
})


app.listen(port , ()=> console.log('> Server is up and running on port : ' + port))