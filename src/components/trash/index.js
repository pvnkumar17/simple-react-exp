import { connect } from 'react-redux';
import DropDown, { DropDownItem } from '../../ui/DropDown';
import { deletedNodes } from '../../actions/meAction';
import './trash.css';
import { getDeletedNodes } from '../../services/meService';

const Trash = ({deletedNodeList, setDeletedNodes
}) => {
    const listDeletedNodes = () => getDeletedNodes().then(data => setDeletedNodes(data)).catch(error => {
    throw (error);
  });

  return (
    <DropDown
        disabled={false}
        buttonClassName="trash"
        buttonLabel={<div>{'Trash'}</div>}
        buttonAriaLabel="menu specialized editor node"
        buttonIconClassName="icon humburger"
    >
        <DropDownItem
          onClick={() => listDeletedNodes()}
          className="item">
          {deletedNodeList && deletedNodeList.map(item => <div>{item.title}</div>)}
        </DropDownItem>
    </DropDown>
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
