        document.getElementById('refreshFolders').addEventListener('click', () => {
            const repoUrl = document.getElementById('repoUrl').value;
            if (!repoUrl) {
                alert('Please enter a GitHub repository URL first.');
                return;
            }

            // Call API to fetch folder structure from GitHub repo
            fetch(`/api/getFolders?repoUrl=${encodeURIComponent(repoUrl)}`)
                .then(response => response.json())
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
                    alert('Failed to fetch folders. Please check the repository URL.');
                });
        });

        document.getElementById('uploadFile').addEventListener('click', () => {
            const imageUrl = document.getElementById('imageUrl').value;
            const repoUrl = document.getElementById('repoUrl').value;
            const folder = document.getElementById('folderSelect').value;
            const fileName = document.getElementById('fileName').value;
            const githubKey = document.getElementById('githubKey').value;

            if (!imageUrl || !repoUrl || !folder || !githubKey) {
                alert('Please fill out all required fields.');
                return;
            }

            const payload = {
                imageUrl,
                repoUrl,
                folder,
                fileName,
                githubKey
            };

            fetch('/api/uploadFile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(response => {
                    if (response.ok) {
                        alert('File uploaded and committed successfully!');
                    } else {
                        alert('Failed to upload file. Please check your input and try again.');
                    }
                })
                .catch(err => {
                    console.error('Error uploading file:', err);
                    alert('An error occurred. Please try again.');
                });
        });