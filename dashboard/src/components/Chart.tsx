import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Total Revenue",
      data: [447, 888, 624, 990, 774, 48, 741, 1000, 177, 539, 129, 100],
      borderColor: "rgb(41, 128, 185)",
    },
  ],
};

export const TotalRevenueChart = () => {
  const options = {};
  const data = {};
  return <Line options={options} data={chartData} />;
};
