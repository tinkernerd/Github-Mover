export default async function handler(req, res) {
    try {
        if (req.method !== 'GET') {
            res.status(405).json({ error: 'Method Not Allowed' });
            return;
        }

        const { repoUrl, githubToken } = req.query;

        if (!repoUrl || !githubToken) {
            res.status(400).json({ error: 'Missing required parameters: repoUrl or githubToken' });
            return;
        }

        // Extract owner and repo from the repoUrl
        const match = /github\\.com\\/(.+?)\\/(.+?)(\\.git|$)/.exec(repoUrl);
        if (!match) {
            throw new Error('Invalid GitHub repository URL');
        }

        const [_, owner, repo] = match;

        console.log(`Extracted owner: ${owner}, repo: ${repo}`);

        // Call GitHub API to fetch repository contents
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
            headers: {
                Authorization: `Bearer ${githubToken}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });

        console.log(`GitHub API responded with status: ${response.status}`);

        if (!response.ok) {
            const errorResponse = await response.text();
            console.error('GitHub API error response:', errorResponse);
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();

        // Filter only directories
        const folders = data
            .filter(item => item.type === 'dir')
            .map(folder => ({ path: folder.path, name: folder.name }));

        console.log('Fetched folders:', folders);

        res.status(200).json({ folders });
    } catch (error) {
        console.error('Error in getFolders handler:', error.message);
        res.status(500).json({ error: error.message });
    }
}
