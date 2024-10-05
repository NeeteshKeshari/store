import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('stockManagement');
  const collection = db.collection('raw-materials');

  if (req.method === 'POST') {
    const { name, totalQuantity, stockDate, addedQuantity, addDate, removedQuantity, removeDate } = req.body;
    const remainingQuantity = totalQuantity + addedQuantity - removedQuantity;
    const newMaterial = {
      name,
      totalQuantity,
      stockDate,
      addedQuantity,
      addDate,
      removedQuantity,
      removeDate,
      remainingQuantity,
    };
    const result = await collection.insertOne(newMaterial);
    res.status(201).json({ message: 'Raw material added', data: result });
  } else if (req.method === 'GET') {
    const materials = await collection.find({}).toArray();
    res.status(200).json({ data: materials });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export async function GET(req) {
    try {
      const client = await clientPromise;
      const db = client.db('stockManagement');
      const collection = db.collection('raw-materials');
      
      const rawMaterials = await collection.find({}).toArray();
      return new Response(JSON.stringify(rawMaterials), {
        status: 200,
      });
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Something went wrong' }), {
        status: 500,
      });
    }
}
