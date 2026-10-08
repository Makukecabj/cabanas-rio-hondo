(function() {
    'use strict';

    var config = null;
    var currentLang = localStorage.getItem('c_lang') || 'es';
    var galleryIndex = 0;

    var I18N = {
        es: {
            nav: { about: 'El Lodge', services: 'Servicios', gallery: 'Galería', location: 'Ubicación', book: 'Reservar' },
            hero: { cta: 'Reservar Ahora', more: 'Conocer Más' },
            about: { eyebrow: 'Sobre nosotros', custom2: 'Atención Personalizada', custom3: 'Ambiente Hogareño', def2: 'Te ayudamos a planificar tu estadía.', def3: 'Espacios cálidos y acogedores.' },
            services: { title: 'Servicios & Amenities', subtitle: 'Todo lo que necesitás para una estadía perfecta' },
            gallery: { title: 'Galería', subtitle: 'Conocé nuestros espacios' },
            location: { title: 'Nuestra Ubicación', contact: 'Contacto', address: 'Dirección', phone: 'Teléfono', email: 'Email', social: 'Redes Sociales' },
            cta: { heading: '¿Listo para tu aventura?', subtitle: 'Reservá ahora y viví una experiencia inolvidable', btn: 'Ver disponibilidad' },
            footer: { nav: 'Navegación', contact: 'Contacto', rights: 'Todos los derechos reservados.' },
            whatsapp: 'Hola! Quiero consultar disponibilidad',
            bk: {
                checkin: 'Llegada', checkout: 'Salida', guests: 'Huéspedes',
                guest_one: 'persona', guest_many: 'personas',
                night_one: 'noche', night_many: 'noches',
                submit: 'Continuar en WhatsApp',
                note: 'Completá los datos y te llevamos a WhatsApp con la consulta ya armada.',
                err_missing: 'Elegí las fechas para continuar.',
                err_order: 'La fecha de salida tiene que ser posterior a la de llegada.',
                err_past: 'La fecha de llegada no puede ser anterior a hoy.'
            },
            steps: {
                title: 'Tres pasos y estás adentro', subtitle: 'Reservar directo es así de simple',
                s1t: 'Escribinos', s1d: 'Mandanos un WhatsApp con tus fechas y cuántos son.',
                s2t: 'Te confirmamos', s2d: 'Te respondemos al toque con disponibilidad y precio real.',
                s3t: 'Empaquetá y vení', s3d: 'Sin comisiones ni intermediarios. Directo con nosotros.'
            },
            tst: {
                title: 'Lo que dicen nuestros huéspedes', reviews_word: 'reseñas en Google',
                reviews_btn: 'Ver reseñas en Google', share: 'Compartir'
            }
        },
        en: {
            nav: { about: 'The Lodge', services: 'Services', gallery: 'Gallery', location: 'Location', book: 'Book Now' },
            hero: { cta: 'Book Now', more: 'Learn More' },
            about: { eyebrow: 'About us', custom2: 'Personalized Attention', custom3: 'Cozy, Homey Feel', def2: "We help you plan your stay.", def3: 'Warm and welcoming spaces.' },
            services: { title: 'Services & Amenities', subtitle: 'Everything you need for a perfect stay' },
            gallery: { title: 'Gallery', subtitle: 'Discover our spaces' },
            location: { title: 'Our Location', contact: 'Contact', address: 'Address', phone: 'Phone', email: 'Email', social: 'Social Media' },
            cta: { heading: 'Ready for your adventure?', subtitle: 'Book now and experience something unforgettable', btn: 'Check availability' },
            footer: { nav: 'Navigation', contact: 'Contact', rights: 'All rights reserved.' },
            whatsapp: 'Hi! I\'d like to check availability',
            bk: {
                checkin: 'Check-in', checkout: 'Check-out', guests: 'Guests',
                guest_one: 'guest', guest_many: 'guests',
                night_one: 'night', night_many: 'nights',
                submit: 'Continue on WhatsApp',
                note: "Fill in your details and we'll open WhatsApp with your inquiry ready to send.",
                err_missing: 'Please choose your dates to continue.',
                err_order: 'Check-out must be after check-in.',
                err_past: "Check-in can't be before today."
            },
            steps: {
                title: "Three steps and you're in", subtitle: 'Booking direct is that simple',
                s1t: 'Message us', s1d: 'Send us a WhatsApp with your dates and group size.',
                s2t: 'We confirm', s2d: "We reply right away with availability and real prices.",
                s3t: 'Pack up and come', s3d: 'No fees, no middlemen. Straight with us.'
            },
            tst: {
                title: 'What our guests say', reviews_word: 'Google reviews',
                reviews_btn: 'See Google reviews', share: 'Share'
            }
        }
    };

    function t(key) {
        var keys = key.split('.');
        var val = I18N[currentLang];
        for (var i = 0; i < keys.length; i++) {
            if (val && val[keys[i]] !== undefined) val = val[keys[i]];
            else return key;
        }
        return val;
    }

    async function loadConfig() {
        if (window.__CONFIG) return window.__CONFIG;
        try {
            var resp = await fetch('config.json');
            if (!resp.ok) throw new Error('not found');
            return await resp.json();
        } catch (e) {
            document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:Poppins,sans-serif;text-align:center;padding:40px;"><div><h1 style="font-family:Montserrat,sans-serif;margin-bottom:16px;">Error: config no encontrado</h1><p style="color:#666;">Asegurate de que config-data.js o config.json estén en la misma carpeta que index.html.<br><span style="font-size:0.9em;">(Make sure config-data.js or config.json are in the same folder as index.html.)</span></p></div></div>';
            return null;
        }
    }

    function deepMerge(base, override) {
        if (!override) return base;
        var result = Array.isArray(base) ? base.slice() : Object.assign({}, base);
        Object.keys(override).forEach(function(key) {
            if (override[key] && typeof override[key] === 'object' && !Array.isArray(override[key]) &&
                base[key] && typeof base[key] === 'object' && !Array.isArray(base[key])) {
                result[key] = deepMerge(base[key], override[key]);
            } else {
                result[key] = override[key];
            }
        });
        return result;
    }

    function getLocalizedConfig(c) {
        if (currentLang === 'es' || !c.i18n || !c.i18n[currentLang]) return c;
        return deepMerge(c, c.i18n[currentLang]);
    }

    function setText(id, text) {
        var el = document.getElementById(id);
        if (el && text !== undefined && text !== null) el.textContent = text;
    }

    function setAttr(id, attr, val) {
        var el = document.getElementById(id);
        if (el && val) el.setAttribute(attr, val);
    }

    function render(cRaw) {
        if (!cRaw) return;
        var c = getLocalizedConfig(cRaw);
        config = c;
        var b = c.business || {};
        var h = c.hero || {};
        var loc = c.location || {};
        var con = c.contact || {};
        var soc = c.social || {};
        var ab = c.about || {};
        var g = c.gallery || {};
        var ft = c.footer || {};
        var am = c.amenities || [];

        var siteName = b.name || '';
        var siteUrl = window.location.origin + '/';

        // El CTA del nav no tiene id de texto propio: se setea directo
        var navCta = document.getElementById('nav-cta');
        if (navCta) navCta.textContent = t('nav.book');

        document.title = siteName;
        setAttr('meta-title', 'content', siteName);
        setText('meta-title', siteName);
        setAttr('meta-description', 'content', (b.description || '').substring(0, 160));
        setAttr('og-title', 'content', siteName);
        setAttr('og-description', 'content', (b.description || '').substring(0, 160));
        setAttr('og-url', 'content', siteUrl);
        setAttr('twitter-title', 'content', siteName);
        setAttr('twitter-description', 'content', (b.description || '').substring(0, 160));

        var heroTitle = h.title_em ? ((h.title_line1 || '') + ' ' + h.title_em + ' ' + (h.title_line2 || '')).trim() : (h.title_line1 || siteName);
        setText('hero-title', heroTitle);
        setText('hero-subtitle', h.subtitle || b.tagline || '');
        setText('hero-cta-text', t('hero.cta'));
        setText('hero-cta-secondary-text', t('hero.more'));

        var logoUrl = c.logo || 'logo.jpg';
        setAttr('nav-logo', 'src', logoUrl);
        setAttr('nav-logo', 'alt', siteName);
        setAttr('footer-logo', 'src', logoUrl);
        setAttr('footer-logo', 'alt', siteName);

        var faviconLink = document.querySelector('link[rel="icon"]');
        if (faviconLink) faviconLink.href = logoUrl;

        if (h.poster) {
            var heroStyle = document.createElement('style');
            heroStyle.textContent = '.hero::before { background: linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.5)), url("' + h.poster + '") !important; background-size: cover !important; background-position: center !important; }';
            document.head.appendChild(heroStyle);
        }

        var heroSection = document.getElementById('hero');
        if (heroSection && h.video) {
            var existingVideo = heroSection.querySelector('video');
            if (!existingVideo) {
                var vid = document.createElement('video');
                vid.muted = true;
                vid.loop = true;
                vid.autoplay = true;
                vid.playsInline = true;
                vid.src = h.video;
                if (h.poster) vid.poster = h.poster;
                vid.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:-1;';
                heroSection.prepend(vid);
                var vidStyle = document.createElement('style');
                vidStyle.textContent = '.hero::before { display: none !important; }';
                document.head.appendChild(vidStyle);
            }
        }

        if (soc.instagram) {
            var navIg = document.getElementById('nav-instagram');
            if (navIg) {
                navIg.setAttribute('href', soc.instagram);
                var _ic = navIg.querySelector('i');
                if (/instagram\.com/.test(soc.instagram)) { if (_ic) _ic.className = 'fab fa-instagram'; navIg.setAttribute('aria-label', 'Instagram'); }
                else if (/google\.com\/maps|maps\.google/.test(soc.instagram) || soc.place_url) { if (_ic) _ic.className = 'fas fa-map-marker-alt'; navIg.setAttribute('aria-label', 'Google Maps'); }
                else { if (_ic) _ic.className = 'fas fa-globe'; navIg.setAttribute('aria-label', 'Sitio web'); }
            }
        }

        var phoneDigits = (con.whatsapp || '').replace(/\D/g, '');
        var waUrl = phoneDigits ? 'https://wa.me/' + phoneDigits + '?text=' + encodeURIComponent(t('whatsapp')) : '#';
        setAttr('whatsapp-float', 'href', waUrl);
        if (!phoneDigits) {
            var wf = document.getElementById('whatsapp-float');
            if (wf) wf.style.display = 'none';
        }

        if (con.email) {
            setAttr('hero-cta-primary', 'href', 'mailto:' + con.email);
        }

        setText('about-title', ab.title || 'Bienvenidos a ' + siteName);
        setText('about-subtitle', ab.description || b.description || '');
        setText('about-heading-1', ab.title || t('about.eyebrow'));
        setText('about-paragraph-1', (ab.paragraphs && ab.paragraphs[0]) || b.description || '');
        setText('about-heading-2', t('about.custom2'));
        setText('about-paragraph-2', (ab.paragraphs && ab.paragraphs[1]) || t('about.def2'));
        setText('about-heading-3', t('about.custom3'));
        setText('about-paragraph-3', (ab.paragraphs && ab.paragraphs[2]) || t('about.def3'));

        var photo1 = (ab.photos && ab.photos[0]) || { src: 'fotos/foto-01.jpg', alt: siteName };
        var photo2 = (ab.photos && ab.photos[1]) || photo1;
        var photo3 = (ab.photos && ab.photos[2]) || photo1;

        setAttr('about-photo-1', 'src', photo1.src);
        setAttr('about-photo-1', 'alt', photo1.alt || '');
        setAttr('about-photo-2', 'src', photo2.src);
        setAttr('about-photo-2', 'alt', photo2.alt || '');
        setAttr('about-photo-3', 'src', photo3.src);
        setAttr('about-photo-3', 'alt', photo3.alt || '');

        setText('services-title', t('services.title'));
        setText('services-subtitle', t('services.subtitle'));

        var servicesGrid = document.getElementById('services-grid');
        if (servicesGrid && am.length > 0) {
            var ICONS = {
                wifi: 'fa-wifi', kitchen: 'fa-utensils', pool: 'fa-swimming-pool', parking: 'fa-parking',
                tv: 'fa-tv', grill: 'fa-fire', breakfast: 'fa-coffee', ac: 'fa-snowflake',
                laundry: 'fa-tshirt', luggage: 'fa-suitcase', tour: 'fa-hiking', transfer: 'fa-shuttle-van',
                bar: 'fa-cocktail', garden: 'fa-leaf', heating: 'fa-fire', lockers: 'fa-lock',
                desk: 'fa-laptop', plugs: 'fa-plug', microwave: 'fa-microwave', fridge: 'fa-snowflake',
                common: 'fa-couch', bicycle: 'fa-bicycle', coffee: 'fa-mug-hot', reception: 'fa-bell-concierge',
                bed: 'fa-bed', sun: 'fa-sun', pin: 'fa-map-marker-alt', air: 'fa-wind'
            };
            servicesGrid.innerHTML = am.map(function(a) {
                return '<div class="service-item"><i class="fas ' + (ICONS[a.icon] || 'fa-check') + '"></i><h4>' + (a.title || '') + '</h4><p>' + (a.description || '') + '</p></div>';
            }).join('');
        }

        setText('gallery-title', t('gallery.title'));
        setText('gallery-subtitle', t('gallery.subtitle'));
        renderGallery(g.images || []);

        setText('location-title', t('location.title'));
        setText('location-subtitle', loc.description || ('En el corazón de ' + (loc.city || '')));
        setText('location-label-contact', t('location.contact'));
        setText('location-label-address', t('location.address'));
        setText('location-label-phone', t('location.phone'));
        setText('location-label-email', t('location.email'));
        setText('location-label-social', t('location.social'));
        setText('location-address', loc.address || '');
        setText('location-phone', con.phone || con.whatsapp || '');
        setText('location-email', con.email || '');

        // Botón de reseñas de Google (ficha real del lugar en Maps)
        var reviewsBtn = document.getElementById('location-reviews-btn');
        if (reviewsBtn) {
            var q = loc.map_query || (loc.address ? loc.address + ', ' + (loc.city || '') : '');
            if (q) {
                reviewsBtn.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
                reviewsBtn.innerHTML = '<i class="fab fa-google"></i> ' + t('tst.reviews_btn');
                reviewsBtn.style.display = '';
            } else {
                reviewsBtn.style.display = 'none';
            }
        }

        // Testimonios: reales (citas textuales) o demo editables
        setText('tst-title', t('tst.title'));
        var shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            setText('share-btn', t('tst.share'));
            shareBtn.onclick = function() {
                if (navigator.share) {
                    navigator.share({title: document.title, url: window.location.href}).catch(function(){});
                } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert(currentLang === 'en' ? 'Link copied!' : 'Link copiado!');
                }
            };
        }
        var tstList = c.testimonials || [];
        var tstGrid = document.getElementById('tst-grid');
        var tstSection = document.getElementById('testimonios');
        if (tstGrid && tstSection) {
            if (tstList.length) {
                tstSection.style.display = '';
                tstGrid.innerHTML = tstList.map(function(rv) {
                    var st = rv.rating || 5;
                    return '<div class="tst-card">' +
                        '<div class="tst-stars">' + '★'.repeat(st) + '☆'.repeat(5 - st) + '</div>' +
                        '<p class="tst-text">"' + (rv.text || '') + '"</p>' +
                        '<div class="tst-author">— ' + (rv.author || '') + '</div>' +
                        '</div>';
                }).join('');
            } else {
                tstSection.style.display = 'none';
            }
        }
        var tstMetaEl = document.getElementById('testimonials-meta');
        if (tstMetaEl) {
            var tm = c.testimonials_meta || {};
            if (tm.source === 'google' && tm.rating && tm.count) {
                tstMetaEl.textContent = '★ ' + tm.rating + ' · ' + tm.count + ' ' + t('tst.reviews_word');
                tstMetaEl.hidden = false;
            } else {
                tstMetaEl.hidden = true;
            }
        }

        // Pasos para reservar
        setText('steps-title', t('steps.title'));
        setText('steps-subtitle', t('steps.subtitle'));
        setText('step1-title', t('steps.s1t'));
        setText('step1-text', t('steps.s1d'));
        setText('step2-title', t('steps.s2t'));
        setText('step2-text', t('steps.s2d'));
        setText('step3-title', t('steps.s3t'));
        setText('step3-text', t('steps.s3d'));

        var mapEl = document.getElementById('location-map');
        if (mapEl && loc.map_embed) {
            mapEl.innerHTML = '<iframe src="' + loc.map_embed + '" width="100%" height="100%" style="border:0; border-radius: 20px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Mapa de ubicación"></iframe>';
        } else if (mapEl && loc.map_query) {
            var q = encodeURIComponent(loc.map_query);
            mapEl.innerHTML = '<iframe src="https://maps.google.com/maps?q=' + q + '&t=&z=15&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style="border:0; border-radius: 20px;" allowfullscreen="" loading="lazy" title="Mapa de ubicación"></iframe>';
        }

        var socialHtml = [];
        if (soc.instagram) {
            var igHref = soc.instagram;
            var igIcon, igLabel;
            if (/instagram\.com/.test(igHref)) { igIcon = 'fa-instagram'; igLabel = 'Instagram'; }
            else if (/google\.com\/maps|maps\.google/.test(igHref) || soc.place_url) { igIcon = 'fa-map-marker-alt'; igLabel = 'Google Maps'; }
            else { igIcon = 'fa-globe'; igLabel = 'Sitio web'; }
            socialHtml.push('<a href="' + igHref + '" target="_blank" rel="noopener noreferrer"><i class="fab ' + igIcon + '"></i> ' + igLabel + '</a>');
        }
        if (soc.facebook) socialHtml.push('<a href="' + soc.facebook + '" target="_blank" rel="noopener noreferrer"><i class="fab fa-facebook"></i> Facebook</a>');
        if (soc.tiktok) socialHtml.push('<a href="' + soc.tiktok + '" target="_blank" rel="noopener noreferrer"><i class="fab fa-tiktok"></i> TikTok</a>');
        setHTML('social-links', socialHtml.join(''));
        setHTML('footer-social', socialHtml.join(''));

        setText('cta-heading', t('cta.heading'));
        setText('cta-subtitle', t('cta.subtitle'));
        setText('cta-btn-text', t('cta.btn'));
        if (phoneDigits) {
            setAttr('cta-btn', 'href', waUrl);
        } else if (con.email) {
            setAttr('cta-btn', 'href', 'mailto:' + con.email);
        }

        var bkBar = document.getElementById('booking-bar');
        if (bkBar) {
            if (!phoneDigits) {
                bkBar.style.display = 'none';
            } else {
                bkBar.style.display = '';
                setText('bk-label-checkin', t('bk.checkin'));
                setText('bk-label-checkout', t('bk.checkout'));
                setText('bk-label-guests', t('bk.guests'));
                setText('bk-submit-text', t('bk.submit'));
                setText('bk-note', t('bk.note'));
                var sel = document.getElementById('bk-guests');
                if (sel && !sel.options.length) {
                    for (var gi = 1; gi <= 9; gi++) {
                        var opt = document.createElement('option');
                        opt.value = gi;
                        opt.textContent = gi;
                        sel.appendChild(opt);
                    }
                    var optPlus = document.createElement('option');
                    optPlus.value = '10';
                    optPlus.textContent = '+9';
                    sel.appendChild(optPlus);
                }
                if (sel && !sel.value) sel.value = '2';
                var isoToday = function(d) {
                    return d.getFullYear() + '-' +
                        ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
                        ('0' + d.getDate()).slice(-2);
                };
                var ciInput = document.getElementById('bk-checkin');
                var coInput = document.getElementById('bk-checkout');
                var now = new Date();
                if (ciInput) ciInput.min = isoToday(now);
                if (coInput) coInput.min = isoToday(now);
            }
        }

        setText('nav-link-about', t('nav.about'));
        setText('nav-link-services', t('nav.services'));
        setText('nav-link-gallery', t('nav.gallery'));
        setText('nav-link-location', t('nav.location'));
        setText('mob-link-about', t('nav.about'));
        setText('mob-link-services', t('nav.services'));
        setText('mob-link-gallery', t('nav.gallery'));
        setText('mob-link-location', t('nav.location'));
        setText('footer-nav-title', t('footer.nav'));
        setText('footer-contact-title', t('footer.contact'));
        setText('footer-link-about', t('nav.about'));
        setText('footer-link-services', t('nav.services'));
        setText('footer-link-gallery', t('nav.gallery'));
        setText('footer-link-location', t('nav.location'));
        setText('footer-description', ft.description || b.description || '');
        setText('footer-brand-name', siteName);
        setText('footer-rights', t('footer.rights'));
        setText('currentYear', new Date().getFullYear().toString());

        var footerContact = document.getElementById('footer-contact');
        if (footerContact) {
            var fc = [];
            var phoneRaw = con.phone || con.whatsapp || '';
            var phoneClean = phoneRaw.replace(/\D/g, '');
            if (phoneClean) fc.push('<li><a href="tel:' + phoneClean + '"><i class="fas fa-phone"></i> ' + phoneRaw + '</a></li>');
            if (con.email) fc.push('<li><a href="mailto:' + con.email + '"><i class="fas fa-envelope"></i> ' + con.email + '</a></li>');
            if (loc.city) fc.push('<li><a href="#location"><i class="fas fa-map-marker-alt"></i> ' + loc.city + '</a></li>');
            footerContact.innerHTML = fc.join('');
        }

        if (c.schema_ld) {
            var schemaStr = JSON.stringify(c.schema_ld).replace(/<\/script/g, '<\\/script');
            var schemaEl = document.getElementById('schema-json');
            if (schemaEl) schemaEl.textContent = schemaStr;
        }

        initInteractions();
    }

    function setHTML(id, html) {
        var el = document.getElementById(id);
        if (el && html !== undefined && html !== null) el.innerHTML = html;
    }

    function renderGallery(images) {
        var slidesEl = document.getElementById('gallery-slides');
        var dotsEl = document.getElementById('gallery-dots');
        var thumbsEl = document.getElementById('gallery-thumbs');
        if (!slidesEl || images.length === 0) return;

        slidesEl.innerHTML = images.map(function(img, i) {
            return '<div class="carousel-slide' + (i === 0 ? ' active' : '') + '"><img src="' + img.src + '" alt="' + (img.alt || '') + '"></div>';
        }).join('');

        dotsEl.innerHTML = images.map(function(_, i) {
            return '<button class="carousel-dot' + (i === 0 ? ' active' : '') + '" data-slide="' + i + '" aria-label="Ir a imagen ' + (i + 1) + '"></button>';
        }).join('');

        thumbsEl.innerHTML = images.map(function(img, i) {
            return '<div class="carousel-thumb' + (i === 0 ? ' active' : '') + '" data-slide="' + i + '"><img loading="lazy" src="' + img.src + '" alt="' + (img.alt || '') + '"></div>';
        }).join('');

        var counter = document.getElementById('gallery-counter');
        if (counter) counter.textContent = '1 / ' + images.length;

        galleryIndex = 0;
        setupCarousel('gallery', images.length);
    }

    function setupCarousel(prefix, total) {
        var prevBtn = document.getElementById(prefix + '-prev');
        var nextBtn = document.getElementById(prefix + '-next');
        var slides = document.querySelectorAll('#' + prefix + '-carousel .carousel-slide');
        var dots = document.querySelectorAll('#' + prefix + '-dots .carousel-dot');
        var thumbs = document.querySelectorAll('#' + prefix + '-thumbs .carousel-thumb');
        var counter = document.getElementById(prefix + '-counter');

        function goTo(idx) {
            if (idx < 0) idx = total - 1;
            if (idx >= total) idx = 0;
            galleryIndex = idx;
            slides.forEach(function(s, i) { s.classList.toggle('active', i === idx); });
            dots.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
            thumbs.forEach(function(th, i) { th.classList.toggle('active', i === idx); });
            if (counter) counter.textContent = (idx + 1) + ' / ' + total;
        }

        if (prevBtn) prevBtn.addEventListener('click', function() { goTo(galleryIndex - 1); });
        if (nextBtn) nextBtn.addEventListener('click', function() { goTo(galleryIndex + 1); });
        dots.forEach(function(d) { d.addEventListener('click', function() { goTo(parseInt(d.dataset.slide)); }); });
        thumbs.forEach(function(th) { th.addEventListener('click', function() { goTo(parseInt(th.dataset.slide)); }); });
    }

    function initTheme() {
        var saved = localStorage.getItem('theme');
        if (saved === 'dark' || saved === 'light') {
            document.documentElement.classList.toggle('dark', saved === 'dark');
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        }
        updateThemeIcon();
    }

    function updateThemeIcon() {
        var btn = document.getElementById('theme-toggle');
        if (!btn) return;
        var icon = btn.querySelector('i');
        if (!icon) return;
        var isDark = document.documentElement.classList.contains('dark');
        if (icon.className !== (isDark ? 'fas fa-sun' : 'fas fa-moon')) {
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
        btn.setAttribute('aria-label', currentLang === 'en'
            ? (isDark ? 'Switch to light mode' : 'Switch to dark mode')
            : (isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'));
    }

    function toggleTheme() {
        document.documentElement.classList.toggle('dark');
        var isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon();
    }

    function handleBookingSubmit(e) {
        e.preventDefault();
        var errEl = document.getElementById('bk-error');
        var ciInput = document.getElementById('bk-checkin');
        var coInput = document.getElementById('bk-checkout');
        if (!config || !config.contact || !errEl) return;
        var digits = (config.contact.whatsapp || '').replace(/\D/g, '');
        if (!digits) return;
        if (!ciInput.value || !coInput.value) {
            errEl.textContent = t('bk.err_missing');
            errEl.hidden = false;
            return;
        }
        var ci = new Date(ciInput.value + 'T12:00:00');
        var co = new Date(coInput.value + 'T12:00:00');
        var today = new Date();
        today.setHours(12, 0, 0, 0);
        if (co <= ci) {
            errEl.textContent = t('bk.err_order');
            errEl.hidden = false;
            return;
        }
        if (ci < today) {
            errEl.textContent = t('bk.err_past');
            errEl.hidden = false;
            return;
        }
        errEl.hidden = true;
        var sel = document.getElementById('bk-guests');
        var rawGuests = parseInt(sel && sel.value, 10) || 2;
        var guests = rawGuests >= 10 ? '+9' : String(rawGuests);
        var nights = Math.round((co - ci) / 86400000);
        var fmt = function(d) {
            return ('0' + d.getDate()).slice(-2) + '/' +
                ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
        };
        var gWord = rawGuests === 1 ? t('bk.guest_one') : t('bk.guest_many');
        var nWord = nights === 1 ? t('bk.night_one') : t('bk.night_many');
        var name = (config.business || {}).short_name || (config.business || {}).name || '';
        var msg = currentLang === 'en'
            ? 'Hi ' + name + "! I'd like to book from " + fmt(ci) + ' to ' + fmt(co) + ' (' + nights + ' ' + nWord + ') for ' + guests + ' ' + gWord + '. Is it available?'
            : 'Hola ' + name + '! Quiero reservar del ' + fmt(ci) + ' al ' + fmt(co) + ' (' + nights + ' ' + nWord + ') para ' + guests + ' ' + gWord + '. ¿Hay disponibilidad?';
        window.open('https://wa.me/' + digits + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    }

    function initInteractions() {
        var overlay = document.querySelector('.mobile-menu-overlay');
        var mobileMenu = document.querySelector('.mobile-menu');
        var menuToggle = document.querySelector('.menu-toggle');
        var menuClose = document.querySelector('.mobile-menu-close');

        function closeMenu() {
            if (overlay) overlay.classList.remove('active');
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
        }

        if (menuToggle) {
            menuToggle.addEventListener('click', function() {
                overlay && overlay.classList.add('active');
                mobileMenu && mobileMenu.classList.add('active');
                menuToggle.setAttribute('aria-expanded', 'true');
            });
        }
        if (menuClose) menuClose.addEventListener('click', closeMenu);
        if (overlay) overlay.addEventListener('click', closeMenu);

        if (mobileMenu) {
            mobileMenu.querySelectorAll('a').forEach(function(a) { a.addEventListener('click', closeMenu); });
        }

        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll);
        onScroll();

        document.querySelectorAll('.lang-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                currentLang = btn.dataset.lang;
                localStorage.setItem('c_lang', currentLang);
                document.querySelectorAll('.lang-btn').forEach(function(b) { b.classList.toggle('active', b === btn); });
                if (config) render(config);
            });
        });
        // Estado inicial del selector de idioma segun lo persistido
        document.querySelectorAll('.lang-btn').forEach(function(b) {
            b.classList.toggle('active', b.dataset.lang === currentLang);
        });

        var themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.removeEventListener('click', toggleTheme);
            themeBtn.addEventListener('click', toggleTheme);
        }

        if (!window.__bkBound) {
            window.__bkBound = true;
            var bkForm = document.getElementById('booking-form');
            if (bkForm) bkForm.addEventListener('submit', handleBookingSubmit);
        }
    }

    function onScroll() {
        var header = document.getElementById('site-header');
        if (header) header.classList.toggle('scrolled', window.scrollY > 50);
    }

    initTheme();
    loadConfig().then(function(c) { if (c) render(c); });
})();
