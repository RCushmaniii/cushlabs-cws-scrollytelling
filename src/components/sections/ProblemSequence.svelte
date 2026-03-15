<script lang="ts">
  import { onMount } from "svelte";

  let el: HTMLDivElement;
  let running = $state(false);
  let timeouts: ReturnType<typeof setTimeout>[] = [];

  // Animation states
  let boxVisible = $state(false);
  let cursorBlink = $state(false);
  let block1Visible = $state(false);
  let promptAnimating = $state(false);
  let promptIn = $state(false);
  let outputOut = $state(false);
  let outputFade = $state(false);
  let block2Visible = $state(false);
  let listItems = $state<boolean[]>([false, false, false, false]);
  let listStrike = $state<boolean[]>([false, false, false, false]);
  let block3Visible = $state(false);
  let punchlineVisible = $state(false);
  let punchlineGlow = $state(false);
  let finalBlock = $state<boolean[]>([false, false, false]);
  let screenFlash = $state(false);

  const listContent = [
    "Not your voice.",
    "Not your audience.",
    "Not your story.",
    "Not your boundaries.",
  ];

  const finalContent = [
    "And \u201Caverage\u201D doesn\u2019t sell.",
    "\u201CAverage\u201D doesn\u2019t build trust.",
    "\u201CAverage\u201D doesn\u2019t sound like a person with a point of view.",
  ];

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
    boxVisible = false;
    cursorBlink = false;
    block1Visible = false;
    promptAnimating = false;
    promptIn = false;
    outputOut = false;
    outputFade = false;
    block2Visible = false;
    listItems = [false, false, false, false];
    listStrike = [false, false, false, false];
    block3Visible = false;
    punchlineVisible = false;
    punchlineGlow = false;
    finalBlock = [false, false, false];
    screenFlash = false;
  }

  function startSequence() {
    reset();
    running = true;

    let t = 300;

    // Step 1: AI box scales in with glow
    schedule(() => { boxVisible = true; cursorBlink = true; }, t);
    t += 1000;

    // Step 2: Text block 1
    schedule(() => { block1Visible = true; }, t);
    t += 1400;

    // Step 3: Prompt slides into box
    schedule(() => {
      promptAnimating = true;
      promptIn = true;
      cursorBlink = false;
    }, t);
    t += 1200;

    // Step 4: Output slides out (generic response)
    schedule(() => { outputOut = true; }, t);
    t += 1000;
    schedule(() => { outputFade = true; }, t);
    t += 1000;

    // Step 5: Text block 2
    schedule(() => { block2Visible = true; }, t);
    t += 1400;

    // Step 6: List items slam in one by one
    listContent.forEach((_, i) => {
      schedule(() => {
        listItems[i] = true;
        listItems = [...listItems];
      }, t + i * 400);
      // Strike-through effect after appearing
      schedule(() => {
        listStrike[i] = true;
        listStrike = [...listStrike];
      }, t + i * 400 + 250);
    });
    t += listContent.length * 400 + 600;

    // Step 7: Text block 3
    schedule(() => { block3Visible = true; }, t);
    t += 1200;

    // Step 8: Punchline with dramatic entrance
    schedule(() => { screenFlash = true; }, t);
    schedule(() => { punchlineVisible = true; }, t + 100);
    schedule(() => { screenFlash = false; }, t + 300);
    schedule(() => { punchlineGlow = true; }, t + 400);
    t += 1600;

    // Step 9: Final block lines
    finalContent.forEach((_, i) => {
      schedule(() => {
        finalBlock[i] = true;
        finalBlock = [...finalBlock];
      }, t + i * 600);
    });
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
      { threshold: 0.1 }
    );
    intObs.observe(el);

    function handleRestart() {
      if (el && el.getBoundingClientRect().top < window.innerHeight) {
        startSequence();
      }
    }
    window.addEventListener("presentation:restart-section", handleRestart);

    return () => {
      reset();
      intObs.disconnect();
      window.removeEventListener("presentation:restart-section", handleRestart);
    };
  });
</script>

<div bind:this={el} class="problem-container">
  <!-- Screen flash for punchline -->
  <div class="screen-flash" class:active={screenFlash}></div>

  <!-- Empty AI Box — larger, more dramatic -->
  <div class="box-wrapper">
    <div class="ai-box" class:visible={boxVisible}>
      <div class="box-border-glow"></div>
      <span class="box-label">AI</span>

      <!-- Blinking cursor -->
      {#if cursorBlink}
        <div class="cursor-container">
          <span class="cursor-block"></span>
        </div>
      {/if}

      <!-- Prompt sliding in -->
      {#if promptAnimating}
        <div class="prompt-track">
          <div class="prompt-text" class:slide-in={promptIn}>
            <span class="prompt-icon">&#x276F;</span> Write me a LinkedIn post
          </div>
        </div>
      {/if}

      <!-- Output sliding out -->
      {#if outputOut}
        <div class="output-track">
          <div class="output-text slide-out" class:fade={outputFade}>
            "We're excited to share..."
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Text block 1 -->
  <div class="text-block" class:visible={block1Visible}>
    <p class="text-lead">The problem isn't the AI. The AI is powerful.</p>
    <p class="text-lead accent">The problem is what's missing.</p>
  </div>

  <!-- Text block 2 -->
  <div class="text-block" class:visible={block2Visible}>
    <p class="text-body">Every time you open a new chat, a new prompt, a new session —</p>
    <p class="text-body accent">the AI knows nothing about you.</p>
  </div>

  <!-- List items with strike-through -->
  <div class="list-block">
    {#each listContent as item, i}
      <div
        class="list-item"
        class:visible={listItems[i]}
        class:struck={listStrike[i]}
      >
        <span class="list-x">&#x2717;</span>
        <span class="list-text">{item}</span>
      </div>
    {/each}
  </div>

  <!-- Text block 3 -->
  <div class="text-block narrow" class:visible={block3Visible}>
    <p class="text-body">So it does what any intelligent system does when it has no constraints:</p>
  </div>

  <!-- Punchline — dramatic full-width -->
  <div class="punchline-wrapper">
    <div class="punchline" class:visible={punchlineVisible} class:glow={punchlineGlow}>
      It defaults to average.
    </div>
    <div class="punchline-glow-bg" class:active={punchlineGlow}></div>
  </div>

  <!-- Final block -->
  <div class="final-block">
    {#each finalContent as line, i}
      <div class="final-line" class:visible={finalBlock[i]}>
        {line}
      </div>
    {/each}
  </div>
</div>

<style>
  .problem-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3rem;
    padding: 4rem 1.5rem;
    max-width: 52rem;
    margin: 0 auto;
    position: relative;
    min-height: 100vh;
    justify-content: center;
  }

  /* ── Screen flash ── */
  .screen-flash {
    position: fixed;
    inset: 0;
    background: var(--color-accent, #E94560);
    opacity: 0;
    pointer-events: none;
    z-index: 10;
    transition: opacity 0.15s ease;
  }
  .screen-flash.active {
    opacity: 0.08;
  }

  /* ── AI Box — cinematic ── */
  .box-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 1rem 0;
  }

  .ai-box {
    position: relative;
    width: 340px;
    height: 160px;
    border: 1px solid rgba(136, 146, 164, 0.3);
    border-radius: 16px;
    opacity: 0;
    transform: scale(0.85);
    transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: rgba(17, 17, 34, 0.5);
    backdrop-filter: blur(8px);
  }
  .ai-box.visible {
    opacity: 1;
    transform: scale(1);
  }

  .box-border-glow {
    position: absolute;
    inset: -1px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(233, 69, 96, 0.2), transparent, rgba(233, 69, 96, 0.1));
    opacity: 0;
    animation: borderPulse 4s ease-in-out infinite;
    z-index: -1;
  }
  .ai-box.visible .box-border-glow {
    opacity: 1;
  }
  @keyframes borderPulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  .box-label {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.7rem;
    color: var(--color-text-muted, #8892a4);
    opacity: 0.4;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    position: absolute;
    top: 12px;
    left: 16px;
  }

  /* ── Blinking cursor ── */
  .cursor-container {
    display: flex;
    align-items: center;
  }
  .cursor-block {
    display: inline-block;
    width: 10px;
    height: 20px;
    background: var(--color-text-muted, #8892a4);
    animation: cursorBlink 1s step-end infinite;
    opacity: 0.6;
  }
  @keyframes cursorBlink {
    0%, 50% { opacity: 0.6; }
    51%, 100% { opacity: 0; }
  }

  /* ── Prompt/Output ── */
  .prompt-track {
    position: absolute;
    left: 16px;
    bottom: 20px;
    overflow: visible;
  }
  .prompt-text {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.75rem;
    color: var(--color-text, #f0ece2);
    white-space: nowrap;
    opacity: 0;
    transform: translateX(-40px);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .prompt-icon {
    color: var(--color-accent, #E94560);
    font-weight: 700;
  }
  .prompt-text.slide-in {
    animation: promptSlide 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  @keyframes promptSlide {
    0% { opacity: 0; transform: translateX(-40px); }
    60% { opacity: 1; transform: translateX(0); }
    100% { opacity: 0.5; transform: translateX(0); }
  }

  .output-track {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    overflow: visible;
  }
  .output-text {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.75rem;
    color: var(--color-text-muted, #8892a4);
    white-space: nowrap;
    font-style: italic;
  }
  .output-text.slide-out {
    animation: outputSlide 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .output-text.fade {
    opacity: 0.2;
    transition: opacity 0.8s ease;
  }
  @keyframes outputSlide {
    0% { opacity: 0; transform: translateX(-20px); }
    40% { opacity: 0.8; transform: translateX(0); }
    100% { opacity: 0.5; transform: translateX(30px); }
  }

  @media (min-width: 768px) {
    .ai-box { width: 440px; height: 180px; }
    .prompt-text { font-size: 0.85rem; }
    .output-text { font-size: 0.85rem; }
  }

  /* ── Text blocks ── */
  .text-block {
    text-align: center;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .text-block.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .text-block.narrow {
    max-width: 32rem;
  }

  .text-lead {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1.35rem;
    font-weight: 500;
    color: var(--color-text, #f0ece2);
    line-height: 1.6;
    margin: 0;
  }
  .text-lead.accent {
    color: var(--color-accent, #E94560);
    font-weight: 700;
    font-size: 1.5rem;
  }

  .text-body {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1.15rem;
    font-weight: 400;
    color: var(--color-text-muted, #8892a4);
    line-height: 1.6;
    margin: 0;
  }
  .text-body.accent {
    color: var(--color-accent, #E94560);
    font-weight: 600;
  }

  @media (min-width: 768px) {
    .text-lead { font-size: 1.6rem; }
    .text-lead.accent { font-size: 1.75rem; }
    .text-body { font-size: 1.35rem; }
  }

  /* ── List items with X and strike ── */
  .list-block {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1.5rem 2rem;
    border-left: 2px solid rgba(233, 69, 96, 0.3);
    position: relative;
  }

  .list-item {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 1.05rem;
    color: var(--color-text, #f0ece2);
    opacity: 0;
    transform: translateX(-20px);
    transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .list-item.visible {
    opacity: 1;
    transform: translateX(0);
  }
  .list-item.struck .list-text {
    text-decoration: line-through;
    text-decoration-color: var(--color-accent, #E94560);
    text-decoration-thickness: 2px;
    opacity: 0.5;
  }

  .list-x {
    color: var(--color-accent, #E94560);
    font-weight: 700;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  @media (min-width: 768px) {
    .list-item { font-size: 1.2rem; }
  }

  /* ── Punchline — dramatic ── */
  .punchline-wrapper {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 2rem 0;
  }

  .punchline {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 2.25rem;
    font-weight: 800;
    color: var(--color-accent, #E94560);
    text-align: center;
    opacity: 0;
    transform: translateY(20px) scale(0.8);
    transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), text-shadow 1s ease;
    letter-spacing: -0.02em;
    position: relative;
    z-index: 2;
  }
  .punchline.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  .punchline.glow {
    text-shadow:
      0 0 20px rgba(233, 69, 96, 0.5),
      0 0 60px rgba(233, 69, 96, 0.25),
      0 0 120px rgba(233, 69, 96, 0.1);
  }

  .punchline-glow-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 500px;
    height: 200px;
    transform: translate(-50%, -50%);
    background: radial-gradient(
      ellipse,
      rgba(233, 69, 96, 0.1) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 1.5s ease;
    pointer-events: none;
    z-index: 1;
  }
  .punchline-glow-bg.active {
    opacity: 1;
    animation: punchGlow 3s ease-in-out infinite;
  }
  @keyframes punchGlow {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
  }

  @media (min-width: 768px) {
    .punchline { font-size: 3.5rem; }
  }

  /* ── Final block ── */
  .final-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
  }

  .final-line {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1.05rem;
    color: var(--color-text-muted, #8892a4);
    text-align: center;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.6s ease, transform 0.6s ease;
    line-height: 1.5;
  }
  .final-line.visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (min-width: 768px) {
    .final-line { font-size: 1.25rem; }
  }
</style>
