import { Chart } from "./chart.model";

export class LinearChart extends Chart {

    public render(): void {
        this.extractData();
        const labels: string[] = []; // To hold the X-axis data (Days)
        const datasets: any[] = []; // To hold the Y-axis data (Experiments)

        // Assuming `this.convertedData` contains the values in a 2D array format
        // Format of this.convertedData: [["Monday", 2, 3], ["Tuesday", 3, 4], ...]

        // Extract the first row to get labels (days)
        const x_axis = this.convertedData.map(row => row[0]).slice(1);

        // Prepare labels for the X-axis
        labels.push(...x_axis);
        const experimentLabels = this.convertedData[0].slice(1); // First row, excluding the first column (Days)
        const colors = ['blue', 'green', 'red', 'purple', 'orange', 'yellow']; // Add more colors as needed


        // Loop through experimentData to generate datasets (each experiment is a separate line)
        for (let colIndex = 1; colIndex < this.convertedData[0].length; colIndex++) {
            const experimentData = this.convertedData.map(row => row[colIndex]).slice(1); // Get all the values for this experiment column
        
            const dataset = {
                label: experimentLabels[colIndex-1], // Label for each experiment (e.g., "Experiment 1", "Experiment 2")
                data: experimentData, // Data for the Y-axis (experiment values)
                fill: false, // Don't fill the area under the line
                borderColor: colors[colIndex - 1], // Color for the line
                tension: 0.1 // Line curve (adjust as needed)
            };
        
            datasets.push(dataset); // Add the dataset for this experiment
        }

        // Prepare chartData as a series of points for a line chart
        this.chartData = {
            type: "line",
            data: {
                labels, // ["mon", "tue", "wed"]
                datasets // [{ label: "Series 1", data: [35, 40, 50], ... }, ...]
            },

            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true, // Enables the title
                        text: this.title, // Use the title from the Chart object
                        font: {
                            size: 18 // Adjust font size
                        },
                        padding: {
                            top: 10,
                            bottom: 20
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: this.xLabel // Set x-axis label
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: this.yLabel // Set y-axis label
                        },
                        beginAtZero: true // Ensure y-axis starts from 0
                    }
                }
            }
        };

        console.log("Line chart data prepared:", this.chartData);
    }
}