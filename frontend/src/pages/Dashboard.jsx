import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  ResponsiveContainer,
  LineChart,
  Line,
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

function Dashboard({ setPage }) {
  const [summary, setSummary] = useState({
    total_sales: 0,
    total_profit: 0,
    total_orders: 0,
    total_customers: 0,
    average_order_value: 0,
  })

  const [monthlySales, setMonthlySales] = useState([])
  const [categorySales, setCategorySales] = useState([])
  const [regionSales, setRegionSales] = useState([])
  const [topProducts, setTopProducts] = useState([])

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
    return `₹${Number(value || 0).toLocaleString('en-IN', {
      maximumFractionDigits: 2,
    })}`
  }

  const buildParams = () => {
    const params = {}

    if (category) {
      params.category = category
    }

    if (region) {
      params.region = region
    }

    if (startDate) {
      params.start_date = startDate
    }

    if (endDate) {
      params.end_date = endDate
    }

    return params
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      const params = buildParams()

      const [
        summaryResponse,
        monthlyResponse,
        categoryResponse,
        regionResponse,
        productsResponse,
      ] = await Promise.all([
        axios.get(
          '/api/analytics/summary',
          { params }
        ),

        axios.get(
          '/api/analytics/monthly-sales',
          { params }
        ),

        axios.get(
          '/api/analytics/category-sales',
          { params }
        ),

        axios.get(
          '/api/analytics/region-sales',
          { params }
        ),

        axios.get(
          '/api/analytics/top-products',
          { params }
        ),
      ])

      setSummary(summaryResponse.data)

      setMonthlySales(
        monthlyResponse.data.map((item) => ({
          ...item,
          sales: Number(
            item.sales ??
            item.total_sales ??
            item.Total_Sales ??
            0
          ),
        }))
      )

      setCategorySales(
        categoryResponse.data.map((item) => ({
          ...item,
          sales: Number(
            item.sales ??
            item.total_sales ??
            item.Total_Sales ??
            0
          ),
        }))
      )

      setRegionSales(
        regionResponse.data.map((item) => ({
          ...item,
          sales: Number(
            item.sales ??
            item.total_sales ??
            item.Total_Sales ??
            0
          ),
        }))
      )

      setTopProducts(
        productsResponse.data.map((item) => ({
          ...item,
          sales: Number(
            item.sales ??
            item.total_sales ??
            item.Total_Sales ??
            0
          ),
          profit: Number(
            item.profit ??
            item.total_profit ??
            item.Total_Profit ??
            0
          ),
        }))
      )

    } catch (error) {
      console.error(
        'Error fetching dashboard data:',
        error
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [
    category,
    region,
    startDate,
    endDate,
  ])

  const clearFilters = () => {
    setCategory('')
    setRegion('')
    setStartDate('')
    setEndDate('')
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
          Loading dashboard...
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Overview of your e-commerce sales and customer analytics
          </p>
        </div>

        <button
          onClick={() => setPage('orders')}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          View All Orders →
        </button>

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
              onChange={(e) => setCategory(e.target.value)}
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
              onChange={(e) => setRegion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              From Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
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
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

        {/* Total Sales */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Sales
              </p>

              <h2 className="text-2xl font-bold text-blue-600 mt-2">
                {formatCurrency(summary.total_sales)}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
              💰
            </div>
          </div>
        </div>

        {/* Total Profit */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Profit
              </p>

              <h2 className="text-2xl font-bold text-green-600 mt-2">
                {formatCurrency(summary.total_profit)}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl">
              📈
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Orders
              </p>

              <h2 className="text-2xl font-bold text-purple-600 mt-2">
                {Number(summary.total_orders || 0).toLocaleString('en-IN')}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-xl">
              🛒
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Customers
              </p>

              <h2 className="text-2xl font-bold text-orange-600 mt-2">
                {Number(summary.total_customers || 0).toLocaleString('en-IN')}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center text-xl">
              👥
            </div>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Average Order Value
              </p>

              <h2 className="text-2xl font-bold text-red-600 mt-2">
                {formatCurrency(summary.average_order_value)}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-xl">
              🧾
            </div>
          </div>
        </div>

      </div>

      {/* Monthly Sales */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={monthlySales}
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
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickMargin={8}
            />

            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12 }}
              width={75}
              tickMargin={8}
            />

            <Tooltip
              formatter={(value) => [
                formatFullCurrency(value),
                'Sales',
              ]}
              labelFormatter={(label) =>
                `Month: ${label}`
              }
              contentStyle={{
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                boxShadow:
                  '0 4px 12px rgba(0,0,0,0.08)',
              }}
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="sales"
              name="Sales"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{
                r: 4,
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category + Region */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Category Sales */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categorySales}
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
                dataKey="category"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fontSize: 12 }}
                width={75}
              />

              <Tooltip
                formatter={(value) => [
                  formatFullCurrency(value),
                  'Sales',
                ]}
                contentStyle={{
                  borderRadius: '10px',
                  border: '1px solid #e5e7eb',
                  boxShadow:
                    '0 4px 12px rgba(0,0,0,0.08)',
                }}
              />

              <Legend />

              <Bar
                dataKey="sales"
                name="Sales"
                fill="#2563eb"
                radius={[6, 6, 0, 0]}
                maxBarSize={55}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Region Sales */}
        <div className="bg-white rounded-xl shadow-sm p-5">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Sales by Region
          </h2>

          <div className="h-80">

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={regionSales}
                  dataKey="sales"
                  nameKey="region"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label
                >

                  {regionSales.map(
                    (_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          [
                            '#2563eb',
                            '#16a34a',
                            '#f59e0b',
                            '#dc2626',
                          ][index % 4]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip
                  formatter={(value) =>
                    formatFullCurrency(value)
                  }
                />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow-sm p-5">

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Top Products
        </h2>

        <div className="overflow-x-auto">

          <table className="min-w-full text-sm">

            <thead className="bg-gray-50">

              <tr>

                <th className="px-4 py-3 text-left">
                  Product
                </th>

                <th className="px-4 py-3 text-right">
                  Sales
                </th>

                <th className="px-4 py-3 text-right">
                  Profit
                </th>

              </tr>

            </thead>

            <tbody className="divide-y">

              {topProducts.map((product, index) => (

                <tr
                  key={product.product || index}
                  className="hover:bg-gray-50"
                >

                  <td className="px-4 py-3 font-medium">
                    {product.product}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {formatFullCurrency(product.sales)}
                  </td>

                  <td className="px-4 py-3 text-right text-green-600 font-medium">
                    {formatFullCurrency(product.profit)}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}

export default Dashboard