import React, { Component } from "react";
import Link from "next/link";
import { Button, ButtonGroup, Box, TextField, Switch } from "@material-ui/core";
import { Add, BorderColor } from "@material-ui/icons";
import Renderer from "../components/Renderer";
import LegendContainer from "../components/LegendContainer";
import * as d3 from "d3";
import { CompactPicker } from "react-color";
import styles from "../styles/Create.module.scss";
import axios from "axios";

class create extends Component {
	constructor(props) {
		super(props);
		this.schema = {
			sectionTitle: 1,
			subTitle: 2,
			body: 3,
			tex: 4,
			embed: 5,
		};
		this.state = {
			components: [],
			data: "start",
			index: 1,
			color: "coral",
			title: "",
			selected: 1,
		};
		this.addComponent = this.addComponent.bind(this);
		this.editText = this.editText.bind(this);
		this.editEmbed = this.editEmbed.bind(this);
		this.post = this.post.bind(this);
	}
	addTemplate(type) {
		let data;
		const { sectionTitle, subTitle, body, tex, embed } = this.schema;
		switch (type) {
			case sectionTitle:
				data = { text: "Title Placeholder" };
				break;
			case subTitle:
				data = { text: "Subtitle Placeholder" };
				break;
			case body:
				data = { text: "Body Placeholder" };
				break;
			case tex:
				data = { text: "\\LaTeX \\text{ Place Holder}" };
				break;
			case embed:
				data = { width: 300, height: 300, src: "" };
				break;
			default:
				break;
		}
		return { type, data };
	}
	editText(index, text, color = "black") {
		let cpy = this.state.components;
		cpy[index].data.text = text;
		this.setState({ components: cpy });
	}
	editEmbed(index, src = "", width = -1, height = -1) {
		let cpy = this.state.components;
		if (src.length > 0) {
			cpy[index].data.src = src;
		}
		if (width > 0) {
			cpy[index].data.width = width;
		}
		if (height > 0) {
			cpy[index].data.height = height;
		}
		this.setState({ components: cpy });
	}
	addComponent(type) {
		const template = this.addTemplate(type);
		this.setState({ components: [...this.state.components, template] });
	}
	color(type) {
		return d3.schemeTableau10[type];
	}
	match(type, index) {
		let form;
		const currData = this.state.components[index].data;

		const { sectionTitle, subTitle, body, tex, embed } = this.schema;
		const color = this.color(type);
		const text = (label) => (
			<TextField
				color="secondary"
				label={label}
				variant="filled"
				fullWidth
				multiline
				onChange={(e) => {
					this.editText(index, e.target.value);
				}}
			/>
		);

		switch (type) {
			case sectionTitle:
				form = (
					<LegendContainer name={"Section Title"} color={color}>
						{text("text")}
					</LegendContainer>
				);
				break;
			case subTitle:
				form = (
					<LegendContainer name={"Subtitle"} color={color}>
						{text("text")}
					</LegendContainer>
				);
				break;
			case body:
				form = (
					<LegendContainer name={"Body"} color={color}>
						{text("text")}
					</LegendContainer>
				);
				break;
			case tex:
				form = (
					<LegendContainer name={"TeX"} color={color}>
						{text("text")}
					</LegendContainer>
				);
				break;
			case embed:
				form = (
					<LegendContainer name={"Embed"} color={color}>
						<TextField
							color="secondary"
							label={"Height"}
							type="number"
							variant="filled"
							value={currData.height}
							onChange={(e) => {
								this.editEmbed(index, "", -1, e.target.value);
							}}
						/>
						<TextField
							color="secondary"
							label={"Width"}
							type="number"
							variant="filled"
							value={currData.width}
							onChange={(e) => {
								this.editEmbed(index, "", e.target.value, -1);
							}}
						/>
						<TextField
							color="secondary"
							label={"Link Source"}
							variant="filled"
							value={currData.src}
							onChange={(e) => {
								this.editEmbed(index, e.target.value, -1, -1);
							}}
						/>
					</LegendContainer>
				);
				break;
			default:
				form = <p>Error Occurred, could not match</p>;
				break;
		}
		return form;
	}
	// addComponent(type, data) {
	// 	this.setState({
	// 		components: [...this.state.components, { type, data }],
	// 	});
	// }
	async post() {
		// add article information first
		const title = `Test Title ${Math.random()}`;
		let post = await axios.post("http://localhost:5000/post/article", {
			title,
		});
		let articleId = await post.data.id;
		this.state.components.forEach(async (component, i) => {
			const payload = {
				articleId,
				order: i,
				type: component.type,
				data: component.data,
			};
			let componentPost = await axios.post(
				"http://localhost:5000/post/component",
				payload
			);
		});
	}
	componentDidUpdate() {
		// console.log(JSON.stringify(this.state.components));
	}
	render() {
		const { paper, title, container, document, editor } = styles;
		const { components, index, data, selected } = this.state;
		const names = [
			{ name: "Section Title", type: 1 },
			{ name: "Subtitle", type: 2 },
			{ name: "Body", type: 3 },
			{ name: "Tex", type: 4 },
			{ name: "Embed", type: 5 },
		];
		return (
			<div className={container}>
				<div className={editor}>
					<div>
						<LegendContainer
							color={this.state.color}
							name={"Global"}
						>
							<div>
								<div
									style={{
										marginTop: "10px",
										display: "flex",
									}}
								>
									<TextField
										color="secondary"
										label="Title"
										variant="filled"
										value={this.state.title}
										onChange={(e) => {
											this.setState({
												title: e.target.value,
											});
										}}
									/>
									<CompactPicker
										// triangle="hide"
										onChange={(color, event) => {
											this.setState({ color: color.hex });
										}}
										color={this.state.color}
										// colors={[
										// 	"black",
										// 	...d3.schemeTableau10,
										// 	...d3.schemeSpectral[10],
										// ]}
									/>
								</div>
							</div>
						</LegendContainer>
						{components.map((component, index) => {
							return this.match(component.type, index);
						})}
						<div
							style={{
								display: "flex",
								justifyContent: "center",
							}}
						>
							<div>
								<div>
									<ButtonGroup>
										{names.map(({ name, type }) => (
											<Button
												onClick={() => {
													this.setState({
														selected: type,
													});
												}}
												style={{
													color:
														selected === type
															? this.color(
																	selected
															  )
															: "",
													borderColor:
														selected === type
															? this.color(
																	selected
															  )
															: "",
												}}
											>
												{name}
											</Button>
										))}
									</ButtonGroup>
								</div>
								<div>
									<Button
										style={{ color: this.color(selected) }}
										startIcon={<Add />}
										onClick={() => {
											this.addComponent(selected);
										}}
										fullWidth
									>
										Add Component
									</Button>
								</div>
								<div>
									<Button
										onClick={async () => {
											await this.post();
										}}
									>
										Submit Article
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={document}>
					<Renderer
						components={components}
						global={{
							bgColor: this.state.color,
							textColor: "white",
							title: this.state.title,
						}}
					></Renderer>
				</div>
			</div>
		);
	}
}

export default create;
