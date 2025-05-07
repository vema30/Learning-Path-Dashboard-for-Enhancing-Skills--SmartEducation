import { useState, useEffect } from "react"
import { Chart, registerables } from "chart.js"
import { Pie } from "react-chartjs-2"

Chart.register(...registerables)

export default function InstructorChart({ courses = [], totalAmount = 0, totalStudents = 0 }) {
  const [currChart, setCurrChart] = useState("students")
  const [chartColors, setChartColors] = useState([])

  useEffect(() => {
    console.log("Courses Data:", courses)
    console.log("Total Amount:", totalAmount)
    console.log("Total Students:", totalStudents)

    // Generate colors only once on component mount or when courses change
    setChartColors(generateRandomColors(courses.length))
  }, [courses, totalAmount, totalStudents])

  const generateRandomColors = (numColors) => {
    const colors = []
    for (let i = 0; i < numColors; i++) {
      const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`
      colors.push(color)
    }
    return colors
  }

  // Get the number of students in each course, ensure it handles missing values.
  const studentData = courses.map(course => Number(course.studentsEnrolled?.length || 0))

  // Get the income data for each course, checking if totalAmountGenerated exists.
  const incomeData = courses.map(course => {
    const amount = Number(course.price || 0)  // Default to 0 if not available
    return isNaN(amount) ? 0 : amount
  })

  const hasStudentData = studentData.some(val => val > 0)
  const hasIncomeData = incomeData.some(val => val > 0)

  const chartDataStudents = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: studentData,
        backgroundColor: chartColors,
      },
    ],
  }

  const chartIncomeData = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: incomeData,
        backgroundColor: chartColors,
      },
    ],
  }

  const combinedChartData = {
    labels: ["Total Students", "Total Income"],
    datasets: [
      {
        data: [Number(totalStudents), Number(totalAmount)],
        backgroundColor: ["#facc15", "#3b82f6"],
      },
    ],
  }

  const options = {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`
          },
        },
      },
      legend: {
        position: "bottom",
        labels: {
          color: "#ffffff",
        },
      },
    },
  }

  const renderChart = () => {
    if (currChart === "students" && !hasStudentData) {
      return <p className="text-center text-yellow-50">No student data available</p>
    }

    if (currChart === "income" && !hasIncomeData) {
      return <p className="text-center text-yellow-50">No income data available</p>
    }

    return (
      <div className="relative mx-auto h-[300px] w-[300px] sm:h-[400px] sm:w-[400px]">
        <Pie
          data={
            currChart === "students"
              ? chartDataStudents
              : currChart === "income"
              ? chartIncomeData
              : combinedChartData
          }
          options={options}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
      <div className="space-x-4 font-semibold">
        {["students", "income", "combined"].map((type) => (
          <button
            key={type}
            onClick={() => setCurrChart(type)}
            className={`rounded-sm p-1 px-3 transition-all duration-200 ${
              currChart === type
                ? "bg-richblack-700 text-yellow-50"
                : "text-yellow-400"
            }`}
          >
            {type === "students"
              ? "Students"
              : type === "income"
              ? "Income"
              : "Total Stats"}
          </button>
        ))}
      </div>
      {renderChart()}
    </div>
  )
}
