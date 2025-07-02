// Toppicks Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    renderToppicksTables();
    initializeBrandButtons();
    initializePhoneCards();
    initializeSmoothScroll();
});

function renderToppicksTables() {
    const main = document.querySelector('main');
    if (!main) return;
    const toppicksDiv = document.createElement('div');
    toppicksDiv.id = 'toppicks-tables';
    toppicksDiv.style.margin = '2rem 0';
    toppicksDiv.style.display = 'flex';
    toppicksDiv.style.flexWrap = 'wrap';
    toppicksDiv.style.gap = '2rem';
    toppicksDiv.style.justifyContent = 'center';
    const heroSection = main.querySelector('.hero');
    if (heroSection && heroSection.nextSibling) {
        main.insertBefore(toppicksDiv, heroSection.nextSibling);
    } else {
        main.appendChild(toppicksDiv);
    }

    fetch('http://127.0.0.1:5600/api/toppicks')
        .then(res => res.json())
        .then(data => {
            if (!data.devices || !Array.isArray(data.devices)) {
                toppicksDiv.innerHTML = '<p style="color:red">No data found from backend.</p>';
                return;
            }
            // Group devices by category
            const grouped = {};
            data.devices.forEach(device => {
                const cat = device.category || 'other';
                if (!grouped[cat]) grouped[cat] = [];
                grouped[cat].push(device);
            });
            // Render a table for each category
            const cats = Object.keys(grouped);
            if (cats.length === 0) {
                toppicksDiv.innerHTML = '<p style="color:red">No devices found in any category.</p>';
            } else {
                cats.forEach(cat => {
                    toppicksDiv.appendChild(createDeviceTable(cat, grouped[cat]));
                });
            }
        })
        .catch(err => {
            toppicksDiv.innerHTML = '<p style="color:red">Error fetching toppicks: ' + err + '</p>';
        });
}

function createDeviceTable(category, devices) {
    const tableDiv = document.createElement('div');
    tableDiv.className = 'toppicks-table';
    tableDiv.style.background = '#fff';
    tableDiv.style.borderRadius = '1rem';
    tableDiv.style.boxShadow = '0 2px 8px rgba(36,72,85,0.10)';
    tableDiv.style.padding = '1.5rem';
    tableDiv.style.minWidth = '320px';
    tableDiv.style.maxWidth = '400px';
    tableDiv.style.flex = '1 1 320px';
    tableDiv.style.marginBottom = '1rem';

    const title = document.createElement('h3');
    title.textContent = category.charAt(0).toUpperCase() + category.slice(1) + 's';
    title.style.fontSize = '1.5rem';
    title.style.color = '#244855';
    title.style.marginBottom = '0.5rem';
    tableDiv.appendChild(title);

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.innerHTML = `
        <thead>
            <tr style="background:#f0f9ff">
                <th style="padding:8px;text-align:left;">Name</th>
                <th style="padding:8px;text-align:left;">Price</th>
                <th style="padding:8px;text-align:left;">Key Features</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    devices.forEach(device => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="padding:8px;vertical-align:top;">${device.name || ''}</td>
            <td style="padding:8px;vertical-align:top;">${device.price || ''}</td>
            <td style="padding:8px;vertical-align:top;">${Array.isArray(device.key_features) ? device.key_features.join('<br>') : ''}</td>
        `;
        table.querySelector('tbody').appendChild(tr);
    });
    tableDiv.appendChild(table);
    return tableDiv;
}

// Brand button functionality
function initializeBrandButtons() {
    const brandButtons = document.querySelectorAll('.image-button');
    
    brandButtons.forEach(button => {
        // Add hover effects
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        });
        
        // Add click feedback
        button.addEventListener('click', function() {
            // Add a brief visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Phone card functionality
function initializePhoneCards() {
    const phoneCards = document.querySelectorAll('.phone-card');
    
    phoneCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });
        
        // Add click functionality to show more details
        card.addEventListener('click', function() {
            showPhoneDetails(this);
        });
    });
}

// Show phone details modal
function showPhoneDetails(card) {
    const phoneName = card.querySelector('h3').textContent;
    const price = card.querySelector('.price').textContent;
    const specs = card.querySelector('.specs').textContent;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'phone-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>${phoneName}</h2>
            <div class="modal-price">${price}</div>
            <div class="modal-specs">${specs}</div>
            <div class="modal-actions">
                <button class="btn-primary">View Details</button>
                <button class="btn-secondary">Compare</button>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .phone-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            position: relative;
            animation: slideIn 0.3s ease;
        }
        
        .close-modal {
            position: absolute;
            top: 15px;
            right: 20px;
            font-size: 2rem;
            cursor: pointer;
            color: #666;
        }
        
        .close-modal:hover {
            color: #333;
        }
        
        .modal-content h2 {
            color: #333;
            margin-bottom: 1rem;
        }
        
        .modal-price {
            font-size: 1.5rem;
            font-weight: 600;
            color: #0082c8;
            margin-bottom: 1rem;
        }
        
        .modal-specs {
            color: #666;
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        
        .modal-actions {
            display: flex;
            gap: 1rem;
        }
        
        .btn-primary, .btn-secondary {
            padding: 0.8rem 1.5rem;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background: #0082c8;
            color: white;
        }
        
        .btn-primary:hover {
            background: #0066a3;
            transform: translateY(-2px);
        }
        
        .btn-secondary {
            background: #f8f9fa;
            color: #333;
            border: 2px solid #e9ecef;
        }
        
        .btn-secondary:hover {
            background: #e9ecef;
            transform: translateY(-2px);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    });
}

// Smooth scrolling functionality
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add scroll animations for brand sections
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe brand sections
    const brandSections = document.querySelectorAll('.brand-section');
    brandSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Initialize scroll animations when page loads
document.addEventListener('DOMContentLoaded', initializeScrollAnimations);

// Add loading animation for images
function initializeImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            this.style.opacity = '0.5';
            this.style.filter = 'grayscale(100%)';
        });
        
        // Set initial state
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
}

// Initialize image loading
document.addEventListener('DOMContentLoaded', initializeImageLoading);
