const { MongoClient } = require('mongodb');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const config = require('./dbConfig.json');

const userName = config.userName;
const password = config.password;
const hostname = config.hostname;

const url = `mongodb+srv://${userName}:${password}@${hostname}`;
const client = new MongoClient(url);
const userCollection = client.db('startup').collection('user');
const jobCollection = client.db('startup').collection('job');

function getUser(user) {
  return userCollection.findOne({ user: user });
}

function getUserByToken(token) {
    return userCollection.findOne({ token: token });
}

async function createUser(userName, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    user: userName,
    password: passwordHash,
    token: uuid.v4(),
  };

  await userCollection.insertOne(user);

  return user;
}

function addJob(job, jobID) {
  job.jobID = jobID;
  jobCollection.insertOne(job);
  return job;
}

function editJob(job) {
  jobCollection.updateOne( { jobID : job.jobID },
    {
      $set: {
        jobTitle : job.title,
        companyName : job.company,
        dueDate : job.date,
        status : job.status,
        jobLink : job.link,
        contact : job.contact,
        jobID : job.jobID,
        notes : job.notes,
      }
    })
}

function getJobsForUser(user) {
  const jobs = jobCollection.find({ user : user });
  return jobs.toArray();
}

module.exports = {
    getUser,
    createUser,
    getUserByToken,
    addJob,
    getJobsForUser,
};