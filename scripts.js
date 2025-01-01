document.getElementById('refreshFolders').addEventListener('click', () => {
    const githubUser = document.getElementById('githubUser').value.trim();
    const repoName = document.getElementById('repoName').value.trim();
    const githubToken = document.getElementById('githubKey').value.trim();

    if (!githubUser || !repoName || !githubToken) {
        alert('Please fill out all fields (GitHub Username, Repository Name, and Token).');
        return;
    }

    const repoUrl = `https://github.com/${githubUser}/${repoName}`;

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

document.getElementById('uploadFile').addEventListener('click', () => {
    const folder = document.getElementById('folderSelect').value;
    const fileName = document.getElementById('fileName').value.trim();
    const githubToken = document.getElementById('githubKey').value.trim();

    if (!folder || !githubToken) {
        alert('Please select a folder and provide a GitHub token.');
        return;
    }

    const payload = {
        folder,
        fileName,
        githubToken,
    };

    fetch('/api/uploadFile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert('File uploaded successfully!');
        })
        .catch(err => {
            console.error('Error uploading file:', err);
            alert('Failed to upload file. Please try again.');
        });
});
