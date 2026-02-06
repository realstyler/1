export const delay = (ms = 200) =>
  new Promise((resolve) => setTimeout(resolve, ms));
