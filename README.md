
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>On-site Engraving System</title>
    <link rel="stylesheet" href="/styles.css">
    <style>
        /* Disable double-tap zoom for better UX */
        * {
            touch-action: manipulation;
            -webkit-user-select: none;
            user-select: none;
        }

        input, textarea {
            -webkit-user-select: text;
            user-select: text;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
            20%, 40%, 60%, 80% { transform: translateX(8px); }
        }

        .shake-animation {
            animation: shake 0.5s ease-in-out;
        }
    </style>
</head>
<body>
    <header>
        <img id="eventLogo" src="" alt="Event Logo" fetchpriority="high" loading="eager" decoding="async" onerror="this.style.display='none'">
        <h1 id="eventName">Event Name</h1>
    </header>

    <main>
        <!-- Legacy static display image — only used when `productCustomization`
             is disabled. Visibility is controlled by the CSS default
             (`display:none` in styles.css) plus the `updateEventDisplay()`
             call flipping it to flex once the config is applied. When the
             product canvas IS active, the server injects
             `#displayImageContainer{display:none!important}` so this never
             flashes for a frame before JS runs. -->
        <div id="displayImageContainer" class="slide-up animation-delay-1">
            <img id="displayImage" alt="Display Image" fetchpriority="high" loading="eager" decoding="async" onerror="this.style.display='none'">
        </div>

        <!-- Product Canvas — host for the inline SVG composition plus the
             laser-engraving overlay <canvas>. Hidden by default (CSS rule
             in styles.css). When product customization is active the server
             injects an `aspect-ratio` reservation into <head> so the form
             below doesn't jump down once the SVG mounts. -->
        <div id="productCanvasContainer" class="slide-up animation-delay-1">
            <div id="productCanvas"></div>
        </div>

        <!-- SVG Selector Container (for multiple SVG options) -->
        <div id="svgSelectorContainer" class="slide-up animation-delay-1" style="display: none;">
            <!-- SVG selectors will be dynamically generated here -->
        </div>

        <!-- Form View -->
        <form id="engravingForm" class="slide-up animation-delay-2">
            <!-- Text Customization Toggle (shown when collapsed) -->
            <button type="button" id="textCustomizationToggle" class="svg-selector-toggle">
                ▶ Text Options
            </button>

            <div id="fieldsContainer">
                <!-- Fields will be dynamically generated here -->
            </div>
            <div class="buttons-container slide-up animation-delay-3">
                <button type="button" id="lookupButton" style="display: none;">History</button>
                <button type="button" id="submitButton">Submit</button>
            </div>
        </form>
    </main>

    <!-- Ticket container (empty div for ticket component) -->
    <div id="ticketContainer"></div>

    <footer>
        <a href="/businesscard" style="text-decoration: none; color: inherit; display: block; width: 100%; height: 100%;">
            <p>&copy; {{TENANT_YEAR}} {{TENANT_NAME}}</p>
        </a>
    </footer>

    <script>
        // =================================================================
        // Submission-page bootstrap.
        // =================================================================
        // Fast path: `window.__EVENT_CONFIG__` is server-injected before
        // this script runs, so we can render the form, brand colors, and
        // canvas hooks synchronously without any fetch round-trip. Any
        // older build (or an unexpected SSR failure) still works because
        // we fall back to fetching `/config/<eventName>`.
        //
        // Heavy, non-critical scripts (ticket view, QR codes, modals) are
        // loaded on-demand when the user interacts with them, so the
        // initial payload stays lean.

        // ===== GLOBAL VARIABLES =====
        // eventName will be injected by server
        let generatedUniqueCode = null;
        let submissionData = null;
        let pendingSubmission = null;
        let ticketComponent = null;
        let lookupModal = null;
        let limitExceededModal = null;
        let eventQuantityLimit = 1000;
        let eventScannerMode = 'hid'; // Default to HID mode

        // ===== CUSTOMIZATION MODE CONTROL =====
        let customizationMode = 'both'; // 'text' | 'graphics' | 'both' | 'exclusive'
        let activeCustomization = null; // 'text' | 'graphics' | null

        function setCustomizationMode(mode) {
            customizationMode = mode;
        }

        function activateTextCustomization() {
            if (customizationMode !== 'exclusive') return;
            if (activeCustomization === 'text') return;

            activeCustomization = 'text';
            expandTextFields();
            collapseGraphicsSelector();
            if (window.setGraphicsVisibility) window.setGraphicsVisibility(false);
            if (window.setTextVisibility) window.setTextVisibility(true);
        }

        function activateGraphicsCustomization() {
            if (customizationMode !== 'exclusive') return;
            if (activeCustomization === 'graphics') return;

            activeCustomization = 'graphics';
            collapseTextFields();
            expandGraphicsSelector();
            if (window.setTextVisibility) window.setTextVisibility(false);
            if (window.setGraphicsVisibility) window.setGraphicsVisibility(true);
        }

        function collapseTextFields() {
            const container = document.getElementById('fieldsContainer');
            const form = document.getElementById('engravingForm');
            if (container && form) {
                container.classList.add('collapsed');
                form.classList.add('collapsed');
            }
        }

        function expandTextFields() {
            const container = document.getElementById('fieldsContainer');
            const form = document.getElementById('engravingForm');
            if (container && form) {
                container.classList.remove('collapsed');
                form.classList.remove('collapsed');
            }
        }

        function collapseGraphicsSelector() {
            if (window.collapseSvgSelector) window.collapseSvgSelector();
        }

        function expandGraphicsSelector() {
            if (window.expandSvgSelector) window.expandSvgSelector();
        }

        // ===== LOCALSTORAGE SUBMISSION TRACKING =====
        const SubmissionTracker = {
            // Get all submissions for the current event
            getSubmissions() {
                const key = `event_submissions_${eventName}`;
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : [];
            },

            // Add a new submission
            addSubmission(ticketCode, submissionData) {
                const submissions = this.getSubmissions();
                submissions.push({
                    ticketCode,
                    submissionData,
                    timestamp: Date.now()
                });
                const key = `event_submissions_${eventName}`;
                localStorage.setItem(key, JSON.stringify(submissions));
            },

            // Get count of submissions
            getCount() {
                return this.getSubmissions().length;
            },

            // Check if limit is exceeded
            isLimitExceeded(limit) {
                return this.getCount() >= limit;
            },

            // Clear all submissions (for testing purposes)
            clear() {
                const key = `event_submissions_${eventName}`;
                localStorage.removeItem(key);
            }
        };

        // ===== DYNAMIC HEADER HEIGHT ADJUSTMENT =====
        function adjustHeaderHeight() {
            const header = document.querySelector('header');
            if (header) {
                const headerHeight = header.offsetHeight;
                // Set CSS custom property instead of inline style
                document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
            }
        }

        // =================================================================
        // On-demand script loader with retry + exponential backoff.
        //
        // Why retries:
        //   On flaky/low-bandwidth connections (in-venue cellular, bad
        //   guest Wi-Fi, 3G in a stadium) a single TCP stall will reject
        //   `<script>.onerror` with no useful detail. One user-visible
        //   retry is the difference between "the page just worked" and
        //   "the Submit button is broken for everyone in section B".
        //
        // Why we de-dupe via a Map:
        //   The warmup path (focus/pointerdown/idle) and the submit path
        //   both race to load the ticket bundle. Returning the same
        //   in-flight Promise keeps us at exactly one network request.
        //
        // Why `crossorigin` is NOT set:
        //   Every URL we load is same-origin; setting `crossorigin=""`
        //   would tell the browser to issue a CORS preflight and
        //   invalidate the matching `<link rel="preload">` hint (the
        //   preload must use the same credentials mode as the runtime
        //   fetch — mismatches void the preload and re-download the
        //   bytes). Keep both sides plain/anonymous.
        // =================================================================
        const _scriptCache = new Map();
        function loadScript(src, { retries = 2, retryDelayMs = 400 } = {}) {
            if (_scriptCache.has(src)) return _scriptCache.get(src);

            const attemptOnce = () => new Promise((resolve, reject) => {
                const s = document.createElement('script');
                s.src = src;
                s.async = true;
                s.onload = () => resolve();
                s.onerror = () => reject(new Error(`Failed to load ${src}`));
                document.head.appendChild(s);
            });

            const attemptWithRetry = async () => {
                let lastErr;
                for (let i = 0; i <= retries; i++) {
                    try {
                        await attemptOnce();
                        return;
                    } catch (err) {
                        lastErr = err;
                        if (i === retries) break;
                        // Exponential backoff with jitter. Cap at 4s so
                        // the user never feels "stuck" — the caller has
                        // its own UI state for slow loads.
                        const delay = Math.min(4000, retryDelayMs * 2 ** i)
                                    + Math.floor(Math.random() * 200);
                        await new Promise(r => setTimeout(r, delay));
                    }
                }
                throw lastErr;
            };

            const p = attemptWithRetry().catch(err => {
                // Invalidate the cache on terminal failure so a later
                // caller (e.g. user clicks Submit again after coming
                // back online) can retry from scratch.
                _scriptCache.delete(src);
                throw err;
            });
            _scriptCache.set(src, p);
            return p;
        }

        // Idle-callback shim for Safari <16.4 and older Firefoxes that
        // don't implement it. The 1-argument form (no options) is the
        // only shape we use, so this tight polyfill is enough.
        const _whenIdle = window.requestIdleCallback
            ? (cb) => window.requestIdleCallback(cb, { timeout: 2000 })
            : (cb) => setTimeout(cb, 200);

        // ===== INITIALIZATION =====
        // We don't wait for DOMContentLoaded when we already have
        // `window.__EVENT_CONFIG__` — the DOM above is already parsed by
        // the time this inline script runs, so we can proceed immediately.
        // (The <script> is at the END of <body>, so the skeleton DOM is
        // available here — no querying missing elements.)
        initializePage();

        function initializePage() {
            // Start canvas-script preloading in parallel with everything
            // else. The server has already emitted <link rel="preload">
            // tags for these so the bytes are usually in cache, but
            // kicking off `loadScript` now guarantees we hit the
            // preload-cache before the main thread is free to request
            // them a few hundred ms later.
            const config = window.__EVENT_CONFIG__;
            if (config?.productCustomization?.enabled) {
                // Fire-and-forget: we don't need to await here. The
                // canvas init below awaits the same Promise via the cache.
                void loadScript('/js/laserEngraver.js');
            }

            setupEventListeners();
            setupNetworkMonitoring();
            updateHistoryButtonVisibility();
            adjustHeaderHeight();
            window.addEventListener('resize', adjustHeaderHeight);

            // Apply the config. Prefer the inlined copy; fall back to a
            // fetch only for legacy/non-SSR deployments.
            if (config) {
                applyConfig(config);
            } else {
                fetchConfigWithRetry().then(applyConfig).catch(error => {
                    console.error('Failed to load configuration:', error);
                });
            }

            // Consume the <link rel="preload" as="script"> hint for the
            // ticket bundle at idle. Chromium emits
            //   "… was preloaded using link preload but not used within
            //    a few seconds from the window's load event"
            // when a preload hint isn't consumed within ~3 s. A user who
            // reads the screen before interacting still triggers it.
            // Loading here at idle (after paint, before any long delay)
            // is exactly what the preload is for: the bytes land in the
            // preload cache during HTML parse, and the <script> element
            // below reuses them without a second network trip.
            _whenIdle(() => {
                ensureTicketBundle().catch(() => {
                    // No user-visible error: the warmup path is best-
                    // effort. The Submit flow will retry on demand,
                    // with its own loud error UI if that also fails.
                });
            });
        }

        // =================================================================
        // Config fetch with bounded retries. Used only when SSR did not
        // inline `window.__EVENT_CONFIG__` (legacy deploys, CDN cache
        // misses, edge cases). Same backoff shape as `loadScript` so
        // behavior stays predictable across the app.
        // =================================================================
        async function fetchConfigWithRetry(retries = 2) {
            let lastErr;
            for (let i = 0; i <= retries; i++) {
                try {
                    const r = await fetch(`/config/${eventName}`, {
                        // `no-cache` means "revalidate with the origin";
                        // it still serves from HTTP cache if 304. This
                        // is what we want — admin edits propagate on
                        // reload without forcing a full re-download.
                        cache: 'no-cache',
                    });
                    if (!r.ok) throw new Error(`HTTP ${r.status}`);
                    return await r.json();
                } catch (err) {
                    lastErr = err;
                    if (i === retries) break;
                    await new Promise(res => setTimeout(res, 400 * 2 ** i));
                }
            }
            throw lastErr;
        }

        // ===== HISTORY BUTTON VISIBILITY =====
        function updateHistoryButtonVisibility() {
            const historyButton = document.getElementById('lookupButton');
            if (historyButton) {
                // Check if there are any submissions in localStorage
                const hasHistory = SubmissionTracker.getCount() > 0;
                historyButton.style.display = hasHistory ? 'block' : 'none';
            }
        }

        // =================================================================
        // Apply the (server-rendered or fetched) config to the page.
        // Safe to call exactly once per pageview.
        // =================================================================
        function applyConfig(config) {
            eventQuantityLimit = config.quantityLimit || 1000;
            eventScannerMode = config.scannerMode || 'hid';

            updateEventDisplay(config);
            generateFormFields(config);

            if (config.brandColors) {
                applyBrandColors(config.brandColors);
            }

            if (config.productCustomization?.enabled) {
                initializeProductCanvas(config);
            } else {
                setupCustomizationModeHandlers();
            }

            if (config.globalSettings?.darkMode) {
                updateDarkMode(config.globalSettings);
            }

            // Recalculate header height after brand colors/logo may have
            // shifted its layout. One rAF is enough — the image's
            // `fetchpriority="high"` preload means it's usually already
            // decoded by now.
            requestAnimationFrame(adjustHeaderHeight);
        }
        
        // ===== BRAND COLORS =====
        function adjustColorBrightness(color, percent) {
            const hex = color.replace('#', '');
            const adjust = (c) => Math.max(0, Math.min(255, c + (c * percent / 100)));
            const rgb = [0, 2, 4].map(i => Math.round(adjust(parseInt(hex.substr(i, 2), 16))));
            return '#' + rgb.map(c => c.toString(16).padStart(2, '0')).join('');
        }
        
        function applyBrandColors(brandColors) {
            const root = document.documentElement;
            
            if (brandColors.primary) {
                root.style.setProperty('--brand-primary', brandColors.primary);
                root.style.setProperty('--brand-primary-hover', adjustColorBrightness(brandColors.primary, -10));
                root.style.setProperty('--brand-primary-active', adjustColorBrightness(brandColors.primary, -20));
            }
            
            if (brandColors.secondary) {
                root.style.setProperty('--brand-secondary', brandColors.secondary);
                root.style.setProperty('--brand-secondary-hover', adjustColorBrightness(brandColors.secondary, -10));
            }
        }

        // ===== PRODUCT CANVAS INITIALIZATION =====
        // Helper to initialize canvas after scripts load
        function setupCanvasWithConfig(config) {
            const canvas = document.getElementById('productCanvas');
            if (!canvas || !window.initProductCanvas) return;

            // The container is already sized (server injected an aspect-ratio
            // CSS rule in <head>) so no `style.display = ''` fiddling needed.
            // Initialize canvas. `config.displayImage.url` is the same bytes
            // the preload tag fetches (proxied if cross-origin) so the
            // canvas's `<image>` element reuses the preloaded response and
            // does NOT trigger a second request.
            window.initProductCanvas(config.productCustomization, canvas, config.fields, config.displayImage.url);

            // Check for multiple customization options
            const hasTextFields = config.fields?.length > 0;
            const hasMultipleSvgOptions = config.productCustomization.svgOverlays?.some(overlay => {
                const urls = overlay.urls || [overlay.url];
                return urls.length > 1 && urls.some(url => url?.trim());
            });

            // Set exclusive mode if both text and graphics are available
            if (hasTextFields && hasMultipleSvgOptions) {
                setCustomizationMode('exclusive');
            }

            // Load SVG selector if needed (wait for SVGs to finish loading)
            if (hasMultipleSvgOptions) {
                window.onSvgsLoaded(() => {
                    loadSvgSelector(config.productCustomization);
                    setupCustomizationModeHandlers();
                });
            } else if (hasTextFields) {
                // Only text fields, setup handlers
                setupCustomizationModeHandlers();
            }
        }

        function initializeProductCanvas(config) {
            // Load the two bundles sequentially — loadScript is cached
            // so if `initializePage()` already kicked off the engraver,
            // this just awaits the same Promise.
            //
            // We intentionally do NOT use `Promise.all` here: the
            // productCanvas.js IIFE checks `global.LaserEngraver` at
            // parse time and bails if the engraver isn't attached yet.
            // Kicking both off in parallel races that check and leads
            // to a silent "productCanvas.js: LaserEngraver is required"
            // error. Sequencing them costs us a few ms in the happy
            // case and eliminates the race entirely.
            loadScript('/js/laserEngraver.js')
                .then(() => loadScript('/js/productCanvas.js'))
                .then(() => {
                    if (typeof window.initProductCanvas !== 'function') {
                        throw new Error('productCanvas.js loaded but window.initProductCanvas is missing');
                    }
                    setupCanvasWithConfig(config);
                })
                .catch(err => {
                    console.error('Failed to initialize product canvas:', err);
                    // Graceful degradation: if the canvas can't load,
                    // fall back to the plain form so the user can still
                    // submit text-only engravings. Hide the empty
                    // canvas slot and show the legacy image if one was
                    // configured.
                    const canvasContainer = document.getElementById('productCanvasContainer');
                    if (canvasContainer) canvasContainer.style.display = 'none';
                    setupCustomizationModeHandlers();
                });
        }
        
        // ===== SVG SELECTOR INITIALIZATION =====
        function loadSvgSelector(customizationConfig) {
            loadScript('/js/svgSelector.js')
                .then(() => {
                    const selectorContainer = document.getElementById('svgSelectorContainer');
                    if (!selectorContainer || !window.initSvgSelector) return;

                    window.initSvgSelector(customizationConfig, selectorContainer, (overlayId, selectedIndex) => {
                        if (window.selectSvgOption) {
                            window.selectSvgOption(overlayId, selectedIndex);
                        }
                        activateGraphicsCustomization();
                    });
                })
                .catch(err => console.error('Failed to load svgSelector.js:', err));
        }
        
        // ===== CUSTOMIZATION MODE HANDLERS =====
        function setupCustomizationModeHandlers() {
            // Text field focus activates text mode
            const inputs = document.querySelectorAll('#fieldsContainer input');
            inputs.forEach(input => {
                input.addEventListener('focus', activateTextCustomization);
            });
            
            // Text toggle button
            const textToggle = document.getElementById('textCustomizationToggle');
            if (textToggle) {
                textToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    activateTextCustomization();
                });
            }
        }

        // ===== DARK MODE FUNCTIONS =====
        function updateDarkMode(config) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.body.classList.remove('dark-mode');
            
            if ((config.darkMode?.auto && prefersDark) || config.darkMode?.enabled) {
                document.body.classList.add('dark-mode');
            }
        }

        // ===== INPUT SANITIZATION =====
        function containsEmoji(text) {
            // Comprehensive emoji detection including keycap numbers (1️⃣, 2️⃣, etc.)
            // This catches: standard emojis, keycap sequences, flags, and all variants
            const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]\uFE0F?\u20E3|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji}[\u200D\uFE0F])/gu;
            return emojiRegex.test(text);
        }

        function removeEmojis(text) {
            // Remove all emojis including keycap sequences
            // First pass: Remove keycap number emojis (like 1️⃣, #️⃣, *️⃣)
            text = text.replace(/[0-9#*]\uFE0F?\u20E3/gu, '');
            
            // Second pass: Remove all other emojis
            const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}]{2}|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji}[\u200D\uFE0F])/gu;
            text = text.replace(emojiRegex, '');
            
            // Third pass: Clean up any remaining emoji-related combining characters
            text = text.replace(/[\u20E3\uFE0F\u200D]/gu, '');
            
            return text;
        }

        function attachEmojiBlocker(inputElement) {
            const showRejectionFeedback = (el) => {
                el.style.borderColor = '#dc3545';
                el.classList.add('shake-animation');
                setTimeout(() => {
                    el.style.borderColor = '';
                    el.classList.remove('shake-animation');
                }, 500);
            };
            
            // Prevent emoji input
            inputElement.addEventListener('input', function() {
                const original = this.value;
                const cleaned = removeEmojis(original);
                if (original !== cleaned) {
                    this.value = cleaned;
                    showRejectionFeedback(this);
                }
            });

            // Handle paste
            inputElement.addEventListener('paste', function(e) {
                e.preventDefault();
                const pasted = (e.clipboardData || window.clipboardData).getData('text');
                const cleaned = removeEmojis(pasted);
                
                const { selectionStart: start, selectionEnd: end, value } = this;
                this.value = value.substring(0, start) + cleaned + value.substring(end);
                this.setSelectionRange(start + cleaned.length, start + cleaned.length);
                
                if (pasted !== cleaned) showRejectionFeedback(this);
                
                // Activate text mode on paste
                if (cleaned) activateTextCustomization();
            });
        }

        // ===== UI UPDATES =====
        // Display the event logo and — when product customization is NOT
        // enabled — the static display image. When the canvas IS enabled,
        // we deliberately leave `#displayImageContainer` hidden: the
        // canvas owns the preview, and the `<img>` tag fetching the same
        // URL here would be pure duplicate work (and a visible flash as
        // the static image loaded, showed briefly, then got hidden).
        function updateEventDisplay(config) {
            const eventNameEl = document.getElementById("eventName");
            const eventLogoEl = document.getElementById("eventLogo");
            const displayImageEl = document.getElementById("displayImage");
            const displayContainerEl = document.getElementById("displayImageContainer");

            eventNameEl.textContent = config.eventName;
            eventNameEl.style.display = config.eventName?.trim() ? 'block' : 'none';

            if (config.eventLogo) {
                eventLogoEl.src = config.eventLogo;
                eventLogoEl.style.display = 'block';
                eventLogoEl.onerror = () => eventLogoEl.style.display = 'none';
            } else {
                eventLogoEl.style.display = 'none';
            }

            const customizationEnabled = Boolean(config.productCustomization?.enabled);
            if (customizationEnabled) {
                // Canvas mode: make sure the legacy image never renders,
                // regardless of any residual inline/style state.
                displayContainerEl.style.display = 'none';
                displayImageEl.removeAttribute('src');
                return;
            }

            if (config.displayImage?.enabled && config.displayImage?.url) {
                displayImageEl.src = config.displayImage.url;
                displayImageEl.style.maxWidth = `${config.displayImage.size || 60}%`;
                displayContainerEl.style.display = 'flex';
                displayImageEl.onload = () => displayImageEl.style.display = 'block';
                displayImageEl.onerror = () => displayContainerEl.style.display = 'none';
            } else {
                displayContainerEl.style.display = 'none';
            }
        }

        function generateFormFields(config) {
            const fieldsContainer = document.getElementById("fieldsContainer");
            fieldsContainer.innerHTML = '';
            
            if (!config.fields || !Array.isArray(config.fields)) {
                return;
            }
            
            // Check if graphics selections are available (makes text optional)
            const hasGraphicSelections = config.productCustomization?.enabled && 
                config.productCustomization.svgOverlays?.some(overlay => {
                    const urls = overlay.urls || [overlay.url];
                    return urls.length > 1 && urls.some(url => url?.trim());
                });
            
            // Check if text fields are configured in productCustomization
            const hasTextFieldsInCustomization = config.productCustomization?.enabled && 
                config.productCustomization.textFieldConfigs?.length > 0;
            
            // If product customization is enabled but no text fields are configured, hide the fields container
            if (config.productCustomization?.enabled && !hasTextFieldsInCustomization) {
                fieldsContainer.style.display = 'none';
                const textToggle = document.getElementById('textCustomizationToggle');
                if (textToggle) textToggle.style.display = 'none';
                return;
            }
            
            config.fields.forEach((field, index) => {
                const fieldDiv = document.createElement("div");
                fieldDiv.className = "field slide-up";
                fieldDiv.style.animationDelay = `${0.2 + (index * 0.1)}s`;

                const label = document.createElement("label");
                label.textContent = `${field.title} (${field.charLimit} max)`;
                label.htmlFor = `field-${index}`;

                const input = document.createElement("input");
                input.type = "text";
                input.id = `field-${index}`;
                input.maxLength = field.charLimit;
                // Make fields optional if graphic selections are available
                input.required = !hasGraphicSelections;
                input.placeholder = `Enter ${field.title.toLowerCase()}`;
                input.dataset.fieldId = field.id; // Store field ID for canvas updates

                attachEmojiBlocker(input);

                // Attach real-time canvas update listener
                input.addEventListener('input', function(e) {
                    if (window.updateTextField && window.productCanvasEnabled) {
                        window.updateTextField(field.id, e.target.value);
                    }
                    // Activate text mode if typing
                    if (this.value.trim()) activateTextCustomization();
                });

                // Handle Enter key to move to next field or submit
                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const inputs = Array.from(document.querySelectorAll("#fieldsContainer input"));
                        const currentIndex = inputs.indexOf(this);
                        
                        if (currentIndex < inputs.length - 1) {
                            // Move to next field
                            inputs[currentIndex + 1].focus();
                        } else {
                            // Last field, submit the form
                            handleFormSubmission();
                        }
                    }
                });

                fieldDiv.appendChild(label);
                fieldDiv.appendChild(input);
                fieldsContainer.appendChild(fieldDiv);
            });

            // The server reserved a placeholder height based on the
            // field count. Now that the real fields are in the DOM,
            // drop the reservation so Chrome doesn't keep extra
            // whitespace forever.
            fieldsContainer.style.minHeight = '0';
        }

        // ===== NETWORK MONITORING =====
        function setupNetworkMonitoring() {
            window.addEventListener('online', handleOnline);
            window.addEventListener('offline', handleOffline);
        }

        function handleOnline() {
            if (pendingSubmission) {
                if (ticketComponent) {
                    ticketComponent.setStatus("Submitting...");
                }
                submitTicketToServer(pendingSubmission.uniqueCode, pendingSubmission.submission);
            }
        }

        function handleOffline() {
            console.log('Internet connection lost');
        }

        // =================================================================
        // Ticket-view bundle (ticketComponent + barcode library).
        //
        // Deferred: nothing here is needed to render the form. We warm
        // the bundle on the first focus/pointerdown (so it's parsed
        // before Submit is ever clicked) and fall back to awaiting it
        // at submission time.
        //
        // Barcode library is picked based on the event's scanner mode:
        //   - 'hid'       → qrcode.min.js  (~20 KB; QR carousel, one per field)
        //   - 'advanced'  → aztec-bundle.min.js (~36 KB; single Aztec code)
        //
        // We deliberately load ONLY the library the event actually uses.
        // Shipping QR to an Aztec event (or vice-versa) is pure waste.
        // ticketComponent.js uses `window.QRCode` for HID and
        // `window.aztecToCanvas` for advanced; neither is referenced
        // unless the matching mode is active, so there's no runtime
        // dependency on the unused library.
        // =================================================================
        let ticketBundleLoading = null;
        function ensureTicketBundle() {
            if (ticketComponent) return Promise.resolve();
            if (ticketBundleLoading) return ticketBundleLoading;

            // Resolve the barcode lib URL at call time so a late config
            // update (e.g. admin toggled scannerMode mid-session) still
            // picks up the right file.
            const barcodeLib = eventScannerMode === 'advanced'
                ? '/lib/js/aztec-bundle.min.js'
                : '/lib/js/qrcode.min.js';

            ticketBundleLoading = Promise.all([
                loadScript(barcodeLib),
                loadScript('/js/ticketComponent.js')
            ]).then(() => {
                if (typeof window.TicketComponent !== 'function') {
                    throw new Error('ticketComponent.js loaded but window.TicketComponent is missing');
                }
                ticketComponent = new window.TicketComponent('ticketContainer', {
                    autoRender: false,
                    onBack: () => {
                        document.querySelector('main').style.display = 'block';
                        ticketComponent.hide();
                    },
                    onStatusChange: (status) => {
                        console.log(`Ticket status changed to: ${status}`);
                    }
                });
            }).catch(err => {
                ticketBundleLoading = null; // allow retry
                throw err;
            });
            return ticketBundleLoading;
        }

        // ===== MODAL LOADING HELPERS =====
        function showLookupModal() {
            ensureTicketBundle()
                .then(() => loadScript('/js/lookupModal.js'))
                .then(() => {
                    // Defensive: a cached error-404 from a previous
                    // failed deploy could resolve the Promise but not
                    // attach the constructor. Surface that as a
                    // human-readable message rather than the browser's
                    // "is not a constructor" stack trace.
                    if (typeof window.LookupModal !== 'function') {
                        throw new Error('LookupModal script loaded but window.LookupModal is missing');
                    }
                    if (!lookupModal) {
                        lookupModal = new window.LookupModal({
                            eventName,
                            submissionTracker: SubmissionTracker,
                            ticketComponent,
                            scannerMode: eventScannerMode,
                            onTicketFound: (ticket) => console.log('Ticket found:', ticket)
                        });
                    } else {
                        lookupModal.setScannerMode(eventScannerMode);
                    }
                    lookupModal.show();
                })
                .catch(err => {
                    console.error('Failed to load lookup modal:', err);
                    const msg = navigator.onLine
                        ? 'Could not open ticket lookup. Please try again in a moment.'
                        : 'You are offline. Ticket lookup needs an internet connection.';
                    alert(msg);
                });
        }

        // ===== EVENT LISTENERS =====
        function setupEventListeners() {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                fetch('/global-settings')
                    .then(response => response.json())
                    .then(settings => settings.darkMode && updateDarkMode(settings))
                    .catch(error => console.error('Failed to update dark mode:', error));
            });

            document.getElementById("lookupButton").addEventListener("click", () => {
                showLookupModal();
            });

            document.getElementById("submitButton").addEventListener("click", handleFormSubmission);

            // Prevent form submission on Enter key (which causes page refresh)
            const form = document.getElementById("engravingForm");
            if (form) {
                form.addEventListener("submit", (e) => {
                    e.preventDefault();
                    handleFormSubmission();
                });
            }

            // Warm up the ticket bundle as soon as the user interacts
            // with any input — typing starts a few hundred ms before
            // they'd hit Submit, which is more than enough time to
            // fetch and parse ~60 KB of script.
            const warmup = () => {
                ensureTicketBundle().catch(() => { /* retried on Submit */ });
                document.removeEventListener('focusin', warmup, true);
                document.removeEventListener('pointerdown', warmup, true);
            };
            document.addEventListener('focusin', warmup, true);
            document.addEventListener('pointerdown', warmup, true);
        }

        // ===== FORM SUBMISSION =====
        async function handleFormSubmission() {
            if (SubmissionTracker.isLimitExceeded(eventQuantityLimit)) {
                showLimitExceededModal();
                return;
            }

            const inputs = document.querySelectorAll("#fieldsContainer input");
            submissionData = [];

            // Collect text field data (only non-empty fields)
            const textFields = Array.from(inputs)
                .map(input => ({
                    title: input.previousElementSibling.textContent.split(' (')[0],
                    value: input.value.trim(),
                    isTextField: true
                }))
                .filter(field => field.value); // Only include filled fields

            // Collect SVG selections (use configured encoded values)
            const svgFields = [];
            if (window.getSelectedSvgOptions) {
                const svgSelections = window.getSelectedSvgOptions();
                svgSelections.forEach((selection, index) => {
                    svgFields.push({
                        title: `Graphic ${index + 1}`,
                        value: selection.encodedValue,
                        isSvgField: true
                    });
                });
            }

            // In exclusive mode, only require the active customization type
            if (customizationMode === 'exclusive') {
                submissionData = activeCustomization === 'text' ? textFields :
                                activeCustomization === 'graphics' ? svgFields :
                                textFields; // Default to text if no active mode
            } else {
                submissionData = [...textFields, ...svgFields];
            }

            // Validate: require at least one field (text or graphic)
            if (submissionData.length === 0) {
                alert('Please fill in at least one field or select a graphic option');
                return;
            }

            // Check emojis only in text fields
            const fieldWithEmoji = submissionData.find(field => field.isTextField && containsEmoji(field.value));
            if (fieldWithEmoji) {
                alert(`Emojis are not allowed. Please remove emojis from the "${fieldWithEmoji.title}" field.`);
                return;
            }

            // Block just long enough to make sure the ticket bundle is
            // in memory. In practice this usually resolves synchronously
            // (we prefetched on first focus/pointerdown).
            try {
                await ensureTicketBundle();
            } catch (err) {
                console.error('Ticket bundle failed to load:', err);
                alert('Could not load the ticket view — please check your connection and try again.');
                return;
            }

            generatedUniqueCode = Math.random().toString(36).substr(2, 9).toUpperCase();
            const isOffline = !navigator.onLine;

            // Clean submission data (remove internal flags before displaying/submitting)
            const cleanedSubmissionData = submissionData.map(field => ({
                title: field.title,
                value: field.value
            }));

            ticketComponent.setTicketData(generatedUniqueCode, cleanedSubmissionData, eventName, isOffline, eventScannerMode);
            ticketComponent.render();

            document.querySelector('main').style.display = 'none';
            ticketComponent.show();

            if (isOffline) {
                ticketComponent.setStatus("local");
                pendingSubmission = {
                    uniqueCode: generatedUniqueCode,
                    submission: cleanedSubmissionData
                };
                SubmissionTracker.addSubmission(generatedUniqueCode, cleanedSubmissionData);
                updateHistoryButtonVisibility();

                const ticketNumber = ticketComponent.container.querySelector('#ticketNumber');
                if (ticketNumber && ticketNumber.textContent !== "Not Submitted") {
                    ticketNumber.textContent = "Not Submitted";
                    ticketNumber.style.color = "#dc3545";
                    ticketNumber.style.cursor = "default";
                }
            } else {
                ticketComponent.setStatus("Submitting...");
                await submitTicketToServer(generatedUniqueCode, cleanedSubmissionData);
            }
        }

        async function submitTicketToServer(ticketCode, submissionData) {
            ticketComponent.setStatus("Submitting...");
            
            const markSubmissionFailed = () => {
                ticketComponent.setStatus("local");
                pendingSubmission = {
                    uniqueCode: ticketCode,
                    submission: submissionData
                };
            };
            
            try {
                const response = await fetch(`/${eventName}/submit`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        uniqueCode: ticketCode, 
                        submission: submissionData 
                    })
                });
                
                if (!response.ok) {
                    console.error('Server submission failed but ticket was generated locally');
                    markSubmissionFailed();
                } else {
                    ticketComponent.localOnly = false;
                    ticketComponent.setStatus("pending");
                    
                    const ticketNumber = ticketComponent.container.querySelector('#ticketNumber');
                    if (ticketNumber) {
                        ticketNumber.textContent = ticketCode;
                        ticketNumber.style.color = "";
                        if (ticketComponent.options.allowStatusToggle) {
                            ticketNumber.style.cursor = "pointer";
                        }
                    }
                    
                    pendingSubmission = null;
                    SubmissionTracker.addSubmission(ticketCode, submissionData);
                    updateHistoryButtonVisibility();
                }
            } catch (error) {
                console.error('Submission failed', error);
                markSubmissionFailed();
            }
        }

        // ===== LIMIT EXCEEDED MODAL =====
        function showLimitExceededModal() {
            ensureTicketBundle()
                .then(() => loadScript('/js/limitExceededModal.js'))
                .then(() => {
                    if (typeof window.LimitExceededModal !== 'function') {
                        throw new Error('LimitExceededModal script loaded but window.LimitExceededModal is missing');
                    }
                    if (!limitExceededModal) {
                        limitExceededModal = new window.LimitExceededModal({
                            eventName: eventName,
                            submissionTracker: SubmissionTracker,
                            quantityLimit: eventQuantityLimit,
                            onTicketClick: (submission) => {
                                showPreviousSubmissionTicket(submission);
                            }
                        });
                    }
                    limitExceededModal.quantityLimit = eventQuantityLimit;
                    limitExceededModal.show();
                })
                .catch(error => {
                    console.error('Error loading limit exceeded modal:', error);
                    // Fall back to a plain alert so the user still
                    // learns *why* their submit was blocked even if the
                    // rich modal can't load.
                    alert('You have reached the submission limit.');
                });
        }

        function showPreviousSubmissionTicket(submission) {
            ensureTicketBundle().then(() => {
                document.querySelector('main').style.display = 'none';

                ticketComponent.setTicketData(submission.ticketCode, submission.submissionData, eventName, false, eventScannerMode);
                ticketComponent.render();
                ticketComponent.show();
                ticketComponent.setStatus("Checking...");

                fetch(`/ticket/${submission.ticketCode}`)
                    .then(response => {
                        if (!response.ok) throw new Error(`HTTP ${response.status}`);
                        const contentType = response.headers.get('content-type');
                        if (!contentType || !contentType.includes('application/json')) {
                            throw new Error('Response is not JSON');
                        }
                        return response.json();
                    })
                    .then(ticketData => {
                        const status = ticketData?.compleationStatus === "1" ? "completed" : "pending";
                        ticketComponent.setStatus(status);
                    })
                    .catch(() => {
                        ticketComponent.setStatus("pending");
                    });
            });
        }
    </script>
</body>
</html>
