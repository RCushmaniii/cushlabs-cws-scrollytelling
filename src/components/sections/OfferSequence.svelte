<script lang="ts">
  import { onMount } from "svelte";

  let el: HTMLDivElement;
  let running = $state(false);
  let timeouts: ReturnType<typeof setTimeout>[] = [];

  // Animation states
  let openingLine1 = $state(false);
  let openingLine2 = $state(false);
  let steps = $state<boolean[]>([false, false, false, false]);
  let timelineVisible = $state(false);

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
    openingLine1 = false;
    openingLine2 = false;
    steps = [false, false, false, false];
    timelineVisible = false;
  }

  function startSequence() {
    reset();
    running = true;

    let t = 300;

    // Opening lines
    schedule(() => { openingLine1 = true; }, t);
    t += 1200;
    schedule(() => { openingLine2 = true; }, t);
    t += 1400;

    // Timeline connector
    schedule(() => { timelineVisible = true; }, t);
    t += 400;

    // Steps appear sequentially
    const stepDelay = 900;
    for (let i = 0; i < 4; i++) {
      schedule(() => {
        steps[i] = true;
        steps = [...steps];
      }, t + i * stepDelay);
    }
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
      { threshold: 0.08 }
    );
    intObs.observe(el);

    return () => {
      reset();
      intObs.disconnect();
    };
  });
</script>

<div bind:this={el} class="offer-container">
  <!-- Opening text -->
  <div class="opening">
    <div class="opening-line" class:visible={openingLine1}>
      Your system doesn't exist yet.
    </div>
    <div class="opening-line accent" class:visible={openingLine2}>
      We build it with you.
    </div>
  </div>

  <!-- Timeline -->
  <div class="timeline" class:visible={timelineVisible}>
    <!-- Step 1: The Voice Discovery -->
    <div class="step-card" class:visible={steps[0]}>
      <div class="step-connector"></div>
      <div class="step-header">
        <span class="step-number">01</span>
        <div class="step-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H10L14 24L18 20H22C23.1046 20 24 19.1046 24 18V6C24 4.89543 23.1046 4 22 4H6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="9" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="14" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="19" cy="12" r="1.5" fill="currentColor"/>
          </svg>
        </div>
      </div>
      <h3 class="step-title">The Voice Discovery</h3>
      <div class="step-body">
        <p>A guided conversation — not a generic intake form.</p>
        <p>We learn how you think, how you speak, what you'd never say, and what makes your writing feel like yours.</p>
        <p class="step-highlight">This becomes your Voice DNA.</p>
      </div>
    </div>

    <!-- Step 2: Audience & Business Mapping -->
    <div class="step-card" class:visible={steps[1]}>
      <div class="step-connector"></div>
      <div class="step-header">
        <span class="step-number">02</span>
        <div class="step-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="14" r="10" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="14" cy="14" r="6" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="14" cy="14" r="2" fill="currentColor"/>
            <line x1="14" y1="2" x2="14" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="14" y1="22" x2="14" y2="26" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="2" y1="14" x2="6" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="22" y1="14" x2="26" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
      <h3 class="step-title">Audience & Business Mapping</h3>
      <div class="step-body">
        <p>Who you serve. What they struggle with. How you help. What you can claim.</p>
        <p>We map your audience, your positioning, your offers, and your guardrails into structured context files.</p>
      </div>
    </div>

    <!-- Step 3: System Assembly -->
    <div class="step-card" class:visible={steps[2]}>
      <div class="step-connector"></div>
      <div class="step-header">
        <span class="step-number">03</span>
        <div class="step-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="18" width="8" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
            <rect x="16" y="18" width="8" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
            <rect x="4" y="10" width="8" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
            <rect x="16" y="10" width="8" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
            <rect x="10" y="3" width="8" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </div>
      </div>
      <h3 class="step-title">System Assembly</h3>
      <div class="step-body">
        <p>We build your Context Writing System:</p>
        <p>Voice DNA. Audience context. Business profile. Claims policy. Skills for your most common content types. Gold-standard examples from your best work.</p>
        <p class="step-highlight">Everything calibrated. Everything connected.</p>
      </div>
    </div>

    <!-- Step 4: Activation & Training -->
    <div class="step-card" class:visible={steps[3]}>
      <div class="step-connector"></div>
      <div class="step-header">
        <span class="step-number">04</span>
        <div class="step-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5L22 14L8 23V5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <path d="M22 14L26 10M22 14L26 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <h3 class="step-title">Activation & Training</h3>
      <div class="step-body">
        <p>Your system goes live.</p>
        <p>We show you how to use it. How to extend it. How to make it better over time.</p>
        <p class="step-highlight">This isn't a one-time deliverable. It's infrastructure that compounds.</p>
      </div>
    </div>
  </div>
</div>

<style>
  .offer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3rem;
    padding: 4rem 1rem;
    max-width: 44rem;
    margin: 0 auto;
  }

  /* ── Opening text ── */
  .opening {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .opening-line {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text, #f0ece2);
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.6s ease, transform 0.6s ease;
    line-height: 1.4;
  }
  .opening-line.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .opening-line.accent {
    color: var(--color-accent, #E94560);
    font-weight: 700;
  }

  @media (min-width: 768px) {
    .opening-line { font-size: 2rem; }
  }

  /* ── Timeline ── */
  .timeline {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 100%;
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  .timeline.visible {
    opacity: 1;
  }

  /* ── Step card ── */
  .step-card {
    position: relative;
    background: var(--color-surface, #111122);
    border: 1px solid color-mix(in srgb, var(--color-text-muted, #8892a4) 20%, transparent);
    border-radius: 12px;
    padding: 1.5rem 1.5rem 1.75rem;
    margin-left: 2rem;
    margin-bottom: 1.5rem;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .step-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Vertical connector line */
  .step-connector {
    position: absolute;
    left: -1.25rem;
    top: 0;
    bottom: -1.5rem;
    width: 2px;
    background: linear-gradient(
      to bottom,
      color-mix(in srgb, var(--color-accent, #E94560) 40%, transparent),
      color-mix(in srgb, var(--color-accent, #E94560) 15%, transparent)
    );
  }
  .step-card:last-child .step-connector {
    bottom: 0;
  }

  /* Dot on the timeline */
  .step-card::before {
    content: '';
    position: absolute;
    left: -1.5rem;
    top: 1.75rem;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--color-accent, #E94560);
    box-shadow: 0 0 8px color-mix(in srgb, var(--color-accent, #E94560) 50%, transparent);
  }

  .step-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .step-number {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-accent, #E94560);
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .step-icon {
    color: var(--color-accent, #E94560);
    opacity: 0.8;
    display: flex;
    align-items: center;
  }

  .step-title {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--color-text, #f0ece2);
    margin: 0 0 0.75rem;
    line-height: 1.3;
  }

  .step-body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .step-body p {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.95rem;
    font-weight: 400;
    color: var(--color-text-muted, #8892a4);
    line-height: 1.65;
    margin: 0;
  }

  .step-highlight {
    color: var(--color-text, #f0ece2) !important;
    font-weight: 500 !important;
    font-style: italic;
  }

  @media (min-width: 768px) {
    .step-card {
      padding: 2rem 2rem 2.25rem;
      margin-left: 2.5rem;
      margin-bottom: 2rem;
    }
    .step-connector {
      left: -1.5rem;
      bottom: -2rem;
    }
    .step-card:last-child .step-connector {
      bottom: 0;
    }
    .step-card::before {
      left: -1.8rem;
    }
    .step-number { font-size: 2rem; }
    .step-title { font-size: 1.3rem; }
    .step-body p { font-size: 1.05rem; }
  }
</style>
