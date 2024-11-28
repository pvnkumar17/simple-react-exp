import { cloneDeep } from 'lodash';
import Tree, { TreeNode } from 'rc-tree';
import "rc-tree/assets/index.css";
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Input,
  Modal,
  ModalBody
} from 'reactstrap';
import { editorInfoUpdate, userInfoSucess, mindMapUpdate } from '../actions/meAction';
import createFileIcon from '../images/icons/create-file.svg';
import createFolderIcon from '../images/icons/create-folder.svg';
import fileIcon from '../images/icons/file.svg';
import folderIcon from '../images/icons/folder.svg';
import { deleteAction, fetchMemorymapData, getUserDetails, menuActonHandle, moveAction, renameAction } from '../services/meService';
import Button from '../ui/Button';
import DropDown, { DropDownItem } from '../ui/DropDown';
import { convertToNestedJson, convertToNestedJsonMindMap, convertToNestedJsonPrivate } from '../utils/convertToNestedJson';
import "./workSpace.css";

const WorkSpace = ({ initialTreeData, sendEditorData, setUserDetails, setMindMapData }) => {

  const [treeData, setTreeData] = useState([]);
  const [flatedTreeData, setFlatedTreeData] = useState([]);
  const [selectedNode, setSelectedNode] = useState({});
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const FlatenTreeData = (flatTreeData) => {
    let flatTree = [];
    //flatTreeData.forEach(item => { flatTree = [...flatTree, ...item.flatNodes] });
    setFlatedTreeData(flatTreeData);
  }

  useEffect(() => {
    if (initialTreeData?.data) {
      const copyTreeData = cloneDeep(initialTreeData.data);
      const hierarchy = [...convertToNestedJsonPrivate(copyTreeData), ...convertToNestedJson(copyTreeData)];
      console.log(hierarchy)
      setTreeData(hierarchy);
      FlatenTreeData([...copyTreeData.privateNodes, ...copyTreeData.publicNodes]);
    }
  }, [initialTreeData])

  
  const dropin = (info) => {
    console.log('drop', info);
    
    const droppedOnNodeId = info.node.key;
    const draggedNodeId = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    
    const loopin = (data, key, callback) => {
      
      data.forEach((childNode, index, parentArray) => {
        if (childNode._id === key) {
          callback(childNode, index, parentArray);
          return;
        }
        if (childNode.children) {
          loopin(childNode.children, key, callback);
        }
      });
    };
    const data = [...treeData];

    // Find dragObject
    let dragObj;
    loopin(data, draggedNodeId, (item, index, arr) => {
      arr.splice(index, 1); // Removing dragged item from its previous position
      dragObj = item;
    });
    let backendPayload = {
      nodeId: draggedNodeId,
      parentId: '',
      isRoot: false,
      sortOrder: 0
    }
    
    if (dropPosition === 0) {
      // Drop on the content
      loopin(data, droppedOnNodeId, item => {
        // eslint-disable-next-line no-param-reassign
        item.children = item.children || [];
        // where to insert
        item.children.unshift(dragObj);
        backendPayload.sortOrder = 1; // Because we are inserting at first position
        backendPayload.parentId = item._id;
        backendPayload.isRoot = item.isRoot;
      });
    } else {
      // Drop on the gap (insert before or insert after)
      let ar;
      let i;
      loopin(data, droppedOnNodeId, (item, index, arr) => {
        ar = arr;
        i = index;
        backendPayload.parentId = item.type === 'file' ? item.parentId :  item._id;
        backendPayload.isRoot = item.isRoot;
        
      });
      
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
      backendPayload.sortOrder = ar.findIndex(node => node._id === backendPayload.nodeId) + 1;
    }
   
    console.log(backendPayload);
    moveNode(backendPayload);
    setTreeData(data);
  }

  const allowDrop = ({ dropNode, dropPosition }) => {
    if (!dropNode.children) {
      if (dropPosition === 0) return false;
    }
    return true;
  }

  const handleMenuAction = (node, type) => {
    const payload = {
      "type": type,
      "parentId": node.type !== 'folder' ? node.parentId : node._id,
      "title": `title ${Math.floor(Math.random() * 10)}`,
      "isRoot": false,
      "isPublic": node.isPublic
    }
    menuActonHandle(payload).then(res => {
      if (res) {
        getUserDetails().then(data => setUserDetails(data)).catch(error => {
          throw (error);
        })
      }
    }
    );
  };

  const moveNode = async (payload) => {
    
    const result = await moveAction(payload);
    
  };

  const renameNode = (node, type) => {
    const nodeId = node._id;
    const payload = {
      "title": `title ${Math.floor(Math.random() * 10)}`,
    }
    renameAction(payload, nodeId).then(res => {
      if (res) {
        getUserDetails().then(data => setUserDetails(data)).catch(error => {
          throw (error);
        })
      }
    }
    );
  };

  const deleteNode = (node) => {
    const nodeId = node._id;
    deleteAction(nodeId).then(res => {
      if (res) {
        getUserDetails().then(data => setUserDetails(data)).catch(error => {
          throw (error);
        })
      }
    }
    );
  };

  const MenuAction = ({ item }) => {

    return <span onClick={(event) => event.stopPropagation()}>
     { item.type === 'folder' &&
      <><Button className='action-btn' onClick={() => handleMenuAction(item, 'folder')}  small="true"><img  src={createFolderIcon}/></Button> 
      <Button className='action-btn'  onClick={() => handleMenuAction(item, 'file')} small="true"><img  src={createFileIcon}/></Button> </>
    }
      <DropDown
        disabled={false}
        buttonClassName="sidebar-action-menu"
        buttonLabel="..."
        buttonAriaLabel="menu specialized editor node"
        buttonIconClassName="">
          {
            item?.type === 'folder' && <><DropDownItem
          onClick={() => handleMenuAction(item, 'folder')}
          className="item">
          <span className="text">Add folder</span>
        </DropDownItem>
        <DropDownItem
          onClick={() => handleMenuAction(item, 'file')}
          className="item">
          <span className="text">Add File</span>
        </DropDownItem>
            </>
          }
        
        {!item?.isRoot && <><DropDownItem
          onClick={() => deleteNode(item)}
          className="item">
          <span className="text">Delete</span>
        </DropDownItem>
        <DropDownItem
          //onClick={() => renameNode(item)}
          onClick={toggle}
          className="item">
          <span className="text">Rename</span>
        </DropDownItem></>}
      </DropDown>
    
    </span>
  }

  const loop = (data) => {
    
    return data?.map((item) => {
      //const title = <div><Input className='d-inline disabled border-0' value={item?.title} /><span></span><span> {MenuAction({ item })}</span></div>
      const title = <div className='tree-title'>
        <span>{item?.title}</span><span className='menu-action'> {MenuAction({ item })}</span></div>
      return (
        <TreeNode key={item._id} title={title} data={item} className={item.isRoot ? 'root' : ''} icon={getIcon(item) }>
          if (item?.children?.length) {
            loop(item.children)
          }
        </TreeNode>
        );
      
    });
  }

  const getIcon = (item) => {
    if(item.isRoot) {
      return <></>
    }
    return <img src = {item.type === 'folder' ? folderIcon : fileIcon} />
  }

  const onNodeSelect = (keys, dataInfo) => {
    
      
      const editorNode = dataInfo.node.data;
      
    const path = keys[0] ? findPath({ children: treeData }, keys[0]) : [];
    
    console.log(editorNode);
    if(editorNode){
      editorNode.path = path;
    }
    if(dataInfo.node.data.isRoot) {
      return; // No state change is needed for root Private & Public folders on click of the node
      
    }
    setSelectedNode(editorNode);
  };

  useEffect(() => {
    if (selectedNode?.slug) {
      window.location.hash = selectedNode.type === 'file' ? selectedNode.slug : '';
      sendEditorData(selectedNode);
      fetchMemorymapData(selectedNode._id).then(res => {
          const nestedMindMapData = convertToNestedJsonMindMap(res.data);
          setMindMapData(nestedMindMapData);
        }
      );
      
    } else {
      window.location.hash = '';
      sendEditorData({});
      setMindMapData({});
    }
    console.log(selectedNode);
  }, [selectedNode]);

  const findPath = (treeNode, key, path = []) => {
    
    if (treeNode?._id === key) {
      return [...path, {title: treeNode.title, slug: treeNode.slug}];
    }

    if (treeNode?.children) {
      for (let child of treeNode.children) {
        const foundPath = findPath(child, key, [...path, {title: treeNode.title, slug: treeNode.slug}]);
        if (foundPath) {
          return foundPath;
        }
      }
    }

    return null;
  };


  // const path = selectedKey ? findPath({ children: treeData }, selectedKey) : [];
  
  return (
    <div>
      <Tree
        onDrop={dropin}
        allowDrop={allowDrop}
        defaultExpandedKeys={treeData?.map(node => node._id)}
        autoExpandParent={true}
        expandAction='click'
        draggable={(event) => {
          return !event.data.isRoot
        }}
        onSelect={onNodeSelect}
        
      >
        {loop(treeData)}
      </Tree>
      <Modal isOpen={modal} fade={false} toggle={toggle} unmountOnClose={true}>
        <ModalBody>
          <Input
            type="text"
            placeholder=""
            //value={renameTitle}
            rows={5}
          />
        </ModalBody>
      </Modal>
    </div>
  )
}

function mapStateToProps(state, ownProps) {
  console.log(state);
  return {
    initialTreeData: state.meDetails.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    sendEditorData: (data) => dispatch(editorInfoUpdate(data)),
    setUserDetails: (data) => dispatch(userInfoSucess(data)),
    setMindMapData: (data) => dispatch(mindMapUpdate(data))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkSpace);