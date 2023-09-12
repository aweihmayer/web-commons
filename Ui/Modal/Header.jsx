class ModalHeader extends React.Component {
    render() {
        return <header>
            <div><button className="modal-close-btn" onClick={Modal.close}>X</button></div>
            {this.props.children}
        </header>;
    }
}