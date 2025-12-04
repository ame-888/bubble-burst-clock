from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.set_viewport_size({"width": 1280, "height": 800})
        page.goto("http://localhost:8080")

        # Click the new button
        page.locator("#btn-player-cards").click()

        # Wait for modal
        page.wait_for_selector("#player-cards-modal:not(.hidden)")

        # Take screenshot of Grid View
        page.screenshot(path="verification/grid_view.png")
        print("Grid View Screenshot taken")

        # Click a card
        page.locator(".player-card-mini").first.click()

        # Wait for Detail View
        page.wait_for_selector("#player-detail-view:not(.hidden)")

        # Wait for animation (roughly)
        page.wait_for_timeout(1000)

        # Take screenshot of Detail View
        page.screenshot(path="verification/detail_view.png")
        print("Detail View Screenshot taken")

        browser.close()

if __name__ == "__main__":
    verify_frontend()
