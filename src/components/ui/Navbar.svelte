<script lang="ts">
  import { onMount } from "svelte";
  import { isPlaying, togglePlayback, audioEnabled } from "@/lib/audio";
  import { presentationState, togglePresentationPlayback } from "@/lib/presentation";

  let playing = $state(false);
  let hasAudio = $state(false);
  let presState = $state<"overlay" | "presenting" | "browsing">("overlay");
  let scrolled = $state(false);

  onMount(() => {
    const unsubs = [
      isPlaying.subscribe((val) => { playing = val; }),
      audioEnabled.subscribe((val) => { hasAudio = val; }),
      presentationState.subscribe((s) => { presState = s; }),
    ];

    function onScroll() {
      scrolled = window.scrollY > 20;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      unsubs.forEach((u) => u());
      window.removeEventListener("scroll", onScroll);
    };
  });

  function exitPres() {
    import("@/lib/presentation").then(m => m.exitPresentation());
  }

  function handlePlayPause() {
    if (presState === "presenting") {
      togglePresentationPlayback();
    } else {
      togglePlayback();
    }
  }
</script>

{#if presState !== "overlay"}
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    class:scrolled
  >
    <div class="max-w-[1440px] mx-auto flex items-center justify-between px-4 py-3">
      <!-- Left: brand + audio toggle -->
      <div class="flex items-center gap-3">
        <span class="font-mono text-xs tracking-[0.3em] uppercase text-[var(--color-accent)] opacity-80">
          CWS
        </span>
        {#if hasAudio}
          <button
            class="nav-btn w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300"
            onclick={handlePlayPause}
            aria-label={playing ? "Pause" : "Play"}
          >
            {#if playing}
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            {:else}
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            {/if}
          </button>
        {/if}
      </div>

      <!-- Right: context-dependent actions -->
      <div class="flex items-center gap-2">
        {#if presState === "presenting"}
          <button
            onclick={exitPres}
            class="nav-btn px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300"
          >
            Exit
          </button>
        {/if}
        {#if presState === "browsing"}
          <a
            href="#close"
            class="nav-btn-cta px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300 no-underline"
          >
            Start Your Voice Discovery
          </a>
        {/if}
      </div>
    </div>
  </nav>
{/if}

<style>
  nav {
    background: transparent;
  }
  nav.scrolled {
    background: rgba(10, 10, 10, 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .nav-btn {
    color: var(--color-text-muted);
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .nav-btn:hover {
    color: var(--color-accent);
    background: rgba(0, 0, 0, 0.6);
  }

  .nav-btn-cta {
    color: var(--color-background);
    background: var(--color-accent);
    border: 1px solid var(--color-accent);
  }
  .nav-btn-cta:hover {
    opacity: 0.85;
  }
</style>
