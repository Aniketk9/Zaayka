const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  photo: {         // will be in url form
    type: String, 
    required: true,
  },
   likes:[{type:ObjectId,ref:"User"}],
   comments:[{
    text:String,
    postedBy:{type:ObjectId,ref:"User"}
}],
  postedBy: {
    type: ObjectId,
    ref: "User",      //this refer to user model
  },
  category: {
    type: Number,
    required: true
  }
},{timestamps:true});

mongoose.model("Recipe", recipeSchema);