/**
 * Keyboard shortcuts for playback.
 */

export function bindKeyboardShortcuts(player, handlers = {}) {
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
      return;
    }
    if (e.code === 'Space') {
      e.preventDefault();
      if (player.isPlaying) player.pause();
      else player.play();
    } else if (e.code === 'ArrowRight') {
      e.preventDefault();
      player.stepForward();
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      player.stepBackward();
    } else if (e.code === 'KeyR') {
      e.preventDefault();
      handlers.onReset?.();
    }
  });
}
