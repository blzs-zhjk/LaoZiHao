/**
 * 中华老字号游戏集合 - JavaScript交互
 */

// 等待DOM内容加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('中华老字号游戏集合已加载');
    
    // 添加游戏卡片的点击事件
    const gameCards = document.querySelectorAll('.game-card:not(.coming-soon)');
    gameCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // 如果点击的不是"开始游戏"按钮，则模拟点击按钮
            if (!e.target.classList.contains('play-btn')) {
                const playBtn = this.querySelector('.play-btn');
                if (playBtn) {
                    // 添加点击动画效果
                    this.classList.add('card-click');
                    setTimeout(() => {
                        this.classList.remove('card-click');
                        // 跳转到游戏页面
                        window.location.href = playBtn.getAttribute('href');
                    }, 300);
                }
            }
        });
    });

    // 页面加载动画
    const header = document.querySelector('header');
    const gameContainer = document.querySelector('.games-container');
    
    // 添加淡入效果的类
    setTimeout(() => {
        header.classList.add('fade-in');
    }, 100);
    
    setTimeout(() => {
        gameContainer.classList.add('fade-in');
        
        // 为每个游戏卡片添加逐个出现的动画
        const cards = document.querySelectorAll('.game-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('card-appear');
            }, index * 150);
        });
    }, 400);
    
    // 游戏分类切换功能
    const categoryLinks = document.querySelectorAll('.game-categories a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有活动类
            categoryLinks.forEach(item => item.classList.remove('active'));
            // 添加当前活动类
            this.classList.add('active');
            
            const category = this.getAttribute('href').substring(1);
            filterGames(category);
        });
    });
    
    // 搜索功能
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    
    // 搜索按钮点击事件
    searchButton.addEventListener('click', function() {
        performSearch();
    });
    
    // 输入框回车事件
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // 实现搜索功能
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm === '') return;
        
        const allGames = document.querySelectorAll('.game-card');
        let foundAny = false;
        
        allGames.forEach(game => {
            const gameTitle = game.querySelector('h3').textContent.toLowerCase();
            const gameDesc = game.querySelector('p').textContent.toLowerCase();
            
            if (gameTitle.includes(searchTerm) || gameDesc.includes(searchTerm)) {
                game.style.display = '';
                foundAny = true;
                
                // 高亮搜索结果动画效果
                game.classList.add('search-highlight');
                setTimeout(() => {
                    game.classList.remove('search-highlight');
                }, 1500);
            } else {
                game.style.display = 'none';
            }
        });
        
        // 显示搜索结果信息
        showSearchMessage(foundAny, searchTerm);
    }
    
    // 展示搜索结果信息
    function showSearchMessage(found, term) {
        let messageEl = document.getElementById('search-message');
        
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'search-message';
            const container = document.querySelector('main');
            container.insertBefore(messageEl, container.firstChild);
        }
        
        if (found) {
            messageEl.textContent = `"${term}" 的搜索结果：`;
            messageEl.className = 'search-result-message';
        } else {
            messageEl.textContent = `没有找到与 "${term}" 相关的游戏`;
            messageEl.className = 'search-result-message no-results';
        }
        
        // 添加搜索重置按钮
        if (!document.getElementById('reset-search')) {
            const resetBtn = document.createElement('button');
            resetBtn.id = 'reset-search';
            resetBtn.textContent = '显示所有游戏';
            resetBtn.addEventListener('click', resetSearch);
            messageEl.appendChild(resetBtn);
        }
    }
    
    // 重置搜索
    function resetSearch() {
        const allGames = document.querySelectorAll('.game-card');
        allGames.forEach(game => {
            game.style.display = '';
        });
        
        searchInput.value = '';
        
        const messageEl = document.getElementById('search-message');
        if (messageEl) {
            messageEl.remove();
        }
        
        // 重置分类选择
        const allGamesTab = document.querySelector('.game-categories a[href="#all"]');
        if (allGamesTab) {
            categoryLinks.forEach(item => item.classList.remove('active'));
            allGamesTab.classList.add('active');
        }
    }
    
    // 分类游戏
    function filterGames(category) {
        const allGames = document.querySelectorAll('.game-card');
        
        if (category === 'all') {
            // 显示所有游戏
            allGames.forEach(game => {
                game.style.display = '';
            });
        } else {
            // 根据分类显示游戏
            allGames.forEach(game => {
                const gameCategory = game.querySelector('.game-category');
                
                // 如果游戏没有分类标签，默认隐藏
                if (!gameCategory) {
                    game.style.display = 'none';
                    return;
                }
                
                const gameCat = gameCategory.textContent.toLowerCase();
                
                // 根据分类映射
                const categoryMap = {
                    'popular': ['热门'],
                    'puzzle': ['益智'],
                    'action': ['动作'],
                    'tradition': ['传统']
                };
                
                if (categoryMap[category] && categoryMap[category].includes(gameCat)) {
                    game.style.display = '';
                } else {
                    game.style.display = 'none';
                }
            });
        }
        
        // 重置搜索输入和消息
        searchInput.value = '';
        const messageEl = document.getElementById('search-message');
        if (messageEl) {
            messageEl.remove();
        }
    }
});

// 添加窗口滚动效果
window.addEventListener('scroll', function() {
    const scrollY = window.scrollY || window.pageYOffset;
    const header = document.querySelector('header .title-box');
    
    // 标题盒子视差效果
    if (header) {
        header.style.transform = `translateY(${scrollY * 0.1}px)`;
    }
    
    // 当滚动到一定位置时，为元素添加动画效果
    const animatedElements = document.querySelectorAll('.about-section, .featured-games');
    
    animatedElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight * 0.8 && !el.classList.contains('animate-in')) {
            el.classList.add('animate-in');
        }
    });
}); 