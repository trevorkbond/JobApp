const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(function (err, req, res, next) {
  res.status(500).send({type: err.name, message: err.message});
});

var apiRouter = express.Router();
app.use('/api', apiRouter);

app.post('/job', (req, res) => {
  jobs = addJob(jobs, req);
  res.send(jobs);
})

const port = 8080;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

let jobs = [];
let nextJobID = 0;

function addJob(jobs, newJob) {
  newJob.jobID = nextJobID++;
  if (findJob(newJob.jobID === null)) {
    jobs.push(newJob);
  } else {
    throw new Error('jobID already taken');
  }
}

function findJob(jobID) {
  jobs.forEach((job) => {
    if (job.jobID === jobID) {
      return job;
    }
  })
  return null;
}

