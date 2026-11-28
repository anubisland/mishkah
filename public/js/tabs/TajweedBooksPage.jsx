    // The «التجويد» page: the same books as the tajweed class — «التجويد
    // المصور» page by page and «أطلس التجويد» — for preparing and revising
    // outside class. The place is shared with the class (App owns it).
    function TajweedBooksPage({ books }) {
      return (
        <div className="max-w-3xl mx-auto space-y-3" dir="rtl">
          <section className="card-islamic-pearl rounded-2xl p-4 border-2 border-emerald-900/10">
            <h2 className="text-2xl font-black text-emerald-950">📖 التجويد</h2>
            <p className="text-sm text-slate-700 mt-1">من كتابي الدكتور أيمن رشدي سويد بترتيبهما. الصفحة التي يُوقف عندها هنا تُفتح في الحصة القادمة.</p>
          </section>
          <TajweedBookPanel key={books.bookId} books={books} onReadFromPage={null} />
        </div>
      );
    }
