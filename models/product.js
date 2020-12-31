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
    constructor(title, description, price, imageURL) { 
        this.title = title;
        this.description = description;
        this.price = price;
        this.imageURL = imageURL;

        // temporary product id
        this.id =  Math.random().toString();
    }


    // push product to json file
    save() {
        getProductFromFile( (products) => {
            products.push(this);  // this -- product element
            // write product array to json file
            fs.writeFile(filePath, JSON.stringify(products), (error) => {
                console.log('write json file error:', error);
            });
        });
    }


    // static ==> return all products from db 
    static fetchAllProducts(callback) {
        getProductFromFile(callback);
    }


    // static ==> return one product detail from db 
    static fetchProductDetail(id, callback) {
        getProductFromFile( (products) => {
            const product = products.find( (p) => p.id === id );            
            callback(product);
        });
    }
}

