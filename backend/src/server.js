require('dotenv').config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { getCoordinates } = require("./emissionCoordinates");
const { sampleEmissionData, appendSomeData } = require("./sampleEmissions");
const {
  getMappingsBundleData,
  getMappingsWithUnknownCodeIds,
  retrieveKnownMappings,
} = require("./mappingsWithUnknownCode");
const path = require("path");

const filesDestination = process.env.FILES_DESTINATION;
const upload = multer({ dest: filesDestination });

const app = express().use(
  cors({
    origin: "*",
  })
);

app.get("/*", function (req, res, next) {
  res.setHeader("Last-Modified", new Date().toUTCString());
  next();
});

app.get("/", (req, res) => {
  res.send("Successful response.");
});

app.get("/health", (req, res) => {
  res.send('{ "status": "OK" }');
});

app.get("/emissionsByCoordinates", (req, res) => {
  const coordinates = getCoordinates();
  res.send(coordinates);
});

app.get("/unknownMappings", (req, res) => {
  const mappingsData = getMappingsBundleData();
  res.send(mappingsData);
});

app.get("/unknownMappingIds", (req, res) => {
  const mappingIds = getMappingsWithUnknownCodeIds();
  res.send(mappingIds);
});

app.get("/knownMappings", (req, res) => {
  const knownMappings = retrieveKnownMappings();
  res.send(knownMappings);
});

app.post("/mappings", express.json(), (req, res) => {
  if (!req.body) return res.sendStatus(400);

  console.log("Saved all mappings");
  console.log(req.body);
  res.sendStatus(200);
});

app.get("/api/v0/data/ranges", express.json(), function (req, res) {
  const { start, end } = JSON.parse(req.query.time_ranges)[0];
  res
    .contentType("application/json")
    .send(sampleEmissionData);
    //.send(appendSomeData(new Date(start), new Date(end)));
});

app.post("/files", upload.array("files", 12), async (req, res) => {
  console.log("Body received: ", JSON.stringify(req.files));
  let { files } = req;
  console.log("Files received: ", files);
  if (!files || !files.length) {
    res.statusMessage = "No files received";
    res.status(400).end();
    return;
  }

  const fileNames = files.map(file => file.originalname).join(", ")

  res.status(200).send(`We received: ${fileNames}`);
});

app.post("/reports", express.json(), (req, res) => {
  if (!req.body) {
    const msg = "We don't see body";
    console.log(msg);
    res.statusMessage = msg;
    res.status(400).end();
    return;
  }

  console.log("Generating report:");
  console.log(req.body);
  res.sendStatus(200);
});

const port = process.env.PORT;
app.listen(port, () =>
  console.log(`Example app is listening on port ${port}.`)
);
