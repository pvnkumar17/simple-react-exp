import Editor from "../../editor/editor";
import Sidebar from "../../sidebar/sidebar";
import Logout from "../common/logout";
import { connect } from 'react-redux';
import Profile from "../profile";
import Trash from "../trash";

const Dashboard = ({ initialEditorData }) => {
  return (
    <div className='memorymap-wrapper'>
      <div>
      <Profile />
      <div className='sidebar'><Sidebar /></div>
      <div className="trash-container"><Trash /></div>
      </div>
      {initialEditorData?.type === 'file' && initialEditorData.data && <div className='editor'><Editor /></div>}
    </div>
  );
}
function mapStateToProps(state, ownProps) {
  return {
    initialEditorData: state.meDetails.editorData
  };
}

function mapDispatchToProps(dispatch) {
  return {
    //sendEditorData: (data:any) => dispatch(editorInfoUpdate(data))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
