"""
Puti-AI Text-to-Video Engine: TTS and Subtitle Alignment Module
Uses Microsoft edge-tts to generate natural Taiwanese Mandarin speech
and produces millisecond-accurate timestamped subtitle data.
"""

import os
import subprocess
import json
import asyncio
import edge_tts

DEFAULT_VOICE = "zh-TW-HsiaoChenNeural" # 曉臻 (女聲自然親和)
MALE_VOICE = "zh-TW-YunJheNeural"      # 雲哲 (男聲穩重清晰)

def get_audio_duration(audio_path):
    """Returns duration in seconds using ffprobe."""
    cmd = [
        "ffprobe", "-v", "quiet",
        "-print_format", "json",
        "-show_format", audio_path
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    info = json.loads(res.stdout)
    return float(info["format"]["duration"])

async def _synthesize_sentence(text, voice, out_path):
    comm = edge_tts.Communicate(text, voice)
    await comm.save(out_path)

def generate_narration(scenes, output_dir, voice=DEFAULT_VOICE, pause_s=0.25):
    """
    Processes scenes, generates audio for each narration line, calculates
    precise timeline bounds for both scenes and subtitles, and exports narration.mp3.
    """
    os.makedirs(output_dir, exist_ok=True)
    temp_audio_dir = os.path.join(output_dir, "temp_tts")
    os.makedirs(temp_audio_dir, exist_ok=True)

    subtitles = []
    audio_files = []
    current_time = 0.0

    scene_index = 0
    for scene in scenes:
        scene["startTime"] = current_time
        scene["line_timings"] = []
        lines = scene.get("narration_lines") or [scene.get("narration", "")]
        lines = [line.strip() for line in lines if line.strip()]

        for line in lines:
            seg_filename = f"seg_{len(audio_files):03d}.mp3"
            seg_path = os.path.join(temp_audio_dir, seg_filename)

            # Generate TTS audio
            asyncio.run(_synthesize_sentence(line, voice, seg_path))
            dur = get_audio_duration(seg_path)

            timing_info = {
                "start": round(current_time, 3),
                "end": round(current_time + dur, 3),
                "text": line
            }
            subtitles.append(timing_info)
            scene["line_timings"].append(timing_info)

            audio_files.append(seg_path)
            current_time += dur + pause_s

        scene["endTime"] = current_time
        scene_index += 1

    # Add a brief 0.5s padding at the end
    total_duration = round(current_time + 0.5, 3)

    # Concatenate all audio files into a single master narration.mp3
    concat_list_path = os.path.join(temp_audio_dir, "concat_list.txt")
    with open(concat_list_path, "w", encoding="utf-8") as f:
        for fpath in audio_files:
            abs_path = os.path.abspath(fpath).replace("\\", "/")
            f.write(f"file '{abs_path}'\n")

    master_narration_path = os.path.join(output_dir, "narration.mp3")
    concat_cmd = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", concat_list_path,
        "-c:a", "libmp3lame", "-q:a", "2",
        master_narration_path
    ]
    subprocess.run(concat_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    return master_narration_path, subtitles, total_duration

if __name__ == "__main__":
    test_scenes = [
        {
            "layout": "L01_HeroHook",
            "title": "這樣的經驗？",
            "narration_lines": ["老師，你是不是也有這樣的經驗？"]
        },
        {
            "layout": "L02_CardFlip",
            "title": "反過來的想法",
            "narration_lines": ["但今天，我想跟你聊一個反過來的想法。"]
        }
    ]
    narr_path, subs, total = generate_narration(test_scenes, "test_tts_out")
    print(f"Done! Output: {narr_path}, Total Duration: {total}s")
    print("Subtitles:", json.dumps(subs, ensure_ascii=False, indent=2))
