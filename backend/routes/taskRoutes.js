const express=require("express");
const {verifyToken,adminOnly}=require("../middlewares/authMiddleware");
const { getTasks, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist, getDashboardData, getUserDashboardData } = require("../controllers/taskController");

const router=express.Router();

//Task management routes
router.get("/dashboard-data",verifyToken,getDashboardData);
router.get("/user-dashboard-data",verifyToken,getUserDashboardData);
router.get("/",verifyToken,getTasks); //get all task {admin:all, user:assinged}
router.get("/:id",verifyToken,getTaskById); //get task by id
router.post("/",verifyToken,createTask); //create a task {admin only}
router.put("/:id",verifyToken,updateTask); //update task detail
router.delete("/:id",verifyToken,deleteTask); //delete a task {admin only}
router.put("/:id/status",verifyToken,updateTaskStatus); //update task status
router.put("/:id/todo",verifyToken,updateTaskChecklist); //update task check list

module.exports=router;
