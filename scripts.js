document.getElementById('refreshFolders').addEventListener('click', () => {
    const githubUser = document.getElementById('githubUser').value.trim();
    const repoName = document.getElementById('repoName').value.trim();
    const githubToken = document.getElementById('githubKey').value.trim();

    // Validate inputs
    if (!githubUser || !repoName || !githubToken) {
        alert('Please fill out all fields (GitHub Username, Repository Name, and Token).');
        return;
    }

    const repoUrl = `https://github.com/${githubUser}/${repoName}`;

    // Call the API to fetch folders
    fetch(`/api/getFolders?repoUrl=${encodeURIComponent(repoUrl)}&githubToken=${encodeURIComponent(githubToken)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const folderSelect = document.getElementById('folderSelect');
            folderSelect.innerHTML = '<option value="">-- Select a folder --</option>';

            data.folders.forEach(folder => {
                const option = document.createElement('option');
                option.value = folder.path;
                option.textContent = folder.name;
                folderSelect.appendChild(option);
            });
        })
        .catch(err => {
            console.error('Error fetching folders:', err);
            alert('Failed to fetch folders. Please check the repository name, username, and token.');
        });
});
