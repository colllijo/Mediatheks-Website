"use strict"

/**
 * Class to handle interaction with the backend
 * 
 * @author Metzger, Liam 
 */
export class MediathekAPI {
    host;

    constructor(host) {
        this.host = host;
    }

    /**
     * Method to fetch a list of mediums from the api.
     * 
     * @param {string} title - Titel of the mediums to search.
     * @returns {Promise} - Promis containing the fetched data. 
     */
    async getMediums(title) {
        return fetch(`${this.host}/api/v1/library/mediums?title=${encodeURIComponent(title || "")}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        }).then((data) => data.json());
    }

    /**
     * Method to fetch a single of medium by its id from the api.
     * 
     * @param {number} id - Id of the medium.
     * @returns {Promise} - Promis containing the fetched data. 
     */
    async getMedium(id) {
        return fetch(`${this.host}/api/v1/library/mediums/${id}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        }).then((data) => data.json());
    }

    /**
     * Method to post a new medium to the api.
     * 
     * @param {*} medium - Medium to create.
     * @returns {Promise} - Promis containing the returned data. 
     */
    async createMedium(medium) {
        return fetch(`${this.host}/api/v1/library/mediums`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(medium)
        }).then((data) => data.json());
    }

    /**
     * Method to put an update of a medium to the api.
     * 
     * @param {number} id - Id of the medium to update.
     * @param {*} medium - Updated medium to save.
     * @returns {Promise} - Promis containing the returned data. 
     */
    async updateMedium(id, medium) {
        return fetch(`${this.host}/api/v1/library/mediums/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(medium)
        }).then((data) => data.json());
    }

    /**
     * Method to delete a medium using the api.
     * 
     * @param {number} id - Id of the medium to delete. 
     */
    async deleteMedium(id) {
        fetch(`${this.host}/api/v1/library/mediums/${id}`, {
            method: "DELETE",
        });
    }

    /**
     * Method to fetch a list of addresses from the api.
     * 
     * @param {string} postcode - Postcode of the addresses to search.
     * @param {string} street - Street of the addresses to search.
     * @param {string} number - Number of the addresses to search.
     * @returns {Promise} - Promis containing the fetched data. 
     */
    async getAddresses(postcode, street, number) {
        return fetch(`${this.host}/api/v1/library/addresses?postcode=${encodeURIComponent(postcode || "")}&street=${encodeURIComponent(street || "")}&number=${encodeURIComponent(number || "")}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        }).then((data) => data.json());
    }

    /**
     * Method to fetch a single of address by its id from the api.
     * 
     * @param {number} id - Id of the address.
     * @returns {Promise} - Promis containing the fetched data. 
     */
    async getAddress(id) {
        return fetch(`${this.host}/api/v1/library/addresses/${id}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        }).then((data) => data.json());
    }

    /**
     * Method to post a new address to the api.
     * 
     * @param {*} address - Address to create.
     * @returns {Promise} - Promis containing the returned data. 
     */
    async createAddress(address) {
        return fetch(`${this.host}/api/v1/library/addresses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(address)
        }).then((data) => data.json());
    }

    /**
     * Method to put an update of a address to the api.
     * 
     * @param {number} id - Id of the address to update.
     * @param {*} address - Updated address to save.
     * @returns {Promise} - Promis containing the returned data. 
     */
    async updateAddress(id, address) {
        return fetch(`${this.host}/api/v1/library/addresses/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(address)
        }).then((data) => data.json());
    }

    /**
     * Method to delete a address using the api.
     * 
     * @param {number} id - Id of the address to delete. 
     */
    async deleteAddress(id) {
        fetch(`${this.host}/api/v1/library/addresses/${id}`, {
            method: "DELETE",
        });
    }
    
    /**
     * Method to fetch a list of customers from the api.
     * 
     * @param {string} lastname - Lastname of the customers to search.
     * @param {string} street - Street of the customers to search.
     * @returns {Promise} - Promis containing the fetched data. 
     */
    async getCustomers(lastname, street) {
        return fetch(`${this.host}/api/v1/library/customers?lastname=${encodeURIComponent(lastname || "")}&street=${encodeURIComponent(street || "")}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        }).then((data) => data.json());
    }

    /**
     * Method to fetch a single of customer by its id from the api.
     * 
     * @param {number} id - Id of the customer.
     * @returns {Promise} - Promis containing the fetched data. 
     */
    async getCustomer(id) {
        return fetch(`${this.host}/api/v1/library/customers/${id}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        }).then((data) => data.json());
    }

    /**
     * Method to post a new customer to the api.
     * 
     * @param {*} customer - Customer to create.
     * @returns {Promise} - Promis containing the returned data. 
     */
    async createCustomer(customer) {
        return fetch(`${this.host}/api/v1/library/customers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(customer)
        }).then((data) => data.json());
    }

    /**
     * Method to put an update of a customer to the api.
     * 
     * @param {number} id - Id of the customer to update.
     * @param {*} customer - Updated customer to save.
     * @returns {Promise} - Promis containing the returned data. 
     */
    async updateCustomer(id, customer) {
        return fetch(`${this.host}/api/v1/library/customers/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(customer)
        }).then((data) => data.json());
    }

    /**
     * Method to delete a customer using the api.
     * 
     * @param {number} id - Id of the customer to delete. 
     */
    async deleteCustomer(id) {
        fetch(`${this.host}/api/v1/library/customers/${id}`, {
            method: "DELETE",
        });
    }
    
    /**
     * Method to fetch a list of borrows from the api.
     * 
     * @param {string} lastname - Lastname of the borrows to search.
     * @param {string} street - Street of the borrows to search.
     * @returns {Promise} - Promis containing the fetched data. 
     */
    async getBorrows(customerId) {
        return fetch(`${this.host}/api/v1/library/borrows?customerId=${encodeURIComponent(customerId || "")}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        }).then((data) => data.json());
    }

    /**
     * Method to fetch a single of borrow by its id from the api.
     * 
     * @param {number} id - Id of the borrow.
     * @returns {Promise} - Promis containing the fetched data. 
     */
    async getBorrow(id) {
        return fetch(`${this.host}/api/v1/library/borrows/${id}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        }).then((data) => data.json());
    }

    /**
     * Method to post a new borrow to the api.
     * 
     * @param {*} borrow - Borrow to create.
     * @returns {Promise} - Promis containing the returned data. 
     */
    async createBorrow(borrow) {
        return fetch(`${this.host}/api/v1/library/borrows`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(borrow)
        }).then((data) => data.json());
    }

    /**
     * Method to put an extension of a borrow to the api.
     * 
     * @param {number} id - Id of the borrow to extend.
     * @returns {Promise} - Promis containing the returned data. 
     */
    async extendBorrow(id) {
        return fetch(`${this.host}/api/v1/library/borrows/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((data) => data.json());
    }

    /**
     * Method to delete a borrow using the api.
     * 
     * @param {number} id - Id of the borrow to delete. 
     */
    async deleteBorrow(id) {
        fetch(`${this.host}/api/v1/library/borrows/${id}`, {
            method: "DELETE",
        });
    }
}