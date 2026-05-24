document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const optimizeBtn = document.getElementById('optimizeBtn');
    const codeInput = document.getElementById('codeInput');
    const languageSelect = document.getElementById('language');
    const codeOutput = document.getElementById('codeOutput');
    const loading = document.getElementById('loading');
    const explanationSection = document.getElementById('explanationSection');
    const explanationContent = document.getElementById('explanationContent');
    const timePrev = document.getElementById('timePrev');
    const timeNew = document.getElementById('timeNew');

    // Chatbot Elements
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.getElementById('closeChat');
    const sendChat = document.getElementById('sendChat');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    const API_URL = 'http://localhost:3000/api';

    // --- Optimization Logic ---
    optimizeBtn.addEventListener('click', async () => {
        const code = codeInput.value.trim();
        const language = languageSelect.value;

        if (!code) {
            alert('Please paste some code first!');
            return;
        }

        // Reset UI
        codeOutput.innerHTML = '';
        loading.classList.remove('hidden');
        explanationSection.classList.add('hidden');
        codeInput.parentElement.style.opacity = '0.5';

        try {
            const response = await fetch(`${API_URL}/optimize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, language })
            });

            const data = await response.json();

            // Simulate "Typing" effect for result
            loading.classList.add('hidden');
            codeInput.parentElement.style.opacity = '1';

            // Set optimized code
            codeOutput.textContent = data.optimized;

            // Set Complexity
            timePrev.textContent = `Time: ${data.timeComplexity.before}`;
            timeNew.textContent = `Time: ${data.timeComplexity.after}`;

            // Set Explanation
            const listItems = data.explanation.map(item => `<li>${item}</li>`).join('');
            explanationContent.innerHTML = `<ul>${listItems}</ul>`;
            explanationSection.classList.remove('hidden');

            // Add highlight class
            codeOutput.classList.remove('language-javascript', 'language-python', 'language-java');
            codeOutput.classList.add(`language-${language}`);

        } catch (error) {
            console.error('Error:', error);
            loading.classList.add('hidden');
            codeOutput.textContent = '// Error connecting to backend server.\n// Please ensure the backend is running on localhost:3000';
            codeInput.parentElement.style.opacity = '1';
        }
    });

    // --- Chatbot Logic ---

    function toggleChat() {
        chatWindow.classList.toggle('hidden');
    }

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        msgDiv.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function handleChat() {
        const message = chatInput.value.trim();
        if (!message) return;

        addMessage(message, 'user');
        chatInput.value = '';

        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            addMessage(data.reply, 'bot');
        } catch (error) {
            addMessage("Sorry, I can't reach the server right now.", 'bot');
        }
    }

    chatToggle.addEventListener('click', toggleChat);
    closeChat.addEventListener('click', toggleChat);

    sendChat.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });
});

