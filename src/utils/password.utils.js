import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-initials-sprites';
import { alpha, numbers, symbols } from '../constants';

export const formatCredential = (credential) => {
  const thumbnail = createAvatar(style, {
    seed: credential.title,
    height: 256,
    width: 256,
  });

  credential.thumbnail = thumbnail;
  if(credential.id) {
    credential.updatedAt = new Date().getTime();
    return credential
  } else {
    credential.createdAt = credential.updatedAt = new Date().getTime();
    return credential;
  }
};

export const generateRandomPassword = (config) => {
  let chars = alpha;
	chars += config.numbers ? numbers : '';
	chars += config.symbols ? symbols : '';

	let password = "";
  for (let i = 0; i < config.length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};
