/**
 * Clone-Safe Anti-Inspect & Anti-Copy Protection
 *
 * Designed for wedding invitation websites.
 * Default: active (isSecured = true)
 * Override: set window.__IS_SECURED = 'false' or VITE_IS_SECURED=false to disable for debugging.
 *
 * Principle: Zero performance & UX impact.
 */

(function () {
  'use strict';

  // 1. Centralized isSecured flag
  // Semantics:
  // - Not set / undefined: true
  // - "false" (exact string): false
  // - Any other value / empty: true
  var rawEnv =
    typeof window !== 'undefined' && typeof window.__IS_SECURED !== 'undefined'
      ? window.__IS_SECURED
      : undefined;

  var isSecured = rawEnv !== 'false';
  if (!isSecured) return;

  var isClient = typeof window !== 'undefined' && typeof document !== 'undefined';
  if (!isClient) return;

  // Helper: check if running inside an iframe (e.g. riungin.id catalog preview)
  function isInIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  // Helper: check if device is mobile or touch device
  function isMobileDevice() {
    var ua = navigator.userAgent || '';
    var isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    var isTouch = typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1;
    return isMobileUA || (isTouch && window.innerWidth <= 1024);
  }

  // Helper: check if target element is editable (input, textarea, select, contenteditable)
  function isEditableElement(target) {
    if (!target || !(target instanceof Element)) return false;
    var tag = target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
    if (target.isContentEditable) return true;
    var curr = target.parentElement;
    while (curr) {
      var pTag = curr.tagName.toLowerCase();
      if (pTag === 'input' || pTag === 'textarea' || pTag === 'select') return true;
      if (curr.isContentEditable) return true;
      if (curr.getAttribute('contenteditable') === 'true') return true;
      curr = curr.parentElement;
    }
    return false;
  }

  // Helper: check if element is explicitly permitted for contextmenu
  // (e.g. forms, links, buttons, bank accounts, copyable addresses, interactive maps)
  function isPermittedForContextMenu(target) {
    if (!target || !(target instanceof Element)) return false;
    if (isEditableElement(target)) return true;
    return (
      target.closest(
        'a, button, form, [data-copyable], .copyable, [data-allow-context="true"], .leaflet-container, .gm-style, iframe'
      ) !== null
    );
  }

  // Action taken when inspection is detected
  function handleInspectionDetected() {
    try {
      document.documentElement.innerHTML = '';
    } catch (e) {
      // ignore
    }
    try {
      window.location.replace('about:blank');
    } catch (e) {
      window.location.href = 'about:blank';
    }
  }

  // Layer 1: Desktop Top-Level Dimension Heuristic (!isInIframe() && !isMobileDevice())
  function checkDesktopDimensionHeuristic() {
    if (isInIframe() || isMobileDevice()) return false;

    var diffW = window.outerWidth - window.innerWidth;
    var diffH = window.outerHeight - window.innerHeight;

    // Exclude browser zoom where both width and height diffs exceed threshold simultaneously
    var isZoom = diffW > 160 && diffH > 240;
    if (isZoom) return false;

    return diffW > 160 || diffH > 240;
  }

  // Layer 2: Dynamic Debugger Timing Delta
  // Uses new Function("debugger")() to prevent minifiers from removing literal debugger
  function checkDebuggerTimingDelta() {
    try {
      var start = performance.now();
      var dbg = new Function('debugger');
      dbg();
      var delta = performance.now() - start;
      return delta > 100;
    } catch (e) {
      return false;
    }
  }

  // Combined active inspection check
  function checkInspection() {
    if (!isSecured) return false;

    if (checkDesktopDimensionHeuristic()) {
      handleInspectionDetected();
      return true;
    }

    if (checkDebuggerTimingDelta()) {
      handleInspectionDetected();
      return true;
    }

    return false;
  }

  // Keyboard shortcuts interception handler
  function handleKeyDown(event) {
    if (!isSecured) return;

    // Never block shortcuts on input/editable elements
    if (isEditableElement(event.target)) {
      return;
    }

    var key = event.key;
    var keyCode = event.keyCode || event.which;
    var isShift = event.shiftKey;
    var isAltOrOption = event.altKey;

    // 1. F12 (keyCode 123)
    if (key === 'F12' || keyCode === 123) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // 2. Windows/Linux: Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
    //    macOS: Cmd+Option+I, Cmd+Option+J, Cmd+Option+C
    var isInspectKey =
      key === 'I' || key === 'i' || key === 'J' || key === 'j' || key === 'C' || key === 'c';
    if (isInspectKey) {
      if (event.ctrlKey && isShift) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (event.metaKey && isAltOrOption) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
    }

    // 3. Ctrl+U / Cmd+Option+U (View Source)
    if (key === 'U' || key === 'u') {
      if ((event.ctrlKey && !isShift && !isAltOrOption) || (event.metaKey && isAltOrOption)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
    }
  }

  // Context menu protection handler
  function handleContextMenu(event) {
    if (!isSecured) return;

    // Allow context menu on interactive and copyable elements
    if (isPermittedForContextMenu(event.target)) {
      return;
    }

    // Prevent right-click on decorative presentation and images
    event.preventDefault();
  }

  // Drag start protection handler (prevent image dragging)
  function handleDragStart(event) {
    if (!isSecured) return;

    var target = event.target;
    if (
      target instanceof HTMLImageElement ||
      (target instanceof Element && target.tagName.toLowerCase() === 'img')
    ) {
      if (!isPermittedForContextMenu(target)) {
        event.preventDefault();
      }
    }
  }

  // Early evaluation execution (runs as soon as client script is loaded, before render)
  checkInspection();

  // Attach event listeners
  window.addEventListener('keydown', handleKeyDown, true);
  document.addEventListener('contextmenu', handleContextMenu, true);
  document.addEventListener('dragstart', handleDragStart, true);

  // Resize listener for desktop dimension heuristic
  window.addEventListener('resize', function () {
    checkInspection();
  }, { passive: true });

  // Relaxed interval (1.5s) - 0% CPU consumption, 60fps animations unharmed
  window.setInterval(function () {
    checkInspection();
  }, 1500);
})();
