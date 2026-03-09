import { useEffect, useState } from "react";
import { getLastWeekClosed } from "../api";

const Analysis = () => {
  const [lastWeek, setLastWeek] = useState([]);
  console.log(lastWeek);
  
  useEffect(()=>{
  fetchReports()
  },[])
  const fetchReports = async () => {
    try {
      const weekRes = await getLastWeekClosed();
      setLastWeek(weekRes?.data?.data);
    } catch (error) {
      console.error("Error loading reports", error);
    }
  };
  return (
    <div className='container mb-3'>
      <h2>Analysis Report</h2>
    </div>
  );
};
export { Analysis };
