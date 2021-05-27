import React, { Component } from "react";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@material-ui/core";
import { Brush } from "@material-ui/icons";
import styles from "../styles/Index.module.scss";

class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			articles: [],
		};

		this.setArticles = this.setArticles.bind(this);
	}

	async get(path) {
		const data = await fetch(`http://localhost:5000/${path}`);
		const json = await data.json();
		return json;
	}
	setArticles(articles) {
		this.setState({ articles });
	}

	async componentDidMount() {
		const articles = await this.get("get/articles");
		this.setArticles(articles);
		console.log(articles);
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

	render() {
		const { navbar, story, title, button, article, articleContainer } =
			styles;
		const { articles } = this.state;
		const createLink = "create";
		return (
			<div>
				<Head>
					<title>Explore</title>
				</Head>
				<div className={navbar}>
					<div className={title}>LENS</div>
					<div className={story}>
						<Link href={createLink}>
							<Button
								variant="contained"
								className={button}
								color="default"
								startIcon={<Brush />}
							>
								Compose
							</Button>
						</Link>
					</div>
				</div>
				<div className={articleContainer}>
					{articles.map(({ id, title, author }) => {
						return (
							<Link href={`article/${id}`}>
								<div
									key={id}
									className={article}
									onClick={() => {
										console.log(id);
									}}
								>
									id: {id}, title: {title}, author: {author}
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		);
	}
}

export default index;
