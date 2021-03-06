import React, { Component } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

class Renderer extends Component {
	constructor(props) {
		super(props);
		this.schema = {
			sectionTitle: 1,
			subTitle: 2,
			body: 3,
			tex: 4,
			embed: 5,
		};
		this.state = {};
	}

	// function to match components -> convert this to classes to improve
	match(type, data) {
		let generatedComponent;
		const { sectionTitle, subTitle, body, tex, embed } = this.schema;
		switch (type) {
			case sectionTitle:
				generatedComponent = <h1>{data.text}</h1>;
				break;
			case subTitle:
				generatedComponent = <h2>{data.text}</h2>;
				break;
			case body:
				generatedComponent = <p>{data.text}</p>;
				break;
			case tex:
				generatedComponent = <BlockMath>{data.text}</BlockMath>;
				break;
			case embed:
				generatedComponent = (
					<div style={{ display: "flex", justifyContent: "center" }}>
						<iframe
							frameBorder={0}
							style={{ overflow: "hidden" }}
							scrolling="no"
							width={data.width}
							height={data.height}
							src={data.src}
						></iframe>
					</div>
				);
				break;
			default:
				generatedComponent = <p>Error Occurred, could not match</p>;
				break;
		}
		return generatedComponent;
	}

	render() {
		const { components } = this.props;
		return (
			<div>
				{components.map(({ type, data }, i) => (
					<div key={i}>{this.match(type, data)}</div>
				))}
			</div>
		);
	}
}

export default Renderer;
