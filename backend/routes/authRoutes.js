const express=require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require("../controllers/authController");

const { verifyToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router=express.Router();

//Auth route
router.post("/register",registerUser);  //Register User
router.post("/login",loginUser);  //Login User
router.get("/profile",verifyToken,getUserProfile);  //Get User Profile
router.put("/profile",verifyToken,updateUserProfile);  //Update Profile

router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
  
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
  });
  

module.exports=router;
