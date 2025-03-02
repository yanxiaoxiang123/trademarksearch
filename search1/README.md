# 商标查询系统 (Trademark Search System)

这是一个基于Flask框架开发的商标查询系统，提供商标信息的检索、查询和管理功能。

## 功能特点

- 商标信息检索：支持多维度的商标查询
- 用户管理系统：包含用户注册、登录和权限管理
- 管理员后台：提供商标数据的管理和维护功能
- 响应式界面：支持多设备访问

## 技术栈

- 后端框架：Flask
- 数据库：SQLite
- 前端：HTML5, CSS3, JavaScript
- 模板引擎：Jinja2

## 项目结构

```
trademarksearch/
├── app/                    # 应用主目录
│   ├── static/            # 静态文件
│   ├── templates/         # HTML模板
│   ├── routes/            # 路由控制
│   └── models/            # 数据模型
├── config/                # 配置文件
├── requirements.txt       # 项目依赖
└── run.py                # 应用入口
```

## 安装说明

1. 克隆项目到本地：
```bash
git clone https://github.com/yanxiaoxiang123/trademarksearch.git
cd trademarksearch
```

2. 创建并激活虚拟环境（可选）：
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

3. 安装依赖：
```bash
pip install -r requirements.txt
```

4. 运行应用：
```bash
python run.py
```

访问 http://localhost:5000 即可使用系统。

## 使用说明

1. 首页：进行商标查询
2. 用户功能：
   - 注册/登录：创建账号或登录已有账号
   - 个人中心：管理个人信息和查询历史
3. 管理员功能：
   - 数据管理：维护商标数据库
   - 用户管理：管理用户权限

## 贡献指南

欢迎提交问题和功能需求。如果您想贡献代码：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 联系方式

- 邮箱：1356635550@qq.com
- GitHub：[yanxiaoxiang123](https://github.com/yanxiaoxiang123)
