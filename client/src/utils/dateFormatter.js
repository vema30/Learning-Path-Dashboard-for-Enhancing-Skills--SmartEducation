export const formattedDate = (date) => {
  if (!date) return "Add Date Of Birth";

  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return "Invalid Date";

  return parsedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
