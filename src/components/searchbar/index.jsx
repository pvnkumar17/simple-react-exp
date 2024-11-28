
import { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { Input, Modal, ModalBody, ModalHeader } from "reactstrap";
import fileIcon from '../../images/icons/file.svg';
import folderIcon from '../../images/icons/folder.svg';
import { search } from "../../services/meService";
import "./searchbar.scss";

const Searchbar = ({ searchbarOpen, toggleDialog }) => {
    
    const [searchbarValue, setSearchbarValue] = useState('')
    const [records, setRecords ] = useState([]);
    

    const getIcon = (item) => {
    if(item.isRoot) {
      return <></>
    }
    return <img src = {item.type === 'folder' ? folderIcon : fileIcon} />
  }

    useEffect(() => {
      search(searchbarValue, '').then(response => {
        setRecords(response.data);
        
      })
    }, [searchbarValue]);

    // function highlight(id) {
    //   const titleNode = document.getElementById(id);
    //   if(titleNode) {
    //     window.getSelection()
    //       .selectAllChildren(
    //         titleNode
    //       );
    //   }
    // }

    const highlightMatchingText = (record, text) =>  {
      if(text) {
        const pattern = new RegExp(text, 'gi');
        record.title = record.title.replace(pattern, highlight);
        record.data = record.data.map(row => {
          return {
            ...row,
            text: row.text.replace(pattern, highlight)
          }
        })
      }
      return record;
    }

    function highlight(text) {
      return '<strong className={highlight}>' + text + '</strong>'
    }

    return (
        <Modal isOpen={searchbarOpen} toggle={toggleDialog}>
            <ModalHeader toggle={toggleDialog}><Input type='search' value={searchbarValue} onChange={(e) => setSearchbarValue(e.target.value)} /></ModalHeader>
            <ModalBody>
                {
                  records.map(record => {
                    const highlightedRecord = highlightMatchingText(record, searchbarValue);
                    return (
                      
                      <div key={record._id + 'group'} className="result">
                        {/* onClick={() => highlight(record._id)} */}
                        <div  className="title">
                        {getIcon(record)}
                          <span id={record._id} dangerouslySetInnerHTML={{__html: highlightedRecord.title}}></span>
                        </div>
                        <div className="content">
                          {
                            record.data.map(line => {
                              return <div id={record._id + '_row' +  line.row} dangerouslySetInnerHTML={{__html: line.text}}>
                              </div>
                            })
                          }
                        </div>
                        
                      </div>
                      
                    )
                  })
                }
            </ModalBody>
        </Modal>
    );
}
function mapStateToProps(state, ownProps) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Searchbar);
