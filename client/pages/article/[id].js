import React, { Component } from "react";
import axios from "axios";
import Renderer from "../../components/Renderer";
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
	const articleData = await axios.get(
		`http://localhost:5000/get/article/${id}`
	);
	let title = articleData.data.title;
	return {
		props: { components: data, title },
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
		const { components, title } = this.props;
		return (
			<div>
				<div
					style={{
						background: "black",
						padding: "10px",
					}}
				>
					<div style={{ fontSize: "25px", color: "white" }}>
						{title}
					</div>
				</div>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
					}}
				>
					<div style={{ width: "50%" }}>
						<Renderer components={components}></Renderer>
					</div>
				</div>
			</div>
		);
	}
}

export default Article;
