import { Toaster } from 'react-hot-toast';
import { Outlet, useNavigate } from 'react-router-dom'

const Navbar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    // Logic to log out the user
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <>
    <div className=" h-dvh flex flex-col">
        {/* Messages */}
      <div className=" p-4 space-y-4">
        <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">U</div>
                <span className="text-gray-900 text-lg font-medium">Upivot</span>
            </div>
            <button className="bg-red-100 text-white-900 hover:bg-red-200 transition-all duration-300 rounded-lg px-4 py-2 text-sm cursor-pointer" onClick={handleLogout}> Log out</button>
        </nav>
      </div>
      <Toaster />
<Outlet/>
    </div>
  
    </>
  )
}

export default Navbar