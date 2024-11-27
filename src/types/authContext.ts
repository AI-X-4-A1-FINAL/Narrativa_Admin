import { User } from "./user";

export type AuthContextProps = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};