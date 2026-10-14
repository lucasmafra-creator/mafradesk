const path = require('node:path');
const { app, BrowserWindow, clipboard, ipcMain } = require('electron');
const {
  createSessionIdentity,
  isTemporaryCodeValid,
  rotateTemporaryCode,
} = require('./sessionIdentity');

let mainWindow;
let sessionIdentity;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 780,
    minWidth: 940,
    minHeight: 640,
    backgroundColor: '#0b1018',
    title: 'MafraDesk',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

ipcMain.handle('session:get-local-info', () => ({
  id: sessionIdentity.id,
  temporaryCode: sessionIdentity.temporaryCode.value,
  expiresAt: sessionIdentity.temporaryCode.expiresAt,
  valid: isTemporaryCodeValid(sessionIdentity),
  networkReady: false,
}));

ipcMain.handle('session:rotate-code', () => {
  sessionIdentity = rotateTemporaryCode(sessionIdentity);
  return {
    temporaryCode: sessionIdentity.temporaryCode.value,
    expiresAt: sessionIdentity.temporaryCode.expiresAt,
    valid: true,
  };
});

ipcMain.handle('clipboard:copy-session-field', (_event, field) => {
  const allowedValues = {
    id: sessionIdentity.id,
    code: isTemporaryCodeValid(sessionIdentity)
      ? sessionIdentity.temporaryCode.value
      : '',
  };
  const value = allowedValues[field];
  if (!value) return { copied: false };
  clipboard.writeText(value);
  return { copied: true };
});

app.whenReady().then(() => {
  sessionIdentity = createSessionIdentity();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
