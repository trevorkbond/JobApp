const express = require('express');
const DB = require('./database.js');
const app = express();
const authCookieName = 'token';

app.use(express.json());
app.use(express.static('public'));
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

var apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.post('/auth/create', async (req, res) => {
  if (await DB.getUser(req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createUser(req.body.email, req.body.password);

    // Set the cookie
    setAuthCookie(res, user.token);

    res.send({
      id: user._id,
    });
  }
});

apiRouter.post('/jobs', (req, res) => {
  addJob(jobs, req.body);
  const filteredJobs = getFilteredJobs(jobs, req.body.user);
  res.send(filteredJobs);
})

apiRouter.get('/jobs/single/:jobID', (req, res) => {
  const jobID = parseInt(req.params.jobID);
  foundJob = getJobFromID(jobs, jobID);
  res.send(foundJob);
})

apiRouter.get('/jobs/:user', (req, res) => {
  const username = req.params.user;
  const filteredJobs = getFilteredJobs(jobs, username);
  res.send(filteredJobs);
})

apiRouter.put('/jobs', (req, res) => {
  editJob(jobs, req.body);
  const filteredJobs = getFilteredJobs(jobs, req.body.user);
  res.send(filteredJobs);
})

apiRouter.put('/jobs/:status', (req, res) => {
  editJobStatus(jobs, req.params.status, req.body.jobID);
  const filteredJobs = getFilteredJobs(jobs, req.body.user);
  res.send(filteredJobs);
})

apiRouter.delete('/jobs', (req, res) => {
  deleteJob(jobs, req.body);
  const filteredJobs = getFilteredJobs(jobs, req.body.user);
  res.send(filteredJobs);
})

const port = 4000;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

let jobs = [];
let nextJobID = 0;

function addJob(jobs, newJob) {
  newJob.jobID = nextJobID++;
  jobs.push(newJob);
}

function getJobFromID(jobs, jobID) {
  for (let i = 0; i < jobs.length; i++) {
    if (jobs[i].jobID === jobID) {
      return jobs[i];
    }
  }
}

function deleteJob(jobs, delJob) {
  for (let i = 0; i < jobs.length; i++) {
    if (jobs[i].jobID === delJob.jobID) {
      jobs.splice(i, 1);
      return;
    }
  }
}

function editJob(jobs, editJob) {
  for (let i = 0; i < jobs.length; i++) {
    if (jobs[i].jobID === editJob.jobID) {
      jobs[i] = editJob;
      return;
    }
  }
}

function editJobStatus(jobs, status, jobID) {
  for (let i = 0; i < jobs.length; i++) {
    if (jobs[i].jobID === jobID) {
      jobs[i].status = status;
      return;
    }
  }
}

function getFilteredJobs(jobs, user) {
  const filteredJobs = jobs.filter(job => job.user === user);
  return filteredJobs;
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

