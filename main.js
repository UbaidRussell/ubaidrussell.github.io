// Existing menu toggle function
function toggleMenu() {
    const nav = document.getElementById('nav-menu');
    nav.classList.toggle('active');
}

// Function to fetch GitHub repositories and update the project section
async function fetchGitHubProjects() {
    const username = 'UbaidRussell'; // Replace with your GitHub username
    const url = `https://api.github.com/users/${username}/repos`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        const repos = await response.json();

        // Filter repositories (optional: exclude forks, specific repos, etc.)
        const projects = repos.filter(repo => !repo.fork && repo.description); // Example: exclude forks and repos without descriptions

        // Sort by most recently updated (optional)
        projects.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        // Get the project grid element
        const projectGrid = document.getElementById('project-grid');

        // Clear any existing content
        projectGrid.innerHTML = '';

        // Create project cards for each repository
        projects.forEach(repo => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';

            const title = document.createElement('h3');
            title.textContent = repo.name;

            const description = document.createElement('p');
            description.textContent = repo.description || 'No description available.';

            // Optional: Add a link to the repository
            const link = document.createElement('a');
            link.href = repo.html_url;
            link.textContent = 'View on GitHub';
            link.style.color = '#FF6F00';
            link.style.display = 'block';
            link.style.marginTop = '10px';
            link.style.textDecoration = 'none';
            link.onmouseover = () => link.style.textDecoration = 'underline';
            link.onmouseout = () => link.style.textDecoration = 'none';

            projectCard.appendChild(title);
            projectCard.appendChild(description);
            projectCard.appendChild(link);

            projectGrid.appendChild(projectCard);
        });

        // If no projects are found, display a message
        if (projects.length === 0) {
            projectGrid.innerHTML = '<p>No projects found.</p>';
        }
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        document.getElementById('project-grid').innerHTML = '<p>Failed to load projects. Please try again later.</p>';
    }
}

// Run the function when the page loads
document.addEventListener('DOMContentLoaded', fetchGitHubProjects);