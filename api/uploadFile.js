const fetch = require('node-fetch');
const { Buffer } = require('buffer');

async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { imageUrl, folder, fileName, githubToken } = req.body;

    if (!imageUrl || !folder || !githubToken) {
        res.status(400).json({ error: 'Missing required parameters: imageUrl, folder, or githubToken' });
        return;
    }

    try {
        // Fetch the image data
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
            throw new Error(`Failed to fetch the image. Status: ${imageResponse.status}`);
        }

        const imageData = await imageResponse.buffer();

        // Generate file path and name
        const finalFileName = fileName || imageUrl.split('/').pop();
        const filePath = `${folder}/${finalFileName}`;

        // Encode file content to Base64
        const contentBase64 = imageData.toString('base64');

        // GitHub API URL for creating/updating a file
        const apiUrl = `https://api.github.com/repos/tinkernerd/media/contents/${filePath}`;

        // Make PUT request to GitHub API
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${githubToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Uploaded ${finalFileName} via GitHub Mover`,
                content: contentBase64,
                committer: {
                    name: 'Your Name',
                    email: 'your-email@example.com',
                },
            }),
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`GitHub API Error: ${errorDetails}`);
        }

        const uploadResult = await response.json();

        res.status(200).json({
            message: 'File uploaded successfully!',
            fileUrl: uploadResult.content.html_url,
        });
    } catch (error) {
        console.error('Error in /api/uploadFile:', error.message);
        res.status(500).json({ error: error.message });
    }
}

module.exports = handler;
