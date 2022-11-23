import { TaskBoard, TaskStore } from '@bryntum/taskboard/taskboard.module.js';
import { getTasksFromJira, updateJira } from './request.js';

getTasksFromJira();

function getIssueData(issues) {
  const issueList = [];
  issues = issues.issues;

  for (let i = 0; i < issues.length; i++) {
    const newIssue = {
      jiraId: issues[i].key,
      name: issues[i].fields.summary,
      status: issues[i].fields.status.name.toLowerCase(),
    };
    issueList.push(newIssue);
  }
  return issueList;
}

function createTaskBoard(issues) {
  const taskStore = new TaskStore({

    listeners: {
      change: function (event) {
        updateJira(event);
      }
    },
    data: getIssueData(issues),

  });

  const taskBoard = new TaskBoard({

    appendTo: 'taskboard',

    columnField: 'status',

    columns: [
      'to do',
      'in progress',
      'done'
    ],

    project: {
      taskStore
    }

  });
}

export { createTaskBoard };
