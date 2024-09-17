export default function ComponentLayer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="default" style={{ height: "100vh", width: "100vw" }}>
      {children}
    </div>
  );
}
