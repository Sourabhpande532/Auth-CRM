import { url } from "../api";
import { useFetch } from "../userFetch";
const Dashboard = () => {
  const { data, error } = useFetch(`${url}/admin/main`);
  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading..</p>;
  return (
    <div>
      <h2>Dashboard Page</h2>
      <p>{data.message}</p>
      <p>
        Hello, this is {data.user.role}-{data.user.email}
      </p>
    </div>
  );
};
export { Dashboard };
