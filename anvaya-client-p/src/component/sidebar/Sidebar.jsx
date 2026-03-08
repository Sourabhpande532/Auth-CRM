import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const { isAuthenticated, logout } = useAuth();
  return (
    <div className='border-right' style={{ width: "200px" }}>
      <ul className='nav'>
        <li className='nav-item'>
          <NavLink to='/' className='nav-link'>
            Dashboard
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink to='/leads' className='nav-link'>
            Leads
          </NavLink>
        </li>
        <li className='nav-item'>
          <Link to='/add' className='nav-link'>
            Add Lead
          </Link>
        </li>
        <li className='nav-item'>
          <Link to='/agents' className='nav-link'>
            Agents
          </Link>
        </li>
        <li className='nav-item'>
          <Link to='/reports' className='nav-link'>
            Reports
          </Link>
        </li>
        <li className='nav-item'>
          <Link to='/analysis' className='nav-link'>
            Analysis
          </Link>
        </li>
        <li className='nav-item'>
          <Link to='/setting' className='nav-link'>
            Setting
          </Link>
        </li>
        {isAuthenticated ? (
          <li className='nav-item'>
            <Link onClick={logout} to='/login' className='nav-link'>
              Logout--
            </Link>
          </li>
        ) : (
          <li className='nav-item'>
            <Link to='/login' className='nav-link'>
              Login--
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};
export { Sidebar };
