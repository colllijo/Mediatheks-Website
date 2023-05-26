"use strict"

/**
 * Class to handle the HTML Table element used for displaying the ressources.
 * 
 * @author Metzger, Liam
 */
export class ResourceTable {
    table;
    tableBody;
    data;

    fillRow;
    selectedRow;

    columnSorting;
    sortedColumns;

    constructor(table, fillRow, columnSorting, originalData) {
        this.table = table;
        this.tableBody = table.tBodies[0];

        if (originalData) {
            this.setTableData(originalData);
        }

        this.fillRow = fillRow;
        this.selectedRow = -1;

        this.columnSorting = columnSorting;
        this.sortedColumns = [];
        let headers = this.table.rows[0].cells;
        
        for (let i = 0; i < headers.length; i++) {
            headers[i].addEventListener("click", _ => this.sortTable(i));
        }
        for (let i = 0; i < this.columnSorting.length; i++) {
            this.sortedColumns.push(undefined);
        }
    }

    /**
     * Method to set the data of the table.
     * 
     * @param {*} data - New data of the table. 
     */
    setTableData(data) {
        this.clearTable();
        this.data = data;
        this.data.forEach(element => {
            this.addTableRow(element).addEventListener("mousedown", _ => this.selectTableRow(this.data.indexOf(element)));
        });
    }

    /**
     * Method to add an element to the table.
     * 
     * @param {*} element - Data element to add to the table 
     */
    addTableData(element) {
        this.data.push(element);

        console.log(this.data)

        this.addTableRow(element).addEventListener("mousedown", _ => this.selectTableRow(this.data.indexOf(element)));
    }

    /**
     * Method to change the value of an element in the table.
     * 
     * @param {number} index - Index of the element in the table.
     * @param {*} element - New value of the element.
     */
    updateTableData(index, element) {
        this.data[index] = element;
        this.tableBody.deleteRow(index);
        this.addTableRow(element, index);
    }

    /**
     * Method to remove an element from the table.
     * 
     * @param {number} index - Index of the element to remove.
     */
    removeTableData(index) {
        this.data.splice(index, 1);
        this.tableBody.deleteRow(index);

        if (index == this.selectedRow) {
            this.selectedRow = -1;
        }
    }

    /**
     * Method to get the data stored in the table.
     * 
     * @returns - Data of the table.
     */
    getTableData() {
        return this.data;
    }

    /**
     * Method to get the selected element in the table.
     * 
     * @returns - Selected element.
     */
    getSelectedData() {
        if (this.selectedRow != -1) {
            return this.data[this.selectedRow];
        }
    }

    /**
     * Internal method to add an element to the displayed table
     * 
     * @param {*} object - object to place in the row.
     * @param {*} index - At which the element should be placed (default: -1 (at the end))
     * @returns - The newly created row.
     */
    addTableRow(object, index) {
        if (!index) {
            index = -1;
        }

        const row = this.tableBody.insertRow(index);
        this.fillRow(row, object);

        return row;
    }

    /**
     * Method to handle the onclick event on the table rows selecting one.
     * 
     * @param {number} index - of the clicked row.
     */
    selectTableRow(index) {
        if (this.selectedRow != -1) {
            this.tableBody.rows[this.selectedRow].classList.remove("selected");
        }

        this.selectedRow = index;
        this.tableBody.rows[index].classList.add("selected");
    }

    /**
     * Method to clear all data in the table.
     */
    clearTable() {
        this.data = [];
        for(let i = this.tableBody.rows.length - 1 ; i >= 0; i--) {
		    this.tableBody.deleteRow(i);  
	    } 
    }

    /**
     * Internal method to only clear all rows in the displayed table.
     */
    clearTableRows() {
        for(let i = this.tableBody.rows.length - 1 ; i >= 0; i--) {
		    this.tableBody.deleteRow(i);  
	    } 
    }

    /**
     * Method to sort the table
     */
    sortTable(columnIndex) {
        this.clearTableRows();

        // Determine order
        for (let i = 0; i < this.sortedColumns.length; i++) {
            if (i != columnIndex) {
                if(this.sortedColumns[i]) {
                    this.table.rows[0].cells[i].innerHTML = this.table.rows[0].cells[i].innerHTML.substring(0, this.table.rows[0].cells[i].innerHTML.length - 1)
                }
                this.sortedColumns[i] = undefined;
            } else {
                if(this.sortedColumns[i] === "asc") {
                    this.sortedColumns[i] = "dsc";
                    this.table.rows[0].cells[i].innerHTML = this.table.rows[0].cells[i].innerHTML.substring(0, this.table.rows[0].cells[i].innerHTML.length - 1)
                    this.table.rows[0].cells[i].innerHTML += "▾";
                } else {
                    if (this.sortedColumns[i] === "dsc") {
                        this.table.rows[0].cells[i].innerHTML = this.table.rows[0].cells[i].innerHTML.substring(0, this.table.rows[0].cells[i].innerHTML.length - 1)
                    }

                    this.sortedColumns[i] = "asc";
                    this.table.rows[0].cells[i].innerHTML += "▴";
                }
            }
        }

        this.data.sort((a, b) => {
            if (!Object.values(a)[columnIndex] && !Object.values(b)[columnIndex]) {
                return 0;
            } else if (!Object.values(b)[columnIndex]) {
                return -1;
            } else if (!Object.values(a)[columnIndex]) {
                return 1;
            } else {
                switch (this.columnSorting[columnIndex]) {
                    case "string":
                        return Object.values(a)[columnIndex].toString().localeCompare(Object.values(b)[columnIndex].toString()) * (this.sortedColumns[columnIndex] === "asc" ? 1 : -1);      
                    case "number":
                        return (parseInt(Object.values(a)[columnIndex]) - parseInt(Object.values(b)[columnIndex])) * (this.sortedColumns[columnIndex] === "asc" ? 1 : -1);
                    case "date":
                        return (new Date(Object.values(a)[columnIndex]).getTime() - new Date(Object.values(b)[columnIndex]).getTime()) * (this.sortedColumns[columnIndex] === "asc" ? 1 : -1);
                    default:
                        return Object.values(a)[columnIndex].toString().localeCompare(Object.values(b)[columnIndex]) * (this.sortedColumns[columnIndex] === "asc" ? 1 : -1);
                }
            }
        }).forEach(element => {
            this.addTableRow(element).addEventListener("mousedown", _ => this.selectTableRow(this.data.indexOf(element)));
        });
    }
}