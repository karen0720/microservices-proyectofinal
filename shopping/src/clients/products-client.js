const { PRODUCTS_SERVICE_URL } = require('../config');

class ProductsClient {
    async GetProduct(productId) {
        try {
            const response = await fetch(
                `${PRODUCTS_SERVICE_URL}/products/${productId}`
            );

            if (!response.ok) {
                throw new Error(`Products service returned ${response.status}`);
            }

            const data = await response.json();

            return data.data || data;
        } catch (error) {
            console.error(
                `Products service unavailable: ${error.message}`
            );

            throw new Error('Products service unavailable');
        }
    }
}

module.exports = ProductsClient;
