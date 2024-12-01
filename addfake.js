const faker = require('faker');
const cassandra = require('cassandra-driver');

// Configure Cassandra client
const client = new cassandra.Client({
    contactPoints: ['127.0.0.1:9043'], // Update based on Docker network or '127.0.0.1:9042' if forwarded
    localDataCenter: 'datacenter1',    // Ensure this matches your Cassandra configuration
    keyspace: 'ecommerce_keyspace'     // Replace with your keyspace name
});

async function addFakeProducts() {
    try {
        // Generate and insert 10 fake products
        const queries = [];
        for (let i = 0; i < 10; i++) {
            const productid = faker.datatype.uuid(); // Primary key
            const sellerid = faker.datatype.uuid(); // Random seller ID
            const name = faker.commerce.productName(); // Product name
            const description = faker.commerce.productDescription(); // Product description
            const price = parseFloat(faker.commerce.price()); // Product price
            const category = faker.commerce.department(); // Product category
            const stocklevel = faker.datatype.number({ min: 0, max: 100 }); // Random stock level

            // Prepare the query
            const query = `
                INSERT INTO products (productid, sellerid, name, description, price, category, stocklevel)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const params = [productid, sellerid, name, description, price, category, stocklevel];

            // Add query to batch
            queries.push({ query, params });
        }

        // Execute batch query
        await client.batch(queries, { prepare: true });
        console.log('Successfully added 10 fake products!');
    } catch (error) {
        console.error('Error inserting fake products:', error);
    } finally {
        await client.shutdown();
    }
}

// Run the function
addFakeProducts();
