/**
 * NexDrive Multi-Currency Conversion Engine
 * Primary / Default Currency: PKR (₨ - Pakistani Rupee)
 * Supports live conversion across USD, EUR, GBP, AED, SAR
 * Stores base price in PKR and calculates converted display estimates
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CurrencyEngine = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Verified baseline exchange rates (1 PKR = rateFromPKR in target currency)
  const RATES = {
    PKR: { code: 'PKR', symbol: '₨ ', name: 'Pakistani Rupee', flag: '🇵🇰', rateFromPKR: 1, decimals: 0, isBase: true },
    USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rateFromPKR: 1 / 280, decimals: 2, isBase: false },
    EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rateFromPKR: 1 / 305, decimals: 2, isBase: false },
    GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', rateFromPKR: 1 / 360, decimals: 2, isBase: false },
    AED: { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', flag: '🇦🇪', rateFromPKR: 1 / 76.5, decimals: 2, isBase: false },
    SAR: { code: 'SAR', symbol: 'SAR ', name: 'Saudi Riyal', flag: '🇸🇦', rateFromPKR: 1 / 74.8, decimals: 2, isBase: false }
  };

  const STORAGE_KEY = 'nexdrive_currency';
  const RATES_CACHE_KEY = 'nexdrive_cached_rates';
  const DEFAULT_CURRENCY = 'PKR';

  // Restore any cached live rates if available and valid (< 24 hours)
  try {
    const cached = localStorage.getItem(RATES_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.timestamp && (Date.now() - parsed.timestamp < 86400000) && parsed.rates) {
        ['USD', 'EUR', 'GBP', 'AED', 'SAR'].forEach(code => {
          if (parsed.rates[code] && parsed.rates[code] > 0) {
            RATES[code].rateFromPKR = parsed.rates[code];
          }
        });
      }
    }
  } catch (e) {}

  // Fetch fresh rates in background without blocking UI
  async function fetchLiveRates() {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/PKR');
      if (res.ok) {
        const data = await res.json();
        if (data && data.rates) {
          const freshRates = {};
          ['USD', 'EUR', 'GBP', 'AED', 'SAR'].forEach(code => {
            if (data.rates[code] && data.rates[code] > 0) {
              RATES[code].rateFromPKR = data.rates[code];
              freshRates[code] = data.rates[code];
            }
          });
          try {
            localStorage.setItem(RATES_CACHE_KEY, JSON.stringify({
              timestamp: Date.now(),
              rates: freshRates
            }));
          } catch (e) {}
          applyToPage();
        }
      }
    } catch (err) {
      // Offline or network error: retain reliable baseline rates gracefully
    }
  }

  function getActiveCurrency() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && RATES[saved]) return saved;
    } catch (e) {}
    return DEFAULT_CURRENCY;
  }

  function setActiveCurrency(code) {
    if (!RATES[code]) code = DEFAULT_CURRENCY;
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch (e) {}

    applyToPage();

    document.dispatchEvent(new CustomEvent('currencychange', {
      detail: {
        currency: code,
        info: RATES[code],
        isBase: code === 'PKR'
      }
    }));
  }

  function convertFromPKR(pkrAmount, targetCode) {
    const code = targetCode || getActiveCurrency();
    const config = RATES[code] || RATES.PKR;
    const num = parseFloat(pkrAmount) || 0;
    return num * config.rateFromPKR;
  }

  function format(pkrAmount, targetCode) {
    const code = targetCode || getActiveCurrency();
    const config = RATES[code] || RATES.PKR;
    const converted = convertFromPKR(pkrAmount, code);

    const formattedNum = converted.toLocaleString('en-US', {
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals
    });

    return `${config.symbol}${formattedNum}`;
  }

  function formatRange(minPkr, maxPkr, targetCode) {
    const code = targetCode || getActiveCurrency();
    return `${format(minPkr, code)} – ${format(maxPkr, code)}`;
  }

  function isBaseCurrency() {
    return getActiveCurrency() === 'PKR';
  }

  function getDisclaimer() {
    const cur = getActiveCurrency();
    if (cur === 'PKR') return 'Official Base Pricing (PKR)';
    return `Approximate conversion at current rate. Official invoice billed in PKR.`;
  }

  function renderSwitcher(container) {
    if (!container) return;
    const current = getActiveCurrency();

    container.innerHTML = `
      <div class="currency-picker-wrap" style="position: relative; display: inline-flex; align-items: center; font-family: var(--font-family-base, sans-serif);">
        <label for="currency-select-box" class="sr-only" style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0;">Select Currency</label>
        <select id="currency-select-box" class="currency-select" aria-label="Select Currency" style="
          background: rgba(16, 42, 66, 0.9);
          color: #F59E0B;
          border: 1px solid rgba(245, 158, 11, 0.4);
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          outline: none;
          backdrop-filter: blur(8px);
          transition: all 0.2s ease;
        ">
          ${Object.keys(RATES).map(k => {
            const r = RATES[k];
            const sel = k === current ? 'selected' : '';
            return `<option value="${r.code}" ${sel} style="background: #0B1D2D; color: #FFFFFF;">${r.flag} ${r.code} (${r.symbol.trim()})</option>`;
          }).join('')}
        </select>
      </div>
    `;

    const select = container.querySelector('#currency-select-box');
    if (select) {
      select.addEventListener('change', (e) => {
        setActiveCurrency(e.target.value);
      });
      select.addEventListener('mouseenter', () => {
        select.style.borderColor = '#F59E0B';
        select.style.boxShadow = '0 0 10px rgba(245, 158, 11, 0.35)';
      });
      select.addEventListener('mouseleave', () => {
        select.style.borderColor = 'rgba(245, 158, 11, 0.4)';
        select.style.boxShadow = 'none';
      });
    }
  }

  function applyToPage() {
    const current = getActiveCurrency();

    // 1. Update elements with data-price-pkr
    const singlePriceEls = document.querySelectorAll('[data-price-pkr]');
    singlePriceEls.forEach(el => {
      const pkr = el.getAttribute('data-price-pkr');
      if (pkr) {
        const suffix = el.getAttribute('data-price-suffix') || '';
        el.textContent = `${format(pkr, current)}${suffix}`;
      }
    });

    // 2. Update elements with range data-price-min-pkr & data-price-max-pkr
    const rangeEls = document.querySelectorAll('[data-price-min-pkr]');
    rangeEls.forEach(el => {
      const min = el.getAttribute('data-price-min-pkr');
      const max = el.getAttribute('data-price-max-pkr');
      const suffix = el.getAttribute('data-price-suffix') || '';
      if (min && max) {
        el.textContent = `${formatRange(min, max, current)}${suffix}`;
      }
    });

    // 3. Sync select box value if it exists
    const selects = document.querySelectorAll('#currency-select-box, .currency-select');
    selects.forEach(s => {
      if (s.value !== current) s.value = current;
    });

    // 4. Update currency notice elements
    const noticeEls = document.querySelectorAll('.currency-conversion-notice');
    noticeEls.forEach(n => {
      n.textContent = getDisclaimer();
      n.style.display = current === 'PKR' ? 'none' : 'block';
    });
  }

  // Auto-initialize when DOM is ready
  function init() {
    let container = document.getElementById('currency-picker-mount');
    if (!container) {
      const headerAction = document.querySelector('.header-action') || document.querySelector('.site-nav');
      if (headerAction) {
        container = document.createElement('div');
        container.id = 'currency-picker-mount';
        container.className = 'currency-picker-container';
        container.style.display = 'inline-flex';
        container.style.alignItems = 'center';
        container.style.marginRight = '12px';
        headerAction.parentNode.insertBefore(container, headerAction);
      }
    }

    if (container) {
      renderSwitcher(container);
    }

    applyToPage();

    // Fetch updated live rates in the background
    if (typeof window !== 'undefined' && window.fetch) {
      fetchLiveRates();
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  return {
    RATES,
    get: getActiveCurrency,
    set: setActiveCurrency,
    convert: convertFromPKR,
    format,
    formatRange,
    isBaseCurrency,
    getDisclaimer,
    renderSwitcher,
    apply: applyToPage,
    init
  };
});
