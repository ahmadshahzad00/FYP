import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminSignin from './adminPanel/AdminSignin';
import AdminSignup from './adminPanel/AdminSignup';
import AdminForgotPassword from './adminPanel/AdminForgotPassword';
import AdminResetPassword from './adminPanel/AdminResetPassword';
import AdminDashBoard from './adminPanel/AdminDashBoard'


import Home from './userPanel/Home';
import Login from './userPanel/Login'
import Register from './userPanel/Register'
import ContactUs from './userPanel/ContactUs'
import UserProfile from './userPanel/UserProfile';
import AboutUs from './userPanel/AboutUs';
import TrendingProducts from './userPanel/TrendingProducts';
import Categories from './userPanel/categories';
import BusinessRegister from './userPanel/BusinessRegister';
import BusinessProfile from './userPanel/BusinessProfile';
import FAQ from './userPanel/FAQ';
import PublicBusinessProfile from './userPanel/PublicBusinessProfile';
function App() {
  return (
     <Router>
      <Routes>
        {/* user side */}
        <Route path="/" element={<Home />} />
        <Route path="/user-login" element={<Login />} />
        <Route path="/user-register" element={<Register />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/trendingProducts" element={<TrendingProducts />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/business-register" element={<BusinessRegister />} />
        <Route path="/business-profile" element={<BusinessProfile />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/publicBusinessProfile" element={<PublicBusinessProfile/>}/>

        {/* admin side */}
        <Route path="/admin-login" element={<AdminSignin />} />
        <Route path="/admin-registration" element={<AdminSignup />} />
        <Route path="/userProfile" element={<UserProfile/>} />
        <Route path="/admin-forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin-reset-password" element={<AdminResetPassword />} />
        <Route path="/admin-dashboard" element={<AdminDashBoard />} />
        
      </Routes>
    </Router>
  );
}

export default App;