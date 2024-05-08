
import { BrowserRouter,Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';  
import "@fontsource/montserrat";

import HomeAdmin from "./pages/HomeAdmin";
import HomeReception from "./pages/HomeReception";
import Login from "./pages/Login";
// import NavBarReception from "./pages/NavBarReception";
import RegisterPatient from "./pages/RegisterPatient";
import ViewPatients from "./pages/ViewPatients"
import UserAccounts from "./pages/UserAccounts"
import CreateUser from "./pages/CreateUser"
import Shifts from "./pages/Shifts"
import SpecificShift from "./pages/SpecificShift"
import MainEncounter from "./pages/MainEncounter"
import HomePharmacy from "./pages/HomePharmacy"
import AddMedicines from "./pages/AddMedicine"
import CreateInvoice from "./pages/CreateInvoice";
import CreateSaleInvoice from "./pages/CreateSaleInvoice"
import PaymentRefund from "./pages/PaymentRefund"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" exact element={<Login/>} /> 
        <Route path="/" exact element={<Login/>} /> 
        <Route path="/pharmacyhomepage/addmedicine/:username/:userrole" exact element={<AddMedicines/>} /> 
        <Route path="/pharmacyhomepage/createinvoice/:username/:userrole" exact element={<CreateInvoice/>} /> 
        <Route path="/pharmacyhomepage/createsaleinvoice/:username/:userrole" exact element={<CreateSaleInvoice/>} /> 
        <Route path="/pharmacyhomepage/paymentrefund/:username/:userrole" exact element={<PaymentRefund/>} /> 
        <Route path="/receptionhomepage/:username/:userrole" element={<HomeReception />} />
        <Route path="/adminhomepage/:username/:userrole" element={<HomeAdmin />} />
        <Route path="/pharmacyhomepage/:username/:userrole" element={<HomePharmacy />} />
        <Route path="/registerpatient/:username/:userrole" element={<RegisterPatient />} />
        <Route path="/viewpatients/:username" element={<ViewPatients />} />
        <Route path="/useraccounts/:username/:userrole" element={<UserAccounts />} />
        <Route path="/createuser/:username/:userrole" element={<CreateUser />} />
        <Route path="/shifts/:username/:userrole" element={<Shifts />} />
        <Route path="/shift/:username/:userrole/:shiftid" element={<SpecificShift />} />
        <Route path="/mainencounter/:shiftid/:visitid/:username/:patientid/:patientname" element={<MainEncounter />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
