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
		row.insertCell(1).innerHTML = object.title || "";
		row.insertCell(2).innerHTML = object.author || "";
		row.insertCell(3).innerHTML = object.genre || "";
		row.insertCell(4).innerHTML = object.ageRestriction || "";
		row.insertCell(5).innerHTML = object.isbn || object.ean || "";
		row.insertCell(6).innerHTML = object.shelf || "";
	}
},
["number", "string", "string", "string", "number", "string", "string"]);
const toastHandler = new ToastHandler();

/**
 * Setup HTML connections and load original data.
 */
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

/**
 * Load mediums from the api.
 * 
 * @param {string} title - Title of the mediums.
 */
function getMediums(title) {
	api.getMediums(title).then((mediums) => {
		table.setTableData(mediums);
	}).catch((error) => {
		toastHandler.showToast(error);
	});
}

/**
 * Save the medium with the api.
 * 
 * @param {*} event - submit event of the form 
 */
function saveMedium(event) {
	event.preventDefault();

	const id = document.getElementById("id").value;
	const _medium = Object.fromEntries(new FormData(event.target));
	let error = false;

	// Unset errors
	document.getElementById("title-error").classList.add("hidden")
	document.getElementById("title-error").innerHTML = ""
	document.getElementById("author-error").classList.add("hidden")
	document.getElementById("author-error").innerHTML = ""
	document.getElementById("age-restriction-error").classList.add("hidden")
	document.getElementById("age-restriction-error").innerHTML = ""

	// Input validation
	for (let attribute in _medium) {
		if (_medium[attribute].length == 0) {
			_medium[attribute] = undefined;
		}
	}

	if (!_medium.title || _medium.title.length == 0) {
		error = true;
		document.getElementById("title-error").classList.remove("hidden")
		document.getElementById("title-error").innerHTML = "Titel wird benötigt"
	}
	if (!_medium.author || _medium.author.length == 0) {
		error = true;
		document.getElementById("author-error").classList.remove("hidden")
		document.getElementById("author-error").innerHTML = "Autor wird benötigt"
	}
	if (_medium["age-restriction"] && !/[\d]/.test(_medium["age-restriction"])) {
		error = true;
		document.getElementById("age-restriction-error").classList.remove("hidden")
		document.getElementById("age-restriction-error").innerHTML = "Als Nummer eintragen"
	}

	if (error) {
		return;
	}

	let medium = {};
	_medium.title ?	medium.title = _medium.title : "";
	_medium.author ? medium.author = _medium.author : "";
	_medium.genre ?	medium.genre = _medium.genre : "";
	_medium["age-restriction"] ? medium.ageRestriction = parseInt(_medium["age-restriction"]) : "";
	_medium.isbn ?	medium.isbn = _medium.isbn : "";
	_medium.ean ?	medium.ean = _medium.ean : "";
	_medium.shelf ?	medium.shelf = _medium.shelf : "";
	
	if (id) {
		api.updateMedium(id, medium).then((response) => {
			table.updateTableData(table.selectedRow, response);
		}).catch((error) => {
			toastHandler.showToast(error);
		});
	} else {
		api.createMedium(medium).then((response) => {
			table.addTableData(response);
		}).catch((error) => {
			toastHandler.showToast(error);
		});
	}

	dialog.closeDialog();
}

/**
 * Edit the medium with the api.
 * 
 * @param {nubmer} index - Table index of the medium to edit.
 */
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
		}).catch((error) => {
			toastHandler.showToast(error);
		});
	}
}

/**
 * Delete the medium with the api.
 * 
 * @param {nubmer} index - Table index of the medium to delete. 
 */
function deleteMedium(index) {
	if (index != -1) {
		api.deleteMedium(table.getSelectedData().id).then(_ => {
			table.removeTableData(index);
		}).catch((error) => {
			toastHandler.showToast(error);
			return;
		});
	}
}

setup();