"use strict"

/**
 * Class to handle the HTML Dialog element used for the interaction with the ressources.
 * 
 * @author Metzger, Liam
 */
export class ResourceDialog {
    dialog;
    
    constructor(dialog) {
        this.dialog = dialog;
    }

	/**
	 * Method to display the dialog in the modal form.
	 * The modal form is used so that the background is blocked.
	 */
    showDialog() {
        this.dialog.showModal();
    }
    
	/**
	 * Method to display the dialog an load values into the inputs
	 * based on a method given.
	 * 
	 * @param {() => void} setValues - Method which sets the input fields. 
	 * @see {@link showDialog}
	 */
    showEditDialog(setValues) {
        this.showDialog();
        setValues();
    }

	/**
	 * Method to close and clear the dialog.
	 */
    closeDialog() {
        this.dialog.close();
		document.querySelector(`#${this.dialog.id} form`).reset();
	}
}