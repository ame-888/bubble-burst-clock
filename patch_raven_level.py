import re

with open("src/pages/index.astro", "r") as f:
    content = f.read()

# 1. Update dataDataMap
content = content.replace("octopus: m.scores?.octopus,", "octopus: m.scores?.octopus,\n        raven: '?',")
content = content.replace("computeRanks(dataRawList, ['worm', 'koala', 'crow', 'octopus'])", "computeRanks(dataRawList, ['worm', 'koala', 'crow', 'octopus'])") # Raven doesn't participate in ranking since it's just '?'

# 2. Update tooltips for ATHENA and OCTOPUS
content = content.replace("<strong>ATHENA (Level 4):</strong>", "<strong>ATHENA (Level 6):</strong>")
content = content.replace("<strong>OCTOPUS (Level 4):</strong> Tests Advanced Multi-Modal Data Navigation. Requires the agent to simultaneously navigate and cross-reference structured tabular data, unstructured text, and metadata deep within complex file systems.", "<strong>OCTOPUS (Level 4):</strong> Tests Advanced Multi-Modal Data Navigation, needle in the haystack, deep multilingual understanding and more advanced syncophancy testing.")

# 3. Add RAVEN Header
raven_header = """                                        <div class="benchmark-cell col-header">
                                            <span class="tooltip-container">
                                                <span class="tooltip-icon">ⓘ</span>
                                                <div class="tooltip-text"><strong>RAVEN (Level 5):</strong> Shrouded in mystery, the Raven watches from the shadows. True capabilities yet to be uncovered.</div>
                                            </span>
                                            <div class="header-title-wrapper">
                                                <h3>RAVEN</h3>
                                                <div class="creature-icon">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated;">
                                                        <rect x="10" y="4" width="6" height="2" fill="#4B0082" />
                                                        <rect x="8" y="6" width="10" height="4" fill="#2E0854" />
                                                        <rect x="6" y="10" width="12" height="4" fill="#4B0082" />
                                                        <rect x="4" y="14" width="14" height="4" fill="#2E0854" />
                                                        <rect x="6" y="18" width="10" height="2" fill="#4B0082" />
                                                        <rect x="12" y="6" width="2" height="2" fill="#FF00FF" />
                                                        <rect x="16" y="10" width="4" height="2" fill="#FFA500" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>"""
content = content.replace("""                                        <div class="benchmark-cell col-header">
                                            <span class="tooltip-container">
                                                <span class="tooltip-icon">ⓘ</span>
                                                <div class="tooltip-text"><strong>ATHENA (Level 6):</strong>""", raven_header + """
                                        <div class="benchmark-cell col-header">
                                            <span class="tooltip-container">
                                                <span class="tooltip-icon">ⓘ</span>
                                                <div class="tooltip-text"><strong>ATHENA (Level 6):</strong>""")

# 4. Add RAVEN cell to rows loop
raven_cell = """                                        <div class="benchmark-cell score-cell raven-score" style="flex: 1;"><span class="raven-text">?</span></div>"""
content = content.replace("""<div class="benchmark-cell score-cell athena-score" style="flex: 1;"><span class="athena-text">?</span></div>""", raven_cell + """\n                                        <div class="benchmark-cell score-cell athena-score" style="flex: 1;"><span class="athena-text">?</span></div>""")

# 5. Fix CSS Grids - unified header row columns
content = content.replace("grid-template-columns: minmax(60px, 2.5fr) repeat(5, minmax(25px, 1fr));", "grid-template-columns: minmax(60px, 2.5fr) repeat(6, minmax(25px, 1fr));")

# 6. Add CSS for raven-score
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

with open("src/pages/index.astro", "w") as f:
    f.write(content)
