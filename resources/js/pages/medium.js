"use strict"

import { MediathekAPI } from "../api/mediathek-api.js";
import { ResourceDialog } from "../resource-dialog.js";
import { ResourceTable } from "../resource-table.js";

const api = new MediathekAPI("https://192.168.1.186");
const dialog = new ResourceDialog(document.getElementById("resource-dialog"));
const table = new ResourceTable(document.getElementById("resource-table"), (row, object) => {
	row.insertCell(0).innerHTML = object.id || "";
	row.insertCell(1).innerHTML = object.title || "";
	row.insertCell(2).innerHTML = object.author || "";
	row.insertCell(3).innerHTML = object.genre || "";
	row.insertCell(4).innerHTML = object.ageRestriction || "";
	row.insertCell(5).innerHTML = object.isbn || object.ean || "";
	row.insertCell(6).innerHTML = object.shelf || "";
},
["number", "string", "string", "string", "number", "string", "string"]);

function setup() {
	// Menu buttons
	document.getElementById("create-button").addEventListener("click", _ => dialog.showDialog());
	document.getElementById("close-button").addEventListener("click", _ => dialog.closeDialog());
	document.getElementById("edit-button").addEventListener("click", _ => editMedium(table.selectedRow));
	document.getElementById("delete-button").addEventListener("click", _ => deleteMedium(table.selectedRow));
	
	// Search buttons
	document.getElementById("search-button").addEventListener("click", _ => getMediums(document.getElementById("title-search").value));
	document.getElementById("search-all-button").addEventListener("click", _ => getMediums());
	
	// Dialog events
	document.getElementById("medium-dialog").addEventListener("submit", saveMedium);
	document.getElementById("medium-dialog").addEventListener("reset", _ => dialog.closeDialog());

	// Load orignal data
	getMediums();
}


function getMediums(title) {
	api.getMediums(title).then((mediums) => {
		table.setTableData(mediums);
	});
}

function saveMedium(event) {
	event.preventDefault();

	const id = document.getElementById("id").value;
	const medium = Object.fromEntries(new FormData(event.target));

	if (id) {
		api.updateMedium(id, medium).then((response) => {
			table.updateTableData(table.selectedRow, response);
		});
	} else {
		api.createMedium(medium).then((response) => {
			table.addTableData(response);
		});
	}
	dialog.closeDialog();
}

function editMedium(index) {
	if (index != -1) {
		api.getMedium(table.getSelectedData().id).then((response) => {
			dialog.showEditDialog((_ => {
				document.getElementById("id").value = response.id || "";
				document.getElementById("title").value = response.title || "";
				document.getElementById("author").value = response.author || "";
				document.getElementById("genre").value = response.genre || "";
				document.getElementById("age-restriction").value = response.ageRestriction || "";
				document.getElementById("isbn").value = response.isbn || "";
				document.getElementById("ean").value = response.ean || "";
				document.getElementById("shelf").value = response.shelf || "";
			}));
		});
	}
}

function deleteMedium(index) {
	if (index != -1) {
		api.deleteMedium(table.getSelectedData().id);
		table.removeTableData(index);
	}
}

setup();