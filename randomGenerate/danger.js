const axios = require("axios");

async function main() {
	const post = await axios.post("http://localhost:5000/danger", {});
}
main();
