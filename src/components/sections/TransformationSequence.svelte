<script lang="ts">
  import { onMount } from "svelte";

  let el: HTMLDivElement;
  let running = $state(false);
  let timeouts: ReturnType<typeof setTimeout>[] = [];

  // Animation states
  let headerLine1 = $state(false);
  let headerLine2 = $state(false);
  let cardVisible = $state<boolean[]>([false, false, false]);

  interface Comparison {
    title: string;
    without: string;
    with: string;
  }

  const comparisons: Comparison[] = [
    {
      title: "LinkedIn Post",
      without: `Excited to share that we've been working on some amazing things! Our team is passionate about delivering innovative solutions that help businesses thrive in today's competitive landscape.\n\n#Innovation #Growth #Leadership`,
      with: `Most AI content sounds like AI content.\n\nNot because the models are bad — because they start from zero every time.\n\nNo voice. No memory. No guardrails.\n\nWe built a system that fixes that. It loads your voice, your audience, your boundaries before a single word gets written.\n\nThe output doesn't sound like AI. It sounds like you — on your best day.`,
    },
    {
      title: "Cold Email",
      without: `Hi [Name],\n\nI hope this email finds you well! I wanted to reach out because I believe our services could really benefit your organization. We offer cutting-edge AI solutions that drive results.\n\nWould you be open to a quick call?`,
      with: `[Name] —\n\nYour content team is publishing 4x more than last year. But your brand voice is fragmenting across channels.\n\nThat's not a content problem. It's a context problem.\n\nWe build the system layer that sits between your brand and AI — so output stays consistent, grounded, and human no matter who's producing it.\n\nWorth 20 minutes to show you how it works?`,
    },
    {
      title: "Website Hero",
      without: `Empowering Your Business with AI-Driven Solutions\n\nWe leverage cutting-edge artificial intelligence to transform your workflows and drive unprecedented growth.\n\n[Get Started Today]`,
      with: `AI Without Memory Produces Content Without Soul\n\nThe Context Writing System is the missing layer — custom voice infrastructure that makes AI sound like you, not like AI.\n\n[Start Your Voice Discovery]`,
    },
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
    headerLine1 = false;
    headerLine2 = false;
    cardVisible = [false, false, false];
  }

  function startSequence() {
    reset();
    running = true;

    // Header line 1
    schedule(() => {
      headerLine1 = true;
    }, 300);

    // Header line 2
    schedule(() => {
      headerLine2 = true;
    }, 1000);

    // Cards appear one at a time
    const cardStart = 1800;
    const cardStagger = 1200;
    comparisons.forEach((_, i) => {
      schedule(() => {
        cardVisible[i] = true;
        cardVisible = [...cardVisible];
      }, cardStart + i * cardStagger);
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
      { threshold: 0.08 }
    );
    intObs.observe(el);

    return () => {
      reset();
      intObs.disconnect();
    };
  });
</script>

<div bind:this={el} class="transformation-container">
  <!-- Header -->
  <div class="header">
    <div class="header-line" class:visible={headerLine1}>
      Same AI. Same prompt. Same model.
    </div>
    <div class="header-line header-accent" class:visible={headerLine2}>
      The only difference is context.
    </div>
  </div>

  <!-- Comparison cards -->
  <div class="cards">
    {#each comparisons as comp, i}
      <div class="comparison-card" class:visible={cardVisible[i]}>
        <div class="card-title font-mono">{comp.title}</div>
        <div class="card-columns">
          <!-- WITHOUT side -->
          <div class="card-side without-side">
            <div class="side-label without-label">Without System</div>
            <div class="side-content without-content">
              {#each comp.without.split("\n") as line}
                {#if line === ""}
                  <br />
                {:else}
                  <p>{line}</p>
                {/if}
              {/each}
            </div>
          </div>
          <!-- WITH side -->
          <div class="card-side with-side">
            <div class="side-label with-label">With System</div>
            <div class="side-content with-content">
              {#each comp.with.split("\n") as line}
                {#if line === ""}
                  <br />
                {:else}
                  <p>{line}</p>
                {/if}
              {/each}
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .transformation-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    padding: 4rem 1rem;
    position: relative;
  }

  /* ── Header ── */
  .header {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .header-line {
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.6s ease, transform 0.6s ease;
    font-family: "Inter", system-ui, sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-text, #e0e0e0);
    line-height: 1.3;
  }
  .header-line.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .header-accent {
    color: var(--color-accent, #e94560);
  }

  /* ── Cards container ── */
  .cards {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    width: 100%;
    max-width: 64rem;
  }

  /* ── Comparison card ── */
  .comparison-card {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.7s ease, transform 0.7s ease;
    background: var(--color-surface, #111122);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.06);
  }
  .comparison-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .card-title {
    padding: 1rem 1.5rem;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-text-muted, #8892a4);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .card-columns {
    display: flex;
    flex-direction: column;
  }

  .card-side {
    padding: 1.5rem;
    flex: 1;
  }

  .without-side {
    background: rgba(233, 69, 96, 0.04);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .with-side {
    background: rgba(80, 200, 120, 0.04);
  }

  /* ── Labels ── */
  .side-label {
    font-family: "JetBrains Mono", "Fira Code", monospace;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 1rem;
    padding: 0.25rem 0.6rem;
    border-radius: 4px;
    display: inline-block;
  }
  .without-label {
    color: #e94560;
    background: rgba(233, 69, 96, 0.12);
  }
  .with-label {
    color: #50c878;
    background: rgba(80, 200, 120, 0.12);
  }

  /* ── Content ── */
  .side-content {
    font-size: 0.9rem;
    line-height: 1.65;
  }
  .side-content p {
    margin: 0;
  }
  .side-content br {
    display: block;
    content: "";
    margin-top: 0.5rem;
  }

  .without-content {
    color: var(--color-text-muted, #8892a4);
    opacity: 0.7;
  }
  .with-content {
    color: var(--color-text, #e0e0e0);
  }

  /* ── Responsive: side by side on desktop ── */
  @media (min-width: 768px) {
    .header-line {
      font-size: 2rem;
    }

    .card-columns {
      flex-direction: row;
    }

    .without-side {
      border-bottom: none;
      border-right: 1px solid rgba(255, 255, 255, 0.06);
    }

    .card-side {
      padding: 2rem;
    }

    .side-content {
      font-size: 0.95rem;
    }
  }

  @media (min-width: 1024px) {
    .header-line {
      font-size: 2.5rem;
    }

    .side-content {
      font-size: 1rem;
    }
  }
</style>
