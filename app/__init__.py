from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config.config import config
from app.models.models import db
from app.routes.auth import auth
from app.routes.admin import admin
from app.routes.main import main

def create_app(config_name='development'):
    app = Flask(__name__)
    
    # 加载配置
    app.config.from_object(config[config_name])
    
    # 初始化数据库
    db.init_app(app)
    
    # 注册蓝图
    app.register_blueprint(auth)
    app.register_blueprint(admin)
    app.register_blueprint(main)
    
    # 创建数据库表
    with app.app_context():
        db.create_all()
    
    return app 