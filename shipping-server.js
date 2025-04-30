const mongoose = require('mongoose');
const { startShippingService } = require('./services/shippingService');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/shipping-service', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
    // Start the shipping service
    startShippingService();
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Handle process termination
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
}); 