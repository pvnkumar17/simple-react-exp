import Editor from "../../editor/editor";
import Sidebar from "../../sidebar/sidebar";
import Logout from "../common/logout";

const Dashboard = () => {
  return (
      <div className='memorymap-wrapper'>
        <div className="top-nav"><Logout /></div>
        <div className='sidebar'><Sidebar /></div>
        <div className='editor'><Editor /></div>
      </div>
  );
}

export default Dashboard;
