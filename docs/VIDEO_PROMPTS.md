# Video Background Prompts — CWS Scrollytelling

Generate each as a **5-8 second seamless loop**, landscape 16:9, 1080p.
Dark palette mandatory — these sit behind dark UI with a gradient overlay on top.
No text, no UI elements, no faces, no logos. Pure atmosphere.

Export as MP4 (H.264). Keep file size under 5MB per clip.

---

## Section 1: Hook — "Generic AI Wall"

**Filename:** `hook-generic-ai.mp4`
**Emotional target:** Overwhelm, sameness, corporate emptiness

### Prompt for Veo 2 (Gemini):

```
Slow cinematic tracking shot through an infinite dark room filled with floating translucent screens displaying generic corporate text. The screens are slightly blue-tinted, arranged in rows receding into darkness. Each screen shows blurred placeholder text — all identical. Camera drifts forward slowly. The screens pulse faintly with a cold, sterile light. No people. Atmosphere: eerie, repetitive, soulless. Color palette: deep black background, cold blue-gray screens, no warm tones. Shallow depth of field. 8 second seamless loop.
```

### Prompt for Sora (OpenAI):

```
Cinematic slow dolly through an infinite dark void filled with rows of floating holographic text panels. Each panel displays identical blurred corporate text in cold blue-gray light. The panels are semi-transparent, overlapping, stretching into darkness. Camera moves forward slowly and steadily. Atmosphere is sterile and overwhelming — a visual metaphor for sameness. Very dark background, cool tones only. No people, no logos. Seamless 8 second loop, 1080p, 16:9.
```

---

## Section 2: Problem — "The Empty Void"

**Filename:** `problem-empty-void.mp4`
**Emotional target:** Isolation, absence, something missing

### Prompt for Veo 2 (Gemini):

```
A single faint cursor blinking in the center of a vast dark void. Barely visible particles drift slowly downward like digital dust. The cursor emits a subtle warm glow that fades with each blink — the only light source. The surrounding darkness is absolute and expansive. Atmosphere: lonely, expectant, something important is absent. Extreme minimalism. Camera is static, slightly zoomed in. Color palette: near-black with a single faint warm-white cursor glow. 6 second seamless loop.
```

### Prompt for Sora (OpenAI):

```
Static shot of a vast dark empty space. A single thin cursor blinks slowly in the center, casting a faint warm-white glow. Microscopic particles drift downward through the glow like digital dust in a beam of light. The void surrounding the cursor is deep black and infinite. Mood: solitude, expectation, absence. Extreme minimalism — almost nothing on screen except the cursor and particles. No text, no UI. 6 second seamless loop, 1080p, 16:9.
```

---

## Section 3: Insight — "Context Ignition"

**Filename:** `insight-transformation.mp4`
**Emotional target:** Awakening, connection, something clicking into place

### Prompt for Veo 2 (Gemini):

```
Abstract visualization of data streams converging into a central point in a dark space. Thin luminous threads in warm red and white flow from the edges of frame toward the center, where they merge into a slowly pulsing orb of light. The threads move organically, like synapses firing. As they connect, the central point grows brighter and more defined. Atmosphere: moment of clarity, something awakening. Color palette: deep black background, warm red (#E94560) threads, white-gold center glow. Camera slowly pushes in. 8 second seamless loop.
```

### Prompt for Sora (OpenAI):

```
Dark abstract space with thin luminous filaments in warm red and soft white flowing from all edges toward a central glowing point. The filaments move like neural pathways firing — organic, purposeful, converging. The central point pulses gently brighter as connections arrive. Slow camera push-in. Atmosphere: an awakening, a system coming online, context forming from chaos. Color palette: near-black background, warm red (#E94560) filaments, soft white-gold center. No text, no faces, no UI. 8 second seamless loop, 1080p, 16:9.
```

---

## File Placement

Drop the generated MP4 files into:

```
public/video/hook-generic-ai.mp4
public/video/problem-empty-void.mp4
public/video/insight-transformation.mp4
```

The `VideoBackground` component is already wired in `index.astro` pointing to these paths. Once the files are in place, the videos will auto-play on scroll and pause when the section leaves the viewport.

## Tips for Best Results

- **Try both tools** on each prompt and pick the winner
- If the loop isn't seamless, look for a frame where the motion naturally resets
- Compress with HandBrake or FFmpeg if file size exceeds 5MB: `ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset slow output.mp4`
- Test in browser at full opacity first, then the dark overlay will bring it down to ~30-50% visible — subtle but impactful
