export default async function getData() {
  const res = await fetch("./data.json");

  if (!res.ok) {
    throw new Error();
  }

  return res.json();
}
