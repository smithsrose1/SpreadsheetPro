import React, { useRef, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './chart-container-display.css';
import './chartPopup-display.css';
import { SpreadsheetModel } from 'models/spreadsheet.model';
import './chart-container-display.css';
import { Pie } from 'react-chartjs-2';


ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChartPopUp(props) {
    const [spreadsheet, setSpreadsheet] = useState(SpreadsheetModel.getInstance());
    const { chartType, showChartPopup, setShowChartPopup } = props;

    const [title, setTitle] = useState('');
    const [data, setData] = useState('');
    const [chartData, setChartData] = useState(null); // Store the chart data for the Pie component
    const [showPieChart, setShowPieChart] = useState(false);

    const handleGenerate = () => {
        spreadsheet.createChart(title, data, '', '', chartType);
        const chart_data = spreadsheet.getChartData();
        console.log("Generating a Pie Chart");
        setChartData({
            labels: chart_data.data.map((item) => item.label), // Chart labels
            datasets: [
                {
                    data: chart_data.data.map((item) => item.value), // Chart values
                    backgroundColor: ['red', 'blue', 'green', 'yellow', 'purple'], // Customize colors
                    borderWidth: 1,
                },
            ],
        });
        setShowPieChart(true);
    };

    const handleDeleteChart = () => {
        setChartData(null); // Clear the chart data
        setShowPieChart(false); // Hide the chart container
    };

    return (
        <div className={showChartPopup ? "chart-popup show" : "chart-popup"}>
            <div className="popup-container">
                <div className="popup-header">
                    <h3>Generate a PieChart</h3>
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
                        placeholder="Data"
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
            {showPieChart && chartData && (
                <div className="chart-container">
                    {/* Title at the top */}
                    <div className="chart-title">{title}</div>

                    {/* Chart */}
                    <div className="chart-area">
                        <Pie
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false, // Disable aspect ratio enforcement
                                plugins: {
                                    legend: {
                                        position: 'bottom', // Position legend at the bottom
                                    },
                                },
                            }}
                        />
                    </div>

                    {/* Button to delete the chart */}
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
