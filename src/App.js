import { Fragment, useState } from 'react';
import {
  AppBar,
  Container,
  createTheme,
  Grid,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@material-ui/core';
import Dexie from 'dexie'
import { useLiveQuery } from "dexie-react-hooks";
import logo from './logo.svg';
import { PasswordList, PasswordForm } from './components';
import { formatPassword } from './utils';

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
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#282c34',
    }
  },
  typography: {
    fontFamily: ['Seaford', 'sans-serif'].join(',')
  }
});

const credentialsDB = new Dexie('Credentials');

credentialsDB.version(1).stores(
  { items: "++id,title,username,link,description,password,thumbnail,config" }
);

function App() {
  const [credential, setCredential] = useState(initialState);

  const storedCredentials = useLiveQuery(() => credentialsDB.items.reverse().sortBy('id'), []);

  const handleFormSubmit = async () => {
    console.log(formatPassword(credential));
    if(credential.id) {
      let id = credential.id;
      delete credential.id;
      await credentialsDB.items.update(id, credential);
    } else {
      await credentialsDB.items.add(formatPassword(credential));
    }
    setCredential(initialState);
  };

  const handleSelectCredential = (credential) => {
    setCredential(credential);
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
              Password Manager
            </Typography>
          </Toolbar>
        </AppBar>
        <Container sx={{ paddingTop: '2rem' }}>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              {storedCredentials && (
                <PasswordList storedCredentials={storedCredentials} onSelectCredential={handleSelectCredential} />
              )}
            </Grid>
            <Grid item xs={8}>
              <PasswordForm
                credential={credential}
                onChangeCredential={setCredential}
                onFormSubmit={handleFormSubmit}
              />
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </Fragment>
  );
}

export default App;
