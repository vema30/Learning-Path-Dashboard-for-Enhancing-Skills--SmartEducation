import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    // Fetch the dashboard data from Flask
    axios.get("http://localhost:5000/api/dashboard")
      .then((res) => {
        setData(res.data);
      });
  }, []);

  useEffect(() => {
    if (Object.keys(data).length === 0) return;

    const {
      valuecounts, levelcounts, subjectsperlevel,
      subscriberscountmap, yearwiseprofitmap,
      profitmonthwise, monthwisesub
    } = data;

    // Chart 1
    new Chart(document.getElementById("chart1"), {
      type: "doughnut",
      data: {
        labels: Object.keys(valuecounts),
        datasets: [{
          data: Object.values(valuecounts),
          backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56"]
        }]
      }
    });

    // Add other charts similarly (copy config from original template)

  }, [data]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-center">Subscribers Domain Wise</h2>
          <canvas id="chart1" width="400" height="400"></canvas>
        </div>

        {/* Add other chart cards here */}
      </div>
    </div>
  );
};

export default Dashboard;
