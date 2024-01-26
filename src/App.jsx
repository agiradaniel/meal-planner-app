import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/home';
import BreakfastInput from './pages/breakfastInput';
import LunchInput from './pages/lunchInput';
import SupperInput from './pages/supperInput';
import Reports from './pages/reports';



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
        </Routes>
      </Router>
    </>
  )
}

export default App
