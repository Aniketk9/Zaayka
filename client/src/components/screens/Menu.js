import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../App';
import { Link } from "react-router-dom";
import { DefaultPlayer as Video } from "react-html5video"
import "react-html5video/dist/styles.css"





  
const Menu = ()=>{
   
  return (
    <>
    <div>
     
       
    <div className="container">
		<div className="box">
        
        <Link to="/menu/north"><img  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlQf0XQfvqWYonUvmmIHn4WwHHrVRtXGdU2A&usqp=CAU"/></Link>
        <h6 className="txt">North Indian</h6>
		</div>
		<div className="box">
        <Link to="/menu/south"><img  src="https://assets.vogue.com/photos/63d169f727f1d528635b4287/master/pass/GettyImages-1292563627.jpg"/></Link>
        <h6 className="txt">South Indian</h6>
		</div>
		
	</div>
    <div className="container">
		<div className="box">
        <Link to="/menu/chinese"><img  src="https://images.herzindagi.info/image/2022/Feb/delicious-chinese-food.jpg"/></Link>
        <h6 className="txt">Chinese Food</h6>
		</div>
		<div className="box">
        <Link to="/menu/continental"><img  src="https://www.merisaheli.com/wp-content/uploads/2017/12/1441907994063.jpeg"/></Link>
        <h6 className="txt">Continental</h6>
		</div>
		
	</div>
      
   
    </div>

    <hr/>
    <div style={{height:'100px',color:'GrayText'}}>
      <h5 className='center-align'>Find Your Today's Meal here....</h5> 
    </div>
    </>
  )
    

   
    }
export default Menu;
