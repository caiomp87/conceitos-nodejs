const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
let qtdRequest = 0;

server.use((request, response, next) => {
  console.time('Request');

  next();

  console.timeEnd('Request');
  qtdRequest++;
  
  console.log(`Número de requests até agora: ${qtdRequest}`);
});

// Middleware local
function checkIdExists(request, response, next) {
  const project = projects.find(p => p.id === request.params.id);

  if(!project) {
    return response.status(400).json({ error: 'Id does not exists'});
  }

  return next();
}

server.get('/projects', (request, response) => {
  return response.json(projects);
});

server.post('/projects', (request, response) => {
  const { id, title } = request.body;

  const newProject = {
    id: id,
    title: title,
    tasks: []
  };

  projects.push(newProject);
  
  return response.json(projects);
});

server.post('/projects/:id/tasks', checkIdExists, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;

  const project = projects.find(p => p.id === id);
  project.tasks.push(title);

  return response.json(projects);
});

server.put('/projects/:id', checkIdExists, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;

  const project = projects.find(p => p.id === id);
  project.title = title;

  return response.json(projects);
});

server.delete('/projects/:id', checkIdExists, (request, response) => {
  const { id } = request.params;

  const project = projects.find(p => p.id === id);
  projects.splice(projects.indexOf(project), 1);

  return response.send();
});

server.listen(3000);