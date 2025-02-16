from flask import Blueprint, request, render_template, jsonify, session, flash, redirect, url_for
from app.models.models import User, ExportRecord, ExportRecordItem, db
from app.utils.helpers import login_required, load_json_data, match_text
import os

main = Blueprint('main', __name__)

# 加载数据文件
DATA_FILE = 'output.json'
ALL_DATA = load_json_data(DATA_FILE)

@main.route('/')
def home():
    return render_template('index.html', json_data=ALL_DATA)

@main.route('/profile')
@login_required
def profile():
    user_info = User.query.get(session['user_id'])
    if not user_info:
        return redirect(url_for('auth.logout'))
    return render_template('profile.html', user_info=user_info)

@main.route('/api/update_profile', methods=['POST'])
@login_required
def update_profile_api():
    try:
        user = User.query.get(session['user_id'])
        if not user:
            return jsonify({'error': '用户不存在'}), 404

        data = request.get_json()
        customer_name = data.get('customerName')
        phone_number = data.get('phoneNumber')
        email = data.get('email')

        # 检查手机号是否与其他用户重复
        phone_exists = User.query.filter(
            User.phone_number == phone_number,
            User.UID != user.UID
        ).first()

        if phone_exists:
            return jsonify({'error': '手机号已被其他用户使用'}), 400

        # 更新用户信息
        user.customer_name = customer_name
        user.phone_number = phone_number
        user.email = email

        db.session.commit()
        return jsonify({'message': '个人信息更新成功'})

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@main.route('/api/change_password', methods=['POST'])
@login_required
def change_password_api():
    try:
        user = User.query.get(session['user_id'])
        if not user:
            return jsonify({'error': '用户不存在'}), 404

        data = request.get_json()
        old_password = data.get('oldPassword')
        new_password = data.get('newPassword')

        if not user.password == old_password:
            return jsonify({'error': '旧密码错误'}), 400

        user.password = new_password
        db.session.commit()
        return jsonify({'message': '密码修改成功'})

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@main.route('/search')
def search():
    query = request.args.get('q', '')
    if not query:
        return jsonify([])
    results = match_text(query, ALL_DATA)
    return jsonify(results)

@main.route('/save_export', methods=['POST'])
@login_required
def save_export():
    try:
        data = request.get_json()
        items = data.get('items', [])
        
        if not items:
            return jsonify({'error': '没有要导出的数据'}), 400
            
        # 创建导出记录
        export_record = ExportRecord(
            user_id=session['user_id'],
            total_items=len(items)
        )
        db.session.add(export_record)
        db.session.flush()  # 获取export_record的ID
        
        # 创建导出记录详情
        for item in items:
            record_item = ExportRecordItem(
                export_id=export_record.id,
                category=item['category'],
                group_number=item['group_number'],
                item_code=item['item_code'],
                item_name=item['item_name']
            )
            db.session.add(record_item)
            
        db.session.commit()
        return jsonify({'message': '导出记录保存成功', 'export_id': export_record.id})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'保存导出记录失败: {str(e)}'}), 500 