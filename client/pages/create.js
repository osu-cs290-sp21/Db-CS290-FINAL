import React, { Component } from "react";
import Link from "next/link";
import { Button, Box } from "@material-ui/core";
import Renderer from "../components/Renderer";
import * as d3 from "d3";
import styles from "../styles/Create.module.scss";

class create extends Component {
	constructor(props) {
		super(props);
		this.state = {
			components: [
				{ type: 1, data: { text: "This is a section title" } },
				{ type: 2, data: { text: "This is a sub title" } },
				{ type: 3, data: { text: "This is a body" } },
				{ type: 4, data: { text: "\\frac{1}{2}" } },
				{
					type: 5,
					data: {
						width: "460px",
						height: "470px",
						src: "https://xnought.github.io/component/",
					},
				},
			],
			data: "start",
			index: 1,
		};
		this.addComponent = this.addComponent.bind(this);
		this.editComponent = this.editComponent.bind(this);
	}
	addComponent(type, data) {
		this.setState({
			components: [...this.state.components, { type, data }],
		});
	}
	editComponent(i, type, data) {
		let cpy = [...this.state.components];
		cpy[i] = { type, data };
		this.setState({
			components: cpy,
		});
	}
	componentDidUpdate() {
		console.log(JSON.stringify(this.state.components));
	}
	render() {
		const { paper, title, container, document, editor } = styles;
		const { components, index, data } = this.state;
		const colors = d3.schemeTableau10;
		return (
			<div className={container}>
				<div className={editor}>
					{index}
					<select
						onChange={(e) => {
							this.setState({ index: +e.target.value });
						}}
					>
						<option value={1}>Title</option>
						<option value={2}>SubTitle</option>
						<option value={3}>TeX</option>
						<option value={4}>Body</option>
					</select>
					<input
						type="text"
						placeholder="Enter..."
						value={data}
						onChange={(e) => {
							this.setState({ data: e.target.value });
						}}
					></input>
					<Button
						onClick={(e) => {
							this.addComponent(index, data);
						}}
					>
						Add Component
					</Button>
					{components.map(({ index }, i) => {
						return (
							<div
								key={index}
								style={{
									width: "100%",
									height: "50px",
									border: `1px solid ${colors[index]}`,
									display: "flex",
									marginTop: "3px",
									alignContent: "center",
								}}
							>
								<input
									type="text"
									onChange={(e) => {
										this.editComponent(
											i,
											index,
											e.target.value
										);
									}}
								></input>
								{/* {index} */}
							</div>
						);
					})}
				</div>
				<div className={document}>
					<Renderer components={components}></Renderer>
				</div>
			</div>
		);
	}
}

export default create;
