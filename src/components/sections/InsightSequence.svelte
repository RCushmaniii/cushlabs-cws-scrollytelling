<script lang="ts">
  import { onMount } from "svelte";

  let el: HTMLDivElement;
  let running = $state(false);
  let timeouts: ReturnType<typeof setTimeout>[] = [];

  // Animation states
  let openingVisible = $state(false);
  let setupLines = $state<boolean[]>([false, false]);
  let listItems = $state<boolean[]>([false, false, false, false]);
  let boxVisible = $state(false);
  let cardSliding = $state(false);
  let cardLanded = $state(false);
  let morphActive = $state(false);
  let morphWords = $state<boolean[]>([]);
  let punchlineLines = $state<boolean[]>([false, false]);

  const beforeText = "We help businesses grow with innovative solutions";
  const afterText = "We build the systems that make your expertise scale — without losing what makes it yours";

  const beforeWords = beforeText.split(" ");
  const afterWords = afterText.split(" ");

  // Pad to same length for morphing
  const maxLen = Math.max(beforeWords.length, afterWords.length);
  const paddedBefore = [...beforeWords, ...Array(maxLen - beforeWords.length).fill("")];
  const paddedAfter = [...afterWords, ...Array(maxLen - afterWords.length).fill("")];

  function schedule(fn: () => void, ms: number) {
    const id = setTimeout(() => {
      if (running) fn();
    }, ms);
    timeouts.push(id);
    return id;
  }

  function reset() {
    timeouts.forEach(clearTimeout);
    timeouts = [];
    running = false;
    openingVisible = false;
    setupLines = [false, false];
    listItems = [false, false, false, false];
    boxVisible = false;
    cardSliding = false;
    cardLanded = false;
    morphActive = false;
    morphWords = Array(maxLen).fill(false);
    punchlineLines = [false, false];
  }

  function startSequence() {
    reset();
    running = true;
    morphWords = Array(maxLen).fill(false);

    let t = 0;

    // Step 1: Opening question
    t += 400;
    schedule(() => { openingVisible = true; }, t);

    // Step 2: Setup lines
    t += 1200;
    schedule(() => { setupLines = [true, false]; setupLines = [...setupLines]; }, t);
    t += 800;
    schedule(() => { setupLines = [true, true]; setupLines = [...setupLines]; }, t);

    // Step 3: List items with stagger
    t += 600;
    const listTexts = [
      "How you talk.",
      "Who you're talking to.",
      "What you're allowed to say.",
      "And what 'good' looks like in your voice.",
    ];
    listTexts.forEach((_, i) => {
      schedule(() => {
        listItems[i] = true;
        listItems = [...listItems];
      }, t + i * 500);
    });

    // Step 4: AI box appears
    t += listTexts.length * 500 + 800;
    schedule(() => { boxVisible = true; }, t);

    // Step 4b: Card slides in
    t += 900;
    schedule(() => { cardSliding = true; }, t);

    // Step 4c: Card lands
    t += 800;
    schedule(() => { cardLanded = true; }, t);

    // Step 4d: Word-by-word morph
    t += 600;
    schedule(() => { morphActive = true; }, t);

    for (let i = 0; i < maxLen; i++) {
      schedule(() => {
        morphWords[i] = true;
        morphWords = [...morphWords];
      }, t + 100 + i * 120);
    }

    // Step 5: Punchline
    t += maxLen * 120 + 800;
    schedule(() => { punchlineLines = [true, false]; punchlineLines = [...punchlineLines]; }, t);
    t += 700;
    schedule(() => { punchlineLines = [true, true]; punchlineLines = [...punchlineLines]; }, t);
  }

  onMount(() => {
    const intObs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startSequence();
        } else {
          reset();
        }
      },
      { threshold: 0.15 }
    );
    intObs.observe(el);

    return () => {
      reset();
      intObs.disconnect();
    };
  });
</script>

<div bind:this={el} class="insight-container">
  <!-- Ambient glow that intensifies during morph -->
  <div class="insight-ambient" class:active={morphActive}></div>
  <!-- Opening question -->
  <div class="opening" class:visible={openingVisible}>
    What if the AI didn't start from zero?
  </div>

  <!-- Setup lines -->
  <div class="setup">
    <div class="setup-line" class:visible={setupLines[0]}>
      What if — before it wrote a single word —
    </div>
    <div class="setup-line" class:visible={setupLines[1]}>
      it already knew:
    </div>
  </div>

  <!-- Knowledge list -->
  <div class="knowledge-list">
    {#each ["How you talk.", "Who you're talking to.", "What you're allowed to say.", "And what \u2018good\u2019 looks like in your voice."] as item, i}
      <div class="knowledge-item" class:visible={listItems[i]}>
        <span class="knowledge-marker"></span>
        {item}
      </div>
    {/each}
  </div>

  <!-- AI Box with morph -->
  <div class="ai-demo" class:visible={boxVisible}>
    <!-- File card -->
    <div class="file-card-wrapper">
      <div
        class="file-card"
        class:sliding={cardSliding}
        class:landed={cardLanded}
      >
        <div class="file-card-header">
          <span class="file-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </span>
          <span class="file-name">voice-dna.json</span>
        </div>
        <div class="file-card-body">
          <span class="file-line">"tone": "direct, warm"</span>
          <span class="file-line">"rhythm": "short punchy"</span>
          <span class="file-line">"identity": "builder"</span>
        </div>
      </div>
    </div>

    <!-- AI output box -->
    <div class="ai-box">
      <div class="ai-box-label">AI Output</div>
      <div class="ai-box-content">
        <div class="morph-text">
          {#each paddedBefore as word, i}
            <span class="morph-word" class:morphed={morphActive && morphWords[i]}>
              <span class="word-before" class:hidden={morphActive && morphWords[i]}>
                {word}
              </span>
              <span class="word-after" class:shown={morphActive && morphWords[i]}>
                {paddedAfter[i] || ""}
              </span>
            </span>
          {/each}
        </div>
      </div>
      <div class="ai-box-shimmer" class:active={morphActive}></div>
    </div>
  </div>

  <!-- Punchline -->
  <div class="punchline">
    <div class="punch-line" class:visible={punchlineLines[0]}>
      That's not a prompt.
    </div>
    <div class="punch-line punch-accent" class:visible={punchlineLines[1]}>
      That's an operating system.
    </div>
  </div>
</div>

<style>
  .insight-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2.5rem;
    padding: 4rem 1.5rem;
    position: relative;
    max-width: 52rem;
    margin: 0 auto;
    overflow: hidden;
  }

  /* ── Ambient glow ── */
  .insight-ambient {
    position: absolute;
    top: 30%;
    left: 50%;
    width: 600px;
    height: 600px;
    transform: translate(-50%, -50%);
    background: radial-gradient(
      circle,
      rgba(233, 69, 96, 0.06) 0%,
      transparent 65%
    );
    opacity: 0;
    transition: opacity 1.5s ease;
    pointer-events: none;
    z-index: 0;
  }
  .insight-ambient.active {
    opacity: 1;
    animation: insightPulse 4s ease-in-out infinite;
  }
  @keyframes insightPulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.2); }
  }

  /* ── Opening question ── */
  .opening {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-text, #F0EDE6);
    text-align: center;
    opacity: 0;
    transform: translateY(24px) scale(0.9);
    transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    z-index: 1;
  }
  .opening.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  /* ── Setup lines ── */
  .setup {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  .setup-line {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1.15rem;
    color: var(--color-text-muted, #8888A0);
    text-align: center;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .setup-line.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Knowledge list ── */
  .knowledge-list {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    padding-left: 0.5rem;
  }
  .knowledge-item {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1.1rem;
    color: var(--color-text, #F0EDE6);
    opacity: 0;
    transform: translateX(-12px);
    transition: opacity 0.45s ease, transform 0.45s ease;
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }
  .knowledge-item.visible {
    opacity: 1;
    transform: translateX(0);
  }
  .knowledge-marker {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-accent, #E94560);
    flex-shrink: 0;
  }

  /* ── AI Demo area ── */
  .ai-demo {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
    flex-wrap: wrap;
    justify-content: center;
  }
  .ai-demo.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── File card ── */
  .file-card-wrapper {
    flex-shrink: 0;
    width: 11rem;
    overflow: visible;
  }
  .file-card {
    background: var(--color-surface, #111122);
    border: 1px solid rgba(233, 69, 96, 0.25);
    border-left: 3px solid var(--color-accent, #E94560);
    border-radius: 6px;
    padding: 0.75rem;
    opacity: 0;
    transform: translateX(-60px);
    transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .file-card.sliding {
    opacity: 1;
    transform: translateX(0);
  }
  .file-card.landed {
    box-shadow:
      0 0 16px rgba(233, 69, 96, 0.2),
      0 0 40px rgba(233, 69, 96, 0.08),
      inset 0 1px 0 rgba(233, 69, 96, 0.1);
    border-color: rgba(233, 69, 96, 0.4);
  }
  .file-card-header {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.5rem;
    padding-bottom: 0.4rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }
  .file-icon {
    color: var(--color-accent, #E94560);
    display: flex;
    align-items: center;
  }
  .file-name {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    color: var(--color-accent, #E94560);
    font-weight: 500;
  }
  .file-card-body {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .file-line {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    color: var(--color-text-muted, #8888A0);
    line-height: 1.4;
  }

  /* ── AI output box ── */
  .ai-box {
    flex: 1;
    min-width: 280px;
    background: var(--color-surface, #111122);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 1.25rem;
    position: relative;
    overflow: hidden;
  }
  .ai-box-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-text-muted, #8888A0);
    margin-bottom: 0.75rem;
  }
  .ai-box-content {
    position: relative;
  }
  .ai-box-shimmer {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(233, 69, 96, 0.06) 45%,
      rgba(233, 69, 96, 0.12) 50%,
      rgba(233, 69, 96, 0.06) 55%,
      transparent 100%
    );
    pointer-events: none;
    transition: none;
  }
  .ai-box-shimmer.active {
    animation: shimmer 1.8s ease-in-out forwards;
  }

  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 200%; }
  }

  /* ── Morph text ── */
  .morph-text {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3em;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1rem;
    line-height: 1.6;
  }
  .morph-word {
    position: relative;
    display: inline-block;
  }
  .word-before {
    color: var(--color-text-muted, #8888A0);
    transition: opacity 0.35s ease, filter 0.35s ease;
    display: inline-block;
  }
  .word-before.hidden {
    opacity: 0;
    filter: blur(4px);
    position: absolute;
    top: 0;
    left: 0;
  }
  .word-after {
    color: var(--color-text, #F0EDE6);
    opacity: 0;
    filter: blur(4px);
    transition: opacity 0.4s ease, filter 0.4s ease, color 0.4s ease;
    position: absolute;
    top: 0;
    left: 0;
    white-space: nowrap;
  }
  .word-after.shown {
    opacity: 1;
    filter: blur(0);
    position: relative;
    color: var(--color-text, #F0EDE6);
  }

  /* ── Punchline ── */
  .punchline {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  .punch-line {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1.15rem;
    color: var(--color-text-muted, #8888A0);
    text-align: center;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .punch-line.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .punch-accent {
    font-size: 1.65rem;
    font-weight: 800;
    color: var(--color-accent, #E94560);
    text-shadow:
      0 0 20px rgba(233, 69, 96, 0.5),
      0 0 60px rgba(233, 69, 96, 0.2),
      0 0 100px rgba(233, 69, 96, 0.1);
    letter-spacing: -0.02em;
  }

  /* ── Responsive ── */
  @media (min-width: 768px) {
    .opening { font-size: 2.25rem; }
    .setup-line { font-size: 1.3rem; }
    .knowledge-item { font-size: 1.25rem; }
    .morph-text { font-size: 1.1rem; }
    .punch-line { font-size: 1.3rem; }
    .punch-accent { font-size: 2rem; }
    .file-card-wrapper { width: 13rem; }
    .file-name { font-size: 0.75rem; }
    .file-line { font-size: 0.65rem; }
  }

  @media (max-width: 600px) {
    .ai-demo {
      flex-direction: column;
      gap: 1rem;
    }
    .file-card-wrapper {
      width: 100%;
    }
    .file-card {
      transform: translateY(-30px);
    }
    .file-card.sliding {
      transform: translateY(0);
    }
  }
</style>
