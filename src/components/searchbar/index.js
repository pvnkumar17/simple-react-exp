
import { connect } from 'react-redux';
import { Input, Modal, ModalHeader, ModalBody  } from "reactstrap";
import { useEffect, useState } from "react";

const Searchbar = ({ searchbarOpen }) => {
    const [modal, setModal] = useState(false);
    const [searchbarValue, setSearchbarValue] = useState('')
    useEffect(() => {
        toggle();
    }, [searchbarOpen])

    const toggle = () => setModal(!modal);

    useEffect(() => {

    }, [searchbarValue])

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}><Input type='search' value={searchbarValue} onChange={(e) => setSearchbarValue(e.target.value)} /></ModalHeader>
            <ModalBody>
                List
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
