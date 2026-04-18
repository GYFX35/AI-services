import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Navigate to the frontend (running on port 3000)
        print("Navigating to http://localhost:3000...")
        try:
            await page.goto("http://localhost:3000", timeout=60000)
        except Exception as e:
            print(f"Failed to navigate: {e}")
            await browser.close()
            return

        # Wait for some content to load
        await page.wait_for_selector("text=Yendoukoa AI")

        # 1. Take landing page screenshot
        print("Taking landing_page.png...")
        await page.screenshot(path="landing_page.png", full_page=True)

        # 2. Toggle Dark Mode
        print("Toggling dark mode...")
        dark_mode_button = await page.query_selector("button:has(svg)")
        if dark_mode_button:
            await dark_mode_button.click()
            await page.wait_for_timeout(1000) # Wait for transition
            print("Taking dark_mode.png...")
            await page.screenshot(path="dark_mode.png", full_page=True)
            # Toggle back for other tests
            await dark_mode_button.click()
            await page.wait_for_timeout(500)
        else:
            print("Dark mode button not found.")

        # 3. Test search
        print("Testing search...")
        search_input = await page.query_selector("input[placeholder*='Search for AI services']")
        if search_input:
            await search_input.fill("chatgpt")
            await page.wait_for_timeout(500)
            print("Taking search_results.png...")
            await page.screenshot(path="search_results.png", full_page=True)
        else:
            print("Search input not found.")

        # 4. Test Login Modal
        print("Testing login modal...")
        login_button = await page.query_selector("text=Login / Register")
        if login_button:
            await login_button.click()
            # Wait for either Join Yendoukoa AI or Login with API Key
            try:
                await page.wait_for_selector("text=Join Yendoukoa AI", timeout=5000)
                print("Taking login_modal.png...")
                await page.screenshot(path="login_modal.png")
            except Exception as e:
                print(f"Login modal title not found: {e}")
        else:
            print("Login button not found.")

        # 5. Test Chat Modal (Service Execution)
        print("Testing chat modal...")
        # Close login modal if open by clicking Cancel
        cancel_button = await page.query_selector("text=Cancel")
        if cancel_button:
            await cancel_button.click()
            await page.wait_for_timeout(500)

        # Click on the first service "Use Now" button
        use_now_button = await page.query_selector("text=Use Now")
        if use_now_button:
            await use_now_button.click()
            try:
                # Wait for the service modal to appear (it should have a textarea)
                await page.wait_for_selector("textarea", timeout=5000)
                print("Taking chat_modal.png...")
                await page.screenshot(path="chat_modal.png")
                # Close the modal
                close_button = await page.query_selector("text=Cancel")
                if close_button:
                    await close_button.click()
                    await page.wait_for_timeout(500)
            except Exception as e:
                print(f"Chat modal not found: {e}")
        else:
            print("Use Now button not found.")

        # 6. Test Mobile Menu
        print("Testing mobile menu...")
        # Set viewport to mobile size
        await page.set_viewport_size({"width": 375, "height": 667})
        await page.wait_for_timeout(500)

        menu_button = await page.query_selector("button:has(svg.lucide-menu)")
        if menu_button:
            await menu_button.click()
            try:
                # Use a more specific selector for the mobile menu content
                await page.wait_for_selector("nav div.md\\:hidden button:text('Marketplace')", timeout=5000)
                print("Taking mobile_menu.png...")
                await page.screenshot(path="mobile_menu.png")
            except Exception as e:
                print(f"Mobile menu content not found: {e}")
        else:
            print("Mobile menu button not found.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
