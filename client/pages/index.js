import React, { Component } from "react";
import Head from "next/head";
import Article from "../components/Article";
import * as d3 from "d3";
import Create from "../components/Create";
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
} from "@material-ui/core";
import { Brush, Search, Close, Add } from "@material-ui/icons";
import styles from "../styles/Index.module.scss";
import axios from "axios";
const theme = createMuiTheme({
	palette: {
		primary: { main: "#d04853" },
		secondary: { main: "#000000" },
	},
});
function deepCopy(array) {
	return JSON.parse(JSON.stringify(array));
}

class index extends Component {
	constructor(props) {
		super(props);
		this.colors = d3.interpolateRdBu;
		this.myRef = React.createRef();
		this.views = [
			{ name: "Home", index: 0 },
			{ name: "Search", index: 1 },
			{ name: "Current Article", index: 2 },
			{ name: "Create", index: 3 },
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
		};

		this.setArticles = this.setArticles.bind(this);
		this.getArticle = this.getArticle.bind(this);
		this.changeView = this.changeView.bind(this);
		this.sortScore = this.sortScore.bind(this);
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
		this.views[2].name = article.data.title;
		this.setState({
			components: components.data,
			selectedArticle: article.data,
		});
	}

	async componentDidMount() {
		await this.setArticles();
		this.sortScore((a, b) => b.score - a.score);
		await this.getArticle(this.state.mutatedArticles[0].id);

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
	changeView(view) {
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
		const { articles } = this.state;
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
								label
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

								this.setState({ selectedSort: value });
							}}
							displayEmpty
							//   inputProps={{ 'aria-label': 'Without label' }}
						>
							<MenuItem value={"best"}>Highest Score</MenuItem>
							<MenuItem value={"worst"}>Lowest Score</MenuItem>
							<MenuItem value={"new"}>New Articles</MenuItem>
						</Select>
					</div>
				</div>

				<div className={articleContainer}>
					{this.state.mutatedArticles.map(
						({ id, title, color, score }) => {
							const scoreNorm = score / upper + 0.5;
							const selected =
								this.state.selectedArticle.id === id;
							return (
								<div
									key={id}
									className={article}
									style={{
										borderColor: !selected
											? this.colors(scoreNorm)
											: "red",
										background: this.colors(scoreNorm),
									}}
									onClick={async () => {
										await this.getArticle(id);
										this.changeView(2);
										console.log(score);
									}}
								>
									<div
										style={{
											color:
												scoreNorm > 0.8 ||
												scoreNorm < 0.2
													? "white"
													: "black",
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
		const discover = <div>discover my ass</div>;
		const views = [
			discover,
			homePage,
			articleView(
				this.state.selectedArticle,
				this.state.components,
				this.state.selectedArticle.id
			),
			<Create />,
		];
		return (
			<ThemeProvider theme={theme}>
				<div>
					<Head>
						<title>
							{this.views[this.state.selectedView].name}
						</title>
					</Head>
					<div className={navbar}>
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
												this.changeView(view.index);
											}}
										/>
									);
									return i < 3 ? el : "";
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
									this.changeView(3);
								}}
							>
								Create Article
							</Button>
						</div>
					</div>
					{views[this.state.selectedView]}
				</div>
			</ThemeProvider>
		);
	}
}

export default index;
