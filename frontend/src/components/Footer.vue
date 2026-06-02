<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
    <footer class="comfy-footer">
      <div class="footer-top">
        <div class="container-fluid px-4 px-lg-5">
          <div class="footer-grid">
            <div class="footer-brand-col">
              <h2 class="footer-brand">ComfyHome</h2>
              <p class="footer-brand-tagline">{{ $t('footer.tagline') }}</p>
            </div>

            <div class="footer-links-col">
              <h6 class="footer-col-title">{{ $t('footer.products') }}</h6>
              <ul>
                <li><router-link to="/products?type=living-room">{{ $t('footer.livingRoom') }}</router-link></li>
                <li><router-link to="/products?type=study-room">{{ $t('footer.studyRoom') }}</router-link></li>
                <li><router-link to="/products?type=kitchen">{{ $t('footer.kitchen') }}</router-link></li>
              </ul>
            </div>

            <div class="footer-links-col">
              <h6 class="footer-col-title footer-col-title--hidden">{{ $t('footer.products') }}</h6>
              <ul>
                <li><router-link to="/products?type=bathroom">{{ $t('footer.bathroom') }}</router-link></li>
                <li><router-link to="/products?type=bedroom">{{ $t('footer.bedroom') }}</router-link></li>
                <li><router-link to="/products">{{ $t('footer.allProducts') }}</router-link></li>
              </ul>
            </div>

            <div class="footer-links-col">
              <h6 class="footer-col-title">{{ $t('footer.navigate') }}</h6>
              <ul>
                <li><router-link to="/">{{ $t('footer.home') }}</router-link></li>
                <li><router-link to="/products">{{ $t('nav.links.products') }}</router-link></li>
                <li><router-link to="/showcase">{{ $t('nav.links.showcase') }}</router-link></li>
                <li><router-link to="/customize">{{ $t('nav.links.customize') }}</router-link></li>
                <li><router-link to="/profile">{{ $t('footer.myProfile') }}</router-link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container-fluid px-4 px-lg-5 d-flex justify-content-center flex-wrap gap-2">
          <span class="footer-copy">{{ $t('footer.copyright', { year: new Date().getFullYear() }) }}</span>
        </div>
      </div>
    </footer>
</template>

<style scoped>
.comfy-footer {
  background: #1e1a14;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Times New Roman', Times, serif;
  border-top: 1px solid var(--border);
}
.footer-top {
  padding: 2rem 0 1.5rem;
  border-bottom: 1px solid var(--border);
}
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 991px) {
  .comfy-footer {
    padding-left: 62px;
  }
}
@media (max-width: 420px) {
  .comfy-footer {
    padding-left: 48px;
  }
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
  .footer-brand-col {
    grid-column: 1 / -1;
  }
  .footer-brand-tagline {
    max-width: none;
  }
  .footer-col-title--hidden {
    visibility: visible;
  }
}

@media (max-width: 480px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
.footer-brand {
  font-size: 1.6rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}
.footer-brand-tagline {
  font-size: var(--fs-base);
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.5);
  max-width: 300px;
  margin: 0;
}
.footer-col-title {
  font-size: var(--fs-xs);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #c4a882;
  margin-bottom: 1rem;
}
.footer-col-title--hidden {
  visibility: hidden;
}
.footer-links-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer-links-col ul li {
  margin-bottom: 0.45rem;
}
.footer-links-col ul li a {
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  font-size: var(--fs-base);
  transition: color 0.2s;
}
.footer-links-col ul li a:hover {
  color: #c4a882;
}

.footer-bottom {
  padding: 1.25rem 0;
}
.footer-copy {
  font-size: var(--fs-xs);
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.35);
}
.footer-brand-lg {
  font-size: 1.4rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.05em;
}
</style>