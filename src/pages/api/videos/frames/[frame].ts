import type { NextApiRequest, NextApiResponse } from 'next';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { filename, frame } = req.query;

    // Validate filename and frame
    if (typeof filename !== 'string' || typeof frame !== 'string') {
        return res.status(400).json({ error: 'Invalid request' });
    }

    const filePath = path.resolve(`${process.env.VIDEO_PATH ?? "C:/Users/ayman/OneDrive - Brunel University London/PhD/NASH Project/code/LeisAIR-ml/data"}/${filename}.mp4`);
    const frameNumber = parseInt(frame); // Assuming frame is the frame number

    console.log('Extracting frame number ' + frameNumber + ' from ' + filePath + '...');

    try {
        const base64Image = await new Promise<string>((resolve, reject) => {
            const buffers: Buffer[] = [];
            const command = ffmpeg(filePath)
                .outputOptions([
                    `-vf select=eq(n\\,${frameNumber})`,
                    `-vframes 1`,
                    `-f image2pipe`,
                    `-vcodec mjpeg`
                ])
                .on('end', function() {
                    console.log('Processing finished !');
                    const buffer = Buffer.concat(buffers);
                    const base64Image = buffer.toString('base64');
                    resolve(base64Image); // Resolve the promise with the base64 string
                })
                .on('error', function(err: Error) {
                    console.log('An error occurred: ' + err.message);
                    reject(err); // Reject the promise if an error occurs
                });

            // Pipe the output directly to a buffer
            const stream = command.pipe();
            stream.on('data', function(chunk: Buffer) {
                buffers.push(chunk);
            });
        });

        console.log('Sending base64 image...');
        res.send("data:image/jpeg;base64,"+base64Image); // Send the base64 string as a response once processing is done
    } catch (err) {
        console.error(err);
        res.status(500).send("Error processing video");
    }
}