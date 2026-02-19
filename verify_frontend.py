from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Verify Index Page (Dynamic Dates)
        print("Visiting Index...")
        page.goto("http://localhost:4321/")

        # Wait for hydration and updates
        page.wait_for_timeout(2000)

        # Check if we see EXPIRED or ACTIVE badges
        # Sim date should be ~Feb 2026
        # Most predictions from 2025 should be expired.
        # Let's verify at least one "EXPIRED" badge exists.
        expired_badges = page.locator('.status-badge.expired')
        count = expired_badges.count()
        print(f"Found {count} EXPIRED badges.")

        # Screenshot Index
        page.screenshot(path="verification_index.png", full_page=True)
        print("Screenshot saved to verification_index.png")

        # Verify Leaderboard (Grok Score)
        print("Visiting Leaderboard...")
        page.goto("http://localhost:4321/leaderboard/")
        page.wait_for_timeout(1000)

        # Look for Grok 4.20
        # It should have score 6.0% (or 6%)
        # Logic: find row with "Grok 4.20" and check score in that row.
        # The DOM structure: .benchmark-item -> .model-info -> .model-name (Grok...)
        # Sibling is .model-score

        # We can just look for text "Grok 4.20 (chat)*" and "6.0%" nearby.
        content = page.content()
        if "Grok 4.20 (chat)*" in content:
            print("Grok found.")
        else:
            print("Grok NOT found.")

        if "6.0%" in content or "6%" in content:
            print("Score 6% found.")
        else:
            print("Score 6% NOT found.")

        page.screenshot(path="verification_leaderboard.png", full_page=True)
        print("Screenshot saved to verification_leaderboard.png")

        browser.close()

if __name__ == "__main__":
    run()
