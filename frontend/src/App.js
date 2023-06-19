import Layout from "./layouts";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Lottery from "./pages/Lottery";
import Network from "./pages/Network";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/lottery/:key" element={<Lottery />} />
          <Route path="/network" element={<Network />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;