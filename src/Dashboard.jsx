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
      <div className="flex items-center gap-4">
        <Link to={"/demo"} className="text-blue-700 underline ">
          Go to demo
        </Link>
        <Link to={"/product"} className="text-blue-700 underline ">
          Go to Product
        </Link>
        <button
          onClick={() => handleLogin()}
          className="bg-red-500 py-1 px-3 text-white rounded"
        >
          Button to navigate demo page
        </button>
      </div>
    </>
  );
}

export default App;
