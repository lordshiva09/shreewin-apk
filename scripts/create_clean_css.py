import re

def clean_css_file(src_path, dst_path):
    with open(src_path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Strip data-v attributes
    cleaned = re.sub(r'\[data-v-[a-z0-9]+\]', '', content)
    with open(dst_path, 'w', encoding='utf-8') as f:
        f.write(cleaned)
    print(f"Cleaned {src_path} -> {dst_path} ({len(cleaned)} bytes)")

clean_css_file(r'c:\Users\Pawan kumar\OneDrive\Desktop\HtmlProject\Shreewin clone\assets\css\index-DtOYVBDj.css',
               r'c:\Users\Pawan kumar\OneDrive\Desktop\HtmlProject\Shreewin clone\assets\css\clean-promotion.css')

clean_css_file(r'c:\Users\Pawan kumar\OneDrive\Desktop\HtmlProject\Shreewin clone\assets\css\index-BAgrmjqJ.css',
               r'c:\Users\Pawan kumar\OneDrive\Desktop\HtmlProject\Shreewin clone\assets\css\clean-mine.css')
