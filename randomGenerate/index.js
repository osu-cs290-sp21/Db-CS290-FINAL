const rand = require("random");
const axios = require("axios");

const numArticles = 100;
const lower = -500;
const upper = 1000;
const randFunc = rand.normal((min = lower), (max = upper));
const getRoundRand = () => Math.round(randFunc());

async function main() {
	for (let i = 0; i < numArticles; i++) {
		const randNum = getRoundRand();
		const post = await axios.post("http://localhost:5000/generate", {
			title: `${randNum}generated`,
			score: randNum,
		});
	}
}
main();
