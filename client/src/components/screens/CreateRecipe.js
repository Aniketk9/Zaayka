import React, { useState, useEffect,useRef } from 'react';
import { useNavigate } from "react-router-dom";
import M from 'materialize-css';

const CreateRecipe = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [video, setVideo] = useState("")
  const [url, setUrl] = useState("")
  const [type, setType] = useState("")
  const typeselect = useRef(null)
  useEffect(() => {
    M.FormSelect.init(typeselect.current)
  }, [])
  
  useEffect(() => {
    if (url) {
      fetch("/createrecipe", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          title,
          body,
          type,
          pic: url
        })
      }).then(res => res.json())
        .then(data => {
          console.log(data)
          if (data.error) {
            M.toast({ html: data.error, classes: "#c62828 red darken-3" })
          }
          else {
            M.toast({ html: "Recipe created successfully", classes: "#00e676 green accent-3" })
            navigate('/')
          }
        })
        .catch(err => {
          console.log(err);
        })
    }

  }, [url])
  const recipeDetails = () => {
    const data = new FormData();
    data.append("file", video)
    data.append("upload_preset", "zaayka")
    data.append("cloud_name", "dkp8phxth")             
    fetch("https://api.cloudinary.com/v1_1/dkp8phxth/video/upload", {    /**"https://api.cloudinary.com/v1_1/zaayka" - api base url   */
      method: "post",
      body: data
    })
      .then(res => res.json())
      .then(data => {
        setUrl(data.url)
      })
      .catch(err => {
        console.log(err)
      })



  }
  return (
    <div className="card input-filed"
      style={{
        margin: "30px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center"
      }}
    >
      <input
        type="text"
        placeholder="Recipe Name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Recipe Description"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn waves-effect waves-light #64b5f6 blue darken-1">
          <span>Upload Recipe Video</span>
          <input type="file" onChange={(e) => setVideo(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <div className="input-field col s12">
        <select ref={typeselect} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="" disabled defaultValue>Choose Recipe's Category</option>
          <option value="1">North Indian</option>
          <option value="2">South Indian</option>
          <option value="3">Chinese</option>
          <option value="4">Continental</option>
        </select>
      </div>
      <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
        onClick={() => recipeDetails()}>
        Submit Recipe
      </button>
    </div>
  )

}

export default CreateRecipe;