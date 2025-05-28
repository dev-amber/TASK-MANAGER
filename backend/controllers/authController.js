const User=require("../models/User");
const bcryptjs=require("bcryptjs");
const jwt=require("jsonwebtoken");



const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // Payload containing the user ID
    process.env.JWT_SECRET, // Secret key from environment variables
    { expiresIn: '80d' } // Token expiration set to 80 days
  );
};

//@desc Register a new user
//@route POST /api/auth/register
//@access Public
const registerUser=async(req,res)=>{
   try {
    const {name,email,password,profileImageUrl,adminInviteToken}=req.body;

    //check if user already exist
    const userExists=await User.findOne({email});
    if(userExists){
      return res.status(400).json({message:"User already exist"});
    }
    //Determine user role:Admin if correct token is provided, otherwise member
    let role="member";
    if(
        adminInviteToken &&
        adminInviteToken== process.env.ADMIN_INVITE_TOKEN
    ){
        role= "admin";
    }
    // hashed password
    const salt=await bcryptjs.genSalt(10);
    const hashedpassword=await bcryptjs.hash(password,salt);

    //create new user
    const user=await User.create({
        name,
        email,
        password:hashedpassword,
        profileImageUrl,
        role,

    });

    //Return user data with jwt
    res.status(200).json({
        _id: user._id,
        name:user.name,
        email:user.email,
        role:user.role,
        profileImageUrl:user.profileImageUrl,
        token:generateToken(user._id),

    });
   } catch (error) {
    res.status(500).json({message:"Server error",error: error.message});
   }
}

//@desc Login user
//@route POST /api/auth/login
//@access Public
const loginUser=async(req,res)=>{
    try {
    const {email,password}=req.body;

    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"invalid email or password"});
    }
    //compare password
    const isMatch=await bcryptjs.compare(password,user.password);
    if(!isMatch){
        return res.status(401).json({message:"invalid email or password"});
    }

    //return user data with jwt
    res.json({
        _id: user._id,
        name:user.name,
        email:user.email,
        role:user.role,
        profileImageUrl:user.profileImageUrl,
        token:generateToken(user._id),
    });

    } catch (error) {
     res.status(500).json({message:"Server error",error: error.message});
    }
 }
 

//@desc Get user Profile
//@route POST /api/auth/profile
//@access Private (REquire jwt)
const getUserProfile=async(req,res)=>{
    try {
    const user=await User.findById(req.user.id).select("-password");
    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    res.json(user);
    } catch (error) {
     res.status(500).json({message:"Server error",error: error.message});
    }
 }
 

//@desc Update user profile
//@route POST /api/auth/profile
//@access Private (Requires JWT)
const updateUserProfile=async(req,res)=>{
    try {
    const user=await User.findById(req.user.id);
    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    user.name=req.body.name || user.name;
    user.email=req.body.email || user.email;
    if(req.body.password){
   const salt=await bcryptjs.genSalt(10);
   user.password=await bcryptjs.hash(req.body.password,salt);
    }
    const updateUser=await user.save();
    res.json({
        _id: updateUser._id,
        name:updateUser.name,
        email:updateUser.email,
        role:updateUser.role,
        profileImageUrl:user.profileImageUrl,
        token:generateToken(updateUser._id),
    });
    } catch (error) {
     res.status(500).json({message:"Server error",error: error.message});
    }
 }
 

module.exports={registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile};



