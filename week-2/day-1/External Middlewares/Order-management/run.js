const { MongoClient } = require('mongodb');
const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);
const sampleOrders = [
  { order_id: 1, customer_name: "John Doe", items: ["Laptop", "Mouse"], total_amount: 65000, order_status: "pending" },
  { order_id: 2, customer_name: "Jane Smith", items: ["Headphones", "Charger"], total_amount: 3000, order_status: "shipped" },
  { order_id: 3, customer_name: "Alice Johnson", items: ["Mobile Phone"], total_amount: 20000, order_status: "delivered" },
  { order_id: 4, customer_name: "Bob Brown", items: ["Tablet", "Keyboard"], total_amount: 15000, order_status: "pending" },
  { order_id: 5, customer_name: "Chris Green", items: ["Smartwatch"], total_amount: 7000, order_status: "shipped" }
];
async function runDemo() {
  try {
    await client.connect();
    const db = client.db('order_management');
    const orders = db.collection('orders');
    await orders.deleteMany({});
    await orders.insertMany(sampleOrders);
    const shippedOrders = await orders.find({ order_status: "shipped" }).toArray();
    console.log("Shipped orders:", shippedOrders);
    await orders.updateOne({ order_id: 1 }, { $set: { total_amount: 70000 }});
    const updated1 = await orders.findOne({ order_id: 1 });
    console.log("Updated order 1:", updated1);
    await orders.deleteOne({ order_id: 4 });
    const alice = await orders.findOne({ customer_name: "Alice Johnson" });
    console.log("Alice Johnson order:", alice);
    await orders.updateOne({ order_id: 2 }, { $set: { order_status: "delivered" }});
    const bigOrders = await orders.find({ total_amount: { $gte: 15000 } }).toArray();
    console.log("Orders with total_amount >= 15000:", bigOrders);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
runDemo();
