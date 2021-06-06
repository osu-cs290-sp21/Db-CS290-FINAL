// All the imports needed
const { createPool } = require("mysql");
const express = require("express");
const cors = require("cors");
const uuid = require("uuid");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(cors());

// DBS that I created in mySQL
const DB_ARTICLES = "ARTICLES";
const DB_COMPONENTS = "COMPONENTS";

// get connected to the database
const connectionMessage = "Connected to final";
const { DB_LIMIT, DB_HOST, DB_USER, DB_PASSWORD, DB, PORT } = process.env;
const connection = createPool({
	connectionLimit: DB_LIMIT,
	host: DB_HOST,
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB,
});
connection.getConnection((errors) => {
	console.log(connectionMessage);
	if (errors) {
		return errors;
	}
});

// start of the get requests
app.get("/get/articles", (req, res) => {
	const QUERY = `SELECT * FROM ${DB_ARTICLES}`;
	connection.query(QUERY, (errors, results) => {
		if (results) {
			res.json(results);
		} else {
			console.log(errors);
		}
	});
});

// Sends back article from the database with the supplied ID
app.get("/get/article/:articleId", (req, res) => {
	const { articleId } = req.params;
	const QUERY = `SELECT * FROM ${DB_ARTICLES} WHERE id = ?`;
	const QUERY_PARAMS = [articleId];

	connection.query(QUERY, QUERY_PARAMS, (errors, results) => {
		if (results.length === 1) {
			res.status(200).json(results[0]);
		} else {
			res.status(404).json({
				error: errors,
			});
		}
	});
});

// Creates Article
app.post("/post/article", (req, res) => {
	// this is a spandrel that should be probably done in a better way
	const { title, color } = req.body;
	const uuidgen = uuid.v1();
	const QUERY = `INSERT INTO ${DB_ARTICLES} (title, likes, dislikes, uuid, color, score) VALUES(?, ?, ?, ?, ?, ?)`;
	const QUERY_PARAMS = [title, 0, 0, uuidgen, color, 0];

	connection.query(QUERY, QUERY_PARAMS, (errors, results) => {
		if (results) {
			const SUB = `SELECT * FROM ${DB_ARTICLES} WHERE uuid = '${uuidgen}'`;
			connection.query(SUB, (e, r) => {
				if (r) {
					res.status(200).json({
						message: "Added to the DataBase",
						id: r[0].id,
					});
				} else {
					res.send(e);
				}
			});
		} else {
			res.status(404).json({ message: "Could not add to the DataBase" });
		}
	});
});
app.post("/post/dislike", (req, res) => {
	const { articleId } = req.body;
	const QUERY = `SELECT * FROM ${DB_ARTICLES} WHERE id = ?`;
	const QUERY_PARAMS = [articleId];

	connection.query(QUERY, QUERY_PARAMS, (errors, results) => {
		if (results.length === 1) {
			const { likes, dislikes } = results[0];
			const UPDATE = `UPDATE ${DB_ARTICLES} SET ? WHERE Id = ?`;

			const incDislike = dislikes + 1;
			let payload = {
				dislikes: incDislike,
			};
			connection.query(
				UPDATE,
				[payload, articleId],
				(errors, results) => {
					if (results) {
						res.json({
							status: "success",
							likes,
							dislikes: incDislike,
						});
					} else {
						res.json(errors);
					}
				}
			);
		} else {
			res.status(404).json({
				error: errors,
			});
		}
	});
});

app.post("/post/like", (req, res) => {
	const { articleId } = req.body;
	const QUERY = `SELECT * FROM ${DB_ARTICLES} WHERE id = ?`;
	const QUERY_PARAMS = [articleId];

	connection.query(QUERY, QUERY_PARAMS, (errors, results) => {
		if (results.length === 1) {
			const { likes, dislikes } = results[0];
			const UPDATE = `UPDATE ${DB_ARTICLES} SET ? WHERE Id = ?`;

			const incLike = likes + 1;
			let payload = {
				likes: incLike,
			};
			connection.query(
				UPDATE,
				[payload, articleId],
				(errors, results) => {
					if (results) {
						res.json({
							status: "success",
							likes: incLike,
							dislikes,
						});
					} else {
						res.json(errors);
					}
				}
			);
		} else {
			res.status(404).json({
				error: errors,
			});
		}
	});
});

app.post("/post/score", (req, res) => {
	const { articleId, inc } = req.body;
	const QUERY = `SELECT * FROM ${DB_ARTICLES} WHERE id = ?`;
	const QUERY_PARAMS = [articleId];

	connection.query(QUERY, QUERY_PARAMS, (errors, results) => {
		if (results.length === 1) {
			const { score } = results[0];
			const UPDATE = `UPDATE ${DB_ARTICLES} SET ? WHERE Id = ?`;

			const newScore = inc ? score + 1 : score - 1;
			let payload = {
				score: newScore,
			};
			connection.query(
				UPDATE,
				[payload, articleId],
				(errors, results) => {
					if (results) {
						res.json({
							status: "success",
							score: newScore,
						});
					} else {
						res.json(errors);
					}
				}
			);
		} else {
			res.status(404).json({
				error: errors,
			});
		}
	});
});

// Creates Component
app.post("/post/component", (req, res) => {
	const { articleId, order, type, data } = req.body;
	const QUERY = `INSERT INTO ${DB_COMPONENTS} SET ?`;
	const QUERY_PARAMS = { articleId, order, type, data: JSON.stringify(data) };

	connection.query(QUERY, QUERY_PARAMS, (errors, results) => {
		if (results) {
			res.status(200).json({ message: "Added to the DataBase" });
		} else {
			res.status(404).json({ message: "Could not add to the DataBase" });
			console.log(errors);
		}
	});
});

// get components by ID
app.get("/get/components/:articleId", (req, res) => {
	const { articleId } = req.params;
	const QUERY = `SELECT * FROM ${DB_COMPONENTS} WHERE articleId = ?`;
	const QUERY_PARAMS = [articleId];

	connection.query(QUERY, QUERY_PARAMS, (errors, results) => {
		if (results) {
			res.status(200).json(
				results.map((result) => {
					const { data } = result;
					return { ...result, data: JSON.parse(data) };
				})
			);
		} else {
			res.status(404).json({
				error: errors,
			});
		}
	});
});

// this will create an article at custom likes
app.post("/generate", (req, res) => {
	const { title, score } = req.body;
	const QUERY = `INSERT INTO ${DB_ARTICLES} (title, likes, dislikes, uuid, color, score) VALUES(?, ?, ?, ?, ?, ?)`;
	const QUERY_PARAMS = [title, 0, 0, null, null, score];

	connection.query(QUERY, QUERY_PARAMS, (errors, results) => {
		if (results) {
			res.status(200).json({ message: "Added to the database" });
		} else {
			res.status(404).json({ message: "Could not add to the DataBase" });
		}
	});
});

// this will create an article at custom likes
app.post("/danger", (req, res) => {
	const QUERY = `DELETE FROM ${DB_ARTICLES}`;

	connection.query(QUERY, (errors, results) => {
		if (results) {
			res.status(200).json({ message: "successfully cleared" });
		} else {
			res.status(404).json({ message: "Could not add to the DataBase" });
		}
	});
});

app.listen(PORT, () => `listening on http://localhost:${PORT}`);
