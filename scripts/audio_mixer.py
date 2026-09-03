"""
Puti-AI Text-to-Video Engine: Audio Mixer Module
Merges video, voiceover narration, and ambient background music (with fade & auto-volume).
Outputs a production-ready 1080p MP4.
"""

import os
import subprocess
import json

def get_media_duration(file_path):
    cmd = [
        "ffprobe", "-v", "quiet",
        "-print_format", "json",
        "-show_format", file_path
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    info = json.loads(res.stdout)
    return float(info["format"]["duration"])

def mix_video_and_audio(video_path, narration_path, output_mp4, bgm_path=None, bgm_volume=0.20):
    """
    Combines recorded video track with master narration and ambient BGM.
    Applies audio fade-in and fade-out to BGM.
    """
    duration = get_media_duration(narration_path)
    fade_out_start = max(0.5, duration - 2.0)

    # Base ffmpeg command
    if bgm_path and os.path.exists(bgm_path):
        # Audio filter: Resample both to stereo 44.1kHz, mix voice (100%) and BGM (ducked + faded)
        filter_str = (
            f"[1:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,volume=1.0[voice];"
            f"[2:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,"
            f"aloop=loop=-1:size=2147483647,volume={bgm_volume},"
            f"afade=t=in:st=0:d=1.5,afade=t=out:st={fade_out_start:.2f}:d=2.0[bgm];"
            f"[voice][bgm]amix=inputs=2:duration=first:dropout_transition=2,loudnorm=I=-16:TP=-1.5:LRA=11[aout]"
        )
        cmd = [
            "ffmpeg", "-y",
            "-i", video_path,
            "-i", narration_path,
            "-i", bgm_path,
            "-filter_complex", filter_str,
            "-map", "0:v:0",
            "-map", "[aout]",
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-preset", "medium",
            "-crf", "19",
            "-c:a", "aac",
            "-b:a", "192k",
            "-ar", "44100",
            "-ac", "2",
            "-t", str(duration + 0.3),
            output_mp4
        ]
    else:
        # Voice only with loudnorm normalization
        cmd = [
            "ffmpeg", "-y",
            "-i", video_path,
            "-i", narration_path,
            "-filter:a", "loudnorm=I=-16:TP=-1.5:LRA=11",
            "-map", "0:v:0",
            "-map", "1:a:0",
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-preset", "medium",
            "-crf", "19",
            "-c:a", "aac",
            "-b:a", "192k",
            "-ar", "44100",
            "-ac", "2",
            "-t", str(duration + 0.3),
            output_mp4
        ]

    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return output_mp4
