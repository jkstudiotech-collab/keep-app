
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

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('sprout-container');
    const totalSprouts = 4; // 分成四個區域

    function startSproutCycle(index) {
        // 1. 建立或獲取 SVG 元素
        let svg = document.getElementById(`sprout-${index}`);
        if (!svg) {
            svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("id", `sprout-${index}`);
            svg.setAttribute("viewBox", "0 0 40 40");
            svg.setAttribute("class", "sprout-svg-bg");
            svg.innerHTML = `
                <path d="M20 40V25" stroke="#8CA381" stroke-width="2" stroke-linecap="round"/>
                <path d="M20 25C20 25 10 25 8 18C6 11 15 10 20 25Z" fill="#9DB492"/>
                <path d="M20 25C20 25 30 25 32 18C34 11 25 10 20 25Z" fill="#9DB492"/>
            `;
            container.appendChild(svg);

            // 核心修正：監聽動畫結束事件
            svg.addEventListener('animationend', () => {
                svg.classList.remove('sprout-active');
                // 稍微延遲後重新啟動，讓消失後的空白期更自然
                setTimeout(() => {
                    deploySprout(svg, index);
                }, 1000);
            });
        }
        deploySprout(svg, index);
    }

    function deploySprout(svg, index) {
        // 2. 計算該區域內的隨機位置 (確保不重疊)
        const sectorWidth = 100 / totalSprouts;
        const minLeft = index * sectorWidth + 5;
        const maxLeft = (index + 1) * sectorWidth - 5;

        const randomLeft = Math.random() * (maxLeft - minLeft) + minLeft;
        const randomBottom = Math.random() * 15 + 10; // 限制在山丘附近
        const randomSize = Math.random() * (30 - 22) + 22;

        svg.style.left = `${randomLeft}%`;
        svg.style.bottom = `${randomBottom}%`;
        svg.style.width = `${randomSize}px`;

        // 3. 觸發動畫
        void svg.offsetWidth; // 強制重繪 (Reflow) 以確保動畫能重新播放
        svg.classList.add('sprout-active');
    }

    // 依序啟動 (由左到右，間隔 2.5 秒)
    for (let i = 0; i < totalSprouts; i++) {
        setTimeout(() => {
            startSproutCycle(i);
        }, i * 2500);
    }
});

window.onload = () => {
    setupCarousel('carousel', 'dot');
    setupCarousel('carousel-stamp', 'dot-stamp');
    setupCarousel('carousel-ai', 'dot-ai');
};

const obs = new IntersectionObserver((es) => { es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); } }); }, { threshold: 0.3 });
const trigger = document.getElementById('evolution-trigger');
if (trigger) obs.observe(trigger);
