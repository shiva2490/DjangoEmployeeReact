import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './Home';
// import SearchResults from './SearchResults';

function App() {


  return (
    <BrowserRouter>
    <Routes>
      <Route path="/"  element={<Home/>} />
      {/* <Route path='/search/:query' element={<SearchResults/>}  /> */}
    </Routes>
    </BrowserRouter>
  )
}

export default App
