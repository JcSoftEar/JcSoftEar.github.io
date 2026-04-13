/**
 * 个人网站 - 交互脚本
 * 包含导航、动画、筛选等功能
 */

(function() {
  'use strict';

  // ========================================
  // 移动端导航菜单
  // ========================================
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    // 点击链接后关闭菜单
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }

  // ========================================
  // 数字动画
  // ========================================
  function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.target);
          animateValue(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => {
      if (num.dataset.target) {
        observer.observe(num);
      }
    });
  }

  function animateValue(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (target - start) * easeProgress);
      
      element.textContent = formatNumber(current);
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }

  function formatNumber(num) {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w';
    }
    return num.toLocaleString('zh-CN');
  }

  // ========================================
  // 博客分类筛选
  // ========================================
  function initBlogFilter() {
    const categoryList = document.querySelector('.category-list');
    const postsList = document.getElementById('postsList');
    
    if (!categoryList || !postsList) return;

    categoryList.querySelectorAll('li').forEach(item => {
      item.addEventListener('click', () => {
        // 更新选中状态
        categoryList.querySelectorAll('li').forEach(li => li.classList.remove('active'));
        item.classList.add('active');

        const category = item.dataset.category;
        const posts = postsList.querySelectorAll('.post-item');

        posts.forEach(post => {
          if (category === 'all' || post.dataset.category === category) {
            post.style.display = 'flex';
            post.style.opacity = '0';
            setTimeout(() => post.style.opacity = '1', 50);
          } else {
            post.style.display = 'none';
          }
        });
      });
    });
  }

  // ========================================
  // 博客标签筛选
  // ========================================
  function initTagFilter() {
    const tagCloud = document.querySelector('.tag-cloud');
    if (!tagCloud) return;

    tagCloud.querySelectorAll('.tag').forEach(tag => {
      tag.addEventListener('click', () => {
        tagCloud.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        // 实际项目中这里会根据标签筛选文章
      });
    });
  }

  // ========================================
  // 搜索功能
  // ========================================
  function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const postsList = document.getElementById('postsList');
    
    if (!searchInput || !postsList) return;

    searchInput.addEventListener('input', debounce((e) => {
      const query = e.target.value.toLowerCase();
      const posts = postsList.querySelectorAll('.post-item');

      posts.forEach(post => {
        const title = post.querySelector('.post-title').textContent.toLowerCase();
        const excerpt = post.querySelector('.post-excerpt').textContent.toLowerCase();
        
        if (title.includes(query) || excerpt.includes(query)) {
          post.style.display = 'flex';
        } else {
          post.style.display = 'none';
        }
      });
    }, 300));
  }

  // ========================================
  // 排序功能
  // ========================================
  function initSort() {
    const sortSelect = document.getElementById('sortSelect');
    const postsList = document.getElementById('postsList');
    
    if (!sortSelect || !postsList) return;

    sortSelect.addEventListener('change', (e) => {
      const posts = Array.from(postsList.querySelectorAll('.post-item'));
      const sortBy = e.target.value;

      posts.sort((a, b) => {
        if (sortBy === 'latest') {
          // 按日期排序（简化处理）
          return 0;
        } else if (sortBy === 'popular') {
          // 按阅读量排序
          const aReads = parseInt(a.querySelector('.read-count')?.textContent.replace(/,/g, '') || 0);
          const bReads = parseInt(b.querySelector('.read-count')?.textContent.replace(/,/g, '') || 0);
          return bReads - aReads;
        }
        return 0;
      });

      posts.forEach(post => postsList.appendChild(post));
    });
  }

  // ========================================
  // 作品集筛选
  // ========================================
  function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioGrid = document.getElementById('portfolioGrid');
    
    if (!filterBtns.length || !portfolioGrid) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        const items = portfolioGrid.querySelectorAll('.portfolio-item');

        items.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.classList.remove('hidden');
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  // ========================================
  // 作品集模态框
  // ========================================
  function initModal() {
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const modalBackdrop = modal?.querySelector('.modal-backdrop');
    
    if (!modal || !modalClose) return;

    // 点击关闭按钮
    modalClose.addEventListener('click', closeModal);

    // 点击背景关闭
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', closeModal);
    }

    // ESC键关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // ========================================
  // 技能条动画
  // ========================================
  function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.style.width;
          entry.target.style.width = '0';
          setTimeout(() => {
            entry.target.style.width = width;
          }, 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
  }

  // ========================================
  // 滚动动画
  // ========================================
  function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.post-card, .work-card, .portfolio-item, .resume-section');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animateElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  // ========================================
  // 平滑滚动
  // ========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const navHeight = document.querySelector('.navbar').offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ========================================
  // 分页
  // ========================================
  function initPagination() {
    const pageBtns = document.querySelectorAll('.page-btn');
    
    pageBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled || btn.classList.contains('page-ellipsis')) return;
        
        pageBtns.forEach(b => b.classList.remove('active'));
        
        if (btn.classList.contains('prev') || btn.classList.contains('next')) {
          const activeBtn = document.querySelector('.page-btn.active');
          if (activeBtn) {
            const newPage = btn.classList.contains('prev') 
              ? parseInt(activeBtn.textContent) - 1 
              : parseInt(activeBtn.textContent) + 1;
            
            const targetBtn = document.querySelector(`.page-btn:not(.prev):not(.next):not(.page-ellipsis):nth-child(${newPage})`);
            if (targetBtn) {
              targetBtn.classList.add('active');
              updatePrevNextState();
            }
          }
        } else {
          btn.classList.add('active');
          updatePrevNextState();
        }
      });
    });

    function updatePrevNextState() {
      const prevBtn = document.querySelector('.page-btn.prev');
      const nextBtn = document.querySelector('.page-btn.next');
      const activeBtn = document.querySelector('.page-btn.active');
      
      if (prevBtn) prevBtn.disabled = activeBtn && activeBtn.textContent === '1';
      if (nextBtn) nextBtn.disabled = activeBtn && activeBtn.textContent === '6';
    }
  }

  // ========================================
  // 工具函数
  // ========================================
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ========================================
  // 初始化
  // ========================================
  document.addEventListener('DOMContentLoaded', () => {
    animateNumbers();
    initBlogFilter();
    initTagFilter();
    initSearch();
    initSort();
    initPortfolioFilter();
    initModal();
    animateSkillBars();
    initSmoothScroll();
    initPagination();
    
    // 延迟执行滚动动画以确保元素可见
    setTimeout(initScrollAnimations, 100);
  });

})();
