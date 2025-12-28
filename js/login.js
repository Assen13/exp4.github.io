// 【核心：页面加载完成后再执行代码】
// 避免代码执行时页面元素还没加载出来，导致找不到按钮/表单
document.addEventListener('DOMContentLoaded', ()=>{

    // 【第一步：获取页面元素】
    // 拿到"登录"标签（点击切换到登录页）
    const tabLogin = document.getElementById('tab-login');
    // 拿到"注册"标签（点击切换到注册页）
    const tabRegister = document.getElementById('tab-register');
    // 拿到登录表单（用户输入账号密码的表单）
    const formLogin = document.getElementById('form-login');
    // 拿到注册表单（用户输入注册信息的表单）
    const formRegister = document.getElementById('form-register');

    // 【第二步：定义标签切换函数】
    // 显示登录页的函数：给登录标签/表单加"active"类（显示），注册的去掉（隐藏）
    function showLogin(){ 
        tabLogin.classList.add('active');    // 登录标签高亮
        tabRegister.classList.remove('active'); // 注册标签取消高亮
        formLogin.classList.add('active');   // 显示登录表单
        formRegister.classList.remove('active'); // 隐藏注册表单
    }
    // 显示注册页的函数：和上面相反，显示注册、隐藏登录
    function showRegister(){ 
        tabLogin.classList.remove('active');
        tabRegister.classList.add('active');
        formLogin.classList.remove('active');
        formRegister.classList.add('active');
    }

    // 【第三步：绑定点击事件】
    // 点击"登录"标签，执行showLogin函数（切换到登录页）
    tabLogin.addEventListener('click', showLogin);
    // 点击"注册"标签，执行showRegister函数（切换到注册页）
    tabRegister.addEventListener('click', showRegister);

    // 【第四步：工具函数1 - 验证邮箱格式】
    // 传入值v，用正则判断是不是合法邮箱（有@、有后缀如.com）
    function isEmail(v){ 
        return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v); 
    }

    // 【工具函数2 - 获取本地存储的用户列表】
    // 从localStorage拿保存的用户数据，转成数组；如果出错/没有数据，返回空数组
    function getUsers(){ 
        try{ 
            // 把localStorage里的"demo_users"数据转成JS数组（默认是字符串）
            return JSON.parse(localStorage.getItem('demo_users')||'[]'); 
        }catch(e){ 
            return []; // 出错了就返回空数组，避免代码崩掉
        }
    }
    // 【工具函数3 - 保存用户列表到本地】
    // 把用户数组转成字符串，存到localStorage的"demo_users"里
    function saveUsers(u){ 
        localStorage.setItem('demo_users', JSON.stringify(u)); 
    }

    // 【第五步：注册表单提交逻辑】
    // 监听注册表单的"提交"事件（用户点注册按钮时触发）
    formRegister.addEventListener('submit', function(e){
        e.preventDefault(); // 阻止表单默认提交（避免页面刷新）

        // 1. 获取用户输入的注册信息（去空格）
        const u = document.getElementById('reg-username').value.trim(); // 注册邮箱
        const p = document.getElementById('reg-password').value; // 注册密码
        const p2 = document.getElementById('reg-password2').value; // 确认密码

        // 2. 获取提示文字的元素（用来显示"密码太短""邮箱已注册"等提示）
        const hintU = document.getElementById('hint-reg-username'); // 用户名提示
        const hintP = document.getElementById('hint-reg-password'); // 密码提示
        const hintP2 = document.getElementById('hint-reg-password2'); // 确认密码提示
        const res = document.getElementById('reg-result'); // 注册结果提示

        // 3. 清空所有提示文字（避免上次的提示还在）
        hintU.textContent=''; 
        hintP.textContent=''; 
        hintP2.textContent=''; 
        res.textContent='';

        // 4. 表单验证（一步错就直接返回，不往下执行）
        if(!u){ hintU.textContent='请输入用户名'; return; } // 没输邮箱
        if(!isEmail(u)){ hintU.textContent='请输入有效的邮箱地址'; return; } // 邮箱格式错
        if(p.length<6){ hintP.textContent='密码长度至少6位'; return; } // 密码太短
        if(p!==p2){ hintP2.textContent='两次输入密码不一致'; return; } // 两次密码不一样

        // 5. 检查邮箱是否已注册
        const users = getUsers(); // 拿到所有已注册的用户
        if(users.some(x=>x.username===u)){ // 遍历用户列表，看有没有相同邮箱
            hintU.textContent='该邮箱已被注册'; 
            return; 
        }

        // 6. 注册成功：保存新用户到本地
        users.push({username:u,password:p}); // 把新用户加到数组里
        saveUsers(users); // 保存到localStorage

        // 7. 注册成功提示（绿色文字）
        res.style.color = '#2d8a2d'; 
        res.textContent = '注册成功，请使用登录';

        // 8. 0.8秒后自动切换到登录页，并把注册的邮箱填到登录框里
        setTimeout(()=>{ 
            showLogin(); // 切换到登录页
            document.getElementById('login-username').value = u; // 自动填邮箱
        }, 800);
    });

    // 【第六步：登录表单提交逻辑】
    // 监听登录表单的"提交"事件（用户点登录按钮时触发）
    formLogin.addEventListener('submit', function(e){
        e.preventDefault(); // 阻止表单默认提交（避免页面刷新）

        // 1. 获取用户输入的登录信息（去空格）
        const u = document.getElementById('login-username').value.trim(); // 登录邮箱
        const p = document.getElementById('login-password').value; // 登录密码

        // 2. 获取提示文字的元素
        const hintU = document.getElementById('hint-login-username'); // 用户名提示
        const hintP = document.getElementById('hint-login-password'); // 密码提示
        const res = document.getElementById('login-result'); // 登录结果提示

        // 3. 清空所有提示文字
        hintU.textContent=''; 
        hintP.textContent=''; 
        res.textContent='';

        // 4. 表单验证（一步错就返回）
        if(!u){ hintU.textContent='请输入用户名'; return; } // 没输邮箱
        if(!isEmail(u)){ hintU.textContent='请输入有效的邮箱地址'; return; } // 邮箱格式错
        if(p.length<6){ hintP.textContent='密码长度至少6位'; return; } // 密码太短

        // 5. 验证账号密码是否正确
        const users = getUsers(); // 拿到所有已注册用户
        // 找有没有"邮箱+密码"都匹配的用户
        const found = users.find(x=>x.username===u && x.password===p);

        // 6. 登录失败：提示错误（红色文字）
        if(!found){ 
            res.style.color='#d00'; 
            res.textContent='用户名或密码错误'; 
            return; 
        }

        // 7. 登录成功：提示并跳转到首页
        res.style.color='#2d8a2d'; 
        res.textContent='登录成功，3秒后返回首页';
        // 1.2秒后跳转到index.html（首页）
        setTimeout(()=>{ 
            window.location.href = './index.html'; 
        }, 1200);
    });
});