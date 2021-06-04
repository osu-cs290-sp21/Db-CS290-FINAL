import React, { Component } from "react";
import Axes from "./Axes";
import * as d3 from "d3";

function deepCopy(array) {
	return JSON.parse(JSON.stringify(array));
}
function adjustAxes(selector, xScale, ticks) {
	let xAxis = d3.axisTop().scale(xScale);
	d3.select(selector)
		.attr("transform", "translate(0,16)")
		.transition()
		.duration(1000)
		.ease(d3.easeExpInOut)
		.call(xAxis.ticks(ticks));
}

class Discover extends Component {
	constructor(props) {
		super(props);
		// this.max = sortedData[0].score;
		// this.min = sortedData[sortedData.length - 1].score;
		// this.width = document.body.clientWidth - 100;
		// this.height = 500;
		// const { min, max } = getMinMax(data, { attr: "score" });
		this.state = {};
	}
	getScore(index) {
		return this.state.data[index];
	}
	componentDidMount() {
		// console.log(this.min);
		// console.log(this.max);
	}
	componentDidUpdate() {}
	render() {
		const { data, isCircle, showLines } = this.props;
		const sortedData = deepCopy(data).sort((a, b) => b.score - a.score);
		const length = data?.length;
		const max = sortedData[0]?.score;
		const min = sortedData[sortedData.length - 1]?.score;
		const width = 1500;
		const height = 1000;
		const space = 10;

		const colorScale = d3.scaleLinear().domain([min, max]).range([1, 0]);
		const color = (input) => d3.interpolateWarm(colorScale(input));
		const xScale = d3.scaleLinear().domain([min, max]).range([0, width]);
		const yScale = d3
			.scaleLinear()
			.domain([0, length ? length * space : 0])
			.range([0, height]);

		const line = (start, end) => d3.line()([start, end]);
		// const { min, max } = getMinMax(data, { attr: "score" });
		console.log(min);
		console.log(max);
		console.log(data);
		console.log(sortedData);
		const tickPlotHeight = 15;
		const tickWidth = 2;
		const tickHeight = tickPlotHeight;
		const spacer = <div style={{ margin: "10px" }}></div>;
		// adjustAxes("axes", xScale, 10);

		return (
			<div style={{ padding: "20px" }}>
				<svg
					width={width}
					height={tickPlotHeight}
					style={{ overflow: "visible" }}
				>
					{/* <rect
						width={width}
						height={tickPlotHeight}
						fill="none"
						stroke="#ccc"
					></rect> */}
					{sortedData.map(({ score }, i) => {
						return (
							<path
								d={line(
									[xScale(score), 0],
									[xScale(score), tickHeight]
								)}
								stroke={color(score)}
								opacity={0.3}
								strokeWidth={tickWidth}
							></path>
						);
					})}
				</svg>
				{spacer}
				<Axes width={width} height={30} xScale={xScale} ticks={10} />
				<svg
					width={width}
					height={height}
					style={{ overflow: "visible" }}
				>
					<g id="axes"></g>
					<path
						d={line([xScale(0), 0], [xScale(0), height])}
						stroke="#ccc"
					></path>
					<rect
						width={width}
						height={height}
						fill="none"
						stroke="#ccc"
					></rect>
					{/* I then want to iterate over the scores  */}
					{sortedData.map(({ score }, i) => {
						const xOrigin = xScale(0);
						const xPosition = xScale(score);
						const yPosition = yScale(i);
						const nextYPosition = yScale(i + 1);
						const currColor = color(score);

						const lines = (
							<path
								d={line(
									[xOrigin, (yPosition + nextYPosition) / 2],
									[xPosition, (yPosition + nextYPosition) / 2]
								)}
								stroke={currColor}
								opacity={0.5}
								strokeWidth={space * 2}
							></path>
						);
						const ticks = (
							<path
								d={line(
									[xPosition, yPosition],
									[xPosition, nextYPosition]
								)}
								stroke={currColor}
								opacity={1}
								strokeWidth={tickWidth}
							></path>
						);
						const circles = (
							<circle
								cx={xPosition}
								cy={yPosition}
								r={5}
								fill={currColor}
							></circle>
						);
						return (
							<>
								{showLines ? lines : ""}
								{isCircle ? circles : ticks}
							</>
						);
					})}
				</svg>
			</div>
		);
	}
}

export default Discover;
