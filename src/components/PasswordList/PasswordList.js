import { Avatar, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@material-ui/core'
import React from 'react'

function PasswordList({ storedCredentials, onSelectCredential }) {

	const unescapeThumbnail = (thumbnail) => {
		return thumbnail.replace(/\\/g,"");
	}
	return (
		<List>
			{storedCredentials.map((cred) => (
				<ListItemButton key={cred.id} onClick={(e) => onSelectCredential(cred)}>
					<ListItem disablePadding>
						<ListItemAvatar>
							<Avatar src={unescapeThumbnail(cred.thumbnail)} alt={cred.title}/>
						</ListItemAvatar>
						<ListItemText primary={cred.title} secondary={cred.description} />
					</ListItem>
				</ListItemButton>
			))}
		</List>
	)
}

export default PasswordList
