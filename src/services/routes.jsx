import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PublicRoutes from "./utils/PublicRoutes";
import PrivateRoutes from "./utils/PrivateRoutes";
import DefaultLayout from "../layout/defaultLayout";
import Login from "../views/login";
import Register from "../views/register";
import NotFound from "../views/notFound";
import SplitBillMethod from "../views/splitBillMethod";
import SplitBillMember from "../views/splitBillMember";
import SplitBillPayment from "../views/splitBillPayment";
import SplitBillDetail from "../views/splitBillDetail";
import SplitBillDetailShared from "../views/splitBillDetailShared";

const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route element={<PublicRoutes />}>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<PrivateRoutes />}>
            <Route path="/main" element={<DefaultLayout/>} />
            <Route path="/guide" element={<DefaultLayout />} />
            <Route path="/profile" element={<DefaultLayout/>} />
            <Route path="/split-bill/method/add" element={<SplitBillMethod/>} />
            <Route path="/split-bill/member/add" element={<SplitBillMember/>} />
            <Route path="/split-bill/payment/add" element={<SplitBillPayment/>} />
            <Route path="/split-bill/detail/:id" element={<SplitBillDetail/>} />
        </Route>
        <Route path="*" element={<NotFound/>} />
        <Route path="/not-found" element={<NotFound/>} />
        <Route path="/split-bill/detail/shared/:id" element={<SplitBillDetailShared/>} />
      </Routes>
    </Router>
  );
};

export default Routers;
