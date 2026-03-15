<script lang="ts">
  import { onMount } from "svelte";

  let el: HTMLDivElement;
  let running = $state(false);
  let timeouts: ReturnType<typeof setTimeout>[] = [];

  // Which layer is currently active (0 = none, 1-5 = layers)
  let activeLayer = $state(0);
  // Track which cards are visible (they accumulate)
  let cardsVisible = $state<boolean[]>([false, false, false, false, false]);
  // Track which descriptions are visible
  let descsVisible = $state<boolean[]>([false, false, false, false, false]);
  // Content preview transition state
  let previewFading = $state(false);
  // Current content preview index
  let previewIndex = $state(0);
  // For layer 5 format cycling
  let formatIndex = $state(0);
  let formatCycling = $state(false);

  interface Layer {
    filename: string;
    label: string;
    description: string;
    isSkill?: boolean;
  }

  const layers: Layer[] = [
    {
      filename: "voice-dna.json",
      label: "Layer 1: Voice DNA",
      description: "Your tone. Your rhythm. Your phrases. The emotional palette that makes your writing feel like yours.",
    },
    {
      filename: "icp.json",
      label: "Layer 2: Audience Context",
      description: "Who are you talking to? What keeps them up at night? What words do they use to describe their own problems?",
    },
    {
      filename: "claims-policy.json",
      label: "Layer 3: Claims Discipline",
      description: "What are you allowed to claim? What outcomes are verified? What language is banned?",
    },
    {
      filename: "business-profile.json",
      label: "Layer 4: Business Truth",
      description: "Your positioning. Your methodology. Your offers. So the AI never invents a service you don't offer.",
    },
    {
      filename: "skill",
      label: "The Format Layer: Skills",
      description: "A skill is a recipe for a specific content type. LinkedIn post. Cold email. Landing page. It defines structure and rules — but never the message.",
      isSkill: true,
    },
  ];

  interface PreviewState {
    label: string;
    lines: { text: string; flagged?: boolean; replacement?: string }[];
  }

  const previewStates: PreviewState[] = [
    // State 0: Generic baseline
    {
      label: "Draft Output",
      lines: [
        { text: "We are a leading provider of innovative solutions that help businesses achieve their goals through cutting-edge technology and dedicated service." },
        { text: "Our team of experts is passionate about delivering results that exceed expectations." },
        { text: "97% of our clients see 10x ROI within the first quarter." },
        { text: "Book a free consultation to learn more." },
      ],
    },
    // State 1: After Voice DNA — language becomes specific
    {
      label: "Draft Output",
      lines: [
        { text: "We build the infrastructure that makes your expertise scale. Not a chatbot. Not a template. A system that writes like you because it learned from you." },
        { text: "Our team of experts is passionate about delivering results that exceed expectations." },
        { text: "97% of our clients see 10x ROI within the first quarter." },
        { text: "Book a free consultation to learn more." },
      ],
    },
    // State 2: After Audience Context — speaks to their pain
    {
      label: "Draft Output",
      lines: [
        { text: "We build the infrastructure that makes your expertise scale. Not a chatbot. Not a template. A system that writes like you because it learned from you." },
        { text: "You've tried AI. It sounded wrong. Generic. Off-brand. You ended up rewriting everything. That's not a tool problem — it's a context problem." },
        { text: "97% of our clients see 10x ROI within the first quarter." },
        { text: "Book a free consultation to learn more." },
      ],
    },
    // State 3: After Claims Discipline — flag and fix
    {
      label: "Draft Output",
      lines: [
        { text: "We build the infrastructure that makes your expertise scale. Not a chatbot. Not a template. A system that writes like you because it learned from you." },
        { text: "You've tried AI. It sounded wrong. Generic. Off-brand. You ended up rewriting everything. That's not a tool problem — it's a context problem." },
        { text: "97% of our clients see 10x ROI within the first quarter.", flagged: true, replacement: "Teams using the CWS cut content revision cycles by half and publish with confidence." },
        { text: "Book a free consultation to learn more." },
      ],
    },
    // State 4: After Business Truth — specific CTA
    {
      label: "Draft Output",
      lines: [
        { text: "We build the infrastructure that makes your expertise scale. Not a chatbot. Not a template. A system that writes like you because it learned from you." },
        { text: "You've tried AI. It sounded wrong. Generic. Off-brand. You ended up rewriting everything. That's not a tool problem — it's a context problem." },
        { text: "Teams using the CWS cut content revision cycles by half and publish with confidence." },
        { text: "See how CWS works for your team — book a 30-minute system walkthrough." },
      ],
    },
    // State 5: After Skills — format cycling shown separately
    {
      label: "LinkedIn Post",
      lines: [
        { text: "We build the infrastructure that makes your expertise scale. Not a chatbot. Not a template. A system that writes like you because it learned from you." },
        { text: "You've tried AI. It sounded wrong. Generic. Off-brand. You ended up rewriting everything. That's not a tool problem — it's a context problem." },
        { text: "Teams using the CWS cut content revision cycles by half and publish with confidence." },
        { text: "See how CWS works for your team — book a 30-minute system walkthrough." },
      ],
    },
  ];

  const formatLabels = ["LinkedIn Post", "Cold Email", "Landing Page"];

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
    activeLayer = 0;
    cardsVisible = [false, false, false, false, false];
    descsVisible = [false, false, false, false, false];
    previewFading = false;
    previewIndex = 0;
    formatIndex = 0;
    formatCycling = false;
  }

  function transitionPreview(toIndex: number) {
    previewFading = true;
    schedule(() => {
      previewIndex = toIndex;
      previewFading = false;
    }, 400);
  }

  function startSequence() {
    reset();
    running = true;

    let t = 600;
    const layerGap = 3200;

    layers.forEach((_, i) => {
      const layerStart = t + i * layerGap;

      // Card appears
      schedule(() => {
        cardsVisible[i] = true;
        cardsVisible = [...cardsVisible];
        activeLayer = i + 1;
      }, layerStart);

      // Description appears
      schedule(() => {
        descsVisible[i] = true;
        descsVisible = [...descsVisible];
      }, layerStart + 500);

      // Preview transitions
      schedule(() => {
        transitionPreview(i + 1);
      }, layerStart + 1200);

      // For layer 5 (Skills) — cycle through formats
      if (i === 4) {
        schedule(() => {
          formatCycling = true;
          formatIndex = 0;
        }, layerStart + 2000);

        schedule(() => {
          previewFading = true;
          schedule(() => {
            formatIndex = 1;
            previewFading = false;
          }, 350);
        }, layerStart + 3200);

        schedule(() => {
          previewFading = true;
          schedule(() => {
            formatIndex = 2;
            previewFading = false;
          }, 350);
        }, layerStart + 4400);
      }
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

  function getCurrentPreview(): PreviewState {
    const state = previewStates[previewIndex] || previewStates[0];
    if (formatCycling && previewIndex === 5) {
      return { ...state, label: formatLabels[formatIndex] || formatLabels[0] };
    }
    return state;
  }

  let currentPreview = $derived(getCurrentPreview());
</script>

<div bind:this={el} class="system-container">
  <div class="system-layout">
    <!-- Left: File cards stack -->
    <div class="cards-column">
      <div class="cards-label">Context Files</div>
      <div class="cards-stack">
        {#each layers as layer, i}
          <div
            class="layer-card"
            class:visible={cardsVisible[i]}
            class:active={activeLayer === i + 1}
            class:skill-card={layer.isSkill}
          >
            <div class="card-header">
              <span class="card-icon">
                {#if layer.isSkill}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                {:else}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                {/if}
              </span>
              <span class="card-filename">{layer.filename}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Right: Active layer info + content preview -->
    <div class="detail-column">
      <!-- Layer description -->
      <div class="layer-descriptions">
        {#each layers as layer, i}
          <div
            class="layer-desc"
            class:visible={descsVisible[i] && activeLayer === i + 1}
          >
            <div class="layer-label">{layer.label}</div>
            <div class="layer-text">{layer.description}</div>
          </div>
        {/each}
      </div>

      <!-- Content preview -->
      <div class="preview-area" class:fading={previewFading}>
        <div class="preview-label">
          <span class="preview-label-dot"></span>
          {currentPreview.label}
        </div>
        <div class="preview-content">
          {#each currentPreview.lines as line, i}
            <div class="preview-line" class:flagged={line.flagged}>
              {#if line.flagged}
                <div class="flagged-original">
                  <span class="flag-badge">UNVERIFIED CLAIM</span>
                  <span class="flagged-text">{line.text}</span>
                </div>
                <div class="flagged-replacement">
                  {line.replacement}
                </div>
              {:else}
                {line.text}
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .system-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem 1.5rem;
    position: relative;
  }

  .system-layout {
    display: flex;
    gap: 2.5rem;
    max-width: 64rem;
    width: 100%;
    align-items: flex-start;
  }

  /* ── Cards column ── */
  .cards-column {
    flex-shrink: 0;
    width: 14rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .cards-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--color-text-muted, #8888A0);
    padding-left: 0.25rem;
    margin-bottom: 0.25rem;
  }

  .cards-stack {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .layer-card {
    background: var(--color-surface, #111122);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-left: 3px solid rgba(233, 69, 96, 0.3);
    border-radius: 6px;
    padding: 0.6rem 0.75rem;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.5s ease, transform 0.5s ease, border-color 0.4s ease, box-shadow 0.4s ease;
  }
  .layer-card.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .layer-card.active {
    border-left-color: var(--color-accent, #E94560);
    box-shadow: 0 0 12px rgba(233, 69, 96, 0.1);
  }
  .layer-card.skill-card {
    border-left-color: rgba(100, 200, 255, 0.3);
  }
  .layer-card.skill-card.active {
    border-left-color: #64C8FF;
    box-shadow: 0 0 12px rgba(100, 200, 255, 0.15);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 0.45rem;
  }
  .card-icon {
    color: var(--color-accent, #E94560);
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  .skill-card .card-icon {
    color: #64C8FF;
  }
  .card-filename {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    color: var(--color-text-muted, #8888A0);
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .layer-card.active .card-filename {
    color: var(--color-text, #F0EDE6);
  }

  /* ── Detail column ── */
  .detail-column {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* ── Layer descriptions ── */
  .layer-descriptions {
    position: relative;
    min-height: 5rem;
  }
  .layer-desc {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.45s ease, transform 0.45s ease;
    pointer-events: none;
  }
  .layer-desc.visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
    position: relative;
  }

  .layer-label {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--color-accent, #E94560);
    margin-bottom: 0.4rem;
  }
  .skill-card ~ .layer-desc .layer-label {
    color: #64C8FF;
  }
  .layer-text {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.95rem;
    color: var(--color-text-muted, #8888A0);
    line-height: 1.6;
  }

  /* ── Preview area ── */
  .preview-area {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 8px;
    padding: 1.25rem;
    transition: opacity 0.35s ease;
    position: relative;
  }
  .preview-area.fading {
    opacity: 0.3;
  }

  .preview-label {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-text-muted, #8888A0);
    margin-bottom: 1rem;
    padding-bottom: 0.6rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  .preview-label-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-accent, #E94560);
    flex-shrink: 0;
  }

  .preview-content {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }
  .preview-line {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.9rem;
    color: var(--color-text, #F0EDE6);
    line-height: 1.6;
    transition: opacity 0.3s ease;
  }

  /* ── Flagged claim ── */
  .flagged {
    border-left: 3px solid rgba(233, 69, 96, 0.6);
    padding-left: 0.75rem;
    background: rgba(233, 69, 96, 0.04);
    border-radius: 0 4px 4px 0;
    padding: 0.6rem 0.75rem;
  }
  .flagged-original {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    margin-bottom: 0.5rem;
  }
  .flag-badge {
    display: inline-block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.55rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-accent, #E94560);
    background: rgba(233, 69, 96, 0.12);
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
    width: fit-content;
  }
  .flagged-text {
    text-decoration: line-through;
    color: var(--color-text-muted, #8888A0);
    font-size: 0.85rem;
    opacity: 0.6;
  }
  .flagged-replacement {
    font-size: 0.9rem;
    color: var(--color-text, #F0EDE6);
    padding-left: 0.1rem;
  }

  /* ── Responsive ── */
  @media (min-width: 768px) {
    .cards-column { width: 16rem; }
    .card-filename { font-size: 0.75rem; }
    .layer-label { font-size: 1.25rem; }
    .layer-text { font-size: 1.05rem; }
    .preview-line { font-size: 0.95rem; }
  }

  @media (max-width: 768px) {
    .system-layout {
      flex-direction: column;
      gap: 1.5rem;
    }
    .cards-column {
      width: 100%;
    }
    .cards-stack {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .layer-card {
      flex: 0 0 auto;
      padding: 0.45rem 0.6rem;
    }
    .layer-descriptions {
      min-height: 4rem;
    }
  }
</style>
