const mongoose=require('mongoose');
const User = require('../models/User');
const OrderItem = require('../models/OrderItem');
const Order = require('../models/Order');
const JWT =require('jsonwebtoken');
const {JWT_SECRET}=require('../config/index')

// const User=require('../models/user');

const encodeToken=(userId)=>{
    return JWT.sign({
        iss:"Duong",
        sub:userId,  // sub 1 truong duy nhat phan biet cac user
        iat:new Date().getTime(),
        exp:new Date().setDate(new Date().getDate() +7)  // set thoi gian het han token

    },JWT_SECRET)
};

 const signUp =async (req,res,next)=>{
        const { username,email,admin, password}=req.body;
        // check if there is o user with the some user
        const foundUser=await User.findOne({email});
        console.log(foundUser);
        if(foundUser) return res.status(403).json({error:{message: "Email is already in use"}})
        const newUser=new User({username,email,admin,password});
        console.log("new User", newUser);
        newUser.save().then(()=>{
            console.log('thanh cong');
        }).catch((error)=>{
            console.log(error);
        });
        const token=encodeToken(newUser._id);
        res.setHeader('Authorization',token);
        return res.status(201).json({success:true})

    };

 const signin =async (req,res,next)=>{
    // assign a token
    const token =encodeToken(req.user._id) ; // user nay duoc nhan tu ben passport o ham done
    res.setHeader('Authorization',token);
    // console.log(req.user);
    return res.status(200).json({success :true,token:token,info:req.user});
};

 const secret =async (req,res,next)=>{  
   const users=await User.findById(req.user._id);
//    console.log(users);

    return res.status(200).json({resourse:true,_id:users._id,username:users.username})
};

const getUser= async (req,res,next)=>{
    try{

        const users=await User.find({}).lean()
        // console.log(users)
        res.status(200).json({success:true,users,total:users.length})
    }catch(error){
        next(error)
    }
}

const getUserBin= async (req,res,next)=>{
    try{

        const users = await User.findWithDeleted({deleted:true}).lean()
        // console.log(users)
        res.status(200).json({success:true,users,total:users.length})
    }catch(error){
        next(error)
    }
}
const deleteUser = async(req, res, next)=>{
    try{
        const {_id} ={...req.body}
        // console.log("_id ",_id)
        await User.delete({_id:_id})
        const orderId= await Order.find({user:_id})
        await OrderItem.delete({order: { $in: orderId}})
        await Order.delete({user:_id})
        res.status(200).json({success:true})
    }catch(error){
        next(error)
    }
}

const restoreUser= async (req,res,next)=>{
        try{
                const {_id}= {...req.body}
                await User.restore({_id:_id,deleted:true})
                // const user= await User.find({_id})
                const orderId= await Order.find({user:_id})
                await OrderItem.restore({order: {$in:orderId }})
                await Order.restore({user:_id})
            res.status(200).json({success:true})
        }catch(error){
            next(error)
        }
}
module.exports={
    signUp,
    signin,
    secret,
    getUser,
    deleteUser,
    getUserBin,
    restoreUser
};