// 获取复选框和密码输入框
const showPasswordCheckbox = document.getElementById('show-password');
const passwordInput = document.getElementById('password');

// 监听复选框状态变化，切换密码显示
showPasswordCheckbox.addEventListener('change', function() {
    if (showPasswordCheckbox.checked) {
        passwordInput.type = 'text';  // 显示密码
    } else {
        passwordInput.type = 'password';  // 隐藏密码
    }
});

// 模态框相关
const modal = document.getElementById('editUserModal');
const addModal = document.getElementById('addUserModal');
const exportDetailsModal = document.getElementById('exportDetailsModal');
const closeBtns = document.getElementsByClassName('close');

// 为所有关闭按钮添加点击事件
Array.from(closeBtns).forEach(btn => {
    btn.onclick = function() {
        modal.style.display = 'none';
        addModal.style.display = 'none';
        exportDetailsModal.style.display = 'none';
    }
});

// 点击模态框外部关闭
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
    if (event.target == addModal) {
        addModal.style.display = 'none';
    }
    if (event.target == exportDetailsModal) {
        exportDetailsModal.style.display = 'none';
    }
}

// 打开编辑模态框
function openEditUserModal(userId) {
    modal.style.display = 'block';
    
    // 设置表单action
    editUserForm.action = `/admin/users/${userId}/update`;
    
    // 获取当前行的数据
    const row = event.target.closest('tr');
    document.getElementById('edit_customer_name').value = row.cells[1].textContent;
    document.getElementById('edit_username').value = row.cells[2].textContent;
    document.getElementById('edit_phone_number').value = row.cells[3].textContent;
    document.getElementById('edit_email').value = row.cells[4].textContent;
    
    // 填充表单数据
    document.getElementById('edit_user_id').value = userId;
    document.getElementById('edit_password').value = row.cells[5].textContent;
    document.getElementById('edit_remarks').value = row.cells[6].textContent;
}

// 打开添加用户模态框
function openAddUserModal() {
    addModal.style.display = 'block';
}

// 关闭添加用户模态框
function closeAddUserModal() {
    addModal.style.display = 'none';
}

// 显示/隐藏密码能 - 使用新的变量名避免冲突
const addModalPasswordCheckbox = document.getElementById('show-password');
const addModalPasswordInput = document.getElementById('password');

addModalPasswordCheckbox.addEventListener('change', function() {
    addModalPasswordInput.type = this.checked ? 'text' : 'password';
});

// 搜索功能
function searchUsers() {
    const searchInput = document.getElementById('searchInput');
    const searchText = searchInput.value.toLowerCase();
    const tableRows = document.querySelectorAll('tbody tr');

    tableRows.forEach(row => {
        const customerName = row.querySelector('td:first-child').textContent.toLowerCase();
        if (customerName.includes(searchText)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// 添加输入框回车搜索功能
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchUsers();
    }
});

// 添加实时搜索功能
document.getElementById('searchInput').addEventListener('input', function() {
    searchUsers();
});

// 查看导出详情
async function viewExportDetails(exportId) {
    try {
        const response = await fetch(`/admin/export_details/${exportId}`);
        if (!response.ok) {
            throw new Error('获取详情失败');
        }
        const data = await response.json();
        
        // 更新模态框内容
        const tbody = document.getElementById('exportDetailsBody');
        tbody.innerHTML = '';
        
        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.category}</td>
                <td>${item.group_number}</td>
                <td>${item.item_code}</td>
                <td>${item.item_name}</td>
            `;
            tbody.appendChild(tr);
        });
        
        // 显示模态框
        exportDetailsModal.style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
        alert('获取详情失败');
    }
}

// 修改关闭导出详情模态框函数
function closeExportDetailsModal() {
    exportDetailsModal.style.display = 'none';
}

// 添加标签切换功能
function showTab(tabName) {
    // 隐藏所有标签内容
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // 移除所有标签的激活状态
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 显示选中的标签内容
    document.getElementById(tabName + 'Tab').style.display = 'block';
    
    // 激活选中的标签
    event.target.classList.add('active');
}

// 页面加载时默认显示用户管理标签
document.addEventListener('DOMContentLoaded', function() {
    showTab('users');
}); 