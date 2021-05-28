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
const DB_ARTICLES = "ARTICLES";
const DB_COMPONENTS = "COMPONENTS";

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
	const { title } = req.body;
	const uuidgen = uuid.v1();
	const QUERY = `INSERT INTO ${DB_ARTICLES} (title, likes, dislikes, uuid) VALUES(?, ?, ?, ?)`;
	const QUERY_PARAMS = [title, 0, 0, uuidgen];

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
// Creates Article
app.post("/post/test", (req, res) => {
	// we first post the article
	// we get article id by uuid
	// we add all the components with the returned article id

	console.log(req.body);
	console.log(uuid.v1());
	res.send("nice");
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

app.get("/", (req, res) => {
	res.send("working");
});

app.listen(PORT);
