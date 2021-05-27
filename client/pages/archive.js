import React, { Component } from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { Button } from "@material-ui/core";

class test extends Component {
	constructor(props) {
		super(props);
		this.state = {
			latex: "\\frac{1}{2}",
			rendered: "\\LaTeX",
			color: "black",
		};
	}
	componentDidMount() {
		document.getElementById("input").addEventListener("input", (e) => {
			this.setState({ latex: e.target.innerText });
		});
	}
	componentWillUnmount() {
		document.getElementById("input").removeEventListener(
			"input",
			(e) => {
				this.setState({ latex: e.target.innerText });
			},
			true
		);
	}

	render() {
		return (
			<center>
				<div>
					<input
						type="color"
						onChange={({ target }) =>
							this.setState({ color: target.value })
						}
					></input>
					<p
						contentEditable
						suppressContentEditableWarning
						id="input"
					>
						{"\\frac{1}{2}"}
					</p>
					<Button
						onClick={() => {
							this.setState({ rendered: this.state.latex });
						}}
						variant="outlined"
					>
						<InlineMath math="\LaTeX \text{ify}" />
					</Button>
					<h1 style={{ color: this.state.color }}>
						<BlockMath>{this.state.latex}</BlockMath>
					</h1>
					<BlockMath>{this.state.rendered}</BlockMath>
				</div>
				<iframe
					frameBorder={0}
					style={{ overflow: "hidden" }}
					width="460px"
					height="470px"
					src="https://xnought.github.io/component/"
				></iframe>
			</center>
		);
	}
}

export default test;
