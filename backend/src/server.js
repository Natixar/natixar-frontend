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

app.get("/api/v0/data/ranges", function (req, res) {
  const defaultRange = { start: "2022-01-01T00:00:00+01:00", end: "2024-01-01T00:00:00+01:00" };
  let start, end;

  if (req.query.time_ranges) {
    try {
      const ranges = JSON.parse(req.query.time_ranges)[0];
      start = ranges.start;
      end = ranges.end;
    } catch (error) {
      console.error("Error parsing time_ranges:", error);
      res.status(400).send("Invalid JSON format frtime_rangs");
    }
  } else {
    start = defaultRange.start;
    end = defaultRange.end;
  }

  const protocol = req.query.protocol; // Get the protocol parameter from the query string

  // Check if the protocol exists in the sampleEmissionData dictionary
  if (sampleEmissionData.hasOwnProperty(protocol)) {
    // Send the data for the requested protocol
    res
      .contentType("application/json")
      .send(sampleEmissionData[protocol]);
  } else {
    // If the protocol is not found, send a 404 error with a message
    res
      .status(404)
      .contentType("application/json")
      .send({
        code: "0000-0001", // Custom error code
        message: `The requested protocol '${protocol}' is not supported or not found.`
      });
  }
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
