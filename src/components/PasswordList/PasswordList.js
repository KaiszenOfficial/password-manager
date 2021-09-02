import React, { useState } from 'react';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
} from '@material-ui/core';
import { Delete, Edit, MoreVert } from '@material-ui/icons';

function PasswordList({ storedCredentials, onSelectCredential, onDeleteCredential }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null)
  const open = Boolean(anchorEl);

  const handleOpenMenu = index => (event) => {
    setAnchorEl(event.currentTarget);
    setCurrentIndex(index)
  };

  const handleClose = (e) => {
    setAnchorEl(null);
  };

  const handleEdit = credential => (e) => {
    setAnchorEl(null);
    if(credential) {
      onSelectCredential(credential);
    }
  };

  const handleDelete = credential => (e) => {
    setAnchorEl(null);
    if(credential) {
      onDeleteCredential(credential);
    }
  };

  const unescapeThumbnail = (thumbnail) => {
    return thumbnail.replace(/\\/g, '');
  };
  return (
    <List>
      {storedCredentials.map((cred, index) => (
        <ListItem
          disablePadding
          key={index}
          // onClick={(e) => onSelectCredential(cred)}
        >
          <ListItemAvatar>
            <Avatar src={unescapeThumbnail(cred.thumbnail)} alt={cred.title} />
          </ListItemAvatar>
          <ListItemText primary={cred.title} secondary={cred.description} primaryTypographyProps={{ fontWeight: 'bold' }} />
          <MoreVert sx={{ cursor: 'pointer' }} onClick={handleOpenMenu(index)} />
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open && currentIndex === index}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleEdit(cred)}>
              <ListItemIcon>
                <Edit fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Edit" />
            </MenuItem>
            <MenuItem onClick={handleDelete(cred)}>
              <ListItemIcon>
                <Delete sx={{ color: "red" }} fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Delete" sx={{ color: "red" }} />
            </MenuItem>
          </Menu>
        </ListItem>
      ))}
    </List>
  );
}

export default PasswordList;
