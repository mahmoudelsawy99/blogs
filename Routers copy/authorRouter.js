const express = require('express')
const Author=require('../Models/author');
const bodyParser = require('body-parser');
const router=express.Router();
const path=require('path');
router.use(bodyParser.json());
 
 
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



router.post("/log", async function (req, res) {
  
    let author = await Author.findOne({
      username: req.body.username,
      password: req.body.password,
    });
    if (author) {
      // res.send("login success");
      res.redirect("/author/authorblog")
    } else {
      // res.send("login failed");
    }
});

router.post('/signup',  async (req, res)=> {
  
      const author =  await Author.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });
      res.send(author)
      console.log('User created:', author);
      res.redirect('/author/login');
  });


module.exports=router;