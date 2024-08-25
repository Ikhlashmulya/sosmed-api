# User API Spec

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
  "username" : "johndoe",
  "password" : "password",
  "name" : "John Doe"
}
```

Response Body (Success) : 

```json
{
  "data" : {
    "username" : "johndoe",
    "name" : "John Doe"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Username already exist"
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username" : "johndoe",
  "password" : "password"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "username" : "johndoe",
    "name" : "John Doe",
    "token" : "jwt token"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Username or password is wrong"
}
```

## Get User

Endpoint : GET /api/users/current

Headers :
- Authorization: token

Response Body (Success) :

```json
{
  "data" : {
    "username" : "johndoe",
    "name" : "John Doe"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Unauthorized token is empty"
}
```

## Get User by username

Endpoint : GET /api/users/{username}

Headers :
- Authorization: token

Response Body (Success) :

```json
{
  "data" : {
    "username" : "johndoe",
    "name" : "John Doe"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "user not found"
}
```

## Update User

Endpoint : PATCH /api/users/current

Headers :
- Authorization: token

Request Body :

```json
{
  "password" : "johndoe", // optional, if want to change password
  "name" : "John Doe" // optional, if want to change name
}
```

Response Body (Success) :

```json
{
  "data" : {
    "username" : "johndoe",
    "name" : "John Doe"
  }
}
```

