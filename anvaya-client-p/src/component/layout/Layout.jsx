import { Sidebar } from "../sidebar/Sidebar";
import { Outlet } from "react-router-dom";
const Layout = () => {
  return (
    <div className='my-4'>
      <div className='d-flex gap-2'>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};
export { Layout };
