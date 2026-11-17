document.addEventListener('DOMContentLoaded', () => {
  /* 1. 全局鼠标流光追踪 & 极简星空连线背景 */
  const spotlight = document.getElementById('mouseSpotlight');
  if (spotlight) {
    window.addEventListener(
      'mousemove',
      (e) => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
      },
      { passive: true }
    );
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('particleCanvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      let w = 0;
      let h = 0;
      const particles = [];

      const resize = () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
      };

      window.addEventListener('resize', resize, { passive: true });
      resize();

      const count = Math.min(36, Math.floor(w / 40));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.5 + 0.6
        });
      }

      let rafId = 0;
      const draw = () => {
        if (document.hidden) return;
        ctx.clearRect(0, 0, w, h);
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        ctx.fillStyle = isLight ? 'rgba(2, 132, 199, 0.35)' : 'rgba(56, 189, 248, 0.4)';

        particles.forEach((p, idx) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();

          for (let j = idx + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 130) {
              ctx.strokeStyle = isLight
                ? `rgba(2, 132, 199, ${0.12 * (1 - dist / 130)})`
                : `rgba(56, 189, 248, ${0.15 * (1 - dist / 130)})`;
              ctx.lineWidth = 0.7;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        });

        rafId = requestAnimationFrame(draw);
      };

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (rafId) cancelAnimationFrame(rafId);
        } else {
          rafId = requestAnimationFrame(draw);
        }
      });

      draw();
    }
  }

  /* 2. 主题切换 & 移动端菜单 */
  const themeToggle = document.getElementById('themeToggle');
  themeToggle?.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('tracelight_theme', next);
    } catch {}
  });

  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');
  mobileMenuBtn?.addEventListener('click', () => {
    const isOpen = mainNav?.classList.toggle('open');
    mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.getElementById('backToTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* 3. Cmd/Ctrl + K 全局搜索模态框 */
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchInput');
  const openSearch = () => {
    searchModal?.classList.add('open');
    setTimeout(() => searchInput?.focus(), 50);
  };
  const closeSearch = () => searchModal?.classList.remove('open');

  document.getElementById('searchTrigger')?.addEventListener('click', openSearch);
  document.getElementById('closeSearch')?.addEventListener('click', closeSearch);
  searchModal?.addEventListener('click', (e) => {
    if (e.target === searchModal) closeSearch();
  });

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape') {
      closeSearch();
      document.getElementById('rewardModal')?.classList.remove('open');
      document.getElementById('lightboxOverlay')?.classList.remove('open');
    }
  });

  /* 4. 自适应代码高亮框（由后台主题配置控制风格 + 语言标签 + 一键复制） */
  const CODE_THEME_URLS = {
    'tokyo-night': 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/tokyo-night-dark.min.css',
    'github-dark': 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css',
    'one-dark': 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css',
    dracula: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/base16/dracula.min.css',
    nord: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/nord.min.css',
    'monokai-sublime': 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/monokai-sublime.min.css',
    'night-owl': 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/night-owl.min.css',
    'solarized-dark': 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/base16/solarized-dark.min.css',
    vs2015: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/vs2015.min.css',
    'github-light': 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css'
  };

  const backendCodeTheme = document.body.dataset.defaultCodeTheme || 'tokyo-night';
  const validCodeTheme = CODE_THEME_URLS[backendCodeTheme] ? backendCodeTheme : 'tokyo-night';
  document.documentElement.setAttribute('data-code-theme', validCodeTheme);
  const hljsLink = document.getElementById('hljsThemeStylesheet');
  if (hljsLink instanceof HTMLLinkElement && hljsLink.href !== CODE_THEME_URLS[validCodeTheme]) {
    hljsLink.href = CODE_THEME_URLS[validCodeTheme];
  }

  document.querySelectorAll('.markdown-body pre code').forEach((codeEl) => {
    if (window.hljs) window.hljs.highlightElement(codeEl);
    const pre = codeEl.parentElement;
    if (!pre || pre.parentElement?.classList.contains('code-block-wrap')) return;

    const langMatch = codeEl.className.match(/language-([a-zA-Z0-9_+-]+)/);
    const lang = langMatch ? langMatch[1] : 'CODE';

    const wrap = document.createElement('div');
    wrap.className = 'code-block-wrap';

    const header = document.createElement('div');
    header.className = 'code-block-header';

    const langSpan = document.createElement('span');
    langSpan.className = 'code-lang';
    langSpan.textContent = lang;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-code-btn';
    copyBtn.type = 'button';
    copyBtn.textContent = '复制';
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codeEl.textContent || '');
        copyBtn.textContent = '已复制';
        setTimeout(() => {
          copyBtn.textContent = '复制';
        }, 1800);
      } catch {
        copyBtn.textContent = '复制失败';
      }
    });

    header.appendChild(langSpan);
    header.appendChild(copyBtn);

    pre.parentNode?.insertBefore(wrap, pre);
    wrap.appendChild(header);
    wrap.appendChild(pre);
  });

  /* 4.5 评论区表情自选框与 AJAX 无刷新提交 */
  const closeAllEmojiPopovers = () => {
    const popover = document.getElementById('commentEmojiPopover');
    const toggle = document.getElementById('emojiPickerToggle');
    popover?.classList.remove('open');
    toggle?.classList.remove('active');
    toggle?.setAttribute('aria-expanded', 'false');
  };

  document.addEventListener('click', (e) => {
    const wrap = document.getElementById('emojiPickerWrap');
    if (wrap && e.target instanceof Node && !wrap.contains(e.target)) {
      closeAllEmojiPopovers();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllEmojiPopovers();
  });

  const bindCommentEmojiPicker = () => {
    const emojiToggleBtn = document.getElementById('emojiPickerToggle');
    const emojiPopover = document.getElementById('commentEmojiPopover');
    const formEl = emojiToggleBtn?.closest('form');
    const commentTextarea =
      document.getElementById('textarea') ||
      formEl?.querySelector('textarea[name="text"]');
    if (!emojiToggleBtn || !emojiPopover || emojiToggleBtn.dataset.emojiBound === '1') return;
    emojiToggleBtn.dataset.emojiBound = '1';

    let hasUserSelection = false;
    if (commentTextarea instanceof HTMLTextAreaElement) {
      ['focus', 'click', 'keyup', 'select'].forEach((evt) => {
        commentTextarea.addEventListener(evt, () => {
          hasUserSelection = true;
        });
      });
    }

    emojiToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !emojiPopover.classList.contains('open');
      emojiPopover.classList.toggle('open', willOpen);
      emojiToggleBtn.classList.toggle('active', willOpen);
      emojiToggleBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });

    emojiPopover.querySelectorAll('.emoji-tab').forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetCat = tab.getAttribute('data-emoji-cat');
        if (!targetCat) return;
        emojiPopover.querySelectorAll('.emoji-tab').forEach((t) => {
          const isMatch = t === tab;
          t.classList.toggle('active', isMatch);
          t.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        });
        emojiPopover.querySelectorAll('.emoji-panel').forEach((p) => {
          p.classList.toggle('active', p.getAttribute('data-emoji-panel') === targetCat);
        });
      });
    });

    emojiPopover.querySelectorAll('.emoji-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const emoji = btn.getAttribute('data-emoji') || '';
        if (!emoji || !(commentTextarea instanceof HTMLTextAreaElement)) return;
        const val = commentTextarea.value;
        const start = hasUserSelection
          ? commentTextarea.selectionStart ?? val.length
          : val.length;
        const end = hasUserSelection
          ? commentTextarea.selectionEnd ?? val.length
          : val.length;
        commentTextarea.value = val.slice(0, start) + emoji + val.slice(end);
        const nextPos = start + emoji.length;
        hasUserSelection = true;
        commentTextarea.focus();
        commentTextarea.setSelectionRange(nextPos, nextPos);
        commentTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        closeAllEmojiPopovers();
      });
    });
  };
  bindCommentEmojiPicker();

  /* 4.6 评论表单 AJAX 提交优化（带节流冷却与无刷新局部更新） */
  let lastCommentSubmitTime = 0;
  const bindAjaxCommentForm = () => {
    const commentForm = document.getElementById('comment-form');
    if (!(commentForm instanceof HTMLFormElement) || commentForm.dataset.ajaxBound === '1') return;
    commentForm.dataset.ajaxBound = '1';

    commentForm.addEventListener('submit', async (e) => {
      const action = commentForm.getAttribute('action');
      if (!action) return;
      e.preventDefault();

      const now = Date.now();
      const feedbackEl = document.getElementById('commentStatusFeedback');
      const submitBtn = document.getElementById('commentSubmitBtn');
      if (now - lastCommentSubmitTime < 3000) {
        if (feedbackEl) {
          feedbackEl.textContent = '请求过于频繁，请 3 秒后再试';
          feedbackEl.className = 'comment-feedback is-error mono text-xs';
        }
        return;
      }

      if (submitBtn instanceof HTMLButtonElement) {
        submitBtn.disabled = true;
        submitBtn.textContent = '发送中...';
      }
      if (feedbackEl) {
        feedbackEl.textContent = '正在提交评论...';
        feedbackEl.className = 'comment-feedback mono text-xs';
      }

      try {
        const formData = new FormData(commentForm);
        const res = await fetch(action, {
          method: 'POST',
          body: formData,
          credentials: 'same-origin'
        });
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const nextComments = doc.getElementById('comments');
        const curComments = document.getElementById('comments');

        if (nextComments && curComments) {
          curComments.replaceWith(nextComments);
          lastCommentSubmitTime = Date.now();
          const newFeedback = document.getElementById('commentStatusFeedback');
          if (newFeedback) {
            newFeedback.textContent = '✓ 评论已提交';
            newFeedback.className = 'comment-feedback is-success mono text-xs';
          }
          bindCommentEmojiPicker();
          bindAjaxCommentForm();
        } else {
          const errTitle = doc.querySelector('.container, body')?.textContent?.trim().slice(0, 80);
          if (feedbackEl) {
            feedbackEl.textContent = errTitle || '评论提交未完成，请检查表单项后重试';
            feedbackEl.className = 'comment-feedback is-error mono text-xs';
          }
        }
      } catch {
        commentForm.submit();
      } finally {
        const btn = document.getElementById('commentSubmitBtn');
        if (btn instanceof HTMLButtonElement) {
          btn.disabled = false;
          btn.textContent = '发送评论 →';
        }
      }
    });
  };
  bindAjaxCommentForm();

  /* 5. 右侧悬浮目录树 (TOC) & 阅读进度条 */
  const articleContent = document.getElementById('articleContent');
  const tocContainer = document.getElementById('tocContainer');
  const progressBar = document.getElementById('readingProgress');
  const tocPercent = document.getElementById('tocPercent');

  if (articleContent && tocContainer) {
    const headings = articleContent.querySelectorAll('h2, h3');
    if (headings.length === 0) {
      tocContainer.innerHTML = '<span class="muted text-xs mono">暂无目录节点</span>';
    } else {
      headings.forEach((h, i) => {
        if (!h.id) h.id = `heading-${i}`;
        const link = document.createElement('a');
        link.href = `#${h.id}`;
        link.className = `toc-link level-${h.tagName.slice(1)}`;
        link.textContent = h.textContent;
        tocContainer.appendChild(link);
      });

      const tocLinks = tocContainer.querySelectorAll('.toc-link');
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              tocLinks.forEach((l) => l.classList.remove('active'));
              const active = tocContainer.querySelector(`a[href="#${entry.target.id}"]`);
              active?.classList.add('active');
            }
          });
        },
        { rootMargin: '-80px 0px -70% 0px' }
      );
      headings.forEach((h) => observer.observe(h));
    }
  }

  if (progressBar) {
    window.addEventListener(
      'scroll',
      () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? Math.min(100, Math.round((window.scrollY / docHeight) * 100)) : 0;
        progressBar.style.width = `${pct}%`;
        if (tocPercent) tocPercent.textContent = `${pct}%`;
      },
      { passive: true }
    );
  }

  /* 6. 图片灯箱预览（支持文章配图 & 碎碎念多图） */
  const lightbox = document.getElementById('lightboxOverlay');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');

  const bindLightbox = (root = document) => {
    root.querySelectorAll('.markdown-body img, .moment-photo').forEach((img) => {
      if (img.dataset.lbBound) return;
      img.dataset.lbBound = '1';
      img.addEventListener('click', () => {
        if (!lightbox || !lightboxImg || !lightboxCaption) return;
        lightboxImg.setAttribute('src', img.getAttribute('src') || '');
        lightboxCaption.textContent = img.getAttribute('alt') || '';
        lightbox.classList.add('open');
      });
    });
  };
  bindLightbox();

  lightbox?.addEventListener('click', () => lightbox.classList.remove('open'));

  /* 7. 文章 AJAX 点赞、打赏模态框与微信二维码/链接分享 */
  const likeBtn = document.getElementById('likeBtn');
  if (likeBtn) {
    const cid = likeBtn.dataset.cid;
    if (cid && localStorage.getItem(`liked_${cid}`)) {
      likeBtn.classList.add('liked');
    }

    likeBtn.addEventListener('click', async () => {
      if (!cid || likeBtn.classList.contains('liked')) return;
      const formData = new FormData();
      formData.append('do', 'like');
      formData.append('cid', cid);

      try {
        const res = await fetch(window.location.href, { method: 'POST', body: formData });
        const data = await res.json();
        if (data.status === 'success') {
          const countEl = document.getElementById('likeCount');
          if (countEl) countEl.textContent = String(data.likes);
          likeBtn.classList.add('liked');
          localStorage.setItem(`liked_${cid}`, '1');
        }
      } catch (err) {
        console.error('Like request failed:', err);
      }
    });
  }

  const wechatShareBtn = document.getElementById('wechatShareBtn');
  const wechatQrBox = document.getElementById('wechatQrBox');
  const shareFeedback = document.getElementById('shareFeedback');
  const copyPostLinkBtn = document.getElementById('copyPostLinkBtn');

  if (wechatShareBtn && wechatQrBox) {
    wechatShareBtn.addEventListener('click', () => {
      const isOpen = wechatQrBox.classList.toggle('open');
      if (isOpen && !wechatQrBox.dataset.rendered) {
        const url = wechatShareBtn.dataset.url || window.location.href;
        const title = wechatShareBtn.dataset.title || document.title;
        wechatQrBox.dataset.rendered = '1';
        wechatQrBox.innerHTML = `
          <div class="mono text-xs">
            <strong style="color:#07c160;">微信分享</strong>
            <p class="muted" style="margin-top:4px;">请复制下方链接在微信中发送给好友或分享到朋友圈：</p>
            <code style="display:block;margin-top:6px;word-break:break-all;color:var(--text-primary);">${title} — ${url}</code>
          </div>
        `;
      }
    });
  }

  if (copyPostLinkBtn) {
    copyPostLinkBtn.addEventListener('click', async () => {
      const url = copyPostLinkBtn.dataset.url || window.location.href;
      try {
        await navigator.clipboard.writeText(url);
        if (shareFeedback) shareFeedback.textContent = '✓ 原文链接已复制';
        setTimeout(() => {
          if (shareFeedback) shareFeedback.textContent = '';
        }, 2000);
      } catch {}
    });
  }

  const rewardModal = document.getElementById('rewardModal');
  document.getElementById('rewardTrigger')?.addEventListener('click', () => rewardModal?.classList.add('open'));
  document.getElementById('closeReward')?.addEventListener('click', () => rewardModal?.classList.remove('open'));
  rewardModal?.addEventListener('click', (e) => {
    if (e.target === rewardModal) rewardModal.classList.remove('open');
  });

  document.querySelectorAll('.reward-tabs .tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.reward-tabs .tab-btn, .qr-panel').forEach((el) => el.classList.remove('active'));
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      if (targetId) document.getElementById(targetId)?.classList.add('active');
    });
  });

  /* 8. 碎碎念（Moments）支持最多 9 张配图的朋友圈发布器 */
  const momentForm = document.getElementById('momentForm');
  const momentFilePicker = document.getElementById('momentFilePicker');
  const momentUrlInput = document.getElementById('momentImageUrlInput');
  const momentAddUrlBtn = document.getElementById('momentAddUrlBtn');
  const momentPreviews = document.getElementById('momentImagePreviews');
  const momentLocationInput = document.getElementById('momentLocationInput');
  let draftImages = [];

  const renderDraftImages = () => {
    if (!momentPreviews) return;
    momentPreviews.innerHTML = '';
    draftImages.forEach((src, idx) => {
      const item = document.createElement('div');
      item.className = 'composer-preview-item';
      const img = document.createElement('img');
      img.src = src;
      img.alt = `待发布配图 ${idx + 1}`;
      const rm = document.createElement('button');
      rm.type = 'button';
      rm.className = 'composer-preview-remove';
      rm.textContent = '×';
      rm.setAttribute('aria-label', '移除图片');
      rm.addEventListener('click', () => {
        draftImages.splice(idx, 1);
        renderDraftImages();
      });
      item.appendChild(img);
      item.appendChild(rm);
      momentPreviews.appendChild(item);
    });
  };

  if (momentFilePicker instanceof HTMLInputElement) {
    momentFilePicker.addEventListener('change', () => {
      const files = Array.from(momentFilePicker.files || []);
      files.slice(0, Math.max(0, 9 - draftImages.length)).forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string' && draftImages.length < 9) {
            draftImages.push(reader.result);
            renderDraftImages();
          }
        };
        reader.readAsDataURL(file);
      });
      momentFilePicker.value = '';
    });
  }

  momentAddUrlBtn?.addEventListener('click', () => {
    if (!(momentUrlInput instanceof HTMLInputElement)) return;
    const u = momentUrlInput.value.trim();
    if (!u || draftImages.length >= 9) return;
    draftImages.push(u);
    momentUrlInput.value = '';
    renderDraftImages();
  });

  if (momentForm) {
    momentForm.addEventListener('submit', (e) => {
      const input = document.getElementById('momentInput');
      if (!(input instanceof HTMLTextAreaElement)) return;
      const val = input.value.trim();
      if (!val && draftImages.length === 0) {
        e.preventDefault();
        return;
      }

      // 若是博主已登录直接提交到 Typecho 评论表，则把配图与地点拼接为标准 Markdown 一并入库
      if (momentForm.getAttribute('action')) {
        const loc = momentLocationInput instanceof HTMLInputElement ? momentLocationInput.value.trim() : '';
        const imgMd = draftImages.map((src) => `\n![moment](${src})`).join('');
        const locStr = loc ? `\n📍 ${loc}` : '';
        input.value = `${val}${locStr}${imgMd}`;
        return;
      }

      e.preventDefault();
      const feed = document.getElementById('momentsFeed');
      if (!feed) return;

      const loc = momentLocationInput instanceof HTMLInputElement ? momentLocationInput.value.trim() : '';
      const card = document.createElement('article');
      card.className = 'bento-card moment-card spotlight-card';
      const escaped = val
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/#(\S+)/g, '<span class="accent">#$1</span>');

      const galleryClass =
        draftImages.length === 1
          ? 'moment-gallery-1'
          : draftImages.length === 2 || draftImages.length === 4
          ? 'moment-gallery-2'
          : 'moment-gallery-3';

      const galleryHtml = draftImages.length
        ? `<div class="moment-gallery ${galleryClass}">${draftImages
            .map((src) => `<img src="${src.replace(/"/g, '&quot;')}" alt="碎碎念配图" class="moment-photo">`)
            .join('')}</div>`
        : '';

      card.innerHTML = `
        <div class="moment-card-header">
          <div class="mini-avatar" style="background:var(--accent);display:flex;align-items:center;justify-content:center;color:#000;font-weight:700;font-size:12px;">您</div>
          <div class="moment-author-meta">
            <span class="author-name">访客浏览器 <span class="badge-admin mono">预览</span></span>
            <span class="mono text-xs muted">刚刚 · 本地体验模式${loc ? ` · 📍 ${loc.replace(/</g, '&lt;')}` : ''}</span>
          </div>
        </div>
        <div class="moment-content"><p>${escaped}</p></div>
        ${galleryHtml}
      `;
      feed.prepend(card);
      bindLightbox(card);
      input.value = '';
      if (momentLocationInput instanceof HTMLInputElement) momentLocationInput.value = '';
      draftImages = [];
      renderDraftImages();
    });
  }

  /* 9. 时光归档：支持年份切换与月份坐标的 GitHub 写作热力图 */
  const heatmapEl = document.getElementById('writingHeatmap');
  const heatmapMonths = document.getElementById('heatmapMonths');
  const heatmapYearBar = document.getElementById('heatmapYearBar');
  const heatmapYearSummary = document.getElementById('heatmapYearSummary');

  if (heatmapEl) {
    let stats = {};
    try {
      stats = JSON.parse(heatmapEl.dataset.stats || '{}');
    } catch {}
    const tooltip = document.getElementById('heatmapTooltip');

    const formatLocalYMD = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    const renderHeatmap = (mode) => {
      heatmapEl.innerHTML = '';
      if (heatmapMonths) heatmapMonths.innerHTML = '';

      let startDate;
      let endDate;
      const today = new Date();

      if (mode === 'rolling') {
        endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 364);
      } else {
        const yr = parseInt(mode, 10) || today.getFullYear();
        startDate = new Date(yr, 0, 1);
        endDate = new Date(yr, 11, 31);
      }

      // 将起点对齐到周一（使得每列固定为 7 天周矩阵）
      const startDay = (startDate.getDay() + 6) % 7;
      const gridStart = new Date(startDate);
      gridStart.setDate(startDate.getDate() - startDay);

      const totalDays = Math.ceil((endDate.getTime() - gridStart.getTime()) / 86400000) + 1;
      const totalCols = Math.ceil(totalDays / 7);
      heatmapEl.style.gridTemplateColumns = `repeat(${totalCols}, var(--hm-cell, 16px))`;
      if (heatmapMonths) {
        heatmapMonths.style.gridTemplateColumns = `repeat(${totalCols}, var(--hm-cell, 16px))`;
      }

      let rangePosts = 0;
      let rangeWords = 0;
      let lastMonth = -1;

      for (let c = 0; c < totalCols; c++) {
        const colDate = new Date(gridStart);
        colDate.setDate(gridStart.getDate() + c * 7);
        if (heatmapMonths) {
          const monthLabel = document.createElement('span');
          const m = colDate.getMonth();
          if (colDate >= startDate && m !== lastMonth) {
            monthLabel.textContent = `${m + 1}月`;
            lastMonth = m;
          }
          heatmapMonths.appendChild(monthLabel);
        }

        for (let r = 0; r < 7; r++) {
          const d = new Date(gridStart);
          d.setDate(gridStart.getDate() + c * 7 + r);
          const dateStr = formatLocalYMD(d);
          const inRange = d >= startDate && d <= endDate;
          const info = inRange ? stats[dateStr] : null;

          if (info) {
            rangePosts += info.count;
            rangeWords += info.words;
          }

          let level = 0;
          if (info) {
            if (info.words > 3000 || info.count >= 3) level = 4;
            else if (info.words > 1500 || info.count === 2) level = 3;
            else if (info.words > 500) level = 2;
            else level = 1;
          }

          const cell = document.createElement('span');
          cell.className = `cell l${level}`;
          if (!inRange) cell.style.opacity = '0.25';
          cell.title = info ? `${dateStr}: ${info.count} 篇 / ${info.words} 字` : `${dateStr}: 无文章`;
          cell.addEventListener('mouseenter', () => {
            if (tooltip) {
              tooltip.textContent = info
                ? `${dateStr}：发布了 ${info.count} 篇文章，共 ${info.words} 字`
                : `${dateStr}：暂无文章发布`;
            }
          });
          heatmapEl.appendChild(cell);
        }
      }

      if (heatmapYearSummary) {
        const rangeLabel =
          mode === 'rolling'
            ? `${formatLocalYMD(startDate)} ~ ${formatLocalYMD(endDate)}`
            : `${mode} 年度 (${mode}-01-01 ~ ${mode}-12-31)`;
        heatmapYearSummary.textContent = `${rangeLabel} · ${rangePosts} 篇 / ${rangeWords.toLocaleString()} 字`;
      }
    };

    renderHeatmap('rolling');
    heatmapYearBar?.querySelectorAll('[data-heatmap-year]').forEach((btn) => {
      btn.addEventListener('click', () => {
        heatmapYearBar.querySelectorAll('.cat-tab').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const yr = btn.getAttribute('data-heatmap-year') || 'rolling';
        renderHeatmap(yr);
      });
    });
  }

  /* 10. 友邻卡片在线状态延迟检测（轻量 Favicon Ping） */
  document.querySelectorAll('.link-card[data-ping-url]').forEach((card) => {
    const url = card.getAttribute('data-ping-url');
    const latencyEl = card.querySelector('.latency-text');
    if (!url || !latencyEl) return;

    const start = performance.now();
    const img = new Image();
    const done = () => {
      const ms = Math.min(999, Math.max(1, Math.round(performance.now() - start)));
      latencyEl.textContent = `${ms}ms · Online`;
    };
    img.onload = done;
    img.onerror = done;

    try {
      const origin = new URL(url).origin;
      img.src = `${origin}/favicon.ico?t=${Date.now()}`;
    } catch {}
  });

  /* 11. 书签库分类与搜索过滤 */
  const bmFilterBar = document.getElementById('bookmarkFilterBar');
  const bmSearch = document.getElementById('bookmarkSearch');
  const bmCards = document.querySelectorAll('.bookmark-card');
  if (bmCards.length > 0) {
    let activeCat = 'all';
    const applyBookmarkFilter = () => {
      const q = (bmSearch?.value || '').trim().toLowerCase();
      bmCards.forEach((card) => {
        const matchCat = activeCat === 'all' || card.getAttribute('data-cat') === activeCat;
        const matchQuery = !q || (card.getAttribute('data-search') || '').includes(q);
        if (card instanceof HTMLElement) {
          card.style.display = matchCat && matchQuery ? '' : 'none';
        }
      });
    };

    bmFilterBar?.querySelectorAll('[data-bm-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        bmFilterBar.querySelectorAll('.cat-tab').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeCat = btn.getAttribute('data-bm-cat') || 'all';
        applyBookmarkFilter();
      });
    });

    bmSearch?.addEventListener('input', applyBookmarkFilter);
  }

  /* 12. 实验室项目状态筛选 */
  const projFilterBar = document.getElementById('projectFilterBar');
  const projCards = document.querySelectorAll('.lab-card');
  if (projFilterBar && projCards.length > 0) {
    projFilterBar.querySelectorAll('[data-proj-status]').forEach((btn) => {
      btn.addEventListener('click', () => {
        projFilterBar.querySelectorAll('.cat-tab').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const status = btn.getAttribute('data-proj-status') || 'all';
        projCards.forEach((card) => {
          const match = status === 'all' || card.getAttribute('data-status') === status;
          if (card instanceof HTMLElement) {
            card.style.display = match ? '' : 'none';
          }
        });
      });
    });
  }
});
