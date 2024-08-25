# Comment api spec

## Create a new Comment 

Endpoint : POST /api/posts/{postId}/comments

Header : 
- Authorization : Bearer token

Request Body : 

```json
{
    "content": "string"
}
```

Response Body (success):

```json
{
    "data": {
        "comment_id": "number"
        "username": "string",
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

## Update Comment

Endpoint : PUT /api/posts/{postId}/comments/{commentId}

Header : 
- Authorization : Bearer token

Request Body : 

```json
{
    "content": "string"
}
```

Response Body (success):

```json
{
    "data": {
        "comment_id": "number",
        "username": "string",
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

## Get Comment by id

Endpoint : GET /api/posts/{postId}/comments/{commentId}

Header : 
- Authorization : Bearer token

Response Body (success):

```json
{
    "data": {
        "comment_id": "number",
        "username": "string",
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

## Delete Comment

Endpoint : DELETE /api/posts/{postId}/comments/{commentId}

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

## Get all Post

Endpoint : GET /api/posts/{postId}/comments

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
            "comment_id": "number",
            "username": "string",
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

