import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

function ProductAnalytics() {
  const [products, setProducts] = useState([])

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

  const fetchProductData = async () => {
    try {
      setLoading(true)

      const response = await axios.get(
        'http://127.0.0.1:8000/api/analytics/top-products',
        {
          params: buildParams(),
        }
      )

      const formattedProducts =
        response.data.map((item) => ({
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

      setProducts(formattedProducts)

    } catch (error) {
      console.error(
        'Error fetching product analytics:',
        error
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductData()
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
          Loading product analytics...
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Product Analytics
        </h1>

        <p className="text-gray-500 mt-1">
          Analyze product sales and profitability
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

        {/* Product Sales */}
        <div className="bg-white rounded-xl shadow-sm p-5">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Top Products by Sales
          </h2>

          <div className="h-96">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={products}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 20,
                  left: 20,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                />

                <XAxis
                  type="number"
                  tickFormatter={formatCurrency}
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  type="category"
                  dataKey="product"
                  width={100}
                  tick={{ fontSize: 11 }}
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
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Product Profit */}
        <div className="bg-white rounded-xl shadow-sm p-5">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Top Products by Profit
          </h2>

          <div className="h-96">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={products}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 20,
                  left: 20,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                />

                <XAxis
                  type="number"
                  tickFormatter={formatCurrency}
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  type="category"
                  dataKey="product"
                  width={100}
                  tick={{ fontSize: 11 }}
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
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-sm p-5">

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Product Performance
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Sales and profit by product
            </p>
          </div>

          <span className="text-sm text-gray-500">
            {products.length} Products
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

              {products.map((product, index) => (
                <tr
                  key={product.product || index}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-gray-500">
                    {index + 1}
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-800">
                    {product.product}
                  </td>

                  <td className="px-4 py-3 text-right font-medium text-blue-600">
                    {formatFullCurrency(
                      product.sales
                    )}
                  </td>

                  <td className="px-4 py-3 text-right font-medium text-green-600">
                    {formatFullCurrency(
                      product.profit
                    )}
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    No product data found.
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

export default ProductAnalytics