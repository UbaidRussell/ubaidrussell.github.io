// Existing menu toggle function
function toggleMenu() {
    const nav = document.getElementById('nav-menu');
    nav.classList.toggle('active');
}

// Global variables to store projects and display state
let allProjects = [];
let showAll = false;
const initialLimit = 3; // Number of projects to show initially (approximates one row on desktop)

// Function to render projects based on the current display state
function renderProjects() {
    const projectGrid = document.getElementById('project-grid');
    const viewToggleBtn = document.getElementById('view-toggle-btn');

    // Clear existing content
    projectGrid.innerHTML = '';

    // Determine how many projects to show
    const projectsToShow = showAll ? allProjects : allProjects.slice(0, initialLimit);

    // Create project cards for the selected projects
    projectsToShow.forEach(repo => {
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

    // Update the button text based on the display state
    viewToggleBtn.textContent = showAll ? 'View Less' : 'View More';

    // Hide the button if there are fewer projects than the initial limit
    viewToggleBtn.style.display = allProjects.length <= initialLimit ? 'none' : 'inline-block';
}

// Function to toggle between showing more or fewer projects
function toggleProjects() {
    showAll = !showAll;
    renderProjects();
}

// Function to fetch GitHub repositories and initialize the project section
async function fetchGitHubProjects() {
    const username = 'UbaidRussell'; // Your GitHub username
    const url = `https://api.github.com/users/${username}/repos?per_page=100`; // Fetch up to 100 repos per page

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        const repos = await response.json();

        // Filter repositories (exclude forks)
        allProjects = repos.filter(repo => !repo.fork);

        // Sort by creation date (most recent first, descending order)
        allProjects.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // Log the sorted projects for debugging
        console.log(allProjects.map(repo => ({ 
            name: repo.name, 
            created_at: repo.created_at 
        })));

        // Render the initial set of projects
        renderProjects();

        // If no projects are found, display a message
        if (allProjects.length === 0) {
            document.getElementById('project-grid').innerHTML = '<p>No projects found.</p>';
            document.getElementById('view-toggle-btn').style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        document.getElementById('project-grid').innerHTML = '<p>Failed to load projects. Please try again later.</p>';
        document.getElementById('view-toggle-btn').style.display = 'none';
    }
}



// Run the function when the page loads
document.addEventListener('DOMContentLoaded', fetchGitHubProjects);