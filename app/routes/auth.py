from flask import Blueprint, request, render_template, redirect, url_for, session, flash
from app.models.models import User, AdminUser, db
from app.utils.helpers import login_required

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    # 如果用户已登录，直接跳转到主页
    if session.get('user_logged_in'):
        return redirect(url_for('main.home'))
        
    if request.method == 'POST':
        login_field = request.form['login_field']
        password = request.form['password']

        user = User.query.filter(
            (User.username == login_field) |
            (User.phone_number == login_field) |
            (User.email == login_field)
        ).first()

        if user and user.password == password:
            session['user_logged_in'] = True
            session['user_id'] = user.UID
            session['user_name'] = user.username
            return redirect(url_for('main.home'))
        else:
            flash('账号或密码错误', 'error')
            return render_template('login.html')
    
    return render_template('login.html')

@auth.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        admin_user = AdminUser.query.filter_by(username=username).first()

        if admin_user and admin_user.password == password:
            session['admin_logged_in'] = True
            session['admin_name'] = username
            return redirect(url_for('admin.dashboard'))
        else:
            flash('管理员用户名或密码错误', 'error')
            return redirect(url_for('auth.admin_login'))

    return render_template('admin_login.html')

@auth.route('/logout')
@login_required
def logout():
    session.clear()
    return redirect(url_for('auth.login'))

@auth.route('/admin/logout')
def admin_logout():
    session.clear()
    return redirect(url_for('auth.admin_login'))

@auth.route('/change_password', methods=['POST'])
@login_required
def change_password():
    current_password = request.form.get('current_password')
    new_password = request.form.get('new_password')
    
    user = User.query.get(session['user_id'])
    
    if not user or user.password != current_password:
        flash('当前密码错误', 'error')
        return redirect(url_for('main.profile'))
        
    user.password = new_password
    db.session.commit()
    
    flash('密码修改成功', 'success')
    return redirect(url_for('main.profile')) 