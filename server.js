import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const atlassianAddress = '<your-atlassian-address-here>';
const projectKey = '<your-project-key-here>';
const email = '<your-email-here>';
const token = '<your-api-token-here>';
const transitionList = {
  'to do': '11',
  'in progress': '21',
  'done': '31',
};
const authHeaders = {
  'Access-Control-Allow-Origin': '*',
  // eslint-disable-next-line quote-props
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': `Basic ${Buffer.from(
    `${email}:${token}`,
  ).toString('base64')}`,
};
const app = express();

app.use(cors({
  origin: 'http://localhost:8080',
}));
app.use(express.json());

// eslint-disable-next-line prefer-arrow-callback
app.get('/getIssues', function (req, res) {
  fetch(`${atlassianAddress}/2/search?jql=project=${projectKey}`, {
    method: 'GET',
    headers: authHeaders,
  })
    .then((res) => res.json())
    .then((json) => res.send(json));
});

app.put('/updateName', function (req, res) {
  fetch(`${atlassianAddress}/2/issue/${req.body.key}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      'update': {
        'summary': [
          {
            'set': req.body.summary,
          }
        ],
      },
    }),

  })
    .then((res) => res.json())
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
});

app.post('/addIssue', function (req, res) {
  const transitionType = transitionList[req.body.status];
  const bodyData = {
    'fields': {
      'summary': req.body.summary,
      'project': {
        'key': 'JDW',
      },
      'issuetype': {
        'id': '10001',
      },
    },
    'transition': {
      'id': transitionType,
    }
  };

  fetch(`${atlassianAddress}/3/issue`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(bodyData),
  })
    .then((res) => res.json())
    .then((json) => res.send(json))
    .catch((err) => console.log(err));
});

app.delete('/deleteIssue', function (req, res) {
  fetch(`${atlassianAddress}/3/issue/${req.body.key}`, {
    method: 'DELETE',
    headers: authHeaders,
  })
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.log(err));
});

app.post('/updateTransition', function (req, res) {
  const transitionType = transitionList[req.body.status];

  fetch(`${atlassianAddress}/2/issue/${req.body.key}/transitions`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      'transition': {
        'id': transitionType,
      }
    }),
  })
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.log(err));
});

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});
