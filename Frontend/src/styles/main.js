// QazaqTrip — main.js

// Navbar scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// Quick search fill
function fillSearch(text) {
  const input = document.getElementById('searchInput');
  if (input) {
    input.value = text;
    input.focus();
  }
}

// Search handler
function handleSearch() {
  const input = document.getElementById('searchInput');
  if (!input || !input.value.trim()) return;
  const query = encodeURIComponent(input.value.trim());
  window.location.href = `plan.html?q=${query}`;
}

// Enter key on search
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
  }
});

// Navigation helper
function goTo(url) {
  window.location.href = url;
}

// Toast notification
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Animate on scroll
function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.step-card, .dest-card, .feat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', setupScrollAnimations);
