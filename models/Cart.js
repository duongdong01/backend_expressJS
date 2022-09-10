var mongoose=require('mongoose')
var Schema=mongoose.Schema;

const CartSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Product'
    },
    Size:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        default:1
    }

},{timestamps:true})

module.exports=mongoose.model("Cart",CartSchema)
