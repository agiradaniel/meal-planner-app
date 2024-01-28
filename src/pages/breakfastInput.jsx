import React, { useState, useEffect } from 'react'
import NavBar from '../components/navBar'
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/esm/Button';
import {db} from '../firebase-config';
import {addDoc, collection, getDocs, orderBy, query, doc, updateDoc, where, limit} from 'firebase/firestore'

const BreakfastInput = () => {

  const [breakfastSize, setBreakfastSize] = useState("small");
  const [breakfastDescription, setBreakfastDescription] = useState("");
  const [allMeals, setAllMeals] = useState([]);
  const [breakfastScore, setBreakfastScore] = useState(1);
  const [todaysMealExists, setTodaysMealExists] = useState(false)

  const date = new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' }).split(' ')[0].replace(',', '');
  const time = new Date().toLocaleTimeString('en-KE', { timeZone: 'Africa/Nairobi' }).slice(0, 5);   
  
  const mealsCollection = collection(db, "meals", "rRvWdcT1JTTaHabbKCL6", "breakfast")
   
  
  //showing the data on the database collection on your page
  const getMeals = async () => {
    const q = await query(mealsCollection,
      orderBy('date', 'desc'),
      limit(7)
    )
    const data = await getDocs(q)

    //set users to show all the data in the collection
    setAllMeals(data.docs.map((doc)=>({
      ...doc.data(), id: doc.id
    })))

  }

  const checkIfTodaysMealExists = async() => {
    const q = await query(mealsCollection, 
      where('date', "==", date)
    )
    const data = await getDocs(q)
    !data.empty ? setTodaysMealExists(true): setTodaysMealExists(false)
  }

  useEffect(()=>{
    const checkBreakfastSize = async() => {
      if(breakfastSize == "small"){
        setBreakfastScore(1);
       
      }else if(breakfastSize == "medium"){
        setBreakfastScore(2)
       
      }else if(breakfastSize == "large"){
        setBreakfastScore(3); 
      }else{
        setBreakfastScore(0);
      }
      
     }
    checkBreakfastSize() 
  },[breakfastSize])

   useEffect(()=>{
     getMeals()
     checkIfTodaysMealExists()
   },[])

   const submitLastMeal = async () => {
    const lastMealTime = time
    const id = "xqDYgrVSTBbaGffmIQOQ"
    
    const breakfastDoc = doc(db, "meals", "rRvWdcT1JTTaHabbKCL6", "lastMeal", id);
    await updateDoc(breakfastDoc, {lastMealTime});
   
 
  }
   
  const submitBreakfast = async() => {
   
    await addDoc(mealsCollection, {
      date,
      breafastTime: time,
      breakfastSize,
      breakfastDescription,
      breakfastScore
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
    <div style={{maxWidth:"450px", margin:"auto"}}>
        <div style={{backgroundColor:"#D3EEDF", width:"90%", borderRadius:"20px", textAlign:"center", padding:"20px", margin:"30px auto 0"}}>
            
            <div><h4>Breakfast</h4></div>
            {date}<br/>
            {time}
       

        </div>

        <div style={{backgroundColor:"#D3EEDF", width:"90%", borderRadius:"20px", textAlign:"center", padding:"20px", margin:"30px auto 0"}}>

        <p style={{textAlign:"center"}}>Add Meal</p>    
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic" style={{backgroundColor:"#51AF61", border:"none", padding:"5px 25px"}}>
            {breakfastSize}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item value="small" onClick={(e)=>setBreakfastSize("small")}>small</Dropdown.Item>
            <Dropdown.Item value="medium" onClick={(e)=>setBreakfastSize("medium")}>medium</Dropdown.Item>
            <Dropdown.Item value="large" onClick={(e)=>setBreakfastSize("large")}>large</Dropdown.Item>
            <Dropdown.Item value="skipped" onClick={(e)=>setBreakfastSize("skipped")}>skipped</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <textarea placeholder='Breakfast Description' rows={4} onChange={(e)=>setBreakfastDescription(e.target.value)} style={{border:"none", margin:"20px auto 0", borderRadius:"10px", width:"90%"}}/>
         {todaysMealExists ? <Button style={{backgroundColor:"#51AF61", border:"none", marginTop:"20px", padding:"5px 30px"}} disabled>saved</Button> : <Button onClick={submitBreakfast} style={{backgroundColor:"#51AF61", border:"none", marginTop:"20px", padding:"5px 30px"}}>save</Button>}
        </div>

        <div style={{marginBottom:"200px"}}>
        {allMeals.map((meals)=>{
          
          const containerColor = calculateContainerColor(meals.breakfastSize);

          return(
          <>

            <div style={{display:"flex", justifyContent:"space-between" ,backgroundColor: containerColor, width:"90%", borderRadius:"20px", padding:"20px", margin:"30px auto 0", color:"white"}}>
            
              <div>{meals.date} <br/> {meals.breafastTime}</div>
              <div><p style={{maxWidth:"200px"}}>{meals.breakfastDescription}</p></div>

            </div>

          </>
          )
        })}
        </div>

        <NavBar/>
    </div>
  )
}

export default BreakfastInput