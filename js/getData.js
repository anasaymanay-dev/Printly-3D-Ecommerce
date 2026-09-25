export default async function getData() {
  const res = await fetch("./data.json");

  if (!res.ok) {
    throw new Error("HTTP ERROR " + res.status);
  }

  return res.json();
}
