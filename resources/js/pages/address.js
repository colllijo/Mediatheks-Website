"use strict"

import { MediathekAPI } from "../api/mediathek-api.js";
import { ResourceDialog } from "../resource-dialog.js";
import { ResourceTable } from "../resource-table.js";
import { ToastHandler } from "../toast.js";

const api = new MediathekAPI("https://192.168.1.186");
const dialog = new ResourceDialog(document.getElementById("resource-dialog"));
const table = new ResourceTable(document.getElementById("resource-table"), (row, object) => {
	if (object) {
		row.insertCell(0).innerHTML = object.id || "";
		row.insertCell(1).innerHTML = object.street || "";
		row.insertCell(2).innerHTML = object.houseNumber || "";
		row.insertCell(3).innerHTML = object.postcode || "";
		row.insertCell(4).innerHTML = object.locality || "";
	}
},
["number", "string", "string", "string", "string"]);
const toastHandler = new ToastHandler();

/**
 * Setup HTML connections and load original data.
 */
function setup() {
	// Menu buttons
	document.getElementById("create-button").addEventListener("click", _ => dialog.showDialog());
	document.getElementById("close-button").addEventListener("click", _ => dialog.closeDialog());
	document.getElementById("edit-button").addEventListener("click", _ => editAddress(table.selectedRow));
	document.getElementById("delete-button").addEventListener("click", _ => deleteAddress(table.selectedRow));
	
	// Search buttons
	document.getElementById("search-button").addEventListener("click", _ => getAddresses(document.getElementById("postcode-search").value, document.getElementById("street-search").value, document.getElementById("number-search").value));
	document.getElementById("search-all-button").addEventListener("click", _ => getAddresses());
	
	// Dialog events
	document.getElementById("address-dialog").addEventListener("submit", saveAddress);
	document.getElementById("address-dialog").addEventListener("reset", _ => dialog.closeDialog());

	// Load orignal data
	getAddresses();
}

/**
 * Load addresses from the api.
 * 
 * @param {string} postcode - postcode of the addresses. 
 * @param {string} street - street of the addresses.
 * @param {string} number - number of the addresses.
 */
function getAddresses(postcode, street, number) {
	api.getAddresses(postcode, street, number).then((mediums) => {
		table.setTableData(mediums);
	}).catch((error) => {
		toastHandler.showToast(error);
	});
}

/**
 * Save the address with the api.
 * 
 * @param {*} event - submit event of the form 
 */
function saveAddress(event) {
	event.preventDefault();

	const id = document.getElementById("id").value;
	const _address = Object.fromEntries(new FormData(event.target));
	let error = false;

	// Unset errors
	document.getElementById("street-error").classList.add("hidden");
	document.getElementById("street-error").innerHTML = "";
	document.getElementById("number-error").classList.add("hidden");
	document.getElementById("number-error").innerHTML = "";
	document.getElementById("postcode-error").classList.add("hidden");
	document.getElementById("postcode-error").innerHTML = "";
	document.getElementById("locality-error").classList.add("hidden");
	document.getElementById("locality-error").innerHTML = "";

	// Input validation
	for (let attribute in _address) {
		if (_address[attribute].length == 0) {
			_address[attribute] = undefined;
		}
	}

	if (!_address.street || _address.street.length == 0) {
		error = true;
		document.getElementById("street-error").classList.remove("hidden");
		document.getElementById("street-error").innerHTML = "Strasse wird benötigt";
	}
	if (!_address.number || _address.number.length == 0) {
		error = true;
		document.getElementById("number-error").classList.remove("hidden");
		document.getElementById("number-error").innerHTML = "Nummer wird benötigt";
	}
	if (!_address.postcode || _address.postcode.length == 0) {
		error = true;
		document.getElementById("postcode-error").classList.remove("hidden");
		document.getElementById("postcode-error").innerHTML = "Postleitzahl wird benötigt";
	}
	if (!_address.locality || _address.locality.length == 0) {
		error = true;
		document.getElementById("locality-error").classList.remove("hidden");
		document.getElementById("locality-error").innerHTML = "Ortschaft wird benötigt";
	}

	if (error) {
		return;
	}

    let address = {};
	_address.street ? address.street = _address.street : "";
	_address.number ? address.houseNumber = _address.number : "";
	_address.postcode ? address.postcode = _address.postcode : "";
	_address.locality ? address.locality = _address.locality : "";

	if (id) {
		api.updateAddress(id, address).then((response) => {
			table.updateTableData(table.selectedRow, response);
		}).catch((error) => {
			toastHandler.showToast(error);
		});
	} else {
		api.createAddress(address).then((response) => {
			table.addTableData(response);
		}).catch((error) => {
			toastHandler.showToast(error);
		});
	}
	dialog.closeDialog();
}

/**
 * Edit the address with the api.
 * 
 * @param {nubmer} index - Table index of the address to edit.
 */
function editAddress(index) {
	if (index != -1) {
		api.getAddress(table.getSelectedData().id).then((response) => {
			dialog.showEditDialog((_ => {
				document.getElementById("id").value = response.id || "";
				document.getElementById("street").value = response.street || "";
				document.getElementById("number").value = response.houseNumber || "";
				document.getElementById("postcode").value = response.postcode || "";
				document.getElementById("locality").value = response.locality || "";
			}));
		}).catch((error) => {
			toastHandler.showToast(error);
		});
	}
}

/**
 * Delete the customer with the api.
 * 
 * @param {nubmer} index - Table index of the customer to delete. 
 */
function deleteAddress(index) {
	if (index != -1) {
		api.deleteAddress(table.getSelectedData().id).then(_ => {
			table.removeTableData(index);
		}).catch((error) => {
			toastHandler.showToast(error);
			return;
		});
	}
}

setup();