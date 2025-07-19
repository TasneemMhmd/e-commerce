import { BrowserRouter, Routes, Route } from "react-router-dom";
// import AdminRoutes from "./admin/index";
import ClientRoutes from "./client/index";

function App() {
  return (
      <Routes>
        {/* <Route path="/admin/*" element={<AdminRoutes />} /> */}
        <Route path="/*" element={<ClientRoutes />} />
      </Routes>
  );
}

export default App;
