import React, { useState } from 'react';
import './chartPopup-display.css';
import { SpreadsheetModel } from 'models/spreadsheet.model';

import './chart-container-display.css';
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

export default function BarChartPopUp(props) {
    const [spreadsheet, setSpreadsheet] = useState(SpreadsheetModel.getInstance())
    const {chartType, showChartPopup, setShowChartPopup} = props;
    
    const [title, setTitle] = useState('');
    const [xLabel, setXLabel] = useState('');
    const [yLabel, setYLabel] = useState('');
    const [data, setData] = useState('');

    const [chartData, setChartData] = useState(null); // Store chart data
    const [showBarChart, setShowBarChart] = useState(false);



    const handleGenerate = () => {
        spreadsheet.createChart(title, data, xLabel, yLabel, chartType)
        const chart_data = spreadsheet.getChartData();
        console.log("Generating a Bar Chart")
    // Update chartData to match the expected format
        setChartData({
            type: "bar",
            data: {
                labels: chart_data.data.labels, // Extract labels
                datasets: chart_data.data.datasets, // Extract datasets
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: chart_data.title, // Use the provided title
                        font: {
                            size: 18,
                        },
                        padding: {
                            top: 10,
                            bottom: 20,
                        },
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: chart_data.xLabel, // Use x-axis label
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: chart_data.yLabel, // Use y-axis label
                        },
                        beginAtZero: true, // Start y-axis at zero
                    },
                },
            },
        });
        setShowBarChart(true);
    };

    const handleDeleteChart = () => {
    setChartData(null); // Clear chart data
    setShowBarChart(false); // Hide chart container
    };

    return (
    <div className={showChartPopup ? "chart-popup show" : "chart-popup"}>
        <div className="popup-container">
            <div className="popup-header">
                <h3>Generate a Bar Chart</h3>
                <button
                    className="close-btn"
                    onClick={() => {
                        setShowChartPopup(false);
                    }}
                >
                    X
                </button>
            </div>
            <div className="title-container">
                <label htmlFor="title" className="title-label">Title:</label>
                <input
                    id="title"
                    className="title-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                />
            </div>
            <div className="data-container">
                <label htmlFor="data" className="data-label">Data:</label>
                <textarea
                    id="data"
                    className="data-input"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    placeholder="Data (e.g., JSON format for labels and datasets)"
                />
            </div>
            <div className="popup-footer">
                <button onClick={handleGenerate}>Generate</button>
                <button
                    onClick={() => {
                        setShowChartPopup(false);
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
        {/* Chart container */}
        {showBarChart && chartData && (
            <div className="chart-container">
                {/* Title */}
                <div className="chart-title">{title}</div>

                {/* Chart */}
                <div className="chart-area">
                    <Bar data={chartData.data} options={chartData.options} />
                </div>

                {/* Delete Chart Button */}
                <button
                    className="delete-chart-btn"
                    onClick={handleDeleteChart}
                >
                    X
                </button>
            </div>
        )}
    </div>
    );
}