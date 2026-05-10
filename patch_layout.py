import re

with open('src/layouts/Layout.astro', 'r') as f:
    content = f.read()

css_old = """    :root {
        --font-body: 'Inter', sans-serif;
        --font-heading: 'Poppins', sans-serif;
        --color-bg: #111827;
        --color-text: #F3F4F6;
    }

	html,
	body {
		margin: 0;
		width: 100%;
        min-height: 100vh;
        background-color: var(--color-bg);
        color: var(--color-text);
        font-family: var(--font-body);
        overflow-x: hidden;
	}"""

css_new = """    :root {
        --font-body: 'Inter', sans-serif;
        --font-heading: 'Poppins', sans-serif;
        --color-bg: #111827;
        --color-text: #F3F4F6;
        --benchmark-bg: white;
        --benchmark-text: #111827;
    }

    html.day-mode {
        --color-bg: #f8fafc;
        --color-text: #1e293b;
        --benchmark-bg: #ffffff;
        --benchmark-text: #1e293b;
    }

	html,
	body {
		margin: 0;
		width: 100%;
        min-height: 100vh;
        background-color: var(--color-bg);
        color: var(--color-text);
        font-family: var(--font-body);
        overflow-x: hidden;
        transition: background-color 0.3s ease, color 0.3s ease;
	}"""

content = content.replace(css_old, css_new)

with open('src/layouts/Layout.astro', 'w') as f:
    f.write(content)
