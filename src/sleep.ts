export default async (t: number) => {
  await new Promise((r) => setTimeout(r, t));
};
