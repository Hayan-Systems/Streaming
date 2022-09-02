const fs = require("fs");
const bodyParser = require("body-parser");
const express = require("express");
const fileUpload = require("express-fileupload");
var cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:1337",
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/",
  })
);

// const hostname = "localhost";
const port = 3000;

const makeDirnameFilename = (name, chunk) => {
  const dirname = `./uploads/${name}`;
  const filename = `${dirname}/${chunk}.webm`;
  return [dirname, filename];
};

app.put("/upload", (req, res) => {
  const file = req.files.file;
  const [dirname, filename] = makeDirnameFilename(
    req.body.name,
    req.body.chunk
  );

  fs.promises.mkdir(dirname, { recursive: true }).then(file.mv(filename));

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Upload\n");
});

app.get("/download", (req, res) => {
  const query = req.query;
  const [dirname, filename] = makeDirnameFilename(query.name, query.chunk);

  fs.promises
    .readFile(filename)
    .then((file) => {
      res.statusCode = 200;
      res.write(file, "binary");
      res.end();
    })
    .catch((err) => {
      console.log(err);
      res.statusCode = 204;
      res.end();
    });
});

app.listen(port, () =>
  console.log(`Hello world app listening on port ${port}!`)
);
