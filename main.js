// Existing menu toggle function
function toggleMenu() {
    const nav = document.getElementById('nav-menu');
    nav.classList.toggle('active');
}

// Function to fetch GitHub repositories and update the project section
async function fetchGitHubProjects() {
    const username = 'UbaidRussell'; // Replace with your GitHub username
    const url = `https://api.github.com/users/${username}/repos?per_page=100`; // Fetch up to 100 repos per page

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        const repos = await response.json();

        // Filter repositories (exclude forks)
        const projects = repos.filter(repo => !repo.fork);

        // Sort by creation date (most recent first, descending order)
        projects.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // Log the sorted projects for debugging
        console.log(projects.map(repo => ({ name: repo.name, created_at: repo.created_at })));

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

            // Add a link to the repository that opens in a new tab
            const link = document.createElement('a');
            link.href = repo.html_url;
            link.textContent = 'View on GitHub';
            link.target = '_blank'; // Open in a new tab
            link.rel = 'noopener noreferrer'; // Security best practice
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