const { Kafka } = require('kafkajs');
const Shipping = require('../models/shipping');
const { v4: uuidv4 } = require('uuid');

const kafka = new Kafka({
    clientId: 'shipping-service',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'shipping-group' });

const generateTrackingId = () => {
    const uniqueId = uuidv4().slice(0, 8).toUpperCase();
    return `SHIP-${uniqueId}`;
};

const startShippingService = async () => {
    try {
        await consumer.connect();
        await consumer.subscribe({ topic: 'order-confirmed', fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const orderData = JSON.parse(message.value.toString());
                    
                    // Create shipping record
                    const shippingRecord = new Shipping({
                        itemId: orderData.itemId,
                        itemName: orderData.itemName,
                        quantity: orderData.quantity,
                        trackingId: generateTrackingId(),
                        status: 'pending'
                    });

                    await shippingRecord.save();
                    console.log('Shipping record created:', shippingRecord);
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            },
        });
    } catch (error) {
        console.error('Error in shipping service:', error);
    }
};

module.exports = { startShippingService }; 