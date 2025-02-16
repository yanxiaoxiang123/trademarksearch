from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    UID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_name = db.Column(db.String(150), nullable=False)
    contact_person = db.Column(db.String(150), nullable=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    phone_number = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(150), nullable=True)
    password = db.Column(db.String(150), nullable=False)
    remarks = db.Column(db.Text, nullable=True)
    
    export_records = db.relationship('ExportRecord', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

class AdminUser(db.Model):
    __tablename__ = 'admin_users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    phone_number = db.Column(db.String(20), unique=True, nullable=False)

    def __repr__(self):
        return f'<AdminUser {self.username}>'

class ExportRecord(db.Model):
    __tablename__ = 'export_records'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.UID'), nullable=False)
    export_time = db.Column(db.DateTime, nullable=False, default=datetime.now)
    total_items = db.Column(db.Integer, nullable=False)
    
    items = db.relationship('ExportRecordItem', backref='export_record', lazy=True)

class ExportRecordItem(db.Model):
    __tablename__ = 'export_record_items'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    export_id = db.Column(db.Integer, db.ForeignKey('export_records.id'), nullable=False)
    category = db.Column(db.String(10), nullable=False)
    group_number = db.Column(db.String(10), nullable=False)
    item_code = db.Column(db.String(20), nullable=False)
    item_name = db.Column(db.String(255), nullable=False) 