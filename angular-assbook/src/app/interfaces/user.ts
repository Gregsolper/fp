export interface UserLogin {
  email: string;
  password: string;
  lat?: number;
  lng?: number;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  lat: number;
  lng: number;
  me?: boolean;
}

export interface UserProfileEdit {
  name: string;
  email: string;
}

export interface UserAvatarEdit {
  avatar: string;
}

export interface UserPasswordEdit {
  password: string;
}

export interface tokenGoogle {
  token: string;
}
