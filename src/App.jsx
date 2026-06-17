import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import { AppStore } from "./Utils/Redux/AppStore";
import Body from "./Body";
import Login from "./Authentication/Login";
import Profile from "./Profile";
import Sidebar from "./DrawerLayout/Sidebar";
import DonorList from "./DonorList/DonorList";
import AddDonor from "./DonorList/AddDonor";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import Users from "./Users/Users";
import AddUser from "./Users/AddUser";

function App() {
  return (
    <Provider store={AppStore}>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTE */}
          <Route path="/login" element={<Login />} />

          {/* LAYOUT ROUTE */}
          <Route path="/" element={<Body />}>
            <Route index element={<AdminDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/donors" element={<DonorList />} />
            <Route path="/donor/add" element={<AddDonor />} />
             <Route path="/users" element={<Users />} />
               <Route path="/addUser" element={<AddUser />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
