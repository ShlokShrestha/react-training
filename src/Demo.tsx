import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const Demo = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [item, setItem] = useState(null);
  const [singleItem, setSingleItem] = useState<any>(null);

  useEffect(() => {
    async function fetchApi() {
      try {
        const response = await fetch("https://dummyjson.com/recipes");
        const result = await response.json();
        setData(result?.recipes);
      } catch (error) {}
    }
    fetchApi();
  }, []);

  useEffect(() => {
    if (item !== null) {
      async function fetchSingleApi() {
        try {
          const response = await fetch(`https://dummyjson.com/recipes/${item}`);
          const result = await response.json();
          setSingleItem(result);
        } catch (error) {
          console.error(error);
        }
      }
      fetchSingleApi();
    }
  }, [item]);
  console.log(singleItem);
  return (
    <div>
      {singleItem?.name}
      <h1>Recipe Date</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        {data &&
          data?.map((item: any) => (
            <div
              key={item?.id}
              onClick={() => {
                setItem(item?.id);
                navigate(`/demo/${item?.id}`);
              }}
            >
              <img
                src={item?.image}
                alt={item?.image}
                style={{ width: "50px" }}
              />
              <p>{item?.name}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Demo;
