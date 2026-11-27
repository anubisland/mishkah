    // The mistake alert: the teacher presses a button and a short, gentle chime
    // plays in the student window, which Zoom carries to the student when
    // "Share sound" is ticked. Browsers may keep a window silent until it has
    // been clicked once; the student window then says so, and the chime plays
    // on the teacher's computer instead, where the microphone picks it up.
    const STUDENT_ALERT_CHANNEL = 'mishkah_student_alert';

    let alertAudio = null;
    function playAlertChime() {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return false;
      if (!alertAudio) alertAudio = new Ctx();
      if (alertAudio.state === 'suspended') alertAudio.resume();
      if (alertAudio.state !== 'running') return false;
      // Two soft notes, falling: noticeable without being harsh.
      [[880, 0], [660, 0.16]].forEach(([freq, delay]) => {
        const osc = alertAudio.createOscillator();
        const gain = alertAudio.createGain();
        const t = alertAudio.currentTime + delay;
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.35, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
        osc.connect(gain).connect(alertAudio.destination);
        osc.start(t);
        osc.stop(t + 0.32);
      });
      return true;
    }

    let alertChannel = null;
    function getAlertChannel() {
      if (!alertChannel && typeof BroadcastChannel !== 'undefined') alertChannel = new BroadcastChannel(STUDENT_ALERT_CHANNEL);
      return alertChannel;
    }

    // Teacher side. onBlocked runs when the student window could not play it.
    function sendStudentAlert(studentWindowOpen, onBlocked) {
      const channel = getAlertChannel();
      if (!studentWindowOpen || !channel) {
        if (!playAlertChime() && onBlocked) onBlocked();
        return;
      }
      channel.postMessage({ type: 'alert', at: Date.now() });
    }

    function useAlertBlockedNotice(onBlocked) {
      useEffect(() => {
        const channel = getAlertChannel();
        if (!channel) return;
        const onMessage = (event) => {
          if (event.data && event.data.type === 'alert-blocked') {
            playAlertChime();
            onBlocked();
          }
        };
        channel.addEventListener('message', onMessage);
        return () => channel.removeEventListener('message', onMessage);
      }, []);
    }

    // Student side (not in the small previews inside the teacher window).
    function useStudentAlertListener(enabled) {
      useEffect(() => {
        const channel = enabled ? getAlertChannel() : null;
        if (!channel) return;
        const onMessage = (event) => {
          if (!event.data || event.data.type !== 'alert') return;
          if (!playAlertChime()) channel.postMessage({ type: 'alert-blocked' });
        };
        // One click anywhere in the student window allows its sound from then on.
        const unlock = () => {
          const Ctx = window.AudioContext || window.webkitAudioContext;
          if (!Ctx) return;
          if (!alertAudio) alertAudio = new Ctx();
          alertAudio.resume();
        };
        channel.addEventListener('message', onMessage);
        window.addEventListener('pointerdown', unlock);
        return () => {
          channel.removeEventListener('message', onMessage);
          window.removeEventListener('pointerdown', unlock);
        };
      }, [enabled]);
    }
