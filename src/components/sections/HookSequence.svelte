<script lang="ts">
  import { onMount } from "svelte";

  let el: HTMLDivElement;
  let running = $state(false);
  let timeouts: ReturnType<typeof setTimeout>[] = [];

  // Animation states
  let genericLines = $state<boolean[]>([false, false, false, false, false, false, false]);
  let genericDimmed = $state(false);
  let commentaryLines = $state<boolean[]>([false, false, false, false]);

  const genericContent = [
    { text: "\u201CWe\u2019re passionate about helping businesses grow.\u201D", style: "sans" },
    { text: "\u201CIn today\u2019s fast-paced digital landscape, staying ahead requires innovation.\u201D", style: "serif" },
    { text: "\u201CHi [Name], I hope this email finds you well!\u201D", style: "mono" },
    { text: "\u201COur team of experts delivers cutting-edge solutions tailored to your needs.\u201D", style: "sans-alt" },
    { text: "\u201CReady to take your business to the next level? Let\u2019s connect.\u201D", style: "serif-alt" },
    { text: "\u201CExcited to share some amazing news! \uD83D\uDE80\u201D", style: "sans" },
    { text: "\u201CWe leverage AI to empower teams and drive unprecedented growth.\u201D", style: "serif" },
  ];

  const commentaryContent = [
    { text: "This is what AI sounds like without memory.", accent: true, large: true },
    { text: "Every prompt starts from zero.", accent: false, large: false },
    { text: "No voice. No guardrails. No context.", accent: false, large: false },
    { text: "Just\u2026 language.", accent: false, large: false },
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
    commentaryLines = [false, false, false, false];
  }

  function startSequence() {
    reset();
    running = true;

    // Step 1: Generic lines fade in one by one
    const lineDelay = 600;
    genericContent.forEach((_, i) => {
      schedule(() => {
        genericLines[i] = true;
        genericLines = [...genericLines];
      }, 400 + i * lineDelay);
    });

    // Step 2: After all lines land, pause then dim
    const allLinesDone = 400 + genericContent.length * lineDelay;
    schedule(() => {
      genericDimmed = true;
    }, allLinesDone + 800);

    // Step 3: Commentary lines appear one at a time
    const commentaryStart = allLinesDone + 1400;
    commentaryContent.forEach((_, i) => {
      schedule(() => {
        commentaryLines[i] = true;
        commentaryLines = [...commentaryLines];
      }, commentaryStart + i * 700);
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

<div bind:this={el} class="hook-container">
  <!-- Generic AI lines -->
  <div class="generic-wall" class:dimmed={genericDimmed}>
    {#each genericContent as line, i}
      <div
        class="generic-line generic-{line.style}"
        class:visible={genericLines[i]}
      >
        {line.text}
      </div>
    {/each}
  </div>

  <!-- Commentary -->
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
  </div>
</div>

<style>
  .hook-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    padding: 2rem 1rem;
    position: relative;
  }

  /* ── Generic AI wall ── */
  .generic-wall {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    transition: opacity 0.8s ease, filter 0.8s ease;
  }
  .generic-wall.dimmed {
    opacity: 0.25;
    filter: blur(2px);
  }

  .generic-line {
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.6s ease, transform 0.6s ease;
    text-align: center;
    line-height: 1.4;
    color: var(--color-text-muted, #8892a4);
  }
  .generic-line.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Different "brand" styling for each line */
  .generic-sans {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1.125rem;
    font-weight: 400;
    letter-spacing: 0.01em;
  }
  .generic-serif {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 1.25rem;
    font-style: italic;
    font-weight: 400;
  }
  .generic-mono {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.95rem;
    font-weight: 400;
    letter-spacing: -0.02em;
  }
  .generic-sans-alt {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1.05rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.85rem;
  }
  .generic-serif-alt {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 1.3rem;
    font-weight: 400;
  }

  /* ── Commentary ── */
  .commentary {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  .commentary.active {
    opacity: 1;
  }

  .commentary-line {
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.5s ease, transform 0.5s ease;
    text-align: center;
    line-height: 1.5;
  }
  .commentary-line.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .commentary-line.large {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1.75rem;
    font-weight: 700;
  }
  .commentary-line.accent {
    color: var(--color-accent, #E94560);
  }
  .commentary-line.muted {
    color: var(--color-text-muted, #8892a4);
    font-size: 1.125rem;
    font-weight: 400;
  }

  /* ── Responsive ── */
  @media (min-width: 768px) {
    .generic-sans { font-size: 1.35rem; }
    .generic-serif { font-size: 1.5rem; }
    .generic-mono { font-size: 1.1rem; }
    .generic-sans-alt { font-size: 1rem; }
    .generic-serif-alt { font-size: 1.55rem; }
    .commentary-line.large { font-size: 2.25rem; }
    .commentary-line.muted { font-size: 1.35rem; }
  }
</style>
