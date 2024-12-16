import './global-addon'
import { Chat, YTCore } from './service';
import fs from 'fs';

Main()
async function Main() {


    const stream = YTCore("https://www.youtube.com/watch?v=irMD1KMIYE4", { filter: (x) => x.container === "mp4" })

    const writableStream = fs.createWriteStream(`stream.mp4`);



    // Pipe the readable stream into the writable stream
    stream.pipe(writableStream);

    stream.on('finish', () => console.log(`Stream saved`));

    stream.on('error', (err) => {
        console.error('Error saving stream:', err);
    });
}