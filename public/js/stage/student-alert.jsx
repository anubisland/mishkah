    // The mistake alert: the teacher presses a button and a short, gentle chime
    // plays in the student window, which Zoom carries to the student when
    // "Share sound" is ticked. Browsers may keep a window silent until it has
    // been clicked once; the student window then says so, and the chime plays
    // on the teacher's computer instead, where the microphone picks it up.
    const STUDENT_ALERT_CHANNEL = 'mishkah_student_alert';

    let alertAudio = null;
    // Resolves to true when the chime played.
    async function playAlertChime() {
      try { return await playChimeNow(); } catch (e) { console.warn('Mishkah: the alert could not play', e); return false; }
    }
    async function playChimeNow() {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return false;
      if (!alertAudio) alertAudio = new Ctx();
      if (alertAudio.state === 'suspended') {
        try { await alertAudio.resume(); } catch (e) { console.warn('Mishkah: the browser kept the alert silent', e); return false; }
      }
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

    // Teacher side. Without a student window the chime plays here, and
    // onLocal(played) reports whether it did.
    function sendStudentAlert(studentWindowOpen, onLocal) {
      const channel = getAlertChannel();
      if (!studentWindowOpen || !channel) {
        playAlertChime().then((played) => { if (onLocal) onLocal(played); });
        return;
      }
      channel.postMessage({ type: 'alert', at: Date.now() });
    }

    // onPlayedHere(played): the student window was silent, so the chime was
    // tried on the teacher's computer.
    function useAlertBlockedNotice(onPlayedHere) {
      useEffect(() => {
        const channel = getAlertChannel();
        if (!channel) return;
        const onMessage = (event) => {
          if (event.data && event.data.type === 'alert-blocked') playAlertChime().then(onPlayedHere);
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
          playAlertChime().then((played) => { if (!played) channel.postMessage({ type: 'alert-blocked' }); });
        };
        // One click anywhere in the student window allows its sound from then on.
        const unlock = () => {
          const Ctx = window.AudioContext || window.webkitAudioContext;
          if (!Ctx) return;
          if (!alertAudio) alertAudio = new Ctx();
          alertAudio.resume().catch((e) => console.warn('Mishkah: could not enable the alert sound', e));
        };
        channel.addEventListener('message', onMessage);
        window.addEventListener('pointerdown', unlock);
        return () => {
          channel.removeEventListener('message', onMessage);
          window.removeEventListener('pointerdown', unlock);
        };
      }, [enabled]);
    }
