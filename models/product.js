const path = require('path');
const fs = require('fs');


const filePath = path.join(__dirname, '..', 'data', 'products.json'); // path json file


const getProductFromFile = (callback) => {
    fs.readFile(filePath, (error, fileBody) => {
        if (error) {
            callback( [] );
        } else {
            callback( JSON.parse(fileBody) );     
        }
    });
};


module.exports = class Product {
    constructor(title) { 
        this.title = title;  // product title
    }

    // push product to json file
    save() {
        getProductFromFile( (products) => {
            // products ==> return getProductFromFile function
            products.push(this);  // this -- product element
            // write product array to json file
            fs.writeFile(filePath, JSON.stringify(products), (error) => {
                console.log('write json file error:', error);
            });
        });
    }

    // static ==> return all product from db 
    static fetchAllProducts(callback) {
        getProductFromFile(callback);
    }
}

