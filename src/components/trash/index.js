import { useState } from 'react';
import { connect } from 'react-redux';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button
} from 'reactstrap';
import { deletedNodes } from '../../actions/meAction';
import './trash.css';
import { deleteAction, getDeletedNodes } from '../../services/meService';

const Trash = ({deletedNodeList, setDeletedNodes
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(!dropdownOpen);
    const listDeletedNodes = () => getDeletedNodes().then(data => setDeletedNodes(data)).catch(error => {
      throw (error);
    });

    const deleteNode = (node) => {
      const nodeId = node.id;
      deleteAction(nodeId).then(res => {
        if (res) {
          listDeletedNodes()
        }
      }
      );
    };

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle} direction='down'>
        <DropdownToggle color='none' className='trash' onClick={() => listDeletedNodes()}><div>{'Trash'}</div></DropdownToggle>
        <DropdownMenu className='w-100'>
          {deletedNodeList && deletedNodeList.map(item => <DropdownItem
            className="item ml-0">
            <span className="text">{item.title}</span>
            <Button className='trash-icon' color='none' onClick={() => deleteNode(item)}></Button>
          </DropdownItem>)}
        </DropdownMenu>
    </Dropdown>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    deletedNodeList: state.meDetails.deletedNodes.data || []
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setDeletedNodes: (data) => dispatch(deletedNodes(data))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Trash);
