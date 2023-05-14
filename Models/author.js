const { strict } = require('assert');
const mongoose = require('mongoose');
const authorSchema=mongoose.Schema({
    

username:{
    type:String,
  },
password:{
    type:String,
 },
email:{
    type:String,
 }, 
blogs:{
    type:[Object]
},
})
const Author=mongoose.model('author',authorSchema)
module.exports=Author;
