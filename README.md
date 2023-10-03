# client-sdk-boilerplate-js

Boilerplate for JavaScript client SDK to communicate with websocket server. You can implement own methods based on this project.

## Usage

Get sdk doc run `npm run doc:gen`, and open `docs/index.html`

Here is simple example to use `client-sdk`:

```javascript

const client = WeedClientSDK.createClient('ws://0.0.0.0:8080/exmaple');

client.connect().then(async () => {
  try {
    let res = await client.System.ping();
    console.log(res);
  } catch(e) {
    console.log(e);
  }
});

```
