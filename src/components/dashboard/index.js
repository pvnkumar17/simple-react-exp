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
import CollapsibleTree from '../mindmap/collapsibleTree';

const Dashboard = ({ initialEditorData, initialTreeData, setUserDetails, mindMapData }) => {
  const [selectedTitle , setSelectedTitle] = useState(initialEditorData.title);
  const [isOpenSearchbar, setIsOpenSearchbar] = useState(false);
  const [mindmapData, setMindmapData] = useState(
    {
      "_id": "669234c94bd9ae169f543f0b",
      "title": "Private workspace",
      "isRoot": true,
      "isPublic": false,
      "type": "folder",
      "children": [
        {
          "_id": "669234e93c6a3f5ce99b112a",
          "title": "title 5",
          "isRoot": false,
          "type": "file",
          "parentId": "669234c94bd9ae169f543f0b",
          "children": [],
          "userId": "669234c94bd9ae169f543f09",
          "createdBy": {
            "email": "pwnk1@mail.com",
            "username": "pwnk1",
            "userId": "669234c94bd9ae169f543f09",
            "name": "pwnk1",
            "iat": 1720857801
          },
          "isPublic": false,
          "data": "669234e93c6a3f5ce99b1127",
          "isArchived": false,
          "sortOrder": 1,
          "slug": "title-5-669234e93c6a3f5ce99b112a",
          "createdAt": "2024-07-13T08:03:53.225Z",
          "updatedAt": "2024-07-13T08:03:53.225Z",
          "__v": 0
        },
        {
          "_id": "66926f8899a7913caff4e974",
          "title": "title 5",
          "isRoot": false,
          "type": "folder",
          "parentId": "669234c94bd9ae169f543f0b",
          "children": [
            {
              "_id": "66926f8a99a7913caff4e97a",
              "title": "title 7",
              "isRoot": false,
              "type": "folder",
              "parentId": "66926f8899a7913caff4e974",
              "children": [
                {
                  "_id": "66926f8f99a7913caff4e982",
                  "title": "title 9",
                  "isRoot": false,
                  "type": "file",
                  "parentId": "66926f8a99a7913caff4e97a",
                  "children": [],
                  "userId": "669234c94bd9ae169f543f09",
                  "createdBy": {
                    "email": "pwnk1@mail.com",
                    "username": "pwnk1",
                    "userId": "669234c94bd9ae169f543f09",
                    "name": "pwnk1",
                    "iat": 1720857801
                  },
                  "isPublic": false,
                  "data": "66926f8f99a7913caff4e97f",
                  "isArchived": false,
                  "sortOrder": 1,
                  "slug": "title-9-66926f8f99a7913caff4e982",
                  "createdAt": "2024-07-13T12:14:07.377Z",
                  "updatedAt": "2024-07-13T12:14:07.377Z",
                  "__v": 0
                },
                {
                  "_id": "66926f9099a7913caff4e989",
                  "title": "title 6",
                  "isRoot": false,
                  "type": "folder",
                  "parentId": "66926f8a99a7913caff4e97a",
                  "children": [],
                  "userId": "669234c94bd9ae169f543f09",
                  "createdBy": {
                    "email": "pwnk1@mail.com",
                    "username": "pwnk1",
                    "userId": "669234c94bd9ae169f543f09",
                    "name": "pwnk1",
                    "iat": 1720857801
                  },
                  "isPublic": false,
                  "isArchived": false,
                  "sortOrder": 2,
                  "slug": "title-6-66926f9099a7913caff4e989",
                  "createdAt": "2024-07-13T12:14:08.409Z",
                  "updatedAt": "2024-07-13T12:14:08.409Z",
                  "__v": 0
                }
              ],
              "userId": "669234c94bd9ae169f543f09",
              "createdBy": {
                "email": "pwnk1@mail.com",
                "username": "pwnk1",
                "userId": "669234c94bd9ae169f543f09",
                "name": "pwnk1",
                "iat": 1720857801
              },
              "isPublic": false,
              "isArchived": false,
              "sortOrder": 1,
              "slug": "title-7-66926f8a99a7913caff4e97a",
              "createdAt": "2024-07-13T12:14:02.064Z",
              "updatedAt": "2024-07-13T12:14:08.438Z",
              "__v": 0
            }
          ],
          "userId": "669234c94bd9ae169f543f09",
          "createdBy": {
            "email": "pwnk1@mail.com",
            "username": "pwnk1",
            "userId": "669234c94bd9ae169f543f09",
            "name": "pwnk1",
            "iat": 1720857801
          },
          "isPublic": false,
          "isArchived": false,
          "sortOrder": 2,
          "slug": "title-5-66926f8899a7913caff4e974",
          "createdAt": "2024-07-13T12:14:00.169Z",
          "updatedAt": "2024-07-13T12:14:02.086Z",
          "__v": 0,
          "path": []
        }
      ],
      "userId": "669234c94bd9ae169f543f09",
      "createdBy": {
        "name": "pwnk1",
        "username": "pwnk1",
        "email": "pwnk1@mail.com",
        "password": "12345678",
        "_id": "669234c94bd9ae169f543f09",
        "__v": 0
      },
      "isArchived": false,
      "sortOrder": 0,
      "slug": "private-workspace-669234c94bd9ae169f543f0b",
      "createdAt": "2024-07-13T08:03:21.437Z",
      "updatedAt": "2024-07-13T12:14:00.209Z",
      "__v": 0
    }
  )
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
    setUserDetails: (data) => dispatch(userInfoSucess(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
