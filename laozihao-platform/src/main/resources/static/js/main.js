// 等待页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 返回顶部按钮功能
    var backToTopBtn = document.getElementById('back-to-top');
    
    // 滚动时显示/隐藏按钮
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    // 点击返回顶部
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 初始化轮播图
    var carousels = document.querySelectorAll('.carousel');
    if (carousels.length > 0 && typeof bootstrap !== 'undefined') {
        carousels.forEach(function(carousel) {
            new bootstrap.Carousel(carousel, {
                interval: 5000
            });
        });
    }
    
    // 添加16:9宽高比约束
    function setAspectRatio() {
        const aspectContainers = document.querySelectorAll('.aspect-ratio-16-9');
        aspectContainers.forEach(container => {
            // 已经通过CSS设置了padding-bottom: 56.25%来保持16:9比例
        });
    }
    
    setAspectRatio();
    window.addEventListener('resize', setAspectRatio);
    
    // 在移动设备上初始化底部导航
    function initMobileNav() {
        if (window.innerWidth <= 768) {
            const mobileNav = document.createElement('div');
            mobileNav.className = 'mobile-nav';
            
            // 创建底部导航项目
            const navItems = [
                { icon: 'home', text: '首页', href: '/' },
                { icon: 'lightbulb', text: '方案', href: '/solutions' },
                { icon: 'chart-line', text: '案例', href: '/case-studies' },
                { icon: 'book', text: '洞察', href: '/insights' },
                { icon: 'envelope', text: '联系', href: '/contact' }
            ];
            
            navItems.forEach(item => {
                const navItem = document.createElement('a');
                navItem.className = 'mobile-nav-item';
                navItem.href = item.href;
                
                const icon = document.createElement('i');
                icon.className = 'fas fa-' + item.icon;
                
                const text = document.createElement('span');
                text.textContent = item.text;
                
                navItem.appendChild(icon);
                navItem.appendChild(text);
                mobileNav.appendChild(navItem);
            });
            
            // 检查是否已存在移动导航，如果不存在则添加
            if (!document.querySelector('.mobile-nav')) {
                document.body.appendChild(mobileNav);
                
                // 添加底部填充以避免内容被底部导航遮挡
                document.body.style.paddingBottom = '70px';
            }
        } else {
            // 如果屏幕宽度大于768px，移除移动导航
            const mobileNav = document.querySelector('.mobile-nav');
            if (mobileNav) {
                mobileNav.remove();
                document.body.style.paddingBottom = '0';
            }
        }
    }
    
    // 初始化并在窗口调整大小时重新检查
    initMobileNav();
    window.addEventListener('resize', initMobileNav);
}); 