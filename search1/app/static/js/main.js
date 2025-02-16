// 选择功能相关变量
let selectedItems = [];
const selectionModal = document.getElementById('selectionModal');
const selectionList = document.getElementById('selectionList');

// 更新选择结果显示
function updateSelectionModal() {
    if (selectedItems.length > 0) {
        selectionModal.style.display = 'block';
        selectionList.innerHTML = `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f8f9fa; text-align: left;">
                        <th style="padding: 8px; border-bottom: 1px solid #ddd;">类别</th>
                        <th style="padding: 8px; border-bottom: 1px solid #ddd;">组</th>
                        <th style="padding: 8px; border-bottom: 1px solid #ddd;">商品编号</th>
                        <th style="padding: 8px; border-bottom: 1px solid #ddd;">商品名称</th>
                        <th style="padding: 8px; border-bottom: 1px solid #ddd;">操作</th>
                    </tr>
                </thead>
                <tbody>
                    ${selectedItems.map((item, index) => `
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.category}</td>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.group}</td>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.code}</td>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">
                                <i class="fas fa-times" onclick="removeSelection(${index})" 
                                   style="color: #ff4d4f; cursor: pointer; font-size: 14px;"></i>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } else {
        selectionModal.style.display = 'none';
    }
}

// 添加选择
function addSelection(text, category, group) {
    // 检查用户是否登录
    if (!isUserLoggedIn) {
        alert('请先登录后再添加选择');
        window.location.href = '/login';
        return;
    }

    const item = {
        category: category,
        group: group,
        code: `${category}${group}`,
        name: text
    };
    
    // 检查是否已经存在
    const exists = selectedItems.some(existing => 
        existing.category === item.category && 
        existing.name === item.name
    );
    
    if (!exists) {
        selectedItems.push(item);
        updateSelectionModal();
    }
}

// 移除选择
function removeSelection(index) {
    selectedItems.splice(index, 1);
    updateSelectionModal();
}

// 清空选择
function clearSelections() {
    selectedItems = [];
    updateSelectionModal();
}

// 导出到Excel
async function exportToExcel() {
    // 检查用户是否登录
    if (!isUserLoggedIn) {
        alert('请先登录后再使用导出功能');
        window.location.href = '/login';
        return;
    }

    if (selectedItems.length === 0) {
        alert('请先选择要导出的项目');
        return;
    }

    // 准备导出数据
    const exportData = selectedItems.map(item => ({
        '类别': item.category,
        '组号': item.group,
        '编码': item.code,
        '商品名称': item.name
    }));

    // 创建工作表
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "商标分类");

    // 保存文件
    XLSX.writeFile(wb, "商标分类导出.xlsx");

    // 保存导出记录
    saveExportRecord(selectedItems);
}

// 保存导出记录
function saveExportRecord(items) {
    fetch('/save_export', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: items })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log('导出记录已保存');
        }
    })
    .catch(error => console.error('Error:', error));
}

// 搜索功能
document.querySelector('.search-container button').addEventListener('click', function() {
    const searchText = document.querySelector('.search-container input').value.toLowerCase().trim();
    const textContent = document.getElementById('textContent');
    
    if (!searchText) {
        textContent.innerHTML = '<p class="placeholder-text">请点击左侧菜单查看内容</p>';
        return;
    }

    let searchResults = [];
    
    ALL_DATA.forEach((category, categoryIndex) => {
        category.Subcontents.forEach((subcontent, subcontentIndex) => {
            if (subcontent.Text) {
                subcontent.Text.forEach(text => {
                    if (text.toLowerCase().includes(searchText)) {
                        searchResults.push({
                            category: String(categoryIndex + 1).padStart(2, '0'),
                            heading1: category.Heading1,
                            group: String(subcontentIndex + 1).padStart(2, '0'),
                            heading2: subcontent.Heading2,
                            text: text
                        });
                    }
                });
            }
        });
    });

    if (searchResults.length > 0) {
        let html = '<div class="search-results">';
        html += '<h3 style="margin-bottom: 20px;">搜索结果：</h3>';
        
        searchResults.forEach(result => {
            html += `
                <div class="search-result-item" style="margin-bottom: 15px; padding: 10px; border-bottom: 1px solid #eee;">
                    <div style="color: #666; font-size: 0.9em; margin-bottom: 5px;">
                        类别：${result.category} ${result.heading1} - 组：${result.heading2}
                    </div>
                    <span class="selectable-text" onclick="addSelection('${result.text.replace(/'/g, "\\'")}', '${result.category}', '${result.group}')" 
                          style="cursor: pointer; background-color: #fff3cd;">
                        ${result.text}
                    </span>
                </div>
            `;
        });
        
        html += '</div>';
        textContent.innerHTML = html;
    } else {
        textContent.innerHTML = '<p style="color: #666;">未找到相关内容</p>';
        document.querySelector('.search-container input').value = '';
    }
});

// 回车触发搜索
document.querySelector('.search-container input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.querySelector('.search-container button').click();
    }
});

// 导航栏点击事件
document.querySelectorAll('.nav-bar a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const categoryId = this.getAttribute('href').replace('#heading', '');
        showCategory(categoryId);
    });
});

// 显示对应类别的 heading2
function showCategory(categoryId) {
    // 隐藏所有类别
    document.querySelectorAll('.heading2-container').forEach(container => {
        container.style.display = 'none';
    });
    
    // 显示选中的类别
    const selectedCategory = document.getElementById('category' + categoryId);
    if (selectedCategory) {
        selectedCategory.style.display = 'block';
        
        // 默认显示该类别下的第一个内容
        const firstHeading2 = selectedCategory.querySelector('h3');
        if (firstHeading2) {
            firstHeading2.click();
        }
    }
    
    // 更新导航栏激活状态
    document.querySelectorAll('.nav-bar a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`.nav-bar a[href="#heading${categoryId}"]`).classList.add('active');
}

// 显示内容
function showContent(element, categoryIndex, subcontentIndex) {
    // 移除所有 heading2 的激活状态
    document.querySelectorAll('.heading2-container h3').forEach(h3 => {
        h3.classList.remove('active');
    });
    
    // 添加当前 heading2 的激活状态
    element.classList.add('active');
    
    // 获取对应的内容
    const content = ALL_DATA[categoryIndex].Subcontents[subcontentIndex];
    const textContent = document.getElementById('textContent');
    
    // 构建显示内容的 HTML
    let html = '<div class="content-section">';
    
    // 显示 Text 内容
    if (content.Text && content.Text.length > 0) {
        html += '<div class="text-group" style="line-height: 1.8;">';
        const textItems = content.Text.map(text => 
            `<span class="selectable-text" onclick="addSelection('${text.replace(/'/g, "\\'")}', '${String(categoryIndex + 1).padStart(2, '0')}', '${String(subcontentIndex + 1).padStart(2, '0')}')">${text}</span>`
        );
        html += textItems.join('；') + '。';
        html += '</div>';
    }
    
    // 显示 Text1 内容
    if (content.Text1 && content.Text1.length > 0) {
        html += '<div class="text1-group" style="margin-top: 20px;">';
        html += '<h4 style="color: #666; margin-bottom: 10px;">说明：</h4>';
        content.Text1.forEach(text => {
            html += `<p style="color: #666; font-size: 0.9em;">${text}</p>`;
        });
        html += '</div>';
    }
    
    html += '</div>';
    textContent.innerHTML = html;
}

// 页面加载时显示第一个类别
document.addEventListener('DOMContentLoaded', function() {
    showCategory('1');
}); 