const express = require('express');
const router = express.Router();
const PredictionModel = require('../models/PredictionModel');

// Initialize ML model
const model = new PredictionModel();
console.log('✅ ML Model initialized with Logistic Regression');

// Main prediction endpoint
router.post('/predict', async (req, res) => {
    try {
        const studentData = req.body;
        
        console.log('📊 Processing prediction for:', {
            cgpa: studentData.cgpa,
            technicalSkills: studentData.technicalSkills?.length || 0,
            softSkills: studentData.softSkills?.length || 0,
            internships: studentData.internships,
            projects: studentData.projects
        });
        
        // Validate input
        if (!studentData.cgpa || studentData.cgpa < 0 || studentData.cgpa > 10) {
            return res.status(400).json({ error: 'CGPA must be between 0 and 10' });
        }
        
        if (!studentData.aptitudeScore || studentData.aptitudeScore < 0 || studentData.aptitudeScore > 100) {
            return res.status(400).json({ error: 'Aptitude score must be between 0 and 100' });
        }
        
        // Ensure arrays exist
        studentData.technicalSkills = studentData.technicalSkills || [];
        studentData.softSkills = studentData.softSkills || [];
        studentData.internships = studentData.internships || 0;
        studentData.projects = studentData.projects || 0;
        studentData.backlogs = studentData.backlogs || 0;
        studentData.gender = studentData.gender || 'Male';
        studentData.specialization = studentData.specialization || 'CS';
        
        // Get ML prediction
        const prediction = model.predict(studentData);
        
        // Get model explanation
        const explanation = model.explainPrediction(studentData, prediction);
        
        res.json({
            success: true,
            prediction: prediction,
            explanation: explanation,
            studentData: studentData,
            modelMetrics: model.getModelMetrics()
        });
        
    } catch (error) {
        console.error('❌ Prediction error:', error);
        res.status(500).json({ error: 'Prediction failed', details: error.message });
    }
});

// Get model information
router.get('/model-info', (req, res) => {
    res.json({
        modelType: 'Logistic Regression',
        formula: 'P = 1 / (1 + e^(-z))',
        coefficients: model.coefficients,
        metrics: model.getModelMetrics(),
        features: [
            'CGPA', 'Technical Skills', 'Soft Skills', 'Communication',
            'Aptitude', 'Internships', 'Projects', 'Backlogs'
        ]
    });
});

// Test prediction with sample data
router.get('/test', (req, res) => {
    const sampleData = {
        cgpa: 8.5,
        technicalSkills: ['Python', 'Data Structures', 'Machine Learning'],
        softSkills: ['Communication', 'Problem Solving', 'Teamwork'],
        internships: 2,
        projects: 4,
        aptitudeScore: 85,
        backlogs: 0,
        gender: 'Male',
        specialization: 'CS'
    };
    
    const prediction = model.predict(sampleData);
    res.json({
        message: 'Test prediction with sample data',
        sampleData: sampleData,
        prediction: prediction
    });
});

module.exports = router;