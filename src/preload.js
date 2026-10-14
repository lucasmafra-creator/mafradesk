const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('mafraDesk', Object.freeze({
  getLocalSessionInfo: () => ipcRenderer.invoke('session:get-local-info'),
  rotateTemporaryCode: () => ipcRenderer.invoke('session:rotate-code'),
  copySessionField: (field) => {
    if (field !== 'id' && field !== 'code') return Promise.resolve({ copied: false });
    return ipcRenderer.invoke('clipboard:copy-session-field', field);
  },
}));
