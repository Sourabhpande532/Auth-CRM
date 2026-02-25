import { useAgent } from "../contexts/AgentsContext";

const Leads = () => {
  const { agents = [] } = useAgent();
  console.log(agents);

  return (
    <div>
      <h2>Leads Page</h2>
    </div>
  );
};
export { Leads };
