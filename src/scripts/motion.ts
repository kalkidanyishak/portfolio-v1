/* =========================================================
   Motion, rebuilt.

   One clock drives everything. Every effect is optional,
   interruptible, and removed completely for reduced motion.
   The page is fully readable without this file.
   ========================================================= */

type Task = (now: number) => void;
type Cleanup = () => void;

type ParallaxItem = {
  el: HTMLElement;
  speed: number;
  current: number;
};

type GlareItem = {
  el: HTMLElement;
  x: number;
  y: number;
  opacity: number;
  targetX: number;
  targetY: number;
  targetOpacity: number;
};

type DepthItem = {
  root: HTMLElement;
  img: HTMLImageElement;
  x: number;
  y: number;
  scrollY: number;
  targetX: number;
  targetY: number;
  targetScrollY: number;
  hovered: boolean;
  scale: number;
  targetScale: number;
  tiltX: number;
  tiltY: number;
  targetTiltX: number;
  targetTiltY: number;
};

type MagnetItem = {
  el: HTMLElement;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

const tasks: Task[] = [];
const cleanups: Cleanup[] = [];

let frame = 0;
let running = false;
let booted = false;

function listen<K extends keyof WindowEventMap>(
  target: Window | Document | HTMLElement,
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions,
): void {
  target.addEventListener(type, handler as EventListener, options);
  cleanups.push(() => target.removeEventListener(type, handler as EventListener, options));
}

function addTask(task: Task): void {
  tasks.push(task);
}

function startClock(): void {
  if (running) return;
  running = true;

  let last = performance.now();
  const loop = (now: number) => {
    if (!running) return;
    const delta = Math.min(64, now - last);
    last = now;
    for (const task of tasks) task(delta);
    frame = window.requestAnimationFrame(loop);
  };

  frame = window.requestAnimationFrame(loop);
}

function stopClock(): void {
  running = false;
  window.cancelAnimationFrame(frame);
}

/* ---------------------------------------------------------
   Scroll chrome: header, progress, navigation state.
   This stays available even when decorative motion is off.
   --------------------------------------------------------- */
function initChrome(): Cleanup {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  const progress = document.querySelector<HTMLElement>('[data-progress]');
  const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav]'));
  const sections = navLinks
    .map((link) => document.getElementById(link.hash.replace('#', '')))
    .filter((section): section is HTMLElement => Boolean(section));

  const chapterLinks = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('[data-chapter-link]'),
  );
  const chapterSections = chapterLinks
    .map((link) => document.getElementById(link.hash.replace('#', '')))
    .filter((section): section is HTMLElement => Boolean(section));

  let targetProgress = 0;
  let shownProgress = 0;
  let lastActive = '';
  let lastChapter = '';
  let lastScrollY = window.scrollY;
  let ticking = false;

  const update = () => {
    ticking = false;
    const y = window.scrollY;

    if (header) {
      const moved = y - lastScrollY;
      header.classList.toggle('is-scrolled', y > 6);

      if (y <= 8) {
        header.classList.remove('is-hidden');
      } else if (moved > 4 && y > 160) {
        header.classList.add('is-hidden');
      } else if (moved < -4) {
        header.classList.remove('is-hidden');
      }
    }

    lastScrollY = y;

    const max = document.documentElement.scrollHeight - window.innerHeight;
    targetProgress = max > 0 ? clamp(y / max, 0, 1) : 0;
    if (reduceMotion.matches) {
      shownProgress = targetProgress;
      if (progress) progress.style.transform = `scaleX(${shownProgress.toFixed(4)})`;
    }

    if (chapterSections.length > 0) {
      const chapterMarker = window.innerHeight * 0.42;
      let chapter = chapterSections[0].id;
      for (const section of chapterSections) {
        if (section.getBoundingClientRect().top <= chapterMarker) chapter = section.id;
      }

      if (chapter !== lastChapter) {
        lastChapter = chapter;
        for (const link of chapterLinks) {
          const active = link.hash === `#${chapter}`;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        }
      }
    }

    if (navLinks.length === 0 || sections.length === 0) return;

    const marker = window.innerHeight * 0.36;
    let current = '';
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= marker) current = section.id;
    }

    if (current === lastActive) return;
    lastActive = current;

    for (const link of navLinks) {
      const active = current !== '' && link.hash === `#${current}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  requestUpdate();
  listen(window, 'scroll', requestUpdate, { passive: true });
  listen(window, 'resize', requestUpdate);
  if (header) {
    listen(header, 'focusin', () => header.classList.remove('is-hidden'));
  }

  addTask(() => {
    shownProgress = lerp(shownProgress, targetProgress, 0.18);
    if (Math.abs(shownProgress - targetProgress) < 0.00005) shownProgress = targetProgress;
    if (progress) progress.style.transform = `scaleX(${shownProgress.toFixed(4)})`;
  });

  return () => {
    if (progress) progress.style.transform = '';
    header?.classList.remove('is-scrolled', 'is-hidden');
    for (const link of navLinks) {
      link.classList.remove('is-active');
      link.removeAttribute('aria-current');
    }
    for (const link of chapterLinks) {
      link.classList.remove('is-active');
      link.removeAttribute('aria-current');
    }
  };
}

/* ---------------------------------------------------------
   Generated surface layers drift at two depths.
   --------------------------------------------------------- */
function initSurfaces(): Cleanup {
  const grain = document.querySelector<HTMLElement>('.surface-grain');
  const contours = document.querySelector<HTMLElement>('.surface-contours');
  if (!grain && !contours) return () => {};

  let grainY = 0;
  let contourY = 0;

  addTask(() => {
    const y = window.scrollY;

    if (grain) {
      const target = clamp(y * -0.018, -54, 54);
      grainY = lerp(grainY, target, 0.12);
      grain.style.transform = `translate3d(0, ${grainY.toFixed(2)}px, 0)`;
    }

    if (contours) {
      const target = clamp(y * -0.042, -86, 86);
      contourY = lerp(contourY, target, 0.1);
      contours.style.transform = `translate3d(0, ${contourY.toFixed(2)}px, 0)`;
    }
  });

  return () => {
    grain?.style.removeProperty('transform');
    contours?.style.removeProperty('transform');
  };
}

/* ---------------------------------------------------------
   Staged reveals. One observer, no scroll math.
   --------------------------------------------------------- */
function initReveal(): Cleanup {
  const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (elements.length === 0 || !('IntersectionObserver' in window)) return () => {};

  document.documentElement.classList.add('reveal-ready');

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -7% 0px', threshold: 0.1 },
  );

  for (const element of elements) {
    if (element.classList.contains('is-visible')) continue;
    observer.observe(element);
  }

  return () => {
    observer.disconnect();
    document.documentElement.classList.remove('reveal-ready');
  };
}

/* ---------------------------------------------------------
   Scroll parallax. Smooth, bounded, transform-only.
   --------------------------------------------------------- */
function initParallax(): Cleanup {
  const items: ParallaxItem[] = Array.from(
    document.querySelectorAll<HTMLElement>('[data-parallax]'),
  ).map((el) => ({
    el,
    speed: clamp(Number(el.dataset.parallax) || 0.03, 0, 0.12),
    current: 0,
  }));

  if (items.length === 0) return () => {};

  addTask(() => {
    const viewport = window.innerHeight;
    for (const item of items) {
      const rect = item.el.getBoundingClientRect();
      if (rect.bottom < -120 || rect.top > viewport + 120) continue;

      const delta = rect.top + rect.height / 2 - viewport / 2;
      const target = clamp(delta * -item.speed, -46, 46);
      item.current = lerp(item.current, target, 0.14);
      if (Math.abs(item.current) < 0.01) item.current = 0;
      item.el.style.transform = `translate3d(0, ${item.current.toFixed(2)}px, 0)`;
    }
  });

  return () => {
    for (const item of items) item.el.style.transform = '';
  };
}

/* ---------------------------------------------------------
   Image depth. Scroll gives the image a slow vertical drift;
   the pointer adds a shallow, damped lateral shift.
   --------------------------------------------------------- */
function initImageDepth(): Cleanup {
  const items: DepthItem[] = Array.from(
    document.querySelectorAll<HTMLElement>('[data-frame]'),
  )
    .map((root) => {
      const img = root.querySelector<HTMLImageElement>('.still__window img');
      if (!img) return null;
      const item: DepthItem = {
        root,
        img,
        x: 0,
        y: 0,
        scrollY: 0,
        targetX: 0,
        targetY: 0,
        targetScrollY: 0,
        hovered: false,
        scale: 1.045,
        targetScale: 1.045,
        tiltX: 0,
        tiltY: 0,
        targetTiltX: 0,
        targetTiltY: 0,
      };
      return item;
    })
    .filter((item): item is DepthItem => Boolean(item));

  if (items.length === 0) return () => {};

  for (const item of items) {
    listen(item.root, 'pointerenter', () => {
      item.hovered = true;
      item.targetScale = 1.075;
      item.root.style.willChange = 'transform';
    });
    listen(item.root, 'pointerleave', () => {
      item.hovered = false;
      item.targetX = 0;
      item.targetY = 0;
      item.targetScale = 1.045;
      item.targetTiltX = 0;
      item.targetTiltY = 0;
      item.root.style.removeProperty('will-change');
    });
    listen(item.root, 'focusin', () => {
      item.targetScale = 1.075;
    });
    listen(item.root, 'focusout', () => {
      item.targetScale = 1.045;
    });
    listen(item.root, 'pointermove', (event) => {
      if (!finePointer.matches) return;
      const rect = item.root.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      item.targetX = nx * 14;
      item.targetY = ny * 10;
      item.targetTiltX = ny * -1.4;
      item.targetTiltY = nx * 1.8;
    });
  }

  addTask(() => {
    const viewport = window.innerHeight;
    for (const item of items) {
      const rect = item.root.getBoundingClientRect();
      if (rect.bottom < -80 || rect.top > viewport + 80) continue;

      const relative = (rect.top + rect.height / 2 - viewport / 2) / viewport;
      item.hovered = item.root.matches(':hover');
      item.targetScrollY = clamp(relative * -26, -26, 26);

      item.x = lerp(item.x, item.hovered ? item.targetX : 0, 0.12);
      item.y = lerp(item.y, item.hovered ? item.targetY : 0, 0.12);
      item.scrollY = lerp(item.scrollY, item.targetScrollY, 0.16);
      item.scale = lerp(item.scale, item.targetScale, 0.14);
      item.tiltX = lerp(item.tiltX, item.hovered ? item.targetTiltX : 0, 0.1);
      item.tiltY = lerp(item.tiltY, item.hovered ? item.targetTiltY : 0, 0.1);

      item.img.style.setProperty('--img-x', `${item.x.toFixed(2)}px`);
      item.img.style.setProperty('--img-y', `${(item.y + item.scrollY).toFixed(2)}px`);
      item.img.style.setProperty('--img-scale', item.scale.toFixed(4));

      if (Math.abs(item.tiltX) < 0.01 && Math.abs(item.tiltY) < 0.01 && !item.hovered) {
        item.root.style.transform = '';
      } else {
        item.root.style.transform = `perspective(1000px) rotateX(${item.tiltX.toFixed(2)}deg) rotateY(${item.tiltY.toFixed(2)}deg)`;
      }
    }
  });

  return () => {
    for (const item of items) {
      item.root.style.removeProperty('transform');
      item.root.style.removeProperty('will-change');
      item.img.style.removeProperty('--img-scale');
      item.img.style.removeProperty('--img-x');
      item.img.style.removeProperty('--img-y');
    }
  };
}

/* ---------------------------------------------------------
   Surface light. A soft highlight glides across the material
   under the pointer, the one ambient gesture in the system.
   --------------------------------------------------------- */
function initGlare(): Cleanup {
  if (!finePointer.matches) return () => {};

  const items: GlareItem[] = Array.from(
    document.querySelectorAll<HTMLElement>('[data-glare]'),
  ).map((el) => ({
    el,
    x: 50,
    y: 0,
    opacity: 0,
    targetX: 50,
    targetY: 0,
    targetOpacity: 0,
  }));

  if (items.length === 0) return () => {};

  for (const item of items) {
    listen(item.el, 'pointerenter', () => {
      item.targetOpacity = 1;
    });
    listen(item.el, 'pointerleave', () => {
      item.targetOpacity = 0;
    });
    listen(item.el, 'pointermove', (event) => {
      const rect = item.el.getBoundingClientRect();
      item.targetX = clamp(((event.clientX - rect.left) / rect.width) * 100, -10, 110);
      item.targetY = clamp(((event.clientY - rect.top) / rect.height) * 100, -10, 110);
    });
  }

  addTask(() => {
    for (const item of items) {
      item.x = lerp(item.x, item.targetX, 0.12);
      item.y = lerp(item.y, item.targetY, 0.12);
      item.opacity = lerp(item.opacity, item.targetOpacity, 0.1);
      item.el.style.setProperty('--glare-x', `${item.x.toFixed(2)}%`);
      item.el.style.setProperty('--glare-y', `${item.y.toFixed(2)}%`);
      item.el.style.setProperty('--glare-opacity', item.opacity.toFixed(3));
    }
  });

  return () => {
    for (const item of items) {
      item.el.style.removeProperty('--glare-x');
      item.el.style.removeProperty('--glare-y');
      item.el.style.removeProperty('--glare-opacity');
    }
  };
}

/* ---------------------------------------------------------
   Magnetic controls. The pointer leads by a few pixels,
   never by enough to pull the layout apart.
   --------------------------------------------------------- */
function initMagnets(): Cleanup {
  if (!finePointer.matches) return () => {};

  const items: MagnetItem[] = Array.from(
    document.querySelectorAll<HTMLElement>('[data-magnetic], .chip, .action, .button'),
  ).map((el) => ({ el, x: 0, y: 0, targetX: 0, targetY: 0 }));

  if (items.length === 0) return () => {};

  for (const item of items) {
    listen(item.el, 'pointermove', (event) => {
      const rect = item.el.getBoundingClientRect();
      item.targetX = clamp((event.clientX - (rect.left + rect.width / 2)) * 0.14, -6, 6);
      item.targetY = clamp((event.clientY - (rect.top + rect.height / 2)) * 0.18, -6, 6);
    });
    listen(item.el, 'pointerleave', () => {
      item.targetX = 0;
      item.targetY = 0;
    });
  }

  addTask(() => {
    for (const item of items) {
      item.x = lerp(item.x, item.targetX, 0.14);
      item.y = lerp(item.y, item.targetY, 0.14);
      if (Math.abs(item.x) < 0.02 && Math.abs(item.y) < 0.02 && item.targetX === 0 && item.targetY === 0) {
        item.el.style.translate = '';
        continue;
      }
      item.el.style.translate = `${item.x.toFixed(2)}px ${item.y.toFixed(2)}px`;
    }
  });

  return () => {
    for (const item of items) item.el.style.translate = '';
  };
}

/* ---------------------------------------------------------
   Boot / halt.
   --------------------------------------------------------- */
function clearMotion(): void {
  stopClock();
  while (cleanups.length > 0) cleanups.pop()?.();
  tasks.length = 0;
  document.documentElement.classList.remove('reveal-ready');
  document.documentElement.classList.add('motion-paused');
}

function bootMotion(): void {
  if (booted) return;
  booted = true;
  document.documentElement.classList.remove('motion-paused');

  cleanups.length = 0;
  tasks.length = 0;

  cleanups.push(initChrome());

  if (!reduceMotion.matches) {
    cleanups.push(initReveal());
    cleanups.push(initSurfaces());
    cleanups.push(initParallax());
    cleanups.push(initImageDepth());
    cleanups.push(initGlare());
    cleanups.push(initMagnets());
    startClock();
  } else {
    document.documentElement.classList.remove('reveal-ready');
  }
}

export function initMotion(): void {
  bootMotion();

  reduceMotion.addEventListener('change', () => {
    booted = false;
    clearMotion();
    bootMotion();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopClock();
      return;
    }
    if (!reduceMotion.matches && booted) startClock();
  });
}
