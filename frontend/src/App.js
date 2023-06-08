import Layout from "./layouts";
import Auth from "./pages/Auth";
import Connect from "./pages/Connect";
import Dashboard from "./pages/Dashboard";
import Network from "./pages/Network";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Layout>
      <BrowserRouter>
        <Routes>
          <Route path="/connect" element={<Connect />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/network" element={<Network />} />
        </Routes>
      </BrowserRouter>
    </Layout>
  );
};

export default App;