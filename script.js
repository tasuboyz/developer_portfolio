// Import the PDF Generator module
import PDFGenerator from './js/pdfGenerator.js';

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

    // Animate hero section on load - modify to prevent layout issues
    gsap.from('.hero h1', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.2,
        clearProps: "all" // Important: clear props after animation
    });

    gsap.from('.hero h2', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.4,
        clearProps: "all" // Important: clear props after animation
    });

    gsap.from('.hero p', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.6,
        clearProps: "all" // Important: clear props after animation
    });

    gsap.from('.cta-buttons', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.8,
        clearProps: "all" // Important: clear props after animation
    });

    gsap.from('.hero-graphic', {
        opacity: 0,
        x: 50,
        duration: 0.8,
        delay: 1,
        clearProps: "all" // Important: clear props after animation
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

    // Initialize curriculum
    if (document.getElementById('curriculum')) {
        initCurriculum();
    }

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

            const username = document.querySelector('meta[name="github-username"]')?.content || 'tasuboyz';
            
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

            // Sincronizza con i dati del CV se disponibili
            syncGitHubWithCV(userData, languagePercentages);

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

    // Funzione per sincronizzare i dati GitHub con il CV
    function syncGitHubWithCV(userData, languages) {
        // Controlla se il CV è già stato caricato
        const cvContainer = document.getElementById('cv-container');
        if (cvContainer && !cvContainer.querySelector('.cv-loading')) {
            // Il CV è già caricato, aggiorniamo solo le informazioni di contatto GitHub
            const githubLink = cvContainer.querySelector('a[href*="github.com"]');
            if (githubLink) {
                githubLink.textContent = `github.com/${userData.login}`;
                githubLink.href = userData.html_url;
            }
            
            // Aggiorna anche l'immagine del profilo se disponibile
            const profilePic = document.querySelector('.profile-picture');
            if (profilePic && userData.avatar_url) {
                profilePic.src = userData.avatar_url;
            }
        }
    }

    // Modifica la funzione updateGitHubStats per includere l'aggiornamento delle skills
    function updateGitHubStats(userData, reposData, languages) {
        const totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);
        const totalForks = reposData.reduce((acc, repo) => acc + repo.forks_count, 0);

        // Update basic stats with real numbers
        document.getElementById('github-username').textContent = userData.name || userData.login;
        document.getElementById('github-bio').textContent = userData.bio || 'Developer';
        document.getElementById('github-repos').textContent = userData.public_repos;
        document.getElementById('github-followers').textContent = userData.followers;
        document.getElementById('github-stars').textContent = totalStars;
        document.getElementById('github-forks').textContent = totalForks;

        // Update languages display with actual percentages
        const languagesContainer = document.getElementById('github-languages');
        languagesContainer.innerHTML = '';
        languages.forEach(lang => {
            const span = document.createElement('span');
            span.textContent = `${lang.name} ${lang.percentage}%`;
            span.title = `${lang.name}: ${lang.percentage}%`;
            languagesContainer.appendChild(span);
        });

        // Update skills section with actual language data
        updateSkillsSection(languages);
        updateProjectsSection(reposData);
        
        // Store the language data for CV integration
        window.githubLanguages = languages;
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

    // Curriculum functionality
    async function initCurriculum() {
        try {
            // Mostra un indicatore di caricamento più elegante
            document.getElementById('cv-container').innerHTML = `
                <div class="cv-loading">
                    <div class="loading-spinner"></div>
                    <p>Caricamento curriculum...</p>
                </div>
            `;
            
            const response = await fetch('data/cv.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const cvData = await response.json();
            
            // Integra i dati GitHub se disponibili
            if (window.githubLanguages) {
                integrateGitHubData(cvData, window.githubLanguages);
            }
            
            renderCurriculum(cvData);

            // Language toggle functionality
            document.querySelectorAll('.cv-lang-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.cv-lang-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Implementazione futura: Traduci il CV in base alla lingua selezionata
                    // Per ora, solo il bottone cambia stato
                    const lang = btn.dataset.lang;
                    console.log(`Curriculum language changed to: ${lang}`);
                    
                    // Simulare una traduzione per scopi dimostrativi
                    if (lang === 'en') {
                        document.querySelectorAll('.job-title').forEach(el => {
                            if (el.textContent === 'Tecnico Sistemista Informatico') 
                                el.textContent = 'IT Systems Specialist';
                            if (el.textContent === 'Tecnico IT - Apprendista') 
                                el.textContent = 'IT Technician - Apprentice';
                            if (el.textContent === 'Stagista Programmazione PLC') 
                                el.textContent = 'PLC Programming Intern';
                            if (el.textContent === 'Aiuto compiti') 
                                el.textContent = 'Tutor';
                        });
                    } else {
                        renderCurriculum(cvData); // Re-render in italiano
                    }
                });
            });

            // Download CV button with actual PDF generation
            document.getElementById('download-cv').addEventListener('click', () => {
                generatePDF(cvData);
            });

            // Animation for timeline items
            const timelineItems = document.querySelectorAll('.timeline-item');
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                    }
                });
            }, { threshold: 0.2 });

            timelineItems.forEach(item => {
                observer.observe(item);
            });

            // Animation for skill bars
            const skillBars = document.querySelectorAll('.skill-bar');
            const skillObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                    }
                });
            }, { threshold: 0.2 });

            skillBars.forEach(bar => {
                skillObserver.observe(bar);
            });

        } catch (error) {
            console.error('Error loading curriculum data:', error);
            document.getElementById('cv-container').innerHTML = `
                <div class="error-message">
                    <p>Errore nel caricamento del curriculum. ${error.message}</p>
                    <button onclick="window.location.reload()">Riprova</button>
                </div>
            `;
        }
    }

    // Integra i dati GitHub nel CV
    function integrateGitHubData(cvData, languages) {
        // Aggiorna le skills di programmazione basandosi sui dati GitHub
        const programmingSkills = {
            advanced: [],
            intermediate: [],
            basic: []
        };
        
        // Classifica le competenze basandosi sulle percentuali reali di utilizzo su GitHub
        languages.forEach(lang => {
            const percentage = parseFloat(lang.percentage);
            if (percentage >= 20) {
                programmingSkills.advanced.push(lang.name);
            } else if (percentage >= 5) {
                programmingSkills.intermediate.push(lang.name);
            } else {
                programmingSkills.basic.push(lang.name);
            }
        });
        
        // Mantieni le competenze esistenti che non sono nelle linguaggi GitHub
        const existingSkills = cvData.skills.programming;
        
        // Unisci mantenendo l'ordine originale ma integrando nuovi linguaggi
        ['advanced', 'intermediate', 'basic'].forEach(level => {
            const newSkills = programmingSkills[level].filter(
                skill => !existingSkills.advanced.includes(skill) && 
                      !existingSkills.intermediate.includes(skill) &&
                      !existingSkills.basic.includes(skill)
            );
            
            // Aggiungi nuovi linguaggi al livello appropriato
            if (newSkills.length > 0) {
                cvData.skills.programming[level] = [...existingSkills[level], ...newSkills];
            }
        });
        
        return cvData;
    }

    // Generate PDF from CV data
    function generatePDF(cvData) {
        PDFGenerator.openDownloadModal(cvData);
    }

    function renderCurriculum(data) {
        const container = document.getElementById('cv-container');
        if (!container) return;

        // Build HTML content
        let html = `
            <div class="cv-header">
                <div class="cv-header-content">
                    <h1>${data.basics.name}</h1>
                    <p class="tagline">${data.basics.tagline}</p>
                </div>
                <div class="profile-picture-container">
                    <img src="https://avatars.githubusercontent.com/${data.basics.profiles.github}" alt="${data.basics.name}" class="profile-picture">
                </div>
            </div>
            
            <div class="contact-details">
                <div class="contact-item">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    <span>${data.basics.email}</span>
                </div>
                <div class="contact-item">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
                    </svg>
                    <span>${data.basics.phone.mobile} (mobile)</span>
                </div>
                <div class="contact-item">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"/>
                    </svg>
                    <a href="https://github.com/${data.basics.profiles.github}" target="_blank">github.com/${data.basics.profiles.github}</a>
                </div>
                <div class="contact-item">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M9.78,18.65L10.06,14.42L17.74,7.5C18.08,7.19 17.67,7.04 17.22,7.31L7.74,13.3L3.64,12C2.76,11.75 2.75,11.14 3.84,10.7L19.81,4.54C20.54,4.21 21.24,4.72 20.96,5.84L18.24,18.65C18.05,19.56 17.5,19.78 16.74,19.36L12.6,16.3L10.61,18.23C10.38,18.46 10.19,18.65 9.78,18.65Z"/>
                    </svg>
                    <a href="https://t.me/${data.basics.profiles.telegram}" target="_blank">t.me/${data.basics.profiles.telegram}</a>
                </div>
            </div>

            <div class="cv-section">
                <h3>Esperienze Professionali</h3>
                <div class="timeline">
        `;

        // Add work experiences to timeline
        data.work.forEach((job, index) => {
            const isLeft = index % 2 === 0;
            html += `
                <div class="timeline-item ${isLeft ? 'timeline-item-left' : 'timeline-item-right'}">
                    <div class="timeline-content">
                        <h3>${job.company}</h3>
                        <h4 class="job-title">${job.position}</h4>
                        ${job.duration ? `<p><em>${job.duration}</em></p>` : ''}
                        <ul>
                            ${job.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>

            <div class="cv-section">
                <h3>Formazione</h3>
                <div class="education-container">
        `;

        // Add education
        data.education.forEach(edu => {
            html += `
                <div class="education-item">
                    <h4>${edu.degree}</h4>
                    <p>${edu.institution}</p>
                </div>
            `;
        });

        html += `
                </div>
            </div>

            <div class="cv-section">
                <h3>Competenze Tecniche</h3>
                <div class="skills-grid">
        `;

        // Programming skills with dynamic level bars based on actual proficiency
        html += `
            <div class="skill-category">
                <h3>Programmazione</h3>
        `;
        
        // Advanced skills - using actual data
        data.skills.programming.advanced.forEach(skill => {
            // Cerca la corrispondenza nei dati GitHub
            const gitHubLang = window.githubLanguages?.find(lang => lang.name === skill);
            const percentage = gitHubLang ? parseFloat(gitHubLang.percentage) : 90;
            
            html += `
                <div class="skill-item">
                    <div class="skill-name">${skill}</div>
                    <div class="skill-bar" style="--skill-level: ${Math.min(percentage * 1.5, 95)}%"></div>
                </div>
            `;
        });
        
        // Intermediate skills - using actual data
        data.skills.programming.intermediate.forEach(skill => {
            const gitHubLang = window.githubLanguages?.find(lang => lang.name === skill);
            const percentage = gitHubLang ? parseFloat(gitHubLang.percentage) : 60;
            
            html += `
                <div class="skill-item">
                    <div class="skill-name">${skill}</div>
                    <div class="skill-bar" style="--skill-level: ${Math.min(percentage * 2, 75)}%"></div>
                </div>
            `;
        });
        
        // Basic skills - using actual data
        data.skills.programming.basic.forEach(skill => {
            const gitHubLang = window.githubLanguages?.find(lang => lang.name === skill);
            const percentage = gitHubLang ? parseFloat(gitHubLang.percentage) : 30;
            
            html += `
                <div class="skill-item">
                    <div class="skill-name">${skill}</div>
                    <div class="skill-bar" style="--skill-level: ${Math.min(percentage * 3, 50)}%"></div>
                </div>
            `;
        });
        
        html += `
            </div>
            
            <div class="skill-category">
                <h3>Automazione Industriale</h3>
        `;
        
        data.skills.industrialAutomation.forEach(skill => {
            html += `
                <div class="skill-item">
                    <div class="skill-name">${skill}</div>
                    <div class="skill-bar" style="--skill-level: 75%"></div>
                </div>
            `;
        });
        
        html += `
            </div>
            
            <div class="skill-category">
                <h3>Sistemi Operativi</h3>
                <div class="skill-item">
                    <div class="skill-name">Windows - ${data.skills.systems.windows}</div>
                    <div class="skill-bar" style="--skill-level: 85%"></div>
                </div>
                <div class="skill-item">
                    <div class="skill-name">Linux - ${data.skills.systems.linux}</div>
                    <div class="skill-bar" style="--skill-level: 70%"></div>
                </div>
            </div>
        `;
        
        html += `
            </div>
            
            <div class="cv-section">
                <h3>Lingue</h3>
                <div class="languages-grid">
        `;
        
        // Languages
        data.languages.forEach(lang => {
            html += `
                <div class="language-card">
                    <h4>${lang.language}</h4>
                    <p>${lang.level}</p>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
            
            <div class="cv-section">
                <h3>Altre Informazioni</h3>
                <p><strong>Patente di guida:</strong> ${data.other.drivingLicense}</p>
                <ul class="hobbies-list">
                    ${data.other.hobbies.map(hobby => `<li>${hobby}</li>`).join('')}
                </ul>
                <p><strong>Qualità personali:</strong> ${data.other.qualities.join(', ')}</p>
            </div>
        `;
        
        container.innerHTML = html;
    }
});