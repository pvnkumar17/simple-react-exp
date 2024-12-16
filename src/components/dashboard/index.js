import { connect } from 'react-redux';
import Editor from "../../editor/editor";
import Sidebar from "../../sidebar/sidebar";
import Profile from "../profile";
import Trash from "../trash";
//import { userInfoSucess } from '../actions/meAction';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from "react";
import { Button, Input } from "reactstrap";
import { editorInfoUpdate, userInfoSucess, mindMapUpdate } from "../../actions/meAction";
import { fetchMemorymapData, renameAction } from "../../services/meService";
import Searchbar from "../searchbar";
import CollapsibleTree from '../mindmap/collapsibleTree';
import { convertToNestedJsonMindMap } from '../../utils/convertToNestedJson';

const Dashboard = ({ initialEditorData, initialTreeData, setUserDetails, mindMapData, setMindMapData, sendEditorData }) => {
  const [selectedTitle , setSelectedTitle] = useState(initialEditorData.title);
  const [breadCrumbPath, setBreadCrumbPath] = useState(initialEditorData?.path)
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

  useEffect(()=>{
    const updatedPath = initialEditorData.path?.map(item => {
      if(item.nodeData._id === initialEditorData._id) {
        item.title = selectedTitle;
        return item;
      }else {
        return item;
      }
    })
    setBreadCrumbPath(updatedPath);
  }, [selectedTitle]);

  const renameNode = (node, type) => {
    const nodeId = node._id;
    const payload = {
      "title": selectedTitle,
    }
    renameAction(payload, nodeId);
  };
  const toggleSearchbar = () => setIsOpenSearchbar(!isOpenSearchbar);

  const handlePathClick = (path) => {
    fetchMemorymapData(path.nodeData._id).then(res => {
      const nestedMindMapData = convertToNestedJsonMindMap(res.data);
      setMindMapData(nestedMindMapData);
      sendEditorData(path.nodeData);
      window.location.hash = path.slug;
    })
  }
  
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
          
          breadCrumbPath && <div><p>{breadCrumbPath.map(path => {
          return <><a style={{cursor:'pointer'}} onClick={ () => handlePathClick(path)}>{path.title}</a> / </>
        })}</p></div>}
        
        {initialEditorData.path && <div className="selected-title"><Input value={selectedTitle} onChange={(e) => changeTitle(e)} onBlur={() => renameNode(initialEditorData)} className="border-0"/></div>}
        {initialEditorData?.type === 'folder' && <CollapsibleTree data={mindMapData} />}
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
    initialTreeData: state.meDetails.user,
    mindMapData: state.meDetails.mindMapData
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUserDetails: (data) => dispatch(userInfoSucess(data)),
    setMindMapData: (data) => dispatch(mindMapUpdate(data)),
    sendEditorData: (data) => dispatch(editorInfoUpdate(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
