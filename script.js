(() => {
    "use strict";

    // Текущий год в подвале
    const year = document.getElementById("year");
    if (year) {
        year.textContent = String(new Date().getFullYear());
    }

    // ------------------------------------------------------------
    // Мобильное меню
    // ------------------------------------------------------------
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");

    if (toggle && nav) {
        const closeMenu = () => {
            nav.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Открыть меню");
        };

        toggle.addEventListener("click", () => {
            const open = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", String(open));
            toggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
        });

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        document.addEventListener("click", (event) => {
            if (
                nav.classList.contains("is-open") &&
                !nav.contains(event.target) &&
                !toggle.contains(event.target)
            ) {
                closeMenu();
            }
        });
    }

    // ------------------------------------------------------------
    // Появление блоков при прокрутке
    // ------------------------------------------------------------
    const reveals = document.querySelectorAll(".reveal");

    // Показываем то, что уже в зоне видимости, даже если браузер не прислал
    // событие IntersectionObserver (например, в фоновом окне).
    const revealInViewport = () => {
        reveals.forEach((element) => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight - 40 && rect.bottom > 0) {
                element.classList.add("is-visible");
            }
        });
    };

    if (!("IntersectionObserver" in window)) {
        reveals.forEach((element) => element.classList.add("is-visible"));
    } else {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );

        reveals.forEach((element) => revealObserver.observe(element));
    }

    requestAnimationFrame(revealInViewport);
    window.addEventListener("load", () => requestAnimationFrame(revealInViewport));

    // ------------------------------------------------------------
    // Подсветка активного пункта меню
    // ------------------------------------------------------------
    const navLinks = Array.from(
        document.querySelectorAll('.site-nav a[href^="#"]')
    );
    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    if (sections.length) {
        const setActive = (id) => {
            navLinks.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
            });
        };

        const updateActive = () => {
            const marker = window.scrollY + window.innerHeight * 0.3;
            let current = "";

            sections.forEach((section) => {
                const top = section.getBoundingClientRect().top + window.scrollY;
                if (top <= marker) {
                    current = section.id;
                }
            });

            if (current) {
                setActive(current);
            }
        };

        window.addEventListener("scroll", updateActive, { passive: true });
        window.addEventListener("resize", updateActive);
        updateActive();
    }
})();
