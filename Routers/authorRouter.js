const express = require('express')
const Author=require('../Models/author');
const bodyParser = require('body-parser');
const router=express.Router();
const path=require('path');
router.use(bodyParser.json());
const cookieParser = require('cookie-parser');
const jwt = require ('jsonwebtoken');
// const localStorage = require('node-localstorage').localStorage;
const cookie = require("cookie");


 
 
router.get("/",function(req,res)
{
     res.sendFile(path.join(__dirname,'../Front',"signup.html"));
})

router.get("/login",function(req,res)
{
     res.sendFile(path.join(__dirname,'../Front',"login.html"));
})
router.get("/authorblog",function(req,res)
{
     res.sendFile(path.join(__dirname,'../Front',"garden-category.html"));
})
router.get("/m",function(req,res)
{

  const token = req.cookies.token;

  console.log(token);
     res.sendFile(token)
     

})


router.post("/log", async function (req, res) {
  
  try{
    let author = await Author.findOne({
      username: req.body.username,
      password: req.body.password,
    });
    // if (author) { 
    //   // res.send("login success");
    // } else {
      //   // res.send("login failed");
      // }
      
      if (author) {
        let payload = { userId: author._id };
        console.log(payload);
        let token = jwt.sign(payload, "key");
        console.log(token);

        res.cookie('Kero', token, { maxAge: 9000000, httpOnly: true });
        res.redirect("/author/authorblog")
        // res.redirect('/Front/blogs.html');
    } else {
      res.status(401).send('Invalid email or password');
    }} catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }

  
//   if (author) {  
//     let payload = { _id: author._id };  
    
//     // localStorage.setItem('token', jsonwebtoken.sign(payload, "key"));  
//     localStorage.setItem('token', 'key');

//     res.status(200).redirect('/Front/blogs.html');     
//   } else {        
//     res.status(401).send('Invalid email or password');
//   }     
// } catch (err) {         
//   console.error(err);         
//   res.status(500).send('Internal server error');   
// }


})


router.post('/signup',  async (req, res)=> {
  
      const author =  await Author.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });
    //   res.send(author)
      console.log('User created:', author);
      res.redirect('/author/login');
  });

 
router.get('/protected', function (req, res) {
  let token = req.cookies.Kero;
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    let payload = jwt.verify(token, 'key');
    let userId = payload.userId;
    // Use the userId to retrieve the corresponding Author record from the database
    // ...
    res.send(`Protected content for user ${userId}`);
  } catch (err) { 
    console.error(err);
    res.status(401).send('Access denied. Invalid token.');
  }
});
module.exports=router;