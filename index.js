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
  res.send(jobs);
})

apiRouter.get('/jobs', (req, res) => {
  res.send(jobs);
})

const port = 8080;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

let jobs = [];
let nextJobID = 0;

function addJob(jobs, newJob) {
  console.log('newjob: ' + JSON.stringify(newJob));
  console.log('jobs: ' + JSON.stringify(jobs));
  newJob.jobID = nextJobID++;
  jobs.push(newJob);
  console.log('jobs: ' + JSON.stringify(jobs));
}

