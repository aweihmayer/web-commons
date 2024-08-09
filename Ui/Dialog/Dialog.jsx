/**
 * Defines a component that displays in front of the main view.
 */
class Dialog extends React.Component {
    static root = null;

    /**
     * Shows a dialog and activates the overlay.
     * @param {Element} dialog The dialog's content.
     */
    static open(dialog) {
        let container = document.getElementById('dialog-container');
        Dialog.root = ReactDOM.createRoot(container);
        Dialog.root.render(dialog);
        document.getElementById('app-dialog').classList.add('active');
    }

    /** 
     * Close the current dialog.
     */
    static close() {
        document.getElementById('app-dialog').classList.remove('active');
        Dialog.root.unmount();
    }

    /**
     * Readies the DOM to show dialogs by creating necessary elements and events.
     */
    static require() {
        // Container
        let container = document.createElement('aside');
        container.id = 'app-dialog';

        // Close the dialog if clicking outside of its box
        container.onclick = function (ev) {
            if (ev.target.closest('article') != null) return;
            Dialog.close();
        };

        // Subcontainer
        let subcontainer = document.createElement('div');
        subcontainer.id = 'dialog-container';
        container.appendChild(subcontainer);

        document.body.appendChild(container);
    }
}