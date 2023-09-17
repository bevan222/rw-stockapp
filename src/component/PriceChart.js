import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const priceChart = ({ stockData, stockInformation }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: stockData.data[0].date + ' - ' + stockData.data[stockData.data.length - 1].date + ' 價格走勢圖',
      },
    },
  };

  let labels = [];
  stockData.data.map((item) => {
    labels.push(item.date)
  })

  const data = {
    labels,
    datasets: [
      {
        label: stockData.symbol + stockInformation.nameZhTw + ' 收盤價',
        data: stockData.data.map((item) => item.close),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };
  return <Line options={options} data={data} />;
}

export default priceChart;
