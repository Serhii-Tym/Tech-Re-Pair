var currentGuruTopic = ''; 

var themeToggle = document.getElementById('themeToggle');
var themeIcon = document.getElementById('themeIcon');
var STORAGE_KEY = 'color-theme';
var CLASS_NAME = 'dark-mode'; 

function applyTheme(isLight) {
    if (isLight) {
        document.body.classList.add(CLASS_NAME);
        localStorage.setItem(STORAGE_KEY, 'light');
        themeIcon.src = 'Images/DarkBtn.png';
        themeIcon.style.filter = 'invert(0) brightness(0)';
        themeToggle.setAttribute('aria-label', 'Switch to Dark Mode');
    } else {
        document.body.classList.remove(CLASS_NAME);
        localStorage.setItem(STORAGE_KEY, 'dark');
        themeIcon.src = 'Images/LightBtn.png';
        themeIcon.style.filter = 'invert(1) brightness(1.5)';
        themeToggle.setAttribute('aria-label', 'Switch to Light Mode');
    }
}

function initializeTheme() {
    var savedTheme = localStorage.getItem(STORAGE_KEY);

    if (savedTheme === 'light') {
        applyTheme(true);
    } else if (savedTheme === 'dark') {
        applyTheme(false);
    } else {
        var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        applyTheme(prefersLight);
    }
}

function createMessageBubble(sender, text) {
    var bubble = document.createElement('div');
    bubble.className = 'message-bubble message-' + sender;
    bubble.innerHTML = text.replace(/\n/g, '<br>'); 
    
    var time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    var timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    timeSpan.textContent = time;
    bubble.appendChild(timeSpan);
    
    return bubble;
}

function handleAdvice(event) {
    event.preventDefault();
    var form = event.target;
    var input = form.querySelector('input'); 
    var messagesContainer = form.closest('.chat-container').querySelector('.messages-container');
    var userMessage = input.value.trim();
    var aiResponse = ''; // Declared once here to prevent redefinition warning

    if (!userMessage) return;
    
    if (userMessage.toLowerCase().includes('reset')) {
        currentGuruTopic = '';
        aiResponse = "✅ **Context Cleared.** How can I help you with a new issue today?"; // Assignment
        messagesContainer.appendChild(createMessageBubble('user', userMessage));
        input.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        setTimeout(function() {
            messagesContainer.appendChild(createMessageBubble('ai', aiResponse));
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 500);
        return;
    }

    messagesContainer.appendChild(createMessageBubble('user', userMessage));
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    var currentPage = document.title.toLowerCase();
    var userQuery = userMessage.toLowerCase();
    
    var contextMap = {
        'phone repair': 'phone',
        'tablet repair': 'tablet',
        'desktop & laptop repair': 'pc',
        'phone advice': 'phone',
        'tablet advice': 'tablet'
    };

    var context = 'general';
    for (var key in contextMap) {
        if (currentPage.includes(key)) {
            context = contextMap[key];
            break;
        }
    }
    
    var specificTopicSet = false;

    switch (context) {
        case 'phone':
            if (userQuery.includes('screen') || userQuery.includes('crack') || userQuery.includes('display')) {
                aiResponse = "📱 **Phone Guru Advice: Screen Repair**\nCracked screens need a full display assembly replacement. This is our most common repair, usually taking **1-2 hours**. Important: The water resistance seal is now compromised. Avoid moisture immediately.";
                currentGuruTopic = 'phone_screen'; specificTopicSet = true;
            } else if (userQuery.includes('battery') || userQuery.includes('charge') || userQuery.includes('power')) {
                aiResponse = "🔋 **Phone Guru Advice: Power Issues**\nIf your phone is draining fast or not holding a charge, it needs a **battery diagnostic and replacement**. This must be done professionally to ensure safety and restore water resistance ratings.";
                currentGuruTopic = 'phone_battery'; specificTopicSet = true;
            } else if (userQuery.includes('water') || userQuery.includes('liquid') || userQuery.includes('wet')) {
                aiResponse = "💧 **Phone Guru: LIQUID DAMAGE ALERT!**\n**DO NOT** try to turn the device on or charge it. Power it down immediately and book an emergency diagnostic. Time is critical to saving components.";
                currentGuruTopic = 'phone_water'; specificTopicSet = true;
            }
            break;
        case 'tablet':
            if (userQuery.includes('touch') || userQuery.includes('digitizer') || userQuery.includes('unresponsive') || userQuery.includes('screen')) {
                aiResponse = "✍️ **Tablet Guru Advice: Touch Repair**\nAn unresponsive touch screen means the **digitizer layer** is faulty. On most tablets, this necessitates replacing the entire front display assembly. We can provide a quote based on your model.";
                currentGuruTopic = 'tablet_touch'; specificTopicSet = true;
            } else if (userQuery.includes('slow') || userQuery.includes('lag') || userQuery.includes('storage')) {
                aiResponse = "🐢 **Tablet Guru Advice: Performance**\nTablet slowness is often caused by low storage or too many background apps. Try clearing app caches and deleting unused media. If the issue is persistent, a factory reset might be needed, but back up your data first!";
                currentGuruTopic = 'tablet_slow'; specificTopicSet = true;
            }
            break;
        case 'pc':
            if (userQuery.includes('slow') || userQuery.includes('speed') || userQuery.includes('upgrade')) {
                aiResponse = "💨 **PC Guru Advice: Performance**\nA massive performance boost comes from upgrading to an **SSD** (if you don't have one) and ensuring you have **8GB+ of RAM**. We specialize in cost-effective component upgrades.";
                currentGuruTopic = 'pc_slow'; specificTopicSet = true;
            } else if (userQuery.includes('boot') || userQuery.includes('disk') || userQuery.includes('drive') || userQuery.includes('ssd')) {
                aiResponse = "💾 **PC Guru: Drive/Data Alert!**\nIf your computer won't boot or is showing hard drive errors, **BACKUP YOUR DATA IMMEDIATELY!** Drive failure is time-sensitive. We can diagnose and replace the drive, and attempt data recovery.";
                currentGuruTopic = 'pc_drive'; specificTopicSet = true;
            } else if (userQuery.includes('blue screen') || userQuery.includes('bsod') || userQuery.includes('crash')) {
                aiResponse = "🚨 **PC Guru Advice: BSOD**\nThe Blue Screen of Death usually indicates critical hardware (like RAM) or driver failure. Note down the **error code** (e.g., KMODE_EXCEPTION_NOT_HANDLED). This helps us diagnose the root cause faster.";
                currentGuruTopic = 'pc_bsod'; specificTopicSet = true;
            }
            break;
    }
    
    if (!specificTopicSet && currentGuruTopic !== '') {
        var followUpKeywords = ['how', 'diy', 'do it myself', 'home', 'tool', 'guide'];
        var isFollowUp = followUpKeywords.some(function(keyword) { return userQuery.includes(keyword); });

        if (isFollowUp) {
            if (currentGuruTopic.includes('screen') || currentGuruTopic.includes('battery') || currentGuruTopic.includes('water')) {
                 aiResponse = "🛑 **Professional Repair Warning:** For critical component repairs like screens, batteries, and water damage, **DIY is strongly discouraged**.\nThese jobs require specialized tools, calibration, and risk damaging surrounding components (or personal injury with batteries). We recommend booking a certified technician.";
            } else {
                 aiResponse = "AI Follow-up: Given our discussion on **" + currentGuruTopic.replace('_', ' ') + "**, it sounds like you need professional help. Would you like me to guide you to the contact page to book a repair?";
            }
        } else {
            aiResponse = "AI Follow-up: I'm currently focused on your issue regarding **" + currentGuruTopic.replace('_', ' ') + "**. Can you clarify your question, or try asking \"reset\" to start a new topic?";
        }
        
    } else if (!specificTopicSet) {
        if (context !== 'general') {
            aiResponse = "AI " + context.toUpperCase() + " Advice: Processing \"" + userMessage + "\". Please be more specific (e.g., \"screen cracked\" or \"battery draining\"). If the issue continues, please book a free diagnostic.";
        } else {
             aiResponse = "AI General Advice: Thank you for your inquiry about \"" + userMessage + "\". To give you the best advice, please navigate to the specialized page for your device (**Phones, Tablets, or Desktops/Laptops**) and ask your question there.";
        }
    }

    setTimeout(function() {
        messagesContainer.appendChild(createMessageBubble('ai', aiResponse));
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1500);
}

document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            var isLightCurrently = document.body.classList.contains(CLASS_NAME);
            applyTheme(!isLightCurrently);
        });
    }

    document.querySelectorAll('.faq-item').forEach(function(item) {
      item.addEventListener('click', function() {
        var open = item.getAttribute('data-open') === 'true';
        item.setAttribute('data-open', String(!open));
      });
    });

    document.querySelectorAll('.chat-input-form').forEach(function(form) {
        form.addEventListener('submit', handleAdvice);
    });

    if (document.getElementById('ctaAdvice')) {
        document.getElementById('ctaAdvice').addEventListener('click', function() {
            var input = document.querySelector('.chat-input-form input');
            if (input) {
                input.focus();
            }
        });
    }
    
    if (document.getElementById('navAdviceBtn')) {
        document.getElementById('navAdviceBtn').addEventListener('click', function() {
            var input = document.querySelector('.chat-input-form input');
            if (input) {
                input.focus();
            }
        });
    }
});