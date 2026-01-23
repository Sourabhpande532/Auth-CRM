import { Sidebar } from "../sidebar/Sidebar";
import { Outlet } from "react-router-dom";
const Layout = () => {
  return (
    <div>
      <div className='d-flex gap-2'>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};
export { Layout };
