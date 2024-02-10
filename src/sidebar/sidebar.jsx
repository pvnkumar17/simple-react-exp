import { useEffect, useState } from 'react';
import Tree, { TreeNode } from 'rc-tree';
import DropDown, { DropDownItem } from '../ui/DropDown';
import "rc-tree/assets/index.css"
import { connect } from 'react-redux';
import { editorInfoUpdate, userInfoSucess } from '../actions/meAction';
import { getUserDetails, menuActonHandle } from '../services/meService';

const Sidebar = ({ initialTreeData, sendEditorData, setUserDetails }) => {

  const [treeData, setTreeData] = useState(initialTreeData || [
    {
      "title": "0-0-label",
      "key": "0-0-key",
      "children": [
        {
          "title": "0-0-0-label",
          "key": "0-0-0-key",
          "children": [
            {
              "title": "0-0-0-0-label",
              "key": "0-0-0-0-key"
            },
            {
              "title": "0-0-0-1-label",
              "key": "0-0-0-1-key"
            },
            {
              "title": "0-0-0-2-label",
              "key": "0-0-0-2-key"
            }
          ]
        },
        {
          "title": "0-0-1-label",
          "key": "0-0-1-key",
          "children": [
            {
              "title": "0-0-1-0-label",
              "key": "0-0-1-0-key"
            },
            {
              "title": "0-0-1-1-label",
              "key": "0-0-1-1-key"
            },
            {
              "title": "0-0-1-2-label",
              "key": "0-0-1-2-key"
            }
          ]
        },
        {
          "title": "0-0-2-label",
          "key": "0-0-2-key"
        }
      ]
    },
    {
      "title": "0-1-label",
      "key": "0-1-key",
      "children": [
        {
          "title": "0-1-0-label",
          "key": "0-1-0-key",
          "children": [
            {
              "title": "0-1-0-0-label",
              "key": "0-1-0-0-key"
            },
            {
              "title": "0-1-0-1-label",
              "key": "0-1-0-1-key"
            },
            {
              "title": "0-1-0-2-label",
              "key": "0-1-0-2-key"
            }
          ]
        },
        {
          "title": "0-1-1-label",
          "key": "0-1-1-key",
          "children": [
            {
              "title": "0-1-1-0-label",
              "key": "0-1-1-0-key"
            },
            {
              "title": "0-1-1-1-label",
              "key": "0-1-1-1-key"
            },
            {
              "title": "0-1-1-2-label",
              "key": "0-1-1-2-key"
            }
          ]
        },
        {
          "title": "0-1-2-label",
          "key": "0-1-2-key"
        }
      ]
    },
    {
      "title": "0-2-label",
      "key": "0-2-key"
    }
  ]);
  const [selectedNode, setSelectedNode] = useState({});

  useEffect(() => {
    setTreeData(initialTreeData)
  }, [initialTreeData])

  const [openedMenuKey, setOpenedMenuKey] = useState('');
  const onDrop = (info) => {
    console.log('drop', info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          callback(item, index, arr);
          return;
        }
        if (item.children) {
          loop(item.children, key, callback);
        }
      });
    };
    const data = [...treeData];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 
        item.children.push(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 
        item.children.unshift(dragObj);
      });
    } else {
      // Drop on the gap
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
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
  };

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
          <span className="text">add File</span>
        </DropDownItem>
        <DropDownItem
          onClick={() => {
            ;
          }}
          className="item">
          <span className="text">delete</span>
        </DropDownItem>
      </DropDown>
    )
  }

  const loop = (data) =>
    data.map((item) => {
      const title = <div><span>{item.title}</span><span> {!item.isRoot && MenuAction({ item })}</span></div>
      if (item.children && item.children.length) {
        return (
          <TreeNode key={item._id} title={title} data={item.data}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item._id} title={title} ></TreeNode>;
    });

  const findNode = (data, id) => {
    // for(const elem of data){
    //   if(elem._id === id){
    //     setFlatTreeData(item);
    //     return elem;
    //   }else if(elem.children && elem.children.length){
    //       return findNode(elem.children, id);
    //     }
    //   }
    return data.map(item => {
      if (item._id === id) {
        setSelectedNode(item);
        return item;
      } else if (item.children && item.children.length) {
        return findNode(item.children, id);
      }
    })
    // if(data._id === id) {
    //   setFlatTreeData(data);
    //   return;
    // }else if(data.children && data.children.length){
    //   return findNode(data.children, id);
    // }
  }

  const onNodeSelect = (keys, dataInfo) => {
    //console.log('selct', keys, dataInfo);
    const editorNode = findNode(treeData, keys[0]);
    console.log(editorNode);
  };

  useEffect(() => {
    if (selectedNode.type !== 'folder') {
      sendEditorData(selectedNode);
    }
    console.log(selectedNode);
  }, [selectedNode])

  return (
    <Tree
      onDrop={onDrop}
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
  return {
    initialTreeData: state.meDetails.user?.data
  };
}

function mapDispatchToProps(dispatch) {
  return {
    sendEditorData: (data) => dispatch(editorInfoUpdate(data)),
    setUserDetails: (data) => dispatch(userInfoSucess(data))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);