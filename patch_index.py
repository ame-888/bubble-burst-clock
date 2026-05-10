with open('src/pages/index.astro', 'r') as f:
    content = f.read()

content = content.replace("""import en from '../locales/en.json';
import ptBR from '../locales/pt-BR.json';
import ja from '../locales/ja.json';
import es from '../locales/es.json';
import zh from '../locales/zh.json';

const translations = {
    'en': en,
    'pt-BR': ptBR,
    'ja': ja,
    'es': es,
    'zh': zh,
};

const lang = 'en';
const t = translations[lang];""", "const lang = 'en';")

content = content.replace('<Layout lang={lang} title={`${t.leaderboard_button} - ${t.title}`}>', '<Layout lang={lang} title="OUR BENCHMARK - Ultimate Bench">')
content = content.replace('<h1 id="leaderboard-title">{t.leaderboard_button}</h1>', '<h1 id="leaderboard-title">OUR BENCHMARK</h1>')

content = content.replace('<button id="toggle-visual" class="toggle-btn active">{t.toggle_visual}</button>', '<button id="toggle-visual" class="toggle-btn active">VISUAL</button>')
content = content.replace('<button id="toggle-data" class="toggle-btn">{t.toggle_data}</button>', '<button id="toggle-data" class="toggle-btn">DATA</button>')

content = content.replace('<h2 id="benchmark-title">{t.benchmark_title}</h2>', '<h2 id="benchmark-title">Ultimate Visual Bench</h2>')
content = content.replace('<button id="about-benchmark-btn" class="about-benchmark-btn" title={t.about_benchmark_btn}>', '<button id="about-benchmark-btn" class="about-benchmark-btn" title="ABOUT">')
content = content.replace('<span>{t.about_benchmark_btn}</span>', '<span>ABOUT</span>')

content = content.replace('<p class="disclaimer" id="data-benchmark-disclaimer">{t.benchmark_data_disclaimer}</p>', '<p class="disclaimer" id="data-benchmark-disclaimer">In order to make this benchmark stay unsaturated for longer, easier questions might be removed and harder questions might be added over time. Any changes will be applied on all models, in order to make things fair</p>')

content = content.replace('<p id="data-benchmark-warning">{t.benchmark_data_warning}</p>', '<p id="data-benchmark-warning">Warning: A Hard Mode will be added when a model gets a score over 50%</p>')

content = content.replace("""    .benchmark-container {
        background: rgba(31, 41, 55, 0.5);""", """    .benchmark-container {
        background: var(--benchmark-bg, rgba(31, 41, 55, 0.5));""")

content = content.replace("""    .toggle-btn {
        background: rgba(31, 41, 55, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #9CA3AF;""", """    .toggle-btn {
        background: var(--benchmark-bg, rgba(31, 41, 55, 0.5));
        border: 1px solid rgba(156, 163, 175, 0.5);
        color: var(--color-text, #9CA3AF);""")

content = content.replace("""    .toggle-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;""", """    .toggle-btn:hover {
        background: rgba(156, 163, 175, 0.2);
        color: var(--color-text, white);""")

content = content.replace("<script define:vars={{ translations, lang, TIME_OFFSET }}>", "<script define:vars={{ lang, TIME_OFFSET }}>")

content = content.replace("""        // --- Translations ---
        let currentLang = lang;
        try {
            currentLang = localStorage.getItem('language') || document.cookie.split('; ').find(row => row.startsWith('language='))?.split('=')[1] || lang;
        } catch (e) {
            console.warn('Language detection failed:', e);
        }

        const t = translations[currentLang] || translations['en'];

        const mainTitle = document.getElementById('leaderboard-title');
        const benchTitle = document.getElementById('benchmark-title');
        const dataDisclaimer = document.getElementById('data-benchmark-disclaimer');
        const dataWarning = document.getElementById('data-benchmark-warning');

        if (mainTitle) mainTitle.textContent = t.leaderboard_button;
        // benchTitle text is set by updateBenchmarkView
        if (dataDisclaimer) dataDisclaimer.textContent = t.benchmark_data_disclaimer;
        if (dataWarning) dataWarning.textContent = t.benchmark_data_warning;

        const toggleVisual = document.getElementById('toggle-visual');
        const toggleData = document.getElementById('toggle-data');
        const visualWrapper = document.getElementById('visual-benchmark-wrapper');
        const dataWrapper = document.getElementById('data-benchmark-wrapper');
        const comingSoonText = document.querySelector('.coming-soon-text');

        if (toggleVisual) toggleVisual.textContent = t.toggle_visual;
        if (toggleData) toggleData.textContent = t.toggle_data;
        if (comingSoonText) comingSoonText.textContent = t.coming_soon;""", """
        const mainTitle = document.getElementById('leaderboard-title');
        const benchTitle = document.getElementById('benchmark-title');
        const dataDisclaimer = document.getElementById('data-benchmark-disclaimer');
        const dataWarning = document.getElementById('data-benchmark-warning');

        const toggleVisual = document.getElementById('toggle-visual');
        const toggleData = document.getElementById('toggle-data');
        const visualWrapper = document.getElementById('visual-benchmark-wrapper');
        const dataWrapper = document.getElementById('data-benchmark-wrapper');
        const comingSoonText = document.querySelector('.coming-soon-text');
""")

content = content.replace("if (benchTitle) benchTitle.textContent = t.benchmark_title;", 'if (benchTitle) benchTitle.textContent = "Ultimate Visual Bench";')
content = content.replace("if (benchTitle) benchTitle.textContent = t.benchmark_data_title;", 'if (benchTitle) benchTitle.textContent = "Data Retrieval Bench";')


content = content.replace("""                if (isVisual) {
                    if(aboutTitle) aboutTitle.textContent = t.benchmark_title;
                    if(aboutDesc) aboutDesc.textContent = t.benchmark_visual_about;
                } else {
                    if(aboutTitle) aboutTitle.textContent = t.benchmark_data_title;
                    if(aboutDesc) aboutDesc.textContent = t.benchmark_data_about;
                }""", """                if (isVisual) {
                    if(aboutTitle) aboutTitle.textContent = "Ultimate Visual Bench";
                    if(aboutDesc) aboutDesc.textContent = "It is a collection of 5 levels: Mole, Rhino, Chimpanzee, Owl, Eagle. Each level includes visually intensive questions. Some questions require counting elements, matching them with logic, drawing paths, avoiding traps, executing 2D physics concepts on mind. These levels are designed to be impossible to guess, and to truly test the reasoning capabilities combined with the visual cortex.";
                } else {
                    if(aboutTitle) aboutTitle.textContent = "Data Retrieval Bench";
                    if(aboutDesc) aboutDesc.textContent = "The 'Data Retrieval Benchmark' evaluates an AI's ability to locate, extract, and accurately present specific factual information. It involves 10 deep questions with explicit, irrefutable answers, and the system is granted access to web search tools to assist in finding the data.";
                }""")

with open('src/pages/index.astro', 'w') as f:
    f.write(content)
