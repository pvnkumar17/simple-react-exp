import Editor from "../../editor/editor";
import Sidebar from "../../sidebar/sidebar";
import Logout from "../common/logout";
import { connect } from 'react-redux';
import Profile from "../profile";
import Trash from "../trash";
//import { userInfoSucess } from '../actions/meAction';
import { cloneDeep, find } from 'lodash';
import { Input, Button } from "reactstrap";
import { userInfoSucess } from "../../actions/meAction";
import { useEffect, useState } from "react";
import { renameAction } from "../../services/meService";
import Searchbar from "../searchbar";

const Dashboard = ({ initialEditorData, initialTreeData, setUserDetails }) => {
  const [selectedTitle , setSelectedTitle] = useState(initialEditorData.title);
  const [isOpenSearchbar, setIsOpenSearchbar] = useState(false);
  const changeTitle = (e) => {
    if (initialTreeData?.data) {
      let userData = cloneDeep(initialTreeData);
      userData.data = userData?.data?.map(item => {

          item.flatNodes.filter(flatNode => {
              if (flatNode._id === initialEditorData._id) {
                flatNode.title = e.target.value;
                setSelectedTitle(e.target.value)
              }
              return flatNode;
          });
          return item;
        });
      setUserDetails(userData);
    }
  };
  useEffect(()=>{
    setSelectedTitle(initialEditorData.title)
  }, [initialEditorData]);

  const renameNode = (node, type) => {
    const nodeId = node._id;
    const payload = {
      "title": selectedTitle,
    }
    renameAction(payload, nodeId);
  };
  const toggleSeachbar = () => setIsOpenSearchbar(!isOpenSearchbar);
  return (
    <div className='memorymap-wrapper'>
      <div className="w-25">
      <div className="w-75"><Profile /></div>
      <Button onClick={toggleSeachbar} className="bg-none searchbar-button">searchbar</Button>
      <div className='sidebar'><Sidebar /></div>
      <div className="trash-container"><Trash /></div>
      </div>
      <div className="editor-container w-75">
      {initialEditorData.path && <div><p>{initialEditorData.path.join(' / ')}</p></div>}
      {initialEditorData.path && <div className="selected-title"><Input value={selectedTitle} onChange={(e) => changeTitle(e)} onBlur={() => renameNode(initialEditorData)} className="border-0"/></div>}
      {initialEditorData?.type === 'file' && initialEditorData.data && <div className='editor'>
          <Editor /></div>}
      </div>
      <Searchbar searchbarOpen={isOpenSearchbar} />
    </div>
  );
}
function mapStateToProps(state, ownProps) {
  return {
    initialEditorData: state.meDetails.editorData,
    initialTreeData: state.meDetails.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUserDetails: (data) => dispatch(userInfoSucess(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
