import React, { Component } from "react";
import * as d3 from "d3";

class Axes extends Component {
	constructor(props) {
		super(props);
		this.myRef = React.createRef(); //needed as reference
		this.grey = "#bababa";
		this.state = {};
	}
	createAxes() {
		let xScale = this.props.xScale;
		let xAxis = d3.axisTop().scale(xScale);
		d3.select(this.myRef.current)
			.attr("transform", "translate(0,16)")
			.style("color", this.grey)
			.transition()
			.duration(1000)
			.ease(d3.easeExpInOut) //this easing function
			.call(xAxis.ticks(this.props.ticks)); //# of ticks
	}
	componentDidMount() {
		this.createAxes();
	}
	componentDidUpdate() {
		this.createAxes();
	}
	render() {
		const { width, height } = this.props;
		return (
			<svg width={width} height={height} style={{ overflow: "visible" }}>
				<g ref={this.myRef}></g>
			</svg>
		);
	}
}

export default Axes;
