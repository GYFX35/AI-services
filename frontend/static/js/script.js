document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();

    async function fetchProjects() {
        try {
            const response = await fetch('/api/v1/portfolio/projects');
            const projects = await response.json();
            renderProjects(projects);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }

    function renderProjects(projects) {
        const gallery = document.querySelector('.portfolio-gallery');
        gallery.innerHTML = '';
        projects.forEach(project => {
            const item = document.createElement('div');
            item.className = 'portfolio-item';
            item.innerHTML = `
                <img src="${project.image_url}" alt="${project.title}">
                <div class="portfolio-item-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                </div>
            `;
            gallery.appendChild(item);
        });
    }
});
