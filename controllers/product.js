// controllers/productController.js
const Product = require('./../models/product');
const scraper = require('./../scraper');
const cron = require('node-cron');

class ProductController {

    constructor() {
        // Schedule the update task to run every minute (can be changed)
        cron.schedule('* * * * *', async () => {
            console.log('Automatic update task started...');
            await this.updateProductsTask();
            console.log('Automatic update task completed...');
        });
    }


    async updateProductsTask() {
        try {
            // Fetch all distinct user emails from the products
            const distinctUserEmails = await Product.distinct('email');

            // Iterate over each user's products and update them
            await Promise.all(distinctUserEmails.map(async (email) => {
                // Fetch all products for the given user email from the database
                const userProducts = await Product.find({
                    email
                }).lean();

                // Perform scraping for each product
                const updatedProducts = await Promise.all(userProducts.map(async (product) => {
                    
                    const newProduct = await scraper.doRequest(product.link, product.price, product.original_price, product.discount);

                    // Update the product in the database with new information
                    const updatedProduct = await Product.findOneAndUpdate(
                        product._id, {
                            name: newProduct.nombreProducto,
                            price: Number(newProduct.precio),
                            discount: newProduct.descuento,
                            original_price: newProduct.precioAnterior,
                            link: newProduct.link,
                            image: newProduct.linkImg,
                            // Include any other fields you want to update
                        }, {
                            new: true,
                            lean: true
                        } // Return the updated document as a plain object
                    );

                    // Return only the updated product data
                    return updatedProduct;
                }));

            }));

            console.log('Automatic update task completed successfully.');
        } catch (error) {
            console.error('Error in automatic update task:', error);
        }
    }


    async create(req, res) {

        try {
            const {
                link
            } = req.body;

            const newProduct = await scraper.doRequest(link, 0, 0);

            // Use the scraped data to create a new product in the database
            await Product.create({
                name: newProduct.nombreProducto,
                price: Number(newProduct.precio),
                discount: newProduct.descuento,
                original_price: newProduct.precio,
                link: newProduct.link,
                image: newProduct.linkImg,
                email: req.body.user ?.email || 'default@example.com',
            });

            res.status(201).send({
                message: 'Product created successfully'
            });
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).send({
                error: 'Internal Server Error'
            });
        }
    }
}


module.exports = new ProductController();