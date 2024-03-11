const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(function (err, req, res, next) {
  res.status(500).send({type: err.name, message: err.message});
});

var apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.post('/jobs', (req, res) => {
  addJob(jobs, req.body);
  const filteredJobs = getFilteredJobs(jobs, req.body);
  res.send(filteredJobs);
})

apiRouter.get('/jobs/:user', (req, res) => {
  const username = req.params.user;
  const filteredJobs = getFilteredJobs(jobs, username);
  res.send(filteredJobs);
})

apiRouter.put('/jobs', (req, res) => {
  // getJob
})

apiRouter.delete('/jobs', (req, res) => {
  deleteJob(jobs, req.body);
  const filteredJobs = getFilteredJobs(jobs, req.body);
  res.send(filteredJobs);
})

const port = 8080;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

let jobs = [];
let nextJobID = 0;

function addJob(jobs, newJob) {
  newJob.jobID = nextJobID++;
  jobs.push(newJob);
}

function deleteJob(jobs, delJob) {
  for (let i = 0; i < jobs.length; i++) {
    if (jobs[i].jobID === delJob.jobID) {
      jobs.splice(i, 1);
    }
  }
}

function getFilteredJobs(jobs, user) {
  const filteredJobs = jobs.filter(job => job.user === user);
  return filteredJobs;
}

