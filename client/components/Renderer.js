import React, { Component } from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
class Renderer extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { components } = this.props;
		return (
			<>
				{components.map(({ index, data }, i) => {
					let el;
					switch (index) {
						case 1:
							el = <h1 key={i}>{data}</h1>;
							break;
						case 2:
							el = <h2 key={i}>{data}</h2>;
							break;
						case 3:
							el = <BlockMath key={i}>{data}</BlockMath>;
							break;
						case 4:
							el = <p key={i}>{data}</p>;
							break;
						default:
							break;
					}
					return el;
				})}
			</>
		);
	}
}

export default Renderer;
