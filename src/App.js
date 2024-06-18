import { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import './App.css';
import Home from './views/Home';
import SingleResourcePage from 'views/SingleResourcePage';
import ResourceEditPage from 'views/ResourceEditPage';
import ResourcesExplorationPage from './views/ResourcesExplorationPage';
import SearchPage from './views/SearchPage';
import SearchByImagePage from './views/SearchByImagePage';
import Login from './views/Login';
import ForgotPassword from 'views/ForgotPasswordPage';
import ResetPassword from 'views/ResetPasswordPage';
import Navbar from 'components/Navbar';
import UserPage from 'views/UserPage';
import CollectionPage from 'views/CollectionPage';
import Footer from 'components/Footer';
import ResourceUploadPageNew from './views/ResourceUploadPageNew';
import Register from 'views/Register';
import Privacy from 'views/Privacy';
import Contact from 'views/Contact';


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

    document.title = /*tabTitle[name]*/"AMC |"+ name.replace('/',' ') || "My Site";
  });

  return (
    <BrowserRouter>
      <Navbar></Navbar>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/resources/:id" element={<SingleResourcePage />} />
      <Route path="/edit/:id" element={<ResourceEditPage />} />
      <Route path="/resources" element={<ResourcesExplorationPage />} />
      <Route path="/collections/:id" element={<CollectionPage />} />
      <Route path="/upload" element={<ResourceUploadPageNew/>}/>
      <Route path="/search" element={<SearchPage/>}/>
      <Route path="/searchimage/:id" element={<SearchByImagePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<UserPage />} />
      <Route path="/user/:user" element={<UserPage />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<Home />} />
    </Routes>
    <Footer></Footer>
  </BrowserRouter>
  );
}

export default App;
