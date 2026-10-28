// ==============================================================================
// NexDrive USB Products Management System - Admin Dashboard Client Logic
// Vanilla JS with Native REST API Integration & Instant Image Upload
// ==============================================================================

(function() {
  'use strict';

  // State
  let products = [];
  let currentView = 'table'; // 'table' or 'grid'
  let editingProductId = null;
  let deletingProductId = null;
  let uploadedImageUrl = '';
  let searchDebounceTimer = null;

  // DOM Elements
  const productsTableBody = document.getElementById('productsTableBody');
  const productsGrid = document.getElementById('productsGrid');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  const filterAvailability = document.getElementById('filterAvailability');
  const filterCategory = document.getElementById('filterCategory');
  const tableViewBtn = document.getElementById('tableViewBtn');
  const gridViewBtn = document.getElementById('gridViewBtn');
  const productModal = document.getElementById('productModal');
  const deleteModal = document.getElementById('deleteModal');
  const productForm = document.getElementById('productForm');
  const modalTitle = document.getElementById('modalTitle');
  const saveProductBtn = document.getElementById('saveProductBtn');

  // Metrics
  const metricTotal = document.getElementById('metricTotal');
  const metricInStock = document.getElementById('metricInStock');
  const metricMadeToOrder = document.getElementById('metricMadeToOrder');
  const metricCategories = document.getElementById('metricCategories');

  // Image Upload Controls
  const imageUploadWrapper = document.getElementById('imageUploadWrapper');
  const productImageInput = document.getElementById('productImageInput');
  const modalUploadActionBtn = document.getElementById('modalUploadActionBtn');
  const uploadPromptView = document.getElementById('uploadPromptView');
  const uploadPreviewView = document.getElementById('uploadPreviewView');
  const imagePreviewImg = document.getElementById('imagePreviewImg');
  const productImageVal = document.getElementById('productImageVal');
  const changeImageBtn = document.getElementById('changeImageBtn');

  // Quick Standalone Image Upload Controls
  const openQuickUploadBtn = document.getElementById('openQuickUploadBtn');
  const quickUploadModal = document.getElementById('quickUploadModal');
  const closeQuickUploadBtn = document.getElementById('closeQuickUploadBtn');
  const quickFileInput = document.getElementById('quickFileInput');
  const quickDropzone = document.getElementById('quickDropzone');
  const quickPromptView = document.getElementById('quickPromptView');
  const quickBrowseBtn = document.getElementById('quickBrowseBtn');
  const quickPreviewView = document.getElementById('quickPreviewView');
  const quickPreviewImg = document.getElementById('quickPreviewImg');
  const quickUrlText = document.getElementById('quickUrlText');
  const quickSuccessActions = document.getElementById('quickSuccessActions');
  const quickCreateProductBtn = document.getElementById('quickCreateProductBtn');
  const quickCopyUrlBtn = document.getElementById('quickCopyUrlBtn');
  const quickUploadAnotherBtn = document.getElementById('quickUploadAnotherBtn');
  let standaloneUploadedUrl = '';

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadStats();
    setupEventListeners();
  });

  // Setup Event Listeners
  function setupEventListeners() {
    // Search & Filter
    searchInput.addEventListener('input', () => {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(loadProducts, 220);
    });

    filterAvailability.addEventListener('change', loadProducts);
    filterCategory.addEventListener('change', loadProducts);

    // View Switching
    tableViewBtn.addEventListener('click', () => setView('table'));
    gridViewBtn.addEventListener('click', () => setView('grid'));

    // Modal Triggers
    document.getElementById('openAddProductBtn').addEventListener('click', openCreateModal);
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('cancelModalBtn').addEventListener('click', closeModal);

    document.getElementById('closeDeleteModalBtn').addEventListener('click', closeDeleteModal);
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
    document.getElementById('confirmDeleteBtn').addEventListener('click', executeDelete);

    // Form Submit
    productForm.addEventListener('submit', handleFormSubmit);

    // Explicit Modal Upload Button Click Trigger
    if (modalUploadActionBtn) {
      modalUploadActionBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        productImageInput.click();
      });
    }

    // Image Upload Click Trigger (on dropzone)
    imageUploadWrapper.addEventListener('click', (e) => {
      if (e.target !== changeImageBtn && !changeImageBtn.contains(e.target)) {
        productImageInput.click();
      }
    });

    changeImageBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      resetImageUpload();
      productImageInput.click();
    });

    // File Input Change
    productImageInput.addEventListener('change', handleFileSelect);

    // Drag and Drop for Product Modal
    imageUploadWrapper.addEventListener('dragover', (e) => {
      e.preventDefault();
      imageUploadWrapper.classList.add('dragover');
    });

    imageUploadWrapper.addEventListener('dragleave', () => {
      imageUploadWrapper.classList.remove('dragover');
    });

    imageUploadWrapper.addEventListener('drop', (e) => {
      e.preventDefault();
      imageUploadWrapper.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processImageFile(e.dataTransfer.files[0]);
      }
    });

    // Standalone Direct Quick Upload Modal Triggers
    if (openQuickUploadBtn) {
      openQuickUploadBtn.addEventListener('click', openQuickUpload);
    }
    if (closeQuickUploadBtn) {
      closeQuickUploadBtn.addEventListener('click', closeQuickUpload);
    }
    if (quickBrowseBtn) {
      quickBrowseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        quickFileInput.click();
      });
    }
    if (quickDropzone) {
      quickDropzone.addEventListener('click', (e) => {
        if (!quickPreviewView.contains(e.target)) {
          quickFileInput.click();
        }
      });
      quickDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        quickDropzone.classList.add('dragover');
      });
      quickDropzone.addEventListener('dragleave', () => {
        quickDropzone.classList.remove('dragover');
      });
      quickDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        quickDropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          processQuickUploadFile(e.dataTransfer.files[0]);
        }
      });
    }
    if (quickFileInput) {
      quickFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          processQuickUploadFile(e.target.files[0]);
        }
      });
    }
    if (quickCreateProductBtn) {
      quickCreateProductBtn.addEventListener('click', () => {
        if (!standaloneUploadedUrl) return;
        closeQuickUpload();
        openCreateModal();
        uploadedImageUrl = standaloneUploadedUrl;
        productImageVal.value = standaloneUploadedUrl;
        showImagePreview(standaloneUploadedUrl);
        showToast('Image ready! Enter product details and click Save.', 'success');
      });
    }
    if (quickCopyUrlBtn) {
      quickCopyUrlBtn.addEventListener('click', () => {
        if (!standaloneUploadedUrl) return;
        navigator.clipboard.writeText(standaloneUploadedUrl).then(() => {
          showToast('Image URL copied to clipboard!', 'success');
        }).catch(() => {
          prompt('Copy image URL:', standaloneUploadedUrl);
        });
      });
    }
    if (quickUploadAnotherBtn) {
      quickUploadAnotherBtn.addEventListener('click', resetQuickUpload);
    }

    // Close on overlay click
    productModal.addEventListener('click', (e) => {
      if (e.target === productModal) closeModal();
    });
    deleteModal.addEventListener('click', (e) => {
      if (e.target === deleteModal) closeDeleteModal();
    });
    if (quickUploadModal) {
      quickUploadModal.addEventListener('click', (e) => {
        if (e.target === quickUploadModal) closeQuickUpload();
      });
    }
  }

  // Set View Mode
  function setView(view) {
    currentView = view;
    if (view === 'table') {
      tableViewBtn.classList.add('active');
      gridViewBtn.classList.remove('active');
      document.querySelector('.table-container').style.display = 'block';
      productsGrid.style.display = 'none';
    } else {
      gridViewBtn.classList.add('active');
      tableViewBtn.classList.remove('active');
      document.querySelector('.table-container').style.display = 'none';
      productsGrid.style.display = 'grid';
    }
  }

  // Load Products via API
  async function loadProducts() {
    try {
      const q = encodeURIComponent(searchInput.value.trim());
      const availability = encodeURIComponent(filterAvailability.value);
      const category = encodeURIComponent(filterCategory.value);

      const res = await fetch(`/api/products?q=${q}&availability=${availability}&category=${category}`);
      const data = await res.json();

      if (data.success) {
        products = data.products;
        renderProducts();
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      showToast('Error loading products from server', 'error');
    }
  }

  // Load Dashboard Stats
  async function loadStats() {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success) {
        const stats = data.stats;
        metricTotal.textContent = stats.total || '0';
        metricInStock.textContent = stats.inStock || '0';
        metricMadeToOrder.textContent = (stats.madeToOrder + stats.bulkOnly) || '0';
        metricCategories.textContent = stats.categories ? stats.categories.length : '0';
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }

  // Render Products in Table and Grid
  function renderProducts() {
    if (products.length === 0) {
      emptyState.style.display = 'block';
      productsTableBody.innerHTML = '';
      productsGrid.innerHTML = '';
      return;
    }

    emptyState.style.display = 'none';

    // 1. Render Table Rows
    productsTableBody.innerHTML = products.map(p => `
      <tr>
        <td>
          <div class="table-product-cell">
            <div class="product-thumb-sm">
              <img src="${escapeHtml(p.image || 'images/products/usb-apex-titanium.svg')}" alt="${escapeHtml(p.name)}" loading="lazy">
            </div>
            <div>
              <div class="table-product-title">${escapeHtml(p.name)}</div>
              <span class="table-product-model">${escapeHtml(p.model_code || 'USB-STD')}</span>
            </div>
          </div>
        </td>
        <td>
          <span style="font-size: 0.8rem; font-weight: 700; color: #CBD5E1;">${escapeHtml(p.category || 'General')}</span>
        </td>
        <td>
          <div class="capacity-pills">
            ${(p.capacity || '16GB, 32GB').split(',').map(c => `<span class="cap-pill">${escapeHtml(c.trim())}</span>`).join('')}
          </div>
        </td>
        <td>
          <span class="price-tag">${escapeHtml(p.price || 'Quote')}</span>
        </td>
        <td>
          <span class="badge-status ${getBadgeClass(p.availability)}">
            ${escapeHtml(p.availability || 'In Stock')}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <button class="action-btn edit-btn" title="Edit Product" onclick="window.adminApp.editProduct(${p.id})">
              ✏️
            </button>
            <button class="action-btn delete-btn" title="Delete Product" onclick="window.adminApp.promptDelete(${p.id})">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    // 2. Render Grid Cards
    productsGrid.innerHTML = products.map(p => `
      <article class="admin-product-card">
        <div class="card-thumb-wrap">
          <span class="badge-status ${getBadgeClass(p.availability)} card-badge-top">
            ${escapeHtml(p.availability || 'In Stock')}
          </span>
          <img src="${escapeHtml(p.image || 'images/products/usb-apex-titanium.svg')}" alt="${escapeHtml(p.name)}" loading="lazy">
        </div>
        <div class="card-content">
          <div class="card-header-row">
            <div>
              <h3 class="card-title">${escapeHtml(p.name)}</h3>
              <span class="card-model">${escapeHtml(p.model_code || 'USB-STD')}</span>
            </div>
            <span style="font-size: 0.75rem; color: #94A3B8; font-weight: 600;">${escapeHtml(p.category)}</span>
          </div>

          <p class="card-desc">${escapeHtml(p.description || 'Enterprise USB storage hardware.')}</p>

          <div class="capacity-pills" style="margin-bottom: 12px;">
            ${(p.capacity || '16GB, 32GB').split(',').map(c => `<span class="cap-pill">${escapeHtml(c.trim())}</span>`).join('')}
          </div>

          <div class="card-meta-row">
            <div>
              <span style="font-size: 0.7rem; text-transform: uppercase; color: #94A3B8; display: block;">Reference Quote</span>
              <span class="price-tag">${escapeHtml(p.price || 'Quote')}</span>
            </div>
            <div class="table-actions">
              <button class="action-btn edit-btn" title="Edit Product" onclick="window.adminApp.editProduct(${p.id})">
                ✏️
              </button>
              <button class="action-btn delete-btn" title="Delete Product" onclick="window.adminApp.promptDelete(${p.id})">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </article>
    `).join('');
  }

  // Get CSS Class for Status Badge
  function getBadgeClass(status) {
    switch (status) {
      case 'In Stock': return 'badge-in-stock';
      case 'Made to Order': return 'badge-made-to-order';
      case 'Bulk Only': return 'badge-bulk-only';
      case 'Low Stock': return 'badge-low-stock';
      case 'Out of Stock': return 'badge-out-of-stock';
      default: return 'badge-in-stock';
    }
  }

  // Handle Image File Selection
  function handleFileSelect(e) {
    if (e.target.files && e.target.files.length > 0) {
      processImageFile(e.target.files[0]);
    }
  }

  // Process & Upload Image File
  function processImageFile(file) {
    if (!file.type.match(/image\/(png|jpeg|jpg|webp|svg\+xml)/)) {
      showToast('Please upload a valid image (PNG, JPG, WEBP, or SVG)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target.result;
      
      // Show instant preview
      showImagePreview(base64Data);

      // Upload to server
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: base64Data,
            filename: file.name
          })
        });

        const result = await res.json();
        if (result.success) {
          uploadedImageUrl = result.url;
          productImageVal.value = result.url;
          showToast('Image uploaded and linked successfully!', 'success');
        } else {
          // Fallback to storing base64 directly
          uploadedImageUrl = base64Data;
          productImageVal.value = base64Data;
        }
      } catch (err) {
        // Fallback: save data URI
        uploadedImageUrl = base64Data;
        productImageVal.value = base64Data;
        showToast('Image saved to product preview', 'success');
      }
    };
    reader.readAsDataURL(file);
  }

  // Display Image Preview
  function showImagePreview(src) {
    imagePreviewImg.src = src;
    uploadPromptView.style.display = 'none';
    uploadPreviewView.style.display = 'flex';
  }

  // Reset Image Upload Box
  function resetImageUpload() {
    productImageInput.value = '';
    uploadedImageUrl = '';
    productImageVal.value = '';
    imagePreviewImg.src = '';
    uploadPromptView.style.display = 'flex';
    uploadPreviewView.style.display = 'none';
  }

  // Preset Image Chooser
  window.setPresetImage = function(relPath) {
    uploadedImageUrl = relPath;
    productImageVal.value = relPath;
    showImagePreview(relPath);
    showToast(`Preset graphic selected: ${relPath.split('/').pop()}`, 'success');
  };

  // Quick Standalone Image Uploader Logic
  function openQuickUpload() {
    resetQuickUpload();
    quickUploadModal.classList.add('active');
  }

  function closeQuickUpload() {
    quickUploadModal.classList.remove('active');
  }

  function resetQuickUpload() {
    quickFileInput.value = '';
    standaloneUploadedUrl = '';
    quickPreviewImg.src = '';
    quickPromptView.style.display = 'flex';
    quickPreviewView.style.display = 'none';
    quickSuccessActions.style.display = 'none';
  }

  function processQuickUploadFile(file) {
    if (!file || !file.type.match(/image\/(png|jpeg|jpg|webp|svg\+xml)/)) {
      showToast('Please upload a valid image (PNG, JPG, WEBP, or SVG)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target.result;
      
      // Update quick preview
      quickPreviewImg.src = base64Data;
      quickPromptView.style.display = 'none';
      quickPreviewView.style.display = 'flex';
      quickUrlText.textContent = 'Uploading to server...';

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: base64Data,
            filename: file.name
          })
        });

        const result = await res.json();
        if (result.success) {
          standaloneUploadedUrl = result.url;
          quickUrlText.textContent = result.url;
          quickSuccessActions.style.display = 'flex';
          showToast('Image uploaded successfully to /uploads!', 'success');
        } else {
          standaloneUploadedUrl = base64Data;
          quickUrlText.textContent = 'Saved in memory (base64)';
          quickSuccessActions.style.display = 'flex';
          showToast('Image saved in memory', 'warning');
        }
      } catch (err) {
        standaloneUploadedUrl = base64Data;
        quickUrlText.textContent = 'Saved locally (base64)';
        quickSuccessActions.style.display = 'flex';
        showToast('Image cached locally', 'info');
      }
    };
    reader.readAsDataURL(file);
  }

  // Open Create Modal
  function openCreateModal() {
    editingProductId = null;
    modalTitle.textContent = 'Add New USB Product';
    saveProductBtn.textContent = 'Save Product';
    productForm.reset();
    resetImageUpload();
    document.getElementById('productAvailability').value = 'In Stock';
    document.getElementById('productCategory').value = 'Titanium Metal';
    document.getElementById('productModelCode').value = `USB-M${Math.floor(100 + Math.random() * 899)}`;
    productModal.classList.add('active');
  }

  // Open Edit Modal
  function openEditModal(id) {
    const p = products.find(item => item.id === id);
    if (!p) return;

    editingProductId = id;
    modalTitle.textContent = `Edit Product: ${p.name}`;
    saveProductBtn.textContent = 'Update Product';

    document.getElementById('productName').value = p.name || '';
    document.getElementById('productModelCode').value = p.model_code || '';
    document.getElementById('productCategory').value = p.category || 'Titanium Metal';
    document.getElementById('productAvailability').value = p.availability || 'In Stock';
    document.getElementById('productCapacity').value = p.capacity || '';
    document.getElementById('productPrice').value = p.price || '';
    document.getElementById('productReadSpeed').value = p.read_speed || 'Up to 150 MB/s';
    document.getElementById('productInterface').value = p.interface || 'USB 3.2 Gen 1';
    document.getElementById('productDesc').value = p.description || '';

    // Handle existing image
    if (p.image) {
      uploadedImageUrl = p.image;
      productImageVal.value = p.image;
      showImagePreview(p.image);
    } else {
      resetImageUpload();
    }

    productModal.classList.add('active');
  }

  // Close Product Modal
  function closeModal() {
    productModal.classList.remove('active');
    editingProductId = null;
  }

  // Handle Form Submit (Create or Edit)
  async function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('productName').value.trim();
    if (!name) {
      showToast('Product Name is required!', 'error');
      return;
    }

    const payload = {
      name,
      model_code: document.getElementById('productModelCode').value.trim(),
      category: document.getElementById('productCategory').value,
      availability: document.getElementById('productAvailability').value,
      capacity: document.getElementById('productCapacity').value.trim(),
      price: document.getElementById('productPrice').value.trim(),
      read_speed: document.getElementById('productReadSpeed').value.trim(),
      interface: document.getElementById('productInterface').value.trim(),
      description: document.getElementById('productDesc').value.trim(),
      image: productImageVal.value.trim() || 'images/products/usb-apex-titanium.svg'
    };

    saveProductBtn.disabled = true;
    saveProductBtn.textContent = 'Saving...';

    try {
      let res;
      if (editingProductId) {
        // PUT update
        res = await fetch(`/api/products/${editingProductId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // POST create
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const result = await res.json();
      if (result.success) {
        closeModal();
        showToast(editingProductId ? 'Product updated successfully!' : 'New USB Product added successfully!', 'success');
        loadProducts();
        loadStats();
      } else {
        showToast(result.error || 'Failed to save product', 'error');
      }
    } catch (err) {
      console.error('Error saving product:', err);
      showToast('Error communicating with server', 'error');
    } finally {
      saveProductBtn.disabled = false;
      saveProductBtn.textContent = editingProductId ? 'Update Product' : 'Save Product';
    }
  }

  // Delete Prompt Modal
  function promptDelete(id) {
    const p = products.find(item => item.id === id);
    if (!p) return;

    deletingProductId = id;
    document.getElementById('deleteProductTitle').textContent = p.name;
    document.getElementById('deleteProductModel').textContent = p.model_code || 'USB-STD';
    document.getElementById('deleteProductImg').src = p.image || 'images/products/usb-apex-titanium.svg';
    deleteModal.classList.add('active');
  }

  function closeDeleteModal() {
    deleteModal.classList.remove('active');
    deletingProductId = null;
  }

  // Execute Delete
  async function executeDelete() {
    if (!deletingProductId) return;

    const confirmBtn = document.getElementById('confirmDeleteBtn');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Deleting...';

    try {
      const res = await fetch(`/api/products/${deletingProductId}`, {
        method: 'DELETE'
      });
      const result = await res.json();

      if (result.success) {
        closeDeleteModal();
        showToast('Product deleted from catalog', 'success');
        loadProducts();
        loadStats();
      } else {
        showToast(result.error || 'Failed to delete product', 'error');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      showToast('Error communicating with server', 'error');
    } finally {
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Permanently Delete';
    }
  }

  // Toast Notification
  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✓' : '⚠️'}</span>
      <span>${escapeHtml(message)}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // HTML Escape Helper
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Expose global methods for inline HTML onclick handlers
  window.adminApp = {
    editProduct: openEditModal,
    promptDelete: promptDelete,
    showToast: showToast
  };

})();
