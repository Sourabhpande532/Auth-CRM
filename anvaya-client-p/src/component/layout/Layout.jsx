import { Sidebar } from "../sidebar/Sidebar";
import { Outlet } from "react-router-dom";
const Layout = () => {
  return (
    <div className='my-4'>
      <div className='row g-3'>
        <div className='col-md-2'>
          <Sidebar />
        </div>
        <div className='col-md-10'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export { Layout };
