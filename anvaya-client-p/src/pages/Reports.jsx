import { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
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
  console.log('Closed last week:', closedLastWeek);
  
  weekAgo.setDate();
  return (
    <div>
      <h2>Report Page</h2>
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
), you would accidentally get every lead closed from the beginning of time up until last week, excluding the recent ones you actually want! */
