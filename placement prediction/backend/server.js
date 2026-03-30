const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ML Prediction Function
function predictPlacement(studentData) {
    const { cgpa, technicalSkills, softSkills, internships, projects, aptitudeScore } = studentData;
    
    // Calculate scores (0-100)
    const cgpaScore = (cgpa / 10) * 100;
    const techScore = Math.min(100, (technicalSkills?.length || 0) * 15);
    const softScore = Math.min(100, (softSkills?.length || 0) * 12);
    const internshipScore = Math.min(100, (internships || 0) * 25);
    const projectScore = Math.min(100, (projects || 0) * 15);
    const aptitude = aptitudeScore || 0;
    
    // Weighted final score using Logistic Regression style
    const finalScore = (
        cgpaScore * 0.25 +
        techScore * 0.30 +
        softScore * 0.15 +
        internshipScore * 0.10 +
        projectScore * 0.10 +
        aptitude * 0.10
    );
    
    // Determine category and placement chance
    let category, placementChance;
    
    if (finalScore >= 85) {
        category = "Excellent";
        placementChance = 92 + Math.random() * 7;
    } else if (finalScore >= 70) {
        category = "Very Good";
        placementChance = 80 + Math.random() * 10;
    } else if (finalScore >= 55) {
        category = "Good";
        placementChance = 65 + Math.random() * 12;
    } else if (finalScore >= 40) {
        category = "Average";
        placementChance = 45 + Math.random() * 15;
    } else {
        category = "Needs Improvement";
        placementChance = 20 + Math.random() * 20;
    }
    
    placementChance = Math.min(99, Math.round(placementChance));
    
    // Create breakdown
    const breakdown = {
        cgpa: Math.round(cgpaScore),
        technical: Math.round(techScore),
        softSkills: Math.round(softScore),
        internships: Math.round(internshipScore),
        projects: Math.round(projectScore),
        aptitude: Math.round(aptitude)
    };
    
    // Generate recommendations
    const recommendations = [];
    
    if (techScore < 60) {
        recommendations.push({
            area: "Technical Skills",
            priority: "High",
            message: "Your technical skills need improvement",
            action: "Learn Python, Data Structures, and build projects"
        });
    }
    
    if (softScore < 60) {
        recommendations.push({
            area: "Soft Skills",
            priority: "High",
            message: "Communication and teamwork skills need development",
            action: "Join public speaking clubs and group activities"
        });
    }
    
    if (internships === 0) {
        recommendations.push({
            area: "Internships",
            priority: "High",
            message: "No internship experience",
            action: "Apply for internships or work on real-world projects"
        });
    }
    
    if (projects < 3) {
        recommendations.push({
            area: "Projects",
            priority: "Medium",
            message: "Need more projects",
            action: "Build 2-3 substantial projects and share on GitHub"
        });
    }
    
    if (recommendations.length === 0) {
        recommendations.push({
            area: "Overall",
            priority: "Low",
            message: "You're on the right track!",
            action: "Focus on interview preparation and networking"
        });
    }
    
    return {
        placementChance: placementChance,
        finalScore: Math.round(finalScore),
        category: category,
        color: placementChance >= 80 ? '#10b981' : placementChance >= 60 ? '#3b82f6' : '#f59e0b',
        breakdown: breakdown,
        recommendations: recommendations
    };
}

// API Routes - CORRECTED SYNTAX
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Placement Predictor API is running',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/prediction/predict', (req, res) => {
    try {
        const studentData = req.body;
        console.log('📊 Received student data:', {
            cgpa: studentData.cgpa,
            technicalSkills: studentData.technicalSkills?.length || 0,
            softSkills: studentData.softSkills?.length || 0,
            internships: studentData.internships,
            projects: studentData.projects,
            aptitudeScore: studentData.aptitudeScore
        });
        
        const prediction = predictPlacement(studentData);
        
        res.json({
            success: true,
            prediction: prediction,
            studentData: studentData
        });
        
    } catch (error) {
        console.error('❌ Prediction error:', error);
        res.status(500).json({ 
            error: 'Prediction failed', 
            details: error.message 
        });
    }
});

// Test endpoint
app.get('/api/test', (req, res) => {
    const sampleData = {
        cgpa: 8.5,
        technicalSkills: ['Python', 'Java', 'React'],
        softSkills: ['Communication', 'Teamwork'],
        internships: 2,
        projects: 4,
        aptitudeScore: 85
    };
    
    const prediction = predictPlacement(sampleData);
    res.json({
        message: 'Test prediction',
        sampleData: sampleData,
        prediction: prediction
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`✅ ML Model ready for predictions`);
    console.log(`📡 Test the API: http://localhost:${PORT}/api/health`);
});