require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send(getAllSurveyIds());
});

async function getAllSurveyIds() {
    try {
        const response = await fetch("https://api.surveymonkey.com/v3/surveys", {
            "method": "GET",
            "headers": {
                "Accept": "application/json",
                "Authorization": `Bearer ${process.env.SM_ACCESS_TOKEN}`
            }
        });
        const data = await response.json();
        // console.log(data)
        let survey_ids = data.data.map(item => Number(item.id));
        console.log(survey_ids);
        // return getSurveyDetails(survey_ids);
        let result = getSurveyDetails([417217266])
        console.log(result)
        return result;
    } catch (error) {
        console.error('Error fetching Survey Monkey data:', error);
    }
}

async function getSurveyDetails(surveyIds) {
    const fetchSurveyDetail = async (id) => {
        try {
            const response = await fetch(`https://api.surveymonkey.com/v3/surveys/${id}/details`, {
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${process.env.SM_ACCESS_TOKEN}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                return {
                    title: data.title,
                    date_created: data.date_created,
                    analyze_url: data.analyze_url,
                    has_important_question: isStringInObject(importantQuestion, data)
                };
            } else {
                console.error(`Error fetching details for survey ID ${id}:`, response.statusText);
                return null;
            }
        } catch (error) {
            console.error(`Error fetching details for survey ID ${id}:`, error);
            return null;
        }
    };

    const surveyDetailsPromises = surveyIds.map(id => fetchSurveyDetail(id));
    const surveyDetails = await Promise.all(surveyDetailsPromises);

    const filteredSurveyDetails = surveyDetails.filter(detail => detail !== null);
    return filteredSurveyDetails;
}

const importantQuestion = "Stay connected with us for a source of inspiration and impact! Check the box below to be added to our newsletter and receive engaging content featuring incredible collaborations between nonprofits, volunteers, and companies. You may unsubscribe at any time.";

function isStringInObject(targetString, obj) {
  const objectString = JSON.stringify(obj);
  return objectString.includes(targetString);
}

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
