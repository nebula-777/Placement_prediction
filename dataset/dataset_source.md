# Dataset Source for Placement Prediction

## 📊 Dataset Overview
- **Total Records**: 40 student entries
- **Features**: 8 attributes
- **Target**: Placement status (1 = Placed, 0 = Not Placed)

## 📁 Data Source
This dataset was created by combining:
1. **Kaggle Dataset**: "Factors Affecting Campus Placement"
   - Link: https://www.kaggle.com/datasets/benroshan/factors-affecting-campus-placement
2. **Real Placement Patterns** from college placement records
3. **Industry Research** on hiring trends (NASSCOM, LinkedIn)

## 📋 Feature Description

| Feature | Description | Range |
|---------|-------------|-------|
| cgpa | Cumulative Grade Point Average | 5.0 - 10.0 |
| technical_skills | Number of technical skills known | 0 - 10 |
| soft_skills | Number of soft skills | 0 - 10 |
| internships | Number of internships completed | 0 - 5 |
| projects | Number of projects completed | 0 - 10 |
| aptitude_score | Aptitude test score | 0 - 100 |
| backlogs | Number of backlogs | 0 - 5 |
| specialization | Branch of study | CS/IT/ECE/Mech/Civil |
| placed | Placement status | 0 or 1 |

## 📈 Dataset Statistics
- **Placement Rate**: 62.5% (25 placed out of 40)
- **Average CGPA (Placed)**: 8.4
- **Average CGPA (Not Placed)**: 6.3
- **Average Technical Skills (Placed)**: 4.2
- **Average Technical Skills (Not Placed)**: 1.8

## 🔬 How Dataset is Used
1. Dataset loaded into Python using pandas
2. Features selected for model training
3. Data split into training (80%) and testing (20%)
4. Logistic Regression model trained
5. Model coefficients extracted and embedded in website