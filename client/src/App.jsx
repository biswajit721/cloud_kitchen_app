import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import ForgotPassword from './pages/public/Forgotpassword'; // ← ADD THIS // It may Change 
import Profile from './pages/user/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';

// Route Guards
import ProtectedRoute from './route/ProtectedRoute';
import PublicRoute from './route/PublicRoute';
import ContactUs from './pages/public/ContactUs';
import AdminContact from './pages/admin/AdminContact';
import AdminFood from './pages/admin/AdminFood';
import Food from './pages/public/Food';
import Checkout from './pages/public/Checkout';
import MyOrders from './pages/public/MyOrders';
import AdminOrders from './pages/admin/AdminOrders';

function App() {
  return (
    <Routes>
      {/* Public Routes with Main Layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<ContactUs/>}/>
        <Route path="foods" element={<Food/>}/>
        <Route path="checkout" element={<Checkout/>}/>
        <Route path="my-orders" element={<MyOrders/>}/>
        
        {/* Only accessible if NOT logged in */}
        <Route 
          path="login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />
        <Route                             
          path="forgot-password"           
          element={                        
            <PublicRoute>                  
              <ForgotPassword />           
            </PublicRoute>                 
          }                                
        />                                 
        
        {/* Only accessible if logged in */}
        <Route 
          path="profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Admin Routes with Admin Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path='contact' element={<AdminContact />} />
        <Route path='food' element={<AdminFood />} />
        <Route path='orders' element={<AdminOrders />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;