import  { useState} from 'react';
import Tree, { TreeNode } from 'rc-tree';
import "rc-tree/assets/index.css"

export default function Sidebar() {

    const [treeData, setTreeData] = useState([
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

  const [openedMenuKey, setOpenedMenuKey] = useState('');
    const onDrop = (info:any) => {
      console.log('drop', info);
      const dropKey = info.node.props.eventKey;
      const dragKey = info.dragNode.props.eventKey;
      const dropPos = info.node.props.pos.split('-');
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
  
      const loop = (data:any, key:any, callback:any) => {
        data.forEach((item:any, index:any, arr:any) => {
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
      let dragObj:any;
      loop(data, dragKey, (item:any, index:any, arr:any) => {
        arr.splice(index, 1);
        dragObj = item;
      });
  
      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, (item:any) => {
          item.children = item.children || [];
          // where to insert 
          item.children.push(dragObj);
        });
      } else if (
        (info.node.props.children || []).length > 0 && // Has children
        info.node.props.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, (item:any) => {
          item.children = item.children || [];
          // where to insert 
          item.children.unshift(dragObj);
        });
      } else {
        // Drop on the gap
        let ar:any;
        let i:any;
        loop(data, dropKey, (item:any, index:any, arr:any) => {
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

    const MenuAction = ({}) => {
      const [openMenu, setOpenMenu] = useState(false);

      return (
        <div >
          <ul>
            <li>rename</li>
            <li>add new topic</li>
            <li>delete</li>
          </ul>
        </div>
      )
    }

    const loop = (data: any) =>
      data.map((item:any) => {
        const title = <div><span>{item.title}</span> <input type='radio' name='item.key' /></div>
        if (item.children && item.children.length) {
          return (
            <TreeNode key={item.key} title={title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={title} ></TreeNode>;
      });

    return (
        <Tree
          onDrop={onDrop}
          treeData={treeData}
          defaultExpandedKeys={["0-0-1"]}
          autoExpandParent
          draggable={true}
        >
          {loop(treeData)}
        </Tree>
    )
}