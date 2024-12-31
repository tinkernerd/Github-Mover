document.getElementById('refreshFolders').addEventListener('click', () => {
    const repoUrl = document.getElementById('repoUrl').value;
    const githubToken = document.getElementById('githubKey').value;

    if (!repoUrl || !githubToken) {
        alert('Please enter both the GitHub repository URL and the token.');
        return;
    }

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
            alert('Failed to fetch folders. Please check the repository URL or token.');
        });
});
