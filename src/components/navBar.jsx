import React from 'react'
import CutleryIcon from '../assets/cutleryicon.png'
import ReportIcon from '../assets/reporticon.png'
import ProfileIcon from '../assets/profileicon.png'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <>
        <div style={{borderTop:"2px solid #F6F6F6", display:"flex", justifyContent:"space-around", margin:"20px auto 0", padding:"20px 0", position: "fixed", bottom: "0", width: "100%", maxWidth:"450px", zIndex:"100", backgroundColor:"white"}}>
            
            <Link to="/"><img src={CutleryIcon} style={{height:"45px", width:"45px"}}/></Link>
            <Link to="/reports"><img src={ReportIcon} style={{height:"40px", width:"40px"}}/></Link>
            <img src={ProfileIcon} style={{height:"40px", width:"40px"}}/>

        </div>
    </>
  )
}

export default NavBar