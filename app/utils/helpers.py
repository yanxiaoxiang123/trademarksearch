import json
from collections import defaultdict
from functools import wraps
from flask import session, redirect, url_for

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('user_logged_in'):
            return redirect(url_for('auth.login'))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('admin_logged_in'):
            return redirect(url_for('auth.admin_login'))
        return f(*args, **kwargs)
    return decorated_function

def load_json_data(file_path):
    """加载JSON数据文件"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    except Exception as e:
        print(f"Error loading JSON file: {str(e)}")
        return None

def match_text(query, data):
    """搜索文本并返回结果"""
    results = defaultdict(lambda: defaultdict(list))
    for item in data:
        if 'Subcontents' in item:
            for subcontent in item['Subcontents']:
                if 'Text' in subcontent:
                    for text in subcontent['Text']:
                        if query in text:
                            results[item.get('Heading1', '')][subcontent.get('Heading2', '')].append(text)
    return results 