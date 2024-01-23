/**
 * Defines a component that displays in front of the main view.
 */
class Modal extends React.Component {
    static root = null;

    /**
     * Shows a modal and activates the overlay.
     * @param {Element} modal The modal's content.
     */
    static open(modal) {
        let container = document.getElementById('modal-container');
        Modal.root = ReactDOM.createRoot(container);
        Modal.root.render(modal);
        document.getElementById('app-modal').classList.add('active');
    }

    /** 
     * Close the current modal.
     */
    static close() {
        document.getElementById('app-modal').classList.remove('active');
        Modal.root.unmount();
    }

    /**
     * Readies the DOM to show modals by creating necessary elements and events.
     */
    static require() {
        // Container
        let container = document.createElement('aside');
        container.id = 'app-modal';

        // Close the modal if clicking outside of its box
        container.onclick = function (ev) {
            if (ev.target.closest('article') != null) return;
            Modal.close();
        };

        // Subcontainer
        let subcontainer = document.createElement('div');
        subcontainer.id = 'modal-container';
        container.appendChild(subcontainer);

        document.body.appendChild(container);
    }
}