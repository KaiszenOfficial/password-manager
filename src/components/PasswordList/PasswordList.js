import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import React from 'react';

function PasswordList({ storedCredentials, onSelectCredential }) {
  const unescapeThumbnail = (thumbnail) => {
    return thumbnail.replace(/\\/g, '');
  };
  return (
    <List>
      {storedCredentials.map((cred, index) => (
        <ListItem
          disablePadding
          key={index}
          onClick={(e) => onSelectCredential(cred)}
        >
          <ListItemAvatar>
            <Avatar src={unescapeThumbnail(cred.thumbnail)} alt={cred.title} />
          </ListItemAvatar>
          <ListItemText primary={cred.title} secondary={cred.description} />
        </ListItem>
      ))}
    </List>
  );
}

export default PasswordList;
