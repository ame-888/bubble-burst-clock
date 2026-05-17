import re
with open("src/pages/index.astro", "r") as f:
    content = f.read()

# Fix duplicated raven-score cells
content = content.replace("""                                                                                <div class="benchmark-cell score-cell raven-score" style="flex: 1;"><span class="raven-text">?</span></div>\n                                        <div class="benchmark-cell score-cell raven-score" style="flex: 1;"><span class="raven-text">?</span></div>""", """                                        <div class="benchmark-cell score-cell raven-score" style="flex: 1;"><span class="raven-text">?</span></div>""")

with open("src/pages/index.astro", "w") as f:
    f.write(content)
