    // Today's class plan. The program holds all the material; before each class
    // the teacher says what this class covers, the program prepares exactly
    // that, and class mode is organised around it.
    //
    // plan = { createdAt, items: [item] }, in teaching order
    // item = { type: 'hifz', surahId, surahName, fromAyah, toAyah, fromPage, toPage }
    //      | { type: 'tajweed', lessonIds: [id] }
    //      | { type: 'lecture', deckTitle }
    const CLASS_PLAN_KEY = 'mishkah_class_plan';

    function loadClassPlan() {
      try {
        const saved = localStorage.getItem(CLASS_PLAN_KEY);
        const plan = saved ? JSON.parse(saved) : null;
        return plan && Array.isArray(plan.items) && plan.items.length ? plan : null;
      } catch (e) {
        console.warn('Mishkah: saved class plan is unreadable', e);
        return null;
      }
    }

    function saveClassPlan(plan) {
      try {
        localStorage.setItem(CLASS_PLAN_KEY, JSON.stringify(plan));
        return true;
      } catch (e) {
        console.warn('Mishkah: could not save the class plan', e);
        return false;
      }
    }

    function classPlanItemLabel(item) {
      if (item.type === 'hifz') {
        const pages = item.fromPage === item.toPage ? 'صفحة ' + item.fromPage : 'الصفحات ' + item.fromPage + '–' + item.toPage;
        return '🎧 ' + item.surahName + ' ' + item.fromAyah + '–' + item.toAyah + ' (' + pages + ')';
      }
      if (item.type === 'tajweed') {
        const titles = item.lessonIds.map((id) => (SUWAYD_TAJWEED_CURRICULUM.find((l) => l.id === id) || {}).titleAr).filter(Boolean);
        return '🎙️ ' + (titles.join('، ') || 'درس تجويد');
      }
      if (item.type === 'lecture') return '🎞️ محاضرة: ' + (item.deckTitle || 'العرض المجهّز');
      return '';
    }

    // The mushaf pages that hold an ayah range (from the Quran API, which knows
    // the Madinah page of every ayah).
    async function fetchAyahPage(surahId, ayah) {
      const res = await fetch('https://api.alquran.cloud/v1/ayah/' + surahId + ':' + ayah);
      if (!res.ok) throw new Error('ayah ' + res.status);
      const json = await res.json();
      return json.data.page;
    }

    async function resolveHifzPages(surahId, fromAyah, toAyah) {
      const [fromPage, toPage] = await Promise.all([fetchAyahPage(surahId, fromAyah), fetchAyahPage(surahId, toAyah)]);
      return { fromPage, toPage };
    }

    // Loads every page image and page text the plan needs, so the service
    // worker keeps them on the device and the class runs on a weak connection.
    async function prepareClassPlan(plan, onProgress) {
      const urls = [];
      plan.items.filter((it) => it.type === 'hifz').forEach((it) => {
        for (let p = it.fromPage; p <= it.toPage; p++) {
          urls.push({ url: mushafPageImageUrl(p), image: true });
          urls.push({ url: 'https://api.alquran.cloud/v1/page/' + p + '/quran-uthmani', image: false });
        }
      });
      const failed = [];
      for (let i = 0; i < urls.length; i++) {
        onProgress(i, urls.length);
        try {
          const res = await fetch(urls[i].url, urls[i].image ? { mode: 'no-cors' } : {});
          if (!urls[i].image && !res.ok) failed.push(urls[i].url);
        } catch (e) {
          failed.push(urls[i].url);
        }
      }
      onProgress(urls.length, urls.length);
      return { total: urls.length, failed };
    }
