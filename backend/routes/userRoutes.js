const express=require("express");
const { verifyToken, adminOnly } = require("../middlewares/authMiddleware");
const { getUsers, getUserById } = require("../controllers/userController");

const router=express.Router();

//user management routes
router.get("/",verifyToken,getUsers); //get all user(admin only)
router.get("/:id",getUserById); //get user for sepecific id


module.exports=router;                                                                                                                                                                         