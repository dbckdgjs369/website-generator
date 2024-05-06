const generateRandomString = (num: number): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  return Array.from({ length: num }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
};
export { generateRandomString };
