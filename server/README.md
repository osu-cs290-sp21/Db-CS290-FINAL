# API REFERENCE

## To get up and running

1. Update the .env with correct information to connect to mySQL db
2. `yarn dev`

## GET Requests

Below are the getters, structured by takes (url argument) followed by what gets
returned.

### get/articles

```javascript
return( Array of
	{
		id: Number,
		title: String,
		author: String,
		img: String,
	})
```

### get/article/:articleId

```javascript
takes -> articleId: Number
return(
	{
		id: Number,
		title: String,
		author: String,
		img: String,
	})
```

### /get/components/:articleId

```javascript
takes -> articleId: Number
return(Array of
	{
    id: Number,
    articleId: Number,
    order: Number,
    type: Number,
    data: JSON
  })
```

## POST Requests

### /post/article

```javascript
const { title: String, author: String, img: String } = req.body;
```

### /post/component

```javascript
const { articleId: String, order: Number, type: Number, data: JSON } = req.body;
```
