<script setup>
import { RouterLink } from 'vue-router'
const footerLinks = [
  { name: 'Products', path: '/products' },
  { name: 'Showcase', path: '/showcase' },
  { name: 'Customize', path: '/customize' },
  { name: 'About Us', path: '/about' },
]
</script>

<template>
    <footer class="comfy-footer">
      <div class="footer-top">
        <div class="container-fluid px-4 px-lg-5">
          <div class="footer-grid">
            <div class="footer-brand-col">
              <h2 class="footer-brand">ComfyHome</h2>
              <p class="footer-brand-tagline">
                Crafting spaces that reflect who you are. In a world defined by the spaces we
                inhabit, we believe every room should be a statement of self.
              </p>
            </div>

            <div class="footer-links-col">
              <h6 class="footer-col-title">About</h6>
              <ul>
                <li><router-link to="/aboutus">Our Story</router-link></li>
                <li><router-link to="/locations">Store Branch</router-link></li>
                <li><router-link to="/aboutus#sustainability">Sustainability</router-link></li>
                <li><router-link to="/careers"></router-link></li>
                <li><router-link to="/contact">Contact</router-link></li>
              </ul>
            </div>

            <div class="footer-links-col">
              <h6 class="footer-col-title">Products</h6>
              <ul>
                <li><router-link to="/products#couches">Couches</router-link></li>
                <li><router-link to="/products#diningtables">Dining Tables</router-link></li>
                <li><router-link to="/products#kitchencounters">Kitchen Counters</router-link></li>
                <li><router-link to="/products#beds">Beds</router-link></li>
                <li><router-link to="/products#wardrobes">Wardrobe</router-link></li>
              </ul>
            </div>

            <div class="footer-links-col">
              <h6 class="footer-col-title">Social Media</h6>
              <ul>
                <li><a href="#" target="_blank">Instagram</a></li>
                <li><a href="#" target="_blank">Facebook</a></li>
                <li><a href="#" target="_blank">LinkedIn</a></li>
                <li><a href="#" target="_blank">Pinterest</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container-fluid px-4 px-lg-5 d-flex justify-content-center flex-wrap gap-2">
          <span class="footer-copy"
            >© {{ new Date().getFullYear() }} ComfyHome. All rights reserved.</span
          >
        </div>
      </div>
    </footer>
</template>

<style scoped>
.comfy-footer {
  background: #1e1a14;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Times New Roman', Times, serif;
}
.footer-top {
  padding: 4rem 0 3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
}
.footer-brand {
  font-size: 1.6rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}
.footer-brand-tagline {
  font-size: 0.82rem;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.5);
  max-width: 300px;
  margin: 0;
}
.footer-col-title {
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #c4a882;
  margin-bottom: 1.25rem;
}
.footer-links-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer-links-col ul li {
  margin-bottom: 0.6rem;
}
.footer-links-col ul li a {
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  font-size: 0.82rem;
  transition: color 0.2s;
}
.footer-links-col ul li a:hover {
  color: #c4a882;
}

.footer-bottom {
  padding: 1.25rem 0;
}
.footer-copy {
  font-size: 0.73rem;
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