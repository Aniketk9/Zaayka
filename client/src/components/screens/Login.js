  // eslint-disable-next-line
  import React,{useState,useContext}  from "react";
  import {Link,useNavigate} from "react-router-dom";
  import { UserContext } from "../../App";
  import Logo from "../logo";
  import M from "materialize-css"

const Login=()=>{
  const {state,dispatch} = useContext(UserContext)
  const navigate = useNavigate();        /*instead of useHistory */
  const [password,setPassword]=useState("")
  const [email,setEmail]=useState("")

  const PostData=()=>{
  
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        M.toast({html:"invalid email",classes:"#c62828 red darken-3"})
        return 
    }
    fetch("/login",{
      method:"post",
      headers:{
          "Content-Type":"application/json"
      },
      body:JSON.stringify({
          password,
          email

      })
  }).then(res=>res.json())
  .then(data=>{
     if(data.error){
      M.toast({html:data.error,classes:"#c62828 red darken-3"})
     }
     else {
      localStorage.setItem("jwt",data.token)
      localStorage.setItem("user",JSON.stringify(data.user))
      M.toast({html:"success",classes:"#43a047 green darken-1"})
      navigate('/');
      window.location.reload();
     }
  }).catch(err=>{
      console.log(err)
  })
  
    
}
    return (
        <div className="mycard">
         <div className="card auth-card input-field bg-body">
              <Logo/>
            <h2>Zaayka</h2>
         
            <input
            className="ip"
            
            type="text"
            placeholder="Email"  
            value={email}
              onChange={(e)=>setEmail(e.target.value)}          
            />
            <input
           className="ip"
            type="password"
            placeholder="Password"
            value={password }
              onChange={(e)=>setPassword(e.target.value)}
            />
           
            
        <button onClick={()=>PostData()} className="btn waves-effect waves-light #64b5f6 blue darken-1">
              Login
                 </button>
             
            <h5>
                <Link to="/signup">Dont have an account ?</Link>
                <br/>
                <Link to="/reset">Forgot Password ?</Link>
            </h5>
            </div>
      </div>
    )
}

export default Login;