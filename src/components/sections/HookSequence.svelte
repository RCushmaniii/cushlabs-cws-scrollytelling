<script lang="ts">
  import { onMount } from "svelte";

  let el: HTMLDivElement;
  let running = $state(false);
  let timeouts: ReturnType<typeof setTimeout>[] = [];

  // Animation states
  let genericLines = $state<boolean[]>([false, false, false, false, false, false, false]);
  let genericDimmed = $state(false);
  let vignetteActive = $state(false);
  let commentaryLines = $state<boolean[]>([false, false, false, false]);
  let glowPulse = $state(false);

  const genericContent = [
    { text: "\u201CWe\u2019re passionate about helping businesses grow.\u201D", x: 15, y: 12, size: 1.1, rotate: -2 },
    { text: "\u201CIn today\u2019s fast-paced digital landscape, staying ahead requires innovation.\u201D", x: 55, y: 8, size: 0.85, rotate: 1.5 },
    { text: "\u201CHi [Name], I hope this email finds you well!\u201D", x: 72, y: 28, size: 0.95, rotate: -1 },
    { text: "\u201COur team of experts delivers cutting-edge solutions tailored to your needs.\u201D", x: 20, y: 38, size: 0.9, rotate: 0.5 },
    { text: "\u201CReady to take your business to the next level? Let\u2019s connect.\u201D", x: 60, y: 52, size: 1.0, rotate: -1.5 },
    { text: "\u201CExcited to share some amazing news!\u201D", x: 30, y: 65, size: 1.05, rotate: 2 },
    { text: "\u201CWe leverage AI to empower teams and drive unprecedented growth.\u201D", x: 50, y: 78, size: 0.88, rotate: -0.5 },
  ];

  const commentaryContent = [
    { text: "This is what AI sounds like without memory.", accent: true, large: true },
    { text: "Every prompt starts from zero.", accent: false },
    { text: "No voice. No guardrails. No context.", accent: false },
    { text: "Just\u2026 language.", accent: false },
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
    genericLines = [false, false, false, false, false, false, false];
    genericDimmed = false;
    vignetteActive = false;
    commentaryLines = [false, false, false, false];
    glowPulse = false;
  }

  function startSequence() {
    reset();
    running = true;

    // Step 1: Generic lines scatter in one by one
    const lineDelay = 500;
    genericContent.forEach((_, i) => {
      schedule(() => {
        genericLines[i] = true;
        genericLines = [...genericLines];
      }, 300 + i * lineDelay);
    });

    // Step 2: Pause, then vignette closes and quotes dim
    const allLinesDone = 300 + genericContent.length * lineDelay;
    schedule(() => {
      vignetteActive = true;
    }, allLinesDone + 600);
    schedule(() => {
      genericDimmed = true;
    }, allLinesDone + 900);

    // Step 3: Commentary lines appear with dramatic entrance
    const commentaryStart = allLinesDone + 1600;
    commentaryContent.forEach((_, i) => {
      schedule(() => {
        commentaryLines[i] = true;
        commentaryLines = [...commentaryLines];
      }, commentaryStart + i * 800);
    });

    // Step 4: Glow pulse on final line
    schedule(() => {
      glowPulse = true;
    }, commentaryStart + commentaryContent.length * 800 + 200);
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

    // Listen for presentation restart
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

<div bind:this={el} class="hook-container">
  <!-- Ambient background glow -->
  <div class="ambient-glow" class:active={!genericDimmed}></div>

  <!-- Vignette overlay -->
  <div class="vignette" class:active={vignetteActive}></div>

  <!-- Scattered generic AI quotes -->
  <div class="generic-field" class:dimmed={genericDimmed}>
    {#each genericContent as line, i}
      <div
        class="generic-line"
        class:visible={genericLines[i]}
        style="
          left: {line.x}%;
          top: {line.y}%;
          font-size: {line.size}rem;
          --rotate: {line.rotate}deg;
          --delay: {i * 0.08}s;
        "
      >
        {line.text}
      </div>
    {/each}

    <!-- Scan lines over generic text -->
    <div class="scan-lines"></div>
  </div>

  <!-- Commentary (centered, dramatic) -->
  <div class="commentary" class:active={genericDimmed}>
    {#each commentaryContent as line, i}
      <div
        class="commentary-line"
        class:visible={commentaryLines[i]}
        class:accent={line.accent}
        class:large={line.large}
        class:muted={!line.accent}
      >
        {line.text}
      </div>
    {/each}

    <!-- Accent glow behind commentary -->
    <div class="commentary-glow" class:active={glowPulse}></div>
  </div>
</div>

<style>
  .hook-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  /* ── Ambient background ── */
  .ambient-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at 50% 40%,
      rgba(233, 69, 96, 0.03) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 2s ease;
    pointer-events: none;
  }
  .ambient-glow.active {
    opacity: 1;
  }

  /* ── Vignette ── */
  .vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at 50% 50%,
      transparent 30%,
      rgba(10, 10, 10, 0.85) 100%
    );
    opacity: 0;
    transition: opacity 1.2s ease;
    pointer-events: none;
    z-index: 2;
  }
  .vignette.active {
    opacity: 1;
  }

  /* ── Scan lines ── */
  .scan-lines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.01) 2px,
      rgba(255, 255, 255, 0.01) 4px
    );
    pointer-events: none;
    opacity: 0.5;
  }

  /* ── Scattered generic lines ── */
  .generic-field {
    position: absolute;
    inset: 0;
    transition: opacity 1.2s ease, filter 1.2s ease;
  }
  .generic-field.dimmed {
    opacity: 0.08;
    filter: blur(6px);
  }

  .generic-line {
    position: absolute;
    max-width: 500px;
    transform: translateY(20px) rotate(var(--rotate, 0deg));
    opacity: 0;
    transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    color: var(--color-text-muted, #8892a4);
    font-family: 'Inter', system-ui, sans-serif;
    line-height: 1.4;
    white-space: nowrap;
    pointer-events: none;
  }
  .generic-line.visible {
    opacity: 0.6;
    transform: translateY(0) rotate(var(--rotate, 0deg));
    animation: drift 8s ease-in-out infinite;
    animation-delay: var(--delay, 0s);
  }

  @keyframes drift {
    0%, 100% { transform: translateY(0) rotate(var(--rotate, 0deg)); }
    50% { transform: translateY(-6px) rotate(var(--rotate, 0deg)); }
  }

  /* ── Commentary ── */
  .commentary {
    position: relative;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    opacity: 0;
    transition: opacity 0.8s ease;
    padding: 0 1.5rem;
  }
  .commentary.active {
    opacity: 1;
  }

  .commentary-line {
    opacity: 0;
    transform: translateY(16px) scale(0.92);
    transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    text-align: center;
    line-height: 1.5;
  }
  .commentary-line.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .commentary-line.large {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  .commentary-line.accent {
    color: var(--color-accent, #E94560);
    text-shadow: 0 0 40px rgba(233, 69, 96, 0.4), 0 0 80px rgba(233, 69, 96, 0.15);
  }
  .commentary-line.muted {
    color: var(--color-text-muted, #8892a4);
    font-size: 1.2rem;
    font-weight: 400;
  }

  /* ── Commentary glow ── */
  .commentary-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 400px;
    height: 400px;
    transform: translate(-50%, -50%);
    background: radial-gradient(
      circle,
      rgba(233, 69, 96, 0.12) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 1.5s ease;
    pointer-events: none;
    z-index: -1;
  }
  .commentary-glow.active {
    opacity: 1;
    animation: glowPulse 3s ease-in-out infinite;
  }
  @keyframes glowPulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.7; }
  }

  /* ── Responsive ── */
  @media (min-width: 768px) {
    .commentary-line.large { font-size: 2.75rem; }
    .commentary-line.muted { font-size: 1.4rem; }
  }

  @media (max-width: 768px) {
    .generic-line {
      max-width: 280px;
      white-space: normal;
      font-size: 0.85rem !important;
    }
  }
</style>
