import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Layout } from "./component/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Leads } from "./pages/Leads";
import { Agents } from "./pages/Agents";
import { Report } from "./pages/Reports";
import { Setting } from "./pages/Setting";
import { AddLeads } from "./pages/AddLead";
import { Footer } from "./component/footer/Footer";
import { Login } from "./pages/Login";

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<Dashboard />} />
            <Route path='/leads' element={<Leads />} />
            <Route path='/add' element={<AddLeads />} />
            <Route path='/agents' element={<Agents />} />
            <Route path='/reports' element={<Report />} />
            <Route path='/setting' element={<Setting />} />
            <Route path='/login' element={<Login/>} />
          </Route>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
