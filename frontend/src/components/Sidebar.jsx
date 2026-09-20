import { useState } from 'react'

function Sidebar({ setPage }) {
  const [activePage, setActivePage] = useState(
    localStorage.getItem('activePage') || 'dashboard'
  )

  const handlePageChange = (page) => {
    setActivePage(page)
    localStorage.setItem('activePage', page)
    setPage(page)
  }

  const menuItemClass = (page) =>
    `p-3 rounded-lg cursor-pointer transition ${
      activePage === page
        ? 'bg-blue-600'
        : 'hover:bg-gray-700'
    }`

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-5 shrink-0">

      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          E-Commerce
        </h1>

        <p className="text-xs text-gray-400 mt-1">
          Sales & Analytics
        </p>
      </div>

      <nav className="space-y-3">

        {/* Dashboard */}
        <div
          onClick={() => handlePageChange('dashboard')}
          className={menuItemClass('dashboard')}
        >
          Dashboard
        </div>

        {/* Sales Analytics */}
        <div
          onClick={() => handlePageChange('sales')}
          className={menuItemClass('sales')}
        >
          Sales Analytics
        </div>

        {/* Product Analytics */}
        <div
          onClick={() => handlePageChange('products')}
          className={menuItemClass('products')}
        >
          Product Analytics
        </div>

        {/* Upload Data */}
        <div
          onClick={() => handlePageChange('upload')}
          className={menuItemClass('upload')}
        >
          Upload Data
        </div>

        {/* Customer Analytics */}
        <div
          onClick={() => handlePageChange('customers')}
          className={menuItemClass('customers')}
        >
          Customer Analytics
        </div>

        {/* Regional Analytics */}
        <div
          onClick={() => handlePageChange('regional')}
          className={menuItemClass('regional')}
        >
          Regional Analytics
        </div>

        {/* Payment Analytics */}
        <div
          onClick={() => handlePageChange('payment')}
          className={menuItemClass('payment')}
        >
          Payment Analytics
        </div>

        {/* Orders */}
        <div
          onClick={() => handlePageChange('orders')}
          className={menuItemClass('orders')}
        >
          Orders
        </div>

      </nav>
    </div>
  )
}

export default Sidebar