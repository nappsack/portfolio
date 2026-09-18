/* ==========================================================================
   Ask-me-anything chat widget
   Talks to /api/chat, which streams back Server-Sent Events.
   ========================================================================== */

(function () {
    'use strict';

    var MAX_CHARS = 1000;
    var MAX_TURNS = 12;

    var SUGGESTIONS = [
        "What kind of work do you do?",
        "Tell me about your design systems experience",
        "Have you led a team?",
        "How do you use AI in your work?"
    ];

    var GREETING =
        "Hey! Ask me anything about my experience, the work in my portfolio, " +
        "or how I approach design problems.";

    /** Conversation as sent to the API. The greeting is UI only. */
    var history = [];
    var busy = false;
    var els = {};

    /* ------------------------------------------------------------- markup --- */

    function icon(paths) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        svg.setAttribute('aria-hidden', 'true');
        paths.forEach(function (d) {
            var el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            el.setAttribute('d', d);
            svg.appendChild(el);
        });
        return svg;
    }

    function build() {
        var launcher = document.createElement('button');
        launcher.className = 'chat-launcher';
        launcher.type = 'button';
        launcher.setAttribute('aria-label', 'Ask me anything about Chris');
        launcher.appendChild(icon(['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z']));
        launcher.appendChild(document.createTextNode('Ask me anything'));

        var panel = document.createElement('div');
        panel.className = 'chat-panel';
        panel.hidden = true;
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-modal', 'false');
        panel.setAttribute('aria-label', 'Ask me anything about Chris Nappi');

        // Header
        var header = document.createElement('div');
        header.className = 'chat-header';
        var titleWrap = document.createElement('div');
        var h2 = document.createElement('h2');
        h2.textContent = 'Ask me anything';
        var sub = document.createElement('p');
        sub.textContent = 'An AI version of Chris, trained on his real work';
        titleWrap.appendChild(h2);
        titleWrap.appendChild(sub);

        var close = document.createElement('button');
        close.className = 'chat-close';
        close.type = 'button';
        close.setAttribute('aria-label', 'Close chat');
        close.appendChild(icon(['M18 6 6 18', 'M6 6l12 12']));

        header.appendChild(titleWrap);
        header.appendChild(close);

        // Log
        var log = document.createElement('div');
        log.className = 'chat-log';
        log.setAttribute('role', 'log');
        log.setAttribute('aria-live', 'polite');
        log.setAttribute('aria-label', 'Conversation');

        // Composer
        var form = document.createElement('form');
        form.className = 'chat-form';

        var label = document.createElement('label');
        label.className = 'visually-hidden';
        label.setAttribute('for', 'chat-input');
        label.textContent = 'Your question';

        var input = document.createElement('textarea');
        input.id = 'chat-input';
        input.rows = 1;
        input.maxLength = MAX_CHARS;
        input.placeholder = 'Ask a question…';

        var send = document.createElement('button');
        send.className = 'chat-send';
        send.type = 'submit';
        send.setAttribute('aria-label', 'Send question');
        send.appendChild(icon(['M22 2 11 13', 'M22 2l-7 20-4-9-9-4 20-7z']));

        form.appendChild(label);
        form.appendChild(input);
        form.appendChild(send);

        var foot = document.createElement('p');
        foot.className = 'chat-footnote';
        foot.textContent = 'This is an AI, so it can get things wrong. For anything important, email me.';

        panel.appendChild(header);
        panel.appendChild(log);
        panel.appendChild(form);
        panel.appendChild(foot);

        document.body.appendChild(launcher);
        document.body.appendChild(panel);

        els = { launcher: launcher, panel: panel, log: log, form: form,
                input: input, send: send, close: close };
    }

    /* ---------------------------------------------------------- rendering --- */

    function bubble(role) {
        var el = document.createElement('div');
        el.className = 'chat-msg chat-msg--' + role;
        els.log.appendChild(el);
        stick = true;
        scroll(true);
        return el;
    }

    /** True while the log is parked at (or near) the bottom. Streaming only
        auto-scrolls when this holds, so scrolling up to re-read an answer
        isn't fought by every incoming token. */
    var stick = true;

    function scroll(force) {
        if (force || stick) els.log.scrollTop = els.log.scrollHeight;
    }

    function watchStick() {
        var gap = els.log.scrollHeight - els.log.scrollTop - els.log.clientHeight;
        stick = gap < 48;
    }

    /**
     * Render model text as DOM nodes. Deliberately hand-rolled and narrow:
     * we only support **bold**, bullet lists, and paragraph breaks, and we
     * never touch innerHTML with model output.
     */
    function render(el, text) {
        el.textContent = '';
        text.split(/\n{2,}/).forEach(function (block) {
            var lines = block.split('\n');
            var isList = lines.every(function (l) {
                return /^\s*[-*•]\s+/.test(l) || !l.trim();
            }) && /[-*•]\s+/.test(block);

            if (isList) {
                var ul = document.createElement('ul');
                lines.forEach(function (l) {
                    if (!l.trim()) return;
                    var li = document.createElement('li');
                    bold(li, l.replace(/^\s*[-*•]\s+/, ''));
                    ul.appendChild(li);
                });
                el.appendChild(ul);
            } else {
                var p = document.createElement('p');
                bold(p, block);
                el.appendChild(p);
            }
        });
    }

    /** Split on **bold** and append as text nodes — never as HTML. */
    function bold(parent, text) {
        text.split(/(\*\*[^*]+\*\*)/).forEach(function (part) {
            if (!part) return;
            if (part.slice(0, 2) === '**' && part.slice(-2) === '**') {
                var s = document.createElement('strong');
                s.textContent = part.slice(2, -2);
                parent.appendChild(s);
            } else {
                parent.appendChild(document.createTextNode(part));
            }
        });
    }

    function typing(el) {
        el.textContent = '';
        var d = document.createElement('span');
        d.className = 'chat-dots';
        d.appendChild(document.createElement('span'));
        d.appendChild(document.createElement('span'));
        d.appendChild(document.createElement('span'));
        el.appendChild(d);
    }

    function suggestions() {
        var wrap = document.createElement('div');
        wrap.className = 'chat-suggestions';
        SUGGESTIONS.forEach(function (q) {
            var b = document.createElement('button');
            b.type = 'button';
            b.textContent = q;
            b.addEventListener('click', function () {
                wrap.remove();
                ask(q);
            });
            wrap.appendChild(b);
        });
        els.log.appendChild(wrap);
        scroll(true);
    }

    /* ------------------------------------------------------------- talking --- */

    function ask(question) {
        if (busy) return;
        question = question.trim();
        if (!question) return;

        if (history.length >= MAX_TURNS) {
            var w = bubble('error');
            w.textContent = "This chat has run long. Refresh the page to start " +
                "a new one, or just email me at chrisnappi88@gmail.com.";
            return;
        }

        busy = true;
        els.send.disabled = true;

        bubble('user').textContent = question;
        history.push({ role: 'user', content: question });

        var out = bubble('bot');
        typing(out);

        stream(out);
    }

    function stream(out) {
        var answer = '';
        var first = true;

        function finish(ok) {
            busy = false;
            els.send.disabled = false;
            if (ok && answer.trim()) {
                history.push({ role: 'assistant', content: answer });
            } else {
                // Drop the unanswered question so the next try isn't sent
                // against a dangling user turn.
                history.pop();
            }
            if (!isMobile()) els.input.focus({ preventScroll: true });
        }

        function fail(msg) {
            render(out, '');
            out.className = 'chat-msg chat-msg--error';
            out.textContent = msg;
            scroll();
            finish(false);
        }

        fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: history })
        }).then(function (res) {
            if (!res.ok) {
                return res.json().then(function (b) {
                    fail(b.error || 'Something went wrong. Try again in a moment.');
                }, function () {
                    fail('Something went wrong. Try again in a moment.');
                });
            }

            var reader = res.body.getReader();
            var decoder = new TextDecoder();
            var buffer = '';

            function pump() {
                return reader.read().then(function (r) {
                    if (r.done) { finish(true); return; }

                    buffer += decoder.decode(r.value, { stream: true });
                    var events = buffer.split('\n\n');
                    buffer = events.pop();

                    for (var i = 0; i < events.length; i++) {
                        var line = events[i].trim();
                        if (line.slice(0, 5) !== 'data:') continue;

                        var data;
                        try { data = JSON.parse(line.slice(5)); }
                        catch (e) { continue; }

                        if (data.error) { fail(data.error); return; }
                        if (data.done)  { finish(true); return; }
                        if (data.text) {
                            if (first) { out.textContent = ''; first = false; }
                            answer += data.text;
                            render(out, answer);
                            scroll();
                        }
                    }
                    return pump();
                });
            }
            return pump();
        }).catch(function () {
            fail("I couldn't reach the server. Check your connection, or just " +
                 "email me at chrisnappi88@gmail.com.");
        });
    }

    /* --------------------------------------------------------------- open --- */

    var lastFocus = null;
    var lockedY = 0;
    var pushedState = false;

    function isMobile() {
        return window.matchMedia('(max-width: 560px)').matches;
    }

    /* The panel is sized from the VisualViewport rather than the layout
       viewport. On iOS the layout viewport does not shrink when the keyboard
       opens, so a 100%-height fixed panel keeps its full height, pushes the
       composer under the keyboard, and the browser scrolls the page to chase
       the caret. Tracking visualViewport.height/offsetTop keeps the panel
       glued to what the user can actually see. */
    function syncViewport() {
        var vv = window.visualViewport;
        if (!vv || !isMobile()) return;
        els.panel.style.setProperty('--chat-vh', vv.height + 'px');
        els.panel.style.setProperty('--chat-vv-top', vv.offsetTop + 'px');
        scroll();
    }

    function clearViewport() {
        els.panel.style.removeProperty('--chat-vh');
        els.panel.style.removeProperty('--chat-vv-top');
    }

    /* overflow:hidden alone does not hold on iOS and loses scroll position.
       Pinning the body and restoring scrollY on release is what actually
       stops the page moving behind a full-screen panel. */
    var ORIGINAL_RESTORATION = (function () {
        try { return window.history.scrollRestoration || 'auto'; }
        catch (e) { return null; }
    })();

    function lockScroll() {
        lockedY = window.scrollY || window.pageYOffset || 0;
        // Every close path pops our dummy entry, and the browser's automatic
        // scroll restoration for that entry runs after we restore, overriding
        // it. Turn it off for the life of the overlay only.
        try { window.history.scrollRestoration = 'manual'; } catch (e) {}
        document.body.style.top = (-lockedY) + 'px';
        document.body.classList.add('chat-open');
    }

    function unlockScroll() {
        document.body.classList.remove('chat-open');
        document.body.style.top = '';
        // The site sets scroll-behavior:smooth globally, which would animate
        // this restore and read as the page sliding on its own.
        restoreScroll(lockedY);
        // Run again after the popstate settles, then hand scroll restoration
        // back to the browser.
        var y = lockedY;
        requestAnimationFrame(function () {
            restoreScroll(y);
            requestAnimationFrame(function () { restoreScroll(y); });
            if (ORIGINAL_RESTORATION) {
                try { window.history.scrollRestoration = ORIGINAL_RESTORATION; } catch (e) {}
            }
        });
    }

    function restoreScroll(y) {
        var root = document.documentElement;
        var prev = root.style.scrollBehavior;
        root.style.scrollBehavior = 'auto';
        window.scrollTo(0, y);
        root.style.scrollBehavior = prev;
    }

    function open() {
        lastFocus = document.activeElement;
        els.panel.hidden = false;
        els.launcher.hidden = true;

        if (!els.log.childElementCount) {
            bubble('bot').textContent = GREETING;
            suggestions();
        }

        if (isMobile()) {
            lockScroll();
            syncViewport();
            // Give the system Back gesture something to pop, so it closes the
            // chat instead of leaving the site.
            try {
                // NOTE: `history` is the conversation array in this file and
                // shadows the global. Must go through window explicitly.
                window.history.pushState({ chatOpen: true }, '');
                pushedState = true;
            } catch (e) { pushedState = false; }
            // Opening the keyboard immediately on mobile hides the greeting
            // behind it; let the user tap in.
            els.panel.setAttribute('aria-modal', 'true');
        } else {
            els.input.focus({ preventScroll: true });
        }

        stick = true;
        scroll(true);
    }

    function shut(fromPopstate) {
        els.panel.hidden = true;
        els.launcher.hidden = false;
        els.panel.setAttribute('aria-modal', 'false');

        if (document.body.classList.contains('chat-open')) unlockScroll();
        clearViewport();

        if (pushedState && !fromPopstate) {
            pushedState = false;
            try { window.history.back(); } catch (e) {}
        } else {
            pushedState = false;
        }

        // preventScroll: focus() otherwise scrolls the target into view,
        // undoing the restore above (and animating, since html is smooth).
        try { (lastFocus || els.launcher).focus({ preventScroll: true }); }
        catch (e) { (lastFocus || els.launcher).focus(); }
    }

    /* --------------------------------------------------------------- init --- */

    function init() {
        build();

        els.launcher.addEventListener('click', open);
        els.close.addEventListener('click', function () { shut(false); });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !els.panel.hidden) shut(false);
        });

        // Back gesture / button closes the chat rather than the site.
        window.addEventListener('popstate', function () {
            if (!els.panel.hidden) shut(true);
        });

        els.log.addEventListener('scroll', watchStick, { passive: true });

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', syncViewport);
            window.visualViewport.addEventListener('scroll', syncViewport);
        }
        window.addEventListener('orientationchange', function () {
            setTimeout(syncViewport, 200);
        });

        // Keep the newest message visible once the keyboard settles.
        els.input.addEventListener('focus', function () {
            setTimeout(function () { syncViewport(); scroll(true); }, 250);
        });

        els.form.addEventListener('submit', function (e) {
            e.preventDefault();
            var q = els.input.value;
            els.input.value = '';
            els.input.style.height = 'auto';
            ask(q);
        });

        // Enter sends, Shift+Enter makes a new line.
        els.input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                els.form.requestSubmit();
            }
        });

        // Grow the box with the text.
        els.input.addEventListener('input', function () {
            els.input.style.height = 'auto';
            els.input.style.height = Math.min(els.input.scrollHeight, 120) + 'px';
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
