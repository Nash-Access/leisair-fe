import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { filename } = req.query;

    if (typeof filename !== 'string') {
        return res.status(400).json({ error: 'Invalid request' });
    }

    const filePath = path.resolve(`C:/Users/ayman/OneDrive - Brunel University London/PhD/NASH Project/code/LeisAIR-ml/data/${filename}.mp4`);

    fs.stat(filePath, (err, stat) => {
        if (err) {
            console.error('Error stating file.', err);
            return res.status(404).json({ error: 'File not found' });
        }

        res.writeHead(200, {
            'Content-Length': stat.size,
            'Content-Type': 'video/mp4',
        });

        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    });
}