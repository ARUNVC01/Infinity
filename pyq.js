// PYQ Page JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive elements
    initClassTabs();
    initFilters();
    initSortButtons();
    initPreviewModals();
    initHelpfulButtons();
    initSearchFunction();
    initResetFilters();
    
    // Include core functionality from main script
    initMobileMenu();
    initThemeToggle();
    handleMissingImages();
});

// Reset Filters Functionality
function initResetFilters() {
    const resetFiltersBtn = document.querySelector('.btn-reset-filter');
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            // Reset all filter dropdowns to "all"
            document.getElementById('subject-filter').value = 'all';
            document.getElementById('year-filter').value = 'all';
            document.getElementById('exam-filter').value = 'all';
            document.getElementById('difficulty-filter').value = 'all';
            
            // Reset sort buttons - make "Latest" active
            const sortButtons = document.querySelectorAll('.sort-btn');
            sortButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector('.sort-btn[data-sort="latest"]').classList.add('active');
            
            // Apply the filters
            applyFilters();
        });
    }
}

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check if user has a saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    // Check if user prefers dark mode in their OS settings
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply saved theme or use system preference
    if (savedTheme) {
        body.className = savedTheme;
    } else if (prefersDarkMode) {
        body.className = 'dark-mode';
        localStorage.setItem('theme', 'dark-mode');
    } else {
        body.className = 'light-mode';
        localStorage.setItem('theme', 'light-mode');
    }
    
    // Listen for theme changes in system preferences
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                body.className = e.matches ? 'dark-mode' : 'light-mode';
            }
        });
    }
    
    // Add click event to toggle theme
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            if (body.classList.contains('light-mode')) {
                body.classList.replace('light-mode', 'dark-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                body.classList.replace('dark-mode', 'light-mode');
                localStorage.setItem('theme', 'light-mode');
            }
        });
    }
}

// Class Tab Selection
function initClassTabs() {
    const classTabs = document.querySelectorAll('.class-tabs .tab');
    const pyqCards = document.querySelectorAll('.pyq-card');
    
    classTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            classTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding cards
            const classValue = this.getAttribute('data-class');
            
            pyqCards.forEach(card => {
                if (card.getAttribute('data-class') === classValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Check if we need to show "No Results"
            checkForNoResults();
        });
    });
    
    // Trigger click on the first tab to initialize view
    if (classTabs.length > 0) {
        // We don't trigger click here, as it's already set in HTML
        // But we'll filter the initial view
        const activeTab = document.querySelector('.class-tabs .tab.active');
        if (activeTab) {
            const classValue = activeTab.getAttribute('data-class');
            
            pyqCards.forEach(card => {
                if (card.getAttribute('data-class') !== classValue) {
                    card.style.display = 'none';
                }
            });
        }
    }
}

// Filter Functionality
function initFilters() {
    const subjectFilter = document.getElementById('subject-filter');
    const yearFilter = document.getElementById('year-filter');
    const examFilter = document.getElementById('exam-filter');
    const difficultyFilter = document.getElementById('difficulty-filter');
    
    const filters = [subjectFilter, yearFilter, examFilter, difficultyFilter];
    
    filters.forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });
}

function applyFilters() {
    const subjectFilter = document.getElementById('subject-filter').value;
    const yearFilter = document.getElementById('year-filter').value;
    const examFilter = document.getElementById('exam-filter').value;
    const difficultyFilter = document.getElementById('difficulty-filter').value;
    
    const activeClassTab = document.querySelector('.class-tabs .tab.active');
    const classFilter = activeClassTab ? activeClassTab.getAttribute('data-class') : null;
    
    const pyqCards = document.querySelectorAll('.pyq-card');
    
    pyqCards.forEach(card => {
        // First hide all cards
        card.style.display = 'none';
        
        // Get card attributes
        const cardClass = card.getAttribute('data-class');
        const cardSubject = card.getAttribute('data-subject');
        const cardYear = card.getAttribute('data-year');
        const cardType = card.getAttribute('data-type');
        const cardDifficulty = card.getAttribute('data-difficulty');
        
        // Check if card matches all selected filters
        const matchesClass = !classFilter || cardClass === classFilter;
        const matchesSubject = subjectFilter === 'all' || cardSubject === subjectFilter;
        const matchesYear = yearFilter === 'all' || cardYear === yearFilter;
        const matchesExam = examFilter === 'all' || cardType === examFilter;
        const matchesDifficulty = difficultyFilter === 'all' || cardDifficulty === difficultyFilter;
        
        // Show card if it matches all filters
        if (matchesClass && matchesSubject && matchesYear && matchesExam && matchesDifficulty) {
            card.style.display = 'flex';
        }
    });
    
    // Check if we need to show "No Results"
    checkForNoResults();
}

// Sort Buttons
function initSortButtons() {
    const sortButtons = document.querySelectorAll('.sort-btn');
    
    sortButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            sortButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Apply sorting
            const sortType = this.getAttribute('data-sort');
            sortPapers(sortType);
        });
    });
}

function sortPapers(sortType) {
    const pyqContainer = document.getElementById('pyq-container');
    const pyqCards = Array.from(document.querySelectorAll('.pyq-card'));
    
    // Sort cards based on sort type
    switch (sortType) {
        case 'latest':
            pyqCards.sort((a, b) => {
                const yearA = parseInt(a.getAttribute('data-year'));
                const yearB = parseInt(b.getAttribute('data-year'));
                return yearB - yearA;
            });
            break;
        case 'popular':
            pyqCards.sort((a, b) => {
                const downloadsA = parseInt(a.querySelector('.pyq-downloads-count').textContent.replace(/[^0-9.]/g, ''));
                const downloadsB = parseInt(b.querySelector('.pyq-downloads-count').textContent.replace(/[^0-9.]/g, ''));
                return downloadsB - downloadsA;
            });
            break;
        case 'difficulty':
            const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
            pyqCards.sort((a, b) => {
                const diffA = difficultyOrder[a.getAttribute('data-difficulty')];
                const diffB = difficultyOrder[b.getAttribute('data-difficulty')];
                return diffB - diffA; // Sort from hard to easy
            });
            break;
    }
    
    // Reappend cards in the new order
    pyqCards.forEach(card => {
        pyqContainer.appendChild(card);
    });
    
    // Re-apply filters
    applyFilters();
}

// Preview Modals
function initPreviewModals() {
    const previewButtons = document.querySelectorAll('.btn-preview');
    const modal = document.getElementById('preview-modal');
    const overlay = document.getElementById('overlay');
    const closeModal = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modal-title');
    
    // Show modal when preview button is clicked
    previewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const previewId = this.getAttribute('data-preview');
            
            // Get paper details from card
            const card = this.closest('.pyq-card');
            const subject = card.querySelector('.pyq-subject').textContent;
            const year = card.querySelector('.pyq-year').textContent;
            const examType = card.querySelector('.pyq-card-body h3').textContent;
            
            // Update modal title
            modalTitle.textContent = `${subject} - ${year} ${examType}`;
            
            // Set active tab to "Question Paper"
            const tabs = document.querySelectorAll('.preview-tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            document.querySelector('.preview-tab[data-tab="question"]').classList.add('active');
            
            // Show question content
            const panes = document.querySelectorAll('.preview-pane');
            panes.forEach(pane => pane.classList.remove('active'));
            document.getElementById('question-preview').classList.add('active');
            
            // Show modal and overlay
            modal.style.display = 'block';
            overlay.style.display = 'block';
            
            // Prevent body scrolling
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal when close button is clicked
    if (closeModal) {
        closeModal.addEventListener('click', closePreviewModal);
    }
    
    // Close modal when overlay is clicked
    if (overlay) {
        overlay.addEventListener('click', closePreviewModal);
    }
    
    // Set up preview tabs
    const previewTabs = document.querySelectorAll('.preview-tab');
    previewTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and panes
            previewTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.preview-pane').forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-preview`).classList.add('active');
        });
    });
}

function closePreviewModal() {
    const modal = document.getElementById('preview-modal');
    const overlay = document.getElementById('overlay');
    
    if (modal) modal.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
    
    // Allow body scrolling again
    document.body.style.overflow = 'auto';
}

// Helpful Buttons
function initHelpfulButtons() {
    const helpfulButtons = document.querySelectorAll('.helpful-btn');
    
    helpfulButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get parent element (helpful container)
            const helpfulContainer = this.parentNode;
            
            // Toggle active state
            this.classList.toggle('active');
            
            // If this button is active, make sure sibling is not
            if (this.classList.contains('active')) {
                const siblingButton = helpfulContainer.querySelector('.helpful-btn:not(.active)');
                if (siblingButton) {
                    siblingButton.classList.remove('active');
                }
            }
            
            // Change icon color when active
            if (this.classList.contains('active')) {
                this.style.color = '#115293';
            } else {
                this.style.color = '';
            }
            
            // Show thank you message
            const span = helpfulContainer.querySelector('span');
            if (span) {
                const originalText = span.getAttribute('data-original-text') || span.textContent;
                
                if (!span.getAttribute('data-original-text')) {
                    span.setAttribute('data-original-text', originalText);
                }
                
                span.textContent = 'Thank you for your feedback!';
                
                // Reset after 2 seconds
                setTimeout(() => {
                    span.textContent = originalText;
                }, 2000);
            }
        });
    });
}

// Load More Functionality
document.getElementById('load-more-btn')?.addEventListener('click', function() {
    this.textContent = 'Loading...';
    
    // Simulate loading delay
    setTimeout(() => {
        this.textContent = 'No More Papers Available';
        this.disabled = true;
        this.style.opacity = '0.5';
    }, 1500);
});

// Search Functionality
function initSearchFunction() {
    const searchInput = document.getElementById('search-pyq');
    const searchBtn = document.querySelector('.search-btn');
    
    // Search when button is clicked
    searchBtn?.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
    
    // Search when Enter key is pressed
    searchInput?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value);
        }
    });
}

function performSearch(query) {
    query = query.toLowerCase().trim();
    const pyqCards = document.querySelectorAll('.pyq-card');
    
    if (query === '') {
        // If search is empty, reset to show cards based on active class tab
        const activeTab = document.querySelector('.class-tabs .tab.active');
        if (activeTab) {
            const classValue = activeTab.getAttribute('data-class');
            
            pyqCards.forEach(card => {
                if (card.getAttribute('data-class') === classValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }
        
        // Reset filters
        document.getElementById('subject-filter').value = 'all';
        document.getElementById('year-filter').value = 'all';
        document.getElementById('exam-filter').value = 'all';
        document.getElementById('difficulty-filter').value = 'all';
        
        return;
    }
    
    // Hide all cards first
    pyqCards.forEach(card => {
        card.style.display = 'none';
    });
    
    // Show cards that match the search
    let hasResults = false;
    
    pyqCards.forEach(card => {
        const subject = card.querySelector('.pyq-subject').textContent.toLowerCase();
        const year = card.querySelector('.pyq-year').textContent.toLowerCase();
        const examType = card.querySelector('.pyq-card-body h3').textContent.toLowerCase();
        const grade = card.querySelector('.pyq-details').textContent.toLowerCase();
        
        if (subject.includes(query) || year.includes(query) || examType.includes(query) || grade.includes(query)) {
            card.style.display = 'flex';
            hasResults = true;
        }
    });
    
    // Show or hide "No Results" message
    const noResults = document.querySelector('.no-results');
    if (noResults) {
        noResults.style.display = hasResults ? 'none' : 'block';
    }
}

// Check if we need to show "No Results"
function checkForNoResults() {
    const visibleCards = document.querySelectorAll('.pyq-card[style*="display: flex"]');
    const noResults = document.querySelector('.no-results');
    
    if (noResults) {
        noResults.style.display = visibleCards.length === 0 ? 'block' : 'none';
    }
}

// Mobile Menu functionality (if not already defined in script.js)
function initMobileMenu() {
    if (typeof window.mobileMenuInitialized === 'undefined') {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        window.mobileMenuInitialized = true;
    }
}

// Handle missing images gracefully
function handleMissingImages() {
    // Handle missing images by providing fallbacks
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.onerror = function() {
            // Check which image failed and provide appropriate fallback
            if (img.src.includes('logo.png')) {
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzYzNjZmMSIgcng9IjEwIiByeT0iMTAiLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkluZmluaXR5PC90ZXh0Pjwvc3ZnPg==';
            } else if (img.src.includes('document') || img.src.includes('paper')) {
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YxZjFmMSIgcng9IjUiIHJ5PSI1Ii8+PHRleHQgeD0iMTUwIiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UGFwZXIgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
            }
            this.onerror = null; // Prevent infinite loop if the fallback also fails
        };
    });
} 