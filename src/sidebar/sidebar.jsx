import "rc-tree/assets/index.css";
import PublicWorkSpace from "./publicWorkSpace";
import PrivateWorkSpace from "./privateWorkSpace";

const Sidebar = ({ }) => {

  return (
    <div>
      <label className="">Public</label>
      <PublicWorkSpace />
      <label>Private</label>
      <PrivateWorkSpace />
    </div>
  )
}

export default Sidebar;