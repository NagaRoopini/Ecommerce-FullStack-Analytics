import { useEffect, useState } from 'react'
import axios from 'axios'

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [region, setRegion] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [page, setPage] = useState(1)
  const [limit] = useState(20)

  const [pagination, setPagination] = useState({
    total_records: 0,
    total_pages: 0,
  })

  const fetchOrders = async () => {
    try {
      setLoading(true)

      const params = {
        page,
        limit,
      }

      if (search) params.search = search
      if (category) params.category = category
      if (region) params.region = region
      if (paymentMethod) {
        params.payment_method = paymentMethod
      }
      if (startDate) params.start_date = startDate
      if (endDate) params.end_date = endDate

      const response = await axios.get(
        'http://127.0.0.1:8000/api/orders',
        {
          params,
        }
      )

      setOrders(response.data.data || [])

      setPagination(
        response.data.pagination || {
          total_records: 0,
          total_pages: 0,
        }
      )
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [
    page,
    category,
    region,
    paymentMethod,
    startDate,
    endDate,
  ])

  const handleSearch = (e) => {
    e.preventDefault()

    setPage(1)

    fetchOrders()
  }

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setRegion('')
    setPaymentMethod('')
    setStartDate('')
    setEndDate('')
    setPage(1)
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Orders
        </h1>

        <p className="text-gray-500 mt-1">
          View and manage all customer orders
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-5">

        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Order ID, customer, product..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                setPage(1)
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
            >
              <option value="">
                All Categories
              </option>

              <option value="Electronics">
                Electronics
              </option>

              <option value="Clothing">
                Clothing
              </option>

              <option value="Furniture">
                Furniture
              </option>

              <option value="Beauty">
                Beauty
              </option>

              <option value="Books">
                Books
              </option>
            </select>
          </div>

          {/* Region */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Region
            </label>

            <select
              value={region}
              onChange={(e) => {
                setRegion(e.target.value)
                setPage(1)
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
            >
              <option value="">
                All Regions
              </option>

              <option value="North">
                North
              </option>

              <option value="South">
                South
              </option>

              <option value="East">
                East
              </option>

              <option value="West">
                West
              </option>
            </select>
          </div>

          {/* Payment */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Payment Method
            </label>

            <select
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value)
                setPage(1)
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
            >
              <option value="">
                All Payments
              </option>

              <option value="UPI">
                UPI
              </option>

              <option value="Credit Card">
                Credit Card
              </option>

              <option value="Debit Card">
                Debit Card
              </option>

              <option value="Cash on Delivery">
                Cash on Delivery
              </option>

              <option value="Net Banking">
                Net Banking
              </option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              From Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value)
                setPage(1)
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              To Date
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value)
                setPage(1)
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-end gap-3 lg:col-span-2">

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Search
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Clear Filters
            </button>

          </div>

        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {/* Table Header */}
        <div className="px-5 py-4 border-b flex justify-between items-center">

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Order List
            </h2>

            <p className="text-sm text-gray-500">
              {pagination.total_records} total orders
            </p>
          </div>

        </div>

        {/* Table Container */}
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">

          {loading ? (

            <div className="p-10 text-center text-gray-500">
              Loading orders...
            </div>

          ) : orders.length === 0 ? (

            <div className="p-10 text-center text-gray-500">
              No orders found.
            </div>

          ) : (

            <table className="min-w-full text-sm">

              {/* Table Head */}
              <thead className="bg-gray-100 sticky top-0 z-10">

                <tr>

                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Order ID
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Product
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Qty
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sales
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Discount
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Profit
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Region
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    City
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment
                  </th>

                </tr>

              </thead>

              {/* Table Body */}
              <tbody className="divide-y">

                {orders.map((order) => (

                  <tr
                    key={order.order_id}
                    className="hover:bg-blue-50 transition-colors"
                  >

                    {/* Order ID */}
                    <td className="px-4 py-3 font-medium text-blue-600">
                      {order.order_id}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3">
                      {order.order_date}
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3">
                      {order.customer_id}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">

                      <span className="inline-flex px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                        {order.category}
                      </span>

                    </td>

                    {/* Product */}
                    <td className="px-4 py-3">
                      {order.product}
                    </td>

                    {/* Quantity */}
                    <td className="px-4 py-3 text-right">
                      {order.quantity}
                    </td>

                    {/* Sales */}
                    <td className="px-4 py-3 text-right font-semibold text-blue-600">
                      {formatCurrency(order.sales)}
                    </td>

                    {/* Discount */}
                    <td className="px-4 py-3 text-right">
                      {(Number(order.discount) * 100).toFixed(0)}%
                    </td>

                    {/* Profit */}
                    <td className="px-4 py-3 text-right font-semibold text-green-600">
                      {formatCurrency(order.profit)}
                    </td>

                    {/* Region */}
                    <td className="px-4 py-3">
                      {order.region}
                    </td>

                    {/* City */}
                    <td className="px-4 py-3">
                      {order.city}
                    </td>

                    {/* Payment */}
                    <td className="px-4 py-3">

                      <span className="inline-flex px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                        {order.payment_method}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

        {/* Pagination */}
        <div className="px-5 py-4 border-t flex items-center justify-between">

          <p className="text-sm text-gray-500">
            Page {page} of {pagination.total_pages || 1}
          </p>

          <div className="flex items-center gap-2">

            {/* Previous */}
            <button
              disabled={page === 1}
              onClick={() =>
                setPage((prev) => prev - 1)
              }
              className="px-3 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-100"
            >
              Previous
            </button>

            {/* First Page */}
            <button
              onClick={() => setPage(1)}
              className={`px-3 py-2 border rounded-lg ${
                page === 1
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'hover:bg-gray-100'
              }`}
            >
              1
            </button>

            {/* Left Dots */}
            {page > 3 && (
              <span className="px-2 text-gray-500">
                ...
              </span>
            )}

            {/* Middle Pages */}
            {Array.from(
              { length: 3 },
              (_, index) => page - 1 + index
            )
              .filter(
                (pageNumber) =>
                  pageNumber > 1 &&
                  pageNumber < pagination.total_pages
              )
              .map((pageNumber) => (

                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`px-3 py-2 border rounded-lg ${
                    page === pageNumber
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {pageNumber}
                </button>

              ))}

            {/* Right Dots */}
            {page < pagination.total_pages - 2 && (
              <span className="px-2 text-gray-500">
                ...
              </span>
            )}

            {/* Last Page */}
            {pagination.total_pages > 1 && (
              <button
                onClick={() =>
                  setPage(pagination.total_pages)
                }
                className={`px-3 py-2 border rounded-lg ${
                  page === pagination.total_pages
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'hover:bg-gray-100'
                }`}
              >
                {pagination.total_pages}
              </button>
            )}

            {/* Next */}
            <button
              disabled={
                page >= pagination.total_pages
              }
              onClick={() =>
                setPage((prev) => prev + 1)
              }
              className="px-3 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-100"
            >
              Next
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Orders