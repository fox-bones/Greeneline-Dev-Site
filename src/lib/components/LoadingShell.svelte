<div class="shell wrap" role="status">
  <span class="sr-only">Loading</span>
  <i class="bar small"></i>
  <i class="bar large"></i>
  <i class="bar"></i>
  <i class="bar short"></i>
</div>

<style>
  .shell {
    display: grid;
    align-content: center;
    gap: 16px;
    min-height: 100svh;
    /* Waits a moment so fast connections never see a flash of placeholders. */
    animation: appear 0.2s 0.18s both;
  }

  .bar {
    display: block;
    width: min(100%, 620px);
    height: 20px;
    border-radius: 6px;
    background: linear-gradient(90deg, var(--surface), var(--surface-2), var(--surface));
    background-size: 220% 100%;
    animation: shimmer 1.4s linear infinite;
  }

  .small {
    width: 220px;
    height: 13px;
  }

  .large {
    width: min(100%, 560px);
    height: 82px;
  }

  .short {
    width: min(70%, 420px);
  }

  @keyframes appear {
    from {
      opacity: 0;
    }
  }

  @keyframes shimmer {
    to {
      background-position: -220% 0;
    }
  }
</style>
