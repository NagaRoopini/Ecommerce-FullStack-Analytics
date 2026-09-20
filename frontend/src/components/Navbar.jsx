import { useState } from 'react'

function Navbar({ setPage, currentPage }) {

  const [showProfile, setShowProfile] = useState(false)

  const user = JSON.parse(
    localStorage.getItem('user') || 'null'
  )

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      'Are you sure you want to logout?'
    )

    if (!confirmLogout) {
      return
    }

    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    localStorage.removeItem('activePage')

    setPage('login')
  }

  const pageTitles = {
    dashboard: 'Analytics Dashboard',
    sales: 'Sales Analytics',
    products: 'Product Analytics',
    customers: 'Customer Analytics',
    regional: 'Regional Analytics',
    payment: 'Payment Analytics',
    upload: 'Upload Data',
    orders: 'Orders',
  }

  const currentTitle =
    pageTitles[currentPage] || 'Analytics Dashboard'

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">

      {/* Left Side */}
      <div>
        <h2 className="text-xl font-semibold">
          {currentTitle}
        </h2>

        <p className="text-xs text-gray-500">
          E-Commerce Sales & Customer Analytics
        </p>
      </div>

      {/* Right Side */}
      <div className="relative flex items-center gap-4">

        {/* User Info */}
        <div className="text-right hidden sm:block">

          <p className="font-semibold text-gray-800">
            {user?.name || 'User'}
          </p>

          <p className="text-xs text-gray-500">
            {user?.email || ''}
          </p>

        </div>

        {/* Profile Button */}
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold hover:bg-blue-700"
        >
          {user?.name
            ? user.name.charAt(0).toUpperCase()
            : 'U'}
        </button>

        {/* Profile Dropdown */}
        {showProfile && (
          <div className="absolute right-0 top-14 w-56 bg-white border rounded-xl shadow-lg p-4 z-50">

            <p className="font-semibold text-gray-800">
              {user?.name || 'User'}
            </p>

            <p className="text-sm text-gray-500 break-all mt-1">
              {user?.email || ''}
            </p>

            <hr className="my-3" />

            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 font-medium"
            >
              Logout
            </button>

          </div>
        )}

      </div>

    </div>
  )
}

export default Navbar