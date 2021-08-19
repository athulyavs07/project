import HeadCount from "./headcount";
import Charts from "./charts";
import BasicTable from "./table";
import Home from "../../Layout/home";

function Radfoundation() {
  return (
    <div>
      <Home>
        <Charts />
        <HeadCount />
        <BasicTable />
      </Home>
    
    </div>
  );
}

export default Radfoundation;
