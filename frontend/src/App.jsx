import { useState } from 'react'
import Orders from './pages/Orders'
import CustomerAnalytics from './pages/CustomerAnalytics'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import ProductAnalytics from './pages/ProductAnalytics'
import SalesAnalytics from './pages/SalesAnalytics'
import RegionalAnalytics from './pages/RegionalAnalytics'
import PaymentAnalytics from './pages/PaymentAnalytics'
import UploadData from './pages/UploadData'
import Login from './pages/Login'
import Register from './pages/Register'


function App() {

  const [page, setPage] = useState(
    localStorage.getItem('access_token')
      ? 'dashboard'
      : 'login'
  )


  return (
    <>
      
      {/* LOGIN */}

      {page === 'login' && (
        <Login setPage={setPage} />
      )}


      {/* REGISTER */}

      {page === 'register' && (
        <Register setPage={setPage} />
      )}


      {/* MAIN APPLICATION */}

      {page !== 'login' && page !== 'register' && (

        <div className="flex min-h-screen bg-gray-100">

          {/* SIDEBAR */}

          <Sidebar setPage={setPage} />


          {/* RIGHT SIDE */}

          <div className="flex-1 min-w-0">

            {/* NAVBAR */}

            <Navbar
              setPage={setPage}
              currentPage={page}
            />

            {/* PAGE CONTENT */}

            <main className="w-full">

              {page === 'dashboard' && (
                <Dashboard setPage={setPage} />
              )}


              {page === 'sales' && (
                <SalesAnalytics />
              )}


              {page === 'products' && (
                <ProductAnalytics />
              )}


              {page === 'customers' && (
                <CustomerAnalytics />
              )}


              {page === 'regional' && (
                <RegionalAnalytics />
              )}


              {page === 'payment' && (
                <PaymentAnalytics />
              )}


              {page === 'upload' && (
                <UploadData />
              )}

              {page === 'orders' && (
                <Orders />
              )}

            </main>

          </div>

        </div>

      )}

    </>
  )
}


export default App