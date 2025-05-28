import React, { useState } from 'react'
import {FaRegEye, FaRegEyeSlash} from "react-icons/fa6"
export const Input = ({value, onChange,label, placeholder,type}) => {
const [showpassword,setShowPassword]=useState(false);

const toggleShowPassword=()=>{
    setShowPassword(!showpassword);
}
  return(
  <div>
 <label className='text-[13px] text-slate-800'>{label}</label>
 <div className='input-box'>
    <input
    type={type == 'password' ? showpassword ? 'text' : 'password' :'type' }// this line means when user click it show or hide the password
    placeholder={placeholder}
    className='w-full bg-transparent outline-none'
    value={value}
    onChange={(e)=> onChange(e)}
    
    />

    {type === "password" && (
        <>
        {showpassword ? (
            <FaRegEye
            size={22}
            className='text-primary cursor-pointer'
            onClick={()=> toggleShowPassword()}
            />
        ):(
           <FaRegEyeSlash
           size={22}
           className='text-slate-400 cursor-pointer'
           onClick={()=> toggleShowPassword()}
           />

        )}
        </>
    
    )}

 </div>
  </div>
  )
}
export default Input;
