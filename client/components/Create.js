import React, { Component } from "react";
import {
	Button,
	ButtonGroup,
	TextField,
	InputBase,
	Dialog,
	DialogContent,
	DialogActions,
	Divider,
	IconButton,
} from "@material-ui/core";
import { Add, Close } from "@material-ui/icons";
import Renderer from "./Renderer";
import LegendContainer from "./LegendContainer";
import * as d3 from "d3";
import styles from "../styles/Create.module.scss";
import secondary from "../styles/Index.module.scss";
import axios from "axios";

class Create extends Component {
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
			color: "black",
			title: "",
			selected: 1,
			showDialog: false,
		};
		this.addComponent = this.addComponent.bind(this);
		this.editText = this.editText.bind(this);
		this.editEmbed = this.editEmbed.bind(this);
		this.post = this.post.bind(this);
		this.remove = this.remove.bind(this);
	}
	addTemplate(type) {
		let data;
		const { sectionTitle, subTitle, body, tex, embed } = this.schema;
		data = { text: "" }; // default behavior
		switch (type) {
			case sectionTitle:
				break;
			case subTitle:
				break;
			case body:
				break;
			case tex:
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
	remove(index) {
		let cpy = this.state.components;
		cpy.splice(index, 1);
		this.setState({ components: cpy }, () => {
			console.log(this.state.components);
		});
	}
	color(type) {
		return d3.schemeSet1[type - 1];
	}
	match(type, index) {
		let form;
		const currData = this.state.components[index].data;

		const { sectionTitle, subTitle, body, tex, embed } = this.schema;
		const color = this.color(type);
		const text = (label) => (
			<InputBase
				color="secondary"
				placeholder={`Enter ${label}...`}
				label={label}
				variant="filled"
				fullWidth
				multiline
				value={currData.text}
				onChange={(e) => {
					this.editText(index, e.target.value);
				}}
			/>
		);

		switch (type) {
			case sectionTitle:
				form = (
					<LegendContainer name={"Section Title"} color={color}>
						{text("Section Title")}
					</LegendContainer>
				);
				break;
			case subTitle:
				form = (
					<LegendContainer name={"Subtitle"} color={color}>
						{text("Subtitle")}
					</LegendContainer>
				);
				break;
			case body:
				form = (
					<LegendContainer name={"Body"} color={color}>
						{text("Body")}
					</LegendContainer>
				);
				break;
			case tex:
				form = (
					<LegendContainer name={"TeX"} color={color}>
						{text("TeX")}
					</LegendContainer>
				);
				break;
			case embed:
				form = (
					<LegendContainer name={"Embed"} color={color}>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
							}}
						>
							<div>
								<TextField
									label={"Link Source"}
									variant="filled"
									value={currData.src}
									placeholder="url..."
									onChange={(e) => {
										this.editEmbed(
											index,
											e.target.value,
											-1,
											-1
										);
									}}
								/>
							</div>
							<div>
								<TextField
									color="secondary"
									label={"Height"}
									type="number"
									variant="filled"
									value={currData.height}
									onChange={(e) => {
										this.editEmbed(
											index,
											"",
											-1,
											e.target.value
										);
									}}
								/>
							</div>
							<div>
								<TextField
									color="secondary"
									label={"Width"}
									type="number"
									variant="filled"
									value={currData.width}
									onChange={(e) => {
										this.editEmbed(
											index,
											"",
											e.target.value,
											-1
										);
									}}
								/>
							</div>
						</div>
					</LegendContainer>
				);
				break;
			default:
				form = <p>Error Occurred, could not match</p>;
				break;
		}
		return (
			<div style={{ display: "flex", alignItems: "center" }}>
				<div>
					<IconButton
						onClick={() => {
							this.remove(index);
						}}
					>
						<Close />
					</IconButton>
				</div>
				<div style={{ flex: 2 }}>{form}</div>
			</div>
		);
	}
	async post() {
		// add article information first
		const title = this.state.title;
		const color = this.state.color;
		let post = await axios.post("http://localhost:5000/post/article", {
			title,
			color,
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
	render() {
		const { container, document, editor } = styles;
		const { components, selected } = this.state;
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
						{components.map((component, index) => {
							const comp = (
								<div key={index}>
									{this.match(component.type, index)}
								</div>
							);
							return comp;
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
										style={{
											color: this.color(selected),
										}}
										startIcon={<Add />}
										onClick={() => {
											this.addComponent(selected);
										}}
										fullWidth
									>
										Add Component
									</Button>
								</div>
								<div
									style={{
										display: "flex",
										marginTop: "10px",
									}}
								>
									<Button
										variant="contained"
										color="primary"
										fullWidth
										onClick={() => {
											this.setState({
												showDialog:
													!this.state.showDialog,
											});
										}}
									>
										Publish article
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
				<Dialog open={this.state.showDialog} fullScreen>
					<DialogActions style={{ float: "left" }}>
						<Button
							onClick={() => {
								this.setState({ showDialog: false, title: "" });
							}}
						>
							Cancel
						</Button>
						<TextField
							color="secondary"
							placeholder={`Enter here...`}
							label={"Article Title"}
							variant="filled"
							onChange={(e) => {
								this.setState({
									title: e.target.value,
								});
							}}
						></TextField>
						<Button
							onClick={async () => {
								await this.post();
								this.props.goBack();
							}}
							variant="outlined"
							disabled={!this.state.title.length > 0}
						>
							Submit Article
						</Button>
					</DialogActions>
					<Divider />
					<DialogContent>
						<div
							style={{
								display: "flex",
								justifyContent: "center",
							}}
						>
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
					</DialogContent>
				</Dialog>
			</div>
		);
	}
}

export default Create;
