export interface UserInfo {
  uId: string;
  name: string;
  email: string;
  token: string;
  isAdmin: boolean;
};

export interface LoginItem {
  email: string;
  password: string;
}
