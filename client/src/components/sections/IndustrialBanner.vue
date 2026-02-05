<template>
  <div class="industrial-banner row no-wrap items-stretch">
    <!-- Left: Content & CTA -->
    <div class="col-12 col-md-5 bg-dark text-white q-pa-xl flex column justify-center relative-position">
      <div class="accent-bar"></div>

      <div class="text-overline text-orange-9 q-mb-sm text-weight-bold tracking-widest">
        EST. 2024 // ANALOG MARKETPLACE
      </div>

      <div class="text-h2 font-mono text-weight-bolder text-uppercase leading-tight q-mb-md">
        ANALOG.<br>
        AUTHENTIC.<br>
        <span class="text-indigo-12 bg-white text-black q-px-sm">ALIVE</span>.
      </div>

      <div class="text-subtitle1 text-grey-5 q-mb-xl" style="max-width: 450px">
        The web's premier marketplace for vintage reel-to-reel decks,
        high-fidelity turntables, and rare analog gear. Authenticity guaranteed.
      </div>

      <div class="row q-gutter-md">
        <q-btn color="orange-9" text-color="white" label="BROWSE COLLECTION" class="q-px-lg q-py-sm text-weight-bold"
          unelevated no-caps @click="$router.push('/my-account')" />
        <q-btn outline color="white" label="SELL YOUR GEAR" class="q-px-lg q-py-sm text-weight-bold" no-caps />
      </div>

      <!-- Decorative industrial elements -->
      <div class="absolute-bottom-right q-pa-md text-grey-8 font-mono text-caption">
        SYS.STATUS: ONLINE<br>
        INV.COUNT: 428
      </div>
    </div>

    <!-- Right: Hero Image -->
    <div class="col-12 col-md-7 relative-position overflow-hidden">
      <q-img src="../../assets/banners/banner-2.webp" class="full-height" fit="cover">
        <template v-slot:loading>
          <q-spinner-dots color="white" />
        </template>
      </q-img>

      <!-- Overlay gradient -->
      <div class="absolute-full bg-gradient"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Using banner-2 as placeholder since generation failed
</script>

<style scoped>
.industrial-banner {
  min-height: 600px;
  border-bottom: 4px solid #F57C00;
  /* Orange-9 */
}

/* ... styles ... */
.tracking-widest {
  letter-spacing: 0.2em;
}

.leading-tight {
  line-height: 1.1;
}

.accent-bar {
  position: absolute;
  left: 0;
  top: 10%;
  bottom: 10%;
  width: 4px;
  background-color: #F57C00;
}

.bg-gradient {
  background: linear-gradient(to right, #1D1D1D 10%, transparent 100%);
  pointer-events: none;
}
</style>
