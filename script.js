// ===================================
// SCROLL REVEAL ANIMATIONS
// ===================================

// Intersection Observer for scroll reveal
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with 'reveal' class
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
});

// ===================================
// SMOOTH SCROLLING
// ===================================

function scrollToCatalog() {
    const catalogSection = document.getElementById('catalog');
    catalogSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// ===================================
// REGISTRATION MODAL
// ===================================

let selectedTrack = '';

function openRegistration(trackName) {
    selectedTrack = trackName;
    const modal = document.getElementById('registrationModal');
    const programSelect = document.getElementById('program');

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Pre-select first course in the track if possible
    if (trackName === 'Data & AI') {
        programSelect.value = 'Comprehensive Data Analysis';
    } else if (trackName === 'Web & Office Skills') {
        programSelect.value = 'WordPress Web Design (Domain to Launch)';
    } else if (trackName === 'Digital & Security') {
        programSelect.value = 'Digital Marketing & Social Media Management';
    } else if (trackName === 'Systems & Startup') {
        programSelect.value = 'E-Enterprise and E-Governance';
    }
}

function closeRegistration() {
    const modal = document.getElementById('registrationModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Reset form
    document.getElementById('registrationForm').reset();
}

function closeConfirmation() {
    const modal = document.getElementById('confirmationModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ===================================
// FORM SUBMISSION
// ===================================

async function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = {
        name: form.name.value,
        whatsapp: form.whatsapp.value,
        program: form.program.value,
        timestamp: new Date().toISOString(),
        track: selectedTrack
    };

    // Disable submit button
    const submitButton = form.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;

    try {
        // Save to backend
        await saveRegistration(formData);

        // Send WhatsApp confirmation
        await sendWhatsAppMessage(formData);

        // Close registration modal
        closeRegistration();

        // Show confirmation
        const confirmationModal = document.getElementById('confirmationModal');
        confirmationModal.classList.add('active');

    } catch (error) {
        console.error('Registration error:', error);
        alert('Something went wrong. Please try again or contact us directly at 08097545740');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// ===================================
// BACKEND INTEGRATION - Save Registration
// ===================================

async function saveRegistration(data) {
    console.log('Saving registration:', data);

    try {
        // Call backend API
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to save registration');
        }

        return await response.json();

    } catch (error) {
        console.error('Backend API error, falling back to localStorage:', error);

        // Fallback: save to localStorage if backend unavailable
        const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
        registrations.push(data);
        localStorage.setItem('registrations', JSON.stringify(registrations));

        return { success: true, fallback: true };
    }
}

// ===================================
// WHATSAPP API INTEGRATION
// ===================================

async function sendWhatsAppMessage(data) {
    console.log('Sending WhatsApp message to:', data.whatsapp);

    try {
        // Call backend WhatsApp API
        const response = await fetch('/api/send-whatsapp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: data.whatsapp,
                name: data.name,
                program: data.program
            })
        });

        if (!response.ok) {
            console.warn('WhatsApp API returned error, but continuing...');
        }

        return await response.json();

    } catch (error) {
        console.error('WhatsApp API error:', error);
        // Don't throw - registration was saved, WhatsApp is secondary
        return { success: false, error: error.message };
    }
}

// ===================================
// KEYBOARD SHORTCUTS
// ===================================

document.addEventListener('keydown', (e) => {
    // ESC to close modals
    if (e.key === 'Escape') {
        closeRegistration();
        closeConfirmation();
    }
});
