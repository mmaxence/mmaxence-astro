// A whole-line signal treatment, mounted through Materia's effect lifecycle.
export const arcadeTitle = {
  name: 'arcadeTitle',
  kind: 'elements',
  mount(element, { host }) {
    const layer = document.createElement('span');
    layer.className = 'arcade-title-signal';
    layer.setAttribute('aria-hidden', 'true');
    const channels = ['red', 'cyan', 'mirror'].map(name => {
      const channel = document.createElement('span');
      channel.className = `signal-${name}`;
      layer.append(channel);
      return channel;
    });
    host.append(layer);
    let frozen = false;
    const refresh = () => channels.forEach(channel => { channel.textContent = element.textContent; });
    refresh();
    return {
      supported: true,
      refresh,
      pulse() { if (!frozen) layer.getAnimations({ subtree: true }).forEach(animation => { animation.currentTime = 0; }); },
      setIntensity() {},
      setDetail() {},
      setFlow() {},
      setFrozen(value) {
        frozen = value;
        layer.getAnimations({ subtree: true }).forEach(animation => value ? animation.pause() : animation.play());
      },
      destroy() { layer.remove(); },
    };
  },
};
