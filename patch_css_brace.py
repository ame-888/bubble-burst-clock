import re
with open("src/pages/index.astro", "r") as f:
    content = f.read()

# Fix the broken .athena-score CSS block
content = content.replace(""".athena-score {
    .athena-text {""", """.athena-score {
        /* ... */
    }
    .athena-text {""")

with open("src/pages/index.astro", "w") as f:
    f.write(content)
