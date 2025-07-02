from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import uuid
from dotenv import load_dotenv
import requests
import wave

load_dotenv()

# Environment variables for external AI service (e.g., Replicate or HuggingFace)
REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")  # Optional, required if using Replicate

app = FastAPI(title="Mureka Clone – AI Music Generator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SONGS_DIR = os.path.join(os.path.dirname(__file__), "songs")
os.makedirs(SONGS_DIR, exist_ok=True)

class SongMetadata(BaseModel):
    id: str
    title: str
    lyrics: str
    style: str
    file_path: str


def _stub_generate_song(lyrics: str, style: str, reference_path: str | None = None) -> str:
    """Stub that pretends to generate a song and returns the path to a dummy mp3 file.
    Replace this implementation with a real call to an AI service such as Replicate
    (e.g. facebook/musicgen) or HuggingFace Inference API.
    """
    # For demonstration, we just copy a placeholder file
    dummy_src = os.path.join(os.path.dirname(__file__), "placeholder.mp3")
    if not os.path.exists(dummy_src):
        try:
            import numpy as np
            sample_rate = 44100
            duration_seconds = 1
            num_samples = sample_rate * duration_seconds
            silence = np.zeros(num_samples, dtype=np.int16)
            wav_path = dummy_src.replace(".mp3", ".wav")
            with wave.open(wav_path, 'w') as wf:
                wf.setnchannels(1)
                wf.setsampwidth(2)
                wf.setframerate(sample_rate)
                wf.writeframes(silence.tobytes())
            # convert to mp3 using ffmpeg if available
            os.system(f"ffmpeg -y -i {wav_path} {dummy_src} -loglevel quiet || cp {wav_path} {dummy_src}")
            os.remove(wav_path)
        except Exception:
            # fallback: create empty file
            open(dummy_src, "wb").close()

    song_id = str(uuid.uuid4())
    dst_path = os.path.join(SONGS_DIR, f"{song_id}.mp3")
    os.system(f"cp {dummy_src} {dst_path}")
    return dst_path


def _generate_song_via_replicate(
    lyrics: str,
    style: str,
    reference_path: Optional[str] = None,
    duration: int = 30,
) -> str:
    """Generate music using the Replicate MusicGen model.

    Args:
        lyrics: The lyrics or prompt for the song.
        style: Musical style / genre.
        reference_path: Optional local path to reference audio.
        duration: Duration in seconds of the output audio.

    Returns:
        Path to the saved MP3 file in SONGS_DIR.
    """
    if not REPLICATE_API_TOKEN:
        raise RuntimeError("REPLICATE_API_TOKEN environment variable not set.")

    try:
        import replicate  # Lazy import to keep startup fast if not used
    except ImportError as e:
        raise RuntimeError("replicate library not installed. Add it to requirements.") from e

    # Build prompt
    prompt_parts = []
    if style:
        prompt_parts.append(style)
    if lyrics:
        prompt_parts.append(f"lyrics: {lyrics}")
    prompt = ", ".join(prompt_parts) if prompt_parts else "instrumental music"

    client = replicate.Client(api_token=REPLICATE_API_TOKEN)

    # Meta's official MusicGen model on Replicate
    model_version = "meta/musicgen:latest"

    input_payload = {
        "prompt": prompt,
        "duration": duration,
    }

    if reference_path and os.path.exists(reference_path):
        # The MusicGen model variant "melody" supports an input audio for conditioning.
        # Many Replicate-powered forks accept the key "audio".
        # We'll include it; if the model version ignores it, it will be harmless.
        input_payload["audio"] = open(reference_path, "rb")

    # Run prediction (asynchronous, but we wait for output list/url)
    try:
        output = client.run(model_version, input=input_payload)
    except Exception as e:
        raise RuntimeError(f"Replicate API error: {e}") from e
    finally:
        # Close opened file handle if any
        if "audio" in input_payload and hasattr(input_payload["audio"], "close"):
            input_payload["audio"].close()

    # Replicate returns a list of URLs (or a single URL) to audio files
    if isinstance(output, list):
        audio_url = output[0]
    else:
        audio_url = output

    if not isinstance(audio_url, str):
        raise RuntimeError("Unexpected output from Replicate – expected URL string.")

    # Download audio
    resp = requests.get(audio_url)
    resp.raise_for_status()

    song_id = str(uuid.uuid4())
    file_ext = os.path.splitext(audio_url)[1] or ".mp3"
    dst_path = os.path.join(SONGS_DIR, f"{song_id}{file_ext}")
    with open(dst_path, "wb") as f:
        f.write(resp.content)

    return dst_path


@app.post("/generate", response_model=SongMetadata)
async def generate_song(
    title: str = Form(...),
    lyrics: str = Form(...),
    style: str = Form("pop"),
    reference: UploadFile | None = File(None),
):
    """Generate a new song using AI based on lyrics, style, and optional reference audio."""
    reference_path = None
    if reference is not None:
        ref_id = str(uuid.uuid4()) + os.path.splitext(reference.filename)[-1]
        reference_path = os.path.join(SONGS_DIR, ref_id)
        with open(reference_path, "wb") as f:
            f.write(await reference.read())

    # Try real AI generation first (Replicate). Fallback to stub if unavailable.
    try:
        if REPLICATE_API_TOKEN:
            song_path = _generate_song_via_replicate(lyrics, style, reference_path)
        else:
            song_path = _stub_generate_song(lyrics, style, reference_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Song generation failed: {e}")

    metadata = SongMetadata(
        id=os.path.splitext(os.path.basename(song_path))[0],
        title=title,
        lyrics=lyrics,
        style=style,
        file_path=song_path,
    )

    # Persist metadata alongside audio file
    meta_path = song_path.replace(".mp3", ".json")
    with open(meta_path, "w", encoding="utf-8") as f:
        f.write(metadata.json())

    return metadata


@app.get("/songs", response_model=List[SongMetadata])
async def list_songs():
    """List all generated songs."""
    songs: List[SongMetadata] = []
    for filename in os.listdir(SONGS_DIR):
        if filename.endswith(".json"):
            with open(os.path.join(SONGS_DIR, filename), "r", encoding="utf-8") as f:
                songs.append(SongMetadata.parse_raw(f.read()))
    return songs


@app.get("/songs/{song_id}")
async def get_song(song_id: str):
    """Download the audio file (MP3 ou WAV) de uma música gerada."""
    file_path_mp3 = os.path.join(SONGS_DIR, f"{song_id}.mp3")
    file_path_wav = os.path.join(SONGS_DIR, f"{song_id}.wav")

    if os.path.exists(file_path_mp3):
        return FileResponse(file_path_mp3, media_type="audio/mpeg", filename=os.path.basename(file_path_mp3))
    elif os.path.exists(file_path_wav):
        return FileResponse(file_path_wav, media_type="audio/wav", filename=os.path.basename(file_path_wav))
    else:
        raise HTTPException(status_code=404, detail="Song not found")