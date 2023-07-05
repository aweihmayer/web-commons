class ModalHeader extends React.Component {
    render() {
        return <header>
            <div><button onClick={Modal.close}>X</button></div>
            {this.props.children}
        </header>;
    }
}