from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Navigate to the leaderboard page
        page.goto("http://localhost:4321/")

        # Wait for the nav-data-retrieval-bench to be present and click it
        page.wait_for_selector("#nav-data-retrieval-bench")
        page.click("#nav-data-retrieval-bench")

        # Wait for the data table to be visible
        page.wait_for_selector("#data-benchmark-wrapper:not(.hidden)")

        data_wrapper = page.locator("#data-benchmark-wrapper")
        data_wrapper.scroll_into_view_if_needed()

        page.screenshot(path="verification/leaderboard_data.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    run()
