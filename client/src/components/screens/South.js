import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../App';
import { Link } from "react-router-dom";
import { DefaultPlayer as Video } from "react-html5video"
import "react-html5video/dist/styles.css"
import M from "materialize-css"
import Menu from "./Menu"

const South = () => {
    const [data, setData] = useState([])
    const [commentValue, setcommentValue] = useState("")
    const { state, dispatch } = useContext(UserContext)
    useEffect(() => {
        fetch('/getsouth', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                setData(result.recipes)
            })
    }, [])

    const likePost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result;
                    }
                    else {
                        return item;
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {

                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result;
                    }
                    else {
                        return item;
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result;
                    }
                    else {
                        return item;
                    }
                })
                setData(newData)
                setcommentValue("")
            }).catch(err => {
                console.log(err)
            })
    }

    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData)
            })
    }

    const deleteComment = (postId,commentId)=>{
        fetch(`/deletecomment/${postId}/${commentId}`,{
          method:"delete",
          headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
          }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result);
          const newData = data.map(item=>{
            if(item._id===result._id){
              result.postedBy=item.postedBy;
              return result
            }
            else{
              return item
            }
        })
        setData(newData);
        M.toast({ html: "Comment Deleted Successfully", classes: "#388e3c green darken-1" });
      })
      }
    return (

       <div>
        <Menu/>
        <div className="home">
            {
                data.map(item => {
                    return (
                       
                        <div className="card home-card" key={item._id}>
                            <h5><img className="circle" style={{height:'36px',width:'43px',float:'left'}}src={item.postedBy.pic}/> <Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"} >{item.postedBy.name}</Link> {item.postedBy._id == state._id
                                && <i className="material-icons" style={{
                                    float: "right"
                                }}
                                    onClick={() => deletePost(item._id)}
                                >delete</i>
                            }</h5>
                            {/* 2 div (1. image & 2.caption) */}
                            <div className="card-image">
                                <Video loop muted autoPlay="autoPlay">
                                    <source src={item.photo} type="video/webm" />
                                </Video>
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{ color: "red" }}>favorite</i>
                                {item.likes.includes(state._id)
                                    ?
                                    <i className="material-icons" onClick={() => { unlikePost(item._id) }}>thumb_down</i>
                                    :
                                    <i className="material-icons" onClick={() => { likePost(item._id) }}>thumb_up</i>
                                }
                                <h6>{item.likes.length} likes </h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return (
                                            <h6 key={record._id}><span style={{ fontWeight: "500" }}>{record.postedBy.name} </span>{record.text}{record.postedBy._id == state._id 
    && <i className="material-icons" style={{
   float:"right"
   }} 
   onClick={()=>deleteComment(item._id,record._id)}
  >delete</i>
   }</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                }}>
                                    <input value={commentValue} onChange={(e) => setcommentValue(e.target.value)} type="text" placeholder="add a comment" />
                                </form>
                            </div>
                        </div>
                    )
                })
            }

        </div>
       </div>
    )
}

export default South;