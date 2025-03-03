// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme from localStorage
    initTheme();
    
    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', toggleTheme);
    
    // Fetch GitHub stats
    fetchGitHubStats();
    
    // Initialize GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Animate hero section on load
    gsap.from('.hero h1', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.2
    });

    gsap.from('.hero h2', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.4
    });

    gsap.from('.hero p', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.6
    });

    gsap.from('.cta-buttons', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.8
    });

    gsap.from('.hero-graphic', {
        opacity: 0,
        x: 100,
        duration: 1,
        delay: 1
    });

    // Animate project cards on scroll
    gsap.utils.toArray('.project-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "top center",
                scrub: 1
            },
            opacity: 0,
            y: 50
        });
    });

    // Initialize skill progress bars
    document.querySelectorAll('.skill-item').forEach(item => {
        const progress = item.dataset.progress;
        item.style.setProperty('--progress', `${progress}%`);
    });

    // Form submission handling
    document.getElementById('contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your form submission logic here
        alert('Message sent successfully!');
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Intersection Observer for navbar background
    const header = document.querySelector('header');
    const observer = new IntersectionObserver(
        ([entry]) => {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        },
        { threshold: 0.9 }
    );

    observer.observe(document.querySelector('#home'));

    // Theme functions
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            updateThemeIcon(true);
        } else {
            updateThemeIcon(false);
        }
    }
    
    function toggleTheme() {
        const isDarkTheme = document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
        updateThemeIcon(isDarkTheme);
    }
    
    function updateThemeIcon(isDark) {
        const themeToggleIcon = document.querySelector('.theme-toggle-icon');
        if (isDark) {
            themeToggleIcon.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <path d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M2,13h2c0.55,0,1-0.45,1-1s-0.45-1-1-1H2 c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13h2c0.55,0,1-0.45,1-1s-0.45-1-1-1h-2c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2 c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1 S11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0 s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06 c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41 c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36 c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z"/>
                </svg>`;
        } else {
            themeToggleIcon.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <path d="M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36c-0.98,1.37-2.58,2.26-4.4,2.26 c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"/>
                </svg>`;
        }
    }

    // GitHub API integration
    async function fetchGitHubStats() {
        const CACHE_KEY = 'github_stats';
        const CACHE_DURATION = 60 * 60 * 1000; // 1 ora in millisecondi
        const MAX_RETRIES = 3;
        const RETRY_DELAY = 1000; // 1 secondo tra i tentativi

        async function fetchWithRetry(url, retries = MAX_RETRIES) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                if (retries > 0) {
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                    return fetchWithRetry(url, retries - 1);
                }
                throw error;
            }
        }

        try {
            // Check cache first
            const cachedData = localStorage.getItem(CACHE_KEY);
            if (cachedData) {
                const { data, timestamp } = JSON.parse(cachedData);
                const isExpired = Date.now() - timestamp > CACHE_DURATION;
                
                if (!isExpired) {
                    console.log('Using cached GitHub stats');
                    updateGitHubStats(data.userData, data.reposData, data.languagePercentages);
                    document.getElementById('github-stats').style.display = 'block';
                    return;
                }
            }

            const username = 'tasuboyz';
            
            // Fetch user and repos data with retry logic
            const [userData, reposData] = await Promise.all([
                fetchWithRetry(`https://api.github.com/users/${username}`),
                fetchWithRetry(`https://api.github.com/users/${username}/repos?per_page=100`)
            ]).catch(error => {
                throw new Error(`Failed to fetch initial GitHub data: ${error.message}`);
            });

            // Fetch languages with retry logic
            const languagePromises = reposData.map(repo => 
                fetchWithRetry(repo.languages_url)
            );

            const languagesData = await Promise.all(languagePromises).catch(error => {
                throw new Error(`Failed to fetch languages data: ${error.message}`);
            });

            // Process language data
            const { languageStats, totalBytes } = languagesData.reduce((acc, repoLanguages) => {
                Object.entries(repoLanguages).forEach(([language, bytes]) => {
                    acc.languageStats[language] = (acc.languageStats[language] || 0) + bytes;
                    acc.totalBytes += bytes;
                });
                return acc;
            }, { languageStats: {}, totalBytes: 0 });

            const languagePercentages = Object.entries(languageStats)
                .map(([language, bytes]) => ({
                    name: language,
                    percentage: ((bytes / totalBytes) * 100).toFixed(1)
                }))
                .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));

            // Cache the successful response
            const cacheData = {
                timestamp: Date.now(),
                data: { userData, reposData, languagePercentages }
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
            console.log('GitHub stats cached successfully');

            // Update UI
            updateGitHubStats(userData, reposData, languagePercentages);
            document.getElementById('github-stats').style.display = 'block';

        } catch (error) {
            console.error('Error fetching GitHub stats:', error);
            
            // Try to use cached data as fallback
            try {
                const cachedData = localStorage.getItem(CACHE_KEY);
                if (cachedData) {
                    const { data, timestamp } = JSON.parse(cachedData);
                    const cacheAge = Math.round((Date.now() - timestamp) / (1000 * 60)); // in minutes
                    console.log(`Using cached data (${cacheAge} minutes old) due to error`);
                    
                    // Show warning about using cached data
                    const warningDiv = document.createElement('div');
                    warningDiv.className = 'cache-warning';
                    warningDiv.textContent = `Using cached data from ${cacheAge} minutes ago due to connection issues.`;
                    document.getElementById('github-stats').prepend(warningDiv);
                    
                    updateGitHubStats(data.userData, data.reposData, data.languagePercentages);
                    document.getElementById('github-stats').style.display = 'block';
                } else {
                    throw new Error('No cached data available');
                }
            } catch (cacheError) {
                console.error('Cache fallback failed:', cacheError);
                document.getElementById('github-stats').innerHTML = `
                    <div class="error-message">
                        <p>Failed to load GitHub stats. Please check your connection and try again later.</p>
                        <button onclick="window.location.reload()">Retry</button>
                    </div>`;
            }
        }
    }

    // Modifica la funzione updateGitHubStats per includere l'aggiornamento delle skills
    function updateGitHubStats(userData, reposData, languages) {
        const totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);
        const totalForks = reposData.reduce((acc, repo) => acc + repo.forks_count, 0);

        // Update basic stats
        document.getElementById('github-username').textContent = userData.name || userData.login;
        document.getElementById('github-bio').textContent = userData.bio || 'GitHub Developer';
        document.getElementById('github-repos').textContent = userData.public_repos;
        document.getElementById('github-followers').textContent = userData.followers;
        document.getElementById('github-stars').textContent = totalStars;
        document.getElementById('github-forks').textContent = totalForks;

        // Update languages display
        const languagesContainer = document.getElementById('github-languages');
        languagesContainer.innerHTML = '';
        languages.forEach(lang => {
            const span = document.createElement('span');
            span.textContent = `${lang.name} ${lang.percentage}%`;
            span.title = `${lang.name}: ${lang.percentage}%`;
            languagesContainer.appendChild(span);
        });

        // Aggiungi questa riga per aggiornare anche la sezione skills
        updateSkillsSection(languages);
        updateProjectsSection(reposData);
    }

    function updateSkillsSection(languages) {
        const skillsContainer = document.getElementById('dynamic-skills');
        skillsContainer.innerHTML = '';

        // Group languages by type
        const skillGroups = {
            'Frontend': ['JavaScript', 'HTML', 'CSS', 'TypeScript', 'Vue', 'React'],
            'Backend': ['Python', 'Java', 'PHP', 'Ruby', 'Go', 'C#'],
            'Database': ['SQL', 'PostgreSQL', 'MongoDB', 'MySQL'],
            'Other': []
        };

        const categorizedSkills = {};
        
        languages.forEach(lang => {
            let placed = false;
            for (const [category, langs] of Object.entries(skillGroups)) {
                if (langs.includes(lang.name)) {
                    if (!categorizedSkills[category]) categorizedSkills[category] = [];
                    categorizedSkills[category].push(lang);
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                if (!categorizedSkills['Other']) categorizedSkills['Other'] = [];
                categorizedSkills['Other'].push(lang);
            }
        });

        // Create skill categories
        for (const [category, skills] of Object.entries(categorizedSkills)) {
            if (skills.length > 0) {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'skill-category';
                categoryDiv.innerHTML = `
                    <h3>${category}</h3>
                    <div class="skill-list">
                        ${skills.map(skill => `
                            <div class="skill-item" data-progress="${skill.percentage}">
                                ${skill.name}
                            </div>
                        `).join('')}
                    </div>
                `;
                skillsContainer.appendChild(categoryDiv);
            }
        }

        // Initialize progress bars
        document.querySelectorAll('.skill-item').forEach(item => {
            const progress = item.dataset.progress;
            item.style.setProperty('--progress', `${progress}%`);
        });
    }

    function updateProjectsSection(reposData) {
        const projectGrid = document.getElementById('project-grid');
        
        // Sort repositories by stars
        const featuredRepos = reposData
            .filter(repo => !repo.fork && repo.description) // Solo progetti originali con descrizione
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 4); // Prendi i primi 3 progetti

        projectGrid.innerHTML = featuredRepos.map(repo => `
            <div class="project-card">
                <div class="project-image">
                    ${repo.homepage ? `<img src="${repo.homepage}" alt="${repo.name}" onerror="this.style.display='none'">` : ''}
                </div>
                <h3>${repo.name}</h3>
                <p>${repo.description}</p>
                <div class="project-stats">
                    <span>⭐ ${repo.stargazers_count}</span>
                    <span>🔄 ${repo.forks_count}</span>
                </div>
                <div class="tech-stack">
                    ${repo.topics.map(topic => `<span>${topic}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank" class="primary-btn">View Code</a>
                    ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="secondary-btn">Live Demo</a>` : ''}
                </div>
            </div>
        `).join('');
    }
});