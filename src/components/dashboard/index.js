import { connect } from 'react-redux';
import Editor from "../../editor/editor";
import Sidebar from "../../sidebar/sidebar";
import Profile from "../profile";
import Trash from "../trash";
//import { userInfoSucess } from '../actions/meAction';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from "react";
import { Button, Input } from "reactstrap";
import { userInfoSucess } from "../../actions/meAction";
import { renameAction } from "../../services/meService";
import Searchbar from "../searchbar";

const Dashboard = ({ initialEditorData, initialTreeData, setUserDetails }) => {
  const [selectedTitle , setSelectedTitle] = useState(initialEditorData.title);
  const [isOpenSearchbar, setIsOpenSearchbar] = useState(false);
  const changeTitle = (e) => {
    if (initialTreeData?.data) {
      let userData = cloneDeep(initialTreeData);
      userData.data.privateNodes = userData?.data?.privateNodes.map(item => {
              if (item._id === initialEditorData._id) {
                item.title = e.target.value;
                setSelectedTitle(e.target.value)
              }
          return item;
        });
        userData.data.publicNodes = userData?.data?.publicNodes.map(item => {
            if (item._id === initialEditorData._id) {
              item.title = e.target.value;
              setSelectedTitle(e.target.value)
            }
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
  const toggleSearchbar = () => setIsOpenSearchbar(!isOpenSearchbar);
  
  return (
    <div className='memorymap-wrapper'>
      <div className="w-25">
        <div className="w-75"><Profile /></div>
        <Button onClick={toggleSearchbar} className="bg-none searchbar-button">searchbar</Button>
        <div className='sidebar'><Sidebar /></div>
        <div className="trash-container"><Trash /></div>
      </div>
      <div className="editor-container w-75">
        {
          
        initialEditorData.path && <div><p>{initialEditorData.path.map(path => {
          return <><a style={{cursor: 'pointer'}} onClick={ () => window.location.hash = path.slug}>{path.title}</a> / </>
        })}</p></div>}
        
        {initialEditorData.path && <div className="selected-title"><Input value={selectedTitle} onChange={(e) => changeTitle(e)} onBlur={() => renameNode(initialEditorData)} className="border-0"/></div>}
        {initialEditorData?.type === 'file' && initialEditorData.data && <div className='editor'>
            <Editor /></div>}
        </div>
        <Searchbar searchbarOpen={isOpenSearchbar} toggleDialog={toggleSearchbar} />
        
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
