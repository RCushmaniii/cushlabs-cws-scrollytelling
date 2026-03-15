<script lang="ts">
  const year = new Date().getFullYear();
</script>

<footer class="relative z-10 border-t border-white/5 bg-[var(--color-background)]">
  <div class="max-w-[1200px] mx-auto px-6 pt-16 pb-8">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
      <!-- Brand -->
      <div>
        <a href="/" class="inline-block font-heading text-xl font-bold text-[var(--color-text)] mb-3 hover:opacity-80 transition-opacity">
          CUSH<span class="text-[var(--color-accent)]">LABS</span>
        </a>
        <p class="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4 max-w-[280px]">
          AI voice infrastructure that makes your content sound like you — not like AI.
        </p>
        <p class="text-xs text-[var(--color-text-muted)] flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-[var(--color-accent)] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          Guadalajara, Mexico
        </p>
      </div>

      <!-- What We Build -->
      <div>
        <h4 class="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-[var(--color-text)] mb-4">
          What We Build
        </h4>
        <ul class="space-y-2.5">
          <li><span class="text-sm text-[var(--color-text-muted)]">Context Writing Systems</span></li>
          <li><span class="text-sm text-[var(--color-text-muted)]">Voice DNA Profiles</span></li>
          <li><span class="text-sm text-[var(--color-text-muted)]">Content Skills Libraries</span></li>
          <li><span class="text-sm text-[var(--color-text-muted)]">AI Voice Infrastructure</span></li>
        </ul>
      </div>

      <!-- Connect -->
      <div>
        <h4 class="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-[var(--color-text)] mb-4">
          Connect
        </h4>
        <ul class="space-y-2.5">
          <li>
            <a href="https://cushlabs.ai" target="_blank" rel="noopener noreferrer" class="footer-link flex items-center gap-2">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/>
              </svg>
              cushlabs.ai
            </a>
          </li>
          <li>
            <a href="https://github.com/RCushmaniii" target="_blank" rel="noopener noreferrer" class="footer-link flex items-center gap-2">
              <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </li>
          <li>
            <a href="https://linkedin.com/in/robertcushman" target="_blank" rel="noopener noreferrer" class="footer-link flex items-center gap-2">
              <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
      <p class="text-xs text-[var(--color-text-muted)]">
        &copy; {year} CushLabs AI Services. All rights reserved.
      </p>
      <p class="text-xs text-[var(--color-text-muted)] opacity-60">
        Robert Cushman &middot; <a href="https://cushlabs.ai" target="_blank" rel="noopener noreferrer" class="hover:text-[var(--color-accent)] transition-colors">cushlabs.ai</a>
      </p>
    </div>
  </div>
</footer>

<style>
  .footer-link {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    text-decoration: none;
    transition: color 0.2s;
  }
  .footer-link:hover {
    color: var(--color-accent);
  }
</style>
