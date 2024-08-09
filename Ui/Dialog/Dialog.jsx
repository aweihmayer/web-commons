/**
 * Defines a component that displays in front of the main view.
 */
class Dialog extends React.Component {
    static node = null;
    static root = null;

    /**
     * Shows a dialog and activates the overlay.
     * @param {Element} dialog The dialog's content.
     */
    static open(dialog) {
        // A dialog is already open
        if (Dialog.root !== null) return;

        // Prepare the DOM to show dialogs by creating necessary elements and events.
        if (Dialog.node === null) {
            // Container
            let container = document.createElement('aside');
            container.id = 'app-dialog';
            document.body.appendChild(container);
            Dialog.node = container;
            // Close the dialog if clicking outside of its box
            container.onclick = function (ev) {
                if (ev.target.closest('dialog') != null) return;
                Dialog.close();
            };
        }

        // Create the dialog
        Dialog.root = ReactDOM.createRoot(Dialog.node);
        Dialog.root.render(dialog);
        Dialog.node.classList.add('active');

        // Waits for React to have rendered to call the showModal function on the dialog. This is needed to have the backdrop enabled
        function showModal() {
            if (Dialog.node.childNodes.length === 0) setTimeout(showModal, 50);
            else Dialog.node.childNodes.forEach(c => {
                if (typeof c.showModal === 'function') c.showModal();
            })
        };

        showModal();
    }

    /** 
     * Close the current dialog.
     */
    static close() {
        Dialog.root.unmount();
        Dialog.root = null;
        Dialog.node.classList.remove('active');
    }
}