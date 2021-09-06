import React, { useState } from 'react';
import {
  Button,
  ButtonGroup,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { maxPasswordLength, minPasswordLength } from '../../constants';
import { generateRandomPassword } from '../../utils/password.utils';

function PasswordForm({ credential, onChangeCredential, onFormSubmit }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleOnChange = (prop) => (e) => {
    onChangeCredential({ ...credential, [prop]: e.target.value });
  };

  const handleConfigChange = (prop) => (e) => {
    if (prop === 'length') {
      onChangeCredential({
        ...credential,
        config: { ...credential.config, [prop]: e.target.value },
      });
    } else {
      onChangeCredential({
        ...credential,
        config: { ...credential.config, [prop]: e.target.checked },
      });
    }
  };

  const handleGenerateRandomPassword = (e) => {
    e.preventDefault();
    onChangeCredential({
      ...credential,
      password: generateRandomPassword(credential.config),
    });
  };

  const handleFormSubmission = (e) => {
    e.preventDefault();
    setShowPassword(false);
    onFormSubmit('submit');
  }

  const handleFormReset = (e) => {
    e.preventDefault();
    setShowPassword(false);
    onFormSubmit('reset');
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Basic Details</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          size="small"
          required
          label="Title"
          value={credential.title}
          onChange={handleOnChange('title')}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          size="small"
          required
          label="Username"
          value={credential.username}
          onChange={handleOnChange('username')}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          size="small"
          required
          label="Link"
          value={credential.link}
          onChange={handleOnChange('link')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          size="small"
          required
          label="Description"
          value={credential.description}
          onChange={handleOnChange('description')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          size="small"
          type={showPassword ? 'text' : 'password'}
          value={credential.password}
          onChange={handleOnChange('password')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={(e) => setShowPassword(!showPassword)}
                  // onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          label="Password"
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Password Configuration</Typography>
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={2} direction="row" alignItems="center">
          <Typography variant="body1">Length</Typography>
          <Slider
            aria-label="Length"
            getAriaValueText={(value) => value}
            valueLabelDisplay="auto"
            value={credential.config.length}
            min={minPasswordLength}
            max={maxPasswordLength}
            onChange={handleConfigChange('length')}
          />
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={credential.config.numbers}
              onChange={handleConfigChange('numbers')}
            />
          }
          label="Include numbers"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={credential.config.symbols}
              onChange={handleConfigChange('symbols')}
            />
          }
          label="Include symbols"
        />
      </Grid>
      <Grid item xs={12} sx={{ mb: 3 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleGenerateRandomPassword}
        >
          <Typography sx={{ fontWeight: 'bold' }}>Generate Random Password</Typography>
        </Button>
        <Typography sx={{ fontSize: '0.8rem' }}>*This button will generate a random password based on the above configurations you have specified</Typography>
      </Grid>
      <Grid item xs={12}>
        <ButtonGroup variant="contained" fullWidth>
          <Button onClick={handleFormSubmission}><Typography sx={{ fontWeight: 'bold' }}>Save</Typography></Button>
          <Button onClick={handleFormReset}><Typography sx={{ fontWeight: 'bold' }}>Reset</Typography></Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
}

export default PasswordForm;
