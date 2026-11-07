(() => {
  'use strict';

  const searchInput = document.getElementById('service-search');
  const filterButtons = Array.from(document.querySelectorAll('.filter-chip'));
  const cards = Array.from(document.querySelectorAll('.service-card'));
  const sections = Array.from(document.querySelectorAll('.service-section'));
  const resultCount = document.getElementById('result-count');
  const noResults = document.getElementById('no-results');
  const resetButton = document.getElementById('reset-search');

  if (!searchInput || !cards.length) return;

  let activeFilter = 'all';
  const pluralize = (count) => {
    if (count % 10 === 1 && count % 100 !== 11) return 'сервис';
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'сервиса';
    return 'сервисов';
  };

  const updateResults = () => {
    const query = searchInput.value.trim().toLocaleLowerCase('ru');
    let visibleCount = 0;

    cards.forEach((card) => {
      const categoryMatches = activeFilter === 'all' || card.dataset.category === activeFilter;
      const textMatches = card.textContent.toLocaleLowerCase('ru').includes(query);
      const visible = categoryMatches && textMatches;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    sections.forEach((section) => {
      section.hidden = !section.querySelector('.service-card:not([hidden])');
    });

    resultCount.textContent = String(visibleCount);
    const countLabel = document.querySelector('.result-counter span');
    if (countLabel) countLabel.textContent = pluralize(visibleCount);
    noResults.hidden = visibleCount !== 0;
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter || 'all';
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      updateResults();
    });
  });

  searchInput.addEventListener('input', updateResults);
  resetButton?.addEventListener('click', () => {
    searchInput.value = '';
    activeFilter = 'all';
    filterButtons.forEach((button) => {
      const active = button.dataset.filter === 'all';
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    updateResults();
    searchInput.focus();
  });

  document.addEventListener('keydown', (event) => {
    const target = event.target;
    const typing = target instanceof HTMLElement && (
      target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
    );
    if (event.key === '/' && !typing && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      searchInput.focus();
    }
  });

  updateResults();
})();
