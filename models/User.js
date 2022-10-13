var mongoose=require('mongoose');
var Schema=mongoose.Schema;

const bcrypt=require('bcryptjs');

var User=new Schema({
    username:{
        type:String,
        required: true,
        unique:true,
        lowercase:true
    },
    email:{
        type:String,
        required: true,
        unique:true,
        lowercase:true
    },
    admin:{
        type:Boolean,
        default:false
    },
    password:{
        type:String,
        required: true
    }
},{timestamps:true})

User.pre('save',async function(next){
    try{
        // generate a salt
        // console.log('password ', this.password);
        const salt= await bcrypt.genSalt(10);
        // generate a password hash (salt + hash)
        const passwordHashed=await bcrypt.hash(this.password,salt);
        // re-assign password hashed
        // console.log("passwordHashed ",passwordHashed);
        this.password=passwordHashed;
        next();
    }
    catch(error){
        next(error)
    }
})

User.methods.isValidPassword=async function(newPassword){
        try{

          return  await bcrypt.compare(newPassword,this.password); // true false
        }
        catch(error){
            throw new Error(error);
        }
}

var mongooseDelete = require('mongoose-delete');
User.plugin(mongooseDelete,{deteledAt:true ,overrideMethods: true}) //, overrideMethods: true
module.exports= mongoose.model('User',User);