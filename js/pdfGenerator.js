/**
 * PDF Generator Module
 * Handles all PDF generation functionality for the portfolio
 */

const PDFGenerator = (function() {
    
    // Dimensioni pagina e margini
    const PAGE_CONFIG = {
        width: 595,     // A4 width in points (72dpi)
        height: 842,    // A4 height
        margin: {
            top: 50,
            right: 40,
            bottom: 50,
            left: 40
        },
        columns: {
            left: {
                width: 180,    // Larghezza colonna sinistra
                x: 40          // Posizione x colonna sinistra
            },
            right: {
                width: 335,    // Larghezza colonna destra
                x: 240         // Posizione x colonna destra
            }
        }
    };
    
    // Stili principali
    const STYLES = {
        fonts: {
            title: { size: 24, family: 'Helvetica', style: 'bold' },
            heading: { size: 18, family: 'Helvetica', style: 'bold' },
            subheading: { size: 14, family: 'Helvetica', style: 'bold' },
            normal: { size: 12, family: 'Helvetica', style: 'normal' },
            small: { size: 10, family: 'Helvetica', style: 'normal' }
        },
        colors: {
            primary: '#2c3e50',    // Blu scuro
            secondary: '#3498db',  // Azzurro
            accent: '#e74c3c',     // Rosso
            text: '#333333',       // Nero testo
            lightText: '#7f8c8d',  // Grigio chiaro
            background: '#ecf0f1', // Grigio chiarissimo per sfondi
            highlight: '#f1c40f'   // Giallo per evidenziare
        },
        spacing: {
            paragraph: 12,
            section: 30,
            list: 8
        },
        elements: {
            headerHeight: 120,     // Altezza dell'intestazione
            sectionRadius: 5,      // Raggio degli angoli delle sezioni
            skillBarHeight: 10,    // Altezza delle barre delle competenze
            lineWidth: 1           // Spessore delle linee separatrici
        }
    };

    /**
     * Genera un PDF basato sui dati del curriculum
     * @param {Object} cvData - Dati del curriculum in formato JSON
     * @returns {Promise} - Promise che si risolve con il blob del PDF
     */
    function generateCV(cvData) {
        return new Promise((resolve) => {
            // Simula il tempo di generazione del PDF
            setTimeout(() => {
                const pdfContent = generatePDFContent(cvData);
                const blob = new Blob([pdfContent], { type: 'application/pdf' });
                resolve(blob);
            }, 1000);
        });
    }

    /**
     * Crea il contenuto del PDF simulato
     * @private
     * @param {Object} cvData - Dati del curriculum in formato JSON
     * @returns {String} - Contenuto del PDF simulato
     */
    function generatePDFContent(cvData) {
        // Costruisci le sezioni del PDF
        const sections = buildPDFSections(cvData);
        
        // Data corrente per il footer
        const currentDate = new Date().toLocaleDateString('it-IT');
        
        // Simula la generazione di un PDF con stream che contiene tutte le sezioni
        return `%PDF-1.7
%CV generated for ${cvData.basics.name}
1 0 obj
<</Type/Catalog/Pages 2 0 R>>
endobj
2 0 obj
<</Type/Pages/Kids[3 0 R]/Count 1>>
endobj
3 0 obj
<</Type/Page/Parent 2 0 R/MediaBox[0 0 ${PAGE_CONFIG.width} ${PAGE_CONFIG.height}]/Contents 4 0 R/Resources 5 0 R>>
endobj
4 0 obj
<</Length 8000>>
stream
% Disegno intestazione colorata
q
${STYLES.colors.primary.replace('#', '')} rg
0 ${PAGE_CONFIG.height - PAGE_CONFIG.margin.top + 20} ${PAGE_CONFIG.width} ${STYLES.elements.headerHeight} re
f
Q

% Disegno colonna sinistra con sfondo
q
${STYLES.colors.background.replace('#', '')} rg
${PAGE_CONFIG.columns.left.x - 10} 0 ${PAGE_CONFIG.columns.left.width + 20} ${PAGE_CONFIG.height - STYLES.elements.headerHeight} re
f
Q

% Linea verticale divisoria
q
${STYLES.colors.secondary.replace('#', '')} RG
${STYLES.elements.lineWidth} w
${PAGE_CONFIG.columns.left.x + PAGE_CONFIG.columns.left.width + 10} ${STYLES.elements.headerHeight} m
${PAGE_CONFIG.columns.left.x + PAGE_CONFIG.columns.left.width + 10} ${PAGE_CONFIG.height - PAGE_CONFIG.margin.bottom} l
S
Q

BT
% Nome e professione nell'intestazione
/F1 ${STYLES.fonts.title.size} Tf
1 1 1 rg % Testo bianco per l'intestazione
${PAGE_CONFIG.margin.left + 10} ${PAGE_CONFIG.height - PAGE_CONFIG.margin.top - 10} Td
(${cvData.basics.name.toUpperCase()}) Tj
/F2 ${STYLES.fonts.subheading.size} Tf
0 -30 Td
(${cvData.basics.tagline}) Tj
ET

% Sezioni del CV nella colonna sinistra
BT
${STYLES.colors.primary.replace('#', '')} rg
/F1 ${STYLES.fonts.subheading.size} Tf
${PAGE_CONFIG.columns.left.x} ${PAGE_CONFIG.height - STYLES.elements.headerHeight - 40} Td
${sections.contact}

${STYLES.colors.primary.replace('#', '')} rg
/F1 ${STYLES.fonts.subheading.size} Tf
${PAGE_CONFIG.columns.left.x} ${PAGE_CONFIG.height - STYLES.elements.headerHeight - 200} Td
${sections.personalInfo}

${STYLES.colors.primary.replace('#', '')} rg
/F1 ${STYLES.fonts.subheading.size} Tf
${PAGE_CONFIG.columns.left.x} ${PAGE_CONFIG.height - STYLES.elements.headerHeight - 300} Td
${sections.skills}

${STYLES.colors.primary.replace('#', '')} rg
/F1 ${STYLES.fonts.subheading.size} Tf
${PAGE_CONFIG.columns.left.x} ${PAGE_CONFIG.height - STYLES.elements.headerHeight - 460} Td
${sections.languages}

% Sezioni del CV nella colonna destra
${STYLES.colors.primary.replace('#', '')} rg
/F1 ${STYLES.fonts.heading.size} Tf
${PAGE_CONFIG.columns.right.x} ${PAGE_CONFIG.height - STYLES.elements.headerHeight - 40} Td
${sections.workExperience}

${STYLES.colors.primary.replace('#', '')} rg
/F1 ${STYLES.fonts.heading.size} Tf
${PAGE_CONFIG.columns.right.x} ${PAGE_CONFIG.height - STYLES.elements.headerHeight - 320} Td
${sections.education}

${STYLES.colors.primary.replace('#', '')} rg
/F1 ${STYLES.fonts.heading.size} Tf
${PAGE_CONFIG.columns.right.x} ${PAGE_CONFIG.height - STYLES.elements.headerHeight - 480} Td
${sections.otherInfo}
ET

% Footer con data e pagina
BT
/F3 ${STYLES.fonts.small.size} Tf
${STYLES.colors.lightText.replace('#', '')} rg
${PAGE_CONFIG.margin.left} 30 Td
(Curriculum Vitae - ${currentDate}) Tj
/F3 ${STYLES.fonts.small.size} Tf
${PAGE_CONFIG.width - 80} 30 Td
(Pagina 1/1) Tj
ET

endstream
endobj
5 0 obj
<</Font <</F1 <</Type/Font/Subtype/Type1/BaseFont/Helvetica-Bold>>>>>
<</Font <</F2 <</Type/Font/Subtype/Type1/BaseFont/Helvetica>>>>>
<</Font <</F3 <</Type/Font/Subtype/Type1/BaseFont/Helvetica-Oblique>>>>>
endobj
trailer
<</Size 6/Root 1 0 R>>
startxrf
555
%%EOF`;
    }

    /**
     * Costruisce le varie sezioni del PDF
     * @private
     * @param {Object} cvData - Dati del curriculum in formato JSON
     * @returns {Object} - Oggetto contenente i contenuti delle sezioni
     */
    function buildPDFSections(cvData) {
        // Dati personali e contatto
        const personalInfo = `
0 -50 Td
/F1 ${STYLES.fonts.heading.size} Tf
(Dati Personali) Tj
/F1 ${STYLES.fonts.normal.size} Tf
0 -${STYLES.spacing.paragraph} Td
(Data di nascita: ${cvData.basics.birth.date}) Tj
0 -${STYLES.spacing.paragraph} Td
(Luogo di nascita: ${cvData.basics.birth.place}) Tj
0 -${STYLES.spacing.paragraph} Td
(Nazionalità: ${cvData.basics.nationality}) Tj`;

        // Informazioni di contatto
        const contact = `
0 -${STYLES.spacing.section} Td
/F1 ${STYLES.fonts.heading.size} Tf
(Contatti) Tj
/F1 ${STYLES.fonts.normal.size} Tf
0 -${STYLES.spacing.paragraph} Td
(Email: ${cvData.basics.email}) Tj
0 -${STYLES.spacing.paragraph} Td
(Telefono: ${cvData.basics.phone.mobile} (mobile)) Tj
0 -${STYLES.spacing.paragraph} Td
(Indirizzo: ${cvData.basics.location}) Tj
0 -${STYLES.spacing.paragraph} Td
(GitHub: github.com/${cvData.basics.profiles.github}) Tj
0 -${STYLES.spacing.paragraph} Td
(Telegram: t.me/${cvData.basics.profiles.telegram}) Tj`;

        // Esperienze lavorative
        let workExperience = `
0 -${STYLES.spacing.section} Td
/F1 ${STYLES.fonts.heading.size} Tf
(Esperienze Professionali) Tj
/F1 ${STYLES.fonts.normal.size} Tf`;

        cvData.work.forEach((job, index) => {
            workExperience += `
0 -${STYLES.spacing.paragraph + 5} Td
/F1 ${STYLES.fonts.subheading.size} Tf
(${job.company} - ${job.position}) Tj
/F1 ${STYLES.fonts.normal.size} Tf`;

            if (job.duration) {
                workExperience += `
0 -${STYLES.spacing.paragraph} Td
(${job.duration}) Tj`;
            }

            job.achievements.forEach(achievement => {
                workExperience += `
0 -${STYLES.spacing.list} Td
(• ${achievement}) Tj`;
            });
        });

        // Formazione
        let education = `
0 -${STYLES.spacing.section} Td
/F1 ${STYLES.fonts.heading.size} Tf
(Formazione) Tj
/F1 ${STYLES.fonts.normal.size} Tf`;

        cvData.education.forEach(edu => {
            education += `
0 -${STYLES.spacing.paragraph + 5} Td
/F1 ${STYLES.fonts.subheading.size} Tf
(${edu.degree}) Tj
/F1 ${STYLES.fonts.normal.size} Tf
0 -${STYLES.spacing.paragraph} Td
(${edu.institution}) Tj`;
        });

        // Competenze
        const skills = `
0 -${STYLES.spacing.section} Td
/F1 ${STYLES.fonts.heading.size} Tf
(Competenze Tecniche) Tj
/F1 ${STYLES.fonts.normal.size} Tf
0 -${STYLES.spacing.paragraph} Td
(Programmazione Avanzata: ${cvData.skills.programming.advanced.join(', ')}) Tj
0 -${STYLES.spacing.paragraph} Td
(Programmazione Intermedia: ${cvData.skills.programming.intermediate.join(', ')}) Tj
0 -${STYLES.spacing.paragraph} Td
(Programmazione Base: ${cvData.skills.programming.basic.join(', ')}) Tj
0 -${STYLES.spacing.paragraph} Td
(Automazione Industriale: ${cvData.skills.industrialAutomation.join(', ')}) Tj
0 -${STYLES.spacing.paragraph} Td
(Windows: ${cvData.skills.systems.windows}) Tj
0 -${STYLES.spacing.paragraph} Td
(Linux: ${cvData.skills.systems.linux}) Tj`;

        // Lingue
        let languages = `
0 -${STYLES.spacing.section} Td
/F1 ${STYLES.fonts.heading.size} Tf
(Lingue) Tj
/F1 ${STYLES.fonts.normal.size} Tf`;

        cvData.languages.forEach(lang => {
            languages += `
0 -${STYLES.spacing.paragraph} Td
(${lang.language}: ${lang.level}) Tj`;
        });

        // Altre informazioni
        const otherInfo = `
0 -${STYLES.spacing.section} Td
/F1 ${STYLES.fonts.heading.size} Tf
(Altre Informazioni) Tj
/F1 ${STYLES.fonts.normal.size} Tf
0 -${STYLES.spacing.paragraph} Td
(Patente di guida: ${cvData.other.drivingLicense}) Tj
0 -${STYLES.spacing.paragraph} Td
(Hobby: ${cvData.other.hobbies.join(', ')}) Tj
0 -${STYLES.spacing.paragraph} Td
(Qualità personali: ${cvData.other.qualities.join(', ')}) Tj`;

        return {
            personalInfo,
            contact,
            workExperience,
            education,
            skills,
            languages,
            otherInfo
        };
    }

    /**
     * Apre il modale per il download del CV
     * @param {Object} cvData - Dati del curriculum
     */
    function openDownloadModal(cvData) {
        const downloadOptions = document.createElement('div');
        downloadOptions.className = 'download-options';
        downloadOptions.innerHTML = `
            <div class="download-overlay">
                <div class="download-modal">
                    <h3>Scarica Curriculum</h3>
                    <p>Scegli il formato:</p>
                    <div class="download-buttons">
                        <a href="data/cv.json" download="Tasuhiro_Davide_Kato_CV.json" class="secondary-btn">JSON</a>
                        <a href="Curriculum.md" download="Tasuhiro_Davide_Kato_CV.md" class="secondary-btn">Markdown</a>
                        <button id="generate-pdf-btn" class="primary-btn">PDF</button>
                    </div>
                    <button class="close-btn">✖</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(downloadOptions);
        
        // Gestisci la chiusura del modal
        downloadOptions.querySelector('.close-btn').addEventListener('click', () => {
            document.body.removeChild(downloadOptions);
        });
        
        // Gestisci la generazione del PDF
        downloadOptions.querySelector('#generate-pdf-btn').addEventListener('click', async () => {
            downloadOptions.querySelector('.download-modal').innerHTML = `
                <h3>Generazione PDF</h3>
                <p>Il PDF è in preparazione...</p>
                <div class="loading-spinner"></div>
            `;
            
            try {
                // Genera il PDF
                const blob = await generateCV(cvData);
                
                // Crea un link di download
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Tasuhiro_Davide_Kato_CV.pdf';
                a.click();
                
                // Pulizia
                URL.revokeObjectURL(url);
                document.body.removeChild(downloadOptions);
            } catch (error) {
                console.error('Errore durante la generazione del PDF:', error);
                downloadOptions.querySelector('.download-modal').innerHTML = `
                    <h3>Errore</h3>
                    <p>Si è verificato un errore durante la generazione del PDF.</p>
                    <button class="close-btn">Chiudi</button>
                `;
                downloadOptions.querySelector('.close-btn').addEventListener('click', () => {
                    document.body.removeChild(downloadOptions);
                });
            }
        });
    }

    // Funzionalità pubbliche del modulo
    return {
        generateCV,
        openDownloadModal
    };
})();

// Esporta il modulo
export default PDFGenerator;
