import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";

export const jwtAtom = atomWithStorage("jwtAtom", { access: "", refresh: "" });

export const userProfileAtom = atom({
  pk: null,
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  email_verified: false,
  last_login: "",
  date_joined: "",
  is_active: false,
  is_staff: false,
  is_superuser: false,
});

export const expAtom = atomWithStorage("expAtom", 0);
