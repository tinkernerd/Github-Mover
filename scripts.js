document.getElementById('refreshFolders').addEventListener('click', () => {
    const githubUser = document.getElementById('githubUser').value.trim();
    const repoName = document.getElementById('repoName').value.trim();
    const githubToken = document.getElementById('githubKey').value.trim();

    const status = document.getElementById('status');
    status.textContent = 'Refreshing folder list...';

    // Validate inputs
    if (!githubUser || !repoName || !githubToken) {
        status.textContent = 'Please fill out all fields (GitHub Username, Repository Name, and Token).';
        alert('Please fill out all fields (GitHub Username, Repository Name, and Token).');
        return;
    }

    const repoUrl = `https://github.com/${githubUser}/${repoName}`;
    console.log('Fetching folders for:', repoUrl);

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

            status.textContent = 'Folders refreshed successfully.';
            console.log('Folders:', data.folders);
        })
        .catch(err => {
            console.error('Error fetching folders:', err);
            status.textContent = 'Failed to refresh folders. Check the logs for more information.';
            alert('Failed to fetch folders. Please check the repository name, username, and token.');
        });
});

document.getElementById('uploadFile').addEventListener('click', () => {
    const imageUrl = document.getElementById('imageUrl').value.trim();
    const folder = document.getElementById('folderSelect').value;
    const fileName = document.getElementById('fileName').value.trim();
    const githubToken = document.getElementById('githubKey').value.trim();

    const status = document.getElementById('status');
    status.textContent = 'Starting file upload...';

    if (!imageUrl || !folder || !githubToken) {
        status.textContent = 'Please provide the image URL, select a folder, and provide the GitHub token.';
        alert('Please provide the image URL, select a folder, and provide the GitHub token.');
        return;
    }

    const payload = {
        imageUrl,
        folder,
        fileName,
        githubToken,
    };

    console.log('Uploading file with payload:', payload);

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
            status.textContent = 'File uploaded successfully!';
            console.log('Upload response:', data);
            alert('File uploaded successfully!');
        })
        .catch(err => {
            console.error('Error uploading file:', err);
            status.textContent = 'Failed to upload file. Check the logs for more information.';
            alert('Failed to upload file. Please try again.');
        });
});
