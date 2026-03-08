import { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { url } from "../api";

const Report = () => {
  const [leads, setLeads] = useState([]);
  console.log(leads);

  useEffect(() => {
    fetchReports();
  }, []);
  const fetchReports = async () => {
    const res = await axios.get(`${url}/report/all-leads`);
    setLeads(res.data);
  };
  // REPORT: 1: CLOSED LAST WEEK
  const weekAgo = new Date();
  console.log("current date:", weekAgo);
  const todayDate = weekAgo.getDate();
  console.log("Today Date:", todayDate);
  weekAgo.setDate(todayDate - 7);
  console.log("last week date:", weekAgo);

  const closedLastWeek = leads.filter(
    (lead) =>
      lead.status === "Closed" &&
      lead.closedAt &&
      new Date(lead.closedAt) >= weekAgo,
  );
  console.log("Closed last week:", closedLastWeek);

  // REPORT 2: PIPELINE LEADS
  const pipelineLeads = leads.filter((lead) => lead.status !== "Closed");
  console.log("Total in pipeline:", pipelineLeads.length);

  // REPORT 3: CLOSED BY AGENT
  const closedByAgent = leads.reduce((acc, lead) => {
    if (lead.status === "Closed") {
      acc[lead.salesAgent] = (acc[lead.salesAgent] || 0) + 1;
    }
    return acc;
  }, {});
  console.log("Closed by agent:", closedByAgent);

  // REPORT 4: STATUS DISTRIBUTION

  const statusDistribution = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  console.log("Status Distribution:", statusDistribution);

  // CHART DATA
  const pipelineChart = {
    labels: ["Closed", "Pipeline"],
    datasets: [
      {
        label: "Totals",
        data: [closedLastWeek.length, pipelineLeads.length],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };
  const agentChart = {
    labels: Object.keys(closedByAgent),
    datasets: [
      {
        label: "Closed leads by agent",
        data: Object.values(closedByAgent),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const statusChart = {
    labels: Object.keys(statusDistribution),
    datasets: [
      {
        label: "Stauts",
        data: Object.values(statusDistribution),
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, //allow to set fixed hight in css
    plugins: {
      legend: {
        position: "bottom", //better for mobile
      },
    },
  };

  return (
    <div className='container mt-4'>
      <h2>CRM REPORT</h2>
      <div className='row'>
        <div className='col-md-6 mb-4'>
          {/* Closed vs Pipeline */}
          <div className='card p-3 h-100'>
            <h4>Leads Closed vs Pipeline</h4>
            <div style={{ height: "300px" }}>
              <Pie data={pipelineChart} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className='col-md-6 mb-4'>
          {/* Closed By Agent */}
          <div className='card p-3 h-100'>
            <h4>Closed Leads by sales agent</h4>
            <div style={{ height: "300px" }}>
              <Bar data={agentChart} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      <div className='col-12 mb-4'>
        {/* Status Distribution */}
        <div className='card p-3'>
          <h4>Lead status Distribution</h4>
          <div style={{ height: "400px", textAlign: "center" }}>
            <Doughnut data={statusChart} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};
export { Report };

/* In programming and date logic, "greater than" (
) means more recent or later in time.
Think of dates as a timeline moving from left (past) to right (future). On a timeline, 10:00 AM is "greater" than 9:00 AM.
The Logic Breakout
weekAgo: A point in time exactly 7 days in the past (e.g., March 1st).
lead.closedAt: The date the deal was actually finished (e.g., March 4th).
To find leads closed within the last week, you want dates that happened after your starting point.
The Example
Let's say today is March 8th.
weekAgo is March 1st.
Lead A closed on March 4th.
Lead B closed on February 20th.
The Comparison:
Lead A: Is March 4th 
 March 1st? TRUE. (It's more recent, so it stays in your report).
Lead B: Is February 20th 
 March 1st? FALSE. (It's further in the past, so it's filtered out).
If you used "less than" (
), you would accidentally get every lead closed from the beginning of time up until last week, excluding the recent ones you actually want! 


TO_EXPLORED_ABOUT CHART: https://codesandbox.io/p/sandbox/react-chart-js-xccdr6?file=%2Fsrc%2Fcomponents%2Flearning2%2Fcharts2%2FBarChart.jsx%3A14%2C47

*/
