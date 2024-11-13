const {pdfToPng} = require('pdf-to-png-converter');

const convertPdfToPngBase64 = async (pdfBuffer) => {
    try {
        const pngPages = await pdfToPng(pdfBuffer, {
            viewportScale: 2.0, // Adjust scale if necessary
            outputFileMask: 'page', // Base name for output files
            pages: [1] // Convert only the first page
        });

        // Convert the first page to base64
        const base64Data = pngPages[0].content.toString('base64');
        console.log('PDF converted to PNG in base64 format.');
        return base64Data;
    } catch (error) {
        console.error('Error converting PDF to PNG:', error);
        throw error;
    }
};

async function convertStreamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];

        readableStream.on('data', (chunk) => {
            // Push raw binary data to chunks array
            chunks.push(chunk);
        });

        readableStream.on('end', () => {
            // Concatenate all chunks into a single Buffer
            const buffer = Buffer.concat(chunks);
            resolve(buffer);
        });

        readableStream.on('error', (err) => {
            reject(err);
        });
    });
};

async function getBase64ForLLM(fileStream, fileType) {
    const buffer = await convertStreamToBuffer(fileStream);
    switch (fileType) {
        case 'image/png':
        case 'image/jpeg':
            return buffer.toString('base64');
        case 'application/pdf':
            return await convertPdfToPngBase64(buffer);
        default:
            return res.status(400).json({ error: 'Unsupported file type.' });
    }
}

function parseJsonContent(content, req) {
    const regex = /```json([\s\S]*?)```/;
    const match = content.match(regex);

    if (match && match[1]) {
        // Parse the JSON string
        const parsedJson = JSON.parse(match[1].trim());
        return parsedJson;  // This will log the parsed JSON object
    } else {
        req.error("No JSON content found in the string.");
    }
}



module.exports = {
    getBase64ForLLM,
    parseJsonContent
}