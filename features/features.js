document.addEventListener("DOMContentLoaded", function() {
    // Get all spec items and detail sections
    const specItems = document.querySelectorAll('.spec-item');
    const detailSections = document.querySelectorAll('.spec-detail');
    let activeDetail = null;
    let hoverDelay;

    // Function to hide all detail sections
    function hideAllDetails() {
        detailSections.forEach(section => {
            section.style.maxHeight = '0';
            section.style.opacity = '0';
            section.style.transform = 'translateY(-10px)';
            section.style.padding = '0';
            section.style.marginTop = '0';
            
            setTimeout(() => {
                if (!section.closest('.spec-item').matches(':hover')) {
                    section.style.display = 'none';
                }
            }, 1200);
        });
        activeDetail = null;
    }

    // Function to show specific detail section
    function showDetail(targetId) {
        const target = document.getElementById(targetId);
        if (target) {
            target.style.display = 'block';
            // Force a reflow
            target.offsetHeight;
            target.style.maxHeight = target.scrollHeight + 'px';
            target.style.opacity = '1';
            target.style.transform = 'translateY(0)';
            target.style.padding = '1.5rem';
            target.style.marginTop = '1rem';
            activeDetail = target;
        }
    }

    // Add event listeners to each spec item
    specItems.forEach(item => {
        const targetId = item.getAttribute('data-target');
        
        // Mouse enters the item
        item.addEventListener('mouseenter', () => {
            clearTimeout(hoverDelay);
            showDetail(targetId);
        });

        // Mouse leaves the item
        item.addEventListener('mouseleave', () => {
            hoverDelay = setTimeout(() => {
                if (!activeDetail?.matches(':hover')) {
                    hideAllDetails();
                }
            }, 100);
        });
    });

    // Add event listeners to detail sections
    detailSections.forEach(section => {
        // Mouse enters the detail
        section.addEventListener('mouseenter', () => {
            clearTimeout(hoverDelay);
        });

        // Mouse leaves the detail
        section.addEventListener('mouseleave', () => {
            hideAllDetails();
        });
    });

    // Hide details when clicking anywhere else
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.spec-item') && !e.target.closest('.spec-detail')) {
            hideAllDetails();
        }
    });

    // Add click event listeners to grid items
    const gridItems = document.querySelectorAll('.grid-item');
    
    gridItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            
            if (section) {
                const headerOffset = 80;
                const elementPosition = section.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});