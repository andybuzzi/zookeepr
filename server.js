const express = require("express");

//whenever we use require() to import data or functionality, it's only reading the data and creating a copy of it to use in server.js
const { animals } = require("./data/animals");

//import and use the fs library to write that data to animals.json.
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3001;
const app = express();
//parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
//parse incoming JSON data
app.use(express.json());

//(called middleware) link public folder to load with express --> The way it works is that we provide a file path to a location in our application (in this case, the public folder) and instruct the server to make these files static resources. This means that all of our front-end code can now be accessed without having a specific server endpoint created for it!
app.use(express.static("public"));

function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  //Note that we save the animalsArray as filteredResults here:
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    //save personalityTraits as a dedicated array.
    //if personalityTraits is a string, place it into a new array and save.
    if (typeof query.personalityTraits === "string") {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraits = query.personalityTraits;
    }
    //loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach((trait) => {
      // Check the trait against each animal in the filteredResults array. Remember, it is initially a copy of the animalsArray, but here we're updating it for each trait in the .forEach() loop. For each trait being targeted by the filter, the filteredResults array will then contain only the entries that contain the trait, so at the end we'll have an array of animals that have every one of the traits when the .forEach() loop is finished.

      filteredResults = filteredResults.filter(
        (animal) => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(
      (animal) => animal.diet === query.diet
    );
  }
  if (query.species) {
    filteredResults = filteredResults.filter(
      (animal) => animal.species === query.species
    );
  }
  if (query.name) {
    filteredResults = filteredResults.filter(
      (animal) => animal.name === query.name
    );
  }
  return filteredResults;
}

function findById(id, animalsArray) {
  const result = animalsArray.filter((animal) => animal.id === id)[0];
  return result;
}

function createNewAnimal(body, animalsArray) {
  const animal = body;
  animalsArray.push(animal);

  //we added require fs on top of the file
  fs.writeFileSync(
    path.join(__dirname, "./data/animals.json"),

    //  two arguments used in the method, null and 2, are means of keeping our data formatted. The null argument means we don't want to edit any of our existing data; if we did, we could pass something in there. The 2 indicates we want to create white space between our values to make it more readable. If we were to leave those two arguments out, the entire animals.json file would work, but it would be really hard to read.

    JSON.stringify({ animals: animalsArray }, null, 2)
  );

  //return finished code to post route for response
  return animal;
}

function validadeAnimal(animal) {
  if (!animal.name || typeof animal.name !== "string") {
    return false;
  }
  if (!animal.species || typeof animal.species !== "string") {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== "string") {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}

app.get("/api/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

app.get("/api/animals/:id", (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

app.post("/api/animals", (req, res) => {
  //set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  //if any data in req.body is incorrect, send 400 error back
  if (!validadeAnimal(req.body)) {
    res.status(400).send("The animal is not properly formatted.");
  } else {
    //add animal to json file and animals array in this function

    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
  }
});

app.get("/", (req, res) => {
  //Unlike most GET and POST routes that deal with creating or return JSON data, this GET route has just one job to do, and that is to respond with an HTML page to display in the browser. So instead of using res.json(), we're using res.sendFile(), and all we have to do is tell them where to find the file we want our server to read and send back to the client.

  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/animals", (req, res) => {
  // This route will take us to /animals. Did you notice how the endpoint here is just /animals? This is the second route we've created so far that doesn't have the term api thrown into it. This is intentional, because when we create routes we need to stay organized and set expectations of what type of data is being transferred at that endpoint.

  //We can assume that a route that has the term api in it will deal in transference of JSON data, whereas a more normal-looking endpoint such as /animals should serve an HTML page. Express.js isn't opinionated about how routes should be named and organized, so that's a system developers must create. The naming patterns we've used so far in this project closely follow what you'd typically see in a professional setting.

  res.sendFile(path.join(__dirname, "./public/animals.html"));
});

app.get("/zookeepers", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/zookeepers.html"));
});

app.get("*", (req, res) => {
  // The * will act as a wildcard, meaning any route that wasn't previously defined will fall under this request and will receive the homepage as the response. Thus, requests for /about or /contact or /membership will essentially be the same now. --> The * route should always come last.

  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
