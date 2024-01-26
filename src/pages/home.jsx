import React, { useEffect, useState } from 'react'
import NavBar from '../components/navBar'
import BreakfastIcon from '../assets/breakfasticon.png'
import AddIcon from '../assets/addicon.png'
import LunchIcon from '../assets/lunchicon.png'
import SupperIcon from '../assets/suppericon.png'
import { Link } from 'react-router-dom'
import {db} from '../firebase-config';
import {addDoc, collection, getDocs, orderBy, query, where} from 'firebase/firestore'
import DonutChart from 'react-donut-chart';

const Home = () => {
  
    const[myLastMeal, setMyLastMeal] = useState([]);
    const [breakfastData, setBreakfastData] = useState([]);
    const [lunchData, setLunchData] = useState([]);
    const [supperData, setSupperData] = useState([]);
    const [myProgress, setMyProgress] = useState("");
    const [progressColor, setProgressColor] = useState("")
    const [results, setResults] = useState("")

    const date = new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' }).split(' ')[0].replace(',', ''); 
    const time = new Date().toLocaleTimeString('en-KE', { timeZone: 'Africa/Nairobi' }).slice(0, 5); 

    const [currenthours, currentminutes] = time.split(":").map(Number);
    const currentTotalMinutes = currenthours * 60 + currentminutes
    //const [recordedhours, recordminutes] = time2.split(":").map(Number);

    const breakfastCollection = collection(db, "meals", "rRvWdcT1JTTaHabbKCL6", "breakfast")
    const lunchCollection = collection(db, "meals", "rRvWdcT1JTTaHabbKCL6", "lunch")
    const supperCollection = collection(db, "meals", "rRvWdcT1JTTaHabbKCL6", "supper")
    const lastMealCollection = collection(db, "meals", "rRvWdcT1JTTaHabbKCL6", "lastMeal")

    const recordedTime = myLastMeal.length > 0 ? myLastMeal[0].lastMealTime : "00:00"
    const [recordedhours, recordedminutes] = recordedTime.split(":").map(Number);
    const totalRecordedHours = recordedhours * 60 + recordedminutes

    const timeDifference = currentTotalMinutes - totalRecordedHours

     useEffect(()=>{
        const getLastMeal = async() => {
            const data = await getDocs(lastMealCollection)
            setMyLastMeal(data.docs.map((doc)=>({
                ...doc.data(), id: doc.id
            })))
        }
        getLastMeal()
        getMergedMealSizes()
        
      },[])

      

    const getMergedMealSizes = async () => {
        const b = await query(breakfastCollection,
          where('date', "==", date)
        )
        const bdata = await getDocs(b)
    
        //set users to show all the data in the collection
        setBreakfastData(bdata.docs.map((doc)=>({
          ...doc.data(), id: doc.id
        })))
    
        const l = await query(lunchCollection,
          where('date', "==", date)
        )
        const ldata = await getDocs(l)
    
        //set users to show all the data in the collection
        setLunchData(ldata.docs.map((doc)=>({
          ...doc.data(), id: doc.id
        })))
    
        const s = await query(supperCollection,
          where('date', "==", date)
        )
        const sdata = await getDocs(s)
    
        //set users to show all the data in the collection
        setSupperData(sdata.docs.map((doc)=>({
          ...doc.data(), id: doc.id
        })))
    
      }

      const retrievedBreakfastScore = breakfastData.length > 0 ? breakfastData[0].breakfastScore : '';
      const retrievedLunchScore = lunchData.length > 0 ? lunchData[0].lunchScore : '';
      const retrievedSupperScore = supperData.length > 0 ? supperData[0].supperScore : '';

      const totalScore = retrievedBreakfastScore + retrievedLunchScore + retrievedSupperScore;
      const otherScore = 9 - totalScore;

      const calculateProgress = async () => {
        
        const progressScore = await retrievedBreakfastScore + retrievedLunchScore + retrievedSupperScore;

        if(progressScore <= 3){
            setMyProgress("Excellent");
            setProgressColor("#51AF61");
        }else if(progressScore == 4){
            setMyProgress("Good");
            setProgressColor("#51AF61");
        }else if(progressScore == 5){
            setMyProgress("Okay");
            setProgressColor("#EA872B");
        }else if(progressScore == 6){
            setMyProgress("Not Good");
            setProgressColor("#EA872B");
        }else{
            setMyProgress("Failed");
            setProgressColor("#DC4523");
        }
      }
      
      useEffect(() => {
        const timeout1 = setTimeout(() => {
            calculateProgress();
        }, 3000); // Delay calculateProgress by 2 seconds
    
        
        return () => {
            clearTimeout(timeout1);
        };
    }, [retrievedBreakfastScore, retrievedLunchScore, retrievedSupperScore]);

      
  
    return (
    <>
        <div style={{backgroundColor:"#D3EEDF", width:"90%", borderRadius:"20px", display:"flex", justifyContent:"space-between", padding:"20px", margin:"30px auto 0"}}>
            
            <div>Daniel's Meal Plan</div>
            <div>{date}</div>
        </div>
          
        <div  style={{boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" ,width:"90%", borderRadius:"20px", padding:"20px", margin:"30px auto 0"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                {timeDifference < 240 ? <div style={{backgroundColor:"#DC4523", padding:"40px 20px", color:"white", borderRadius:"10px", display: "flex", alignItems: "center"}}>You can't eat</div>:
                
                <div style={{backgroundColor:"#51AF61", padding:"40px 20px", color:"white", borderRadius:"10px", display: "flex", alignItems: "center"}}>Free to eat</div>}
                
                <div style={{padding:"20px", color:"white", borderRadius:"50px"}}>
                <DonutChart
                height={120}
                width={120}
                legend={false}
                colors={[progressColor]}
                data={[
                    {
                    value: totalScore,
                    label: totalScore + " D-Kals",
                    },
                    {       
                    value: otherScore,  
                    isEmpty: true,
                    },
                ]}
                />
                </div>
            </div>
            <div style={{marginTop:"10px"}}>
                <p>My Progress: <span style={{color:progressColor}}>{myProgress}</span></p>
            </div>
        </div>

        <div style={{backgroundColor:"#D3EEDF", width:"90%", borderRadius:"20px", display:"flex", justifyContent:"space-between", padding:"20px", margin:"30px auto 0"}}>
            <div style={{display:"flex", alignItems: "center"}}>
                <img src={BreakfastIcon} style={{ marginRight: "10px" }}/>
                <div>Breakfast</div>
            </div>     
            <Link to="/breakfastinput"><img src={AddIcon}/></Link>
        </div>

        <div style={{backgroundColor:"#D3EEDF", width:"90%", borderRadius:"20px", display:"flex", justifyContent:"space-between", padding:"20px", margin:"30px auto 0"}}>
            <div style={{display:"flex", alignItems: "center"}}>
                <img src={LunchIcon} style={{ marginRight: "10px" }}/>
                <div>Lunch</div>
            </div>     
            <Link to="/lunchinput"><img src={AddIcon}/></Link>
        </div>

        <div style={{backgroundColor:"#D3EEDF", width:"90%", borderRadius:"20px", display:"flex", justifyContent:"space-between", padding:"20px", margin:"30px auto 100px"}}>
            <div style={{display:"flex", alignItems: "center"}}>
                <img src={SupperIcon} style={{ marginRight: "10px" }}/>
                <div>Supper</div>
            </div>     
            <Link to="/supperinput"><img src={AddIcon}/></Link>
        </div>

        <NavBar/>

    </>
  )
}

export default Home