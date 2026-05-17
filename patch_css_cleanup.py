import re

with open("src/pages/index.astro", "r") as f:
    content = f.read()

# I accidentally added .raven-score twice, let's fix it
content = re.sub(r'(\.raven-score \{.*?\.raven-text \{.*?\}\n)+', r'\1', content, flags=re.DOTALL)

with open("src/pages/index.astro", "w") as f:
    f.write(content)
