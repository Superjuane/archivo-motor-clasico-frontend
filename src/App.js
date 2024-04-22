import { useEffect } from 'react';

import './App.css';
import Home from './views/Home';
import SingleResourcePage from 'views/SingleResourcePage';
import ResourcesExplorationPage from './views/ResourcesExplorationPage';
import UploadImage from './views/UploadImage';
import SearchPage from './views/SearchPage';
import Login from './views/Login';
import Navbar from 'components/Navbar';

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

function App() {

  const tabTitle ={
    "/home":"AMC | Home Page",
    "/profile":"AMC | My Profile Page",
    "/resources":"AMC | Resources Page",
    "/resourcesid":"AMC | Imágen única",
    "/uploadimage":"AMC | Upload Image Page",
    "/collections":"AMC | Collections Page",
    "/search":"AMC | Upload Image Page",
    }

  useEffect(() => {
    let name = window.location.pathname

    if(window.location.pathname.startsWith("/resources/")){
      name = "/resourcesid"
    }

    console.log(name)

    document.title = tabTitle[name] || "My Site";
  });

  return (
    <BrowserRouter>
      {/* <Navbar></Navbar> */}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/resources/:id" element={<SingleResourcePage />} />
      <Route path="/resources" element={<ResourcesExplorationPage />} />
      <Route path="/uploadimage" element={<UploadImage/>}/>
      <Route path="/search" element={<SearchPage/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Home />} />
      {/* <Route path="/chapter/:chapterNumber" element={<Chapter />} /> */}
      {/* <Route path="/*" element={<NotFound />} /> */}
    </Routes>
  </BrowserRouter>
  );
}

export default App;
