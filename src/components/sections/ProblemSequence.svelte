<script lang="ts">
  import { onMount } from "svelte";

  let el: HTMLDivElement;
  let running = $state(false);
  let timeouts: ReturnType<typeof setTimeout>[] = [];

  // Animation states
  let boxVisible = $state(false);
  let block1Visible = $state(false);
  let promptAnimating = $state(false);
  let promptIn = $state(false);
  let outputOut = $state(false);
  let block2Visible = $state(false);
  let listItems = $state<boolean[]>([false, false, false, false]);
  let block3Visible = $state(false);
  let punchlineVisible = $state(false);
  let finalBlock = $state<boolean[]>([false, false, false]);

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
    block1Visible = false;
    promptAnimating = false;
    promptIn = false;
    outputOut = false;
    block2Visible = false;
    listItems = [false, false, false, false];
    block3Visible = false;
    punchlineVisible = false;
    finalBlock = [false, false, false];
  }

  function startSequence() {
    reset();
    running = true;

    let t = 300;

    // Step 1: Box fades in
    schedule(() => { boxVisible = true; }, t);
    t += 800;

    // Step 2: Text block 1
    schedule(() => { block1Visible = true; }, t);
    t += 1400;

    // Step 3: Prompt/output animation
    schedule(() => {
      promptAnimating = true;
      promptIn = true;
    }, t);
    t += 1200;
    schedule(() => { outputOut = true; }, t);
    t += 1600;

    // Step 4: Text block 2
    schedule(() => { block2Visible = true; }, t);
    t += 1400;

    // Step 5: List items one by one
    listContent.forEach((_, i) => {
      schedule(() => {
        listItems[i] = true;
        listItems = [...listItems];
      }, t + i * 500);
    });
    t += listContent.length * 500 + 400;

    // Step 6: Text block 3
    schedule(() => { block3Visible = true; }, t);
    t += 1200;

    // Step 7: Punchline
    schedule(() => { punchlineVisible = true; }, t);
    t += 1400;

    // Step 8: Final block lines
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

    return () => {
      reset();
      intObs.disconnect();
    };
  });
</script>

<div bind:this={el} class="problem-container">
  <!-- Empty AI Box -->
  <div class="box-wrapper">
    <div class="ai-box" class:visible={boxVisible}>
      <span class="box-label">AI</span>

      <!-- Prompt sliding in -->
      {#if promptAnimating}
        <div class="prompt-track">
          <div class="prompt-text" class:slide-in={promptIn}>
            Write me a LinkedIn post
          </div>
        </div>
      {/if}

      <!-- Output sliding out -->
      {#if outputOut}
        <div class="output-track">
          <div class="output-text slide-out">
            We're excited to share...
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

  <!-- List items -->
  <div class="list-block">
    {#each listContent as item, i}
      <div class="list-item" class:visible={listItems[i]}>
        {item}
      </div>
    {/each}
  </div>

  <!-- Text block 3 -->
  <div class="text-block" class:visible={block3Visible}>
    <p class="text-body">So it does what any intelligent system does when it has no constraints:</p>
  </div>

  <!-- Punchline -->
  <div class="punchline" class:visible={punchlineVisible}>
    It defaults to average.
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
    gap: 2.5rem;
    padding: 4rem 1rem;
    max-width: 48rem;
    margin: 0 auto;
  }

  /* ── Empty AI Box ── */
  .box-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 1rem 0;
  }

  .ai-box {
    position: relative;
    width: 280px;
    height: 120px;
    border: 2px dashed var(--color-text-muted, #8892a4);
    border-radius: 16px;
    opacity: 0;
    transition: opacity 0.8s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    animation: none;
  }
  .ai-box.visible {
    opacity: 1;
    animation: boxPulse 3s ease-in-out infinite;
  }
  @keyframes boxPulse {
    0%, 100% { border-color: var(--color-text-muted, #8892a4); opacity: 1; }
    50% { border-color: color-mix(in srgb, var(--color-text-muted, #8892a4) 40%, transparent); opacity: 0.7; }
  }

  .box-label {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.75rem;
    color: var(--color-text-muted, #8892a4);
    opacity: 0.4;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    position: absolute;
    top: 8px;
    left: 12px;
  }

  /* ── Prompt/Output animation ── */
  .prompt-track {
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    overflow: visible;
  }
  .prompt-text {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.7rem;
    color: var(--color-text, #f0ece2);
    white-space: nowrap;
    opacity: 0;
    transform: translateX(-80px);
  }
  .prompt-text.slide-in {
    animation: slideIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  @keyframes slideIn {
    0% { opacity: 0; transform: translateX(-80px); }
    40% { opacity: 1; transform: translateX(20px); }
    100% { opacity: 0.3; transform: translateX(40px); }
  }

  .output-track {
    position: absolute;
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
    overflow: visible;
  }
  .output-text {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.7rem;
    color: var(--color-text-muted, #8892a4);
    white-space: nowrap;
    font-style: italic;
  }
  .output-text.slide-out {
    animation: slideOut 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  @keyframes slideOut {
    0% { opacity: 0; transform: translateX(-20px); }
    30% { opacity: 0.8; transform: translateX(10px); }
    100% { opacity: 0; transform: translateX(100px); }
  }

  @media (min-width: 768px) {
    .ai-box {
      width: 360px;
      height: 140px;
    }
    .prompt-text { font-size: 0.8rem; }
    .output-text { font-size: 0.8rem; }
  }

  /* ── Text blocks ── */
  .text-block {
    text-align: center;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .text-block.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .text-lead {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--color-text, #f0ece2);
    line-height: 1.6;
    margin: 0;
  }
  .text-lead.accent {
    color: var(--color-accent, #E94560);
    font-weight: 600;
  }

  .text-body {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1.1rem;
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
    .text-lead { font-size: 1.5rem; }
    .text-body { font-size: 1.25rem; }
  }

  /* ── List items ── */
  .list-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
  }

  .list-item {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 1rem;
    color: var(--color-text-muted, #8892a4);
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .list-item.visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (min-width: 768px) {
    .list-item { font-size: 1.15rem; }
  }

  /* ── Punchline ── */
  .punchline {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-accent, #E94560);
    text-align: center;
    opacity: 0;
    transform: translateY(10px) scale(0.95);
    transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .punchline.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
    text-shadow: 0 0 30px color-mix(in srgb, var(--color-accent, #E94560) 30%, transparent);
  }

  @media (min-width: 768px) {
    .punchline { font-size: 2.5rem; }
  }

  /* ── Final block ── */
  .final-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .final-line {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1rem;
    color: var(--color-text-muted, #8892a4);
    text-align: center;
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.5s ease, transform 0.5s ease;
    line-height: 1.5;
  }
  .final-line.visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (min-width: 768px) {
    .final-line { font-size: 1.15rem; }
  }
</style>
