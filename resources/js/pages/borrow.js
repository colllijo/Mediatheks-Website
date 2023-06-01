"use strict"

import { MediathekAPI } from "../api/mediathek-api.js";
import { ResourceDialog } from "../resource-dialog.js";
import { ResourceTable } from "../resource-table.js";
import { ToastHandler } from "../toast.js";

const api = new MediathekAPI("https://192.168.1.186");
const dialog = new ResourceDialog(document.getElementById("resource-dialog"));
const table = new ResourceTable(document.getElementById("resource-table"), (row, object) => {
	if (object) {
		row.insertCell(0).innerHTML = object.customer ? `${object.customer.id} | ${object.customer.lastname}, ${object.customer.firstname}` || "" : "";
		row.insertCell(1).innerHTML = object.medium ? `${object.medium.id} | ${object.medium.title}; ${object.medium.author}` || "" : "";
		row.insertCell(2).innerHTML = object.borrowDate ? new Date(new Date(object.borrowDate).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] || "" : "";
	}
},
["string", "string", "date"]);
const toastHandler = new ToastHandler();

/**
 * Setup HTML connections and load original data.
 */
function setup() {
	// Menu buttons
	document.getElementById("create-button").addEventListener("click", _ => {loadDialogOptions(); dialog.showDialog();});
	document.getElementById("close-button").addEventListener("click", _ => dialog.closeDialog());
	document.getElementById("edit-button").addEventListener("click", _ => extendBorrow(table.selectedRow));
	document.getElementById("delete-button").addEventListener("click", _ => deleteBorrow(table.selectedRow));
	
	// Search buttons
	document.getElementById("search-button").addEventListener("click", _ => getBorrows(document.getElementById("customer-id-search").value));
	document.getElementById("search-all-button").addEventListener("click", _ => getBorrows());
	
	// Dialog events
	document.getElementById("borrow-dialog").addEventListener("submit", saveBorrow);
	document.getElementById("borrow-dialog").addEventListener("reset", _ => dialog.closeDialog());

	// Load orignal data
	getBorrows();
}

/**
 * Load borrows from the api.
 * 
 * @param {number} customerId - Id of the customer of the borrow. 
 */
function getBorrows(customerId) {
	api.getBorrows(customerId).then((customerId) => {
		table.setTableData(customerId);
	}).catch((error) => {
		toastHandler.showToast(error);
	});
}

/**
 * Method to laod customer and medium id's into the dropdowns.
 */
function loadDialogOptions() {
	const customerDropdown = document.getElementById("customer-id");
	while (customerDropdown.options.length) {
		customerDropdown.remove(0);
	}

	api.getCustomers().then((customers) => {
		customers.forEach(customer => {
			customerDropdown.add(new Option(`${customer.lastname}, ${customer.firstname}`, customer.id));
		});
	});

	
	const mediumDropdown = document.getElementById("medium-id");
	while (mediumDropdown.options.length) {
		mediumDropdown.remove(0);
	}
	api.getBorrows().then((borrows) => {
		const borrowedMediums = borrows.map((borrow) => borrow.medium.id);

		api.getMediums().then((mediums) => {
			mediums.filter((medium) => !borrowedMediums.includes(medium)).forEach((medium) => {
				mediumDropdown.add(new Option(medium.title, medium.id));
			})
		})
	})
}

/**
 * Save the addresses with the api.
 * 
 * @param {*} event - submit event of the form 
 */
function saveBorrow(event) {
	event.preventDefault();

	const _borrow = Object.fromEntries(new FormData(event.target));
	let error = false;

	// Unset errors
	document.getElementById("customer-id-error").classList.add("hidden");
	document.getElementById("customer-id-error").innerHTML = "";
	document.getElementById("medium-id-error").classList.remove("hidden");
	document.getElementById("medium-id-error").innerHTML = "";

	// Input validation
	for (let attribute in _borrow) {
		if (_borrow[attribute].length == 0) {
			_borrow[attribute] = undefined;
		}
	}

	if (!_borrow["customer-id"] || _borrow["customer-id"].length == 0) {
		error = true;
		document.getElementById("customer-id-error").classList.remove("hidden");
		document.getElementById("customer-id-error").innerHTML = "Kunden ID wird benötigt";
	} else if (_borrow["customer-id"] && !/[\d]/.test(_borrow["customer-id"])) {
		error = true;
		document.getElementById("customer-id-error").classList.remove("hidden")
		document.getElementById("customer-id-error").innerHTML = "Als Nummer eintragen"
	}
	if (!_borrow["medium-id"] || _borrow["medium-id"].length == 0) {
		error = true;
		document.getElementById("medium-id-error").classList.remove("hidden");
		document.getElementById("medium-id-error").innerHTML = "Medium ID wird benötigt";
	} else if (_borrow["medium-id"] && !/[\d]/.test(_borrow["medium-id"])) {
		error = true;
		document.getElementById("medium-id-error").classList.remove("hidden")
		document.getElementById("medium-id-error").innerHTML = "Als Nummer eintragen"
	}

	if (error) {
		return;
	}

	let borrow = {};
	_borrow["customer-id"] ? borrow.customerId = _borrow["customer-id"] : "";
	_borrow["medium-id"] ? borrow.mediumId = _borrow["medium-id"] : "";

    api.createBorrow(borrow).then((response) => {
        table.addTableData(response);
    }).catch((error) => {
		toastHandler.showToast(error);
	});
	dialog.closeDialog();
}

/**
 * Extend the borrow with the api.
 * 
 * @param {nubmer} index - Table index of the borrow to extend.
 */
function extendBorrow(index) {
	if (index != -1) {
		api.extendBorrow(table.getSelectedData().medium.id).then((response) => {
            table.updateTableData(index, response);
		}).catch((error) => {
			toastHandler.showToast(error);
		});
	}
}

/**
 * Delete the borrow with the api.
 * 
 * @param {nubmer} index - Table index of the borrow to delete. 
 */
function deleteBorrow(index) {
	if (index != -1) {
		api.deleteBorrow(table.getSelectedData().medium.id).then(_ => {
			table.removeTableData(index);
		}).catch((error) => {
			toastHandler.showToast(error);
			return;
		});
	}
}

setup();