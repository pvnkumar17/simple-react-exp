import { useEffect, useState } from 'react';
import Tree, { TreeNode } from 'rc-tree';
import DropDown, { DropDownItem } from '../ui/DropDown';
import "rc-tree/assets/index.css"
import { connect } from 'react-redux';
import { editorInfoUpdate, userInfoSucess } from '../actions/meAction';
import { getUserDetails, menuActonHandle, deleteAction, renameAction } from '../services/meService';
import { convertToNestedJson } from '../utils/convertToNestedJson';
import { cloneDeep, find } from 'lodash';

const Sidebar = ({ initialTreeData, sendEditorData, setUserDetails }) => {

  const [treeData, setTreeData] = useState([
    {
      "title": "0-0-label",
      "_id": "0-0-key",
      "children": [
        {
          "title": "0-0-2-label",
          "_id": "0-0-2-key"
        }
      ]
    }
  ]);
  const [flatedTreeData, setFlatedTreeData] = useState([]);
  const [selectedNode, setSelectedNode] = useState({});

  const FlatenTreeData = (flatTreeData) => {
    let flatTree = [];
    flatTreeData.forEach(item => { flatTree = [...flatTree, ...item.flatNodes] });
    setFlatedTreeData(flatTree);
  }

  useEffect(() => {
    if (initialTreeData?.data) {
      const copyTreeData = cloneDeep(initialTreeData.data);
      setTreeData(convertToNestedJson(copyTreeData));
      FlatenTreeData(copyTreeData);
    }
  }, [initialTreeData])

  const [openedMenuKey, setOpenedMenuKey] = useState('');
  const onDrop = (info) => {
    console.log('drop', info);
    const dropKey = info.node.props.eventKey;
    //const dropOnLeaf = !info.node.children;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    if (initialTreeData?.data) {
          let userData = cloneDeep(initialTreeData);
          let dragParentId, dropParentId, dropNode, dragNode;
          userData.data = userData?.data?.map(item => {

            const hiNode = item.flatNodes.filter(nod => {
              if(nod._id === dragKey){
                dragNode = nod;
                if(nod.parentId){
                  dragParentId = nod.parentId;
                  nod.parentId = dropKey;
                }
              }
              if(nod._id === dropKey){
                if (nod.type === 'folder'){
                  dropNode = nod;
                  nod.children.splice(info.dropPosition, 0, dragKey);
                }
                // else if(nod.type === 'file'){
                //   dropParentId = nod.parentId;
                // }
              }

              return nod._id === dragKey || nod._id === dropKey;
            });
            if(dragParentId && dropNode){
              item.flatNodes.filter(flatNode => {
                    // if (flatNode._id === dropKey && flatNode.type === 'folder') {
                    //     flatNode.children.push(dragKey)
                    // }
                    // if (flatNode._id === dragKey) {
                    //   dragParentId = flatNode.parentId;
                    // }
                    if (flatNode._id === dragParentId) {
                      flatNode.children.splice(flatNode.children.indexOf(dragKey), 1);
                    }
                    return flatNode;
                });
              };
              // if(dropParentId){
              //   item.flatNodes.filter(flatNode => {
              //         if (flatNode._id === dropParentId) {
              //           flatNode.children.splice(info.dropPosition, 0, dragKey);
              //         }
              //         return flatNode;
              //     });
              //   }
                return item;
            });
          setUserDetails(userData);
        }

    if (!info.dropToGap) {
      // Drop on the content
      // loop(data, dropKey, (item) => {
      //   item.children = item.children || [];
      //   // where to insert 
      //   item.children.push(dragObj);
      // });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      // loop(data, dropKey, (item) => {
      //   item.children = item.children || [];
      //   // where to insert 
      //   item.children.unshift(dragObj);
      // });
    } else {
      // Drop on the gap
      // let ar;
      // let i;
      // loop(data, dropKey, (item, index, arr) => {
      //   ar = arr;
      //   i = index;
      // });
      // if (dropPosition === -1) {
      //   ar.splice(i, 0, dragObj);
      // } else {
      //   ar.splice(i + 1, 0, dragObj);
      // }
    }

    //setTreeData(data);
  };

  const dropin = (info) => {
    console.log('drop', info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loopin = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item._id === key) {
          callback(item, index, arr);
          return;
        }
        if (item.children) {
          loopin(item.children, key, callback);
        }
      });
    };
    const data = [...treeData];

    // Find dragObject
    let dragObj;
    loopin(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (dropPosition === 0) {
      // Drop on the content
      loopin(data, dropKey, item => {
        // eslint-disable-next-line no-param-reassign
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else {
      // Drop on the gap (insert before or insert after)
      let ar;
      let i;
      loopin(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

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
      "isRoot": false
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

    return (
      <DropDown
        disabled={false}
        buttonClassName=""
        buttonLabel="..."
        buttonAriaLabel="menu specialized editor node"
        buttonIconClassName="icon humburger">
        <DropDownItem
          onClick={() => handleMenuAction(item, 'folder')}
          className="item">
          <span className="text">Add folder</span>
        </DropDownItem>
        <DropDownItem
          onClick={() => handleMenuAction(item, 'file')}
          className="item">
          <span className="text">Add File</span>
        </DropDownItem>
        <DropDownItem
          onClick={() => deleteNode(item)}
          className="item">
          <span className="text">Delete</span>
        </DropDownItem>
        <DropDownItem
          onClick={() => renameNode(item)}
          className="item">
          <span className="text">Rename</span>
        </DropDownItem>
      </DropDown>
    )
  }

  const loop = (data) => {
    return data.map((item) => {
      const title = <div><span>{item?.title}</span><span> {MenuAction({ item })}</span></div>
      if (item?.children && item?.children.length) {
        return (
          <TreeNode key={item._id} title={title} data={item.data}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item?._id} title={title} ></TreeNode>;
    });
  }

  const findNode = (data, id) => {
    return find(data, { _id: id });
  }

  const onNodeSelect = (keys, dataInfo) => {
    //console.log('selct', keys, dataInfo);
    const editorNode = findNode(flatedTreeData, keys[0]);
    console.log(editorNode);
    setSelectedNode(editorNode);
  };

  useEffect(() => {
    if (selectedNode?.slug) {
      window.location.hash = selectedNode.type === 'file' ? selectedNode.slug : '';
      sendEditorData(selectedNode);
    } else {
      window.location.hash = '';
      sendEditorData({});
    }
    console.log(selectedNode);
  }, [selectedNode])

  return (
    <Tree
      onDrop={dropin}
      allowDrop={allowDrop}
      defaultExpandedKeys={[treeData[0]._id]}
      autoExpandParent
      draggable={true}
      onSelect={onNodeSelect}
    >
      {loop(treeData)}
    </Tree>
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
    setUserDetails: (data) => dispatch(userInfoSucess(data))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);