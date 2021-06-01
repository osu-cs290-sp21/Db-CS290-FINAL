import React, { Component } from "react";
import Head from "next/head";
import Article from "../components/Article";
import Create from "../components/Create";
import { Button } from "@material-ui/core";
import { Brush } from "@material-ui/icons";
import styles from "../styles/Index.module.scss";
import axios from "axios";

class index extends Component {
	constructor(props) {
		super(props);
		this.views = [
			{ name: "Home", index: 0 },
			{ name: "Create", index: 1 },
			{ name: "Article", index: 2 },
		];
		this.state = {
			articles: [],
			selectedView: 0,
			selectedArticle: {},
			components: [],
		};

		this.setArticles = this.setArticles.bind(this);
		this.getArticle = this.getArticle.bind(this);
		this.changeView = this.changeView.bind(this);
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
		this.setState({
			components: components.data,
			selectedArticle: article.data,
		});
	}

	async componentDidMount() {
		await this.setArticles();
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

	render() {
		const { navbar, story, title, button, article, articleContainer } =
			styles;
		const { articles } = this.state;
		const homePage = (
			<div className={articleContainer}>
				{articles.map(({ id, title, dislikes, likes, color }) => {
					return (
						<div
							key={id}
							className={article}
							style={{ borderColor: color }}
							onClick={async () => {
								await this.getArticle(id);
								this.changeView(1);
							}}
						>
							{/* id: {id}, title: {title}, dislikes:{" "}
									{dislikes}, likes: {likes} */}
							{/* <h1>{title}</h1> */}
						</div>
					);
				})}
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
			<Create />,
		];
		return (
			<div>
				<Head>
					<title>{this.views[this.state.selectedView].name}</title>
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
					<div className={story}>
						<Button
							variant="contained"
							className={button}
							color="default"
							startIcon={<Brush />}
							onClick={() => {
								this.changeView(2);
							}}
						>
							Compose
						</Button>
					</div>
				</div>
				{views[this.state.selectedView]}
			</div>
		);
	}
}

export default index;
