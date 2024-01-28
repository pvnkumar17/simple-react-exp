import { Editor } from "../../editor/editor";
import Sidebar from "../../sidebar/sidebar";

function Dashboard() {
  return (
      <div className='memorymap-wrapper'>
        <div className='sidebar'><Sidebar /></div>
        <div className='editor'><Editor /></div>
      </div>
  );
}

export default Dashboard;
