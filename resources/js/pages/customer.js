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
		row.insertCell(1).innerHTML = object.firstname || "";
		row.insertCell(2).innerHTML = object.lastname || "";
		row.insertCell(3).innerHTML = object.birthdate || "";
		row.insertCell(4).innerHTML = object.email || "";
		row.insertCell(5).innerHTML = object.address ? `${object.address.street} ${object.address.houseNumber}, ${object.address.postcode} ${object.address.locality}` || "" : "";
	}
},
["number", "string", "string", "date", "string", "string"]);
const toastHandler = new ToastHandler();

const dateRegex = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
const emailRegex = /^.+@[a-zA-Z\d]+\.[a-z]+$/;

/**
 * Setup HTML connections and load original data.
 */
function setup() {
	// Menu buttons
	document.getElementById("create-button").addEventListener("click", _ => dialog.showDialog());
	document.getElementById("close-button").addEventListener("click", _ => dialog.closeDialog());
	document.getElementById("edit-button").addEventListener("click", _ => editCustomer(table.selectedRow));
	document.getElementById("delete-button").addEventListener("click", _ => deleteCustomer(table.selectedRow));
	
	// Search buttons
	document.getElementById("search-button").addEventListener("click", _ => getCustomers(document.getElementById("lastname-search").value, document.getElementById("address-search").value));
	document.getElementById("search-all-button").addEventListener("click", _ => getCustomers());
	
	// Dialog events
	document.getElementById("customer-dialog").addEventListener("submit", saveCustomer);
	document.getElementById("customer-dialog").addEventListener("reset", _ => dialog.closeDialog());

	// Load orignal data
	getCustomers();
}

/**
 * Load customers from the api.
 * 
 * @param {string} lastname - Lastname of the customers.
 * @param {string} address - Address of the customers.
 */
function getCustomers(lastname, address) {
	api.getCustomers(lastname, address).then((customers) => {
		table.setTableData(customers);
	}).catch((error) => {
		toastHandler.showToast(error);
	});
}

/**
 * Save the customer with the api.
 * 
 * @param {*} event - submit event of the form 
 */
function saveCustomer(event) {
	event.preventDefault();

	const id = document.getElementById("id").value;
	const _customer = Object.fromEntries(new FormData(event.target));
	let [day, month, year] = [undefined, undefined, undefined];
	let error = false;

	// Unset errors
	document.getElementById("firstname-error").classList.add("hidden");
	document.getElementById("firstname-error").innerHTML = "";
	document.getElementById("lastname-error").classList.remove("hidden");
	document.getElementById("lastname-error").innerHTML = "";
	document.getElementById("birthdate-error").classList.add("hidden");
	document.getElementById("birthdate-error").innerHTML = "";
	document.getElementById("email-error").classList.add("hidden");
	document.getElementById("email-error").innerHTML = "";
	document.getElementById("address-street-error").classList.add("hidden");
	document.getElementById("address-street-error").innerHTML = "";
	document.getElementById("address-number-error").classList.add("hidden");
	document.getElementById("address-number-error").innerHTML = "";
	document.getElementById("address-postcode-error").classList.add("hidden");
	document.getElementById("address-postcode-error").innerHTML = "";
	document.getElementById("address-locality-error").classList.add("hidden");
	document.getElementById("address-locality-error").innerHTML = "";

	// Input validation
	for (let attribute in _customer) {
		if (_customer[attribute].length == 0) {
			_customer[attribute] = undefined;
		}
	}

	if (!_customer.firstname || _customer.firstname.length == 0) {
		error = true;
		document.getElementById("firstname-error").classList.remove("hidden");
		document.getElementById("firstname-error").innerHTML = "Vorname wird benötigt";
	}
	if (!_customer.lastname || _customer.lastname.length == 0) {
		error = true;
		document.getElementById("lastname-error").classList.remove("hidden");
		document.getElementById("lastname-error").innerHTML = "Nachname wird benötigt";
	}
	if (!_customer.birthdate || _customer.birthdate.length == 0) {
		error = true;
		document.getElementById("birthdate-error").classList.remove("hidden");
		document.getElementById("birthdate-error").innerHTML = "Geburtsdatum wird benötigt";
	} else if (!dateRegex.test(_customer.birthdate)) {
		error = true;
		document.getElementById("birthdate-error").classList.remove("hidden");
		document.getElementById("birthdate-error").innerHTML = "Als Datum eintragen (dd.mm.yyyy)";
	} else {
		const match = _customer.birthdate.match(dateRegex);
		[day, month, year] = _customer.birthdate.split(match[4]);
	}
	if (!_customer.email || _customer.email.length == 0) {
		error = true;
		document.getElementById("email-error").classList.remove("hidden");
		document.getElementById("email-error").innerHTML = "Email wird benötigt";
	} else if (!emailRegex.test(_customer.email)) {
		error = true;
		document.getElementById("email-error").classList.remove("hidden");
		document.getElementById("email-error").innerHTML = "Als Email eintragen";
	}
	if (!_customer["address-street"] || _customer["address-street"].length == 0) {
		error = true;
		document.getElementById("address-street-error").classList.remove("hidden");
		document.getElementById("address-street-error").innerHTML = "Strasse wird benötigt";
	}
	if (!_customer["address-number"] || _customer["address-number"].length == 0) {
		error = true;
		document.getElementById("address-number-error").classList.remove("hidden");
		document.getElementById("address-number-error").innerHTML = "Nummer wird benötigt";
	}
	if (!_customer["address-postcode"] || _customer["address-postcode"].length == 0) {
		error = true;
		document.getElementById("address-postcode-error").classList.remove("hidden");
		document.getElementById("address-postcode-error").innerHTML = "Postleitzahl wird benötigt";
	}
	if (!_customer["address-locality"] || _customer["address-locality"].length == 0) {
		error = true;
		document.getElementById("address-locality-error").classList.remove("hidden");
		document.getElementById("address-locality-error").innerHTML = "Ortschaft wird benötigt";
	}

	if (error) {
		return;
	}

	let customer = {};
	let customerAddress = {};
	_customer.firstname ? customer.firstname = _customer.firstname : "";
	_customer.lastname ? customer.lastname = _customer.lastname : "";
	_customer.birthdate ? customer.birthdate = `${year}-${month}-${day}` : "";
	_customer.email ? customer.email = _customer.email : "";
	_customer["address-street"] ? customerAddress.street = _customer["address-street"] : "";
	_customer["address-number"] ? customerAddress.houseNumber = _customer["address-number"] : "";
	_customer["address-postcode"] ? customerAddress.postcode = _customer["address-postcode"] : "";
	_customer["address-locality"] ? customerAddress.locality = _customer["address-locality"] : "";
	customerAddress ? customer.address = customerAddress : "";

	if (id) {
		api.updateCustomer(id, customer).then((response) => {
			table.updateTableData(table.selectedRow, response);
		}).catch((error) => {
			toastHandler.showToast(error);
		});
	} else {
		api.createCustomer(customer).then((response) => {
			table.addTableData(response);
		}).catch((error) => {
			toastHandler.showToast(error);
		});
	}

	dialog.closeDialog();
}

/**
 * Edit the customer with the api.
 * 
 * @param {nubmer} index - Table index of the customer to edit.
 */
function editCustomer(index) {
	if (index != -1) {
		api.getCustomer(table.getSelectedData().id).then((response) => {
			dialog.showEditDialog((_ => {
				document.getElementById("id").value = response.id || "";
				document.getElementById("firstname").value = response.firstname || "";
				document.getElementById("lastname").value = response.lastname || "";
				document.getElementById("birthdate").value = response.birthdate.split("-").reverse().join(".") || "";
				document.getElementById("email").value = response.email || "";
				document.getElementById("address-street").value = response.address ? response.address.street || "" : "";
				document.getElementById("address-number").value = response.address ? response.address.houseNumber || "" : "";
				document.getElementById("address-postcode").value = response.address ? response.address.postcode || "" : "";
				document.getElementById("address-locality").value = response.address ? response.address.locality || "" : "";
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
function deleteCustomer(index) {
	if (index != -1) {
		api.deleteCustomer(table.getSelectedData().id).then(_ => {
			table.removeTableData(index);
		}).catch((error) => {
			toastHandler.showToast(error);
			return;
		});
	}
}

setup();