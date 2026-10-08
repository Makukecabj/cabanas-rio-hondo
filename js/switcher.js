(function () {
    'use strict';

    var STORAGE_KEY = 'chosen_template';
    var templates = ['A', 'B', 'C'];
    var displayOrder = ['C', 'B', 'A']; // Rústico → Moderno → Elegante
    var info = {
        A: {
            name: 'Elegante',
            desc: 'Serif & Dorado — Cálido y sofisticado'
        },
        B: {
            name: 'Moderno',
            desc: 'Sans-serif & Rojo — Limpio y directo'
        },
        C: {
            name: 'Rústico',
            desc: 'Naturaleza & Azul — Acogedor y orgánico'
        }
    };

    var available = [];
    var checked = 0;

    templates.forEach(function (t) {
        fetch('preview-' + t + '.html', { method: 'HEAD' })
            .then(function (r) { if (r.ok) available.push(t); })
            .catch(function () { })
            .finally(function () {
                checked++;
                if (checked === templates.length) {
                    available.sort(function (a, b) {
                        return displayOrder.indexOf(a) - displayOrder.indexOf(b);
                    });
                    init();
                }
            });
    });

    function init() {
        if (available.length === 0) return;

        var isRoot = window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('hostelyatel.vercel.app/');
        if (isRoot) {
            showModal(true);
        } else {
            var chosen = localStorage.getItem(STORAGE_KEY);
            if (!chosen || available.indexOf(chosen) === -1) {
                showModal(true);
            } else {
                injectChangeButton();
            }
        }
    }

    function buildMockup(tpl) {
        var data = {
            A: {
                navBg: '#16281F',
                heroGradient: 'linear-gradient(170deg, #16281F 0%, #1C3829 40%, #0F1F17 100%)',
                accent: '#D9A441',
                accentGlow: 'rgba(217,164,65,0.25)',
                badge: '★ 4.9',
                title1: 'Sumate a la',
                title2: 'experiencia',
                subtitle: 'Hospedaje exclusivo',
                btnText: 'Reservar ahora',
                serif: true,
                amenities: ['📶', '🍳', '🛏', '☕'],
                amenityColors: ['rgba(217,164,65,0.15)', 'rgba(217,164,65,0.10)', 'rgba(217,164,65,0.15)', 'rgba(217,164,65,0.10)'],
                navDots: ['#D9A441', '#C4903A', '#B8862E'],
                darkNav: true,
                bodyBg: '#0F1F17',
                cardBg: 'rgba(22,40,31,0.6)',
                cardBorder: 'rgba(217,164,65,0.15)',
                cardText: 'rgba(255,255,255,0.6)'
            },
            B: {
                navBg: '#1A1A1A',
                heroGradient: 'linear-gradient(170deg, #1A1A1A 0%, #252525 40%, #111 100%)',
                accent: '#E53935',
                accentGlow: 'rgba(229,57,53,0.25)',
                badge: '★ 4.8',
                title1: 'Viví la',
                title2: 'experiencia',
                subtitle: 'Diseño y confort',
                btnText: 'Reservar ahora',
                serif: false,
                amenities: ['📶', '🍳', '🛏', '☕'],
                amenityColors: ['rgba(229,57,53,0.12)', 'rgba(255,255,255,0.05)', 'rgba(229,57,53,0.12)', 'rgba(255,255,255,0.05)'],
                navDots: ['#E53935', '#C62828', '#B71C1C'],
                darkNav: true,
                bodyBg: '#111',
                cardBg: 'rgba(26,26,26,0.6)',
                cardBorder: 'rgba(255,255,255,0.08)',
                cardText: 'rgba(255,255,255,0.5)'
            },
            C: {
                navBg: '#2D4A22',
                heroGradient: 'linear-gradient(170deg, #5B7744 0%, #4A6235 40%, #2D4A22 100%)',
                accent: '#7CB9E8',
                accentGlow: 'rgba(124,185,232,0.25)',
                badge: 'ECO',
                title1: 'Conectá con',
                title2: 'naturaleza',
                subtitle: 'Aventura y paisaje',
                btnText: 'Reservar ahora',
                serif: false,
                amenities: ['📶', '🍳', '🛏', '☕'],
                amenityColors: ['rgba(124,185,232,0.12)', 'rgba(255,255,255,0.08)', 'rgba(124,185,232,0.12)', 'rgba(255,255,255,0.08)'],
                navDots: ['#7CB9E8', '#5BA3D9', '#4A90C4'],
                darkNav: true,
                bodyBg: '#2D4A22',
                cardBg: 'rgba(45,74,34,0.6)',
                cardBorder: 'rgba(124,185,232,0.15)',
                cardText: 'rgba(255,255,255,0.6)'
            }
        };

        var d = data[tpl];
        var fontFamily = d.serif ? "'Fraunces', Georgia, serif" : "'Inter', 'Manrope', sans-serif";

        var h = '';
        h += '<div class="sw-mock" style="background:' + d.bodyBg + ';font-family:' + fontFamily + ';">';

        h += '<div class="sw-mock-nav" style="background:' + d.navBg + ';padding:6px 10px;display:flex;align-items:center;justify-content:space-between;">';
        h += '<div style="display:flex;gap:3px;">';
        d.navDots.forEach(function (c) {
            h += '<span style="width:6px;height:6px;border-radius:50%;background:' + c + ';"></span>';
        });
        h += '</div>';
        h += '<div style="width:50px;height:6px;border-radius:3px;background:' + d.accent + ';opacity:0.5;"></div>';
        h += '<div style="display:flex;gap:5px;align-items:center;">';
        h += '<span style="color:rgba(255,255,255,0.5);font-size:7px;">EN</span>';
        h += '<span style="color:rgba(255,255,255,0.5);font-size:7px;">☀</span>';
        h += '</div>';
        h += '</div>';

        h += '<div class="sw-mock-hero" style="background:' + d.heroGradient + ';padding:16px 12px 14px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;">';
        h += '<div style="display:inline-block;background:' + d.accentGlow + ';border:1px solid ' + d.accent + ';border-radius:20px;padding:2px 8px;margin-bottom:8px;">';
        h += '<span style="color:' + d.accent + ';font-size:7px;font-weight:600;">' + d.badge + '</span>';
        h += '</div>';
        h += '<div style="color:rgba(255,255,255,0.7);font-size:10px;font-weight:400;margin-bottom:1px;">' + d.title1 + '</div>';
        h += '<div style="color:' + d.accent + ';font-size:16px;font-weight:700;line-height:1.1;margin-bottom:5px;">' + d.title2 + '</div>';
        h += '<div style="color:rgba(255,255,255,0.45);font-size:8px;margin-bottom:8px;">' + d.subtitle + '</div>';
        h += '<div style="background:' + d.accent + ';color:' + (tpl === 'A' ? '#16281F' : tpl === 'C' ? '#1A3A10' : '#fff') + ';padding:5px 14px;border-radius:' + (d.serif ? '8px' : '25px') + ';font-size:8px;font-weight:600;">' + d.btnText + '</div>';
        h += '</div>';

        h += '<div class="sw-mock-amenities" style="background:' + d.bodyBg + ';padding:10px 10px 8px;display:grid;grid-template-columns:1fr 1fr;gap:5px;">';
        d.amenities.forEach(function (icon, i) {
            h += '<div style="background:' + d.cardBg + ';border:1px solid ' + d.cardBorder + ';border-radius:6px;padding:7px 6px;display:flex;align-items:center;gap:6px;">';
            h += '<div style="width:22px;height:22px;border-radius:5px;background:' + d.amenityColors[i] + ';display:flex;align-items:center;justify-content:center;font-size:10px;">' + icon + '</div>';
            h += '<div style="flex:1;">';
            h += '<div style="height:3px;width:' + (40 + Math.random() * 30) + '%;background:' + d.accent + ';border-radius:2px;margin-bottom:3px;opacity:0.6;"></div>';
            h += '<div style="height:2px;width:' + (55 + Math.random() * 25) + '%;background:' + d.cardText + ';border-radius:2px;"></div>';
            h += '</div>';
            h += '</div>';
        });
        h += '</div>';

        h += '</div>';
        return h;
    }

    function showModal(isFirstVisit) {
        var existing = document.querySelector('.sw-modal');
        if (existing) existing.remove();

        var modal = document.createElement('div');
        modal.className = 'sw-modal';

        var html = '';
        html += '<div class="sw-content">';
        html += '<button class="sw-close" aria-label="Cerrar"><i class="fas fa-times"></i></button>';
        html += '<div class="sw-header">';
        if (isFirstVisit) {
            html += '<h2>Elegí tu plantilla</h2>';
            html += '<p>Todas muestran los mismos datos. Elegí la que más te guste.</p>';
        } else {
            html += '<h2>Cambiar plantilla</h2>';
            html += '<p>Elegí otra plantilla para tu sitio.</p>';
        }
        html += '</div>';
        html += '<div class="sw-grid">';

        available.forEach(function (t) {
            var d = info[t];
            var isChosen = localStorage.getItem(STORAGE_KEY) === t;
            html += '<div class="sw-card' + (isChosen ? ' sw-active' : '') + '" data-tpl="' + t + '">';
            html += '<div class="sw-card-preview">';
            html += buildMockup(t);
            html += '</div>';
            html += '<div class="sw-card-body">';
            html += '<h3>' + d.name + '</h3>';
            html += '<p>' + d.desc + '</p>';
            html += '<button class="sw-card-btn" data-tpl="' + t + '">';
            if (isChosen) {
                html += '<i class="fas fa-check"></i> Viendo ahora';
            } else {
                html += 'Elegir <i class="fas fa-arrow-right"></i>';
            }
            html += '</button>';
            html += '</div>';
            html += '</div>';
        });

        html += '</div>';
        html += '</div>';

        modal.innerHTML = html;

        modal.querySelector('.sw-close').addEventListener('click', function () {
            if (!localStorage.getItem(STORAGE_KEY)) {
                localStorage.setItem(STORAGE_KEY, available[0]);
            }
            modal.remove();
            injectChangeButton();
        });

        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                if (!localStorage.getItem(STORAGE_KEY)) {
                    localStorage.setItem(STORAGE_KEY, available[0]);
                }
                modal.remove();
                injectChangeButton();
            }
        });

        var cards = modal.querySelectorAll('.sw-card');
        cards.forEach(function (card) {
            card.addEventListener('click', function () {
                var tpl = card.getAttribute('data-tpl');
                localStorage.setItem(STORAGE_KEY, tpl);
                if (isPreviewPage(tpl)) {
                    modal.remove();
                    injectChangeButton();
                } else {
                    window.location.href = 'preview-' + tpl + '.html';
                }
            });
        });

        document.body.appendChild(modal);

        document.onkeydown = function (e) {
            if (e.key === 'Escape') {
                if (!localStorage.getItem(STORAGE_KEY)) {
                    localStorage.setItem(STORAGE_KEY, available[0]);
                }
                modal.remove();
                injectChangeButton();
            }
        };
    }

    function isPreviewPage(tpl) {
        return window.location.pathname.indexOf('preview-' + tpl) !== -1;
    }

    function injectChangeButton() {
        if (document.querySelector('.sw-change-btn')) return;

        var btn = document.createElement('button');
        btn.className = 'sw-change-btn';
        btn.innerHTML = '<i class="fas fa-palette"></i> Cambiar plantilla';
        btn.setAttribute('aria-label', 'Cambiar plantilla');
        btn.addEventListener('click', function () {
            showModal(false);
        });
        document.body.appendChild(btn);
    }
})();
