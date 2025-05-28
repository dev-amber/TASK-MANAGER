const express=require("express");
const {verifyToken,adminOnly}=require("../middlewares/authMiddleware");
const { exportTasksReport, exportUsersReport } = require("../controllers/reportController");

const router=express.Router();

router.get("/export/tasks",verifyToken,adminOnly,exportTasksReport);  //export all task as excel/PDF
router.get("/export/users",verifyToken,adminOnly,exportUsersReport); //export user-task report

module.exports=router;