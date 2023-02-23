import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const LineChart = ({ chartData }) => {
  return (
    <div className="chart-container w-full">
      <Line
        data={chartData}
        options={{
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              ticks: {
                color: "white",
              },
              grid: {
                display: false,
              }
            },
            y: {
              ticks: {
                color: "#929292",
              },
              grid: {
                color: "#282828",
              }
            }
          }
          // scales: {
          //   yAxes: [{
          //     ticks: {
          //       fontColor: "green",
          //       fontSize: 18,
          //       stepSize: 1,
          //       beginAtZero: true
          //     }
          //   }],
          //   xAxes: [{
          //     ticks: {
          //       fontColor: "purple",
          //       fontSize: 14,
          //       stepSize: 1,
          //       beginAtZero: true
          //     }
          //   }]
          // }
        }}
      />
    </div>
  );
};
export default LineChart;
