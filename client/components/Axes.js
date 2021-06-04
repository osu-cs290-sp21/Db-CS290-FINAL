import React, { Component } from "react";
import * as d3 from "d3";

class Axes extends Component {
	constructor(props) {
		super(props);
		this.myRef = React.createRef();
		this.state = {};
	}
	componentDidUpdate() {
		let xScale = this.props.xScale;
		let xAxis = d3.axisTop().scale(xScale);
		d3.select(this.myRef.current)
			.attr("transform", "translate(0,16)")
			.style("color", "#bababa")
			.transition()
			.duration(1000)
			.ease(d3.easeExpInOut)
			.call(xAxis.ticks(this.props.ticks));
		console.log("working");
	}
	render() {
		const { width, height } = this.props;
		return (
			<svg width={width} height={height}>
				<g ref={this.myRef}></g>
			</svg>
		);
	}
}

export default Axes;
