import React, { Component } from "react";
import Head from "next/head";
import Article from "../components/Article";
import * as d3 from "d3";
import Create from "../components/Create";
import Discover from "../components/Discover";
import { Alert } from "@material-ui/lab";
import {
	Button,
	Select,
	MenuItem,
	InputLabel,
	Paper,
	Tab,
	Tabs,
	ThemeProvider,
	createMuiTheme,
	InputBase,
	Input,
	Card,
	CardContent,
	CardActions,
	IconButton,
	Snackbar,
	Switch,
} from "@material-ui/core";
import { Brush, Search, Close, Add } from "@material-ui/icons";
import styles from "../styles/Index.module.scss";
import axios from "axios";
const theme = createMuiTheme({
	palette: {
		primary: { main: "#000000" },
		secondary: { main: "#000000" },
	},
});
function deepCopy(array) {
	return JSON.parse(JSON.stringify(array));
}
function addOpacityRGB(color, opacity) {
	let colorArray = color.split("");
	colorArray.pop();
	colorArray.push(`,${opacity})`);
	return colorArray.join("");
}

function getMinMax(array, { attr = undefined } = {}) {
	let min = Infinity;
	let max = 0;
	const isDefined = typeof attr !== "undefined";
	array.forEach((item) => {
		const curr = isDefined ? item[attr] : item;
		if (curr > max) {
			max = curr;
		} else if (curr <= min) {
			min = curr;
		}
	});
	return { max, min };
}

class index extends Component {
	constructor(props) {
		super(props);
		this.colors = d3.interpolateRdBu;
		this.myRef = React.createRef();
		this.views = [
			{ name: "Home", index: 0 },
			{ name: "Current Article", index: 1 },
			{ name: "Create", index: 2 },
		];
		this.state = {
			articles: [],
			mutatedArticles: [],
			searchedArticles: [],
			selectedView: 0,
			selectedArticle: {},
			components: [],
			selectedSort: "best",
			search: "",
			snackbar: {
				open: false,
				message: "",
			},
			isCircle: false,
			showLines: true,
			min: Infinity,
			max: 0,
		};

		this.setArticles = this.setArticles.bind(this);
		this.getArticle = this.getArticle.bind(this);
		this.changeView = this.changeView.bind(this);
		this.sortScore = this.sortScore.bind(this);
		this.message = this.message.bind(this);
		this.reload = this.reload.bind(this);
	}
	message({ message = "", open = false } = {}) {
		const snackbar = { open, message };
		this.setState({ snackbar });
	}

	async get(path) {
		const data = await fetch(`http://localhost:5000/${path}`);
		const json = await data.json();
		return json;
	}
	async setArticles() {
		const articles = await axios.get("http://localhost:5000/get/articles");
		this.setState({ articles: articles.data });
	}
	async getArticle(articleId) {
		const components = await axios.get(
			`http://localhost:5000/get/components/${articleId}`
		);
		const article = await axios.get(
			`http://localhost:5000/get/article/${articleId}`
		);
		this.views[1].name = article.data.title;
		this.setState({
			components: components.data,
			selectedArticle: article.data,
		});
	}
	async reload(callback, { selectedId = undefined, index = 0 } = {}) {
		await this.setArticles();
		this.sortScore(callback);

		await this.getArticle(
			selectedId ? selectedId : this.state.mutatedArticles[index].id
		);
		const { min, max } = getMinMax(this.state.mutatedArticles, {
			attr: "score",
		});

		this.setState({ min, max, search: "" });
	}

	async componentDidMount() {
		this.reload((a, b) => b.score - a.score);

		// this.sortScore((a, b) => a.score - b.score);
		// this.sortScore((a, b) => b.id - a.id);
		// const { myRef } = this;
		// const div = d3.select(myRef.current);
		// div.style("width")
	}
	async getImgData(event) {
		const file = event.target.files[0];
		const reader = new FileReader();
		let data;
		if (file) {
			reader.onload = (e) => {
				// console.log(e.target.result);
				data = e.target.result;
				return data;
			};
			reader.readAsDataURL(file);
		} else {
			return "";
		}
	}
	async changeView(view) {
		// await this.setArticles();
		// this.sortScore((a, b) => b.score - a.score);
		// await this.getArticle(this.state.mutatedArticles[0].id);
		// const max = this.state.mutatedArticles[0].score;
		// const min =
		// 	this.state.mutatedArticles[this.state.mutatedArticles.length - 1]
		// 		.score;

		// this.setState({ min, max });
		this.setState({ selectedView: view });
	}
	sortScore(callback, { search = "" } = {}) {
		if (typeof callback === "function") {
			const articles = deepCopy(this.state.articles);
			//first fitter down articles
			const filteredDown = articles.filter(({ title }) => {
				return title.toLowerCase().includes(search.toLowerCase());
			});
			const sortedArticles = filteredDown.sort((a, b) => callback(a, b));

			this.setState({ mutatedArticles: sortedArticles });
		}
	}
	getSortFunction(value) {
		let callback;
		if (value === "best") {
			callback = (a, b) => b.score - a.score;
		} else if (value === "worst") {
			callback = (a, b) => a.score - b.score;
		} else if (value === "new") {
			callback = (a, b) => b.id - a.id;
		}
		return callback;
	}

	render() {
		const {
			navbar,
			story,
			title,
			button,
			article,
			articleContainer,
			articleTitle,
			inputter,
			searchBase,
			searchIcon,
			searchClose,
		} = styles;
		const upper = 100;
		const lower = -100;
		const { articles, snackbar } = this.state;

		const colorScale = d3
			.scaleLinear()
			.domain([this.state.min, this.state.max])
			.range([1, 0]);

		function highlight(id, score) {
			d3.select(`#articleId${id}`).style(
				"border",
				`3px solid ${getColor(score)}`
			);
			d3.select(`#text${id}`).attr("fill", getColor(score));
			d3.selectAll(`.id${id}`).attr("opacity", 1.0).raise();
			d3.selectAll(`.boxid${id}`).attr("stroke", "#bababa99").raise();
		}
		function hide(id) {
			d3.select(`#articleId${id}`).style("border", `3px solid #00000000`);
			d3.select(`#text${id}`).attr("fill", "#00000000");
			d3.selectAll(`.id${id}`).attr("opacity", 0.3);
			d3.selectAll(`.boxid${id}`).attr("stroke", "#cccccc0");
		}
		const getColor = (input) => d3.interpolateWarm(colorScale(input));
		const discover = (
			<div>
				<Switch
					onChange={() => {
						this.setState({ isCircle: !this.state.isCircle });
					}}
					color="primary"
				></Switch>
				<Switch
					onChange={() => {
						this.setState({ showLines: !this.state.showLines });
					}}
				></Switch>
				<Discover
					data={this.state.mutatedArticles}
					min={this.state.min}
					max={this.state.max}
					isCircle={this.state.isCircle}
					showLines={this.state.showLines}
				/>
			</div>
		);
		const homePage = (
			<div style={{ marginLeft: "100px", marginTop: "50px" }}>
				<div style={{ display: "flex" }}>
					<div className={inputter} style={{ marginRight: "10px" }}>
						<div className={searchIcon}>
							<Search />
						</div>
						<div className={searchBase}>
							<InputBase
								value={this.state.search}
								fullWidth
								placeholder="Search Titles"
								onChange={(e) => {
									const value = e.target.value;
									let callback = this.getSortFunction(
										this.state.selectedSort
									);
									this.sortScore(callback, { search: value });
									this.setState({ search: value });
								}}
							/>
						</div>

						{this.state.search.length > 0 ? (
							<div
								className={searchClose}
								onClick={() => {
									let callback = this.getSortFunction(
										this.state.selectedSort
									);
									this.sortScore(callback);
									this.setState({ search: "" });
								}}
							>
								<Close />
							</div>
						) : (
							""
						)}
					</div>
					<div style={{ display: "flex" }}>
						<div>
							<InputLabel id="select">Sort</InputLabel>
							<Select
								labelId="select"
								value={this.state.selectedSort}
								onChange={(e) => {
									const value = e.target.value;
									let callback = this.getSortFunction(value);
									this.sortScore(callback, {
										search: this.state.search,
									});

									this.message({
										message: `Now Showing ${value} first`,
										open: true,
									});
									this.setState({ selectedSort: value });
								}}
								displayEmpty
								//   inputProps={{ 'aria-label': 'Without label' }}
							>
								<MenuItem value={"best"}>
									Highest Score
								</MenuItem>
								<MenuItem value={"worst"}>
									Lowest Score
								</MenuItem>
								<MenuItem value={"new"}>New Articles</MenuItem>
							</Select>
						</div>

						<div style={{ display: "flex", alignItems: "center" }}>
							<Switch
								onChange={() => {
									this.setState({
										showLines: !this.state.showLines,
									});
								}}
								defaultChecked
							></Switch>
							<p>Show Bars</p>
						</div>
					</div>
				</div>

				<div style={{ marginTop: "15px" }}></div>
				<Discover
					data={this.state.mutatedArticles}
					min={this.state.min}
					max={this.state.max}
					isCircle={this.state.isCircle}
					showLines={this.state.showLines}
					exec={async (id) => {
						await this.getArticle(id);
						this.changeView(1);
					}}
				/>

				<div className={articleContainer}>
					{this.state.mutatedArticles.map(
						({ id, title, color, score }) => {
							const scoreNorm = score / upper + 0.5;
							const selected =
								this.state.selectedArticle.id === id;
							return (
								<div
									key={id}
									id={`articleId${id}`}
									className={article}
									style={{
										// borderColor: false
										// 	? "none"
										// 	: getColor(score),

										background: addOpacityRGB(
											getColor(score),
											0.2
										),
									}}
									onClick={async () => {
										await this.getArticle(id);
										this.changeView(1);
									}}
									onMouseEnter={() => {
										highlight(id, score);
									}}
									onMouseLeave={() => {
										hide(id);
									}}
								>
									<div
										style={{
											color: getColor(score),
										}}
										className={articleTitle}
									>
										{title}
									</div>
								</div>
							);
						}
					)}
				</div>
			</div>
		);
		const articleView = (data, components, id) => {
			if (components.length === 0) {
				return "";
			}
			return (
				<Article
					data={data}
					components={this.state.components}
					id={id}
				></Article>
			);
		};
		const views = [
			homePage,
			articleView(
				this.state.selectedArticle,
				this.state.components,
				this.state.selectedArticle.id
			),
			<Create
				goBack={() => {
					const idu = this.state.selectedArticle.id;
					this.changeView(0);

					let callback = this.getSortFunction(
						this.state.selectedSort
					);
					this.reload(callback, {
						selectedId: idu,
					});
				}}
			/>,
		];
		return (
			<ThemeProvider theme={theme}>
				<div>
					<Head>
						<title>
							{this.views[this.state.selectedView].name}
						</title>
					</Head>
					<div style={{ marginBottom: "75px" }}></div>

					{views[this.state.selectedView]}
					<div
						className={navbar}
						style={{ position: "fixed", top: 0, left: 0 }}
					>
						<div
							className={title}
							onClick={async () => {
								await this.setArticles();
								this.changeView(0);
							}}
						>
							CONSENSUS
						</div>
						<div style={{ marginLeft: "20px" }}>
							<Tabs
								value={this.state.selectedView}
								indicatorColor="primary"
								textColor="primary"
							>
								{this.views.map((view, i) => {
									const el = (
										<Tab
											label={view.name}
											onClick={() => {
												const idu =
													this.state.selectedArticle
														.id;
												this.changeView(view.index);

												let callback =
													this.getSortFunction(
														this.state.selectedSort
													);
												this.reload(callback, {
													selectedId: idu,
												});
											}}
										/>
									);
									return i < 2 ? el : "";
								})}
							</Tabs>
						</div>
						<div className={story}>
							<Button
								variant="outlined"
								// className={button}
								color="primary"
								startIcon={<Add />}
								onClick={() => {
									this.changeView(2);
								}}
							>
								Create Article
							</Button>
						</div>
					</div>
					<Snackbar
						open={snackbar.open}
						anchorOrigin={{
							vertical: "top",
							horizontal: "center",
						}}
						autoHideDuration={3000}
						onClose={() => {
							this.message();
						}}
						// message={snackbar.message}
					>
						<Alert severity="info">{snackbar.message}</Alert>
					</Snackbar>
				</div>
			</ThemeProvider>
		);
	}
}

export default index;
