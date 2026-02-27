from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Navigate to the leaderboard page
        page.goto("http://localhost:4321/leaderboard")

        # Wait for the page to load
        page.wait_for_selector("#leaderboard-title")

        # Click the "DATA" toggle to switch to Data Retrieval view
        page.click("#toggle-data")

        # Wait for the data table to be visible
        page.wait_for_selector("#data-benchmark-wrapper:not(.hidden)")

        # Take a screenshot of the Data Retrieval section including the disclaimer
        # We scroll to the bottom of the data section to ensure the disclaimer is visible
        data_wrapper = page.locator("#data-benchmark-wrapper")
        data_wrapper.scroll_into_view_if_needed()

        # Capture the entire page or a specific element
        page.screenshot(path="verification/leaderboard_data.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    run()
