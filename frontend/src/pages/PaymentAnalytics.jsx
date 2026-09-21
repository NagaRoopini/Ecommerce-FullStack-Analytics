import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

function PaymentAnalytics() {
  const [payments, setPayments] = useState([])

  const [category, setCategory] = useState('')
  const [region, setRegion] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [loading, setLoading] = useState(true)

  const formatCurrency = (value) => {
    const number = Number(value || 0)

    if (number >= 10000000) {
      return `₹${(number / 10000000).toFixed(2)}Cr`
    }

    if (number >= 100000) {
      return `₹${(number / 100000).toFixed(2)}L`
    }

    if (number >= 1000) {
      return `₹${(number / 1000).toFixed(2)}K`
    }

    return `₹${number.toFixed(2)}`
  }

  const formatFullCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString(
      'en-IN',
      {
        maximumFractionDigits: 2,
      }
    )}`
  }

  const buildParams = () => {
    const params = {}

    if (category) params.category = category
    if (region) params.region = region
    if (startDate) params.start_date = startDate
    if (endDate) params.end_date = endDate

    return params
  }

  const fetchPaymentData = async () => {
    try {
      setLoading(true)

      const response = await axios.get(
        '/api/analytics/payment-methods',
        {
          params: buildParams(),
        }
      )

      const formattedPayments =
        response.data.map((item) => ({
          ...item,

          sales: Number(
            item.sales ??
            item.total_sales ??
            item.total_spending ??
            item.Total_Sales ??
            0
          ),

          orders: Number(
            item.orders ??
            item.total_orders ??
            item.Total_Orders ??
            0
          ),
        }))

      setPayments(formattedPayments)

    } catch (error) {
      console.error(
        'Error fetching payment analytics:',
        error
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPaymentData()
  }, [category, region, startDate, endDate])

  const clearFilters = () => {
    setCategory('')
    setRegion('')
    setStartDate('')
    setEndDate('')
  }

  const paymentColors = [
    '#2563eb',
    '#16a34a',
    '#f59e0b',
    '#dc2626',
    '#9333ea',
  ]

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
          Loading payment analytics...
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Payment Analytics
        </h1>

        <p className="text-gray-500 mt-1">
          Analyze sales and orders across payment methods
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-5">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Filters
          </h2>

          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              onChange={(e) =>
                setRegion(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                All Regions
              </option>

              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
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
              onChange={(e) =>
                setStartDate(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              onChange={(e) =>
                setEndDate(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Payment Sales */}
        <div className="bg-white rounded-xl shadow-sm p-5">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Sales by Payment Method
          </h2>

          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={payments}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                />

                <XAxis
                  dataKey="payment_method"
                  tick={{ fontSize: 11 }}
                />

                <YAxis
                  tickFormatter={formatCurrency}
                  width={75}
                  tick={{ fontSize: 12 }}
                />

                <Tooltip
                  formatter={(value) => [
                    formatFullCurrency(value),
                    'Sales',
                  ]}
                />

                <Legend />

                <Bar
                  dataKey="sales"
                  name="Sales"
                  fill="#2563eb"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Payment Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-5">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Payment Method Distribution
          </h2>

          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>

                <Pie
                  data={payments}
                  dataKey="sales"
                  nameKey="payment_method"
                  cx="50%"
                  cy="50%"
                  outerRadius={105}
                  label
                >
                  {payments.map((item, index) => (
                    <Cell
                      key={
                        item.payment_method ||
                        index
                      }
                      fill={
                        paymentColors[
                          index % paymentColors.length
                        ]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => [
                    formatFullCurrency(value),
                    'Sales',
                  ]}
                />

                <Legend />

              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>

      {/* Payment Table */}
      <div className="bg-white rounded-xl shadow-sm p-5">

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Payment Performance
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Sales and order count by payment method
            </p>
          </div>

          <span className="text-sm text-gray-500">
            {payments.length} Methods
          </span>
        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full text-sm">

            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  #
                </th>

                <th className="px-4 py-3 text-left">
                  Payment Method
                </th>

                <th className="px-4 py-3 text-right">
                  Orders
                </th>

                <th className="px-4 py-3 text-right">
                  Sales
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {payments.map((item, index) => (
                <tr
                  key={
                    item.payment_method ||
                    index
                  }
                  className="hover:bg-gray-50 transition"
                >

                  <td className="px-4 py-3 text-gray-500">
                    {index + 1}
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-800">
                    {item.payment_method}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {item.orders.toLocaleString(
                      'en-IN'
                    )}
                  </td>

                  <td className="px-4 py-3 text-right font-medium text-blue-600">
                    {formatFullCurrency(item.sales)}
                  </td>

                </tr>
              ))}

              {payments.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    No payment data found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  )
}

export default PaymentAnalytics