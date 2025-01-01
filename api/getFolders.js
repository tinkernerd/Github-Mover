const fetch = require('node-fetch');

async function handler(req, res) {
    try {
        if (req.method !== 'GET') {
            res.status(405).json({ error: 'Method Not Allowed' });
            return;
        }

        const { repoUrl, githubToken } = req.query;

        // Validate required parameters
        if (!repoUrl || !githubToken) {
            res.status(400).json({ error: 'Missing required parameters: repoUrl or githubToken' });
            return;
        }

        // Extract owner and repo from the URL
        const match = /github\.com\/(.+?)\/(.+?)(\.git|$)/.exec(repoUrl);
        if (!match) {
            throw new Error('Invalid GitHub repository URL');
        }

        const [_, owner, repo] = match;

        console.log(`Owner: ${owner}, Repo: ${repo}`); // Debugging log

        // Call GitHub API
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/`;
        const response = await fetch(apiUrl, {
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${githubToken}`,
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });

        console.log(`GitHub API Response Status: ${response.status}`); // Debugging log

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error('GitHub API Error:', errorDetails); // Log GitHub API error
            throw new Error(`GitHub API returned status ${response.status}`);
        }

        const data = await response.json();

        // Filter for directories
        const folders = data
            .filter(item => item.type === 'dir')
            .map(folder => ({ path: folder.path, name: folder.name }));

        console.log('Fetched Folders:', folders); // Debugging log

        res.status(200).json({ folders });
    } catch (error) {
        console.error('Error in /api/getFolders:', error.message); // Log the error
        res.status(500).json({ error: error.message });
    }
}

module.exports = handler;
