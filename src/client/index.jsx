import { Routes, Route } from "react-router-dom";
import ClientLayout from "./layout/ClientLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GuestRoute from "./GuestRoute";
import Contact from "./components/home/Contact";
import Offers from "./components/home/Offers";
import Products from "./pages/Products";
import AddProducts from "./pages/AddProducts";
import ProductDetails from "./pages/ProductDetails";

const ClientRoutes = () => {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/offer" element={<Offers />} />
        <Route path="/shop" element={<Products />} />
        <Route path="/add" element={<AddProducts />} />
        <Route path="product/:id" element={<ProductDetails />} />

        {/* <Route path="/categories/skincare" element={<Skincare />} />
        <Route path="/categories/haircare" element={<Haircare />} /> */}
        {/* Add other category routes */}
        <Route path="/login" element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        } />
        <Route path="/register" element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        } />
      </Route>
    </Routes>
  );
};

export default ClientRoutes;
