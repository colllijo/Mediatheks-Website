"use strict"

import { MediathekAPI } from "../api/mediathek-api.js";
import { ResourceDialog } from "../resource-dialog.js";
import { ResourceTable } from "../resource-table.js";

const api = new MediathekAPI("https://192.168.1.186");
const dialog = new ResourceDialog(document.getElementById("resource-dialog"));
const table = new ResourceTable(document.getElementById("resource-table"), (row, object) => {
	row.insertCell(0).innerHTML = object.id || "";
	row.insertCell(1).innerHTML = object.firstname || "";
	row.insertCell(2).innerHTML = object.lastname || "";
	row.insertCell(3).innerHTML = object.birthdate || "";
	row.insertCell(4).innerHTML = object.email || "";
    row.insertCell(5).innerHTML = object.address ? `${object.address.street} ${object.address.houseNumber}, ${object.address.postcode} ${object.address.locality}` || "" : "";
},
["number", "string", "string", "date", "string", "string"]);

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


function getCustomers(lastname, address) {
	api.getCustomers(lastname, address).then((customers) => {
		table.setTableData(customers);
	});
}

function saveCustomer(event) {
	event.preventDefault();

	const id = document.getElementById("id").value;
	const _customer = Object.fromEntries(new FormData(event.target));
    const customer = {
        firstname: _customer.firstname,
        lastname: _customer.lastname,
        birthdate: _customer.birthdate,
        email: _customer.email,
        address: {
            street: _customer["address-street"],
            houseNumber: _customer["address-number"],
            postcode: _customer["address-postcode"],
            locality: _customer["address-locality"]
        }
    };

	if (id) {
		api.updateCustomer(id, customer).then((response) => {
			table.updateTableData(table.selectedRow, response);
		});
	} else {
		api.createCustomer(customer).then((response) => {
			table.addTableData(response);
		});
	}
	dialog.closeDialog();
}

function editCustomer(index) {
	if (index != -1) {
		api.getCustomer(table.getSelectedData().id).then((response) => {
			dialog.showEditDialog((_ => {
				document.getElementById("id").value = response.id || "";
				document.getElementById("firstname").value = response.firstname || "";
				document.getElementById("lastname").value = response.lastname || "";
				document.getElementById("birthdate").value = response.birthdate || "";
				document.getElementById("email").value = response.email || "";
				document.getElementById("address").value = response.address ? response.address.street || "" : "";
			}));
		});
	}
}

function deleteCustomer(index) {
	if (index != -1) {
		api.deleteCustomer(table.getSelectedData().id);
		table.removeTableData(index);
	}
}

setup();