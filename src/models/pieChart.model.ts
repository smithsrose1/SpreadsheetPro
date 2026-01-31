import { Chart } from "./chart.model";

export class PieChart extends Chart {

    public render(): void {
        this.extractData();

        // Prepare chartData as labels and values for a pie chart
        this.chartData = {
            type: "pie",
            data: this.convertedData.filter(row => row[0] !== undefined && row[1] !== undefined && !isNaN(Number(row[1]))) // Filter out invalid rows
            .map(row => ({
                label: String(row[0]), // First column is the label
                value: Number(row[1])  // Second column is the numeric value
            })),
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: this.title,  // Use the title from the Chart object
                        font: {
                            size: 18  // Adjust font size for title
                        },
                        padding: {
                            top: 10,
                            bottom: 20
                        }
                    }
                }
            }
        };


        console.log("Pie chart data prepared:", this.chartData);
    }

}