<script lang="ts">
  import { onMount } from "svelte";

  let el: HTMLDivElement;
  let running = $state(false);
  let timeouts: ReturnType<typeof setTimeout>[] = [];

  // Animation states
  let boxVisible = $state(false);
  let boxGlow = $state(false);
  let blockLabels = $state<boolean[]>([false, false, false, false]);
  let headlineVisible = $state(false);
  let sublineVisible = $state(false);
  let ctaVisible = $state(false);
  let trustLines = $state<boolean[]>([false, false, false, false, false, false]);

  const contextBlocks = [
    { label: "Voice DNA", x: 0, y: 0 },
    { label: "ICP", x: 1, y: 0 },
    { label: "Claims", x: 0, y: 1 },
    { label: "Business", x: 1, y: 1 },
  ];

  const trustContent = [
    "The Voice Discovery takes about 30 minutes.",
    "No commitment. No pitch deck.",
    "Just a real conversation about how you communicate and what your content needs to do.",
    "",
    "If we're a fit, we'll build your system.",
    "If we're not, you'll leave with clarity about your voice that you didn't have before.",
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
    boxGlow = false;
    blockLabels = [false, false, false, false];
    headlineVisible = false;
    sublineVisible = false;
    ctaVisible = false;
    trustLines = [false, false, false, false, false, false];
  }

  function startSequence() {
    reset();
    running = true;

    let t = 400;

    // Step 1: Box appears
    schedule(() => { boxVisible = true; }, t);
    t += 600;

    // Step 2: Context blocks appear one by one
    for (let i = 0; i < 4; i++) {
      schedule(() => {
        blockLabels[i] = true;
        blockLabels = [...blockLabels];
      }, t + i * 350);
    }
    t += 4 * 350 + 400;

    // Step 3: Box glow activates
    schedule(() => { boxGlow = true; }, t);
    t += 800;

    // Step 4: Headline
    schedule(() => { headlineVisible = true; }, t);
    t += 1000;

    // Step 5: Subline
    schedule(() => { sublineVisible = true; }, t);
    t += 800;

    // Step 6: CTA button
    schedule(() => { ctaVisible = true; }, t);
    t += 1000;

    // Step 7: Trust lines
    trustContent.forEach((_, i) => {
      schedule(() => {
        trustLines[i] = true;
        trustLines = [...trustLines];
      }, t + i * 400);
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
      { threshold: 0.15 }
    );
    intObs.observe(el);

    return () => {
      reset();
      intObs.disconnect();
    };
  });
</script>

<div bind:this={el} class="close-container">
  <!-- Filled AI Box -->
  <div class="box-wrapper">
    <div class="filled-box" class:visible={boxVisible} class:glow={boxGlow}>
      <span class="box-label">CWS</span>
      <div class="box-grid">
        {#each contextBlocks as block, i}
          <div class="context-block" class:visible={blockLabels[i]}>
            <span class="context-label">{block.label}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Headline -->
  <h2 class="headline" class:visible={headlineVisible}>
    Your voice is worth a system.
  </h2>

  <!-- Subline -->
  <p class="subline" class:visible={sublineVisible}>
    Let's build yours.
  </p>

  <!-- CTA Button -->
  <div class="cta-wrapper" class:visible={ctaVisible}>
    <a href="#" class="cta-button">
      <span>Start Your Voice Discovery</span>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>
  </div>

  <!-- Trust text -->
  <div class="trust-block">
    {#each trustContent as line, i}
      {#if line === ""}
        <div class="trust-spacer" class:visible={trustLines[i]}></div>
      {:else}
        <div class="trust-line" class:visible={trustLines[i]}>
          {line}
        </div>
      {/if}
    {/each}
  </div>
</div>

<style>
  .close-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: 4rem 1.5rem;
    position: relative;
  }

  /* ── Filled AI Box ── */
  .box-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .filled-box {
    position: relative;
    width: 240px;
    height: 140px;
    border: 2px solid var(--color-text-muted, #8892a4);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: scale(0.9);
    transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                border-color 0.8s ease, box-shadow 0.8s ease;
  }
  .filled-box.visible {
    opacity: 1;
    transform: scale(1);
  }
  .filled-box.glow {
    border-color: var(--color-accent, #E94560);
    box-shadow:
      0 0 20px color-mix(in srgb, var(--color-accent, #E94560) 25%, transparent),
      0 0 60px color-mix(in srgb, var(--color-accent, #E94560) 10%, transparent),
      inset 0 0 30px color-mix(in srgb, var(--color-accent, #E94560) 5%, transparent);
  }

  .box-label {
    position: absolute;
    top: 8px;
    left: 12px;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.65rem;
    color: var(--color-text-muted, #8892a4);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    opacity: 0.5;
  }
  .filled-box.glow .box-label {
    color: var(--color-accent, #E94560);
    opacity: 0.7;
  }

  .box-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 1.75rem 1rem 1rem;
    width: 100%;
  }

  .context-block {
    background: color-mix(in srgb, var(--color-accent, #E94560) 8%, transparent);
    border: 1px solid color-mix(in srgb, var(--color-accent, #E94560) 20%, transparent);
    border-radius: 6px;
    padding: 0.4rem 0.5rem;
    text-align: center;
    opacity: 0;
    transform: scale(0.8);
    transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                box-shadow 0.6s ease;
  }
  .context-block.visible {
    opacity: 1;
    transform: scale(1);
  }
  .filled-box.glow .context-block {
    box-shadow: 0 0 12px color-mix(in srgb, var(--color-accent, #E94560) 20%, transparent);
    background: color-mix(in srgb, var(--color-accent, #E94560) 12%, transparent);
    border-color: color-mix(in srgb, var(--color-accent, #E94560) 35%, transparent);
  }

  .context-label {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.6rem;
    color: var(--color-accent, #E94560);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 500;
  }

  @media (min-width: 768px) {
    .filled-box {
      width: 300px;
      height: 170px;
    }
    .context-block {
      padding: 0.5rem 0.75rem;
    }
    .context-label {
      font-size: 0.7rem;
    }
  }

  /* ── Headline ── */
  .headline {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text, #f0ece2);
    text-align: center;
    margin: 0;
    line-height: 1.2;
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .headline.visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (min-width: 768px) {
    .headline { font-size: 3rem; }
  }

  /* ── Subline ── */
  .subline {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1.35rem;
    font-weight: 600;
    color: var(--color-accent, #E94560);
    text-align: center;
    margin: 0;
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .subline.visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (min-width: 768px) {
    .subline { font-size: 1.75rem; }
  }

  /* ── CTA Button ── */
  .cta-wrapper {
    margin-top: 0.5rem;
    opacity: 0;
    transform: scale(0.9);
    transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .cta-wrapper.visible {
    opacity: 1;
    transform: scale(1);
  }

  .cta-button {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    background: var(--color-accent, #E94560);
    color: #ffffff;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1.05rem;
    font-weight: 600;
    padding: 1rem 2rem;
    border-radius: 12px;
    text-decoration: none;
    cursor: pointer;
    transition: background 0.25s ease, box-shadow 0.25s ease, transform 0.15s ease;
    box-shadow: 0 4px 20px color-mix(in srgb, var(--color-accent, #E94560) 30%, transparent);
  }
  .cta-button:hover {
    background: color-mix(in srgb, var(--color-accent, #E94560) 85%, white);
    box-shadow:
      0 6px 28px color-mix(in srgb, var(--color-accent, #E94560) 40%, transparent),
      0 0 40px color-mix(in srgb, var(--color-accent, #E94560) 15%, transparent);
    transform: translateY(-1px);
  }
  .cta-button:active {
    transform: translateY(0);
  }

  .cta-button svg {
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }
  .cta-button:hover svg {
    transform: translateX(3px);
  }

  @media (min-width: 768px) {
    .cta-button {
      font-size: 1.15rem;
      padding: 1.1rem 2.5rem;
    }
  }

  /* ── Trust text ── */
  .trust-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    margin-top: 1rem;
    max-width: 32rem;
  }

  .trust-line {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.9rem;
    font-weight: 400;
    color: var(--color-text-muted, #8892a4);
    text-align: center;
    line-height: 1.6;
    opacity: 0;
    transform: translateY(6px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .trust-line.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .trust-spacer {
    height: 0.6rem;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .trust-spacer.visible {
    opacity: 1;
  }

  @media (min-width: 768px) {
    .trust-line { font-size: 1rem; }
  }
</style>
