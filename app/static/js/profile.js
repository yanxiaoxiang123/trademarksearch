function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';

    document.querySelectorAll('.sidebar li').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.sidebar li[onclick="showSection('${sectionId}')"]`).classList.add('active');
}

function showAlert(message, type, elementId = 'alertMessage') {
    const alertElement = document.getElementById(elementId);
    alertElement.textContent = message;
    alertElement.className = `alert alert-${type}`;
    alertElement.style.display = 'block';
    
    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 3000);
}

document.getElementById('profileForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        customerName: document.getElementById('customerName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        email: document.getElementById('email').value
    };

    try {
        const response = await fetch('/api/update_profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (response.ok) {
            showAlert(data.message, 'success', 'profileAlertMessage');
        } else {
            showAlert(data.error, 'error', 'profileAlertMessage');
        }
    } catch (error) {
        showAlert('更新失败，请稍后重试', 'error', 'profileAlertMessage');
    }
});

document.getElementById('passwordForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const newPassword = document.getElementById('new_password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    
    if (newPassword !== confirmPassword) {
        showAlert('两次输入的密码不一致', 'error');
        return;
    }

    const formData = {
        oldPassword: document.getElementById('old_password').value,
        newPassword: newPassword
    };

    try {
        const response = await fetch('/api/change_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (response.ok) {
            showAlert(data.message, 'success');
            document.getElementById('passwordForm').reset();
        } else {
            showAlert(data.error, 'error');
        }
    } catch (error) {
        showAlert('修改失败，请稍后重试', 'error');
    }
}); 