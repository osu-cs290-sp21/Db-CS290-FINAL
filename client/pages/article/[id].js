import React, { Component } from "react";
async function get(path) {
	const data = await fetch(`http://localhost:5000/${path}`);
	const json = await data.json();
	return json;
}
export const getStaticPaths = async () => {
	const res = "placeholder";
	const data = await get(`get/articles`);
	const paths = data.map((item) => {
		return {
			params: { id: item.id.toString() },
		};
	});
	return {
		paths,
		fallback: false,
	};
};
export const getStaticProps = async (context) => {
	const { id } = context.params;
	const data = await get(`get/components/${id}`);
	return {
		props: { components: data },
	};
};
class Article extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount() {
		console.log(JSON.stringify(this.props.components));
	}
	render() {
		const { components } = this.props;
		return (
			<div>
				{components.map((component, i) => {
					return (
						<div key={i}>
							<pre>{JSON.stringify(component)}</pre>
						</div>
					);
				})}
			</div>
		);
	}
}

export default Article;
