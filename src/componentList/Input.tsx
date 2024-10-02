export default function Input({ name = "default" }: { name: string }) {
  return (
    <div style={{ border: "1px solid red", width: "50px", height: "50px" }}>
      <button>input</button>
      <div>{name}</div>
    </div>
  );
}
