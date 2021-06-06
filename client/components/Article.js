import React, { Component } from "react";
import axios from "axios";
import { Button, Icon, IconButton } from "@material-ui/core";
import {
	ThumbDown,
	ThumbUp,
	ThumbDownOutlined,
	ThumbUpOutlined,
} from "@material-ui/icons";
import Renderer from "./Renderer";
class Article extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: false,
			likeSelected: null,
			dislikeSelected: true,
			score: props.data.score,
		};
		this.inc = this.inc.bind(this);
	}
	async inc(id, isLike = true) {
		let postRequest = "http://localhost:5000/post/score";
		let result = await axios.post(postRequest, {
			articleId: id,
			inc: isLike,
		});
		this.setState({
			score: result.data.score,
		});
	}
	componentDidMount() {}
	componentWillUnmount() {}
	render() {
		const { components, data, id, reset } = this.props;
		const { title, color } = data;

		return (
			<div>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						position: "absolute",
						left: 10,
						top: 80,
					}}
				>
					<div style={{ fontSize: "20px" }}>{this.state.score}</div>
					<IconButton
						color="primary"
						onClick={async () => {
							if (this.state.likeSelected === null) {
								this.setState({
									dislikeSelected: false,
									likeSelected: true,
								});
								await this.inc(id, true);
							} else if (!this.state.likeSelected) {
								this.setState({
									dislikeSelected: false,
									likeSelected: true,
								});
								await this.inc(id, true);
								await this.inc(id, true);
							}
						}}
					>
						{this.state.likeSelected === null ? (
							<ThumbUpOutlined />
						) : this.state.likeSelected ? (
							<ThumbUp />
						) : (
							<ThumbUpOutlined />
						)}
					</IconButton>{" "}
					<IconButton
						color="primary"
						onClick={async () => {
							if (this.state.likeSelected === null) {
								this.setState({
									dislikeSelected: true,
									likeSelected: false,
								});
								await this.inc(id, false);
							} else if (this.state.likeSelected) {
								this.setState({
									dislikeSelected: true,
									likeSelected: false,
								});
								await this.inc(id, false);
								await this.inc(id, false);
							}
						}}
					>
						{this.state.likeSelected === null ? (
							<ThumbDownOutlined />
						) : this.state.likeSelected ? (
							<ThumbDownOutlined />
						) : (
							<ThumbDown />
						)}
					</IconButton>
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
