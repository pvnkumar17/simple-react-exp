import Editor from "../../editor/editorTS";
import Sidebar from "../../sidebar/sidebar";

function Home() {
  return (
    <div className='memorymap-wrapper'>
      <div className='sidebar'><Sidebar /></div>
      <div className='editor'><Editor /></div>
    </div>
  );
}

export default Home;
