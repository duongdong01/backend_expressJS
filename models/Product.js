const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const productSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        default:5,
        min:1,
        max:5
    },
    category:{
        type:String
    },
    images:{
        type:[String],
        default:[]
    },
    price:{
        type:Number,
        min:0,
        required:true
    },
    originalPrice: {
        type: Number,
        min: 0,
        required: true
    },
    sold:{
        type:Number,
        default:0,
    },
    view:{
        type:Number,
        default:0
    },
    subject:{
        type:Boolean,
        required:true
    }
},{timestamps:true});
productSchema.index({ name: 'text', description: 'text', category: 'text' })
module.exports=mongoose.model('Product',productSchema);