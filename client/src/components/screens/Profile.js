import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import {DefaultPlayer as Video} from "react-html5video"
import "react-html5video/dist/styles.css"

const Profile = () => {
    const [mypics, setPics] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const [image,setImage] = useState("")

    useEffect(() => {
        fetch("/myrecipe", {
            headers: {
            "Authorization": "Bearer " + localStorage.getItem("jwt")
        }
        }).then(res => res.json())
        .then(result => {
            console.log(result);
            setPics(result.myrecipe)
            
        })
}, [])

useEffect(()=>{
    if(image){
     const data = new FormData()
     data.append("file",image)
     data.append("upload_preset","zaayka")
     data.append("cloud_name","dkp8phxth")
     fetch("https://api.cloudinary.com/v1_1/dkp8phxth/image/upload",{
         method:"post",
         body:data
     })
     .then(res=>res.json())
     .then(data=>{
 
    
        fetch('/updatepic',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                pic:data.url
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
            dispatch({type:"UPDATEPIC",payload:result.pic})
            window.location.reload()
        })
    
     })
     .catch(err=>{
         console.log(err)
     })
    }
 },[image])
 const updatePhoto = (file)=>{
     setImage(file)
 }

return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>

        <div style={{  //for upper div(dp and name)
            display: "flex",
            justifyContent: "space-around",
            margin: "20px 0px",

        }}>

            {/* dp part */}
            <div>
                <img style={{ width: "160px", height: "160px", borderRadius: "80px", margin: "0px 0px" }}
                    src={state?state.pic:"loading.."}
                />

                {/* name part */}
            </div>
            <div>
                <h4>{state ? state.name : "loading"}</h4>
                <h5>{state ? state.email : "loading"}</h5>
                <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                <h6>{mypics.length} recipes</h6>
                       <h6>{state?state.followers.length:"0"} followers</h6>
                       <h6>{state?state.following.length:"0"} following</h6>
                </div>
            </div>
        </div>

         <div className="file-field input-field" style={{margin:"10px"}}>
            <div className="btn #64b5f6 blue darken-1">
                <span>Update pic</span>
                <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            </div>  

        {/* for pic uploaded part */}
        <div className="gallery">
            {
                mypics.map(item => {
                    return (
                        <Video key={item._id} className="item">
                               <source  src={item.photo} alt={item.title} type="video/webm" />
                        </Video>
                    )
                })
            }
        </div>
    </div>
)
}

export default Profile;