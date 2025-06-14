import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import Input from '../../components/Inputs/Input';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadimage';

const Signup = () => {
  const[profilePic,setProfilePic]=useState(null);
  const[fullName,setFullName]=useState("");
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[adminvitetoken,setAdminInviteToken]=useState("");

  const [error,setError]=useState(null);

 const {updateUser}=useContext(UserContext);
 const navigate=useNavigate();

   //handle signup form submit
    const handleSignUp=async(e)=>{
   e.preventDefault();

 let profileImageUrl= ""
  
   if(!fullName){
    setError("Please enter a full name");
    return;
   }
   if(!validateEmail(email)){
    setError("Please enter a valid email address");
    return;
   }
  
   if(!password){
    setError("Please enter the password");
    return;
   }
  
   setError("");
  
   //signUp API call
   try {

    //upload image if present
    if(profilePic){
      const imguploadRes=await uploadImage(profilePic);
      profileImageUrl= imguploadRes.imageUrl || "";
    }
    const response=await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
      name:fullName,
      email,
      password,
      adminvitetoken,
      profileImageUrl,
    });
    

    const {token,role}=response.data;

    if(!token){
      localStorage.setItem("token",token);
      updateUser(response.data);
    }

    //redirect based on role
    if(role === "admin"){
      navigate("/admin/dashboard");
    }else{
      navigate("/user/dashboard");
    }
 } catch (error) {
     if(error.response && error.response.data.message){
      setError(error.response.data.message);
     }else{
      setError("Something went wrong. please try again");
     }
 }

  }


  return (
    <AuthLayout>
     <div className='lg:w-[100% h-auto md:h-full mt-10 flex flex-col justify-center'>
    <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
    <p className='text-xs text-slate-700 mt-[5px] mb-6'>
      Join us today by entering your details below.
    </p>

    <form onSubmit={handleSignUp}>
      <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Input   //we import the input bcz we make seperate file
        value={fullName}
        onChange={({target })=> setFullName(target.value)}
        label="Full Name"
        placeholder='john'
        type='text'
        />
         <Input
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                label="Email Address"
                 placeholder="john@example.com"
                 type="text"
              
                />
        
        <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
                 placeholder="Min 8 character"
                 type="password"
              
                />

<Input
                value={adminvitetoken}
                onChange={({ target }) => setAdminInviteToken(target.value)}
                label="Admin invite Token"
                 placeholder="6 Dig Code"
                 type="text"
              
                />
                </div>

{error && <p className='text-red-700 text-xs pb-2.5'>{error}</p>}

<button className='btn-primary' type='submit'>
 SIGN UP
 </button>

 <p className='text-[13px] text-slate-800 mt-3'>
  Already  an account? {""}
   <Link className='font-medium text-primary underline 'to="/login" >
   Login
   </Link>
 </p>
     
    </form>
     </div>
    </AuthLayout>
  )
}

export default Signup 