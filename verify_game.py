from playwright.sync_api import sync_playwright

def verify_game_unlock():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to site...")
        try:
            page.goto("http://localhost:8080", timeout=10000)
            page.wait_for_timeout(1000)
        except Exception as e:
            print(f"Failed to load page: {e}")
            return

        # 1. Unlock Game Center
        print("Attempting to unlock Game Center...")
        main_title = page.locator("#main-title")

        for i in range(5):
            main_title.click()
            page.wait_for_timeout(200)

        # Check wrapper visibility
        wrapper = page.locator("#game-center-wrapper")
        if "hidden" not in wrapper.get_attribute("class"):
            print("Game Center unlocked! Wrapper is visible.")
        else:
            print("FAILED: Game Center wrapper is still hidden after 5 clicks.")
            # Debug: check script execution
            # Maybe the title isn't receiving clicks?

        # 2. Click Joystick
        joystick = page.locator("#joystick-btn")
        if joystick.is_visible():
            print("Joystick button is visible.")
            try:
                joystick.click(timeout=2000)
                print("Clicked Joystick.")
            except Exception as e:
                print(f"FAILED to click Joystick: {e}")
                # Is something covering it?

            # Check modal
            modal = page.locator("#game-modal")
            page.wait_for_timeout(500)
            if "hidden" not in modal.get_attribute("class"):
                 print("Game Modal Opened! SUCCESS.")
            else:
                 print("FAILED: Game Modal did not open after clicking joystick.")
        else:
            print("Joystick button not visible (or not unlocked).")

        browser.close()

if __name__ == "__main__":
    verify_game_unlock()
