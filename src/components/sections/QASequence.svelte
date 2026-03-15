<script lang="ts">
  import { onMount } from "svelte";

  let el: HTMLDivElement;
  let running = $state(false);
  let timeouts: ReturnType<typeof setTimeout>[] = [];

  // Animation states
  let headerVisible = $state(false);
  let contentVisible = $state(false);
  let checksVisible = $state<boolean[]>([false, false, false, false, false]);
  let checksGreen = $state<boolean[]>([false, false, false, false, false]);
  let flagOrange = $state(false);
  let phraseHighlighted = $state(false);
  let phraseSwapped = $state(false);
  let flagResolved = $state(false);
  let finalVisible = $state(false);

  const checkItems = [
    "Voice alignment",
    "Claims verified",
    "Tone consistent",
    "Format compliant",
    "Humanization",
  ];

  const contentLines = [
    "Most AI content sounds like AI content.",
    "",
    "Not because the models are bad — because they start from zero every time.",
    "",
    "We built a system that fixes that. It loads your voice, your audience, your boundaries before a single word gets written.",
    "",
    { before: "The output drives unprecedented growth.", after: "The output drives real, measurable growth.", highlight: "unprecedented growth", highlightAfter: "real, measurable growth" },
    "It sounds like you — on your best day.",
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
    headerVisible = false;
    contentVisible = false;
    checksVisible = [false, false, false, false, false];
    checksGreen = [false, false, false, false, false];
    flagOrange = false;
    phraseHighlighted = false;
    phraseSwapped = false;
    flagResolved = false;
    finalVisible = false;
  }

  function startSequence() {
    reset();
    running = true;

    // Step 1: Header
    schedule(() => {
      headerVisible = true;
    }, 300);

    // Step 2: Content card
    schedule(() => {
      contentVisible = true;
    }, 1000);

    // Step 3: First 4 checks appear and turn green
    const checkStart = 1800;
    const checkStagger = 600;
    for (let i = 0; i < 4; i++) {
      schedule(() => {
        checksVisible[i] = true;
        checksVisible = [...checksVisible];
      }, checkStart + i * checkStagger);

      schedule(() => {
        checksGreen[i] = true;
        checksGreen = [...checksGreen];
      }, checkStart + i * checkStagger + 300);
    }

    // Step 4: Humanization check appears as orange flag
    const humanizeStart = checkStart + 4 * checkStagger;
    schedule(() => {
      checksVisible[4] = true;
      checksVisible = [...checksVisible];
      flagOrange = true;
    }, humanizeStart);

    // Highlight the phrase in the content
    schedule(() => {
      phraseHighlighted = true;
    }, humanizeStart + 600);

    // Swap the phrase
    schedule(() => {
      phraseSwapped = true;
    }, humanizeStart + 1800);

    // Resolve flag to green
    schedule(() => {
      flagOrange = false;
      flagResolved = true;
      checksGreen[4] = true;
      checksGreen = [...checksGreen];
      phraseHighlighted = false;
    }, humanizeStart + 2600);

    // Step 5: Final text
    schedule(() => {
      finalVisible = true;
    }, humanizeStart + 3600);
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
      { threshold: 0.12 }
    );
    intObs.observe(el);

    return () => {
      reset();
      intObs.disconnect();
    };
  });
</script>

<div bind:this={el} class="qa-container">
  <!-- Header -->
  <div class="qa-header" class:visible={headerVisible}>
    <span class="font-heading">Generate.</span>
    <span class="font-heading">Verify.</span>
    <span class="font-heading accent">Humanize.</span>
  </div>

  <!-- Main layout: content + checklist -->
  <div class="qa-body">
    <!-- Content card -->
    <div class="content-card" class:visible={contentVisible}>
      {#each contentLines as line}
        {#if line === ""}
          <div class="content-spacer"></div>
        {:else if typeof line === "object"}
          <p class="content-line">
            {#if !phraseSwapped}
              {line.before.split(line.highlight)[0]}<span
                class="highlight-phrase"
                class:highlighted={phraseHighlighted}
              >{line.highlight}</span>{line.before.split(line.highlight)[1] || ""}
            {:else}
              {line.after.split(line.highlightAfter)[0]}<span
                class="highlight-phrase resolved"
              >{line.highlightAfter}</span>{line.after.split(line.highlightAfter)[1] || ""}
            {/if}
          </p>
        {:else}
          <p class="content-line">{line}</p>
        {/if}
      {/each}
    </div>

    <!-- QA Checklist -->
    <div class="qa-checklist" class:visible={contentVisible}>
      <div class="checklist-title font-mono">QA Layer</div>
      {#each checkItems as item, i}
        <div
          class="check-item"
          class:visible={checksVisible[i]}
          class:green={checksGreen[i]}
          class:orange={i === 4 && flagOrange}
        >
          <div class="check-icon">
            {#if i === 4 && flagOrange && !flagResolved}
              <!-- Exclamation triangle SVG -->
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-flag">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            {:else}
              <!-- Checkmark SVG -->
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="icon-check">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            {/if}
          </div>
          <span class="check-text">
            {item}
            {#if i === 4 && flagResolved}
              <span class="pass-label">pass complete</span>
            {/if}
          </span>
        </div>
      {/each}
    </div>
  </div>

  <!-- Final text -->
  <div class="qa-final" class:visible={finalVisible}>
    The system doesn't just write. It catches what shouldn't ship.
  </div>
</div>

<style>
  .qa-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2.5rem;
    padding: 4rem 1rem;
    position: relative;
  }

  /* ── Header ── */
  .qa-header {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-text, #e0e0e0);
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.6s ease, transform 0.6s ease;
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  .qa-header.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .accent {
    color: var(--color-accent, #e94560);
  }

  /* ── Body layout ── */
  .qa-body {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    max-width: 56rem;
  }

  /* ── Content card ── */
  .content-card {
    background: var(--color-surface, #111122);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.06);
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .content-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .content-line {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.65;
    color: var(--color-text, #e0e0e0);
  }
  .content-spacer {
    height: 0.6rem;
  }

  .highlight-phrase {
    transition: background-color 0.4s ease, color 0.4s ease, padding 0.3s ease;
    border-radius: 3px;
    padding: 0 0;
  }
  .highlight-phrase.highlighted {
    background-color: rgba(255, 165, 0, 0.25);
    color: #ffa500;
    padding: 0.1rem 0.3rem;
  }
  .highlight-phrase.resolved {
    background-color: rgba(80, 200, 120, 0.15);
    color: #50c878;
    padding: 0.1rem 0.3rem;
  }

  /* ── QA Checklist ── */
  .qa-checklist {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  .qa-checklist.visible {
    opacity: 1;
  }

  .checklist-title {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-muted, #8892a4);
    margin-bottom: 0.25rem;
  }

  .check-item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    opacity: 0;
    transform: translateX(-8px);
    transition: opacity 0.4s ease, transform 0.4s ease;
    font-size: 0.9rem;
    color: var(--color-text-muted, #8892a4);
  }
  .check-item.visible {
    opacity: 1;
    transform: translateX(0);
  }
  .check-item.green {
    color: #50c878;
  }
  .check-item.orange {
    color: #ffa500;
  }

  .check-icon {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-check,
  .icon-flag {
    width: 100%;
    height: 100%;
  }

  .check-text {
    font-family: "Inter", system-ui, sans-serif;
    font-weight: 500;
  }

  .pass-label {
    font-family: "JetBrains Mono", "Fira Code", monospace;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: #50c878;
    margin-left: 0.5rem;
    opacity: 0.8;
  }

  /* ── Final text ── */
  .qa-final {
    text-align: center;
    font-family: "Inter", system-ui, sans-serif;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-muted, #8892a4);
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.6s ease, transform 0.6s ease;
    max-width: 40rem;
  }
  .qa-final.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Responsive ── */
  @media (min-width: 768px) {
    .qa-header {
      font-size: 2rem;
    }

    .qa-body {
      flex-direction: row;
      align-items: flex-start;
    }

    .content-card {
      flex: 1;
      padding: 2rem;
    }

    .qa-checklist {
      flex-shrink: 0;
      width: 14rem;
      padding-top: 0.5rem;
    }

    .content-line {
      font-size: 0.95rem;
    }

    .qa-final {
      font-size: 1.5rem;
    }
  }

  @media (min-width: 1024px) {
    .qa-header {
      font-size: 2.5rem;
    }
  }
</style>
