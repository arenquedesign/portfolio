// ============================================
// CUSTOM CURSOR DOT WITH GSAP
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Verificar se é desktop com mouse
  const isDesktop = window.innerWidth > 991;
  const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  
  if (!isDesktop || !hasHover) return;
  
  const cursorDot = document.querySelector('.cursor-dot');
  
  if (!cursorDot) return;
  
  // QuickTo para performance otimizada
  const xDot = gsap.quickTo(cursorDot, 'x', { duration: 0.15, ease: 'power2' });
  const yDot = gsap.quickTo(cursorDot, 'y', { duration: 0.15, ease: 'power2' });
  
  // Movimento do cursor dot
  window.addEventListener('mousemove', (e) => {
    xDot(e.clientX);
    yDot(e.clientY);
  });
  
  // Cursor Dot - Hover em links e botões
  const interactiveElements = document.querySelectorAll('a, button, [role="button"], [data-cursor-dot], .project-item');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursorDot.classList.add('is-hovering');
      
      gsap.to(cursorDot, {
        width: 48,
        height: 48,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    element.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('is-hovering');
      
      gsap.to(cursorDot, {
        width: 20,
        height: 20,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });
});

// ============================================
// LENIS SMOOTH SCROLL
// ============================================

// Instância secundária para o case sheet (inicializada no DOMContentLoaded)
let lenisCaseSheet = null;

// Inicializar Lenis
const lenis = new Lenis({
  lerp: 0.1,
  wheelMultiplier: 0.7,
  gestureOrientation: 'vertical',
  normalizeWheel: false,
  smoothTouch: false
});

// RAF Loop (Request Animation Frame)
function raf(time) {
  lenis.raf(time);
  if (lenisCaseSheet) lenisCaseSheet.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Controles de Interação via Data Attributes
document.addEventListener('DOMContentLoaded', () => {
  // [data-lenis-start] - Inicia/libera rolagem
  const startButtons = document.querySelectorAll('[data-lenis-start]');
  startButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      lenis.start();
      console.log('Lenis: Scroll iniciado');
    });
  });
  
  // [data-lenis-stop] - Para/trava rolagem
  const stopButtons = document.querySelectorAll('[data-lenis-stop]');
  stopButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      lenis.stop();
      console.log('Lenis: Scroll parado');
    });
  });
  
  // [data-lenis-toggle] - Alterna entre start/stop
  const toggleButtons = document.querySelectorAll('[data-lenis-toggle]');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (lenis.isStopped) {
        lenis.start();
        console.log('Lenis: Scroll iniciado (toggle)');
      } else {
        lenis.stop();
        console.log('Lenis: Scroll parado (toggle)');
      }
    });
  });
});

// ============================================
// COLOR SCHEME CHANGER ON PROJECT HOVER
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const projectItems = document.querySelectorAll('.project-item');
  const body = document.body;
  const defaultColor = '#000000'; // Cor padrão (preto)
  
  projectItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const color = item.getAttribute('data-color');
      const theme = item.getAttribute('data-theme');
      
      if (color) {
        body.style.backgroundColor = color;
      }
      
      if (theme) {
        body.setAttribute('data-theme', theme);
      }
    });
    
    item.addEventListener('mouseleave', () => {
      body.style.backgroundColor = defaultColor;
      body.removeAttribute('data-theme');
    });
  });
});

// ============================================
// MENU ANIMATION WITH GSAP
// ============================================

function initMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const body = document.body;
  
  // Elementos para animar
  const toggleText = menuToggle.querySelector('.menu-toggle__text');
  const toggleIcon = menuToggle.querySelector('.menu-toggle__icon');
  const overlay = navMenu.querySelector('.nav-menu__overlay');
  const bgPanels = navMenu.querySelectorAll('.bg-panel');
  const menuItems = navMenu.querySelectorAll('.nav-menu__item');
  const fadeElements = navMenu.querySelectorAll('[data-menu-fade]');
  
  // Estado da animação
  let isAnimating = false;
  let isOpen = false;
  
  // Criar Timeline GSAP (pausada no início)
  const tl = gsap.timeline({
    paused: true,
    onStart: () => {
      isAnimating = true;
      navMenu.style.visibility = 'visible';
    },
    onComplete: () => {
      isAnimating = false;
      if (isOpen) {
        body.setAttribute('data-nav', 'open');
      }
    },
    onReverseComplete: () => {
      isAnimating = false;
      body.setAttribute('data-nav', 'closed');
      navMenu.style.visibility = 'hidden';
    }
  });
  
  // Construir a Timeline
  tl
    // 1. Animar botão (texto sobe e ícone gira)
    .to(toggleText, {
      y: '-100%',
      duration: 0.4,
      ease: 'power3.inOut'
    }, 0)
    .to(toggleIcon, {
      rotation: 315,
      duration: 0.4,
      ease: 'power3.inOut'
    }, 0)
    
    // 2. Fade-in do overlay
    .to(overlay, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    }, 0.1)
    
    // 3. Painéis de fundo deslizam (efeito cascata)
    .fromTo(bgPanels, {
      x: '100%'
    }, {
      x: '0%',
      duration: 0.8,
      stagger: 0.15,
      ease: 'expo.out'
    }, 0.2)
    
    // 4. Links do menu aparecem (fade + slide up)
    .to(menuItems, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out'
    }, 0.8)
    
    // 5. Elementos com data-menu-fade
    .to(fadeElements, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    }, 1.0);
  
  // Event Listener do botão
  menuToggle.addEventListener('click', () => {
    // Prevenir spam de cliques
    if (isAnimating) return;
    
    if (!isOpen) {
      // Abrir menu
      isOpen = true;
      body.style.overflow = 'hidden'; // Previne scroll
      tl.play();
    } else {
      // Fechar menu
      isOpen = false;
      body.style.overflow = ''; // Restaura scroll
      tl.reverse();
    }
  });
  
  // Fechar menu ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen && !isAnimating) {
      isOpen = false;
      body.style.overflow = '';
      tl.reverse();
    }
  });
  
  // Fechar menu ao clicar em um link
  menuItems.forEach(item => {
    item.querySelector('a').addEventListener('click', (e) => {
      if (!isAnimating) {
        isOpen = false;
        body.style.overflow = '';
        tl.reverse();
      }
    });
  });
}

// Inicializar menu quando GSAP estiver carregado
if (typeof gsap !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initMenu);
} else {
  console.error('GSAP não foi carregado. Certifique-se de incluir a biblioteca GSAP.');
}

// ============================================
// AVATAR MODAL
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const avatarBtn = document.getElementById('avatarBtn');
  const avatarModal = document.getElementById('avatarModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalOverlay = avatarModal.querySelector('.avatar-modal__overlay');
  
  // Abrir modal ao clicar no avatar
  avatarBtn.addEventListener('click', () => {
    avatarModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Previne scroll do body
  });
  
  // Fechar modal ao clicar no botão close
  closeModalBtn.addEventListener('click', () => {
    avatarModal.classList.remove('active');
    document.body.style.overflow = ''; // Restaura scroll do body
  });
  
  // Fechar modal ao clicar no overlay
  modalOverlay.addEventListener('click', () => {
    avatarModal.classList.remove('active');
    document.body.style.overflow = '';
  });
  
  // Fechar modal ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && avatarModal.classList.contains('active')) {
      avatarModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

// ============================================
// HEADER TEXT ANIMATION ON SCROLL
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const headerText = document.getElementById('headerText');
  let lastScrollY = window.scrollY;
  let isHidden = false;
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Detecta direção do scroll
    if (currentScrollY > lastScrollY && currentScrollY > 50 && !isHidden) {
      // Scrolling down - esconde o texto
      headerText.classList.remove('showing');
      headerText.classList.add('hiding');
      isHidden = true;
    } else if (currentScrollY < lastScrollY && isHidden) {
      // Scrolling up - mostra o texto
      headerText.classList.remove('hiding');
      headerText.classList.add('showing');
      isHidden = false;
    } else if (currentScrollY <= 50 && isHidden) {
      // Volta ao topo - mostra o texto
      headerText.classList.remove('hiding');
      headerText.classList.add('showing');
      isHidden = false;
    }
    
    lastScrollY = currentScrollY;
  });
});

// ============================================
// TOGGLE SWITCH FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const toggleButtons = document.querySelectorAll('.toggle__option');
  
  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      toggleButtons.forEach(btn => {
        btn.classList.remove('toggle__option--active');
      });
      
      // Add active class to clicked button
      button.classList.add('toggle__option--active');
      
      // Get the selected option
      const selectedOption = button.getAttribute('data-option');
      
      // Dispatch custom event for filtering projects
      const event = new CustomEvent('toggleChanged', {
        detail: { option: selectedOption }
      });
      document.dispatchEvent(event);
      
      // Log for debugging
      console.log(`Switched to: ${selectedOption}`);
    });
  });
});

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ============================================
// CASE STUDY BOTTOM SHEET
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const caseSheet = document.getElementById('caseSheet');
  const caseSheetClose = document.getElementById('caseSheetClose');
  const crmProject = document.querySelector('.project-item[data-theme="year2022"]');

  if (!caseSheet || !crmProject) return;

  // Inicializar Lenis para o scroll interno do case sheet
  const sheetScroll = caseSheet.querySelector('.case-sheet__scroll');
  const sheetScrollContent = caseSheet.querySelector('.case-sheet__scroll-content');
  const sheetHeader = caseSheet.querySelector('.case-sheet__header');

  lenisCaseSheet = new Lenis({
    wrapper: sheetScroll,
    content: sheetScrollContent,
    lerp: 0.1,
    wheelMultiplier: 0.7,
    gestureOrientation: 'vertical',
    normalizeWheel: false,
    smoothTouch: false
  });
  lenisCaseSheet.stop();

  let isSheetOpen = false;
  let isAnimating = false;

  function openSheet() {
    if (isAnimating || isSheetOpen) return;
    isAnimating = true;
    isSheetOpen = true;

    caseSheet.setAttribute('aria-hidden', 'false');
    lenis.stop();
    lenisCaseSheet.start();

    gsap.to(caseSheet, {
      y: 0,
      duration: 0.8,
      ease: 'expo.out',
      onComplete: () => { isAnimating = false; }
    });
  }

  function closeSheet() {
    if (isAnimating || !isSheetOpen) return;
    isAnimating = true;
    isSheetOpen = false;

    gsap.to(caseSheet, {
      y: '100%',
      duration: 0.65,
      ease: 'expo.in',
      onComplete: () => {
        caseSheet.setAttribute('aria-hidden', 'true');
        lenisCaseSheet.stop();
        lenisCaseSheet.scrollTo(0, { immediate: true });
        caseSheetClose.classList.remove('case-sheet__close--inverted');
        lenis.start();
        isAnimating = false;
      }
    });
  }

  // Troca cor do botão conforme o fundo sob ele

  lenisCaseSheet.on('scroll', ({ scroll }) => {
    const threshold = sheetHeader.offsetHeight - 55;
    if (scroll >= threshold) {
      caseSheetClose.classList.add('case-sheet__close--inverted');
    } else {
      caseSheetClose.classList.remove('case-sheet__close--inverted');
    }
  });

  crmProject.addEventListener('click', openSheet);
  caseSheetClose.addEventListener('click', closeSheet);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isSheetOpen) closeSheet();
  });
});

