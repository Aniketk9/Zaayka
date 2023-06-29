import React,{useEffect,useState,useContext}  from "react";
import { UserContext } from "../../App";
import {Params, useParams} from "react-router-dom";
import {DefaultPlayer as Video} from "react-html5video"
import "react-html5video/dist/styles.css"

const Profile=()=>{
    const [userProfile,setProfile] = useState(null)
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showfollow,setShowFollow] = useState(true)
    console.log(userid)
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            setProfile(result)
        })
    },[])

    const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
        
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
             setProfile((prevState)=>{
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:[...prevState.user.followers,data._id]
                        }
                 }
             })
             setShowFollow(false)
        })
    }
    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
            
             setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item != data._id )
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:newFollower
                        }
                 }
             })
             setShowFollow(true)
             
        })
    }

    return (
        <>
        {userProfile? 
 <div style={{maxWidth:"550px",margin:"0px auto"}}>
       
     <div  style={{  //for upper div(dp and name)
         display:"flex",
         justifyContent:"space-around",
         margin:"20px 0px",
           }}>

               {/* dp part */}
                 <div>  
                     <img style={{width:"160px",height:"160px",borderRadius:"80px", margin:"0px 0px"}} 
                          src={userProfile.user.pic}
                     />
             
                     {/* name part */}
                 </div>  
                       <div> 
                                <h4>{userProfile.user.name}</h4>
                                <h5>{userProfile.user.email}</h5>
                                    <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}> 
                                    <h6>{userProfile.recipes.length} </h6>
                                     <h6>{userProfile.user.followers.length} followers</h6>
                                     <h6>{userProfile.user.following.length} following</h6>
                                     </div>
                {showfollow?
                   <button style={{
                       margin:"10px"
                   }} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>followUser()}
                    >
                        Follow
                    </button>
                    : 
                    <button
                    style={{
                        margin:"10px"
                    }}
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>unfollowUser()}
                    >
                        UnFollow
                    </button>
                    }
                        </div>
         </div>


               {/* for pic uploaded part */}
                     <div className="gallery">
                        {
                           userProfile.recipes.map(item=>{
                           return(
                            <Video key={item._id} className="item">
                               <source  src={item.photo} alt={item.title} type="video/webm" />
                        </Video>
                           )
                           })
                         } 
                     </div>
               

</div>
        
      :<h2>loading</h2>}
       
</>
    )
}

export default Profile;