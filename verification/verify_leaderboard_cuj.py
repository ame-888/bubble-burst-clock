from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:4321/")
    page.wait_for_timeout(500)

    # Wait for the leaderboard to be visible
    page.wait_for_selector("#visual-benchmark-wrapper")

    # Scroll to the bottom to see the newly added model and disclaimer
    data_wrapper = page.locator("#visual-benchmark-wrapper")
    data_wrapper.scroll_into_view_if_needed()

    # Check that "Muse Spark" is visible
    page.wait_for_selector("text=Muse Spark (with reasoning)*")
    page.wait_for_timeout(500)

    # Check that the disclaimer is visible
    page.wait_for_selector("text=The model was unable to complete the task in the proper way")
    page.wait_for_timeout(500)

    # Take screenshot at the key moment
    page.screenshot(path="/home/jules/verification/screenshots/verification.png")
    page.wait_for_timeout(1000)  # Hold final state for the video

if __name__ == "__main__":
    import os
    os.makedirs("/home/jules/verification/videos", exist_ok=True)
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()  # MUST close context to save the video
            browser.close()
