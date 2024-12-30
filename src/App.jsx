import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/home';
import BreakfastInput from './pages/breakfastInput';
import LunchInput from './pages/lunchInput';
import SupperInput from './pages/supperInput';
import Reports from './pages/reports';
import Tool from './pages/tool';



function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/reports' element={<Reports/>}/>
          <Route path='/breakfastinput' element={<BreakfastInput/>}/>
          <Route path='/lunchinput' element={<LunchInput/>}/>
          <Route path='/supperinput' element={<SupperInput/>}/>
          <Route path='/tool' element={<Tool/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
