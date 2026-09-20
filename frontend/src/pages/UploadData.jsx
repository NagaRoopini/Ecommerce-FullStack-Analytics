import { useState } from 'react'
import axios from 'axios'

function UploadData() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]

    setError('')
    setResult(null)

    if (!selectedFile) {
      setFile(null)
      return
    }

    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setError('Please select a CSV file only.')
      setFile(null)
      return
    }

    setFile(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a CSV file first.')
      return
    }

    setError('')
    setResult(null)

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post(
        'http://127.0.0.1:8000/api/upload/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      setResult(response.data)
      setFile(null)

      // Reset file input
      const fileInput =
        document.getElementById('csv-upload')

      if (fileInput) {
        fileInput.value = ''
      }

    } catch (error) {
      console.error('Upload error:', error)

      setError(
        error.response?.data?.detail ||
        'File upload failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Upload Data
        </h1>

        <p className="text-gray-500 mt-1">
          Upload your e-commerce sales data using a CSV file
        </p>
      </div>

      {/* Upload Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">

        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Upload CSV File
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Select a CSV file containing your sales data.
        </p>

        {/* File Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-blue-400 transition">

          <div className="text-5xl mb-4">
            📂
          </div>

          <p className="text-gray-700 font-medium">
            Select your CSV file
          </p>

          <p className="text-sm text-gray-500 mt-1 mb-5">
            Only .csv files are supported
          </p>

          <label
            htmlFor="csv-upload"
            className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition font-medium"
          >
            Choose CSV File
          </label>

          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

        </div>

        {/* Selected File */}
        {file && (
          <div className="mt-5 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between gap-4">

            <div className="min-w-0">
              <p className="font-medium text-blue-800 truncate">
                {file.name}
              </p>

              <p className="text-sm text-blue-600 mt-1">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setFile(null)

                const fileInput =
                  document.getElementById(
                    'csv-upload'
                  )

                if (fileInput) {
                  fileInput.value = ''
                }
              }}
              className="text-red-600 hover:text-red-800 font-medium text-sm"
            >
              Remove
            </button>

          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className={`w-full mt-6 p-3 rounded-lg font-semibold text-white transition ${
            !file || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading
            ? 'Uploading...'
            : 'Upload CSV'}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
            {error}
          </div>
        )}

        {/* Success */}
        {result && (
          <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-5">

            <h3 className="font-semibold text-green-800 mb-3">
              Upload Successful
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div className="bg-white rounded-lg p-4 border border-green-100">
                <p className="text-sm text-gray-500">
                  Total Rows
                </p>

                <p className="text-xl font-bold text-gray-800 mt-1">
                  {Number(
                    result.total_rows || 0
                  ).toLocaleString('en-IN')}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-100">
                <p className="text-sm text-gray-500">
                  Rows Inserted
                </p>

                <p className="text-xl font-bold text-green-600 mt-1">
                  {Number(
                    result.rows_inserted || 0
                  ).toLocaleString('en-IN')}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-100">
                <p className="text-sm text-gray-500">
                  Rows Skipped
                </p>

                <p className="text-xl font-bold text-orange-600 mt-1">
                  {Number(
                    result.rows_skipped || 0
                  ).toLocaleString('en-IN')}
                </p>
              </div>

            </div>

            {result.message && (
              <p className="text-sm text-green-700 mt-4">
                {result.message}
              </p>
            )}

          </div>
        )}

      </div>

      {/* Required Columns */}
      <div className="bg-white rounded-xl shadow-sm p-6">

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Required CSV Columns
        </h2>

        <div className="flex flex-wrap gap-2">

          {[
            'Order_ID',
            'Order_Date',
            'Customer_ID',
            'Category',
            'Product',
            'Quantity',
            'Sales',
            'Discount',
            'Profit',
            'Region',
            'City',
            'Payment_Mode',
          ].map((column) => (
            <span
              key={column}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
            >
              {column}
            </span>
          ))}

        </div>

      </div>

    </div>
  )
}

export default UploadData