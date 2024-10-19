import { CallApi } from "./apiCalls";

const node = process.env.REACT_APP_NODE;

export const getUserDetails = () => {
  const token = localStorage.getItem("apiToken");
  if (token) {
    return CallApi.directCall(`${node}/v1/nodes`, {});
  } else {
    return null;
  }
};

export const fetchMemorymapData = (nodeId) => {
  const token = localStorage.getItem("apiToken");
  if (token) {
    return CallApi.directCall(`${node}/v1/nodes/${nodeId}/mindmap`, {});
  } else {
    return null;
  }
};

export const getDeletedNodes = () => {
  const token = localStorage.getItem("apiToken");
  if (token) {
    return CallApi.directCall(`${node}/v1/deleted-nodes`, {});
  } else {
    return null;
  }
};

export const setUserEditorData = (editorId, data) => {
  const token = localStorage.getItem("apiToken");
  if (token) {
    return CallApi.directCall(`${node}/v1/editor/${editorId}`, {
      method: "PUT",
      data: { data: data },
    });
  } else {
    return null;
  }
};

export const menuActonHandle = (payload) => {
  const token = localStorage.getItem("apiToken");
  if (token) {
    return CallApi.directCall(`${node}/v1/nodes/`, {
      method: "POST",
      data: payload,
    });
  } else {
    return null;
  }
};

export const renameAction = (payload, nodeId) => {
  const token = localStorage.getItem("apiToken");
  if (token) {
    return CallApi.directCall(`${node}/v1/${nodeId}/rename`, {
      method: "PUT",
      data: payload,
    });
  } else {
    return null;
  }
};

export const moveAction = (payload) => {
  const token = localStorage.getItem("apiToken");
  if (token) {
    return CallApi.directCall(`${node}/v1/${payload.nodeId}/move`, {
      method: "PUT",
      data: payload,
    });
  } else {
    return null;
  }
};

export const deleteAction = (nodeId) => {
  const token = localStorage.getItem("apiToken");
  if (token) {
    return CallApi.directCall(`${node}/v1/${nodeId}`, {
      method: "DELETE",
    });
  } else {
    return null;
  }
};
export const getEditorData = (editorId) => {
  const token = localStorage.getItem("apiToken");
  if (token) {
    return CallApi.directCall(`${node}/v1/editor/${editorId}`, {
      method: "GET",
    });
  } else {
    return null;
  }
};

export const search = async (searchText) => {
  const token = localStorage.getItem("apiToken");
  const { userId } = JSON.parse(localStorage.getItem("user"));
  if (token) {
    let searchResponse = await CallApi.directCall(
      `${node}/v1/search?userId=${userId}&searchTerm=${encodeURIComponent(
        searchText
      )}`,
      {}
    );
    if (searchResponse) {
      return searchResponse;
    } else {
      return new Promise((resolve, reject) => {
        resolve({
          code: "OK",
          data: [
            {
              _id: "6633442a22cb650f4b3acfed",
              title: "Lets test this properly now",
              data: [
                {
                  row: 1,
                  text: "ff",
                },
                {
                  row: 2,
                  text: "df",
                },
                {
                  row: 3,
                  text: "sss sfig",
                },
              ],
              type: "file",
              userId: "66333f339fbf76136d3d060c",
              createdBy:
                '{"email":"testing1234@gmiail.com","username":"testing1234","userId":"66333f339fbf76136d3d060c","name":"testing1234","iat":1714634547}',
            },
          ],
          message: "Success",
        });
      });
    }
  } else {
    return new Promise((resolve, reject) => {
      resolve({
        code: "OK",
        data: [
          {
            _id: "6633442a22cb650f4b3acfed",
            title: "Lets test this properly now",
            data: [
              {
                row: 1,
                text: "ff",
              },
              {
                row: 2,
                text: "df",
              },
              {
                row: 3,
                text: "sss sfig",
              },
            ],
            type: "file",
            userId: "66333f339fbf76136d3d060c",
            createdBy:
              '{"email":"testing1234@gmiail.com","username":"testing1234","userId":"66333f339fbf76136d3d060c","name":"testing1234","iat":1714634547}',
          },
        ],
        message: "Success",
      });
    });
  }
  //   return new Promise((resolve, reject) => {
  //         resolve({
  //                 "code": "OK",
  //             "data": [
  //                 {
  //                     "_id": "6633442a22cb650f4b3acfed",
  //                     "title": "Lets test this properly now",
  //                     "data": [
  //                         {
  //                             "row": 1,
  //                             "text": "ff"
  //                         },
  //                         {
  //                             "row": 2,
  //                             "text": "df"
  //                         },
  //                         {
  //                             "row": 3,
  //                             "text": "sss sfig"
  //                         }
  //                     ],
  //                     "type": "file",
  //                     "userId": "66333f339fbf76136d3d060c",
  //                     "createdBy": "{\"email\":\"testing1234@gmiail.com\",\"username\":\"testing1234\",\"userId\":\"66333f339fbf76136d3d060c\",\"name\":\"testing1234\",\"iat\":1714634547}"
  //                 }
  //             ],
  //             "message": "Success"
  //         });
  //     });
};

///{{NODE_URL}}/v1/search?userId=66729d25ffdad56891a43de4&searchTerm=vinay
