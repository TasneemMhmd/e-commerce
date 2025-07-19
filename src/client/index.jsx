import { Routes, Route } from "react-router-dom";
import ClientLayout from "./layout/ClientLayout";
import Home from "./pages/Home";

const ClientRoutes = () => {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
};

export default ClientRoutes;
