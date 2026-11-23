// Minimal lightbox for [data-lightbox] grids. No dependencies.
// Keyboard: ← → Esc. Touch: swipe left/right. Works without JS (links open the large image).

const grids = document.querySelectorAll('[data-lightbox]');

if (grids.length) {
  const dialog = document.createElement('dialog');
  dialog.className = 'lb';
  dialog.setAttribute('aria-label', 'Bildansicht');
  dialog.innerHTML = `
    <span class="lb-count"></span>
    <figure class="lb-figure">
      <img alt="">
      <figcaption class="lb-caption"></figcaption>
    </figure>
    <button class="lb-prev" type="button" aria-label="Vorheriges Bild">‹</button>
    <button class="lb-next" type="button" aria-label="Nächstes Bild">›</button>
    <button class="lb-close" type="button" aria-label="Schließen">×</button>`;
  document.body.appendChild(dialog);

  const img = dialog.querySelector('img');
  const caption = dialog.querySelector('.lb-caption');
  const count = dialog.querySelector('.lb-count');
  let tiles = [];
  let index = 0;

  const preload = (i) => {
    const t = tiles[i];
    if (t) new Image().src = t.href;
  };

  const show = (i) => {
    index = (i + tiles.length) % tiles.length;
    const t = tiles[index];
    const thumb = t.querySelector('img');
    // Show the already loaded thumbnail first, then swap in the large version
    img.src = thumb.currentSrc || thumb.src;
    img.alt = thumb.alt;
    img.width = Number(t.dataset.width);
    img.height = Number(t.dataset.height);
    const large = new Image();
    large.onload = () => { if (tiles[index] === t) img.src = t.href; };
    large.src = t.href;
    caption.textContent = t.dataset.caption || '';
    count.textContent = `${index + 1} / ${tiles.length}`;
    preload(index + 1);
    preload(index - 1);
  };

  grids.forEach((grid) => {
    grid.addEventListener('click', (e) => {
      const tile = e.target.closest('a.tile');
      if (!tile || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      tiles = [...grid.querySelectorAll('a.tile')];
      show(tiles.indexOf(tile));
      dialog.showModal();
    });
  });

  dialog.querySelector('.lb-prev').addEventListener('click', () => show(index - 1));
  dialog.querySelector('.lb-next').addEventListener('click', () => show(index + 1));
  dialog.querySelector('.lb-close').addEventListener('click', () => dialog.close());

  // Click on the dark background closes
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target.classList.contains('lb-figure')) dialog.close();
  });

  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });

  let startX = null;
  dialog.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  dialog.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });

  dialog.addEventListener('close', () => { img.removeAttribute('src'); });
}
