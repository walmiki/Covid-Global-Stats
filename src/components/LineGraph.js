import numeral from "numeral";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "./LineGraph.css";

const options = {
	legend: {
		display: false,
	},
	elements: {
		point: {
			radius: 0,
		},
	},
	maintainAspectRatio: false,
	tooltip: {
		mode: "index",
		intersect: false,
		callback: {
			label: function (tooltipItem, data) {
				return numeral(tooltipItem.value).format("+0,0");
			},
		},
	},
	scales: {
		xAxes: [
			{
				type: "time",
				time: {
					format: "MM/DD/YY",
					tooltipFormat: "ll",
				},
			},
		],
		yAxes: [
			{
				gridLines: {
					display: false,
				},
				tricks: {
					callback: function (value, index, values) {
						return numeral(value).format("0a");
					},
				},
			},
		],
	},
};

function LineGraph({ casesType = "cases", ...props }) {
	const [data, setData] = useState({});

	const buildChartData = (data, casesType = "cases") => {
		const chartData = [];
		let lastDataPoint;

		for (let date in data.cases) {
			if (lastDataPoint) {
				const newDataPoint = {
					x: date,
					y: data[casesType][date] - lastDataPoint,
				};
				chartData.push(newDataPoint);
			}
			lastDataPoint = data[casesType][date];
		}
		return chartData;
	};

	useEffect(() => {
		const fetchData = async () => {
			fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
				.then((response) => response.json())
				.then((data) => {
					const chartData = buildChartData(data, casesType);
					setData(chartData);
				});
		};
		fetchData();
	}, [casesType]);

	return (
		<div className={props.className}>
			{data?.length > 0 && (
				<Line
					data={{
						datasets: [
							{
								backgroundColor: "rgba(204,16,52,0.5",
								borderColor: "#cc1034",
								data: data,
							},
						],
					}}
					options={options}
				/>
			)}
		</div>
	);
}

export default LineGraph;
