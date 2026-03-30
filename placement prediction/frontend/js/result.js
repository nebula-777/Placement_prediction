const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    displayResults();
    displayMLExplanation();
});

function displayResults() {
    const prediction = JSON.parse(localStorage.getItem('predictionResult'));
    const studentData = JSON.parse(localStorage.getItem('studentData'));
    
    if (!prediction) {
        window.location.href = 'predict.html';
        return;
    }
    
    // Hide loading, show results
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('resultsContent').style.display = 'block';
    
    // Update gauge
    const placementChance = prediction.placementChance;
    document.getElementById('placementChance').textContent = `${placementChance}%`;
    document.getElementById('gaugeFill').style.width = `${placementChance}%`;
    
    // Update category
    const categoryElem = document.getElementById('placementCategory');
    categoryElem.textContent = prediction.category;
    categoryElem.style.color = prediction.color;
    
    // Display breakdown
    const breakdownList = document.getElementById('breakdownList');
    breakdownList.innerHTML = '';
    
    const breakdownMap = {
        cgpa: '📚 CGPA',
        technical: '💻 Technical Skills',
        softSkills: '🤝 Soft Skills',
        internships: '📁 Internships',
        projects: '🚀 Projects',
        aptitude: '📊 Aptitude'
    };
    
    for (const [key, value] of Object.entries(prediction.breakdown)) {
        const item = document.createElement('div');
        item.className = 'breakdown-item';
        item.innerHTML = `
            <span class="breakdown-label">${breakdownMap[key] || key}</span>
            <span class="breakdown-score">${value.score}% (${value.contribution} pts)</span>
        `;
        breakdownList.appendChild(item);
    }
    
    // Display recommendations
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';
    
    if (prediction.recommendations && prediction.recommendations.length > 0) {
        prediction.recommendations.forEach(rec => {
            const item = document.createElement('div');
            item.className = 'recommendation-item';
            const priorityColor = rec.priority === 'High' ? '#ef4444' : 
                                 rec.priority === 'Medium' ? '#f59e0b' : '#10b981';
            item.innerHTML = `
                <strong style="color: ${priorityColor}">${rec.area}:</strong>
                <p style="margin: 5px 0;">${rec.message}</p>
                <small style="color: #666;">💡 ${rec.action}</small>
            `;
            recommendationsList.appendChild(item);
        });
    }
}

function displayMLExplanation() {
    const explanation = JSON.parse(localStorage.getItem('explanation'));
    if (!explanation) return;
    
    const mlSection = document.getElementById('mlExplanation');
    const explanationDetails = document.getElementById('explanationDetails');
    
    if (mlSection && explanationDetails) {
        mlSection.style.display = 'block';
        explanationDetails.innerHTML = `
            <div style="background: #f0f4ff; padding: 1rem; border-radius: 10px; margin-top: 1rem;">
                <p><strong>Your Logit Value (z):</strong> ${explanation.yourLogitValue?.toFixed(4) || 'N/A'}</p>
                <p><strong>Your Probability:</strong> ${(explanation.yourProbability * 100).toFixed(1)}%</p>
                <p><strong>Interpretation:</strong> ${explanation.interpretation || ''}</p>
                <p><strong>Model Accuracy:</strong> ${(explanation.modelMetrics?.accuracy * 100).toFixed(1)}%</p>
            </div>
        `;
    }
}

function downloadResults() {
    const prediction = JSON.parse(localStorage.getItem('predictionResult'));
    const studentData = JSON.parse(localStorage.getItem('studentData'));
    const explanation = JSON.parse(localStorage.getItem('explanation'));
    
    let report = `PLACEMENT PREDICTION REPORT (ML-Based)\n`;
    report += `=========================================\n\n`;
    report += `Prediction Date: ${new Date().toLocaleString()}\n\n`;
    
    report += `STUDENT PROFILE\n`;
    report += `---------------\n`;
    report += `CGPA: ${studentData.cgpa}/10\n`;
    report += `Technical Skills: ${studentData.technicalSkills?.join(', ') || 'None'}\n`;
    report += `Soft Skills: ${studentData.softSkills?.join(', ') || 'None'}\n`;
    report += `Internships: ${studentData.internships}\n`;
    report += `Projects: ${studentData.projects}\n`;
    report += `Aptitude Score: ${studentData.aptitudeScore}%\n`;
    report += `Backlogs: ${studentData.backlogs || 0}\n\n`;
    
    report += `ML PREDICTION RESULTS\n`;
    report += `--------------------\n`;
    report += `Placement Chance: ${prediction.placementChance}%\n`;
    report += `Category: ${prediction.category}\n`;
    report += `Final Score: ${prediction.finalScore}%\n\n`;
    
    report += `LOGISTIC REGRESSION FORMULA\n`;
    report += `--------------------------\n`;
    report += `P = 1 / (1 + e^(-z))\n`;
    report += `Your z-value: ${explanation?.yourLogitValue?.toFixed(4) || 'N/A'}\n`;
    report += `Probability: ${(explanation?.yourProbability * 100).toFixed(1)}%\n\n`;
    
    report += `SCORE BREAKDOWN\n`;
    report += `---------------\n`;
    for (const [key, value] of Object.entries(prediction.breakdown)) {
        const name = {cgpa:'CGPA', technical:'Technical', softSkills:'Soft Skills', internships:'Internships', projects:'Projects', aptitude:'Aptitude'}[key];
        report += `${name}: ${value.score}% (contribution: ${value.contribution} pts)\n`;
    }
    report += `\n`;
    
    report += `RECOMMENDATIONS\n`;
    report += `---------------\n`;
    prediction.recommendations?.forEach((rec, i) => {
        report += `${i+1}. ${rec.area}: ${rec.message}\n`;
        report += `   Action: ${rec.action}\n\n`;
    });
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placement_ml_report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}