"""
Puti-AI Text-to-Video Engine: Headless Browser Renderer
Automates Playwright Chromium to record the 1920x1080 animated DOM scenes.
"""

import os
import time
import shutil
import glob
from playwright.sync_api import sync_playwright

def record_presentation(work_dir, total_duration, timeout_buffer=5.0):
    """
    Opens player.html in headless Chromium at 1920x1080,
    records video using Playwright native recording, and returns the recorded video path.
    """
    video_dir = os.path.join(work_dir, "raw_record")
    os.makedirs(video_dir, exist_ok=True)

    player_html_path = os.path.abspath(os.path.join(work_dir, "player.html")).replace("\\", "/")
    target_url = f"file:///{player_html_path}"

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=[
                "--autoplay-policy=no-user-gesture-required",
                "--disable-web-security",
                "--allow-file-access-from-files"
            ]
        )
        context = browser.new_context(
            record_video_dir=video_dir,
            record_video_size={"width": 1920, "height": 1080},
            viewport={"width": 1920, "height": 1080}
        )
        page = context.new_page()

        page.goto(target_url)
        page.wait_for_load_state("domcontentloaded")

        # Start playback
        page.evaluate("window.startPlayback()")

        # Wait until recording finished or timeout
        max_wait = total_duration + timeout_buffer
        poll_interval = 0.5
        elapsed = 0.0

        while elapsed < max_wait:
            time.sleep(poll_interval)
            elapsed += poll_interval
            is_done = page.evaluate("() => window.__IS_RECORDING_FINISHED__ === true")
            if is_done:
                # Give a tiny buffer for the final frame
                time.sleep(0.5)
                break

        page.close()
        context.close()
        browser.close()

    # Locate the recorded video file
    candidates = glob.glob(os.path.join(video_dir, "*.webm"))
    if not candidates:
        raise RuntimeError("Playwright failed to record video file.")

    return candidates[0]
