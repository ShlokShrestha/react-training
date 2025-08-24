import { Link, useNavigate } from "react-router";

function App() {
  const navigate = useNavigate();
  let success = true;
  const handleLogin = () => {
    if (success) {
      navigate("/demo");
    }
  };
  return (
    <>
      <h1>Hello Dashboard</h1>
      <div style={{ display: "flex", gap: "5px" }}>
        <Link to={"/demo"}>Go to demo</Link>
        <Link to={"/product"}>Go to Product</Link>
        <button onClick={() => handleLogin()}>
          Button to navigate demo page
        </button>
      </div>
    </>
  );
}

export default App;
