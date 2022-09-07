const mongoose =require('mongoose');
const Schema=mongoose.Schema;

const sizeSchema=new Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    name:{
        type:String,
        require:true
    },
    numberInStock:{
        type:Number,
        require:true,
        min:0,
        default:0
    }
},{timestamps:true})

module.exports=mongoose.model('Size',sizeSchema);