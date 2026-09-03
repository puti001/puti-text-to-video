"""
Puti-AI Notion-Style Text-to-Video Generator
Main CLI Entrypoint: Orchestrates Script -> TTS -> Chromium Recording -> FFmpeg Audio Mix.
"""

import os
import sys
import json
import shutil
import argparse

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass
from tts_engine import generate_narration, DEFAULT_VOICE
from renderer import record_presentation
from audio_mixer import mix_video_and_audio

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
RESOURCES_DIR = os.path.join(BASE_DIR, "resources")
DEFAULT_BGM_PATH = os.path.join(RESOURCES_DIR, "bgm", "acoustic_guitar.mp3")

def run_pipeline(project_data, output_mp4, voice=DEFAULT_VOICE, bgm_path=DEFAULT_BGM_PATH, work_dir="temp_render_workspace", keep_temp=False):
    """
    Executes the full automated video generation pipeline.
    """
    print(f"🎬 [1/4] 初始化專案工作區: {work_dir}")
    os.makedirs(work_dir, exist_ok=True)

    # 1. Copy web player assets to workspace
    for asset in ["player.html", "style.css", "anim.js"]:
        src = os.path.join(TEMPLATES_DIR, asset)
        dst = os.path.join(work_dir, asset)
        shutil.copy2(src, dst)

    scenes = project_data.get("scenes", [])
    if not scenes:
        raise ValueError("專案資料中未包含任何 scenes 分鏡。")

    # 2. Synthesize TTS and generate exact timeline
    print(f"🎙️ [2/4] 合成繁體中文神經語音與逐句時間軸 (語音: {voice})...")
    master_narration_path, subtitles, total_duration = generate_narration(
        scenes=scenes,
        output_dir=work_dir,
        voice=voice
    )

    project_data["subtitles"] = subtitles
    project_data["totalDuration"] = total_duration

    # Write script_data.js
    script_data_js = os.path.join(work_dir, "script_data.js")
    with open(script_data_js, "w", encoding="utf-8") as f:
        f.write("window.videoProject = " + json.dumps(project_data, ensure_ascii=False, indent=2) + ";\n")

    print(f"⏱️ 影片總時長: {total_duration:.2f} 秒，共 {len(subtitles)} 句字幕。")

    # 3. Headless Chromium Video Recording
    print("🎥 [3/4] 啟動無頭瀏覽器以 1920x1080 進行動態分鏡錄製...")
    raw_video_path = record_presentation(work_dir, total_duration)

    # 4. Audio & Video Mixing
    print("🎧 [4/4] 混音旁白軌、環境 BGM (自動降音) 並編碼 1080p MP4...")
    os.makedirs(os.path.dirname(os.path.abspath(output_mp4)), exist_ok=True)
    mix_video_and_audio(
        video_path=raw_video_path,
        narration_path=master_narration_path,
        output_mp4=output_mp4,
        bgm_path=bgm_path if (bgm_path and os.path.exists(bgm_path)) else None
    )

    # Cleanup if needed
    if not keep_temp:
        shutil.rmtree(work_dir, ignore_errors=True)

    print(f"✨ 影片生成完成！已輸出至: {os.path.abspath(output_mp4)}")
    return output_mp4

def main():
    parser = argparse.ArgumentParser(description="Puti-AI Text-to-Video Engine")
    parser.add_argument("--input", "-i", required=True, help="Path to input project JSON file")
    parser.add_argument("--output", "-o", default="output_video.mp4", help="Path to final output MP4")
    parser.add_argument("--voice", "-v", default=DEFAULT_VOICE, help="TTS voice name")
    parser.add_argument("--bgm", "-b", default=DEFAULT_BGM_PATH, help="Path to custom BGM mp3")
    parser.add_argument("--keep-temp", action="store_true", help="Keep intermediate render workspace")

    args = parser.parse_args()

    with open(args.input, "r", encoding="utf-8") as f:
        project_data = json.load(f)

    run_pipeline(
        project_data=project_data,
        output_mp4=args.output,
        voice=args.voice,
        bgm_path=args.bgm,
        keep_temp=args.keep_temp
    )

if __name__ == "__main__":
    main()
