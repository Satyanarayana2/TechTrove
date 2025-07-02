// TechTrove Recommendation Questionnaire
class RecommendationQuiz {
    constructor() {
        this.currentStep = 1;
        this.selectedDevice = null;
        this.answers = {};
        this.maxSelections = {
            'step4-smartphone': 3,  // Usage patterns - pick up to 3
            'step10-smartphone': 2, // Purchase preferences - pick up to 2
            'step11-smartphone': 2, // Trade-offs - pick up to 2
            'step12-smartphone': 3  // Optional features - pick up to 3
        };
        
        this.totalSteps = {
            'smartphone': 12,
            'tablet': 13,
            'laptop': 16
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateProgress();
        
        // Run initial validation for step 1
        this.validateStep1();
    }

    setupEventListeners() {
        // Welcome section - add null checks and debugging
        const userNameInput = document.getElementById('userName');
        const userEmailInput = document.getElementById('userEmail');
        const nextStep1Btn = document.getElementById('nextStep1');
        
        if (userNameInput && userEmailInput && nextStep1Btn) {
            userNameInput.addEventListener('input', this.validateStep1.bind(this));
            userEmailInput.addEventListener('input', this.validateStep1.bind(this));
            nextStep1Btn.addEventListener('click', () => {
                this.nextStep();
            });
        }

        // Device selection
        this.setupOptionListeners('step2', 'nextStep2');
        const prevStep2Btn = document.getElementById('prevStep2');
        const nextStep2Btn = document.getElementById('nextStep2');
        
        if (prevStep2Btn) {
            prevStep2Btn.addEventListener('click', () => this.prevStep());
        }
        if (nextStep2Btn) {
            nextStep2Btn.addEventListener('click', () => this.nextStep());
        }

        // Smartphone specific steps
        this.setupSmartphoneListeners();

        // Tablet specific steps
        this.setupTabletListeners();

        // Laptop specific steps
        this.setupLaptopListeners();
    }

    setupSmartphoneListeners() {
        // Single choice questions
        const singleChoiceSteps = ['step3-smartphone', 'step5-smartphone', 'step6-smartphone', 'step7-smartphone', 'step8-smartphone', 'step9-smartphone'];
        singleChoiceSteps.forEach(stepId => {
            this.setupOptionListeners(stepId, `next${stepId.charAt(0).toUpperCase() + stepId.slice(1)}`);
        });

        // Multi-select questions
        const multiSelectSteps = ['step4-smartphone', 'step10-smartphone', 'step11-smartphone', 'step12-smartphone'];
        multiSelectSteps.forEach(stepId => {
            this.setupMultiSelectListeners(stepId, `next${stepId.charAt(0).toUpperCase() + stepId.slice(1)}`, this.maxSelections[stepId]);
        });

        // Navigation buttons - using exact HTML button IDs
        for (let i = 3; i <= 12; i++) {
            const stepId = `step${i}-smartphone`;
            const prevButtonId = `prev${stepId.charAt(0).toUpperCase() + stepId.slice(1)}`;
            const nextButtonId = `next${stepId.charAt(0).toUpperCase() + stepId.slice(1)}`;
            
            document.getElementById(prevButtonId)?.addEventListener('click', () => this.prevStep());
            document.getElementById(nextButtonId)?.addEventListener('click', () => {
                if (i === 12) {
                    this.submitQuiz();
                } else {
                    this.nextStep();
                }
            });
        }
    }

    setupTabletListeners() {
        // Single choice questions
        const singleChoiceSteps = ['step4-tablet', 'step5-tablet', 'step6-tablet', 'step7-tablet', 'step10-tablet', 'step11-tablet'];
        singleChoiceSteps.forEach(stepId => {
            this.setupOptionListeners(stepId, `next${stepId.charAt(0).toUpperCase() + stepId.slice(1)}`);
        });

        // Multi-select questions
        const multiSelectSteps = ['step3-tablet', 'step8-tablet', 'step9-tablet', 'step12-tablet', 'step13-tablet'];
        const maxSelections = {
            'step3-tablet': 3,
            'step8-tablet': 3,
            'step9-tablet': 2,
            'step12-tablet': 2,
            'step13-tablet': 2
        };
        multiSelectSteps.forEach(stepId => {
            this.setupMultiSelectListeners(stepId, `next${stepId.charAt(0).toUpperCase() + stepId.slice(1)}`, maxSelections[stepId]);
        });

        // Navigation buttons - using exact HTML button IDs
        for (let i = 3; i <= 13; i++) {
            const stepId = `step${i}-tablet`;
            const prevButtonId = `prev${stepId.charAt(0).toUpperCase() + stepId.slice(1)}`;
            const nextButtonId = `next${stepId.charAt(0).toUpperCase() + stepId.slice(1)}`;
            
            document.getElementById(prevButtonId)?.addEventListener('click', () => this.prevStep());
            document.getElementById(nextButtonId)?.addEventListener('click', () => {
                if (i === 13) {
                    this.submitQuiz();
                } else {
                    this.nextStep();
                }
            });
        }
    }

    setupLaptopListeners() {
        // Single choice questions
        const singleChoiceSteps = ['step4-laptop', 'step5-laptop', 'step6-laptop', 'step7-laptop', 'step9-laptop', 'step10-laptop', 'step11-laptop', 'step15-laptop'];
        singleChoiceSteps.forEach(stepId => {
            this.setupOptionListeners(stepId, `next${stepId.charAt(0).toUpperCase() + stepId.slice(1)}`);
        });

        // Multi-select questions
        const multiSelectSteps = ['step3-laptop', 'step8-laptop', 'step12-laptop', 'step13-laptop', 'step14-laptop', 'step16-laptop'];
        const maxSelections = {
            'step3-laptop': 3,
            'step8-laptop': 3,
            'step12-laptop': 3,
            'step13-laptop': 2,
            'step14-laptop': 2,
            'step16-laptop': 2
        };
        multiSelectSteps.forEach(stepId => {
            this.setupMultiSelectListeners(stepId, `next${stepId.charAt(0).toUpperCase() + stepId.slice(1)}`, maxSelections[stepId]);
        });

        // Navigation buttons - using exact HTML button IDs
        for (let i = 3; i <= 16; i++) {
            const stepId = `step${i}-laptop`;
            const prevButtonId = `prev${stepId.charAt(0).toUpperCase() + stepId.slice(1)}`;
            const nextButtonId = `next${stepId.charAt(0).toUpperCase() + stepId.slice(1)}`;
            
            document.getElementById(prevButtonId)?.addEventListener('click', () => this.prevStep());
            document.getElementById(nextButtonId)?.addEventListener('click', () => {
                if (i === 16) {
                    this.submitQuiz();
                } else {
                    this.nextStep();
                }
            });
        }
    }

    setupOptionListeners(stepId, nextButtonId) {
        const container = document.getElementById(stepId);
        if (!container) return;
        
        const options = container.querySelectorAll('.option');
        const nextBtn = document.getElementById(nextButtonId);

        options.forEach(option => {
            option.addEventListener('click', () => {
                // Remove previous selections in this step
                options.forEach(opt => opt.classList.remove('selected'));
                
                // Select current option
                option.classList.add('selected');
                
                // Store answer
                this.answers[stepId] = option.dataset.value;
                
                // Enable next button
                if (nextBtn) {
                    nextBtn.disabled = false;
                }
            });
        });
    }

    setupMultiSelectListeners(stepId, nextButtonId, maxSelections) {
        const container = document.getElementById(stepId);
        if (!container) return;
        
        const options = container.querySelectorAll('.multi-select-option');
        const nextBtn = document.getElementById(nextButtonId);

        options.forEach(option => {
            option.addEventListener('click', () => {
                const isSelected = option.classList.contains('selected');
                
                if (isSelected) {
                    // Deselect
                    option.classList.remove('selected');
                } else {
                    // Check if we can select more
                    const selectedCount = container.querySelectorAll('.multi-select-option.selected').length;
                    if (selectedCount < maxSelections) {
                        option.classList.add('selected');
                    } else {
                        // Show message that max selections reached
                        this.showMessage(`You can select up to ${maxSelections} options`, 'info');
                        return;
                    }
                }
                
                // Store answers
                const selectedOptions = container.querySelectorAll('.multi-select-option.selected');
                this.answers[stepId] = Array.from(selectedOptions).map(o => o.dataset.value);
                
                // Enable/disable next button
                if (nextBtn) {
                    nextBtn.disabled = selectedOptions.length === 0;
                }
            });
        });
    }

    validateStep1() {
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const emailError = document.getElementById('emailError');
        const nextBtn = document.getElementById('nextStep1');
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(email);
        
        if (email && !isValidEmail) {
            document.getElementById('userEmail').classList.add('error');
            emailError.style.display = 'block';
        } else {
            document.getElementById('userEmail').classList.remove('error');
            emailError.style.display = 'none';
        }
        
        // Enable next button if both fields are valid
        const shouldEnable = name && email && isValidEmail;
        
        if (nextBtn) {
            const wasDisabled = nextBtn.disabled;
            nextBtn.disabled = !shouldEnable;
        }
        
        // Store answers
        this.answers.step1 = {
            name: name,
            email: email
        };
    }

    startQuestionnaire() {
        document.getElementById('welcomeSection').style.display = 'none';
        document.getElementById('questionnaireSection').classList.add('active');
        this.showStep(2);
    }

    showStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.question-container').forEach(step => {
            step.classList.remove('active');
        });
        
        // Hide device-specific question sections
        document.getElementById('smartphone-questions').style.display = 'none';
        document.getElementById('tablet-questions').style.display = 'none';
        document.getElementById('laptop-questions').style.display = 'none';
        
        // Show current step
        let stepId;
        if (stepNumber === 2) {
            stepId = 'step2';
        } else if (this.selectedDevice) {
            stepId = `step${stepNumber}-${this.selectedDevice}`;
            // Show device-specific questions
            document.getElementById(`${this.selectedDevice}-questions`).style.display = 'block';
        }
        
        const stepElement = document.getElementById(stepId);
        if (stepElement) {
            stepElement.classList.add('active');
        }
        
        this.currentStep = stepNumber;
        this.updateProgress();
        
        // Update user name display if available
        if (stepNumber === 2 && this.answers.step1?.name) {
            document.getElementById('userNameDisplay').textContent = this.answers.step1.name;
        }
        
        // Update quiz title based on device selection
        if (this.selectedDevice) {
            const deviceNames = {
                'smartphone': 'Smartphone',
                'tablet': 'Tablet',
                'laptop': 'Laptop'
            };
            document.getElementById('quizTitle').textContent = `Great choice, ${this.answers.step1?.name || 'there'}! Congrats on your upcoming ${deviceNames[this.selectedDevice]}! 🥳`;
        }

        // Scroll to very top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    nextStep() {
        if (this.currentStep === 1) {
            // Store user info and move to device selection
            this.startQuestionnaire();
        } else if (this.currentStep === 2) {
            // Store device selection and show device-specific questions
            this.selectedDevice = this.answers.step2;
            this.showStep(3);
        } else {
            // Move to next step within device-specific questions
            this.showStep(this.currentStep + 1);
        }
    }

    prevStep() {
        if (this.currentStep === 2) {
            // Go back to welcome section
            document.getElementById('questionnaireSection').classList.remove('active');
            document.getElementById('welcomeSection').style.display = 'block';
            this.currentStep = 1;
        } else if (this.currentStep === 3) {
            // Go back to device selection
            this.showStep(2);
        } else {
            // Go back to previous step within device-specific questions
            this.showStep(this.currentStep - 1);
        }
        this.updateProgress();
    }

    updateProgress() {
        const progressBar = document.getElementById('progressBar');
        let progress = 0;
        if (this.selectedDevice) {
            const totalSteps = this.totalSteps[this.selectedDevice] || 16;
            progress = (this.currentStep - 2) / (totalSteps - 1) * 100;
        } else if (this.currentStep === 2) {
            progress = 0;
        }
        progressBar.style.width = `${progress}%`;
    }

    async submitQuiz() {
        try {
            this.showLoading();
            
            // Prepare data for backend
            const mappedAnswers = mapAnswersToDescriptiveKeys(this.answers, this.selectedDevice);
            const quizData = {
                user_info: mappedAnswers.user_info,
                device_type: mappedAnswers.device_type,
                answers: mappedAnswers,
                timestamp: new Date().toISOString()
            };
            
            // Send to backend
            const response = await fetch('http://127.0.0.1:8000/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quizData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            this.hideLoading();
            this.showResults(result);
            
        } catch (error) {
            this.hideLoading();
            this.showMessage('Sorry, there was an error processing your request. Please try again.', 'error');
        }
    }

    showLoading() {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }

    showResults(result) {
        // Hide questionnaire section
        document.getElementById('questionnaireSection').style.display = 'none';
        
        // Show results section
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.classList.add('active');
        
        // Generate results HTML
        resultsSection.innerHTML = this.generateResultsHTML(result);
    }

    generateResultsHTML(result) {
        let defaultIcons = {
            smartphone: '<video src="../content resources/mobile_icon.webm" width="150" height="150" autoplay loop muted playsinline style="border-radius:16px;background:#f5f5f5;"></video>',
            laptop: '<video src="../content resources/laptop_icon.webm" width="150" height="150" autoplay loop muted playsinline style="border-radius:16px;background:#f5f5f5;"></video>',
            tablet: '<div style="width:150px;height:150px;display:flex;align-items:center;justify-content:center;font-size:5rem;background:#f5f5f5;border-radius:16px;">📱</div>'
        };
        let html = `
            <div class="quiz-header" style="text-align:center; margin-bottom:2.5rem;">
                <h2 style="font-size:2.2rem; color:#111;">Your Personalized Recommendations</h2>
                <p style="font-size:1.15rem; color:#fff;">${result.summary || 'Based on your preferences, here are our top recommendations:'}</p>
            </div>
        `;
        if (result.recommendations && result.recommendations.length > 0) {
            result.recommendations.forEach((rec, index) => {
                // Determine device type robustly
                let deviceType = 'laptop';
                if (rec.device_type) {
                    deviceType = rec.device_type.toLowerCase();
                } else if (result.device_type) {
                    deviceType = result.device_type.toLowerCase();
                } else if (rec.name) {
                    const name = rec.name.toLowerCase();
                    if (name.includes('phone')) deviceType = 'smartphone';
                    else if (name.includes('tablet') || name.includes('pad')) deviceType = 'tablet';
                    else if (name.includes('laptop') || name.includes('notebook') || name.includes('macbook') || name.includes('chromebook')) deviceType = 'laptop';
                }
                // Use only one image (rec.image or rec.images[0])
                let imageUrl = rec.image || (rec.images && rec.images.length > 0 ? rec.images[0] : null);
                // Image HTML with fallback logic
                let imageHtml = '';
                if (imageUrl) {
                    imageHtml = `<div class="carousel"><img src="${imageUrl}" alt="${rec.name}" style="width:150px;height:150px;object-fit:cover;border-radius:16px;background:#f5f5f5;" onerror="this.onerror=null;this.style.display='none';this.parentNode.innerHTML=window.getDefaultIcon && window.getDefaultIcon('${deviceType}');"></div>`;
                } else {
                    imageHtml = `<div class="carousel">${defaultIcons[deviceType]}</div>`;
                }
                // Prepare links
                let linksHtml = '';
                if (rec.links) {
                    for (const [key, url] of Object.entries(rec.links)) {
                        if (url) {
                            const label = key.charAt(0).toUpperCase() + key.slice(1);
                            // Add a specific class for product link buttons
                            linksHtml += `<a class="link-btn product-link-btn" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
                        }
                    }
                } else if (rec.link) {
                    linksHtml = `<a class="link-btn product-link-btn" href="${rec.link}" target="_blank" rel="noopener noreferrer">Learn More</a>`;
                }
                // Features
                let featuresHtml = '';
                if (rec.features && rec.features.length > 0) {
                    featuresHtml = rec.features.map(f => `<span class="feature-badge">${f}</span>`).join('');
                }
                // Highlights
                let highlightHtml = '';
                if (rec.highlights) {
                    highlightHtml = `<div class="highlight">${rec.highlights}</div>`;
                }
                // Rating
                let ratingHtml = '';
                if (rec.rating) {
                    const fullStars = Math.floor(rec.rating);
                    const halfStar = rec.rating - fullStars >= 0.5;
                    ratingHtml = '<div style="margin:0.5rem 0;">' +
                        '⭐'.repeat(fullStars) + (halfStar ? '✬' : '') +
                        `<span style="color:#666; margin-left:0.5rem;">(${rec.rating}/5)</span></div>`;
                }
                // YouTube review button
                let youtubeHtml = '';
                if (rec.youtube_review) {
                    youtubeHtml = `
                        <div style="margin-top:1rem;">
                            <div style="font-weight:700; color:#E64833; margin-bottom:0.3rem; font-size:1.08rem; letter-spacing:0.2px;">YouTube Review</div>
                            <a class="review-btn" href="${rec.youtube_review}" target="_blank" rel="noopener noreferrer"><span class="review-icon">▶️</span>Watch Review</a>
                        </div>
                    `;
                }
                html += `
                    <div class="device-card" style="animation-delay:${0.1 + index * 0.1}s;">
                        <div style="display:flex; flex-wrap:wrap; gap:2rem; align-items:flex-start;">
                            <div style="min-width:130px;">${imageHtml}</div>
                            <div style="flex:1; min-width:220px;">
                                <h3 style="font-size:1.5rem; color:#244855; margin-bottom:0.5rem;">${rec.name}</h3>
                                <p style="font-size:1.2rem; color:#E64833; font-weight:600; margin-bottom:0.7rem;">${rec.price || ''}</p>
                                ${highlightHtml}
                                <p style="color:#666; margin-bottom:1rem;">${rec.description || ''}</p>
                                <div style="margin-bottom:0.7rem;">${featuresHtml}</div>
                                ${ratingHtml}
                                <div style="margin-top:0.7rem;">${linksHtml}</div>
                                ${youtubeHtml}
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            html += `
                <div class="device-card">
                    <h3>No recommendations available</h3>
                    <p>We couldn't find specific recommendations based on your preferences. Please try adjusting your criteria.</p>
                </div>
            `;
        }
        // Add restart button
        html += `
            <div style="text-align:center; margin-top:2rem;">
                <button onclick="location.reload()" class="start-btn">Start Over</button>
            </div>
        `;
        // Add a global function for fallback icon rendering
        if (!window.getDefaultIcon) {
            window.getDefaultIcon = function(type) {
                return defaultIcons[type] || defaultIcons['laptop'];
            };
        }
        if (!document.getElementById('recommendation-styles')) {
            const style = document.createElement('style');
            style.id = 'recommendation-styles';
            style.textContent = `
                .link-btn {
                    display: inline-block;
                    margin-top: 0.7rem;
                    background: #244855;
                    color: #fff;
                    padding: 0.5rem 1.2rem;
                    border-radius: 10px;
                    border: 2px solid #e0e0e0;
                    text-decoration: none;
                    font-weight: 600;
                    transition: background 0.2s, border 0.2s, color 0.2s;
                }
                .product-link-btn { margin-right: 1.1rem; }
                .product-link-btn:last-child { margin-right: 0; }
            `;
            document.head.appendChild(style);
        }
        return html;
    }

    showMessage(message, type = 'info') {
        // Create a simple message display
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#E64833' : '#244855'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            z-index: 1001;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 3000);
    }
}

// Mapping function for descriptive keys (outside the class)
function mapAnswersToDescriptiveKeys(answers, deviceType) {
    const mapping = {
        // Common
        step1: 'user_info',
        step2: 'device_type',
        // Laptop
        'step3-laptop': 'laptop_usage',
        'step4-laptop': 'laptop_role',
        'step5-laptop': 'laptop_weight',
        'step6-laptop': 'laptop_gpu_preference',
        'step7-laptop': 'laptop_screen_size',
        'step8-laptop': 'laptop_features',
        'step9-laptop': 'laptop_budget',
        'step10-laptop': 'laptop_lifespan',
        'step11-laptop': 'laptop_os_preference',
        'step12-laptop': 'laptop_connectivity',
        'step13-laptop': 'laptop_brand_openness',
        'step14-laptop': 'laptop_brand_preference',
        'step15-laptop': 'laptop_ecosystem_importance',
        'step16-laptop': 'laptop_tradeoffs',
        // Smartphone
        'step3-smartphone': 'smartphone_usage',
        'step4-smartphone': 'smartphone_patterns',
        'step5-smartphone': 'smartphone_budget',
        'step6-smartphone': 'smartphone_os',
        'step7-smartphone': 'smartphone_screen_size',
        'step8-smartphone': 'smartphone_features',
        'step9-smartphone': 'smartphone_lifespan',
        'step10-smartphone': 'smartphone_purchase_preferences',
        'step11-smartphone': 'smartphone_tradeoffs',
        'step12-smartphone': 'smartphone_optional_features',
        // Tablet
        'step3-tablet': 'tablet_usage',
        'step4-tablet': 'tablet_role',
        'step5-tablet': 'tablet_size',
        'step6-tablet': 'tablet_connectivity',
        'step7-tablet': 'tablet_os',
        'step8-tablet': 'tablet_features',
        'step9-tablet': 'tablet_connectivity_options',
        'step10-tablet': 'tablet_budget',
        'step11-tablet': 'tablet_lifespan',
        'step12-tablet': 'tablet_tradeoffs',
        'step13-tablet': 'tablet_brand_openness',
    };
    const mapped = {};
    for (const key in answers) {
        if (mapping[key]) {
            mapped[mapping[key]] = answers[key];
        } else {
            mapped[key] = answers[key]; // fallback to original if not mapped
        }
    }
    return mapped;
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.quiz = new RecommendationQuiz();
});

// Global function to start questionnaire (called from HTML)
function startQuestionnaire() {
    if (window.quiz) {
        window.quiz.startQuestionnaire();
    }
} 