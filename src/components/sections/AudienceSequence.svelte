<script lang="ts">
  import { onMount } from "svelte";

  let el: HTMLDivElement;
  let running = $state(false);
  let timeouts: ReturnType<typeof setTimeout>[] = [];

  let cardVisible = $state<boolean[]>([false, false, false]);

  interface AudienceCard {
    title: string;
    problem: string;
    value: string;
  }

  const audiences: AudienceCard[] = [
    {
      title: "Solopreneurs & Founders",
      problem:
        "You're the voice of your brand. But you can't write everything yourself.",
      value:
        "AI writes it. You approve it. It sounds like you. Every time.",
    },
    {
      title: "Marketing Leaders & Brand Operators",
      problem:
        "Your team is growing. Your content is scaling. Your voice is starting to drift.",
      value:
        "One source of truth. Every channel. Every team member. Brand voice that scales without dilution.",
    },
    {
      title: "Agencies & Consultants",
      problem:
        "Every client has a different voice. You can't keep it all in your head.",
      value:
        "Each client gets their own voice, audience, and guardrails. Quality becomes repeatable without becoming generic.",
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
    cardVisible = [false, false, false];
  }

  function startSequence() {
    reset();
    running = true;

    const stagger = 400;
    audiences.forEach((_, i) => {
      schedule(() => {
        cardVisible[i] = true;
        cardVisible = [...cardVisible];
      }, 400 + i * stagger);
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
      { threshold: 0.12 }
    );
    intObs.observe(el);

    return () => {
      reset();
      intObs.disconnect();
    };
  });
</script>

<div bind:this={el} class="audience-container">
  <div class="audience-grid">
    {#each audiences as card, i}
      <div class="audience-card" class:visible={cardVisible[i]}>
        <div class="card-title font-mono">{card.title}</div>
        <p class="card-problem">{card.problem}</p>
        <div class="card-separator">
          <span class="separator-text">Your Context Writing System means:</span>
        </div>
        <p class="card-value">{card.value}</p>
      </div>
    {/each}
  </div>
</div>

<style>
  .audience-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 1rem;
    position: relative;
  }

  /* ── Grid ── */
  .audience-grid {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 72rem;
  }

  /* ── Card ── */
  .audience-card {
    background: var(--color-surface, #111122);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-left: 3px solid var(--color-accent, #e94560);
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .audience-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .card-title {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-accent, #e94560);
    margin-bottom: 1rem;
  }

  .card-problem {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.65;
    color: var(--color-text-muted, #8892a4);
  }

  .card-separator {
    margin: 1.25rem 0;
    padding: 0.75rem 0;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .separator-text {
    font-family: "JetBrains Mono", "Fira Code", monospace;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--color-text-muted, #8892a4);
    opacity: 0.7;
  }

  .card-value {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.65;
    color: var(--color-text, #e0e0e0);
    font-weight: 500;
  }

  /* ── Responsive: 3 columns ── */
  @media (min-width: 768px) {
    .audience-card {
      padding: 2rem;
    }

    .card-problem {
      font-size: 1rem;
    }

    .card-value {
      font-size: 1.1rem;
    }
  }

  @media (min-width: 1024px) {
    .audience-grid {
      flex-direction: row;
      gap: 1.5rem;
    }

    .audience-card {
      flex: 1;
    }
  }
</style>
