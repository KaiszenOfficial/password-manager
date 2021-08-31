import { Fragment, useEffect, useState } from 'react';
import {
  AppBar,
  Container,
  createTheme,
  Grid,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@material-ui/core';
import logo from './logo.svg';
import { PasswordList, PasswordForm } from './components';
import { deleteCredential, loadSavedCredentials, saveCredential } from './renderer';
import { STORAGE_ENUMS } from './constants';
const { ipcRenderer } = window.require('electron');

const initialState = {
  id: null,
  title: '',
  username: '',
  link: '',
  description: '',
  password: '',
  thumbnail: '',
  config: {
    isProtected: false,
    length: 12,
    numbers: true,
    symbols: true,
  },
  createdAt: null,
  updatedAt: null
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#282c34',
    }
  },
  typography: {
    fontFamily: 'Source Sans Pro'
  }
});


function App() {
  const [storedCredentials, setStoredCredentials] = useState([]);
  const [credential, setCredential] = useState(initialState);

  useEffect(() => {
    loadSavedCredentials();
  }, []);

  useEffect(() => {
    ipcRenderer.on(STORAGE_ENUMS.HANDLE_LOAD_SAVED_CREDENTIALS, handleLoadSavedCredentials);
    
    return () => {
      ipcRenderer.removeListener(STORAGE_ENUMS.HANDLE_LOAD_SAVED_CREDENTIALS, handleLoadSavedCredentials);
    }
  });

  const handleLoadSavedCredentials = (event, message) => {
    setStoredCredentials(message.credentials);
  }

  const handleFormSubmit = type => {
    if(type === 'submit') {
      saveCredential(credential);
    } else if (type === 'reset') {
      setCredential(initialState)
    }
  };

  useEffect(() => {
    ipcRenderer.on(STORAGE_ENUMS.HANDLE_SAVE_CREDENTIAL, handleSaveCredential);

    return () => {
      ipcRenderer.removeListener(STORAGE_ENUMS.HANDLE_SAVE_CREDENTIAL, handleSaveCredential);
    }
  });

  const handleSaveCredential = (event, message) => {
    setCredential(initialState);
    loadSavedCredentials();
  }

  const handleSelectCredential = (credential) => {
    setCredential(credential);
  }

  const handleDeleteCredential = (credential) => {
    deleteCredential(credential.id);
  }

  useEffect(() => {
    ipcRenderer.on(STORAGE_ENUMS.HANDLE_DELETE_CREDENTIAL, handleOnDeleteCredential);

    return () => {
      ipcRenderer.removeListener(STORAGE_ENUMS.HANDLE_DELETE_CREDENTIAL, handleOnDeleteCredential);
    }
  });

  const handleOnDeleteCredential = (event, message) => {
    loadSavedCredentials();
  }

  return (
    <Fragment>
      <ThemeProvider theme={theme}>
        <AppBar
          position="static"
          sx={{ backgroundColor: '#282c34', color: '#abb2bf' }}
        >
          <Toolbar variant="dense">
            <img src={logo} alt="PasswordManager" height="60" width="60" />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Credentials Manager
            </Typography>
          </Toolbar>
        </AppBar>
        <Container sx={{ paddingTop: '2rem' }}>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              {storedCredentials && (
                <PasswordList storedCredentials={storedCredentials} onSelectCredential={handleSelectCredential} onDeleteCredential={handleDeleteCredential} />
              )}
            </Grid>
            <Grid item xs={8}>
              <PasswordForm
                credential={credential}
                onChangeCredential={setCredential}
                onFormSubmit={(type) => handleFormSubmit(type)}
              />
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </Fragment>
  );
}

export default App;
