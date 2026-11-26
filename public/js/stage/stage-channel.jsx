    // Student-screen "stage": what the separate student window (shared on Zoom)
    // should show right now. The teacher's window publishes it; the student
    // window listens. BroadcastChannel delivers live updates between the two
    // windows; localStorage keeps the last stage so a freshly opened or reloaded
    // student window starts on the right content.
    //
    // Stage shapes:
    //   { kind: 'mushaf', page, overlayMode, rulerLine }
    //   { kind: 'tajweed', lessonId, slideIndex, plateId, metronome: { count, playing, beat } }
    //   { kind: 'slides' }   (lecture slides; StudentProjectorScreen keeps its own sync)
    const STAGE_STORAGE_KEY = 'mishkah_student_stage';
    const STAGE_CHANNEL_NAME = 'mishkah_student_stage';

    let stageChannel = null;
    function getStageChannel() {
      if (!stageChannel && typeof BroadcastChannel !== 'undefined') {
        stageChannel = new BroadcastChannel(STAGE_CHANNEL_NAME);
      }
      return stageChannel;
    }

    // Returns { stored, sent } so a caller can warn the teacher when the
    // student window may not follow.
    function publishStage(stage) {
      const payload = Object.assign({}, stage, { sentAt: Date.now() });
      let stored = false;
      let sent = false;
      try {
        localStorage.setItem(STAGE_STORAGE_KEY, JSON.stringify(payload));
        stored = true;
      } catch (e) {
        console.warn('Mishkah: could not store the student stage', e);
      }
      try {
        const channel = getStageChannel();
        if (channel) { channel.postMessage(payload); sent = true; }
      } catch (e) {
        console.warn('Mishkah: could not send the student stage', e);
      }
      return { stored, sent };
    }

    function readStoredStage() {
      try {
        const saved = localStorage.getItem(STAGE_STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
      } catch (e) {
        console.warn('Mishkah: stored student stage is unreadable', e);
        return null;
      }
    }

    // Student side: the latest stage, kept live.
    function useLiveStage() {
      const [stage, setStage] = useState(readStoredStage);
      useEffect(() => {
        const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(STAGE_CHANNEL_NAME) : null;
        if (channel) channel.onmessage = (event) => setStage(event.data);
        const onStorage = (event) => {
          if (event.key === STAGE_STORAGE_KEY) setStage(readStoredStage());
        };
        window.addEventListener('storage', onStorage);
        return () => {
          if (channel) channel.close();
          window.removeEventListener('storage', onStorage);
        };
      }, []);
      return stage;
    }
