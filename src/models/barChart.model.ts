import { Chart } from "./chart.model";

export class BarChart extends Chart {

    public render(): void {
        this.extractData();

        const labels = this.convertedData.slice(1).map(row => row[0]); // ["mon", "tue"]

        const datasets = [];
        for (let colIndex = 1; colIndex < this.convertedData[0].length; colIndex++) {
            datasets.push({
                label: this.convertedData[0][colIndex], // "exp1", "exp2"
                data: this.convertedData.slice(1).map(row => Number(row[colIndex])), // [35, 75], [45, 85]
                backgroundColor: `hsl(${(colIndex * 360) / this.convertedData[0].length}, 100%, 50%)` // Dynamic colors
            });
        }

        this.chartData = {
            type: "bar",
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
                    x: { title: { display: true, text: this.xLabel } },
                    y: { title: { display: true, text: this.yLabel }, beginAtZero: true }
                }
            }
        };

        console.log("Bar chart data prepared:", this.chartData);
    }

}