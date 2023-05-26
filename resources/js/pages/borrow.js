"use strict"

import { MediathekAPI } from "../api/mediathek-api.js";
import { ResourceDialog } from "../resource-dialog.js";
import { ResourceTable } from "../resource-table.js";

const api = new MediathekAPI("https://192.168.1.186");
const dialog = new ResourceDialog(document.getElementById("resource-dialog"));
const table = new ResourceTable(document.getElementById("resource-table"), (row, object) => {
    row.insertCell(0).innerHTML = object.customer ? `${object.customer.id} | ${object.customer.lastname}, ${object.customer.firstname}` || "" : "";
	row.insertCell(1).innerHTML = object.medium ? `${object.medium.id} | ${object.medium.title}, by: ${object.medium.author}` || "" : "";
	row.insertCell(2).innerHTML = object.borrowDate ? new Date(new Date(object.borrowDate).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] || "" : "";
},
["string", "string", "date"]);

function setup() {
	// Menu buttons
	document.getElementById("create-button").addEventListener("click", _ => dialog.showDialog());
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


function getBorrows(customerId) {
	api.getBorrows(customerId).then((customerId) => {
		table.setTableData(customerId);
	});
}

function saveBorrow(event) {
	event.preventDefault();

	const borrow = Object.fromEntries(new FormData(event.target));

    api.createBorrow(borrow).then((response) => {
        table.addTableData(response);
    });
	dialog.closeDialog();
}

function extendBorrow(index) {
	if (index != -1) {
		api.extendBorrow(table.getSelectedData().medium.id).then((response) => {
            table.updateTableData(index, response);
		});
	}
}

function deleteBorrow(index) {
	if (index != -1) {
		api.deleteBorrow(table.getSelectedData().id);
		table.removeTableData(index);
	}
}

setup();