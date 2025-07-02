document.addEventListener('DOMContentLoaded', () => {
    new RecommendationQuiz();
});

class RecommendationQuiz {
    constructor() {
        this.currentStep = 1;
        this.currentDeviceQuestion = 0;
        this.userData = {
            name: '',
            email: '',
            device: '',
            answers: {}
        };
        this.questions = this.getQuestionData();
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Step 1: User Info
        document.getElementById('userName').addEventListener('input', () => this.validateStep1());
        document.getElementById('userEmail').addEventListener('input', () => this.validateStep1());
        document.getElementById('nextBtn-step1').addEventListener('click', () => this.showStep(2));

        // Step 2: Device Selection
        document.querySelectorAll('#step2 .option').forEach(el => {
            el.addEventListener('click', (e) => {
                const device = e.currentTarget.dataset.value;
                this.userData.device = device;
                document.getElementById('selectedDeviceDisplay').textContent = device;
                this.showStep(3);
            });
        });

        // Step 3: Transition
        document.getElementById('startDeviceQuestionsBtn').addEventListener('click', () => this.startDeviceQuestions());
        
        // General Previous Buttons
        document.querySelectorAll('.prev-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.showStep(parseInt(e.currentTarget.dataset.target.replace('step', ''))));
        });
    }

    // --- Core Navigation ---
    showStep(step) {
        document.querySelectorAll('.question-container').forEach(el => el.classList.remove('active'));
        const targetStep = document.getElementById(`step${step}`);
        if(targetStep) {
            targetStep.classList.add('active');
            if (this.userData.name) {
                document.querySelectorAll('.userNameDisplay').forEach(el => el.textContent = this.userData.name);
            }
        }
        this.currentStep = step;

        // Hide device questionnaire if going back to initial steps
        if (step <= 3) {
            document.getElementById('deviceQuestionnaire').style.display = 'none';
        }
    }
    
    startDeviceQuestions() {
        this.currentDeviceQuestion = 1;
        document.getElementById('step3').classList.remove('active');
        document.getElementById('deviceQuestionnaire').style.display = 'block';
        this.renderDeviceQuestion();
    }

    renderDeviceQuestion() {
        const deviceQuestions = this.questions[this.userData.device];
        if (!deviceQuestions || this.currentDeviceQuestion > deviceQuestions.length) {
            this.submitQuiz();
            return;
        }

        const q = deviceQuestions[this.currentDeviceQuestion - 1];
        const container = document.getElementById('deviceQuestionnaire');
        
        let optionsHTML = '';
        if (q.type === 'single' || q.type === 'multi') {
            optionsHTML = q.options.map(opt => `
                <div class="option" data-value="${opt.value || opt.label}">
                    <div class="option-text"><div class="option-title">${opt.label}</div></div>
                </div>
            `).join('');
        }
        
        container.innerHTML = `
            <div class="quiz-header">
                <h2>${this.userData.device.charAt(0).toUpperCase() + this.userData.device.slice(1)} Questions</h2>
                <div class="quiz-progress">
                    <div class="progress-bar" id="progressBar" style="width: ${((this.currentDeviceQuestion-1)/deviceQuestions.length)*100}%"></div>
                </div>
            </div>
            <div class="question-container active">
                <div class="question">${q.text}</div>
                <div class="options ${q.type === 'multi' ? 'multi-select' : ''}">${optionsHTML}</div>
                <div class="quiz-navigation">
                    <button class="nav-btn" id="prevDeviceQuestionBtn"><i class="fas fa-arrow-left"></i> Previous</button>
                    <button class="nav-btn" id="nextDeviceQuestionBtn" disabled>Next <i class="fas fa-arrow-right"></i></button>
                </div>
            </div>
        `;

        this.setupDeviceQuestionListeners(q);
    }
    
    setupDeviceQuestionListeners(q) {
        // Handle option clicks
        document.querySelectorAll('#deviceQuestionnaire .option').forEach(el => {
            el.addEventListener('click', e => {
                const target = e.currentTarget;
                const value = target.dataset.value;
                const isSelected = target.classList.contains('selected');
                
                if(q.type === 'single') {
                    document.querySelectorAll('#deviceQuestionnaire .option').forEach(opt => opt.classList.remove('selected'));
                    target.classList.add('selected');
                    this.userData.answers[q.id] = value;
                } else if (q.type === 'multi') {
                    const selectedCount = document.querySelectorAll('#deviceQuestionnaire .option.selected').length;
                    if(isSelected) {
                        target.classList.remove('selected');
                    } else if (selectedCount < q.max) {
                        target.classList.add('selected');
                    } else {
                        this.showMessage(`You can select up to ${q.max} options.`);
                    }
                    const selectedValues = Array.from(document.querySelectorAll('#deviceQuestionnaire .option.selected')).map(opt => opt.dataset.value);
                    this.userData.answers[q.id] = selectedValues;
                }
                this.validateDeviceQuestion(q);
            });
        });
        
        // Nav buttons
        document.getElementById('nextDeviceQuestionBtn').addEventListener('click', () => {
            this.currentDeviceQuestion++;
            this.renderDeviceQuestion();
        });
        
        document.getElementById('prevDeviceQuestionBtn').addEventListener('click', () => {
             if (this.currentDeviceQuestion > 1) {
                this.currentDeviceQuestion--;
                this.renderDeviceQuestion();
            } else {
                this.showStep(3); // Go back to transition screen
            }
        });
    }

    // --- Validation ---
    validateStep1() {
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        
        document.getElementById('emailError').style.display = email && !isValidEmail ? 'block' : 'none';
        
        const canProceed = name && email && isValidEmail;
        document.getElementById('nextBtn-step1').disabled = !canProceed;
        if(canProceed) {
            this.userData.name = name;
            this.userData.email = email;
        }
    }
    
    validateDeviceQuestion(q) {
        const answer = this.userData.answers[q.id];
        let isComplete = false;
        if(q.type === 'single') {
            isComplete = !!answer;
        } else if (q.type === 'multi') {
            isComplete = answer && answer.length > 0;
        }
        document.getElementById('nextDeviceQuestionBtn').disabled = !isComplete;
        
        // Change button text on last question
        if (this.currentDeviceQuestion === this.questions[this.userData.device].length) {
            document.getElementById('nextDeviceQuestionBtn').innerHTML = '✨ Find My TechTrove!';
        }
    }

    // --- AI Integration & Results ---
    buildPrompt() {
        let prompt = `You are 'TroveFinder', an expert AI tech advisor for the Indian market. A user named ${this.userData.name} needs a new ${this.userData.device}. Your response MUST be a single, valid JSON object with keys "summary" and "recommendations". The recommendations array should contain 2-3 device objects, each with keys: "name", "price", "image_url", "description", "features" (array), "rating" (1-5), and "link". All links must be for Indian e-commerce sites.\n\n**USER'S REQUIREMENTS FOR A ${this.userData.device.toUpperCase()}:**\n`;
        
        const deviceQuestions = this.questions[this.userData.device];
        deviceQuestions.forEach(q => {
            const answer = this.userData.answers[q.id];
            if (answer) {
                 prompt += `- ${q.promptLabel}: ${Array.isArray(answer) ? answer.join(', ') : answer}\n`;
            }
        });
        
        return prompt;
    }

    async submitQuiz() {
        document.getElementById('deviceQuestionnaire').style.display = 'none';
        document.getElementById('loadingSection').style.display = 'block';

        const API_KEY = ""; // PASTE YOUR GEMINI API KEY HERE
        if (!API_KEY) {
            this.showMessage("API Key is missing in recommendation.js", "error");
            this.showErrorState();
            return;
        }
        
        const payload = { contents: [{ parts: [{ text: this.buildPrompt() }] }], generationConfig: { responseMimeType: "application/json" } };

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const result = await response.json();
            const jsonText = result.candidates[0].content.parts[0].text;
            this.renderResults(JSON.parse(jsonText));
        } catch (error) {
            console.error('Error:', error);
            this.showMessage('An error occurred. Please try again.', 'error');
            this.showErrorState();
        }
    }

    renderResults(resultData) {
        document.getElementById('loadingSection').style.display = 'none';
        const container = document.getElementById('resultsSection');
        const resultsHTML = `
            <div class="result-container">
                <div class="result-header"><h2><i class="fas fa-star"></i> Your TechTrove Recommendations</h2><p>Hi ${this.userData.name}, here are the perfect devices for you!</p></div>
                <div class="result-summary"><h3>Why These Recommendations?</h3><p>${resultData.summary || "Here's what our AI found."}</p></div>
                <div class="recommendations-grid">
                    ${resultData.recommendations.map(rec => `
                        <div class="recommendation-card">
                            <div class="device-image"><img src="${rec.image_url || ''}" alt="${rec.name}" onerror="this.onerror=null;this.src='https://placehold.co/200x200/FBE9D0/244855?text=Image';"></div>
                            <div class="device-info">
                                <h3>${rec.name}</h3><p class="price">${rec.price}</p><p class="description">${rec.description}</p>
                                <div class="features">${rec.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}</div>
                                <div class="rating">${'★'.repeat(rec.rating)}${'☆'.repeat(5 - rec.rating)} <span class="rating-text">${rec.rating}/5</span></div>
                                <a href="${rec.link}" target="_blank" class="buy-btn">View Deal <i class="fas fa-arrow-right"></i></a>
                            </div>
                        </div>`).join('')}
                </div>
                <button id="restartQuiz" class="restart-btn"><i class="fas fa-redo"></i> Take Quiz Again</button>
            </div>`;
        container.innerHTML = resultsHTML;
        document.getElementById('restartQuiz').addEventListener('click', () => window.location.reload());
    }
    
    showErrorState() {
        document.getElementById('loadingSection').style.display = 'none';
        // Logic to allow user to retry, maybe go back to last question. For now, just reloads.
        window.location.reload();
    }

    showMessage(message, type = 'info') {
        const el = document.createElement('div');
        el.className = `message message-${type}`;
        el.textContent = message;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 4000);
    }

    // --- Question Data Store ---
    getQuestionData() {
        return {
            smartphone: [
                { id: 'q1_lifestyle', type: 'single', text: "What's your primary role or lifestyle?", promptLabel: "Lifestyle", options: [{label: 'Student'}, {label: 'Working professional (Tech/Office)'}, {label: 'Business owner'}, {label: 'Content creator'}, {label: 'Retired / Casual user'}] },
                { id: 'q2_primary_use', type: 'multi', max: 3, text: "How do you primarily use your phone?", promptLabel: "Primary Use", options: [{label: 'Social Media & Messaging'}, {label: 'Photography & Videography'}, {label: 'Gaming'}, {label: 'Reading / Productivity'}, {label: 'Business / Finance apps'}, {label: 'Watching movies / YouTube'}, {label: 'Calling & Basic Use'}] },
                { id: 'q3_screen_size', type: 'single', text: "Preferred screen size?", promptLabel: "Screen Size", options: [{label: 'Compact (<6.1 inches)'}, {label: 'Medium (6.1-6.6 inches)'}, {label: 'Large (>6.6 inches)'}] },
                { id: 'q4_build', type: 'single', text: "Preferred device build?", promptLabel: "Build Preference", options: [{label: 'Sleek & lightweight'}, {label: 'Rugged / Long battery life'}, {label: 'Premium materials (glass/metal)'}, {label: "Doesn't matter"}] },
                { id: 'q5_os', type: 'single', text: "Preferred OS?", promptLabel: "OS", options: [{label: 'Android'}, {label: 'iOS'}, {label: 'Open to both'}] },
                { id: 'q6_budget', type: 'single', text: "What’s your smartphone budget?", promptLabel: "Budget", options: [{label: 'Under ₹10,000'}, {label: '₹10,000 – ₹20,000'}, {label: '₹20,000 – ₹30,000'}, {label: '₹30,000 – ₹50,000'}, {label: '₹50,000 – ₹75,000'}, {label: '₹75,000+'}] },
                { id: 'q7_longevity', type: 'single', text: "How many years do you plan to use the device?", promptLabel: "Longevity", options: [{label: '1-2 years'}, {label: '2-3 years'}, {label: '3+ years'}] },
                { id: 'q8_open_to', type: 'multi', max: 2, text: "Would you be open to:", promptLabel: "Open to", options: [{label: 'Lesser-known brand with good specs'}, {label: "Last year's flagship model"}, {label: 'Slightly stretching budget for durability'}, {label: 'Refurbished / Renewed options'}] },
                { id: 'q9_tradeoffs', type: 'multi', max: 2, text: "Which trade-offs are you willing to make?", promptLabel: "Willing to Trade-off", options: [{label: 'Camera quality'}, {label: 'Build quality'}, {label: 'Battery life'}, {label: 'Display quality'}, {label: 'Software experience'}] },
                { id: 'q10_features', type: 'multi', max: 3, text: "Optional features you’d love to have?", promptLabel: "Desired Features", options: [{label: '5G support'}, {label: 'Good low-light camera'}, {label: 'Ultra-wide or telephoto lens'}, {label: 'Long-lasting battery (5000mAh+)'}, {label: 'Fast charging (50W+)'}, {label: 'High refresh rate display'}, {label: 'Expandable storage'}, {label: 'Clean or stock Android experience'}] }
            ],
            tablet: [
                // ... (add tablet questions here in the same format) ...
            ],
            laptop: [
                // ... (add laptop questions here in the same format) ...
            ]
        };
    }
}
