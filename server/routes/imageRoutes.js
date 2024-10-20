import express from 'express';
const router = express.Router();
import { MongoClient, GridFSBucket, ObjectId} from 'mongodb';

const url = process.env.DATABASE_URL;
const dbName = 'Anisa';

const client = new MongoClient(url);
const bucket = new GridFSBucket(client.db(dbName));


router.get('/images/:fileId', async (req, res) => {
    const { fileId } = req.params;

    try {
        const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
        downloadStream.on('data', (chunk) => res.write(chunk));
        downloadStream.on('end', () => res.end());
        downloadStream.on('error', (error) => {
            console.error('Error downloading file:', error);
            res.status(404).send('File not found');
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
