require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  if (process.env.NODE_ENV === 'development') {
    res.json(surveyDetailsExample); // Return fallback data in development
  } else {
    try {
      const result = await getAllSurveyIds();
      res.json(result);
    } catch (error) {
      console.error('Error in / route:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.get('/survey-results/:id', async (req, res) => {
  const surveyId = req.params.id;
  try {
    const results = await getSurveyResponseIds(surveyId);
    res.json(results);
  } catch (error) {
    console.error(`Error fetching results for survey ID ${surveyId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

surveyDetailsExample = [
  {
    title: 'This is dummy data for React Monkey Testing',
    date_created: '2025-04-21T18:24:00',
    analyze_url: 'https://zhanghorace1.github.io/',
    has_important_question: false
  },
  {
    title: 'My Title 1',
    date_created: '2025-02-13T18:24:00',
    analyze_url: 'vercel.com',
    has_important_question: false
  },
  {
    title: 'My Title 2',
    date_created: '2025-03-12T14:50:00',
    analyze_url: 'render.com',
    has_important_question: false
  }
]

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
        let survey_ids = data.data.map(item => Number(item.id));
        return getSurveyDetails(survey_ids);
    } catch (error) {
        console.error('Error fetching Survey Monkey data:', error);
    }
}

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
              id: data.id,
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

async function getSurveyDetails(surveyIds) {
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

async function getSurveyResponseIds(surveyId) {
  try {
      const response = await fetch(`https://api.surveymonkey.com/v3/surveys/${surveyId}/responses/bulk`, {
          "method": "GET",
          "headers": {
              "Accept": "application/json",
              "Authorization": `Bearer ${process.env.SM_ACCESS_TOKEN}`
          }
      });
      const data = await response.json();
      let responseIds = data.data.map(item => Number(item.id));

      const subscriberContactInfo = getSurveyResponseDetails(surveyId, responseIds)

      return subscriberContactInfo
    } catch (error) {
      console.error('Error fetching Survey Monkey data:', error);
  }
}

const fetchResponseDetail = async (surveyId, responseId) => {
  try {
      const response = await fetch(`https://api.surveymonkey.com/v3/surveys/${surveyId}/responses/${responseId}/details?simple=true`, {
          "method": "GET",
          "headers": {
              "Accept": "application/json",
              "Authorization": `Bearer ${process.env.SM_ACCESS_TOKEN}`
          }
      });

      if (response.ok) {
          const data = await response.json();
          return data
      } else {
          console.error(`Error fetching details for response ID ${responseId}, survey ID ${surveyId}:`, response.statusText);
          return null;
      }
  } catch (error) {
      console.error(`Error fetching details for response ID ${responseId}, survey ID ${surveyId}:`, error);
      return null;
  }
};

async function getSurveyResponseDetails(surveyId, responseIds) {
  const responseDetailsPromises = responseIds.map(responseId => fetchResponseDetail(surveyId, responseId));
  const responseDetails = await Promise.all(responseDetailsPromises);

  const subscriberContactInfo = responseDetails.map(response => {
    const contactInfo = extractContactInfoIfSubscribed(response);
    return contactInfo;
  }).filter(info => info !== null);

  return subscriberContactInfo
}

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});


function extractContactInfoIfSubscribed(response) {
  let subscribed = false;
  let firstName = '';
  let lastName = '';
  let email = '';

  for (const page of response.pages) {
    for (const question of page.questions) {
      for (const answer of question.answers) {
        if (answer.simple_text && answer.simple_text.trim() === "Yes, add me to Common Impact's email list!") {
          subscribed = true;
        }

        // Extract first name
        if (answer.simple_text && answer.simple_text.includes('First name')) {
          firstName = answer.simple_text.split('|')[1]?.trim();
        }

        // Extract last name
        if (answer.simple_text && answer.simple_text.includes('Last name')) {
          lastName = answer.simple_text.split('|')[1]?.trim();
        }

        // Extract email
        if (answer.simple_text && answer.simple_text.includes('Email address')) {
          email = answer.simple_text.split('|')[1]?.trim();
        }
      }
    }
  }

  if (subscribed) {
    return {
      firstName,
      lastName,
      email
    };
  }

  return null; // Not subscribed
}
