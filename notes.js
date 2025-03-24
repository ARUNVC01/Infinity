// Notes Page JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive elements
    initClassTabs();
    initFilters();
    initNoteCards();
    initPreviewModal();
    initRatingSystem();
    initSearchFunctionality();
    initUploadButton();
    initLoadMore();
    initThemeToggle();
    
    // Check if functions exist before calling them
    if (typeof initMobileMenu === 'function') {
        initMobileMenu();
    }
    
    // Skip these if not defined (they might be in script.js)
    if (typeof initAccordions === 'function') {
        initAccordions();
    }
    
    if (typeof initSearch === 'function') {
        initSearch();
    }
    
    handleMissingImages();
});

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

// Class Tabs Functionality
function initClassTabs() {
    const tabs = document.querySelectorAll('.tab');
    const noteCards = document.querySelectorAll('.note-card');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            const selectedClass = this.getAttribute('data-class');
            
            // Show/hide note cards based on selected class
            let visibleCount = 0;
            
            noteCards.forEach(card => {
                if (selectedClass === 'all' || card.getAttribute('data-class') === selectedClass) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Update notes count
            document.getElementById('notes-count-number').textContent = visibleCount;
            
            // Show/hide no results message
            toggleNoResults(visibleCount === 0);
        });
    });
}

// Filter Functionality
function initFilters() {
    const subjectFilter = document.getElementById('subject-filter');
    const chapterFilter = document.getElementById('chapter-filter');
    const ratingFilter = document.getElementById('rating-filter');
    const sortFilter = document.getElementById('sort-filter');
    const resetButton = document.querySelector('.btn-reset-filter');
    
    // Update notes when filters change
    [subjectFilter, chapterFilter, ratingFilter, sortFilter].forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    // Reset filters
    resetButton.addEventListener('click', resetFilters);
    
    // Populate chapters based on subject selection
    subjectFilter.addEventListener('change', function() {
        populateChapters(this.value);
    });
}

// Populate chapter dropdown based on selected subject
function populateChapters(subject) {
    const chapterFilter = document.getElementById('chapter-filter');
    
    // Clear existing options except the first one
    while (chapterFilter.options.length > 1) {
        chapterFilter.remove(1);
    }
    
    // If "All Subjects" is selected, don't add any chapters
    if (subject === 'all') {
        return;
    }
    
    // Sample chapter data - in a real application, this would come from a database
    const chapterData = {
        maths: ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics'],
        science: ['Light', 'Force and Laws of Motion', 'Sound', 'Matter', 'Atoms and Molecules'],
        physics: ['Electrostatics', 'Current Electricity', 'Magnetism', 'Optics', 'Modern Physics'],
        chemistry: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Periodic Table'],
        biology: ['Cell Biology', 'Human Physiology', 'Genetics', 'Ecology', 'Evolution'],
        social: ['Indian Freedom Movement', 'Geography', 'Civics', 'Economics', 'World History'],
        computer: ['Programming Concepts', 'Data Structures', 'Web Technologies', 'Databases']
    };
    
    // Add chapters for the selected subject
    if (chapterData[subject]) {
        chapterData[subject].forEach(chapter => {
            const option = document.createElement('option');
            option.value = chapter.toLowerCase().replace(/\s+/g, '-');
            option.textContent = chapter;
            chapterFilter.appendChild(option);
        });
    }
}

// Apply all filters
function applyFilters() {
    const selectedClass = document.querySelector('.tab.active').getAttribute('data-class');
    const selectedSubject = document.getElementById('subject-filter').value;
    const selectedRating = document.getElementById('rating-filter').value;
    const sortBy = document.getElementById('sort-filter').value;
    
    const noteCards = document.querySelectorAll('.note-card');
    let visibleCount = 0;
    
    // Filter cards
    noteCards.forEach(card => {
        const cardClass = card.getAttribute('data-class');
        const cardSubject = card.getAttribute('data-subject');
        const cardRating = parseFloat(card.getAttribute('data-rating'));
        
        // Check if card matches all selected filters
        const classMatch = selectedClass === 'all' || cardClass === selectedClass;
        const subjectMatch = selectedSubject === 'all' || cardSubject === selectedSubject;
        const ratingMatch = selectedRating === 'all' || cardRating >= parseInt(selectedRating);
        
        if (classMatch && subjectMatch && ratingMatch) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Sort visible cards
    sortNoteCards(sortBy);
    
    // Update notes count
    document.getElementById('notes-count-number').textContent = visibleCount;
    
    // Show/hide no results message
    toggleNoResults(visibleCount === 0);
}

// Sort note cards
function sortNoteCards(sortBy) {
    const notesGrid = document.querySelector('.notes-grid');
    const noteCards = Array.from(notesGrid.querySelectorAll('.note-card[style*="display: block"]'));
    
    switch (sortBy) {
        case 'popular':
            noteCards.sort((a, b) => {
                const aRatingCount = parseInt(a.querySelector('.rating-count').textContent.match(/\((\d+)/)[1]);
                const bRatingCount = parseInt(b.querySelector('.rating-count').textContent.match(/\((\d+)/)[1]);
                return bRatingCount - aRatingCount;
            });
            break;
        case 'rating-high':
            noteCards.sort((a, b) => {
                const aRating = parseFloat(a.getAttribute('data-rating'));
                const bRating = parseFloat(b.getAttribute('data-rating'));
                return bRating - aRating;
            });
            break;
        case 'rating-low':
            noteCards.sort((a, b) => {
                const aRating = parseFloat(a.getAttribute('data-rating'));
                const bRating = parseFloat(b.getAttribute('data-rating'));
                return aRating - bRating;
            });
            break;
        // For 'recent', we would normally sort by date, but in this example
        // we don't have real dates, so we'll leave as is
    }
    
    // Reorder cards in the DOM
    noteCards.forEach(card => {
        notesGrid.appendChild(card);
    });
}

// Reset all filters
function resetFilters() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        if (tab.getAttribute('data-class') === 'all') {
            tab.click();
        }
    });
    
    document.getElementById('subject-filter').value = 'all';
    document.getElementById('chapter-filter').value = 'all';
    document.getElementById('rating-filter').value = 'all';
    document.getElementById('sort-filter').value = 'popular';
    
    // Clear the search input
    document.getElementById('search-notes').value = '';
    
    // Show all note cards
    const noteCards = document.querySelectorAll('.note-card');
    noteCards.forEach(card => {
        card.style.display = 'block';
    });
    
    // Update notes count
    document.getElementById('notes-count-number').textContent = noteCards.length;
    
    // Hide no results message
    toggleNoResults(false);
}

// Toggle no results message
function toggleNoResults(show) {
    const noResultsContainer = document.querySelector('.no-results-container');
    noResultsContainer.style.display = show ? 'block' : 'none';
    
    // Add event listener to "Reset All Filters" button
    if (show) {
        document.querySelector('.btn-reset-all').addEventListener('click', resetFilters);
    }
}

// Note Card Interactions
function initNoteCards() {
    const previewButtons = document.querySelectorAll('.btn-preview');
    const downloadButtons = document.querySelectorAll('.btn-download');
    
    previewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const noteCard = this.closest('.note-card');
            openPreviewModal(noteCard);
        });
    });
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // In a real app, this would initiate a download
            alert('Download started. Your file will be downloaded shortly.');
        });
    });
}

// Preview Modal Functionality
function initPreviewModal() {
    const modal = document.getElementById('previewModal');
    const closeButton = modal.querySelector('.modal-close');
    
    closeButton.addEventListener('click', function() {
        closePreviewModal();
    });
    
    // Close modal when clicking outside of content
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closePreviewModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closePreviewModal();
        }
    });
    
    // Download button in modal
    modal.querySelector('.btn-download-full').addEventListener('click', function() {
        alert('Download started. Your file will be downloaded shortly.');
    });
}

// Open preview modal with note data
function openPreviewModal(noteCard) {
    const modal = document.getElementById('previewModal');
    
    // Get data from note card
    const title = noteCard.querySelector('h3').textContent;
    const subject = noteCard.querySelector('.note-subject').textContent;
    const grade = noteCard.querySelector('.note-class').textContent;
    const pages = noteCard.querySelector('.note-pages').textContent.trim();
    
    // Update modal with note data
    modal.querySelector('#modal-title').textContent = 'Notes Preview: ' + title;
    modal.querySelector('#pdf-title').textContent = title;
    modal.querySelector('#pdf-subject').textContent = subject;
    modal.querySelector('#pdf-class').textContent = grade;
    modal.querySelector('#pdf-pages').textContent = pages;
    
    // In a real app, we would load the actual PDF here
    // For this example, we'll use a placeholder or embedded PDF viewer
    const pdfFrame = modal.querySelector('#pdf-iframe');
    
    // Sample PDF (you can replace this with your actual PDF URL)
    // Using Google Docs PDF viewer as a fallback viewer
    pdfFrame.src = "https://docs.google.com/gview?embedded=true&url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    
    // Show modal with a small delay to ensure iframe loads properly
    setTimeout(() => {
        modal.classList.add('active');
        // Prevent scrolling on body
        document.body.style.overflow = 'hidden';
    }, 100);
}

// Close preview modal
function closePreviewModal() {
    const modal = document.getElementById('previewModal');
    modal.classList.remove('active');
    
    // Reset rating stars to unselected state
    const stars = modal.querySelectorAll('.rate-stars i');
    stars.forEach(star => {
        star.className = 'far fa-star';
    });
    
    // Allow scrolling on body again
    document.body.style.overflow = '';
}

// Rating System
function initRatingSystem() {
    const stars = document.querySelectorAll('.rate-stars i');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            
            // Update visual state of stars
            stars.forEach(s => {
                const starRating = parseInt(s.getAttribute('data-rating'));
                s.className = starRating <= rating ? 'fas fa-star' : 'far fa-star';
                
                if (starRating <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
            
            // In a real app, we would send this rating to the server
            setTimeout(() => {
                alert(`Thank you for rating this note ${rating} stars!`);
            }, 300);
        });
        
        // Hover effect
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            
            stars.forEach(s => {
                const starRating = parseInt(s.getAttribute('data-rating'));
                if (starRating <= rating) {
                    s.className = 'fas fa-star';
                } else {
                    s.className = 'far fa-star';
                }
            });
        });
        
        // Reset to selected state on mouse leave
        star.parentElement.addEventListener('mouseleave', function() {
            stars.forEach(s => {
                s.className = s.classList.contains('active') ? 'fas fa-star' : 'far fa-star';
            });
        });
    });
}

// Search Functionality
function initSearchFunctionality() {
    const searchInput = document.getElementById('search-notes');
    const searchButton = document.querySelector('.search-btn');
    
    // Search on button click
    searchButton.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
    
    // Search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value);
        }
    });
}

// Perform search across note cards
function performSearch(query) {
    const noteCards = document.querySelectorAll('.note-card');
    let visibleCount = 0;
    
    query = query.toLowerCase().trim();
    
    // If search is empty, reset filters
    if (query === '') {
        resetFilters();
        return;
    }
    
    noteCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const subject = card.querySelector('.note-subject').textContent.toLowerCase();
        
        if (title.includes(query) || description.includes(query) || subject.includes(query)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update notes count
    document.getElementById('notes-count-number').textContent = visibleCount;
    
    // Show/hide no results message
    toggleNoResults(visibleCount === 0);
}

// Load More Functionality
function initLoadMore() {
    const loadMoreButton = document.querySelector('.btn-load-more');
    
    // In a real app, this would load more notes from the server
    loadMoreButton.addEventListener('click', function() {
        // Simulate loading delay
        this.textContent = 'Loading...';
        this.disabled = true;
        
        setTimeout(() => {
            // In production, this would fetch new notes from an API
            this.textContent = 'No more notes available';
            this.style.opacity = '0.5';
        }, 1500);
    });
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
            } else if (img.src.includes('subject') || img.src.includes('thumbnail')) {
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YxZjFmMSIgcng9IjUiIHJ5PSI1Ii8+PHRleHQgeD0iMTUwIiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2UgUGxhY2Vob2xkZXI8L3RleHQ+PC9zdmc+';
            }
            this.onerror = null; // Prevent infinite loop if the fallback also fails
        };
    });
}

// Add definition for upload button functionality if not already present
function initUploadButton() {
    const uploadButton = document.querySelector('.btn-upload');
    
    if (uploadButton) {
        uploadButton.addEventListener('click', function() {
            // Create a file input element
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.pdf,.doc,.docx,.ppt,.pptx,.txt';
            fileInput.multiple = true;
            
            // Trigger click on the file input
            fileInput.click();
            
            // Handle file selection
            fileInput.addEventListener('change', function() {
                if (this.files.length > 0) {
                    // Show loading indicator or feedback
                    uploadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
                    uploadButton.disabled = true;
                    
                    // Simulate upload process (in a real app, this would be an AJAX request)
                    setTimeout(() => {
                        // Reset button state
                        uploadButton.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Upload Documents or Notes';
                        uploadButton.disabled = false;
                        
                        // Show success message
                        const fileNames = Array.from(this.files).map(file => file.name).join(', ');
                        alert(`Files uploaded successfully: ${fileNames}\n\nYour notes will be reviewed and published soon.`);
                    }, 2000);
                }
            });
        });
    }
} 