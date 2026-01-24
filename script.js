
function toggleLanguage() { const h = document.documentElement; h.lang = (h.lang === 'zh-TW') ? 'en' : 'zh-TW'; }

function setupCarousel(carouselId, dotClass) {
    const container = document.getElementById(carouselId);
    if (!container) return;

    const items = container.querySelectorAll('.carousel-item');

    // 自動尋找緊鄰的手機容器下方的 dot-wrapper
    const parentSection = container.closest('section');
    const dotContainer = parentSection.querySelector('.dot-wrapper');

    if (items.length <= 1) {
        if (dotContainer) dotContainer.style.display = 'none';
        container.classList.add('no-scroll');
        return;
    }

    const dots = parentSection.querySelectorAll('.' + dotClass);
    container.addEventListener('scroll', () => {
        const i = Math.round(container.scrollLeft / container.offsetWidth);
        dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
    });

    setInterval(() => {
        const i = (Math.round(container.scrollLeft / container.offsetWidth) + 1) % items.length;
        container.scrollTo({ left: i * container.offsetWidth, behavior: 'smooth' });
    }, 4000);
}

function scrollToSlide(id, i) {
    const c = document.getElementById(id);
    c.scrollTo({ left: i * c.offsetWidth, behavior: 'smooth' });
}

window.onload = () => {
    setupCarousel('carousel', 'dot');
    setupCarousel('carousel-stamp', 'dot-stamp');
    setupCarousel('carousel-ai', 'dot-ai');
};

const obs = new IntersectionObserver((es) => { es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); } }); }, { threshold: 0.3 });
const trigger = document.getElementById('evolution-trigger');
if (trigger) obs.observe(trigger);