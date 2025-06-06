export const userKeys = {
  all: ["users"],
  lists: () => [...userKeys.all, "list"],
  list: (filters) => [...userKeys.lists(), { filters }],
  details: () => [...userKeys.all, "detail"],
  detail: (id) => [...userKeys.details(), id],
  profile: () => [...userKeys.all, "profile"],
};

export const serviceKeys = {
  all: ["services"],
  lists: () => [...serviceKeys.all, "list"],
  list: (filters) => [...serviceKeys.lists(), { filters }],
  details: () => [...serviceKeys.all, "detail"],
  detail: (id) => [...serviceKeys.details(), id],
};

export const cartKeys = {
  all: ["cart"],
  lists: () => [...cartKeys.all, "list"],
  list: (filters) => [...cartKeys.lists(), { filters }],
  details: () => [...cartKeys.all, "detail"],
  detail: (id) => [...cartKeys.details(), id],
  userCart: () => [...cartKeys.all, "userCart"],

};
export const orderKeys = {
  all: ["cart"],
  lists: () => [...orderKeys.all, "list"],
  list: (filters) => [...orderKeys.lists(), { filters }],
  details: () => [...orderKeys.all, "detail"],
  detail: (id) => [...orderKeys.details(), id],
  fetchOrders: () => [...orderKeys.all, "fetchOrders"],
};
