from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        page.goto("http://localhost:4321/")

        page.wait_for_selector("#nav-data-retrieval-bench")
        page.click("#nav-data-retrieval-bench")

        page.wait_for_selector("#data-benchmark-wrapper:not(.hidden)")

        # Change ranking method to Resilience Retention
        page.select_option("#data-ranking-method", "resilience")

        page.wait_for_timeout(1000)

        data_wrapper = page.locator("#data-benchmark-wrapper")
        data_wrapper.scroll_into_view_if_needed()

        page.screenshot(path="verification/leaderboard_resilience.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    run()
