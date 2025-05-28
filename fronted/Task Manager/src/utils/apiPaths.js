export const BASE_URL="http://localhost:8000"

export const API_PATHS={
AUTH:{
    REGISTER:"/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
},

USERS:{
    GET_ALL_USERS: "/api/users",
    GET_USER_BY_ID: (userId)=>  `/api/users/${userId}`,
    CREATE_USER: "/api/users",
    UPDATE_USER:  (userId)=>`/api/users/${userId}`,
    DELETE_USER:  (userId)=>`/api/users/${userId}   `,
},

TASKS:{
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data",
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data",
    GET_ALL_TASKS: "/api/tasks",
    GET_ALL_TASKS_BY_ID: (taskId)=> `/api/tasks/${taskId}`,
    CREATE_TASK: "/api/tasks",
    UPDATE_TASK: "/api/tasks/dashboard-data",
    DELETE_TASK: "/api/tasks/dashboard-data",

    UPDATE_TASK_STATUS: (taskId) =>   `/api/tasks/${taskId}`,
    UPDATE_TODO_CHECKLIST:   (taskId) =>  `/api/tasks/${taskId}`,
},

REPORTS:{
    EXPORT_TASKS: "/api/reports/export/tasks",
    EXPORT_USERS:  "/api/reports/export/users",
},

IMAGE:{
    UPLOAD_IMAGE:  "/api/auth/upload-image",
},
}