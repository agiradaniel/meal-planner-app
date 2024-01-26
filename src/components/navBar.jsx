import React from 'react'
import CutleryIcon from '../assets/cutleryicon.png'
import ReportIcon from '../assets/reporticon.png'
import ProfileIcon from '../assets/profileicon.png'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <>
        <div style={{borderTop:"2px solid #F6F6F6", display:"flex", justifyContent:"space-around", marginTop:"20px", padding:"20px 0", position: "fixed", bottom: "0", width: "100%", zIndex:"100", backgroundColor:"white"}}>
            
            <Link to="/"><img src={CutleryIcon}/></Link>
            <Link to="/reports"><img src={ReportIcon}/></Link>
            <img src={ProfileIcon}/>

        </div>
    </>
  )
}

export default NavBar