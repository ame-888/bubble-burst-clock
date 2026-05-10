with open('src/components/Navbar.astro', 'r') as f:
    content = f.read()

content = content.replace("import LanguageSwitcher from './LanguageSwitcher.astro';", "import ThemeToggle from './ThemeToggle.astro';")
content = content.replace("import en from '../locales/en.json';\nimport ptBR from '../locales/pt-BR.json';\nimport ja from '../locales/ja.json';\nimport es from '../locales/es.json';\nimport zh from '../locales/zh.json';", "")
content = content.replace("""const translations = {
    'en': en,
    'pt-BR': ptBR,
    'ja': ja,
    'es': es,
    'zh': zh,
};""", "")
content = content.replace("const t = translations[lang] || en;", "")

content = content.replace('<a href="/about" class="nav-link" data-i18n-key="about_button">{t.about_button}</a>', '<a href="/about" class="nav-link" data-i18n-key="about_button">About</a>')
content = content.replace('<a href="/privacy" class="nav-link" data-i18n-key="privacy_policy_button">{t.privacy_policy_button}</a>', '<a href="/privacy" class="nav-link" data-i18n-key="privacy_policy_button">Privacy Policy</a>')

content = content.replace("<LanguageSwitcher />", "<ThemeToggle />")

content = content.replace("define:vars={{ translations, lang }}", "")

content = content.replace("""    // Client-side Translation Update for Navbar
    function updateNavbarTranslations() {
        let currentLang = lang;
        try {
            currentLang = localStorage.getItem('language') || document.cookie.split('; ').find(row => row.startsWith('language='))?.split('=')[1] || lang;
        } catch (e) {
            console.warn('Language detection failed:', e);
        }

        const t = translations[currentLang] || translations['en'];

        document.querySelectorAll('.nav-link[data-i18n-key]').forEach(link => {
            const key = link.getAttribute('data-i18n-key');

            // Special handling for 'nav_home' if not in all json files (fallback to 'Home')
            if (key === 'nav_home') {
                link.textContent = t[key] || "Home";
            } else if (t[key]) {
                link.textContent = t[key];
            }
        });
    }""", "")

content = content.replace("updateNavbarTranslations();", "")

with open('src/components/Navbar.astro', 'w') as f:
    f.write(content)
