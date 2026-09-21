import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

function SalesAnalytics() {
  const [monthlySales, setMonthlySales] = useState([])
  const [categorySales, setCategorySales] = useState([])
  const [categoryProfit, setCategoryProfit] = useState([])

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

  const fetchSalesData = async () => {
    try {
      setLoading(true)

      const params = buildParams()

      const [
        monthlyResponse,
        categoryResponse,
        profitResponse,
      ] = await Promise.all([
        axios.get(
          '/api/analytics/monthly-sales',
          { params }
        ),

        axios.get(
          '/api/analytics/category-sales',
          { params }
        ),

        axios.get(
          '/api/analytics/category-profit',
          { params }
        ),
      ])

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

      setCategoryProfit(
        profitResponse.data.map((item) => ({
          ...item,
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
        'Error fetching sales analytics:',
        error
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSalesData()
  }, [category, region, startDate, endDate])

  const clearFilters = () => {
    setCategory('')
    setRegion('')
    setStartDate('')
    setEndDate('')
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
          Loading sales analytics...
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Sales Analytics
        </h1>

        <p className="text-gray-500 mt-1">
          Analyze sales trends, category performance
          and profitability
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

      {/* Monthly Sales */}
      <div className="bg-white rounded-xl shadow-sm p-5">

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Monthly Sales Trend
        </h2>

        <div className="h-80">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
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

              <Line
                type="monotone"
                dataKey="sales"
                name="Sales"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Category Sales */}
        <div className="bg-white rounded-xl shadow-sm p-5">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Sales by Category
          </h2>

          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
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
                  maxBarSize={55}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Profit */}
        <div className="bg-white rounded-xl shadow-sm p-5">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Profit by Category
          </h2>

          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={categoryProfit}
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
                  width={75}
                  tick={{ fontSize: 12 }}
                />

                <Tooltip
                  formatter={(value) => [
                    formatFullCurrency(value),
                    'Profit',
                  ]}
                />

                <Legend />

                <Bar
                  dataKey="profit"
                  name="Profit"
                  fill="#16a34a"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={55}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  )
}

export default SalesAnalytics