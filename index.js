const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let count = 0;

server.use((req, res, next) => {
  count += 1;
  console.log("Requests: " + count);
  return next();
});

function checkProjectId(req, res, next) {
  const { id } = req.params;
  projects.filter(function(value, index) {
    if (id == value.id) {
      req.index = index;
    }
  });
  if (req.index >= 0) {
    return next();
  }

  return res.status(400).json({ erro: "Project not found" });
}

server.get("/", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id } = req.body;
  const { title } = req.body;

  const project = {};
  project.id = id;
  project.title = title;
  project.tasks = [];

  projects.push(project);

  return res.json(project);
});

server.put("/projects/:id", checkProjectId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects[req.index];

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectId, (req, res) => {
  projects.splice(req.index, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkProjectId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects[req.index];
  project.tasks.push(title);
  return res.json(project);
});

server.listen(3000);
