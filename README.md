# InteractDB

This project is a simple service API to store interactions between users in a graph database.

<a href="https://github.com/forevertz/interact-db/blob/master/LICENSE"><img alt="license" src="https://img.shields.io/badge/license-GPL--3.0_License-blue.svg?style=flat" /></a>

## Concepts

- There are 2 types of nodes : `Users` and `Contents`.
- You can add `Interactions`, which are links between a `User` and another `User` or a `Content` (for example `(a:User)-[:LIKES]->(c:Content)` or `(a:User)-[:FOLLOWS]->(b:User)`)
- You can also add `Comments`, which are a special kind of `Content` (for example `(a:User)-[:COMMENTED]->(:Comment:Content { text: 'This is cool' })-[:ABOUT]->(c:Content)`, same with a `User` or another `Comment`)

## Getting started

### Development

```shell
$ git clone https://github.com/forevertz/interact-db.git
$ cd interact-db
$ yarn install
$ yarn run dev
```

### Production

```shell
$ git clone https://github.com/forevertz/interact-db.git
$ cd interact-db
$ # Edit password in docker-compose.yml
$ docker-compose up -d
# Your API is now running locally on http://127.0.0.1:3003
# Recommended: install a reverse proxy to handle authentification and authorizations
```

## API

- _**GET** /user_: Get a User
- _**POST** /user_: Add or update a User
- _**POST** /content_: Add an Content linked to a User
- _**POST** /comment_: Add a Comment on a User or a Content
- _**POST** /interaction_: Add an Interaction between a User and another User or a Content

### Examples

<details><summary>GET /user</summary><p>

```bash
$ curl http://127.0.0.1:3003/user?id=my-user-id-1

{
  "success": true,
  "result": {
    "user": {
      "name": "Alice",
      "created": 1534249561246,
      "id": "my-user-id-1"
    }
  }
}

# OR (if no result)
{
  "success": true,
  "result": null
}
```

</p></details>

<details><summary>POST /user</summary><p>

```bash
# Add Alice
$ curl --request POST \
       --header "Content-Type: application/json" \
       --data '{ "id": "my-user-id-1", "name": "Alice" }' \
       http://127.0.0.1:3003/user

# Add Bob
$ curl --request POST \
       --header "Content-Type: application/json" \
       --data '{ "id": "my-user-id-2", "name": "Bob" }' \
       http://127.0.0.1:3003/user
```

</p></details>

<details><summary>POST /content</summary><p>

```bash
# Alice adds Content
$ curl --request POST \
       --header "Content-Type: application/json" \
       --data '{ "userId": "my-user-id-1", "id": "my-content-id-1", "type": "Article", "action": "SHARED", "url": "http://...", "text": "my content" }' \
       http://127.0.0.1:3003/content
```

</p></details>

<details><summary>POST /comment</summary><p>

```bash
# Bob comments Alice's Content
$ curl --request POST \
       --header "Content-Type: application/json" \
       --data '{ "userId": "my-user-id-2", "id": "my-content-id-2", "aboutContentId": "my-content-id-1", "text": "Useful content, thanks Alice!" }' \
       http://127.0.0.1:3003/comment

# Alice comments Bob's comment
$ curl --request POST \
       --header "Content-Type: application/json" \
       --data '{ "userId": "my-user-id-1", "id": "my-content-id-3", "aboutContentId": "my-content-id-2", "text": "Glad it helps." }' \
       http://127.0.0.1:3003/comment

# Bob adds a comment about Alice
$ curl --request POST \
       --header "Content-Type: application/json" \
       --data '{ "userId": "my-user-id-2", "id": "my-content-id-4", "aboutUserId": "my-user-id-1", "text": "Alice is great!" }' \
       http://127.0.0.1:3003/comment
```

</p></details>

<details><summary>POST /interaction</summary><p>

```bash
# Bob likes Alice's comment on his comment
$ curl --request POST \
       --header "Content-Type: application/json" \
       --data '{ "userId": "my-user-id-2", "toContentId": "my-content-id-3", "type": "LIKED" }' \
       http://127.0.0.1:3003/interaction

# Bob follows Alice
$ curl --request POST \
       --header "Content-Type: application/json" \
       --data '{ "userId": "my-user-id-2", "toUserId": "my-user-id-1", "type": "FOLLOWED" }' \
       http://127.0.0.1:3003/interaction
```

</p></details>

## LICENSE

<a href="https://github.com/forevertz/interact-db/blob/master/LICENSE"><img alt="license" src="https://img.shields.io/badge/license-GPL--3.0_License-blue.svg?style=flat" /></a>

This project is based on neo4j, which is [licensed under GPL v3](https://neo4j.com/licensing/).
