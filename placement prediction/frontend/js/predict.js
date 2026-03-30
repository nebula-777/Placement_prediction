const API_URL = 'http://localhost:5000/api';

const form = document.getElementById('predictionForm');
const predictBtn = document.getElementById('predictBtn');

// Add additional fields for better prediction
function addAdvancedFields() {
    const formWrapper = document.querySelector('.form-wrapper');
    
    // Check if fields already exist
    if (document.getElementById('backlogs')) return;
    
    const advancedFields = `
        <div class="form-row">
            <div class="form-group">
                <label><i class="fas fa-exclamation-triangle"></i> Backlogs (if any)</label>
                <input type="number" id="backlogs" min="0" max="10" value="0" required>
            </div>
            <div class="form-group">
                <label><i class="fas fa-venus-mars"></i> Gender</label>
                <select id="gender" style="width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 12px;">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label><i class="fas fa-graduation-cap"></i> Specialization</label>
            <select id="specialization" style="width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 12px;">
                <option value="CS">Computer Science (CS)</option>
                <option value="IT">Information Technology (IT)</option>
                <option value="ECE">Electronics & Communication (ECE)</option>
                <option value="Mech">Mechanical Engineering</option>
                <option value="Civil">Civil Engineering</option>
            </select>
        </div>
    `;
    
    const aptitudeField = document.querySelector('#aptitudeScore').parentElement;
    aptitudeField.insertAdjacentHTML('afterend', advancedFields);
}

// Add advanced fields when page loads
document.addEventListener('DOMContentLoaded', () => {
    addAdvancedFields();
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    predictBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing with ML Model...';
    predictBtn.disabled = true;
    
    try {
        const studentData = {
            cgpa: parseFloat(document.getElementById('cgpa').value),
            technicalSkills: getSelectedSkills('technicalSkillsGrid'),
            softSkills: getSelectedSkills('softSkillsGrid'),
            internships: parseInt(document.getElementById('internships').value) || 0,
            projects: parseInt(document.getElementById('projects').value) || 0,
            aptitudeScore: parseInt(document.getElementById('aptitudeScore').value) || 0,
            backlogs: parseInt(document.getElementById('backlogs').value) || 0,
            gender: document.getElementById('gender').value,
            specialization: document.getElementById('specialization').value
        };
        
        // Validate
        if (studentData.cgpa < 0 || studentData.cgpa > 10) {
            alert('CGPA must be between 0 and 10');
            resetButton();
            return;
        }
        
        console.log('📊 Sending data to ML model:', studentData);
        
        const response = await fetch(`${API_URL}/prediction/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });
        
        const result = await response.json();
        console.log('📈 ML Model Response:', result);
        
        if (response.ok && result.success) {
            // Store complete result in localStorage
            localStorage.setItem('predictionResult', JSON.stringify(result.prediction));
            localStorage.setItem('studentData', JSON.stringify(studentData));
            localStorage.setItem('explanation', JSON.stringify(result.explanation));
            
            window.location.href = 'result.html';
        } else {
            alert('Error: ' + (result.error || 'Prediction failed'));
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to connect to server. Please make sure the backend is running on port 5000');
    } finally {
        resetButton();
    }
});

function getSelectedSkills(gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return [];
    const checkboxes = grid.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

function resetButton() {
    predictBtn.innerHTML = '<i class="fas fa-chart-line"></i> Predict Placement Chance';
    predictBtn.disabled = false;
}