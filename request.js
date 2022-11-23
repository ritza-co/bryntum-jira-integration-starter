import { createTaskBoard } from './index.js';

const serverAddress = 'http://localhost:3000';
const clientAddress = 'http://localhost:8080';

async function getTasksFromJira() {
  fetch(`${serverAddress}/getIssues/`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin': clientAddress,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => createTaskBoard(data));
}

async function sendRequest(event, address, requestMethod) {
  const requestBody = {
    'key': event.records[0].data.jiraId,
    'status': event.records[0].data.status,
    'summary': event.records[0].data.name,
  };
  await fetch(`${serverAddress}/${address}/`, {
    method: requestMethod,
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin': clientAddress,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })
    .then((res) => res.json())
    .then((results) => event.records[0].data.jiraId = results.id)
    .then((data) => console.log(data));
}

async function updateJira(event) {
  if (event.action === 'update' && 'name' in event.changes) {
    sendRequest(event, 'updateName', 'PUT');
  } else if (event.action === 'update' && 'status' in event.changes) {
    sendRequest(event, 'updateTransition', 'POST');
  } else if (event.action === 'add' && event.records.length === 1) {
    sendRequest(event, 'addIssue', 'POST');
  } else if (event.action === 'remove' && event.records.length === 1) {
    sendRequest(event, 'deleteIssue', 'DELETE');
  }
}

export { getTasksFromJira, updateJira };
