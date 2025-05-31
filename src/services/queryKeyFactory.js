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
