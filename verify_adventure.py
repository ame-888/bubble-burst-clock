from playwright.sync_api import sync_playwright

def verify_adventure_game(page):
    page.goto("http://localhost:4321/arcade")

    # Wait for Arcade to load
    page.wait_for_timeout(1000)

    # Start Adventure
    page.get_by_role("button", name="The Unpoppable").click()
    page.wait_for_timeout(2000)

    # Click first choice
    page.get_by_role("button", name="Enter the Wasteland").click()
    page.wait_for_timeout(2000)

    # Click second choice
    page.locator('button.adventure-btn').filter(has_text='Head to Neon City').click()
    page.wait_for_timeout(2000)

    # Click third choice
    page.locator('button.adventure-btn').filter(has_text='Fight').click()
    page.wait_for_timeout(2000)

    # Save game
    page.get_by_role("button", name="Save Game").click()
    page.wait_for_timeout(1000)

    # Refresh
    page.goto("http://localhost:4321/arcade")
    page.wait_for_timeout(1000)
    page.get_by_role("button", name="The Unpoppable").click()
    page.wait_for_timeout(2000)

    # Load game
    page.get_by_role("button", name="Load Game").click()
    page.wait_for_timeout(2000)

    # Take screenshot of final state
    page.screenshot(path="verification/verification.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(record_video_dir="verification/video")
        page = context.new_page()
        try:
            verify_adventure_game(page)
        except Exception as e:
            print(f"Test failed: {e}")
        finally:
            context.close()
            browser.close()
