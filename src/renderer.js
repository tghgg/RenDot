'use strict';
const { ipcRenderer } = require('electron');

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  ipcRenderer.send('started_parsing', {
    name: document.querySelector('#script_name').value,
    script: document.querySelector('#script').value
  });
  document.querySelector('#script').focus();
});

ipcRenderer.on('open-script', (event, data) => {
  if (document.querySelector('#script').value !== '') {
    console.log('Wait!');
    ipcRenderer.invoke('editor-overwrite-confirmation').then((result) => {
      if (result === 1) {
        document.querySelector('#script_name').value = data.name;
        document.querySelector('#script').value = data.value;
      }
    });
  } else {
    document.querySelector('#script_name').value = data.name;
    document.querySelector('#script').value = data.value;
  }
  document.querySelector('#script').focus();
});

ipcRenderer.on('empty-check', (event, data) => {
  if (document.querySelector('#script_name').value !== '') {
    ipcRenderer.send('save-script', {
      name: document.querySelector('#script_name').value,
      script: document.querySelector('#script').value
    });
  } else {
    ipcRenderer.send('save-script', null);
  }
  document.querySelector('#script').focus();
});