from playwright.sync_api import sync_playwright
import os
import glob

def run_cuj(page):
    page.goto("http://localhost:4321/")
    page.wait_for_timeout(1000)

    # Visual Bench: Default view (Baseline)
    page.wait_for_selector("#visual-benchmark-wrapper:not(.hidden)")
    page.locator("#visual-benchmark-wrapper").scroll_into_view_if_needed()
    page.screenshot(path="/home/jules/verification/screenshots/visual_baseline.png")
    page.wait_for_timeout(1000)

    # Visual Bench: Resilience view
    page.select_option("#visual-ranking-method", "resilience")
    page.wait_for_timeout(1000)
    page.locator("#visual-benchmark-wrapper").scroll_into_view_if_needed()
    page.screenshot(path="/home/jules/verification/screenshots/visual_resilience.png")
    page.wait_for_timeout(1000)

    # Switch to Data Retrieval Bench
    page.wait_for_selector("#nav-data-retrieval-bench")
    page.click("#nav-data-retrieval-bench")
    page.wait_for_timeout(1000)

    # Data Bench: Default view (Baseline)
    page.wait_for_selector("#data-benchmark-wrapper:not(.hidden)")
    page.locator("#data-benchmark-wrapper").scroll_into_view_if_needed()
    page.screenshot(path="/home/jules/verification/screenshots/data_baseline.png")
    page.wait_for_timeout(1000)

    # Data Bench: Resilience view
    page.select_option("#data-ranking-method", "resilience")
    page.wait_for_timeout(1000)
    page.locator("#data-benchmark-wrapper").scroll_into_view_if_needed()
    page.screenshot(path="/home/jules/verification/screenshots/data_resilience.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
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

    # Rename video to a consistent name
    video_files = glob.glob("/home/jules/verification/videos/*.webm")
    if video_files:
        os.rename(video_files[0], "/home/jules/verification/videos/verification.webm")
