let typingTimeout;
let headerScrollTimeout;
let lastScrollTop = 0;
let countdownInterval;

window.onload = () => {
    let theme = localStorage.getItem('pageTheme') || 'light';
    let lang = localStorage.getItem('pageLang') || 'en';

    setTheme(theme);
    setLanguage(lang);
    updateActiveButtons(theme, lang);
    initMobileMenu();
    initAutoWrite();
    initDropdowns();
    initFeatureCards();
    initSocialPanel();
    initHeaderScroll();
    initCounters();
    initParticles();
    initFormSubmit();
}

const setTheme = (theme) => {
    const body = document.body;
    const oldTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';

    if (theme === 'dark') {
        body.classList.add('dark-theme');
    } else {
        body.classList.remove('dark-theme');
    }

    localStorage.setItem('pageTheme', theme);

    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${theme === 'dark' ? '#1a1a1a' : '#f8f9fa'};
        opacity: 0.3;
        z-index: 999999;
        pointer-events: none;
        animation: fadeOut 0.8s ease forwards;
    `;
    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.remove();
    }, 800);
}

const setLanguage = (lang) => {
    const data = languageData[lang];
    if (!data) return;

    for (const [key, value] of Object.entries(data)) {
        const element = document.getElementById(key);
        if (element) {
            if (key.includes('List') || key.includes('li')) {
                continue;
            }
            if (Array.isArray(value)) {
                element.innerHTML = value.map(item => `<li>${item}</li>`).join('');
            } else {
                element.textContent = value;
            }
        }
    }

    const searchInput = document.getElementById('searchPlaceholder');
    if (searchInput) {
        searchInput.placeholder = data.searchPlaceholder || 'Describe your project idea...';
    }

    const modalLists = {
        modal1List: [data.m1_li1, data.m1_li2, data.m1_li3, data.m1_li4],
        modal2List: [data.m2_li1, data.m2_li2, data.m2_li3, data.m2_li4],
        modal3List: [data.m3_li1, data.m3_li2, data.m3_li3, data.m3_li4]
    };

    for (const [listId, items] of Object.entries(modalLists)) {
        const list = document.getElementById(listId);
        if (list && items) {
            list.innerHTML = items.filter(item => item).map(item => `<li>${item}</li>`).join('');
        }
    }

    localStorage.setItem('pageLang', lang);
}

const updateActiveButtons = (theme, lang) => {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.transform = '';
    });

    const lightBtn = document.querySelector('.theme-btn.light-theme');
    const darkBtn = document.querySelector('.theme-btn.dark-theme');

    if (theme === 'light' && lightBtn) {
        lightBtn.classList.add('active');
        lightBtn.style.animation = 'pulseActive 2s infinite';
    } else if (darkBtn) {
        darkBtn.classList.add('active');
        darkBtn.style.animation = 'pulseActive 2s infinite';
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if ((lang === 'en' && btn.classList.contains('en-lang')) ||
            (lang === 'hy' && btn.classList.contains('hy-lang')) ||
            (lang === 'ru' && btn.classList.contains('ru-lang'))) {
            btn.classList.add('active');
        }
    });
}

const initAutoWrite = () => {
    const inp = document.querySelector('.search-input');
    if (!inp) return;
    if (typingTimeout) clearTimeout(typingTimeout);

    const texts = {
        en: ['E-commerce platform', 'Corporate website', 'Creative portfolio', 'Mobile app UI', 'Landing page'],
        ru: ['Интернет-магазин', 'Корпоративный сайт', 'Креативное портфолио', 'Мобильное приложение', 'Лендинг'],
        hy: ['Առցանց խանութ', 'Կորպորատիվ կայք', 'Պորտֆոլիո', 'Բջջային հավելված', 'Լենդինգ']
    };

    let currentLang = localStorage.getItem('pageLang') || 'en';
    let currentTextIndex = 0;
    let x = 0;
    let isDeleting = false;

    function type() {
        const activeLang = localStorage.getItem('pageLang') || 'en';
        if (activeLang !== currentLang) {
            currentLang = activeLang;
            currentTextIndex = 0;
            x = 0;
            isDeleting = false;
        }
        const currentTexts = texts[currentLang] || texts.en;
        const currentText = currentTexts[currentTextIndex];

        if (!isDeleting) {
            inp.placeholder = currentText.slice(0, x);
            x++;
            if (x > currentText.length) {
                isDeleting = true;
                typingTimeout = setTimeout(type, 2000);
                return;
            }
        } else {
            inp.placeholder = currentText.slice(0, x);
            x--;
            if (x === 0) {
                isDeleting = false;
                currentTextIndex = (currentTextIndex + 1) % currentTexts.length;
            }
        }
        typingTimeout = setTimeout(type, isDeleting ? 50 : 150);
    }
    type();
}

const initMobileMenu = () => {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');

    if (mobileBtn && nav) {
        mobileBtn.onclick = function (e) {
            e.stopPropagation();
            nav.classList.toggle('active');
            this.classList.toggle('active');

            if (nav.classList.contains('active')) {
                nav.style.animation = 'slideDown 0.5s ease';
            }
        };

        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 992) {
                    nav.classList.remove('active');
                    mobileBtn.classList.remove('active');
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !mobileBtn.contains(e.target) && window.innerWidth <= 992) {
                nav.classList.remove('active');
                mobileBtn.classList.remove('active');
            }
        });
    }
}

const initDropdowns = () => {
    function closeAll() {
        document.querySelectorAll('.dropdown-menu.active, .link-dropdown.active').forEach(m => {
            m.classList.remove('active');
            m.style.animation = '';
        });
        document.querySelectorAll('.link-card').forEach(c => c.style.zIndex = '');
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.onclick = function (e) {
            if (window.innerWidth <= 992) return;
            const dropdown = this.parentElement.querySelector('.dropdown-menu');
            if (dropdown) {
                e.preventDefault();
                e.stopPropagation();
                const wasActive = dropdown.classList.contains('active');
                closeAll();
                if (!wasActive) {
                    dropdown.classList.add('active');
                    dropdown.style.animation = 'slideDown 0.4s ease';
                }
            }
        };
    });

    document.querySelectorAll('.link-btn').forEach(btn => {
        btn.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            const card = this.closest('.link-card');
            const dropdown = card.querySelector('.link-dropdown');
            const wasActive = dropdown.classList.contains('active');
            closeAll();
            if (!wasActive) {
                dropdown.classList.add('active');
                dropdown.style.animation = 'fadeInScale 0.4s ease';
                card.style.zIndex = '1004';
            }
        };
    });

    document.addEventListener('click', closeAll);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAll();
    });
}

const initSocialPanel = () => {
    const trigger = document.getElementById('socialTrigger');
    const panel = document.getElementById('socialPanel');
    const closeBtn = document.querySelector('.social-panel-close');

    if (trigger && panel && closeBtn) {
        trigger.onclick = (e) => {
            e.stopPropagation();
            panel.classList.toggle('active');
            trigger.style.transform = panel.classList.contains('active') ? 'scale(1.1)' : '';
        };

        closeBtn.onclick = () => {
            panel.classList.remove('active');
            trigger.style.transform = '';
        };

        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && !trigger.contains(e.target)) {
                panel.classList.remove('active');
                trigger.style.transform = '';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && panel.classList.contains('active')) {
                panel.classList.remove('active');
                trigger.style.transform = '';
            }
        });
    }
}

const initFeatureCards = () => {
    const modalIds = ['wayback-machine-modal', 'archive-search-modal', 'save-pages-modal'];

    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.onclick = () => {
            const modal = document.getElementById(modalIds[index]);
            if (modal) {
                modal.classList.add('active');
                document.body.classList.add('modal-open');
            }
        };
    });

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.onclick = closeAllModals;
    });

    window.onclick = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeAllModals();
        }
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

const closeAllModals = () => {
    document.querySelectorAll('.modal-overlay').forEach(m => {
        m.classList.remove('active');
    });
    document.body.classList.remove('modal-open');
}

const initHeaderScroll = () => {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

        clearTimeout(headerScrollTimeout);
        headerScrollTimeout = setTimeout(() => {
            if (scrollTop > 200) {
                header.classList.remove('header-hidden');
            }
        }, 1000);
    });
}

const initCounters = () => {
    const counters = document.querySelectorAll('.stat-number');

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count')) || parseInt(counter.innerText);
        const suffix = counter.innerText.replace(/[0-9]/g, '');
        let current = 0;
        const increment = target / 50;
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.innerText = Math.ceil(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target + suffix;
            }
        };
        updateCounter();
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

const initParticles = () => {
    const container = document.querySelector('.particle-container');
    if (!container) return;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = 15 + Math.random() * 15 + 's';
        particle.style.width = 2 + Math.random() * 6 + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

const initFormSubmit = () => {
    const forms = document.querySelectorAll('.contact-form');
    forms.forEach(form => {
        form.onsubmit = (e) => {
            e.preventDefault();
            const btn = form.querySelector('.submit-btn');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<span>✓ Sent!</span>';
            btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                form.reset();
            }, 2000);
        };
    });

    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.onclick = (e) => {
            e.preventDefault();
            const input = document.querySelector('.search-input');
            if (input && input.value.trim() !== '') {
                input.style.animation = 'shake 0.5s ease';
                setTimeout(() => {
                    input.style.animation = '';
                }, 500);

                searchBtn.innerHTML = '<span class="btn-text">SEARCHING</span><span class="btn-icon">⏳</span>';
                setTimeout(() => {
                    searchBtn.innerHTML = '<span class="btn-text">SEARCH</span><span class="btn-icon">→</span>';
                }, 2000);
            }
        };
    }
}

document.querySelector('.theme-btn.light-theme')?.addEventListener('click', () => {
    const currentLang = localStorage.getItem('pageLang') || 'en';
    setTheme('light');
    updateActiveButtons('light', currentLang);
});

document.querySelector('.theme-btn.dark-theme')?.addEventListener('click', () => {
    const currentLang = localStorage.getItem('pageLang') || 'en';
    setTheme('dark');
    updateActiveButtons('dark', currentLang);
});

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const lang = this.classList.contains('en-lang') ? 'en' :
            this.classList.contains('hy-lang') ? 'hy' : 'ru';
        const currentTheme = localStorage.getItem('pageTheme') || 'light';
        setLanguage(lang);
        updateActiveButtons(currentTheme, lang);
        initAutoWrite();
    });
});

const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeOut {
        from { opacity: 0.3; }
        to { opacity: 0; }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-10px); }
        40% { transform: translateX(10px); }
        60% { transform: translateX(-5px); }
        80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

const languageData = {
    en: {
        logoText: 'IT ARM technology',
        title: 'IT ARM technology',
        subTitle: 'Professional web development and high-quality coding for your business',
        searchPlaceholder: 'Describe your project idea...',
        stat1: 'successful projects',
        stat2: 'modern technologies',
        stat3: 'happy clients',
        featuresTitle: 'Our Services',
        feature1: 'Responsive Design',
        feature1desc: 'Perfect display on any device and screen size',
        feature2: 'Clean Code',
        feature2desc: 'Semantic HTML5 and modern CSS standards',
        feature3: 'Modern Stack',
        feature3desc: 'Fast and scalable web applications',
        recentTitle: 'Latest Projects',
        recent1: 'E-commerce Platform',
        recent1desc: 'Full responsive layout for a retail store',
        recent1date: 'Today, 14:30',
        recent2: 'Corporate Website',
        recent2desc: 'Business portal for a law firm',
        recent2date: 'Yesterday, 09:15',
        recent3: 'Creative Portfolio',
        recent3desc: 'Animated page with modern UI',
        recent3date: '2 days ago',
        recent4: 'Mobile App UI',
        recent4desc: 'Fitness tracking application',
        recent4date: '3 days ago',
        linksTitle: 'Quick Actions',
        link1: 'Order Layout',
        link1desc: 'Get a professional website layout',
        link1btn: 'Order',
        link2: 'Consultation',
        link2desc: 'Free technical advice for your project',
        link2btn: 'Get',
        link3: 'Join Us',
        link3desc: 'Become a part of our developer team',
        link3btn: 'Join',
        sideDropTitle1: 'Order Options',
        sideDrop1_1: '⚡ Express Delivery (24h)',
        sideDrop1_2: '📦 Standard (3-5 days)',
        sideDrop1_3: '💎 Premium + Consultation',
        sideDropTitle2: 'Support Type',
        sideDrop2_1: '🔧 Technical Consultation',
        sideDrop2_2: '📊 Marketing Strategy',
        sideDrop2_3: '🎨 Design Review',
        sideDropTitle3: 'Open Positions',
        sideDrop3_1: '⚛️ Frontend Developer',
        sideDrop3_2: '⚙️ Backend Engineer',
        sideDrop3_3: '🎯 UI/UX Designer',
        donateTitle: 'Build Your Digital Future',
        donateDesc: 'Professional web services that make your brand stand out from the competition.',
        donateBtn: 'START PROJECT',
        footH1: 'Project',
        footL1: 'About Us',
        footL2: 'History',
        footL3: 'Team',
        footL4: 'Partners',
        footH2: 'Help',
        footL5: 'FAQ',
        footL6: 'Forum',
        footL7: 'Contact',
        footL8: 'Support',
        footH3: 'Legal',
        footL9: 'Terms',
        footL10: 'Privacy',
        footL11: 'Copyright',
        footL12: 'Cookies',
        footH4: 'Newsletter',
        footInput: 'Your email',
        footBtn: 'Send',
        copyright: '© 2026 IT ARM technology. All rights reserved.',
        modal1Title: 'Responsive Design',
        modal1Sub: 'Perfect display on any device',
        modal1DetailT: 'Mobile-First Approach',
        modal1Desc: 'We ensure your brand looks professional whether accessed from a 4K monitor or a small smartphone screen. Our layouts adapt to any resolution.',
        m1_li1: 'Perfect mobile scaling',
        m1_li2: 'Cross-browser compatibility',
        m1_li3: 'Touch-friendly elements',
        m1_li4: 'Adaptive images',
        modal1Action: 'Explore Service',
        modal2Title: 'Clean Code',
        modal2Sub: 'High-performance semantic structure',
        modal2DetailT: 'Quality Standard',
        modal2Desc: 'Clean code is not just about beauty; it is about speed, SEO optimization, and easy maintenance for years to come.',
        m2_li1: 'W3C Validated code',
        m2_li2: 'BEM methodology',
        m2_li3: 'SEO-friendly tags',
        m2_li4: 'Fast loading speed',
        modal2Action: 'Start Project',
        modal3Title: 'Modern Stack',
        modal3Sub: 'Future-proof development stack',
        modal3DetailT: 'Modern Technologies',
        modal3Desc: 'We use the most efficient tools like React, Tailwind, and Next.js to build scalable and interactive web applications.',
        m3_li1: 'React & Vue expertise',
        m3_li2: 'Tailwind CSS styling',
        m3_li3: 'Advanced JavaScript',
        m3_li4: 'Next.js for performance',
        modal3Action: 'Contact Us'
    },
    ru: {
        logoText: 'IT ARM technology',
        title: 'IT ARM technology',
        subTitle: 'Профессиональная веб-разработка и качественный код для вашего бизнеса',
        searchPlaceholder: 'Опишите идею вашего проекта...',
        stat1: 'успешных проектов',
        stat2: 'современных технологий',
        stat3: 'довольных клиентов',
        featuresTitle: 'Наши Услуги',
        feature1: 'Адаптивный Дизайн',
        feature1desc: 'Идеальное отображение на любых устройствах',
        feature2: 'Чистый Код',
        feature2desc: 'Семантический HTML5 и современные CSS',
        feature3: 'Современный Стек',
        feature3desc: 'Быстрые и масштабируемые приложения',
        recentTitle: 'Последние Проекты',
        recent1: 'E-commerce Платформа',
        recent1desc: 'Адаптивный макет для магазина',
        recent1date: 'Сегодня, 14:30',
        recent2: 'Корпоративный Сайт',
        recent2desc: 'Портал для юридической фирмы',
        recent2date: 'Вчера, 09:15',
        recent3: 'Креативное Портфолио',
        recent3desc: 'Современный UI с анимацией',
        recent3date: '2 дня назад',
        recent4: 'Мобильное Приложение',
        recent4desc: 'Фитнес трекер',
        recent4date: '3 дня назад',
        linksTitle: 'Быстрые Действия',
        link1: 'Заказать Верстку',
        link1desc: 'Получите профессиональный макет',
        link1btn: 'Заказать',
        link2: 'Консультация',
        link2desc: 'Бесплатный тех. аудит проекта',
        link2btn: 'Получить',
        link3: 'Присоединиться',
        link3desc: 'Станьте частью нашей команды',
        link3btn: 'Вступить',
        sideDropTitle1: 'Варианты Заказа',
        sideDrop1_1: '⚡ Экспресс (24ч)',
        sideDrop1_2: '📦 Стандарт (3-5 дней)',
        sideDrop1_3: '💎 Премиум + Консультация',
        sideDropTitle2: 'Тип Поддержки',
        sideDrop2_1: '🔧 Техническая',
        sideDrop2_2: '📊 Маркетинг',
        sideDrop2_3: '🎨 Дизайн',
        sideDropTitle3: 'Вакансии',
        sideDrop3_1: '⚛️ Фронтенд',
        sideDrop3_2: '⚙️ Бэкенд',
        sideDrop3_3: '🎯 UI/UX',
        donateTitle: 'Постройте Цифровое Будущее',
        donateDesc: 'Профессиональные веб-услуги, которые выделят ваш бренд.',
        donateBtn: 'НАЧАТЬ ПРОЕКТ',
        footH1: 'Проект',
        footL1: 'О нас',
        footL2: 'История',
        footL3: 'Команда',
        footL4: 'Партнеры',
        footH2: 'Помощь',
        footL5: 'FAQ',
        footL6: 'Форум',
        footL7: 'Контакты',
        footL8: 'Поддержка',
        footH3: 'Правовая',
        footL9: 'Условия',
        footL10: 'Приватность',
        footL11: 'Копирайт',
        footL12: 'Cookies',
        footH4: 'Рассылка',
        footInput: 'Ваш email',
        footBtn: 'Отправить',
        copyright: '© 2026 IT ARM technology. Все права защищены.',
        modal1Title: 'Адаптивный Дизайн',
        modal1Sub: 'Идеально на любом устройстве',
        modal1DetailT: 'Mobile-First Подход',
        modal1Desc: 'Мы гарантируем профессиональный вид вашего бренда как на 4K мониторе, так и на смартфоне. Наши макеты адаптируются к любому разрешению.',
        m1_li1: 'Идеальное масштабирование',
        m1_li2: 'Кросс-браузерность',
        m1_li3: 'Удобные сенсорные элементы',
        m1_li4: 'Адаптивные изображения',
        modal1Action: 'Изучить',
        modal2Title: 'Чистый Код',
        modal2Sub: 'Высокопроизводительная структура',
        modal2DetailT: 'Стандарт Качества',
        modal2Desc: 'Чистый код — это не только красота, но и скорость, SEO оптимизация и легкая поддержка на годы вперед.',
        m2_li1: 'Валидация W3C',
        m2_li2: 'Методология BEM',
        m2_li3: 'SEO-теги',
        m2_li4: 'Быстрая загрузка',
        modal2Action: 'Старт',
        modal3Title: 'Современный Стек',
        modal3Sub: 'Технологии будущего',
        modal3DetailT: 'Новые Технологии',
        modal3Desc: 'Мы используем React, Tailwind и Next.js для создания масштабируемых и интерактивных приложений.',
        m3_li1: 'Экспертиза React & Vue',
        m3_li2: 'Стили Tailwind',
        m3_li3: 'Продвинутый JS',
        m3_li4: 'Next.js',
        modal3Action: 'Связаться'
    },
    hy: {
        logoText: 'IT ARM technology',
        title: 'IT ARM technology',
        subTitle: 'Պրոֆեսիոնալ վեբ մշակում և բարձրորակ կոդ ձեր բիզնեսի համար',
        searchPlaceholder: 'Նկարագրեք ձեր գաղափարը...',
        stat1: 'հաջող նախագիծ',
        stat2: 'տեխնոլոգիա',
        stat3: 'գոհ հաճախորդ',
        featuresTitle: 'Մեր Ծառայությունները',
        feature1: 'Ադապտիվ Դիզայն',
        feature1desc: 'Կատարյալ ցուցադրում բոլոր սարքերում',
        feature2: 'Մաքուր Կոդ',
        feature2desc: 'Սեմանտիկ HTML5 և ժամանակակից CSS',
        feature3: 'Ժամանակակից Սթեք',
        feature3desc: 'Արագ և մասշտաբային հավելվածներ',
        recentTitle: 'Վերջին Նախագծերը',
        recent1: 'E-commerce Հարթակ',
        recent1desc: 'Ադապտիվ դիզայն խանութի համար',
        recent1date: 'Այսօր, 14:30',
        recent2: 'Կորպորատիվ Կայք',
        recent2desc: 'Պորտալ իրավաբանական ընկերության համար',
        recent2date: 'Երեկ, 09:15',
        recent3: 'Ստեղծագործ Պորտֆոլիո',
        recent3desc: 'Անիմացիոն ժամանակակից UI',
        recent3date: '2 օր առաջ',
        recent4: 'Բջջային Հավելված',
        recent4desc: 'Ֆիթնես հետևում',
        recent4date: '3 օր առաջ',
        linksTitle: 'Արագ Գործողություններ',
        link1: 'Պատվիրել',
        link1desc: 'Ստացեք պրոֆեսիոնալ դիզայն',
        link1btn: 'Պատվեր',
        link2: 'Խորհրդատվություն',
        link2desc: 'Անվճար տեխ. խորհրդատվություն',
        link2btn: 'Ստանալ',
        link3: 'Միանալ',
        link3desc: 'Դարձեք մեր թիմի մաս',
        link3btn: 'Միանալ',
        sideDropTitle1: 'Պատվերի Տարբերակներ',
        sideDrop1_1: '⚡ Էքսպրես (24ժ)',
        sideDrop1_2: '📦 Ստանդարտ (3-5 օր)',
        sideDrop1_3: '💎 Պրեմիում + Խորհրդատվություն',
        sideDropTitle2: 'Աջակցության Տեսակ',
        sideDrop2_1: '🔧 Տեխնիկական',
        sideDrop2_2: '📊 Մարքեթինգ',
        sideDrop2_3: '🎨 Դիզայն',
        sideDropTitle3: 'Թափուր Տեղեր',
        sideDrop3_1: '⚛️ Ֆրոնտենդ',
        sideDrop3_2: '⚙️ Բեքենդ',
        sideDrop3_3: '🎯 UI/UX',
        donateTitle: 'Կառուցեք Թվային Ապագան',
        donateDesc: 'Պրոֆեսիոնալ վեբ ծառայություններ, որոնք կառանձնացնեն ձեր բրենդը:',
        donateBtn: 'ՍԿՍԵԼ ՆԱԽԱԳԻԾԸ',
        footH1: 'Նախագիծ',
        footL1: 'Մեր մասին',
        footL2: 'Պատմություն',
        footL3: 'Թիմ',
        footL4: 'Գործընկերներ',
        footH2: 'Օգնություն',
        footL5: 'ՀՏՀ',
        footL6: 'Ֆորում',
        footL7: 'Կապ',
        footL8: 'Աջակցություն',
        footH3: 'Իրավական',
        footL9: 'Պայմաններ',
        footL10: 'Գաղտնիություն',
        footL11: 'Հեղինակային',
        footL12: 'Թխուկներ',
        footH4: 'Տեղեկագիր',
        footInput: 'Ձեր էլ․ հասցեն',
        footBtn: 'Ուղարկել',
        copyright: '© 2026 IT ARM technology. Բոլոր իրավունքները պաշտպանված են:',
        modal1Title: 'Ադապտիվ Դիզայն',
        modal1Sub: 'Կատարյալ ցանկացած սարքում',
        modal1DetailT: 'Mobile-First Մոտեցում',
        modal1Desc: 'Մենք ապահովում ենք ձեր բրենդի պրոֆեսիոնալ տեսքը և՛ 4K մոնիտորի, և՛ սմարթֆոնի վրա:',
        m1_li1: 'Կատարյալ մասշտաբավորում',
        m1_li2: 'Բրաուզերների համատեղելիություն',
        m1_li3: 'Հպման համար հարմար',
        m1_li4: 'Ադապտիվ նկարներ',
        modal1Action: 'Իմանալ ավելին',
        modal2Title: 'Մաքուր Կոդ',
        modal2Sub: 'Բարձր արդյունավետություն',
        modal2DetailT: 'Որակի Ստանդարտ',
        modal2Desc: 'Մաքուր կոդը արագություն է, SEO օպտիմիզացիա և հեշտ սպասարկում տարիներ շարունակ:',
        m2_li1: 'W3C վավերացում',
        m2_li2: 'BEM մեթոդաբանություն',
        m2_li3: 'SEO-բարեկամ թեգեր',
        m2_li4: 'Արագ բեռնում',
        modal2Action: 'Սկսել',
        modal3Title: 'Ժամանակակից Սթեք',
        modal3Sub: 'Ապագայի տեխնոլոգիաներ',
        modal3DetailT: 'Նոր Տեխնոլոգիաներ',
        modal3Desc: 'Մենք օգտագործում ենք React, Tailwind և Next.js մասշտաբային հավելվածների համար:',
        m3_li1: 'React & Vue փորձ',
        m3_li2: 'Tailwind CSS',
        m3_li3: 'Առաջադեմ JS',
        m3_li4: 'Next.js',
        modal3Action: 'Կապ'
    }
};