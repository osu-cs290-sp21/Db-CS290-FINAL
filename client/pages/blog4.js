import Renderer from "../components/Renderer";
import { Box, Card, CardContent } from "@material-ui/core";

function blog4() {
	const components = [
		{ index: 4, data: "By Donny Bertucci Friday May 14th" },
		{ index: 1, data: "Code Blog 4" },
		{ index: 2, data: "Challenges" },
		{
			index: 4,
			data: "For this, I didn't read the instruction all the way through so I first ended up implementing everything using express which took like 10 lines of code. After reading again, I found that we have to use packages that come with node: http, fs, path. This was the only challenge because I was not aware of the functions contained within these built in packages. To solve this I just looked up the documentation and was able to finish smoothly.",
		},
		{ index: 2, data: "What I learned" },
		{
			index: 4,
			data: "I have used node a few times in the past so nothing in that space was new to me. The only new thing was using the built in node packages. Usually I would just use express, but it seems like for this assignment it was more important to get the basics down. So I had to learn how to get file path and send the file as a response after parsing the url that the server was listening for. Other than that I did not learn anything too new to me.",
		},
		{ index: 2, data: "What I would Improve upon" },
		{
			index: 4,
			data: "I think I could read the file in a more elagent way. I used the path function to get the path then dataSync to get the buffer. It would make more sense to just use data in this case and have a callback function to emphasize the async nature of the entire function. So essentially I should have made everything more readable. ",
		},
		{ index: 2, data: "Resources Used" },
		{
			index: 4,
			data: "I used mdn again to check javascript related issues and I read the official documentation on fs and path in order to use those quickly.",
		},
	];
	return (
		<div style={{ display: "flex", justifyContent: "center" }}>
			<div style={{ width: "75%" }}>
				<Card>
					<CardContent>
						<Renderer components={components}></Renderer>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
export default blog4;
