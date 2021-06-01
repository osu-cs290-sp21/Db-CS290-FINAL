import React, { Component } from "react";
import axios from "axios";
import { Button, Icon, IconButton } from "@material-ui/core";
import { ThumbDown, ThumbUp } from "@material-ui/icons";
import Renderer from "./Renderer";
class Article extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: false,
			likeSelected: false,
			dislikeSelected: false,
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
	componentDidMount() {
		console.log(JSON.stringify(this.props.components));
	}
	render() {
		const { components, data, id } = this.props;
		const { title, color } = data;
		return (
			<div>
				<div
					style={{
						background: color,
						padding: "10px",
					}}
				>
					<div style={{ fontSize: "25px", color: "white" }}>
						{title}
					</div>
				</div>
				<div>score: {this.state.score}</div>
				<div>
					<Button
						onClick={async () => {
							this.setState({
								dislikeSelected: false,
								likeSelected: true,
							});
							await this.inc(id, true);
						}}
						variant="outlined"
						style={{
							color: this.state.likeSelected ? color : "",
						}}
						startIcon={<ThumbUp></ThumbUp>}
					>
						Accept
					</Button>{" "}
					<Button
						onClick={async () => {
							this.setState({
								dislikeSelected: true,
								likeSelected: false,
							});
							await this.inc(id, false);
						}}
						variant="outlined"
						style={{
							color: this.state.dislikeSelected ? color : "",
						}}
						startIcon={<ThumbDown></ThumbDown>}
					>
						Reject
					</Button>
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
