const path = require("path");
const router = require("express").Router();

router.get("/", (req, res) => {
  //Unlike most GET and POST routes that deal with creating or return JSON data, this GET route has just one job to do, and that is to respond with an HTML page to display in the browser. So instead of using res.json(), we're using res.sendFile(), and all we have to do is tell them where to find the file we want our server to read and send back to the client.

  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

router.get("/animals", (req, res) => {
  // This route will take us to /animals. Did you notice how the endpoint here is just /animals? This is the second route we've created so far that doesn't have the term api thrown into it. This is intentional, because when we create routes we need to stay organized and set expectations of what type of data is being transferred at that endpoint.

  //We can assume that a route that has the term api in it will deal in transference of JSON data, whereas a more normal-looking endpoint such as /animals should serve an HTML page. Express.js isn't opinionated about how routes should be named and organized, so that's a system developers must create. The naming patterns we've used so far in this project closely follow what you'd typically see in a professional setting.

  res.sendFile(path.join(__dirname, "../../public/animals.html"));
});

router.get("/zookeepers", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/zookeepers.html"));
});

router.get("*", (req, res) => {
  // The * will act as a wildcard, meaning any route that wasn't previously defined will fall under this request and will receive the homepage as the response. Thus, requests for /about or /contact or /membership will essentially be the same now. --> The * route should always come last.

  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

module.exports = router;
