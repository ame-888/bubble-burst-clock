with open("src/pages/index.astro", "r") as f:
    content = f.read()

# Fix duplicated raven: '?' entry
content = content.replace("""        octopus: m.scores?.octopus,
        raven: '?',
        raven: '?',""", """        octopus: m.scores?.octopus,
        raven: '?',""")

with open("src/pages/index.astro", "w") as f:
    f.write(content)
