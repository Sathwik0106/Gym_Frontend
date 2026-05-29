document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("js-enabled");

  const menu = document.querySelector(".menu");
  const mobileButton = document.querySelector(".mobile-btn");
  const navLinks = Array.from(document.querySelectorAll(".nav a"));
  const mainSections = Array.from(document.querySelectorAll(".header, .section, .footer"));
  const revealTargets = Array.from(document.querySelectorAll(".header .text, .header .visual, .section .text, .section .visual, .trainer, .client"));
  const body = document.body;

  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  body.prepend(progressBar);

  const topButton = document.createElement("button");
  topButton.type = "button";
  topButton.className = "back-to-top";
  topButton.setAttribute("aria-label", "Back to top");
  topButton.innerHTML = "↑";
  body.appendChild(topButton);

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const linkTarget = link.getAttribute("href");
      link.classList.toggle("active", linkTarget === `#${id}`);
    });
  };

  const closeMenu = () => {
    menu.classList.remove("active");
    mobileButton.setAttribute("aria-expanded", "false");
  };

  mobileButton.setAttribute("role", "button");
  mobileButton.setAttribute("tabindex", "0");
  mobileButton.setAttribute("aria-expanded", "false");

  const toggleMenu = () => {
    const isOpen = menu.classList.toggle("active");
    mobileButton.setAttribute("aria-expanded", String(isOpen));
  };

  mobileButton.addEventListener("click", toggleMenu);
  mobileButton.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleMenu();
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const target = targetId ? document.querySelector(targetId) : null;

      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      closeMenu();
    });
  });

  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target)) {
      closeMenu();
    }
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealTargets.forEach((target) => {
    target.classList.add("reveal");
    revealObserver.observe(target);
  });

  const statsStrip = document.createElement("div");
  statsStrip.className = "stats-strip reveal";
  statsStrip.innerHTML = `
    <div class="stat-card">
      <strong data-count="120">0</strong>
      <span>Live classes every month</span>
    </div>
    <div class="stat-card">
      <strong data-count="18">0</strong>
      <span>Expert trainers on demand</span>
    </div>
    <div class="stat-card">
      <strong data-count="24">0</strong>
      <span>Access from anywhere</span>
    </div>
  `;

  const headerText = document.querySelector(".header .text");
  const headerAction = headerText?.querySelector(".btn");

  if (headerText && headerAction) {
    headerText.insertBefore(statsStrip, headerAction);
  }

  revealObserver.observe(statsStrip);

  const countUp = (element, endValue) => {
    const duration = 1000;
    const start = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      element.textContent = `${Math.floor(progress * endValue)}+`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.querySelectorAll("[data-count]").forEach((countElement) => {
          const value = Number(countElement.getAttribute("data-count")) || 0;
          countUp(countElement, value);
        });

        statsObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  statsObserver.observe(statsStrip);

  const toolsSection = document.createElement("section");
  toolsSection.className = "section tools-section";
  toolsSection.id = "tools";
  toolsSection.innerHTML = `
    <div class="container">
      <div class="section-heading reveal">
        <span class="eyebrow">Interactive tools</span>
        <h2 class="primary mb">Train smarter with built-in fitness helpers</h2>
        <p class="tertiary">Use quick tools to estimate your BMI, run a focus timer, and generate a goal-based routine without leaving the page.</p>
      </div>

      <div class="tools-grid">
        <article class="tool-card reveal">
          <h3 class="secondary mb">BMI calculator</h3>
          <p class="tertiary">Get a fast check on your current fitness range.</p>
          <form class="tool-form bmi-form" novalidate>
            <label>
              Height (cm)
              <input type="number" name="height" min="100" max="250" step="1" value="175" />
            </label>
            <label>
              Weight (kg)
              <input type="number" name="weight" min="30" max="250" step="0.1" value="70" />
            </label>
            <button class="btn" type="submit">Calculate</button>
          </form>
          <div class="result-chip" data-bmi-result>Your BMI is 22.9 - Normal range</div>
        </article>

        <article class="tool-card reveal">
          <h3 class="secondary mb">Focus timer</h3>
          <p class="tertiary">Perfect for interval rounds, rests, and short challenges.</p>
          <div class="timer-display" data-timer>00:45</div>
          <div class="timer-actions">
            <button class="btn" type="button" data-timer-start>Start</button>
            <button class="btn ghost" type="button" data-timer-toggle>Pause</button>
            <button class="btn ghost" type="button" data-timer-reset>Reset</button>
          </div>
        </article>

        <article class="tool-card reveal">
          <h3 class="secondary mb">Goal-based routine</h3>
          <p class="tertiary">Pick a goal and get a starter plan for the week.</p>
          <div class="segmented" role="tablist" aria-label="Training goal selector">
            <button class="goal active" type="button" data-goal="strength">Strength</button>
            <button class="goal" type="button" data-goal="fat-loss">Fat loss</button>
            <button class="goal" type="button" data-goal="mobility">Mobility</button>
          </div>
          <ul class="routine-list" data-routine></ul>
        </article>
      </div>
    </div>
  `;

  const discountSection = document.querySelector("#discount");
  discountSection?.after(toolsSection);

  const routineMap = {
    strength: ["5 min warm-up walk", "4x8 squats with controlled tempo", "4x10 dumbbell presses", "3x12 rows or pull-downs", "Plank hold 3 x 30 sec"],
    "fat-loss": ["3 min jump rope", "4x12 bodyweight lunges", "3x15 mountain climbers", "4x20 sec sprint intervals", "Cool down with 5 min walk"],
    mobility: ["Cat-cow flow for 60 sec", "World's greatest stretch x 5 each side", "Deep squat hold for 45 sec", "Shoulder circles x 20", "Breathing reset for 2 min"]
  };

  const routineList = toolsSection.querySelector("[data-routine]");
  const goalButtons = Array.from(toolsSection.querySelectorAll("[data-goal]"));

  const renderRoutine = (goal) => {
    if (!routineList) {
      return;
    }

    routineList.innerHTML = routineMap[goal]
      .map((item) => `<li>${item}</li>`)
      .join("");
  };

  goalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      goalButtons.forEach((item) => item.classList.toggle("active", item === button));
      renderRoutine(button.getAttribute("data-goal") || "strength");
    });
  });

  renderRoutine("strength");

  const bmiForm = toolsSection.querySelector(".bmi-form");
  const bmiOutput = toolsSection.querySelector("[data-bmi-result]");

  bmiForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(bmiForm);
    const height = Number(formData.get("height")) / 100;
    const weight = Number(formData.get("weight"));

    if (!height || !weight) {
      if (bmiOutput) {
        bmiOutput.textContent = "Please enter a valid height and weight.";
      }
      return;
    }

    const bmi = weight / (height * height);
    const rounded = bmi.toFixed(1);
    const status = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal range" : bmi < 30 ? "Overweight" : "High range";

    if (bmiOutput) {
      bmiOutput.textContent = `Your BMI is ${rounded} - ${status}`;
    }
  });

  const timerDisplay = toolsSection.querySelector("[data-timer]");
  const startButton = toolsSection.querySelector("[data-timer-start]");
  const pauseButton = toolsSection.querySelector("[data-timer-toggle]");
  const resetButton = toolsSection.querySelector("[data-timer-reset]");

  let timerSeconds = 45;
  let timerId = null;
  let isRunning = false;

  const renderTimer = () => {
    const minutes = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
    const seconds = String(timerSeconds % 60).padStart(2, "0");
    if (timerDisplay) {
      timerDisplay.textContent = `${minutes}:${seconds}`;
    }
  };

  const stopTimer = () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    isRunning = false;
    if (pauseButton) {
      pauseButton.textContent = "Pause";
    }
  };

  const startTimer = () => {
    if (isRunning) {
      return;
    }

    isRunning = true;
    if (pauseButton) {
      pauseButton.textContent = "Pause";
    }

    timerId = setInterval(() => {
      if (timerSeconds <= 0) {
        stopTimer();
        timerSeconds = 45;
        renderTimer();
        return;
      }

      timerSeconds -= 1;
      renderTimer();
    }, 1000);
  };

  startButton?.addEventListener("click", startTimer);
  pauseButton?.addEventListener("click", () => {
    if (isRunning) {
      stopTimer();
      if (pauseButton) {
        pauseButton.textContent = "Resume";
      }
      return;
    }

    startTimer();
  });

  resetButton?.addEventListener("click", () => {
    stopTimer();
    timerSeconds = 45;
    renderTimer();
  });

  renderTimer();

  const footerText = document.querySelector(".footer .tertiary");
  if (footerText) {
    footerText.innerHTML = `&copy; ${new Date().getFullYear()} PGC-GYM. All Rights Reserved.`;
  }

  const updateOnScroll = () => {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;

    progressBar.style.transform = `scaleX(${progress})`;
    menu.classList.toggle("scrolled", scrollTop > 18);
    topButton.classList.toggle("visible", scrollTop > window.innerHeight * 0.5);

    let activeSection = "home";
    mainSections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      if (scrollTop >= sectionTop - 140) {
        activeSection = section.id || activeSection;
      }
    });

    setActiveLink(activeSection);
  };

  topButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", updateOnScroll, { passive: true });
  window.addEventListener("resize", updateOnScroll);
  updateOnScroll();
});