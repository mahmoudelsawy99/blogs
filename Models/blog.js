const { strict } = require('assert');
const mongoose = require('mongoose');
const{ Schema} = mongoose;
const blogSchema=mongoose.Schema({

    authorId:{type:Schema.Types.ObjectId,ref: 'author'
        },
        authorName:{
            type:String,
        },
    title:{
        type:String,
  
    },

    body:
    {
        type:String,
      },
    tags:
    {
       type: [String]
 },
 image:{
    type:String,
 }
})


const Blog=mongoose.model('blog',blogSchema)
module.exports=Blog;