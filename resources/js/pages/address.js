"use strict"

import { MediathekAPI } from "../api/mediathek-api.js";
import { ResourceDialog } from "../resource-dialog.js";
import { ResourceTable } from "../resource-table.js";

const api = new MediathekAPI("https://192.168.1.186");
const dialog = new ResourceDialog(document.getElementById("resource-dialog"));
const table = new ResourceTable(document.getElementById("resource-table"), (row, object) => {
	row.insertCell(0).innerHTML = object.id || "";
	row.insertCell(1).innerHTML = object.street || "";
	row.insertCell(2).innerHTML = object.houseNumber || "";
	row.insertCell(3).innerHTML = object.postcode || "";
	row.insertCell(4).innerHTML = object.locality || "";
},
["number", "string", "string", "string", "string"]);

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


function getAddresses(postcode, street, number) {
	api.getAddresses(postcode, street, number).then((mediums) => {
		table.setTableData(mediums);
	});
}

function saveAddress(event) {
	event.preventDefault();

	const id = document.getElementById("id").value;
	const _address = Object.fromEntries(new FormData(event.target));
    const address = {
        street: _address.street,
        houseNumber: _address.number,
        postcode: _address.postcode,
        locality: _address.locality
    }

	if (id) {
		api.updateAddress(id, address).then((response) => {
			table.updateTableData(table.selectedRow, response);
		});
	} else {
		api.createAddress(address).then((response) => {
			table.addTableData(response);
		});
	}
	dialog.closeDialog();
}

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
		});
	}
}

function deleteAddress(index) {
	if (index != -1) {
		api.deleteAddress(table.getSelectedData().id);
		table.removeTableData(index);
	}
}

setup();