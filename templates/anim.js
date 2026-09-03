/**
 * Puti-AI Notion & PowerPoint-Grade Motion Graphics Engine
 * Handles scene rendering, DOM generation, and millisecond-accurate sync
 */

(function () {
  let project = window.videoProject || null;
  const scenesRoot = document.getElementById('scenes-root');
  const subtitlePill = document.getElementById('subtitle-pill');
  const audio = document.getElementById('narration-audio');

  window.__IS_RECORDING_FINISHED__ = false;

  function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.style.display = 'block';
    canvas.width = 1920;
    canvas.height = 1080;

    const pieces = [];
    const colors = ['#00f0ff', '#ff007f', '#39ff14', '#ffe259', '#00ffcc', '#e2583e', '#e88e14'];

    for (let i = 0; i < 140; i++) {
      pieces.push({
        x: canvas.width / 2,
        y: canvas.height / 2 + 100,
        vx: (Math.random() - 0.5) * 24,
        vy: (Math.random() - 1) * 24,
        size: Math.random() * 12 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12
      });
    }

    function animateConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;
      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.5; // gravity
        p.rot += p.rotSpeed;
        if (p.y < canvas.height) active = true;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      if (active) {
        requestAnimationFrame(animateConfetti);
      } else {
        canvas.style.display = 'none';
      }
    }
    animateConfetti();
  }

  function renderDOM() {
    if (!project || !project.scenes) return;

    scenesRoot.innerHTML = '';

    project.scenes.forEach((scene, index) => {
      const container = document.createElement('div');
      container.id = `scene-${index}`;
      const layoutLower = (scene.layout || '').toLowerCase();
      const customAnim = scene.anim ? `anim-${scene.anim}` : '';
      container.className = `scene-container ${scene.layout} layout-${layoutLower} ${customAnim}`;

      switch (scene.layout) {
        case 'L00_GiantImpact':
          let titleHtml = scene.title || '';
          if (titleHtml.includes('<br>')) {
            const parts = titleHtml.split('<br>');
            titleHtml = `
              <span class="kinetic-phrase phrase-1" id="k-phrase-1-${index}">${parts[0]}</span><br>
              <span class="phrase-impact-zoom phrase-2" id="k-phrase-2-${index}">${parts.slice(1).join('<br>')}</span>
            `;
          }
          container.innerHTML = `
            <div class="giant-impact-text ${scene.accent ? 'accent-color' : ''}" id="giant-text-${index}">
              ${titleHtml}
            </div>
            ${scene.subQuote ? `<div class="quote-pill" id="giant-quote-${index}">${scene.subQuote}</div>` : ''}
            ${scene.subtitle ? `<div class="hero-subtitle" style="margin-top: 30px;">${scene.subtitle}</div>` : ''}
          `;
          break;

        case 'L01_HeroHook':
          container.innerHTML = `
            <div class="hero-title">${scene.title || ''}</div>
            ${scene.subtitle ? `<div class="hero-subtitle">${scene.subtitle}</div>` : ''}
          `;
          break;

        case 'L02_CardFlip':
          const cardA = scene.cards?.[0] || { icon: '🛠️', title: '先看工具' };
          const cardB = scene.cards?.[1] || { icon: '🤔', title: '才想用途' };
          container.innerHTML = `
            <div class="hero-title">${scene.title || ''}</div>
            <div class="card-swap-wrapper" id="swap-wrapper-${index}">
              <div class="swap-card swap-card-a">
                <div class="card-icon">${cardA.icon}</div>
                <div class="card-title">${cardA.title}</div>
              </div>
              <div class="swap-arrow">➔</div>
              <div class="swap-card swap-card-b">
                <div class="card-icon">${cardB.icon}</div>
                <div class="card-title">${cardB.title}</div>
              </div>
            </div>
            ${scene.bottomText ? `<div class="bubble-followup-text" id="flip-bottom-${index}">${scene.bottomText}</div>` : ''}
          `;
          break;

        case 'L03_InvertText':
          container.innerHTML = `
            ${scene.title ? `<div class="hero-title">${scene.title}</div>` : ''}
            <div class="invert-target" id="invert-target-${index}">${scene.highlight || '倒過來'}</div>
          `;
          break;

        case 'L04_FocusCircle':
          container.innerHTML = `
            <div class="center-circle">${scene.centerText || '自己'}</div>
            ${scene.satellites?.[0] ? `<div class="satellite-text satellite-left">${scene.satellites[0]}</div>` : ''}
            ${scene.satellites?.[1] ? `<div class="satellite-text satellite-right">${scene.satellites[1]}</div>` : ''}
          `;
          break;

        case 'L05_CardGrid':
          let cardsHtml = (scene.cards || []).map((c, cIdx) => `
            <div class="grid-card" id="grid-card-${index}-${cIdx}">
              <div class="icon-box">${c.icon || '📌'}</div>
              <div class="card-main-title">${c.title || ''}</div>
              <div class="card-desc">${c.desc || ''}</div>
            </div>
          `).join('');
          container.innerHTML = `
            <div class="hero-title">${scene.title || ''}</div>
            <div class="cards-container">${cardsHtml}</div>
          `;
          break;

        case 'L06_StepList':
          let stepsHtml = (scene.steps || []).map((s, sIdx) => `
            <div class="step-item" id="step-${index}-${sIdx}">
              <span class="step-num">${sIdx + 1}.</span>
              <span class="step-label">${s}</span>
            </div>
          `).join('');
          container.innerHTML = `
            <div class="hero-title">${scene.title || ''}</div>
            <div style="width: 100%; display: flex; flex-direction: column; align-items: flex-start; max-width: 900px; margin-top: 30px;">
              ${stepsHtml}
            </div>
            ${scene.searchQuery ? `
              <div class="typewriter-search-box" id="search-box-${index}" style="opacity: 0; transition: opacity 0.5s;">
                <span class="search-icon">🔍</span>
                <span class="typed-text-content" id="typed-text-${index}"></span>
                <span class="typing-cursor"></span>
              </div>
            ` : ''}
          `;
          break;

        case 'L07_HomeworkTimer':
          container.innerHTML = `
            <div class="hero-title">${scene.title || '小功課：花五分鐘'}</div>
            <div class="timer-circle">5:00</div>
            <div class="todo-lines">
              <div class="todo-row"><span class="todo-num">1.</span><div class="todo-line"></div></div>
              <div class="todo-row"><span class="todo-num">2.</span><div class="todo-line"></div></div>
              <div class="todo-row"><span class="todo-num">3.</span><div class="todo-line"></div></div>
            </div>
          `;
          break;

        case 'L08_OutroCTA':
          container.innerHTML = `
            <div class="hero-title">${scene.title || '歡迎在留言區告訴我'}</div>
            <div class="cta-button-card">
              <div class="cta-play-icon">▶</div>
              <span>${scene.actionText || '下一支影片示範'}</span>
            </div>
            <div class="cta-farewell">${scene.farewell || '我們下次見 👋'}</div>
          `;
          break;

        case 'L09_ChatBubbles':
          let bubblesHtml = (scene.bubbles || []).map((b, bIdx) => `
            <div class="chat-bubble-card ${b.theme === 'blue' ? 'bubble-blue' : 'bubble-line'}" id="bubble-${index}-${bIdx}">
              <span>${b.icon || '💬'}</span>
              <span>${b.text || ''}</span>
            </div>
          `).join('');
          container.innerHTML = `
            <div class="hero-title" id="bubble-title-${index}">${scene.title || ''}</div>
            <div class="bubbles-container">${bubblesHtml}</div>
            ${scene.followupText ? `
              <div class="bubble-followup-text" id="bubble-followup-${index}">${scene.followupText}</div>
            ` : ''}
          `;
          break;

        case 'L10_CardMorph':
          container.innerHTML = `
            <div class="hero-title" id="morph-title-${index}">${scene.title || ''}</div>
            <div class="morph-card-container">
              <div class="morph-focal-card" id="morph-card-${index}">
                <div class="morph-icon">${scene.icon || '🛠️'}</div>
              </div>
              ${scene.extraText ? `<div class="morph-extra-text" id="morph-extra-${index}">${scene.extraText}</div>` : ''}
            </div>
          `;
          break;

        case 'L13_DataStat':
          container.innerHTML = `
            <div class="stat-number-hero ${scene.statTheme ? `stat-${scene.statTheme}` : ''}">${scene.number || '99%'}</div>
            <div class="stat-label-box">${scene.label || ''}</div>
            ${scene.description ? `<div class="hero-subtitle">${scene.description}</div>` : ''}
          `;
          break;

        case 'L14_Timeline':
          let nodesHtml = (scene.steps || []).map((step, sIdx) => `
            <div class="timeline-node" id="tl-node-${index}-${sIdx}">
              <div class="timeline-dot"></div>
              <div class="timeline-node-title">${step.title || step}</div>
              ${step.desc ? `<div class="timeline-node-desc">${step.desc}</div>` : ''}
            </div>
          `).join('');
          container.innerHTML = `
            <div class="hero-title">${scene.title || ''}</div>
            <div class="timeline-track">${nodesHtml}</div>
          `;
          break;

        case 'L15_BeforeAfter':
          container.innerHTML = `
            <div class="hero-title">${scene.title || '前後對比'}</div>
            <div class="before-after-container">
              <div class="ba-card card-before" id="ba-before-${index}">
                <div class="ba-tag">TRADITIONAL</div>
                <div class="ba-title">${scene.beforeTitle || '過去傳統做法'}</div>
                <div class="ba-desc">${scene.beforeDesc || ''}</div>
              </div>
              <div class="ba-card card-after" id="ba-after-${index}">
                <div class="ba-tag">AI EMPOWERED</div>
                <div class="ba-title">${scene.afterTitle || 'AI 賦能優化'}</div>
                <div class="ba-desc">${scene.afterDesc || ''}</div>
              </div>
            </div>
          `;
          break;

        case 'L16_Subtraction':
          container.innerHTML = `
            <div class="hero-title" id="sub-title-${index}">${scene.title || ''}</div>
            <div class="giant-impact-text anim-subtraction" id="sub-target-${index}">
              ${scene.highlight || '做減法'}
            </div>
            ${scene.subText ? `<div class="hero-subtitle" id="sub-subtext-${index}" style="margin-top: 35px; opacity: 0; transform: translateY(20px); transition: all 0.5s ease;">${scene.subText}</div>` : ''}
          `;
          break;

        case 'L17_SwipeDismiss':
          container.innerHTML = `
            <div class="hero-title" id="swipe-title-${index}">${scene.title || ''}</div>
            <div class="swap-card anim-swipe-away" id="swipe-card-${index}">
              <div class="card-icon">${scene.icon || '📱'}</div>
              <div class="card-title">${scene.cardTitle || '滑過去'}</div>
            </div>
            ${scene.followupText ? `<div class="bubble-followup-text" id="swipe-followup-${index}">${scene.followupText}</div>` : ''}
          `;
          break;

        default:
          container.innerHTML = `<div class="hero-title">${scene.title || ''}</div>`;
      }

      scenesRoot.appendChild(container);
    });
  }

  // Update visual state at given time t (seconds)
  window.updateAtTime = function (t) {
    if (!project || !project.scenes) return;

    // 1. Determine active scene
    let activeSceneIdx = -1;
    for (let i = 0; i < project.scenes.length; i++) {
      const s = project.scenes[i];
      if (t >= s.startTime && t < s.endTime) {
        activeSceneIdx = i;
        break;
      }
    }
    if (activeSceneIdx === -1 && t >= project.totalDuration - 0.5) {
      activeSceneIdx = project.scenes.length - 1;
    }

    project.scenes.forEach((s, idx) => {
      const el = document.getElementById(`scene-${idx}`);
      if (!el) return;

      if (idx === activeSceneIdx) {
        if (!el.classList.contains('active')) {
          el.classList.remove('exiting');
          el.classList.add('active');
        }

        // Check active sentence index within current scene
        let lineIdx = 0;
        let lineProgress = 0;
        if (s.line_timings && s.line_timings.length > 0) {
          for (let l = 0; l < s.line_timings.length; l++) {
            const lt = s.line_timings[l];
            if (t >= lt.start) {
              lineIdx = l;
              lineProgress = Math.max(0, Math.min(1, (t - lt.start) / Math.max(0.1, lt.end - lt.start)));
            }
          }
        }

        // --- L00_GiantImpact (Cinematic Phrase Reveal & Sub-quote) ---
        if (s.layout === 'L00_GiantImpact') {
          const kp1 = document.getElementById(`k-phrase-1-${idx}`);
          const kp2 = document.getElementById(`k-phrase-2-${idx}`);
          const gQuote = document.getElementById(`giant-quote-${idx}`);
          const gText = document.getElementById(`giant-text-${idx}`);

          // Phrase 1 enters immediately
          if (kp1) kp1.classList.add('slam');

          // Phrase 2 hits with kinetic slam on the second half of the sentence (around 1.35s in)
          if (kp2) {
            if (t >= s.startTime + 1.25) {
              kp2.classList.add('slam');
            } else {
              kp2.classList.remove('slam');
            }
          }

          if (lineIdx >= 1) {
            if (gText) {
              gText.style.transform = 'translateY(-25px) scale(0.92)';
              gText.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            }
            if (gQuote) gQuote.classList.add('visible');
          } else {
            if (gText) gText.style.transform = 'translateY(0) scale(1)';
            if (gQuote) gQuote.classList.remove('visible');
          }
        }

        // --- L02_CardFlip ---
        if (s.layout === 'L02_CardFlip') {
          const wrapper = document.getElementById(`swap-wrapper-${idx}`);
          if (wrapper) {
            const flipTime = s.swapTime || (s.startTime + (s.endTime - s.startTime) * 0.45);
            if (t >= flipTime) {
              wrapper.classList.add('swapped');
            } else {
              wrapper.classList.remove('swapped');
            }
          }
          const bText = document.getElementById(`flip-bottom-${idx}`);
          if (bText && lineIdx >= 1) {
            bText.classList.add('visible');
          }
        }

        // --- L03_InvertText ---
        if (s.layout === 'L03_InvertText') {
          const invertTime = s.invertTime || (s.startTime + (s.endTime - s.startTime) * 0.35);
          if (t >= invertTime) {
            el.classList.add('flipped');
          } else {
            el.classList.remove('flipped');
          }
        }

        // --- L05_CardGrid (Progressive entrance) ---
        if (s.layout === 'L05_CardGrid') {
          const cards = s.cards || [];
          cards.forEach((_, cIdx) => {
            const cardEl = document.getElementById(`grid-card-${idx}-${cIdx}`);
            if (cardEl) {
              // Appears when its corresponding line starts (or staggered)
              if (lineIdx >= cIdx) {
                cardEl.classList.add('visible');
              } else {
                cardEl.classList.remove('visible');
              }
            }
          });
        }

        // --- L06_StepList & Typewriter Search ---
        if (s.layout === 'L06_StepList') {
          const steps = s.steps || [];
          steps.forEach((_, sIdx) => {
            const stepEl = document.getElementById(`step-${idx}-${sIdx}`);
            if (stepEl) {
              if (lineIdx >= sIdx) {
                stepEl.classList.add('active');
              } else {
                stepEl.classList.remove('active');
              }
            }
          });

          // Typewriter Search Bar
          if (s.searchQuery) {
            const sBox = document.getElementById(`search-box-${idx}`);
            const tText = document.getElementById(`typed-text-${idx}`);
            if (sBox && tText) {
              if (lineIdx >= steps.length - 1) {
                sBox.style.opacity = '1';
                const chars = s.searchQuery.length;
                const showChars = Math.floor(lineProgress * chars);
                tText.textContent = s.searchQuery.substring(0, showChars);
              } else {
                sBox.style.opacity = '0';
                tText.textContent = '';
              }
            }
          }
        }

        // --- L09_ChatBubbles (Felo AI sequential pop-in) ---
        if (s.layout === 'L09_ChatBubbles') {
          const bubbles = s.bubbles || [];
          bubbles.forEach((_, bIdx) => {
            const bEl = document.getElementById(`bubble-${idx}-${bIdx}`);
            if (bEl) {
              // Bubble 0 on line 0/1, Bubble 1 on line 1, etc.
              if (lineIdx >= bIdx) {
                bEl.classList.add('visible');
              } else {
                bEl.classList.remove('visible');
              }
            }
          });

          const fUp = document.getElementById(`bubble-followup-${idx}`);
          if (fUp) {
            if (lineIdx >= Math.min(2, bubbles.length)) {
              fUp.classList.add('visible');
              fUp.classList.add('anim-anxiety');
            } else {
              fUp.classList.remove('visible');
              fUp.classList.remove('anim-anxiety');
            }
          }
        }

        // --- L10_CardMorph (Emphasis / Color Morph Animation) ---
        if (s.layout === 'L10_CardMorph') {
          const mCard = document.getElementById(`morph-card-${idx}`);
          const mTitle = document.getElementById(`morph-title-${idx}`);
          const mExtra = document.getElementById(`morph-extra-${idx}`);

          if (lineIdx >= 1) {
            if (mCard) mCard.classList.add('dimmed');
            if (s.morphTitle && mTitle) {
              mTitle.innerHTML = `<span class="highlight-accent">${s.morphTitle}</span>`;
            }
            if (mExtra && lineIdx >= 2) {
              mExtra.classList.add('visible');
            }
          } else {
            if (mCard) mCard.classList.remove('dimmed');
            if (mTitle) mTitle.innerHTML = s.title || '';
            if (mExtra) mExtra.classList.remove('visible');
          }
        }

        // --- L14_Timeline (Progressive milestone activation) ---
        if (s.layout === 'L14_Timeline') {
          (s.steps || []).forEach((_, sIdx) => {
            const nEl = document.getElementById(`tl-node-${idx}-${sIdx}`);
            if (nEl) {
              if (lineIdx >= sIdx) nEl.classList.add('active');
              else nEl.classList.remove('active');
            }
          });
        }

        // --- L16_Subtraction (做減法：劃線刪除/減法意象) ---
        if (s.layout === 'L16_Subtraction') {
          const subTarget = document.getElementById(`sub-target-${idx}`);
          const subSub = document.getElementById(`sub-subtext-${idx}`);
          if (lineIdx >= 1) {
            if (subTarget) subTarget.classList.add('subtracted');
            if (subSub) {
              subSub.style.opacity = '1';
              subSub.style.transform = 'translateY(0)';
            }
          } else {
            if (subTarget) subTarget.classList.remove('subtracted');
            if (subSub) {
              subSub.style.opacity = '0';
              subSub.style.transform = 'translateY(20px)';
            }
          }
        }

        // --- L17_SwipeDismiss (放心滑過去：卡片向左滑走) ---
        if (s.layout === 'L17_SwipeDismiss') {
          const sCard = document.getElementById(`swipe-card-${idx}`);
          const sFUp = document.getElementById(`swipe-followup-${idx}`);
          if (lineIdx >= 1) {
            if (sCard) sCard.classList.add('swiped');
            if (sFUp) sFUp.classList.add('visible');
          } else {
            if (sCard) sCard.classList.remove('swiped');
            if (sFUp) sFUp.classList.remove('visible');
          }
        }

        // Trigger Confetti on Outro or when explicitly configured
        if ((s.layout === 'L08_OutroCTA' || s.confetti) && !s._confettiFired) {
          s._confettiFired = true;
          triggerConfetti();
        }

      } else {
        if (el.classList.contains('active')) {
          el.classList.remove('active');
          el.classList.add('exiting');
        }
      }
    });

    // 2. Subtitle update
    let currentSubtitle = null;
    if (project.subtitles) {
      for (const sub of project.subtitles) {
        if (t >= sub.start && t <= sub.end) {
          currentSubtitle = sub.text;
          break;
        }
      }
    }

    if (currentSubtitle) {
      subtitlePill.textContent = currentSubtitle;
      subtitlePill.classList.add('visible');
    } else {
      subtitlePill.classList.remove('visible');
    }

    // Check completion
    if (t >= (project.totalDuration || 10)) {
      window.__IS_RECORDING_FINISHED__ = true;
    }
  };

  window.startPlayback = function () {
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().then(() => {
      function loop() {
        window.updateAtTime(audio.currentTime);
        if (!audio.ended && !window.__IS_RECORDING_FINISHED__) {
          requestAnimationFrame(loop);
        } else {
          window.__IS_RECORDING_FINISHED__ = true;
        }
      }
      requestAnimationFrame(loop);
    }).catch(e => {
      console.warn("Audio autoplay blocked or missing narration file, running timer mode:", e);
      let startTime = performance.now();
      function timerLoop(now) {
        let elapsed = (now - startTime) / 1000;
        window.updateAtTime(elapsed);
        if (elapsed < project.totalDuration) {
          requestAnimationFrame(timerLoop);
        } else {
          window.__IS_RECORDING_FINISHED__ = true;
        }
      }
      requestAnimationFrame(timerLoop);
    });
  };

  window.initProject = function (data) {
    project = data;
    window.videoProject = data;
    renderDOM();
    window.updateAtTime(0);
  };

  if (window.videoProject) {
    window.initProject(window.videoProject);
  }

  document.body.addEventListener('click', () => {
    window.startPlayback();
  });
})();
