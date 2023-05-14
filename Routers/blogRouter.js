const express = require("express");
const Blog = require("../Models/blog");
const bodyParser = require("body-parser");
const Author=require('../Models/author');
const router = express.Router();
const path = require("path");
router.use(bodyParser.json());
const cookieParser = require('cookie-parser');
const jwt = require ('jsonwebtoken');
// const localStorage = require('node-localstorage').localStorage;
const cookie = require("cookie");
const multer = require("multer");
const { title } = require("process");
const filestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log(req,file);
    cb(null, "./statics/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replaceAll(" ", ""));
  },
});
const upload = multer({ storage: filestorage });

router.get("/index", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../Front", "garden-index.html"));
});
router.get("/getBlogs", async function (req, res) {
  let blogs = await Blog.find();
  if (blogs) {
    res.send(blogs);
  } else {
    res.status(404).send("not found");
  }
});

router.get("/blogform", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../Front", "addblog.html"));
});

// router.post("/addBlog", upload.single("image"),bodyParser.urlencoded({ extended: false }),
//   async (req, res) => {
//     const blog = await Blog.create({
//       title: req.body.title,
//       body: req.body.body,
//       tags: req.body.tags,
//       image: req.file.filename,
//     });
//     // res.send(blog);
//     res.redirect("/author/authorblog");
//     console.log("User created:", blog);
//    }
// );



router.post("/addBlog", upload.single("image"),bodyParser.urlencoded({ extended: false }),
  async (req, res) => {
    let token = req.cookies.Kero;
    if (!token) {
      return res.status(401).send('Access denied. No token provided.');
    }

    try {
      let payload = jwt.verify(token, 'key');
      let authorId = payload.userId;

      const author = await Author.findById(authorId);
      if (!author) {
        return res.status(401).send('Access denied. Invalid token.');
      }

      const blog = await Blog.create({
        authorId: authorId,
        authorName: author.username,
        title: req.body.title,
        body: req.body.body,
        tags: req.body.tags,
        image: req.file.filename,
       });

      console.log("Blog created:", blog);
      res.redirect("/author/authorblog");
    } catch (err) { 
      console.error(err);
      res.status(401).send('Access denied. Invalid token.');
    }
  }
);


router.get("/authorblog", async function (req, res) {
  let token = req.cookies.Kero;
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    let payload = jwt.verify(token, 'key');
    let authorId = payload.userId;

    const author = await Author.findById(authorId);
    console.log(author.username);
    if (!author) {
      return res.status(401).send('Access denied. Invalid token.');
    }

    let blogs = await Blog.find({ authorId: authorId });
    console.log(authorId);
    if (blogs && blogs.length > 0) {
      res.send(blogs);
    } else {
      res.status(404).send("No blogs found for this author");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});




router.get("/editBlog/:id", async(req, res, next) => {
  let blog = await Blog.findOne({_id: req.params.id});
  

  res.render("editBlog", {blog: blog});
});


 

router.get('/getdata/:id',async function(req,res)
{
    let blog= await Blog.findOne({_id:req.params.id})
    res.send(blog);
})

// router.put("/update/:id", async function (req, res) {
//   let blog = await Blog.findByIdAndUpdate(req.params.id,req.body);
//   if (blog) {
//     res.send(blog);
//   } else {
//     res.status(404).send("not found");
//   }
// });


router.put("/update/:id", upload.single("image"), async function (req, res) {
  let blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).send("Blog not found");
  }

  try {
    blog.title = req.body.title || blog.title;
    blog.body = req.body.body || blog.body;
    blog.tags = req.body.tags || blog.tags;
    blog.image = req.file.filename|| blog.image;

    // if (req.file) {
    //   blog.image = req.file.filename;
    // }

    await blog.save();
    res.send(blog);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});




router.delete('/delete/:id',async function(req,res){
  let deleteData= await Blog.deleteOne({_id:req.params.id})
  res.send(deleteData);
})



 

// router.get('/search/:title', async (req, res) => {
//   try {
//     const title = req.params.title;
//     const blogs = await Blog.find({ title: { $regex: title, $options: 'i' } });
//     res.send(blogs);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });


router.get('/searchBlog/:title', function (req, res) {
  let token = req.cookies.Kero;
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    let payload = jwt.verify(token, 'key');
    let authorId = payload.userId;

    Blog.find({
      authorId: authorId,
      $or: [
        { title: { $regex: req.params.title, $options: 'i' } },
        { body: { $regex: req.params.title, $options: 'i' } },
        { tags: { $regex: req.params.title, $options: 'i' } },
        { authorName: { $regex: req.params.title, $options: 'i' } }

      ]
    }).then(function (blogs) {
      if (blogs.length > 0) {
        res.json(blogs);
      } else {
        res.status(404).json({ message: 'Blog not found' });
      }
    }).catch(function (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
  } catch (err) {
    console.error(err);
    res.status(401).send('Access denied. Invalid token.');
  }
});




router.get('/search/:title', async (req, res) => {
  try {
    const q = req.params.title;

    const blog = await Blog.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { body: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
        { authorName: { $regex: req.params.title, $options: 'i' } }
      ]
    });

    if (blog.length > 0) {
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// router.get('/searchGeneral/:title', async (req, res) => {
//   try {
//     const q = req.params.title;

//     const blog = await Blog.find({
//       $or: [
//         { title: { $regex: q, $options: 'i' } },
//         { body: { $regex: q, $options: 'i' } },
//         { tags: { $regex: q, $options: 'i' } }
//       ]
//     });

//     if (blog.length > 0) {
//       res.json(blog);
//     } else {
//       res.status(404).json({ message: 'Blog not found' });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });
    // res.json(blogs);  
  
 



module.exports = router;
