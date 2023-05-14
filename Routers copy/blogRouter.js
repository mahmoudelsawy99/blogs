const express = require("express");
const Blog = require("../Models/blog");
const bodyParser = require("body-parser");
const router = express.Router();
const path = require("path");
router.use(bodyParser.json());

const multer = require("multer");
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

router.post("/addBlog", upload.single("image"),bodyParser.urlencoded({ extended: false }),
  async (req, res) => {
    const blog = await Blog.create({
      title: req.body.title,
      body: req.body.body,
      tags: req.body.tags,
      image: req.file.filename,
    });
    res.send(blog);
    console.log("User created:", blog);
   }
);



router.get("/authorblog", async function (req, res) {
  let blogs = await Blog.find({authorId:"6456344ddf9464a67c7b751e"});
  if (blogs) {
    res.send(blogs);
  } else {
    res.status(404).send("not found");
  }
});

router.get("/editBlog/:id", async(req, res, next) => {
  let blog = await Blog.findOne({_id: req.params.id});
  

  res.render("editBlog", {blog: blog});
});


// route.get('/:id',async function(req,res)
// {
//     let user= await User.findOne({_id:req.params.id})
//     res.send(user);
// })

router.put("/update/:id", async function (req, res) {
  let blog = await Blog.findByIdAndUpdate(req.params.id,req.body);
  if (blog) {
    res.send(blog);
  } else {
    res.status(404).send("not found");
  }
});


module.exports = router;
