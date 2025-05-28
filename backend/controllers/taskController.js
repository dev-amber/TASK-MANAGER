const Task=require("../models/Task");


//@desc get all tasks {admin:all, User:only assinged tasks}
//@route Get /api/tasks/
//@access Private
const getTasks=async(req,res)=>{
    try {
        const {status}=req.query;
        let filter={};
        
        if(status){
         filter.status=status;
        }
 
        let tasks;
        if (req.user.role === "admin") {
            tasks = await Task.find(filter)
                .populate("assignedTo", "name email profileImageUrl");
        } else {
            tasks = await Task.find({ ...filter, assignedTo: req.user._id })
                .populate("assignedTo", "name email profileImageUrl");
        }
        
        // Add completed todoCheckList count to each task
        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoCheckList.filter(
                    (item) => item.completed
                ).length;
                return { ...task._doc, completedTodoCount: completedCount };
            })
        );
        
        //status summary counts
        const allTasks=await Task.countDocuments(
         req.user.role === "admin" ? {} :{assignedTo:req.user._id}
        );
 
        const pendingTasks=await Task.countDocuments({
         ...filter,
         status:"Pending",
         ...(req.user.role !== "admin" && {assignedTo :req.user._id}),
        });
      
        const inProgressTasks=await Task.countDocuments({
         ...filter,
         status:" In Progress",
         ...(req.user.role !== "admin" && {assignedTo :req.user._id}),
        });
 
        const completedTasks=await Task.countDocuments({
         ...filter,
         status:"Completed",
         ...(req.user.role !== "admin" && {assignedTo :req.user._id}),
        });
 
        res.json({
         tasks,
         statusSummary: {
            all: allTasks,
            pending: pendingTasks,
            inProgress: inProgressTasks,
            completed: completedTasks,
        },
        });
 
     } catch (error) {
    res.status(500).json({message:"Server error",message:error.message});
}
}

//@desc get task by ID
//@route Get /api/tasks/:id
//@access Private
const getTaskById=async(req,res)=>{
    try {
        const task=await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );

        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        res.json(task);
        
    } catch (error) {
        return res.status(500).json({message:"Server error",error: message.error});
    }
}

//@desc create a task
//@route POST /api/tasks/
//@access Private {admin}
const createTask=async(req,res)=>{
    try {
       const{
        title,
        description,
        priority,
        dueDate,
        assignedTo,
        attachments,
        todoCheckList,
           } =req.body;

         if(!Array.isArray(assignedTo)){
            return res.status(400).json({message:"assignedTo must be an array of user IDs"});
         }  

         const task=await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoCheckList,
         });
         res.status(201).json({message:"task created successfully",task});
    } catch (error) {
        return res.status(500).json({message:"Server error",error:error.message});
    }
}

//@desc update a task
//@route PUT /api/tasks/:id
//@access Private
const updateTask=async(req,res)=>{
    try {
        const task=await Task.findById(req.params.id);

        if(!task){
            return res.status(404).json({message:"Task not found"});
        }

        task.title=req.body.title || task.title;
        task.description=req.body.description || task.description;
        task.priority=req.body.priority|| task.priority;
        task.dueDate=req.body.dueDate || task.dueDate;
        task.todoCheckList=req.body.todoCheckLis || task.todoCheckList;
        task.attachements=req.body.attachements || task.attachements;
        
        if(req.body.assignedTo){
            if(!Array.isArray(req.body.assignedTo)){
                return res.status(400).json({message:"assignedTo must be an array of user IDs"});
            }
            task.assignedTo=req.body.assignedTo;
        }

        const updatedTask=await task.save();
        res.status(200).json({message:"Task updated successfully",updatedTask});

    } catch (error) {
        return res.status(500).json({message:"Server error",message: error.message});
    }
}

//@desc delete a task
//@route DELETE /api/tasks/:id
//@access Private {admin}
const deleteTask=async(req,res)=>{
    try {
        const task=await Task.findById(req.params.id);

        if(!task){
            return res.status(404).json({message:"Task not found"});
        }

        await task.deleteOne();
        res.json({message:"Task deleted successfully"});
    } catch (error) {
        return res.status(500).json({message:"Server error",error: message.error});
    }
}

//@desc update task status
//@route  PUT /api/tasks/:id/status
//@access Private
const updateTaskStatus=async(req,res)=>{
    try {
        const task=await Task.findById(req.params.id);
        
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }

        const isAssigned=task.assignedTo.some(
            (userId) =>userId.toString() === req.user._id.toString()
        );

        if(!isAssigned && req.user.role !== "admin"){
            return res.status(403).json({message:"Not authorized"});
        }

        task.status=req.body.status || task.status;

        if(task.status === "Completed"){
            task.todoCheckList.forEach((item)=>(item.completed =true));
            task.progress =100;
        }
        await task.save();
        res.json({message:"Task status updated",task});
    } catch (error) {
        return res.status(500).json({message:"Server error",error: message.error});
    }
}

//@desc update task checklist
//@route PUT /api/tasks/:id/todo
//@access Private
const updateTaskChecklist=async(req,res)=>{
    try {
       const {todoCheckList}=req.body;
       const task=await Task.findById(req.params.id);
       if(!task){
        return res.status(404).json({message:"Task not found"});
    }

    if(!task.assignedTo.includes(req.user._id) && req.user.role !== "admin"){
        return res.status(403).json({message:"Not authorized to update checklist"});
    }

    task.todoCheckList=todoCheckList; //REplace with update checlklist
    
    //auto-update progress based on checklist completion
    const completedCount=task.todoCheckList.filter(
        (item) =>item.completed
    ).length;
    const totalItems=task.todoCheckList.length;
    task.progress=
    totalItems > 0 ? Math.round((completedCount /totalItems) + 100) : 0;
      
    //auto-mark task as completed if all items are checked
    if(task.progress === 100){
        task.status="Completed";
    }else if(task.progress > 0){
      task.status = "In Progress";
    }else{
        task.status= "Pending";
    }

    await task.save();
    const updatedTask=await Task.findById(req.params.id).populate(
        "assignedTo",
        "name email profileImageUrl"
    );
    res.json({message:" Task checklist updated",updatedTask});
    
    } catch (error) {
        return res.status(500).json({message:"Server error",message: error.message});
    }
}

//@desc dashboard data {admin only}
//@route GET /api/tasks/dashboard-data
//@Access Private
const getDashboardData=async(req,res)=>{
    try {
        //fetch statistics
        const totalTasks=await Task.countDocuments();
        const pendingTasks=await Task.countDocuments({status: "Pending"});
        const completedTasks=await Task.countDocuments({status:"Completed"});
        const overdueTasks=await Task.countDocuments({
            status: {$ne :"Completed"},
            dueDate: {$lt: new Date()},
        });

        //ensure all possible status are in cluded
        const taskStatuses=["Pending", "In Progress", "Completed"];
        const taskDisturbutionRow=await Task.aggregate([
            {
                $group:{
                    _id: "$status",
                    count: {$sum: 1},
                },
            },
        ]);
        const taskDisturbution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s*/g, ""); // Corrected regex to remove spaces
            acc[formattedKey] =
              taskDisturbutionRow.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDisturbution["All"] =totalTasks; //add total count to taskDisturbution
        
        //ensure all pirority ;levels are in cluded
        const taskPriorities=["Low","Medium","High"];
        const taskPriorityLevelRow=await Task.aggregate([
            {
                $group:{
                    _id:"$priority",
                    count :{$sum :1}
                },
            },
        ] );

        const taskPriorityLevels=taskPriorities.reduce((acc,priority)=>{
            acc[priority]=
            taskPriorityLevelRow.find((item)=> item._id === priority)?.count  || 0;
            return acc;
        },{});

        //fetch recent 10 task
        const recentTasks=await Task.find()
        .sort({createdAt : -1})
        .limit(10)
        .select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics:{
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts:{
                taskDisturbution,
                taskPriorityLevels,
            },
            recentTasks,
        })
        
    } catch (error) {
        return res.status(500).json({message:"Server error",message: error.message});
    }
}

//@desc user dashboard data {user-sepecified}
//@route GET /api/tasks/user-dashboard-data
//@access Private
const getUserDashboardData=async(req,res)=>{
    try {
        const userId = req.user._id; // Only fetch data for logged-in user

        // Fetch statistics for user-specific tasks
        const totalTasks = await Task.countDocuments({ assignedTo: userId });
        const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "Pending" });
        const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "Completed" });
        const overdueTasks = await Task.countDocuments({
            assignedTo: userId,
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() },
        });
        
        // Task distribution by status
        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributionRow = await Task.aggregate([
            { $match: { assignedTo: userId } },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);
        
        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s*/g, ""); // Remove spaces
            acc[formattedKey] =
                taskDistributionRow.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});
        
        taskDistribution["All"] = totalTasks; // Add total count
        
        // Ensure all priority levels are included
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelRow = await Task.aggregate([
            { $match: { assignedTo: userId } },
            { $group: { _id: "$priority", count: { $sum: 1 } } },
        ]);
        
        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] =
                taskPriorityLevelRow.find((item) => item._id === priority)?.count || 0;
            return acc;
        }, {});
        
        // Fetch recent 10 tasks for logged-in user
        const recentTasks = await Task.find({ assignedTo: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");
        
        res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });
        


    } catch (error) {
        return res.status(500).json({message:"Server error",message: error.message});
    }
}

module.exports={
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData,
};
