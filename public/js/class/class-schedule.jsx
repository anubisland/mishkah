    // The teacher's upcoming classes. Each class gets its plan days ahead, so
    // the program can prepare it; classes coming up soon without a plan are
    // flagged when she opens the program.
    //
    // class = { id, title, at (ISO date-time), plan: plan|null, preparedAt: ms|null }
    const CLASS_SCHEDULE_KEY = 'mishkah_class_schedule';
    const PLAN_REMINDER_DAYS = 3;

    function loadClassSchedule() {
      try {
        const saved = localStorage.getItem(CLASS_SCHEDULE_KEY);
        const list = saved ? JSON.parse(saved) : [];
        return Array.isArray(list) ? list.filter((c) => c && c.id && c.at) : [];
      } catch (e) {
        console.warn('Mishkah: saved class schedule is unreadable', e);
        return [];
      }
    }

    // Returns an Arabic error message, or null when saved.
    function saveClassSchedule(list) {
      try {
        localStorage.setItem(CLASS_SCHEDULE_KEY, JSON.stringify(list));
        return null;
      } catch (e) {
        console.warn('Mishkah: could not save the class schedule', e);
        return 'تعذّر حفظ جدول الحصص على الجهاز (قد تكون الذاكرة ممتلئة).';
      }
    }

    function sortByTime(list) {
      return list.slice().sort((a, b) => new Date(a.at) - new Date(b.at));
    }

    // Classes from an hour ago onwards: a class just started still shows.
    function upcomingClasses(list, now) {
      const from = (now || Date.now()) - 60 * 60 * 1000;
      return sortByTime(list).filter((c) => new Date(c.at).getTime() >= from);
    }

    function classesNeedingPlan(list, now) {
      const t = now || Date.now();
      const until = t + PLAN_REMINDER_DAYS * 24 * 60 * 60 * 1000;
      return upcomingClasses(list, t).filter((c) => !c.plan && new Date(c.at).getTime() <= until);
    }

    function formatClassTime(iso) {
      const d = new Date(iso);
      return d.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' }) + ' — ' +
        d.toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' });
    }

    // An .ics file the teacher opens on her phone or computer to add the class
    // to her calendar, with a reminder a day before to prepare its plan, and
    // another 15 minutes before it starts. The program has no server, so this
    // is how a reminder reaches her while the program is closed.
    function downloadClassCalendarFile(cls) {
      const start = new Date(cls.at);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      const stamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      const escapeText = (t) => String(t || '').replace(/[\\,;]/g, (m) => '\\' + m).replace(/\n/g, '\\n');
      const lines = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//AnubisLand//Mishkah//AR', 'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        'UID:' + cls.id + '@mishkah.anubisland',
        'DTSTAMP:' + stamp(new Date()),
        'DTSTART:' + stamp(start),
        'DTEND:' + stamp(end),
        'SUMMARY:' + escapeText('حصة: ' + cls.title),
        'DESCRIPTION:' + escapeText('موعد تجهيز خطة الحصة في مِشكاة إن لم تكن جاهزة.'),
        'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:' + escapeText('غداً حصة ' + cls.title + ': موعد تجهيز خطتها في مِشكاة'), 'END:VALARM',
        'BEGIN:VALARM', 'TRIGGER:-PT15M', 'ACTION:DISPLAY', 'DESCRIPTION:' + escapeText('بعد ربع ساعة حصة ' + cls.title), 'END:VALARM',
        'END:VEVENT', 'END:VCALENDAR'
      ];
      const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'حصة ' + String(cls.title).replace(/[\\/:*?"<>|]/g, '') + '.ics';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }
