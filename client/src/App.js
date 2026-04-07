import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminSignin from './adminPanel/AdminSignin';
import AdminSignup from './adminPanel/AdminSignup';
import AdminForgotPassword from './adminPanel/AdminForgotPassword';
import AdminResetPassword from './adminPanel/AdminResetPassword';
import AdminDashBoard from './adminPanel/AdminDashBoard'
import BusinessList from './adminPanel/businessList';
import ProductList from './adminPanel/productList';
import BusinessRequests from "./adminPanel/BusinessRequests";
import ContactUsList from './adminPanel/ContactUsList';



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
import FAQs from './userPanel/FAQs';
import PublicBusinessProfile from './userPanel/PublicBusinessProfile';
import SendInquiry from './userPanel/sendInquiry';


function App() {
  return (
     <Router>
      <Routes>
        {/* user side */}

        <Route path="/" element={<Home />} />
        <Route path="/user-login" element={<Login />} />
        <Route path="/user-register" element={<Register />} />
        <Route path="/userProfile" element={<UserProfile/>} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/trendingProducts" element={<TrendingProducts />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/business-register" element={<BusinessRegister />} />
        <Route path="/business-profile" element={<BusinessProfile />} />
        <Route path="/FAQs" element={<FAQs />} />
        <Route path="/publicBusinessProfile" element={<PublicBusinessProfile/>}/>
        <Route path="/sendInquiry" element={<SendInquiry/>}/>

        {/* admin side */}
        
        <Route path="/admin-login" element={<AdminSignin />} />
        <Route path="/admin-registration" element={<AdminSignup />} />
        <Route path="/admin-forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin-reset-password" element={<AdminResetPassword />} />
        <Route path="/admin-dashboard" element={<AdminDashBoard />} />
        <Route path="/businessList" element={<BusinessList />} />
        <Route path="/productList" element={<ProductList />} />
        <Route path="/businessRequests" element={<BusinessRequests />} />
        <Route path="/contactMessages" element={<ContactUsList />} />
        
      </Routes>
    </Router>
  );
}

export default App;