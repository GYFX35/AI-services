from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://127.0.0.1:5001")
        page.screenshot(path="jules-scratch/verification/verification.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)