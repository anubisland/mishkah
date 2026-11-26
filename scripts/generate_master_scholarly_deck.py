# -*- coding: utf-8 -*-
"""
Master Scholarly Presentation Generator for Mishkah
Organization: AnubisLand
Lecture: العقيدة الإسلامية — المحاضرة الثانية: من هو الله؟
Full 30-Slide Exemplar Presentation
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
COLOR_CARD_BG = hex_to_rgb('F4EFE6')
COLOR_CARD_BORDER = hex_to_rgb('DCD2BD')
COLOR_TEXT_DARK = hex_to_rgb('1E293B')
COLOR_TEXT_MUTED = hex_to_rgb('475569')
COLOR_WHITE = hex_to_rgb('FFFFFF')
COLOR_QURAN_GREEN = hex_to_rgb('047857')
COLOR_RED_ACCENT = hex_to_rgb('991B1B')

def is_quran_or_hadith(text):
    text = text.strip()
    return (
        text.startswith('«') or text.startswith('»') or 
        text.startswith('"') or text.startswith('"') or
        text.startswith('{') or text.startswith('﴿') or 
        'قال الله' in text or 'رسول الله' in text or 'صلى الله عليه وسلم' in text or 'ﷺ' in text
    )

def build_presentation(analysis_json_path, output_pptx_path):
    with open(analysis_json_path, 'r', encoding='utf-8') as f:
        slides_data = json.load(f)

    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    for s_idx, s in enumerate(slides_data):
        slide = prs.slides.add_slide(blank_layout)
        idx = s.get('slide_index', s_idx + 1)
        shapes_info = s.get('shapes_info', [])
        has_table = s.get('has_table', False)
        table_data = s.get('table_data', [])
        notes_text = s.get('notes', '')

        if notes_text and hasattr(slide, 'notes_slide'):
            try:
                slide.notes_slide.notes_text_frame.text = notes_text
            except Exception:
                pass

        # Determine if title/closing slide (Slide 1 and Slide 30)
        is_dark_slide = (idx in [1, 30])

        # Background shape
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = COLOR_EMERALD_DEEP if is_dark_slide else COLOR_IVORY_BG
        bg.line.fill.background()

        # Top Islamic decorative bar
        top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.12))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = COLOR_GOLD
        top_bar.line.fill.background()

        # Bottom subtle footer
        footer = slide.shapes.add_textbox(Inches(0.8), Inches(7.1), Inches(11.733), Inches(0.35))
        ftf = footer.text_frame
        ftf.word_wrap = True
        fp = ftf.paragraphs[0]
        fp.alignment = PP_ALIGN.RIGHT
        fp.font.name = "Cairo"
        fp.font.size = Pt(9)
        fp.font.color.rgb = COLOR_GOLD_LIGHT if is_dark_slide else COLOR_TEXT_MUTED
        fp.text = f"مِشكاة — نظام التشغيل الشرعي | المحاضرة الثانية: من هو الله؟ | شريحة {idx} من {len(slides_data)}"

        # If it's a table slide (Slide 26)
        if has_table and table_data:
            # Add titles first
            title_text = shapes_info[0]['text'].strip() if len(shapes_info) > 0 else 'أوجه التفريق الجوهرية'
            subtitle_text = shapes_info[1]['text'].strip() if len(shapes_info) > 1 else 'الشرك الأكبر والشرك الأصغر'
            bottom_note = shapes_info[2]['text'].strip() if len(shapes_info) > 2 else ''

            # Title box
            t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.733), Inches(1.1))
            ttf = t_box.text_frame
            ttf.word_wrap = True
            tp = ttf.paragraphs[0]
            tp.alignment = PP_ALIGN.RIGHT
            tp.font.name = "Cairo"
            tp.font.size = Pt(14)
            tp.font.bold = True
            tp.font.color.rgb = COLOR_GOLD
            tp.text = title_text

            stp = ttf.add_paragraph()
            stp.alignment = PP_ALIGN.RIGHT
            stp.font.name = "Cairo"
            stp.font.size = Pt(22)
            stp.font.bold = True
            stp.font.color.rgb = COLOR_EMERALD_DARK
            stp.text = subtitle_text

            # Create Table
            rows = len(table_data)
            cols = len(table_data[0]) if rows > 0 else 3
            left = Inches(0.8)
            top = Inches(1.75)
            width = Inches(11.733)
            height = Inches(4.3)

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
                        cell.fill.fore_color.rgb = COLOR_CARD_BG

                    cp = cell.text_frame.paragraphs[0]
                    cp.alignment = PP_ALIGN.CENTER if is_header else PP_ALIGN.RIGHT
                    cp.font.name = "Cairo" if is_header else "Traditional Arabic"
                    cp.font.size = Pt(13) if is_header else Pt(12)
                    cp.font.bold = is_header or (c_idx == 0)
                    cp.font.color.rgb = COLOR_GOLD if is_header else COLOR_TEXT_DARK
                    cp.text = cell_value

            if bottom_note:
                b_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.15), Inches(11.733), Inches(0.8))
                b_box.fill.solid()
                b_box.fill.fore_color.rgb = COLOR_WHITE
                b_box.line.color.rgb = COLOR_GOLD
                b_box.line.width = Pt(1)
                btf = b_box.text_frame
                btf.word_wrap = True
                bp = btf.paragraphs[0]
                bp.alignment = PP_ALIGN.RIGHT
                bp.font.name = "Cairo"
                bp.font.size = Pt(12)
                bp.font.bold = True
                bp.font.color.rgb = COLOR_EMERALD_DARK
                bp.text = bottom_note
            continue

        # Non-table slides: render based on shapes_info
        # First 2 shapes are usually Header Tag and Subtitle/Title
        for sh_idx, sh in enumerate(shapes_info):
            raw_text = sh.get('text', '').strip()
            if not raw_text:
                continue

            left_in = sh['left'] / 914400.0
            top_in = sh['top'] / 914400.0
            width_in = sh['width'] / 914400.0
            height_in = sh['height'] / 914400.0

            # Scale/fit gently if needed
            left_in = max(0.6, min(left_in, 12.0))
            top_in = max(0.3, min(top_in, 6.8))
            width_in = max(0.5, min(width_in, 12.0))

            # Distinguish role:
            # 1. Slide 1 (Hero Title)
            if idx == 1:
                tbox = slide.shapes.add_textbox(Inches(left_in), Inches(top_in), Inches(width_in), Inches(height_in))
                tf = tbox.text_frame
                tf.word_wrap = True
                p = tf.paragraphs[0]
                p.alignment = PP_ALIGN.CENTER
                if sh_idx == 0:
                    p.font.name = "Cairo"
                    p.font.size = Pt(18)
                    p.font.color.rgb = COLOR_GOLD
                    p.font.bold = True
                elif sh_idx == 1:
                    p.font.name = "Cairo"
                    p.font.size = Pt(36)
                    p.font.color.rgb = COLOR_WHITE
                    p.font.bold = True
                elif sh_idx == 2:
                    p.font.name = "Cairo"
                    p.font.size = Pt(18)
                    p.font.color.rgb = COLOR_GOLD_LIGHT
                else:
                    p.font.name = "Traditional Arabic"
                    p.font.size = Pt(13)
                    p.font.color.rgb = COLOR_IVORY_BG
                p.text = raw_text
                continue

            # 2. Slide 30 (Conclusion)
            if idx == 30:
                tbox = slide.shapes.add_textbox(Inches(left_in), Inches(top_in), Inches(width_in), Inches(height_in))
                tf = tbox.text_frame
                tf.word_wrap = True
                p = tf.paragraphs[0]
                p.alignment = PP_ALIGN.CENTER
                if sh_idx == 0:
                    p.font.name = "Traditional Arabic"
                    p.font.size = Pt(18)
                    p.font.color.rgb = COLOR_WHITE
                    p.font.bold = True
                elif sh_idx == 1:
                    p.font.name = "Cairo"
                    p.font.size = Pt(32)
                    p.font.color.rgb = COLOR_GOLD
                    p.font.bold = True
                else:
                    p.font.name = "Cairo"
                    p.font.size = Pt(28)
                    p.font.color.rgb = COLOR_GOLD_LIGHT
                    p.font.bold = True
                p.text = raw_text
                continue

            # Content slides:
            # Top tags / headings
            if sh_idx == 0 and top_in < 1.3:
                # Category Badge
                tbox = slide.shapes.add_textbox(Inches(left_in), Inches(top_in), Inches(width_in), Inches(0.45))
                tf = tbox.text_frame
                tf.word_wrap = True
                p = tf.paragraphs[0]
                p.alignment = PP_ALIGN.RIGHT
                p.font.name = "Cairo"
                p.font.size = Pt(12)
                p.font.bold = True
                p.font.color.rgb = COLOR_GOLD
                p.text = raw_text
            elif sh_idx == 1 and top_in < 2.0:
                # Main Slide Title
                tbox = slide.shapes.add_textbox(Inches(left_in), Inches(top_in), Inches(width_in), Inches(0.8))
                tf = tbox.text_frame
                tf.word_wrap = True
                p = tf.paragraphs[0]
                p.alignment = PP_ALIGN.RIGHT
                p.font.name = "Cairo"
                p.font.size = Pt(20)
                p.font.bold = True
                p.font.color.rgb = COLOR_EMERALD_DARK
                p.text = raw_text
            elif raw_text in ['١', '٢', '٣', '٤']:
                # Pillar or step number badge
                badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left_in), Inches(top_in), Inches(width_in), Inches(height_in))
                badge.fill.solid()
                badge.fill.fore_color.rgb = COLOR_EMERALD_DEEP
                badge.line.color.rgb = COLOR_GOLD
                badge.line.width = Pt(1.5)
                btf = badge.text_frame
                bp = btf.paragraphs[0]
                bp.alignment = PP_ALIGN.CENTER
                bp.font.name = "Cairo"
                bp.font.size = Pt(20)
                bp.font.bold = True
                bp.font.color.rgb = COLOR_GOLD
                bp.text = raw_text
            elif is_quran_or_hadith(raw_text):
                # Quran / Hadith reverent box
                qbox = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left_in), Inches(top_in), Inches(width_in), Inches(max(height_in, 0.9)))
                qbox.fill.solid()
                qbox.fill.fore_color.rgb = COLOR_WHITE
                qbox.line.color.rgb = COLOR_GOLD
                qbox.line.width = Pt(1.5)
                qtf = qbox.text_frame
                qtf.word_wrap = True
                qp = qtf.paragraphs[0]
                qp.alignment = PP_ALIGN.CENTER
                qp.font.name = "Amiri Quran" if ('{' in raw_text or '﴿' in raw_text) else "Traditional Arabic"
                qp.font.size = Pt(14)
                qp.font.bold = True
                qp.font.color.rgb = COLOR_EMERALD_DARK
                qp.text = raw_text
            else:
                # Card or text frame
                # If width_in < 10, it's a card container
                is_card_column = (width_in < 10.0 and height_in > 0.4)
                if is_card_column:
                    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left_in), Inches(top_in), Inches(width_in), Inches(height_in))
                    card.fill.solid()
                    card.fill.fore_color.rgb = COLOR_WHITE
                    card.line.color.rgb = COLOR_CARD_BORDER
                    card.line.width = Pt(1)
                    ctf = card.text_frame
                    ctf.word_wrap = True
                    cp = ctf.paragraphs[0]
                    cp.alignment = PP_ALIGN.RIGHT
                    cp.font.name = "Traditional Arabic"
                    cp.font.size = Pt(13)
                    cp.font.color.rgb = COLOR_TEXT_DARK
                    cp.text = raw_text
                else:
                    tbox = slide.shapes.add_textbox(Inches(left_in), Inches(top_in), Inches(width_in), Inches(height_in))
                    tf = tbox.text_frame
                    tf.word_wrap = True
                    p = tf.paragraphs[0]
                    p.alignment = PP_ALIGN.RIGHT
                    p.font.name = "Traditional Arabic"
                    p.font.size = Pt(14)
                    p.font.color.rgb = COLOR_TEXT_DARK
                    p.text = raw_text

    os.makedirs(os.path.dirname(output_pptx_path), exist_ok=True)
    prs.save(output_pptx_path)
    print(f"Master Presentation saved successfully to: {output_pptx_path}")

if __name__ == '__main__':
    build_presentation(
        'tests/claude_presentation_analysis.json',
        r'C:\Users\melwa\Downloads\العقيدة_الإسلامية_من_هو_الله_المحاضرة_الكاملة.pptx'
    )
