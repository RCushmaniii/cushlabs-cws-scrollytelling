<script lang="ts">
  import { onMount } from "svelte";
  import {
    presentationState,
    startPresentation,
    viewSiteMode,
  } from "@/lib/presentation";

  let state = $state<"overlay" | "presenting" | "browsing">("overlay");
  let fadeOut = $state(false);
  let autoLaunch = $state(false);

  onMount(() => {
    presentationState.subscribe((s) => {
      if (s !== "overlay" && state === "overlay") {
        fadeOut = true;
        setTimeout(() => {
          state = s;
          fadeOut = false;
        }, 600);
      } else {
        state = s;
        fadeOut = false;
      }
    });

    // URL parameter: ?mode=prez for auto-launch
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "prez") {
      autoLaunch = true;
    }
  });

  function handlePlay() {
    startPresentation();
  }

  function handleBrowse() {
    viewSiteMode();
  }
</script>

{#if state === "overlay"}
  <div
    class="presentation-overlay fixed inset-0 z-[300] flex items-center justify-center bg-[var(--color-background)]/95 backdrop-blur-sm"
    class:fade-out={fadeOut}
  >
    {#if autoLaunch}
      <!-- Streamlined auto-launch: tap target to unlock audio + start -->
      <div class="text-center px-6 max-w-2xl">
        <div class="mb-8 opacity-60">
          <span class="font-mono text-xs tracking-[0.4em] uppercase text-[var(--color-accent)]">
            Context Writing System
          </span>
        </div>

        <h1 class="font-heading text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-[var(--color-text)] leading-[1.1]">
          Your Content,<br/><span class="text-[var(--color-accent)]">Your Voice</span>
        </h1>

        <button
          onclick={handlePlay}
          class="auto-launch-btn group px-10 py-5 bg-[var(--color-accent)] text-[var(--color-background)] font-semibold text-lg rounded-full transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 mx-auto"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span>Tap to Begin</span>
        </button>
      </div>
    {:else}
      <!-- Standard overlay with full options -->
      <div class="text-center px-6 max-w-2xl">
        <div class="mb-8 opacity-60">
          <span class="font-mono text-xs tracking-[0.4em] uppercase text-[var(--color-accent)]">
            Context Writing System
          </span>
        </div>

        <h1 class="font-heading text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-[var(--color-text)] leading-[1.1]">
          Your Content,<br/><span class="text-[var(--color-accent)]">Your Voice</span>
        </h1>

        <p class="text-lg text-[var(--color-text-muted)] mb-12 max-w-lg mx-auto">
          AI doesn't know who you are. The Context Writing System changes that.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onclick={handlePlay}
            class="group px-8 py-4 bg-[var(--color-accent)] text-[var(--color-background)] font-semibold rounded-full transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>Play Presentation</span>
          </button>

          <button
            onclick={handleBrowse}
            class="px-8 py-4 border-2 border-white/20 text-[var(--color-text)] font-semibold rounded-full transition-all duration-300 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Browse Freely
          </button>
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .presentation-overlay {
    transition: opacity 0.6s ease-out;
  }
  .presentation-overlay.fade-out {
    opacity: 0;
    pointer-events: none;
  }
  .auto-launch-btn {
    animation: pulse-glow 2s ease-in-out infinite;
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 0 0 var(--color-accent); }
    50% { box-shadow: 0 0 20px 4px var(--color-accent); }
  }
</style>
