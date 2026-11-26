# -*- coding: utf-8 -*-
"""
Mishkah Master Scholarly Presentation Generator (v81.2 Masterpiece Edition)
Organization: AnubisLand
Lecture: العقيدة الإسلامية — المحاضرة الثانية: من هو الله؟
Full 30-Slide Exemplar Presentation with Unified Card Containers, True Arabic RTL Ordering, and Elderly-Friendly Typography.
"""

import json
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    return RGBColor(*(int(hex_str[i:i+2], 16) for i in (0, 2, 4)))

# Brand Colors (AnubisLand Mishkah Covenant)
COLOR_EMERALD_DEEP = hex_to_rgb('0B2E24')
COLOR_EMERALD_DARK = hex_to_rgb('123329')
COLOR_GOLD = hex_to_rgb('C69214')
COLOR_GOLD_LIGHT = hex_to_rgb('FDE68A')
COLOR_IVORY_BG = hex_to_rgb('FAF7F2')
COLOR_CARD_BG = hex_to_rgb('FFFFFF')
COLOR_CARD_BORDER = hex_to_rgb('DCD2BD')
COLOR_TEXT_DARK = hex_to_rgb('1E293B')
COLOR_TEXT_MUTED = hex_to_rgb('64748B')
COLOR_WHITE = hex_to_rgb('FFFFFF')
COLOR_QURAN_GREEN = hex_to_rgb('047857')

TOTAL_WIDTH = 13.333
TOTAL_HEIGHT = 7.5

def is_sacred_text(text):
    text = text.strip()
    return (
        text.startswith('«') or text.startswith('»') or 
        text.startswith('"') or text.startswith('"') or
        text.startswith('{') or text.startswith('﴿') or 
        'قال الله' in text or 'رسول الله' in text or 'صلى الله عليه وسلم' in text or 'ﷺ' in text
    )

def add_header_elements(slide, tag_text, title_text, is_dark=False):
    # Category Tag
    if tag_text:
        tb_tag = slide.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(11.733), Inches(0.4))
        p_tag = tb_tag.text_frame.paragraphs[0]
        p_tag.alignment = PP_ALIGN.RIGHT
        p_tag.font.name = "Cairo"
        p_tag.font.size = Pt(14)
        p_tag.font.bold = True
        p_tag.font.color.rgb = COLOR_GOLD_LIGHT if is_dark else COLOR_GOLD
        p_tag.text = tag_text

    # Main Title
    if title_text:
        tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.9), Inches(11.733), Inches(0.75))
        p_title = tb_title.text_frame.paragraphs[0]
        p_title.alignment = PP_ALIGN.RIGHT
        p_title.font.name = "Cairo"
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_WHITE if is_dark else COLOR_EMERALD_DARK
        p_title.text = title_text

def build_presentation(analysis_json_path, output_pptx_path):
    with open(analysis_json_path, 'r', encoding='utf-8') as f:
        slides_data = json.load(f)

    prs = Presentation()
    prs.slide_width = Inches(TOTAL_WIDTH)
    prs.slide_height = Inches(TOTAL_HEIGHT)
    blank_layout = prs.slide_layouts[6]

    for s_idx, s in enumerate(slides_data):
        slide = prs.slides.add_slide(blank_layout)
        idx = s.get('slide_index', s_idx + 1)
        shapes_info = s.get('shapes_info', [])
        has_table = s.get('has_table', False)
        table_data = s.get('table_data', [])
        notes_text = s.get('notes', '')

        # Set Speaker Notes
        if notes_text and hasattr(slide, 'notes_slide'):
            try:
                slide.notes_slide.notes_text_frame.text = notes_text
            except Exception:
                pass

        is_dark_slide = (idx in [1, 30])

        # 1. Slide Background
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(TOTAL_WIDTH), Inches(TOTAL_HEIGHT))
        bg.fill.solid()
        bg.fill.fore_color.rgb = COLOR_EMERALD_DEEP if is_dark_slide else COLOR_IVORY_BG
        bg.line.fill.background()

        # 2. Top Islamic Gold Trim
        top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(TOTAL_WIDTH), Inches(0.12))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = COLOR_GOLD
        top_bar.line.fill.background()

        # 3. Footer Banner
        footer = slide.shapes.add_textbox(Inches(0.8), Inches(7.05), Inches(11.733), Inches(0.35))
        ftf = footer.text_frame
        ftf.word_wrap = True
        fp = ftf.paragraphs[0]
        fp.alignment = PP_ALIGN.RIGHT
        fp.font.name = "Cairo"
        fp.font.size = Pt(10)
        fp.font.color.rgb = COLOR_GOLD_LIGHT if is_dark_slide else COLOR_TEXT_MUTED
        fp.text = f"مِشكاة — نظام التشغيل الشرعي | المحاضرة الثانية: من هو الله؟ | شريحة {idx} من {len(slides_data)}"

        # ==========================================
        # SPECIAL CASE: Slide 1 (Title Slide)
        # ==========================================
        if idx == 1:
            tb = slide.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.333), Inches(0.6))
            p = tb.text_frame.paragraphs[0]
            p.alignment = PP_ALIGN.CENTER
            p.font.name = "Cairo"
            p.font.size = Pt(20)
            p.font.bold = True
            p.font.color.rgb = COLOR_GOLD
            p.text = "العقيدة الإسلامية — المحاضرة الثانية"

            tb2 = slide.shapes.add_textbox(Inches(1.0), Inches(2.5), Inches(11.333), Inches(1.5))
            p2 = tb2.text_frame.paragraphs[0]
            p2.alignment = PP_ALIGN.CENTER
            p2.font.name = "Cairo"
            p2.font.size = Pt(46)
            p2.font.bold = True
            p2.font.color.rgb = COLOR_WHITE
            p2.text = "مَنْ هُوَ اللهُ؟"

            tb3 = slide.shapes.add_textbox(Inches(1.0), Inches(4.1), Inches(11.333), Inches(0.8))
            p3 = tb3.text_frame.paragraphs[0]
            p3.alignment = PP_ALIGN.CENTER
            p3.font.name = "Cairo"
            p3.font.size = Pt(22)
            p3.font.color.rgb = COLOR_GOLD_LIGHT
            p3.text = "تأصيل توحيد الربوبية وتوحيد الألوهية وبناء اليقين"

            card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.5), Inches(5.1), Inches(10.333), Inches(1.2))
            card.fill.solid()
            card.fill.fore_color.rgb = hex_to_rgb('123329')
            card.line.color.rgb = COLOR_GOLD
            card.line.width = Pt(1.5)
            ctf = card.text_frame
            ctf.word_wrap = True
            cp = ctf.paragraphs[0]
            cp.alignment = PP_ALIGN.CENTER
            cp.font.name = "Cairo"
            cp.font.size = Pt(16)
            cp.font.color.rgb = COLOR_WHITE
            cp.text = "معنى توحيد الربوبية • معنى توحيد الألوهية • لماذا لا يكفي الإقرار بوجود الله؟ • الفرق بين الاعتراف بالخالق وإفراده بالعبادة"
            continue

        # ==========================================
        # SPECIAL CASE: Slide 2 (Authoritative Sources - Perfect Unified RTL Cards)
        # ==========================================
        if idx == 2:
            add_header_elements(slide, "المصادر العلمية المعتمدة", "على أي أساس نبني هذا الدرس؟")

            sources = [
                {
                    "badge": "المصدر الأول",
                    "title": "«ثلاثة الأصول وأدلتها»",
                    "author": "للإمام محمد بن عبد الوهاب رحمه الله",
                    "focus": "باب: معرفة العبد ربه بالأدلة والبراهين الصريحة من الكتاب والسنة."
                },
                {
                    "badge": "المصدر الثاني",
                    "title": "«نبذة في العقيدة الإسلامية»",
                    "author": "للشيخ محمد بن صالح العثيمين رحمه الله",
                    "focus": "باب: الإيمان بالله — تفصيل ركائز الربوبية الثلاث وإفراد الألوهية ومقتضى التوحيد."
                },
                {
                    "badge": "المصدر الثالث",
                    "title": "منهج العقيدة — أكاديمية زاد",
                    "author": "المنهج التأسيسي للشيخ محمد صالح المنجد",
                    "focus": "مقرر «العقيدة الإسلامية» — بناء اليقين العقدي والتصور الشامل للوجود والتحرر من الشرك."
                }
            ]

            card_w = 3.65
            gap = 0.39
            top_y = 1.95
            card_h = 4.7

            for i, src in enumerate(sources):
                # RTL position: Source 1 on the far RIGHT!
                x_pos = 0.8 + (2 - i) * (card_w + gap)

                card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x_pos), Inches(top_y), Inches(card_w), Inches(card_h))
                card.fill.solid()
                card.fill.fore_color.rgb = COLOR_WHITE
                card.line.color.rgb = COLOR_CARD_BORDER
                card.line.width = Pt(1.5)

                tf = card.text_frame
                tf.word_wrap = True
                tf.margin_top = Inches(0.35)
                tf.margin_bottom = Inches(0.35)
                tf.margin_left = Inches(0.35)
                tf.margin_right = Inches(0.35)

                p_b = tf.paragraphs[0]
                p_b.alignment = PP_ALIGN.RIGHT
                p_b.font.name = "Cairo"
                p_b.font.size = Pt(13)
                p_b.font.bold = True
                p_b.font.color.rgb = COLOR_GOLD
                p_b.text = src["badge"]
                p_b.space_after = Pt(10)

                p_t = tf.add_paragraph()
                p_t.alignment = PP_ALIGN.RIGHT
                p_t.font.name = "Cairo"
                p_t.font.size = Pt(20)
                p_t.font.bold = True
                p_t.font.color.rgb = COLOR_EMERALD_DARK
                p_t.text = src["title"]
                p_t.space_after = Pt(12)

                p_a = tf.add_paragraph()
                p_a.alignment = PP_ALIGN.RIGHT
                p_a.font.name = "Cairo"
                p_a.font.size = Pt(15)
                p_a.font.bold = True
                p_a.font.color.rgb = COLOR_QURAN_GREEN
                p_a.text = src["author"]
                p_a.space_after = Pt(14)

                p_f = tf.add_paragraph()
                p_f.alignment = PP_ALIGN.RIGHT
                p_f.font.name = "Traditional Arabic"
                p_f.font.size = Pt(16)
                p_f.font.color.rgb = COLOR_TEXT_DARK
                p_f.text = src["focus"]
            continue

        # ==========================================
        # SPECIAL CASE: Slide 3 (Introduction / Thought Experiment)
        # ==========================================
        if idx == 3:
            add_header_elements(slide, "مقدمة: السؤال الأول الذي يحدد مصير الإنسان", "تخيّل أنك استيقظت في قطار فائق السرعة…")

            tb2 = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.65), Inches(11.733), Inches(0.85))
            tb2.fill.solid()
            tb2.fill.fore_color.rgb = hex_to_rgb('F4EFE6')
            tb2.line.color.rgb = COLOR_CARD_BORDER
            tb2.line.width = Pt(1)
            p2 = tb2.text_frame.paragraphs[0]
            p2.alignment = PP_ALIGN.RIGHT
            p2.font.name = "Traditional Arabic"
            p2.font.size = Pt(17)
            p2.font.bold = True
            p2.font.color.rgb = COLOR_TEXT_DARK
            p2.text = "ينطلق بك عبر أودية وجبال لا تعرفها. لن تسأل عن لون المقاعد ولا عن نوع الطعام، بل ستسأل فوراً:"

            questions = [
                ("١", "من الذي يقود هذا القطار؟"),
                ("٢", "من الذي وضعني فيه؟"),
                ("٣", "إلى أين يتجه بي؟"),
                ("٤", "ما المطلوب مني أثناء الرحلة؟")
            ]
            q_width = 2.75
            q_gap = 0.24
            q_top = 2.65
            q_height = 2.3

            for q_idx, (num, q_text) in enumerate(questions):
                x_pos = 0.8 + (3 - q_idx) * (q_width + q_gap)

                q_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x_pos), Inches(q_top), Inches(q_width), Inches(q_height))
                q_card.fill.solid()
                q_card.fill.fore_color.rgb = COLOR_WHITE
                q_card.line.color.rgb = COLOR_GOLD
                q_card.line.width = Pt(1.5)

                qtf = q_card.text_frame
                qtf.word_wrap = True
                qp_num = qtf.paragraphs[0]
                qp_num.alignment = PP_ALIGN.CENTER
                qp_num.font.name = "Cairo"
                qp_num.font.size = Pt(24)
                qp_num.font.bold = True
                qp_num.font.color.rgb = COLOR_GOLD
                qp_num.text = num

                qp_text = qtf.add_paragraph()
                qp_text.alignment = PP_ALIGN.CENTER
                qp_text.font.name = "Cairo"
                qp_text.font.size = Pt(18)
                qp_text.font.bold = True
                qp_text.font.color.rgb = COLOR_EMERALD_DARK
                qp_text.text = q_text

            punch_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.2), Inches(11.733), Inches(1.4))
            punch_box.fill.solid()
            punch_box.fill.fore_color.rgb = COLOR_EMERALD_DEEP
            punch_box.line.color.rgb = COLOR_GOLD
            punch_box.line.width = Pt(1.5)
            ptf = punch_box.text_frame
            ptf.word_wrap = True
            pp1 = ptf.paragraphs[0]
            pp1.alignment = PP_ALIGN.CENTER
            pp1.font.name = "Cairo"
            pp1.font.size = Pt(20)
            pp1.font.bold = True
            pp1.font.color.rgb = COLOR_GOLD_LIGHT
            pp1.text = "هكذا تماماً هي حياة الإنسان على هذه الأرض."

            pp2 = ptf.add_paragraph()
            pp2.alignment = PP_ALIGN.CENTER
            pp2.font.name = "Traditional Arabic"
            pp2.font.size = Pt(16)
            pp2.font.color.rgb = COLOR_WHITE
            pp2.text = "أسئلة وجودية حاسمة تحدد الغاية والمصير، والإجابة عنها هي أول وأعظم واجب على كل مكلف."
            continue

        # ==========================================
        # SPECIAL CASE: Slide 7 (The 3 Pillars of Rububiyyah - Unified RTL Cards)
        # ==========================================
        if idx == 7:
            add_header_elements(slide, "ركائز الربوبية الثلاث — «نبذة في العقيدة الإسلامية»", "الإيمان بالله يكتمل بأربعة أمور: بوجوده، وبربوبيته، وبألوهيته، وبأسمائه وصفاته.")

            pillars = [
                {
                    "num": "١",
                    "title": "التفرد بالخلق",
                    "body": "لا خالق إلا الله؛ كل ما في السماوات والأرض — حتى أفعال العباد — مخلوق له سبحانه. و«صنع البشر» ليس خلقاً من عدم، بل مجرد تحويل وتركيب لمواد خلقها الله وأوجدها."
                },
                {
                    "num": "٢",
                    "title": "التفرد بالملك",
                    "body": "الله هو المالك الحقيقي المطلق لجميع الكائنات ونواصي العباد بيده. وملك الإنسان لما تحت يده ملك عارضي ناقص ومؤقت، ينتهي بالموت ولا يتصرف فيه إلا بما شرع الله."
                },
                {
                    "num": "٣",
                    "title": "التفرد بالأمر والتدبير",
                    "body": "يدبر أمر السماوات والأرض من فوق سبع سماوات: يقسم الأرزاق، ويعز ويذل، ويحيي ويميت، ويشفي المريض ويكشف الكرب؛ لا راد لقضائه ولا معقب لحكمه."
                }
            ]

            card_w = 3.65
            gap = 0.39
            top_y = 1.95
            card_h = 4.7

            for i, p_info in enumerate(pillars):
                x_pos = 0.8 + (2 - i) * (card_w + gap)

                card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x_pos), Inches(top_y), Inches(card_w), Inches(card_h))
                card.fill.solid()
                card.fill.fore_color.rgb = COLOR_WHITE
                card.line.color.rgb = COLOR_CARD_BORDER
                card.line.width = Pt(1.5)

                tf = card.text_frame
                tf.word_wrap = True
                tf.margin_top = Inches(0.35)
                tf.margin_bottom = Inches(0.35)
                tf.margin_left = Inches(0.35)
                tf.margin_right = Inches(0.35)

                p_num = tf.paragraphs[0]
                p_num.alignment = PP_ALIGN.RIGHT
                p_num.font.name = "Cairo"
                p_num.font.size = Pt(28)
                p_num.font.bold = True
                p_num.font.color.rgb = COLOR_GOLD
                p_num.text = p_info["num"]
                p_num.space_after = Pt(8)

                p_t = tf.add_paragraph()
                p_t.alignment = PP_ALIGN.RIGHT
                p_t.font.name = "Cairo"
                p_t.font.size = Pt(22)
                p_t.font.bold = True
                p_t.font.color.rgb = COLOR_EMERALD_DARK
                p_t.text = p_info["title"]
                p_t.space_after = Pt(14)

                p_b = tf.add_paragraph()
                p_b.alignment = PP_ALIGN.RIGHT
                p_b.font.name = "Traditional Arabic"
                p_b.font.size = Pt(16)
                p_b.font.color.rgb = COLOR_TEXT_DARK
                p_b.text = p_info["body"]
            continue

        # ==========================================
        # SPECIAL CASE: Slide 8 (Two Types of God's Order - Unified RTL Cards)
        # ==========================================
        if idx == 8:
            add_header_elements(slide, "التفرد بالأمر والتدبير", "أمر الله نوعان عظيمان")

            orders = [
                {
                    "badge": "النوع الأول",
                    "title": "الأمر الكوني القدري",
                    "body": "مشيئته النافذة في الكون التي لا يردها راد ولا يعقبها معقب؛ فما شاء الله كان، وما لم يشأ لم يكن.\n\nيدخل تحته خلق الكائنات وحركة الأفلاك وتصريف الرياح وحياة وموت المخلوقات، لا يخرج عنه مؤمن ولا كافر ولا ذرة في الوجود."
                },
                {
                    "badge": "النوع الثاني",
                    "title": "الأمر الشرعي الديني",
                    "body": "ما أنزله الله على رسله الكرام من الشرائع والأحكام والأوامر والنواهي التي ابتلى بها عباده ليظهر المطيع من العاصي.\n\nوهذا الأمر يحبه الله ويرضاه، لكن العباد مخيرون في الامتثال له؛ فمنهم من أطاع وأفلح، ومنهم من عصى فخسر."
                }
            ]

            card_w = 5.6
            gap = 0.53
            top_y = 1.95
            card_h = 4.7

            for i, ord_info in enumerate(orders):
                # i=0 (الأمر الكوني) => Right column (x = 6.93)
                # i=1 (الأمر الشرعي) => Left column (x = 0.8)
                x_pos = 0.8 + (1 - i) * (card_w + gap)

                card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x_pos), Inches(top_y), Inches(card_w), Inches(card_h))
                card.fill.solid()
                card.fill.fore_color.rgb = COLOR_WHITE
                card.line.color.rgb = COLOR_CARD_BORDER
                card.line.width = Pt(1.5)

                tf = card.text_frame
                tf.word_wrap = True
                tf.margin_top = Inches(0.4)
                tf.margin_bottom = Inches(0.4)
                tf.margin_left = Inches(0.4)
                tf.margin_right = Inches(0.4)

                p_b = tf.paragraphs[0]
                p_b.alignment = PP_ALIGN.RIGHT
                p_b.font.name = "Cairo"
                p_b.font.size = Pt(14)
                p_b.font.bold = True
                p_b.font.color.rgb = COLOR_GOLD
                p_b.text = ord_info["badge"]
                p_b.space_after = Pt(10)

                p_t = tf.add_paragraph()
                p_t.alignment = PP_ALIGN.RIGHT
                p_t.font.name = "Cairo"
                p_t.font.size = Pt(22)
                p_t.font.bold = True
                p_t.font.color.rgb = COLOR_EMERALD_DARK
                p_t.text = ord_info["title"]
                p_t.space_after = Pt(16)

                p_desc = tf.add_paragraph()
                p_desc.alignment = PP_ALIGN.RIGHT
                p_desc.font.name = "Traditional Arabic"
                p_desc.font.size = Pt(17)
                p_desc.font.color.rgb = COLOR_TEXT_DARK
                p_desc.text = ord_info["body"]
            continue

        # ==========================================
        # SPECIAL CASE: Slide 26 (Comparison Table)
        # ==========================================
        if has_table and table_data:
            title_text = shapes_info[0]['text'].strip() if len(shapes_info) > 0 else 'أوجه التفريق الجوهرية'
            subtitle_text = shapes_info[1]['text'].strip() if len(shapes_info) > 1 else 'الشرك الأكبر والشرك الأصغر'
            bottom_note = shapes_info[2]['text'].strip() if len(shapes_info) > 2 else ''

            add_header_elements(slide, title_text, subtitle_text)

            rows = len(table_data)
            cols = len(table_data[0]) if rows > 0 else 3
            left = Inches(0.8)
            top = Inches(1.8)
            width = Inches(11.733)
            height = Inches(4.2)

            table_shape = slide.shapes.add_table(rows, cols, left, top, width, height)
            tbl = table_shape.table
            tbl.columns[0].width = Inches(2.333)
            tbl.columns[1].width = Inches(4.7)
            tbl.columns[2].width = Inches(4.7)

            for r_idx, row in enumerate(table_data):
                is_header = (r_idx == 0)
                for c_idx, cell_value in enumerate(row):
                    cell = tbl.cell(r_idx, c_idx)
                    cell.vertical_anchor = MSO_ANCHOR.MIDDLE
                    cell.fill.solid()
                    if is_header:
                        cell.fill.fore_color.rgb = COLOR_EMERALD_DEEP
                    elif r_idx % 2 == 1:
                        cell.fill.fore_color.rgb = COLOR_WHITE
                    else:
                        cell.fill.fore_color.rgb = hex_to_rgb('F4EFE6')

                    cp = cell.text_frame.paragraphs[0]
                    cp.alignment = PP_ALIGN.CENTER if is_header else PP_ALIGN.RIGHT
                    cp.font.name = "Cairo" if is_header else "Traditional Arabic"
                    cp.font.size = Pt(15) if is_header else Pt(14)
                    cp.font.bold = is_header or (c_idx == 0)
                    cp.font.color.rgb = COLOR_GOLD if is_header else COLOR_TEXT_DARK
                    cp.text = cell_value

            if bottom_note:
                b_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.15), Inches(11.733), Inches(0.75))
                b_box.fill.solid()
                b_box.fill.fore_color.rgb = COLOR_WHITE
                b_box.line.color.rgb = COLOR_GOLD
                b_box.line.width = Pt(1)
                btf = b_box.text_frame
                btf.word_wrap = True
                bp = btf.paragraphs[0]
                bp.alignment = PP_ALIGN.RIGHT
                bp.font.name = "Cairo"
                bp.font.size = Pt(13)
                bp.font.bold = True
                bp.font.color.rgb = COLOR_EMERALD_DARK
                bp.text = bottom_note
            continue

        # ==========================================
        # SPECIAL CASE: Slide 27 (Four Fortresses - Unified RTL Cards)
        # ==========================================
        if idx == 27:
            add_header_elements(slide, "خلاصة تربوية: كيف يحمي المسلم نفسه من الشركين؟", "المؤمن الصادق لا يأمن على نفسه الفتنة؛ فإذا كان إبراهيم  يدعو: «واجنبني وبني أن نعبد الأصنام»، فكيف بنا؟")

            forts = [
                ("الحصن الأول", "العلم الشرعي المؤصل", "دراسة التوحيد ونواقضه وقوادحه، حتى لا يقع في الشرك وهو يظنه تعظيماً أو محبة أو توسلاً مشروعاً."),
                ("الحصن الثاني", "المجاهدة في الإخلاص", "مراقبة النية قبل العمل وأثناءه وبعده، وتطهير القلب تماماً من التطلع إلى مدح الناس وريائهم."),
                ("الحصن الثالث", "ضبط الألفاظ والمعتقدات", "تطهير اللسان من الحلف بغير الله وألفاظ التسوية، وتطهير القلب من التشاؤم والتمائم والأوهام."),
                ("الحصن الرابع", "الالتجاء الدائم بالدعاء", "«اللهم إني أعوذ بك أن أشرك بك وأنا أعلم، وأستغفرك لما لا أعلم». دعاء نبوي حصين يحمي من دبيب الشرك.")
            ]

            card_w = 2.75
            gap = 0.24
            top_y = 1.95
            card_h = 4.7

            for f_idx, (b_txt, t_txt, desc_txt) in enumerate(forts):
                x_pos = 0.8 + (3 - f_idx) * (card_w + gap)

                card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x_pos), Inches(top_y), Inches(card_w), Inches(card_h))
                card.fill.solid()
                card.fill.fore_color.rgb = COLOR_WHITE
                card.line.color.rgb = COLOR_CARD_BORDER
                card.line.width = Pt(1.5)

                tf = card.text_frame
                tf.word_wrap = True
                tf.margin_top = Inches(0.35)
                tf.margin_bottom = Inches(0.35)
                tf.margin_left = Inches(0.3)
                tf.margin_right = Inches(0.3)

                p_b = tf.paragraphs[0]
                p_b.alignment = PP_ALIGN.RIGHT
                p_b.font.name = "Cairo"
                p_b.font.size = Pt(13)
                p_b.font.bold = True
                p_b.font.color.rgb = COLOR_GOLD
                p_b.text = b_txt
                p_b.space_after = Pt(8)

                p_t = tf.add_paragraph()
                p_t.alignment = PP_ALIGN.RIGHT
                p_t.font.name = "Cairo"
                p_t.font.size = Pt(18)
                p_t.font.bold = True
                p_t.font.color.rgb = COLOR_EMERALD_DARK
                p_t.text = t_txt
                p_t.space_after = Pt(12)

                p_d = tf.add_paragraph()
                p_d.alignment = PP_ALIGN.RIGHT
                p_d.font.name = "Traditional Arabic"
                p_d.font.size = Pt(15)
                p_d.font.color.rgb = COLOR_TEXT_DARK
                p_d.text = desc_txt
            continue

        # ==========================================
        # SPECIAL CASE: Slide 29 (Conclusion - 3 Pillars RTL)
        # ==========================================
        if idx == 29:
            add_header_elements(slide, "الخاتمة: من العلم إلى اليقين والعمل", "الصورة كاملة ناصعة البياض — أصول النجاة الثلاثة")

            final_pillars = [
                {
                    "num": "١",
                    "title": "الله سبحانه وتعالى",
                    "body": "الرب الخالق المالك المدبر الذي ربى جميع العالمين بنعمه، تشهد بربوبيته وعظمته كل آية في الآفاق وفي الأنفس، ولا رب ولا خالق سواه."
                },
                {
                    "num": "٢",
                    "title": "حقه الأعظم على عباده",
                    "body": "إفراده سبحانه بالألوهية والعبادة الظاهرة والباطنة، بلا ند ولا شريك في دعاء أو رجاء أو خوف أو توكل أو ذبح أو نذر."
                },
                {
                    "num": "٣",
                    "title": "الإقرار المجرد لا يكفي",
                    "body": "لا ينجي الإقرار بالربوبية ما لم يثمر استسلاماً وانقياداً لأمر الله وإخلاصاً للعبودية؛ فالمشركون أقروا بالخلق وعذبوا بالشرك."
                }
            ]

            card_w = 3.65
            gap = 0.39
            top_y = 1.95
            card_h = 4.7

            for i, p_info in enumerate(final_pillars):
                x_pos = 0.8 + (2 - i) * (card_w + gap)

                card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x_pos), Inches(top_y), Inches(card_w), Inches(card_h))
                card.fill.solid()
                card.fill.fore_color.rgb = COLOR_WHITE
                card.line.color.rgb = COLOR_CARD_BORDER
                card.line.width = Pt(1.5)

                tf = card.text_frame
                tf.word_wrap = True
                tf.margin_top = Inches(0.35)
                tf.margin_bottom = Inches(0.35)
                tf.margin_left = Inches(0.35)
                tf.margin_right = Inches(0.35)

                p_num = tf.paragraphs[0]
                p_num.alignment = PP_ALIGN.RIGHT
                p_num.font.name = "Cairo"
                p_num.font.size = Pt(28)
                p_num.font.bold = True
                p_num.font.color.rgb = COLOR_GOLD
                p_num.text = p_info["num"]
                p_num.space_after = Pt(8)

                p_t = tf.add_paragraph()
                p_t.alignment = PP_ALIGN.RIGHT
                p_t.font.name = "Cairo"
                p_t.font.size = Pt(22)
                p_t.font.bold = True
                p_t.font.color.rgb = COLOR_EMERALD_DARK
                p_t.text = p_info["title"]
                p_t.space_after = Pt(14)

                p_b = tf.add_paragraph()
                p_b.alignment = PP_ALIGN.RIGHT
                p_b.font.name = "Traditional Arabic"
                p_b.font.size = Pt(16)
                p_b.font.color.rgb = COLOR_TEXT_DARK
                p_b.text = p_info["body"]
            continue

        # ==========================================
        # GENERAL SLIDE RENDERING (With RTL horizontal columns & unified styling)
        # ==========================================
        for sh_idx, sh in enumerate(shapes_info):
            raw_text = sh.get('text', '').strip()
            if not raw_text:
                continue

            left_in = sh['left'] / 914400.0
            top_in = sh['top'] / 914400.0
            width_in = sh['width'] / 914400.0
            height_in = sh['height'] / 914400.0

            is_full_width = (width_in > 10.0)

            if is_full_width:
                if sh_idx == 0 and top_in < 1.3:
                    tbox = slide.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(11.733), Inches(0.45))
                    tf = tbox.text_frame
                    tf.word_wrap = True
                    p = tf.paragraphs[0]
                    p.alignment = PP_ALIGN.RIGHT
                    p.font.name = "Cairo"
                    p.font.size = Pt(14)
                    p.font.bold = True
                    p.font.color.rgb = COLOR_GOLD
                    p.text = raw_text
                elif (sh_idx == 1 and top_in < 2.0) or (sh_idx == 0 and top_in >= 1.3):
                    tbox = slide.shapes.add_textbox(Inches(0.8), Inches(top_in), Inches(11.733), Inches(0.8))
                    tf = tbox.text_frame
                    tf.word_wrap = True
                    p = tf.paragraphs[0]
                    p.alignment = PP_ALIGN.RIGHT
                    p.font.name = "Cairo"
                    p.font.size = Pt(24)
                    p.font.bold = True
                    p.font.color.rgb = COLOR_EMERALD_DARK
                    p.text = raw_text
                else:
                    if is_sacred_text(raw_text):
                        qbox = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(top_in), Inches(11.733), Inches(max(height_in, 0.95)))
                        qbox.fill.solid()
                        qbox.fill.fore_color.rgb = COLOR_WHITE
                        qbox.line.color.rgb = COLOR_GOLD
                        qbox.line.width = Pt(1.5)
                        qtf = qbox.text_frame
                        qtf.word_wrap = True
                        qp = qtf.paragraphs[0]
                        qp.alignment = PP_ALIGN.CENTER
                        qp.font.name = "Amiri Quran" if ('{' in raw_text or '﴿' in raw_text) else "Traditional Arabic"
                        qp.font.size = Pt(17)
                        qp.font.bold = True
                        qp.font.color.rgb = COLOR_EMERALD_DARK
                        qp.text = raw_text
                    else:
                        tbox = slide.shapes.add_textbox(Inches(0.8), Inches(top_in), Inches(11.733), Inches(height_in))
                        tf = tbox.text_frame
                        tf.word_wrap = True
                        p = tf.paragraphs[0]
                        p.alignment = PP_ALIGN.RIGHT
                        p.font.name = "Traditional Arabic"
                        p.font.size = Pt(16)
                        p.font.color.rgb = COLOR_TEXT_DARK
                        p.text = raw_text
            else:
                # RTL Mirror for Column elements
                rtl_left = TOTAL_WIDTH - left_in - width_in
                rtl_left = max(0.6, min(rtl_left, 12.5))

                if raw_text in ['١', '٢', '٣', '٤']:
                    badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(rtl_left), Inches(top_in), Inches(width_in), Inches(height_in))
                    badge.fill.solid()
                    badge.fill.fore_color.rgb = COLOR_EMERALD_DEEP
                    badge.line.color.rgb = COLOR_GOLD
                    badge.line.width = Pt(1.5)
                    btf = badge.text_frame
                    bp = btf.paragraphs[0]
                    bp.alignment = PP_ALIGN.CENTER
                    bp.font.name = "Cairo"
                    bp.font.size = Pt(22)
                    bp.font.bold = True
                    bp.font.color.rgb = COLOR_GOLD
                    bp.text = raw_text
                elif height_in > 0.4:
                    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(rtl_left), Inches(top_in), Inches(width_in), Inches(height_in))
                    card.fill.solid()
                    card.fill.fore_color.rgb = COLOR_WHITE
                    card.line.color.rgb = COLOR_CARD_BORDER
                    card.line.width = Pt(1.2)
                    ctf = card.text_frame
                    ctf.word_wrap = True
                    cp = ctf.paragraphs[0]
                    cp.alignment = PP_ALIGN.RIGHT

                    if len(raw_text) < 40 and not is_sacred_text(raw_text):
                        cp.font.name = "Cairo"
                        cp.font.size = Pt(18)
                        cp.font.bold = True
                        cp.font.color.rgb = COLOR_EMERALD_DARK
                    else:
                        cp.font.name = "Traditional Arabic"
                        cp.font.size = Pt(16)
                        cp.font.color.rgb = COLOR_TEXT_DARK
                    cp.text = raw_text
                else:
                    tbox = slide.shapes.add_textbox(Inches(rtl_left), Inches(top_in), Inches(width_in), Inches(height_in))
                    tf = tbox.text_frame
                    tf.word_wrap = True
                    p = tf.paragraphs[0]
                    p.alignment = PP_ALIGN.RIGHT
                    p.font.name = "Cairo" if len(raw_text) < 40 else "Traditional Arabic"
                    p.font.size = Pt(16)
                    p.font.bold = (len(raw_text) < 40)
                    p.font.color.rgb = COLOR_EMERALD_DARK if len(raw_text) < 40 else COLOR_TEXT_DARK
                    p.text = raw_text

    os.makedirs(os.path.dirname(output_pptx_path), exist_ok=True)
    prs.save(output_pptx_path)
    print(f"Masterpiece Presentation saved successfully to: {output_pptx_path}")

if __name__ == '__main__':
    target_v2 = r'C:\Users\melwa\Downloads\العقيدة_الإسلامية_من_هو_الله_المحاضرة_الكاملة_v2.pptx'
    build_presentation('tests/claude_presentation_analysis.json', target_v2)
    try:
        build_presentation('tests/claude_presentation_analysis.json', r'C:\Users\melwa\Downloads\العقيدة_الإسلامية_من_هو_الله_المحاضرة_الكاملة.pptx')
    except Exception as e:
        print(f"Note: original file is currently open in PowerPoint: {e}")
