import { initMotion } from './motion';

/* ---------------------------------------------------------
   Mobile navigation
   Native <dialog> supplies focus containment and Escape handling.
   --------------------------------------------------------- */
const menuButton = document.querySelector<HTMLButtonElement>('[data-menu-open]');
const menu = document.querySelector<HTMLDialogElement>('[data-mobile-menu]');
const menuClose = document.querySelector<HTMLButtonElement>('[data-menu-close]');

if (menuButton && menu && menuClose) {
  let previousOverflow = '';

  const openMenu = () => {
    if (typeof menu.showModal !== 'function') return;
    previousOverflow = document.body.style.overflow;
    menu.showModal();
    document.body.style.overflow = 'hidden';
    menuButton.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => {
      menu.querySelector<HTMLAnchorElement>('.mobile-menu__nav a')?.focus();
    });
  };

  const closeMenu = () => {
    if (menu.open) menu.close();
  };

  menuButton.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);

  menu.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.focus({ preventScroll: true });
  });

  menu.querySelectorAll<HTMLAnchorElement>('[data-menu-link]').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 960 && menu.open) closeMenu();
  });
}

/* ---------------------------------------------------------
   Copy-email control
   --------------------------------------------------------- */
async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the selection-based fallback.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '-1000px';
  textarea.style.left = '-1000px';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  }

  textarea.remove();
  return copied;
}

document.querySelectorAll<HTMLButtonElement>('[data-copy-email]').forEach((button) => {
  const email = button.dataset.email ?? '';
  const label = button.querySelector<HTMLElement>('[data-copy-email-label]');
  const originalLabel = label?.textContent ?? 'Copy email';
  const statusId = button.getAttribute('aria-describedby');
  const status = statusId ? document.getElementById(statusId) : null;
  let resetTimer: number | undefined;

  button.addEventListener('click', async () => {
    const copied = await copyText(email);

    window.clearTimeout(resetTimer);
    button.classList.toggle('is-copied', copied);

    if (label) label.textContent = copied ? 'Copied' : originalLabel;
    if (status) {
      status.textContent = copied
        ? 'Email copied to clipboard.'
        : 'Copy failed. Select the email address above.';
    }

    resetTimer = window.setTimeout(() => {
      button.classList.remove('is-copied');
      if (label) label.textContent = originalLabel;
      if (status) status.textContent = '';
    }, 3000);
  });
});

/* ---------------------------------------------------------
   Resume print action
   --------------------------------------------------------- */
document.querySelectorAll<HTMLButtonElement>('[data-print-resume]').forEach((button) => {
  button.addEventListener('click', () => window.print());
});

initMotion();
