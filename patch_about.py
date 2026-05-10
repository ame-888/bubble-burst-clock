with open('src/pages/about.astro', 'r') as f:
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

content = content.replace('<Layout lang={lang} title={`${t.about_title} - ${t.title}`}>', '<Layout lang={lang} title="About the Benchmark - Ultimate Bench">')
content = content.replace('<h1 id="about-title">{t.about_title}</h1>', '<h1 id="about-title">About the Benchmark</h1>')
content = content.replace('<p id="about-welcome" class="welcome-text">{t.about_welcome}</p>', '<p id="about-welcome" class="welcome-text">Witness the ultimate benchmark for artificial intelligence.</p>')
content = content.replace('<p id="about-desc1" class="about-text">{t.about_desc1}</p>', '<p id="about-desc1" class="about-text">We serve as the silent observers of an industry prone to spectacular proclamations. This archive meticulously records and tests the capabilities of the latest AI models against benchmarks that any human child could easily pass.</p>')
content = content.replace('<p id="about-desc2" class="about-text">{t.about_desc2}</p>', '<p id="about-desc2" class="about-text">Explore our Benchmarks to see how the industry\'s loudest models actually perform, and visit the Arcade to test your own skills in retro-inspired mini-games.</p>')
content = content.replace('<p class="secret-hint"><em id="secret-hint">{t.secret_hint}</em></p>', '<p class="secret-hint"><em id="secret-hint">Psst... rumor has it the main title hides a retro secret if you tap it enough times.</em></p>')


content = content.replace("<script define:vars={{ translations, lang }}>", "<script>")

content = content.replace("""        let currentLang = lang;
        try {
            currentLang = localStorage.getItem('language') || document.cookie.split('; ').find(row => row.startsWith('language='))?.split('=')[1] || lang;
        } catch (e) {
            console.warn('Language detection failed:', e);
        }

        const t = translations[currentLang] || translations['en'];

        const title = document.getElementById('about-title');
        const welcome = document.getElementById('about-welcome');
        const desc1 = document.getElementById('about-desc1');
        const desc2 = document.getElementById('about-desc2');
        const hint = document.getElementById('secret-hint');

        if (title) title.textContent = t.about_title;
        if (welcome) welcome.textContent = t.about_welcome;
        if (desc1) desc1.innerHTML = t.about_desc1;
        if (desc2) desc2.innerHTML = t.about_desc2.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        if (hint) hint.textContent = t.secret_hint;""", "")

with open('src/pages/about.astro', 'w') as f:
    f.write(content)
