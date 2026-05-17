import re

with open("src/pages/index.astro", "r") as f:
    content = f.read()

# Make sure we got OCTOPUS tooltip right
content = content.replace("<strong>OCTOPUS (Level 4):</strong> Tests Advanced Multi-Modal Data Navigation. Requires the agent to simultaneously navigate and cross-reference structured tabular data, unstructured text, and metadata deep within complex file systems.", "<strong>OCTOPUS (Level 4):</strong> Tests Advanced Multi-Modal Data Navigation, needle in the haystack, deep multilingual understanding and more advanced syncophancy testing.")

# Update ATHENA Level 4 to Level 6
content = content.replace("<strong>ATHENA (Level 4):</strong>", "<strong>ATHENA (Level 6):</strong>")

# Add Raven header right before ATHENA header
raven_header = """                                    <div class="col-header raven-header" style="flex: 1;">
                                        <div class="header-title-wrapper">
                                            <h3>RAVEN</h3>
                                            <span class="tooltip-container">
                                                <span class="tooltip-icon">ⓘ</span>
                                                <div class="tooltip-text"><strong>RAVEN (Level 5):</strong> Shrouded in mystery, the Raven watches from the shadows. True capabilities yet to be uncovered.</div>
                                            </span>
                                        </div>
                                        <div class="creature-icon">
                                            <svg viewBox="0 0 16 16" width="24" height="24" style="image-rendering: pixelated;">
                                                <rect x="6" y="2" width="4" height="2" fill="#2E0854"/>
                                                <rect x="5" y="4" width="6" height="4" fill="#4B0082"/>
                                                <rect x="4" y="8" width="8" height="3" fill="#2E0854"/>
                                                <rect x="3" y="10" width="2" height="2" fill="#4B0082"/>
                                                <rect x="11" y="10" width="2" height="2" fill="#4B0082"/>
                                                <rect x="7" y="11" width="2" height="3" fill="#000000"/>
                                                <rect x="8" y="5" width="1" height="1" fill="#FF00FF"/>
                                                <rect x="10" y="5" width="2" height="1" fill="#FFA500"/>
                                            </svg>
                                        </div>
                                    </div>
"""

content = content.replace("""                                    <div class="col-header athena-header" style="flex: 1;">
                                        <div class="header-title-wrapper">
                                            <h3>ATHENA</h3>""", raven_header + """                                    <div class="col-header athena-header" style="flex: 1;">
                                        <div class="header-title-wrapper">
                                            <h3>ATHENA</h3>""")


raven_cell = """                                        <div class="benchmark-cell score-cell raven-score" style="flex: 1;"><span class="raven-text">?</span></div>\n"""
content = content.replace("""                                        <div class="benchmark-cell score-cell athena-score" style="flex: 1;"><span class="athena-text">?</span></div>""", raven_cell + """                                        <div class="benchmark-cell score-cell athena-score" style="flex: 1;"><span class="athena-text">?</span></div>""")

# Fix grid columns
content = content.replace("grid-template-columns: minmax(60px, 2.5fr) repeat(5, minmax(25px, 1fr));", "grid-template-columns: minmax(60px, 2.5fr) repeat(6, minmax(25px, 1fr));")

raven_css = """
    .raven-score {
        color: #8A2BE2; /* Mysterious violet */
        font-weight: bold;
        text-shadow: 0 0 5px rgba(138, 43, 226, 0.5);
    }
    .raven-text {
        font-family: 'Courier New', monospace;
        font-size: 1.2rem;
    }
"""
content = content.replace(".athena-score {", raven_css + "\n    .athena-score {")

# Update dataDataMap with raven
content = content.replace("octopus: m.scores?.octopus,", "octopus: m.scores?.octopus,\n        raven: '?',")

with open("src/pages/index.astro", "w") as f:
    f.write(content)
