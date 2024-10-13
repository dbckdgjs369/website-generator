import { Link } from "react-router-dom";

export default function PageTab() {
  return (
    <div>
      <Link to="/create/test1">test1</Link>
      <Link to="/create/test2">test2</Link>
      <Link to="/create/test3">test3</Link>
    </div>
  );
}
