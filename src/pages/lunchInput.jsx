import React, { useState, useEffect } from 'react';
import NavBar from '../components/navBar';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/esm/Button';
import {db} from '../firebase-config';
import {addDoc, collection, getDocs, orderBy, query, updateDoc, doc} from 'firebase/firestore';


const LunchInput = () => {
  
  const [lunchSize, setLunchSize] = useState("small");
  const [lunchDescription, setLunchDescription] = useState("");
  const [allMeals, setAllMeals] = useState([]);
  const [lunchScore, setLunchScore] = useState(1);

  const date = new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' }).split(' ')[0].replace(',', '');
  const time = new Date().toLocaleTimeString('en-KE', { timeZone: 'Africa/Nairobi' }).slice(0, 5);   
  
  const mealsCollection = collection(db, "meals", "rRvWdcT1JTTaHabbKCL6", "lunch")

   
  
  //showing the data on the database collection on your page
  const getMeals = async () => {
    
    const q = await query(mealsCollection,
      orderBy('date', 'desc')
    )
    const data = await getDocs(q)

    //set users to show all the data in the collection
    setAllMeals(data.docs.map((doc)=>({
      ...doc.data(), id: doc.id
    })))

  }

   useEffect(()=>{
     getMeals()
   },[])

   useEffect(()=>{
    const checkLunchSize = async() => {
      if(lunchSize == "small"){
        setLunchScore(1);
       
      }else if(lunchSize == "medium"){
        setLunchScore(2);
       
      }else if(lunchSize == "large"){
        setLunchScore(3); 
      }else{
        setLunchScore(0)
      }
      
    }
    checkLunchSize()
   },[lunchSize])

   
   const submitLastMeal = async () => {
    const lastMealTime = time
    const id = "xqDYgrVSTBbaGffmIQOQ"
    
    const lunchDoc = doc(db, "meals", "rRvWdcT1JTTaHabbKCL6", "lastMeal", id);
    await updateDoc(lunchDoc, {lastMealTime});
   
 
  }
  
  const submitLunch = async() => {
    await addDoc(mealsCollection, {
      date,
      lunchTime: time,
      lunchSize,
      lunchDescription,
      lunchScore
    })
    console.log("Data inserted successfully")
    getMeals()
    submitLastMeal()
  }

  // Function to calculate color based on meal size
  const calculateContainerColor = (size) => {
    if (size === "small") return "#51AF61";
    if (size === "medium") return "#EA872B";
    if (size === "skipped") return "#484848"
    return "#DC4523";
  };

  return (
    <>
        <div style={{backgroundColor:"#D3EEDF", width:"90%", borderRadius:"20px", textAlign:"center", padding:"20px", margin:"30px auto 0"}}>
            
            <div><h4>Lunch</h4></div>
            {date}<br/>
            {time}

        </div>

        <div style={{backgroundColor:"#D3EEDF", width:"90%", borderRadius:"20px", textAlign:"center", padding:"20px", margin:"30px auto 0"}}>

        <p style={{textAlign:"center"}}>Add Meal</p>    
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic" style={{backgroundColor:"#51AF61", border:"none", padding:"5px 25px"}}>
            {lunchSize}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item value="small" onClick={()=>setLunchSize("small")} href="#/action-1">small</Dropdown.Item>
            <Dropdown.Item value="medium" onClick={()=>setLunchSize("medium")} href="#/action-2">medium</Dropdown.Item>
            <Dropdown.Item value="large" onClick={()=>setLunchSize("large")} href="#/action-3">large</Dropdown.Item>
            <Dropdown.Item value="skipped" onClick={(e)=>setLunchSize("skipped")}>skipped</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <textarea placeholder='Lunch Description' onChange={(e)=>setLunchDescription(e.target.value)} rows={4} style={{border:"none", margin:"20px auto 0", borderRadius:"10px", width:"90%"}}/>
        <Button onClick={submitLunch} style={{backgroundColor:"#51AF61", border:"none", marginTop:"20px", padding:"5px 30px"}}>save</Button>
        </div>


        <div style={{marginBottom:"100px"}}>
        {allMeals.map((meals)=>{
          
          const containerColor = calculateContainerColor(meals.lunchSize);

          return(
          <>

            <div style={{display:"flex", justifyContent:"space-between" ,backgroundColor: containerColor || "#51AF61", width:"90%", borderRadius:"20px", padding:"20px", margin:"30px auto 0", color:"white"}}>
            
              <div>{meals.date} <br/> {meals.lunchTime}</div>
              <div><p style={{maxWidth:"200px"}}>{meals.lunchDescription}</p></div>

            </div>

          </>
          )
        })}
        </div>


        <NavBar/>
    </>
  )
}

export default LunchInput