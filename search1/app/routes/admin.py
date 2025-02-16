from flask import Blueprint, request, render_template, redirect, url_for, flash, jsonify
from app.models.models import User, ExportRecord, ExportRecordItem, db
from app.utils.helpers import admin_required

admin = Blueprint('admin', __name__)

@admin.route('/admin')
@admin_required
def dashboard():
    users = User.query.all()
    export_records = db.session.query(
        ExportRecord,
        User.customer_name,
        User.username
    ).join(
        User,
        ExportRecord.user_id == User.UID
    ).order_by(
        ExportRecord.export_time.desc()
    ).all()
    
    return render_template('admin.html', users=users, export_records=export_records)

@admin.route('/admin/users/add', methods=['POST'])
@admin_required
def add_user():
    username = request.form['username']
    password = request.form['password']
    phone_number = request.form['phone_number']
    customer_name = request.form['customer_name']
    contact_person = request.form.get('contact_person', '')
    email = request.form.get('email', '')
    remarks = request.form.get('remarks', '')

    # 检查用户名或手机号是否已存在
    if User.query.filter_by(username=username).first():
        flash('用户名已存在', 'error')
        return redirect(url_for('admin.dashboard'))
    
    if User.query.filter_by(phone_number=phone_number).first():
        flash('手机号已存在', 'error')
        return redirect(url_for('admin.dashboard'))

    new_user = User(
        username=username,
        password=password,
        phone_number=phone_number,
        customer_name=customer_name,
        contact_person=contact_person,
        email=email,
        remarks=remarks
    )
    db.session.add(new_user)
    db.session.commit()

    flash('用户添加成功', 'success')
    return redirect(url_for('admin.dashboard'))

@admin.route('/admin/users/<int:user_id>/delete', methods=['POST'])
@admin_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    flash('用户删除成功', 'success')
    return redirect(url_for('admin.dashboard'))

@admin.route('/admin/users/<int:user_id>/update', methods=['POST'])
@admin_required
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    
    # 获取表单数据
    customer_name = request.form.get('customer_name')
    username = request.form.get('username')
    phone_number = request.form.get('phone_number')
    email = request.form.get('email')
    password = request.form.get('password')
    remarks = request.form.get('remarks')
    
    # 检查用户名和手机号是否与其他用户重复
    username_exists = User.query.filter(
        User.username == username,
        User.UID != user_id
    ).first()
    
    if username_exists:
        flash('用户名已被其他用户使用', 'error')
        return redirect(url_for('admin.dashboard'))
    
    phone_exists = User.query.filter(
        User.phone_number == phone_number,
        User.UID != user_id
    ).first()
    
    if phone_exists:
        flash('手机号已被其他用户使用', 'error')
        return redirect(url_for('admin.dashboard'))
    
    # 更新用户信息
    user.customer_name = customer_name
    user.username = username
    user.phone_number = phone_number
    user.email = email
    if password:
        user.password = password
    user.remarks = remarks
    
    db.session.commit()
    flash('用户信息更新成功', 'success')
    return redirect(url_for('admin.dashboard'))

@admin.route('/admin/export_details/<int:export_id>')
@admin_required
def get_export_details(export_id):
    items = ExportRecordItem.query.filter_by(export_id=export_id).all()
    details = [{
        'category': item.category,
        'group_number': item.group_number,
        'item_code': item.item_code,
        'item_name': item.item_name
    } for item in items]
    return jsonify(details) 