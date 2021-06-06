import React from "react";
import Axes from "./Axes";
import * as d3 from "d3";

// so we can avoid doing things by reference
function deepCopy(array) {
	return JSON.parse(JSON.stringify(array));
}

const Discover = (props) => {
	const { data, isCircle, showLines, min, max, exec } = props;

	//initialization step
	const sortedData = deepCopy(data);
	const length = data?.length;
	const width = 1500;
	const height = 450;
	const colorScale = d3.scaleLinear().domain([min, max]).range([1, 0]);
	const color = (input) => d3.interpolateWarm(colorScale(input));
	const xScale = d3.scaleLinear().domain([min, max]).range([0, width]);
	const yScale = d3
		.scaleLinear()
		.domain([0, length ? length : 0])
		.range([0, height]);

	const line = (start, end) => d3.line()([start, end]);
	const tickPlotHeight = 40;
	const tickWidth = 2;
	const tickHeight = tickPlotHeight;
	const spacer = <div style={{ margin: "10px" }}></div>;

	// how I will highlight each component
	function highlight(id, score) {
		d3.select(`#articleId${id}`).style(
			"border",
			`3px solid ${color(score)}`
		);
		d3.select(`#text${id}`).attr("fill", color(score));
		d3.selectAll(`.id${id}`).attr("opacity", 1.0);
		d3.selectAll(`.boxid${id}`).attr("stroke", "#bababa99");
	}
	function hide(id) {
		d3.select(`#articleId${id}`).style("border", `3px solid #00000000`);
		d3.select(`#text${id}`).attr("fill", "#00000000");
		d3.selectAll(`.id${id}`).attr("opacity", 0.3);
		d3.selectAll(`.boxid${id}`).attr("stroke", "#cccccc0");
	}

	return (
		<div style={{ padding: "20px" }}>
			<svg
				width={width}
				height={tickPlotHeight}
				style={{ overflow: "visible" }}
			>
				{sortedData.map(({ score, id, title }, i) => {
					return (
						<>
							<text
								id={`text${id}`}
								x={xScale(score)}
								y={-10}
								style={{ textAnchor: "middle" }}
								fill="none"
							>
								{title}: {score}
							</text>
							<path
								className={`id${id}`}
								d={line(
									[xScale(score), 0],
									[xScale(score), tickHeight]
								)}
								stroke={color(score)}
								style={{ cursor: "pointer" }}
								opacity={0.3}
								strokeWidth={tickWidth}
								onMouseEnter={() => {
									highlight(id, score);
								}}
								onMouseLeave={() => {
									hide(id);
								}}
								onClick={async () => {
									await exec(id);
								}}
							></path>
						</>
					);
				})}
			</svg>
			{spacer}
			<Axes width={width} height={30} xScale={xScale} ticks={10} />
			<svg width={width} height={height} style={{ overflow: "visible" }}>
				<g id="axes"></g>
				<path
					d={line([xScale(0), 0], [xScale(0), height])}
					stroke="#ccc"
				></path>
				{sortedData.map(({ score, id }, i) => {
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
							opacity={0.3}
							strokeWidth={nextYPosition - yPosition}
							className={`id${id}`}
						></path>
					);
					const box = (
						<rect
							style={{ cursor: "pointer" }}
							className={`boxid${id}`}
							x={0}
							y={yPosition}
							width={width}
							height={nextYPosition - yPosition}
							fill="#00000000"
							stroke="#cccccc0"
							onMouseEnter={() => {
								highlight(id, score);
							}}
							onMouseLeave={() => {
								hide(id);
							}}
							onClick={async () => {
								await exec(id);
							}}
						></rect>
					);
					const ticks = (
						<path
							className={`id${id}`}
							d={line(
								[xPosition, yPosition],
								[xPosition, nextYPosition]
							)}
							stroke={currColor}
							opacity={0.3}
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
							{box}
						</>
					);
				})}
			</svg>
		</div>
	);
};

export default Discover;
