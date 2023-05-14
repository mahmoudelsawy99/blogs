require('./Config/connection');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express()
const cors=require('cors')
const path=require('path');
app.use(express.urlencoded({extended:true})); 
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'statics')))
app.use(cookieParser());

const blogRouter=require('./Routers/blogRouter');
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({extended:true})); 

app.use('/blog',blogRouter);


const authorRouter=require('./Routers/authorRouter');
app.use('/author',authorRouter);

// const multer= require('multer')

// const fileStorage= multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,'./uploads')}
//         ,
//         filename:(req,file,cb)=>{   
//             cb(null,Date.now(),file.originalname.replaceAll(" ",''))}
            
// })
// const upload=multer({storage:fileStorage});
// // const upload  = multer({dist: '/uploads'})

// app.post('/adding', upload.single('img'),(req,res)=>{
//     console.log(req.file);
//     res.send('ok')
// })




// app.get("/m",(req,res,next)=>
// {  
//      res.sendFile(path.join(__dirname,'./Front',"garden-index.html"))
//     })








// Author.create({username:"keroo",password:"12345",email:"kero@gmail.com"}).then(data=>{
//     console.log(data);
// }).catch(err=>console.log(err))




// let Blog=require('./Models/blog');
// Blog.create({authorId:"6456344ddf9464a67c7b751e",title:"maery",body:"node.js",tags:["hany","sawy","kero"],img:'profile'}).then(data=>{
//     console.log(data);
// }).catch(err=>console.log(err))







 













app.get('/', (req, res) => res.send('welcome back!'))
app.listen(3000, () => console.log(`Example app listening on port 3000`))