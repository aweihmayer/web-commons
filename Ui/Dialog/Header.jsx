class DialogHeader extends React.Component {
    render() {
        return <header>
            <div><button className="dialog-close-btn" onClick={Dialog.close}>X</button></div>
            {this.props.children}
        </header>;
    }
}