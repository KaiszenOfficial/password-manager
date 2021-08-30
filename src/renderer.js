import { STORAGE_ENUMS } from './constants';
import { formatCredential } from './utils/password.utils';
const { ipcRenderer } = window.require('electron');

export const loadSavedCredentials = () => {
	ipcRenderer.send(STORAGE_ENUMS.LOAD_SAVED_CREDENTIALS);
}

export const saveCredential = (credential) => {
	let formattedCredential = formatCredential(credential);
	console.dir(formattedCredential);
	ipcRenderer.send(STORAGE_ENUMS.SAVE_CREDENTIAL, formattedCredential);
}