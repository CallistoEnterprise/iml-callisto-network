import Layout from "layouts";
import Auth from "pages/Auth";
import Connect from "pages/Connect";
import Landing from "pages/Landing";
import Network from "pages/Network";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Layout>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/network" element={<Network />} />
        </Routes>
      </BrowserRouter>
    </Layout>
  );
};

export default App;
