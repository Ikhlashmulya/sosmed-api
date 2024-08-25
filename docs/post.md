# Post api spec

## Create a new Post

Endpoint : POST /api/posts

Header : 
- Authorization : Bearer token

Request Body : 

```json
{
    "title": "string",
    "content": "string",
}
```

Response Body (success):

```json
{
    "data": {
        "post_id": "number",
        "username": "string",
        "title": "string",
        "content": "string",
        "created_at": "timestamp",
        "updated_at": "timestamp"
    }
}
```

Response Body (failed) :

```json
{
    "errors": "error message"
}
```

## Update Post

Endpoint : PUT /api/posts/{postId}

Header : 
- Authorization : Bearer token

Request Body : 

```json
{
    "title": "string",
    "content": "string",
}
```

Response Body (success):

```json
{
    "data": {
        "post_id": "number",
        "username": "string",
        "title": "string",
        "content": "string",
        "created_at": "timestamp",
        "updated_at": "timestamp"
    }
}
```

Response Body (failed) :

```json
{
    "errors": "error message"
}
```

## Get Post by id

Endpoint : GET /api/posts/{postId}

Header : 
- Authorization : Bearer token

Response Body (success):

```json
{
    "data": {
        "post_id": "number",
        "username": "string",
        "title": "string",
        "content": "string",
        "created_at": "timestamp",
        "updated_at": "timestamp"
    }
}
```

Response Body (failed) :

```json
{
    "errors": "error message"
}
```

## Delete Post 

Endpoint : DELETE /api/posts/{postId}

Header : 
- Authorization : Bearer Token 

Response Body (success) : 

```json
{
    "data": true
}
```

Response Body (failed) : 

```json
{
    "errors": "error message"
}
```

## Get all / Search Post

Endpoint : GET /api/posts 

Header : 
- Authorization : Bearer token 

Query Params :
- search : string, search by title or content (optional)
- size : number (default: 10)
- page : number (default: 1)

Response Body (success) : 

```json
{
    "data": [
        {
            "post_id": "number",
            "username": "string",
            "title": "string",
            "content": "string",
            "created_at": "timestamp",
            "updated_at": "timestamp"
        }
    ],
    "paging": {
        "size": 10,
        "page": 1,
    }
}
```

## Get Post by username

Endpoint : GET /api/users/{username}/posts

Header :
- Authorization : Bearer token

Query Params :
- size : number (default: 10)
- page : number (default: 1)

Response Body (success) : 

```json
{
    "data": [
        {
            "post_id": "number",
            "username": "string",
            "title": "string",
            "content": "string",
            "created_at": "timestamp",
            "updated_at": "timestamp"
        }
    ],
    "paging": {
        "size": 10,
        "page": 1,
    }
}
```

Response Body (failed) : 

```json
{
    "errors": "error message"
}
```
