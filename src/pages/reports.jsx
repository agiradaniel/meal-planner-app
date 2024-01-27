import React, {useState, useEffect} from 'react'
import NavBar from '../components/navBar'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/esm/Button';
import {db} from '../firebase-config';
import { addDoc, collection, getDocs, query, where, orderBy } from 'firebase/firestore';

const Reports = () => {
  const [allMeals, setAllMeals] = useState([]);
  const [breakfastData, setBreakfastData] = useState([]);
  const [lunchData, setLunchData] = useState([]);
  const [supperData, setSupperData] = useState([]);
  const [summaryReports, setSummaryReports] = useState([]);
  const [todaysReportExists, setTodaysReportExists] = useState(false)

  const todaysDate = new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' }).split(' ')[0].replace(',', '');
  const todaysTime = new Date().toLocaleTimeString('en-KE', { timeZone: 'Africa/Nairobi' }).slice(0, 5); 

  const breakfastCollection = collection(db, "meals", "rRvWdcT1JTTaHabbKCL6", "breakfast")
  const lunchCollection = collection(db, "meals", "rRvWdcT1JTTaHabbKCL6", "lunch")
  const supperCollection = collection(db, "meals", "rRvWdcT1JTTaHabbKCL6", "supper")
  const reportCollection = collection(db, "meals", "rRvWdcT1JTTaHabbKCL6", "report")

  const getMergedMealSizes = async () => {
    const b = await query(breakfastCollection,
      where('date', "==", todaysDate)
    )
    const bdata = await getDocs(b)

    //set users to show all the data in the collection
    setBreakfastData(bdata.docs.map((doc)=>({
      ...doc.data(), id: doc.id
    })))

    const l = await query(lunchCollection,
      where('date', "==", todaysDate)
    )
    const ldata = await getDocs(l)

    //set users to show all the data in the collection
    setLunchData(ldata.docs.map((doc)=>({
      ...doc.data(), id: doc.id
    })))

    const s = await query(supperCollection,
      where('date', "==", todaysDate)
    )
    const sdata = await getDocs(s)

    //set users to show all the data in the collection
    setSupperData(sdata.docs.map((doc)=>({
      ...doc.data(), id: doc.id
    })))

  }

  const retrievedBreakfastSize = breakfastData.length > 0 ? breakfastData[0].breakfastSize : '';
  const retrievedLunchSize = lunchData.length > 0 ? lunchData[0].lunchSize : '';
  const retrievedSupperSize = supperData.length > 0 ? supperData[0].supperSize : '';
  const retrievedBreakfastScore = breakfastData.length > 0 ? breakfastData[0].breakfastScore : '';
  const retrievedLunchScore = lunchData.length > 0 ? lunchData[0].lunchScore : '';
  const retrievedSupperScore = supperData.length > 0 ? supperData[0].supperScore : '';

  const storeReportData = async() => {
    
    const totalScore = retrievedBreakfastScore + retrievedLunchScore + retrievedSupperScore;

    await addDoc(reportCollection, {
      date: todaysDate,
      breakfastSize: retrievedBreakfastSize, 
      lunchSize: retrievedLunchSize,
      supperSize: retrievedSupperSize,
      breakfastScore: retrievedBreakfastScore,
      lunchScore: retrievedLunchScore,
      supperScore: retrievedSupperScore,
      totalScore
    })
    console.log("Data inserted successfully")
    getReports()
  }

  const getReports = async() => {
    const q = await query(reportCollection,
      orderBy('date', 'desc')
    )
    const data = await getDocs(q)

    //set users to show all the data in the collection
    setSummaryReports(data.docs.map((doc)=>({
      ...doc.data(), id: doc.id
    })))
  }

  const checkIfTodaysReportExists = async() => {
    const q = await query(reportCollection, 
      where('date', "==", todaysDate)
    )
    const data = await getDocs(q)
    //!data.empty ? setTodaysReportExists(true) : setTodaysReportExists(false)
    if(!data.length > 0 && breakfastData.length > 0 && lunchData.length > 0 && supperData.length > 0){
      setTodaysReportExists(false)
    }else{
      setTodaysReportExists(true)
    }
  }

  useEffect(()=>{
    getMergedMealSizes()
    getReports()
    checkIfTodaysReportExists()
  },[])

  const calculateContainerColor = (size) => {
    if (size === "small") return "#51AF61";
    if (size === "medium") return "#EA872B";
    if (size === "skipped") return "#484848"
    return "#DC4523";
  };

  const calculateResult = (performance) => {
    if (performance <= 3) return "Excellent"
    if (performance == 4) return "Good"
    if (performance == 5) return "Okay"
    if (performance == 6) return "Not Great"
    return "Failed"

  }

  const calculateResultColor = (performance) => {
    if (performance <= 3) return "#51AF61"
    if(performance > 3 && performance <= 6) return "#EA872B"
    return "#DC4523"
  }


  return (
    <>
        <div style={{backgroundColor:"#D3EEDF", width:"90%", borderRadius:"20px", textAlign:"center", padding:"20px", margin:"30px auto 0", display:"flex", justifyContent:"space-between"}}>
            
            <div>Reports</div>
            <div>{todaysDate}</div>


        </div>

      <div style={{overflow: "auto", marginTop:"30px"}}>
        <Table striped hover >
        <thead>
          <tr>
            <th style={{minWidth:"90px"}}>Date</th>
            <th>Breakfast</th>
            <th>Lunch</th>
            <th>Supper</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
        {summaryReports.map((report)=>{
        const breakfastColor = calculateContainerColor(report.breakfastSize);
        const lunchColor = calculateContainerColor(report.lunchSize);
        const supperColor = calculateContainerColor(report.supperSize);
        const result = calculateResult(report.totalScore);
        const resultColor = calculateResultColor(report.totalScore)

        return(
          <>
            <tr>
              <td>{report.date}</td>
              <td><Button style={{backgroundColor:breakfastColor, border:"none"}}>{report.breakfastSize}</Button></td>
              <td><Button style={{backgroundColor:lunchColor, border:"none"}}>{report.lunchSize}</Button></td>
              <td><Button style={{backgroundColor:supperColor, border:"none"}}>{report.supperSize}</Button></td>
              <td style={{color: resultColor, fontWeight:"bold"}}>{result}</td>
            </tr>
          </>
        )
        
        })}
        </tbody>
      </Table>
      </div>
      
      <br/>
      <div style={{margin:"auto", textAlign:"center",}}>
        {todaysReportExists ? <Button style={{backgroundColor:"#51AF61", border:"none", padding:"10px 10px", borderRadius:"10px", color:"white"}} disabled> Regenerated </Button> : <Button style={{backgroundColor:"#51AF61", border:"none", padding:"10px 10px", borderRadius:"10px", color:"white"}} onClick={storeReportData}>Regenerate</Button>}
      </div>

        <NavBar/>
    </>
  )
}

export default Reports