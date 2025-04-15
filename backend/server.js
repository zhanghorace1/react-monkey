const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
//   res.send(getAllSurveyIds());
  res.send(surveyDetailsExample);
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
        let survey_ids = data.data.map(item => Number(item.id));
        getSurveyDetails(survey_ids);
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
                    "Authorization": `Bearer ${apiKey}`
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


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  console.log(`API Key: ${apiKey}`);
});

const surveyDetailsExample = [
    {
      title: 'Comcast Team UP Think Tank Skills Survey - May 2025',    
      date_created: '2025-03-12T14:50:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/Nd8hlWSPfSiyBWYhCy8iePduAIjHlRtG1e2BP5MpzrQ_3D',
      has_important_question: false
    },
    {
      title: 'Fidelity May 7th, 2025, Flash Consulting Day of Service - Skills Survey',
      date_created: '2025-02-03T20:52:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/zLgCHZycez5OeGfXbKkZ9lRlcQzfieaovBZNZCwZHkA_3D',
      has_important_question: false
    },
    {
      title: 'Allstate April Flash Consulting Day Volunteer Post Engagement Evaluation Survey',
      date_created: '2025-04-10T21:42:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/uutylmoMbXwFMQ6jYo1cMZdlh_2F7Dd7uK0QpJ_2BXUvIu0_3D',
      has_important_question: true
    },
    {
      title: 'Allstate April Flash Consulting Day Nonprofit Post Engagement Evaluation Survey',
      date_created: '2025-04-10T22:10:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/rl3QZa_2FgyCqwpUURb7Af8xkzQL5nNC1t86tW02MoiSQ_3D',
      has_important_question: true
    },
    {
      title: 'Fannie Mae 2025 Volunteer Post Engagement Evaluation Survey',
      date_created: '2025-03-26T00:20:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/hr08ZIu8_2Bv4llSvoad2TpM_2FaTgoviisbUTqXOWqc1rM_3D',
      has_important_question: true
    },
    {
      title: 'Mass Mutual Community Consulting 2025 - Nonprofit Post-Engagement Evaluation [DRAFT]',
      date_created: '2025-04-09T18:47:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/0CdAn0y6WAG_2BiR7BSlmcPxz9jTn6fvMa2cERGtIHQVo_3D',
      has_important_question: true
    },
    {
      title: 'Mass Mutual Community Consulting 2025 - Employee Post-Engagement Evaluation [DRAFT]',
      date_created: '2025-04-09T18:50:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/lk2SXDruRdu_2FLnyDw0GLUqS3kzivgMs6g_2By6h7VK2sY_3D',
      has_important_question: true
    },
    {
      title: 'MassMutual Community Consulting 2025 – Skills Survey [DRAFT]',
      date_created: '2025-04-02T13:28:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/kwuUPKxS8DwXdtnNarSKv8iHFN2rwMlIU_2BjT6_2F6i8VA_3D',
      has_important_question: false
    },
    {
      title: 'Fidelity CTG 2025 Skills Survey',
      date_created: '2025-03-03T16:44:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/AMXB8r33Z_2BWrqQHYKfpldFyWWElO_2F7_2F8qTaVBiRHV7Q_3D',
      has_important_question: false
    },
    {
      title: 'Fannie Mae Nonprofit Post Engagement Evaluation Survey', 
      date_created: '2025-03-26T14:24:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/sjw1iOmrmsfGf76xZdOir6GmdPRwBZ7tFaMOYkc4iEw_3D',
      has_important_question: true
    },
    {
      title: 'Fannie Mae March 2025 Flash Consulting - Skills Survey', 
      date_created: '2024-12-05T15:07:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/WkjSnIfvaCBul1_2BNQ_2BkGxyCGdXraYyiJL7l2QTMfHb4_3D',
      has_important_question: false
    },
    {
      title: 'Fannie Mae April 2025 Flash Consulting Skills Survey',   
      date_created: '2025-03-13T22:30:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/9jePvgu_2FU8tuKA6mZL7N6aXt1YxR9a0MdWCGvI6ua4M_3D',
      has_important_question: false
    },
    {
      title: 'Comcast Continued Engagement 2024 - Employee Feedback',  
      date_created: '2024-10-10T17:44:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/ULTSB1cf_2F_2FjqG7YQYWqwy9Rc1qvvql6EjIq_2B92vdVTw_3D',
      has_important_question: true
    },
    {
      title: 'Fidelity June 25th, 2025, Flash Consulting Day of Service - Skills Survey',
      date_created: '2025-03-11T16:00:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/wcr2npjZgnfpmiXwDt2SXe89Byc_2Fv_2FzUaLlXmdbDnak_3D',
      has_important_question: false
    },
    {
      title: 'Fidelity May 21st, 2025, Flash Consulting Day of Service - Skills Survey',
      date_created: '2025-02-13T18:24:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/_2FXcJ1KHDOJOfQEhMNzjOLGtgDmTzmPOma2_2BIW2rbPSk_3D',
      has_important_question: false
    },
    {
      title: 'Macquarie Pro Bono Marathon - February 2025 - Nonprofit Survey',
      date_created: '2025-01-17T18:49:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/grHHYxD1imDF7kQYbU1d3frh3dWbKKljP2tqDe3JlZo_3D',
      has_important_question: true
    },
    {
      title: 'Comcast Continued Engagement 2024 - Nonprofit Feedback', 
      date_created: '2024-10-10T17:43:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/Z_2FF_2BF_2Bi7PrWDvg86Zij3wChusDTnK0kT09FvypUoVZI_3D',
      has_important_question: true
    },
    {
      title: 'Macquarie Pro Bono Marathon - February 2025 - Volunteer Survey',
      date_created: '2025-01-17T19:00:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/Z_2BRm6lAfOWMa7dtwWC5bfVF7DPwCh004n7PuEDCZvOI_3D',
      has_important_question: true
    },
    {
      title: 'Twilio WePledge Singapore Flash Consulting Day of Service 2025 - Volunteer Evaluation',
      date_created: '2025-02-11T18:09:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/l5kHGp9AG10cE7LWkPHdqPOXrer4_2BSXhp8Aiho7Tky0_3D',
      has_important_question: true
    },
    {
      title: 'Fidelity Skills Survey TEMPLATE',
      date_created: '2024-07-25T12:17:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/J1lE39WLB3TOC4MaVb6_2FmUPJfjA1G84_2BEuGjSKN0N9A_3D',
      has_important_question: false
    },
    {
      title: 'Corporate End of Project - JPMorgan Chase',
      date_created: '2024-09-06T17:58:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/KRpoAXDtTJWTv78L1W5tWaJvWmX5W7O1H7AAAhApxew_3D',
      has_important_question: false
    },
    {
      title: 'Allstate Foundation October Flash Consulting Day: Nonprofit 3 Month Survey',
      date_created: '2025-01-09T00:47:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/jm7a45qRlHb9m5dCZMhMmJqpL6UnO_2BhK54jM66rJBWU_3D',
      has_important_question: false
    },
    {
      title: 'Nonprofit End of Project - JPMorgan Chase',
      date_created: '2024-09-11T13:53:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/S60zXWWsZpfM3EKwh65TTPanIpr_2FAgDM_2B5CzFPHtddQ_3D',
      has_important_question: false
    },
    {
      title: 'Unum Flash Consulting Event January 2025 - Nonprofit Evaluation',
      date_created: '2024-12-19T19:46:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/lFTB_2B3_2BfU_2B3hfXjnhFNBQ_2B0IJAJdKGMYjQYvKOa9tyU_3D',
      has_important_question: false
    },
    {
      title: '[TEMPLATE] CPE - Corporate Volunteer Post Engagement Evaluation Survey',
      date_created: '2024-07-16T20:55:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/kv1h3tnj38gM_2BGkTUXqRiu3J9mvZfELkVaxJxida98g_3D',
      has_important_question: true
    },
    {
      title: '[TEMPLATE] NPE - Nonprofit Post Engagement Evaluation Survey',
      date_created: '2024-07-19T16:13:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/_2BGgUnTfvIw9wGpSy3pniwI4lHuo64bQ8E2BT2uYXqWo_3D',
      has_important_question: true
    },
    {
      title: '1 Year Nonprofit End of Project - JPMorgan Chase',
      date_created: '2024-09-11T15:46:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/dYmd2DHqCAGhdopKtk4nvS7YdgiJbn9OUJaDaheOqG0_3D',
      has_important_question: false
    },
    {
      title: 'Allstate Foundation July Flash Consulting Day: Nonprofit 3 Month Survey',
      date_created: '2024-10-23T22:46:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/eI40h42VArHT2bWJeV5_2F3WvPFq_2Ba_2FPEmiJxefcCdof4_3D',
      has_important_question: false
    },
    {
      title: 'Farmers Insurance September 2024 Volunteer Survey',      
      date_created: '2024-08-26T15:11:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/EUwxesiAsvVQYwNBQ19xyhyX1if_2FLNbcylulKYRXUng_3D',
      has_important_question: true
    },
    {
      title: '2025 Fidelity Flash Consulting Events Volunteer Survey', 
      date_created: '2025-02-03T20:49:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/pYetIL2iKGLEVjEu8_2BsQLCX4ut94FFcJTY75M6QXHtA_3D',
      has_important_question: false
    },
    {
      title: 'Macquarie February 2025 Pro Bono Marathon - Skills Survey',
      date_created: '2024-10-31T17:16:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/ejMzGvlyCZ4yyycmDYADNwbvydexQ4oK3DmQZERNVsw_3D',
      has_important_question: false
    },
    {
      title: 'Unum Flash Consulting Event January 2025 - Volunteer Evaluation',
      date_created: '2024-12-19T19:30:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/texwaSrv9Kzcn2BKz0UpbNWhng6bu7Sip_2BURuIQyu3w_3D',
      has_important_question: false
    },
    {
      title: 'Nonprofit Feedback - Fidelity EI&O 2024 Projects',       
      date_created: '2024-12-16T17:01:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/d2tkO48ni9XUtuEBJusYuh_2FyqvPk2hFadcAM3c0ONvU_3D',
      has_important_question: true
    },
    {
      title: 'Volunteer Feedback Survey - Fidelity EI&O 2024 Projects',
      date_created: '2024-12-16T17:21:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/Q_2FXdFxL_2FGCfrRCZlmqPeqbuq98QoVGfwOxpO1zgujLM_3D',
      has_important_question: true
    },
    {
      title: 'Fannie Mae - Nonprofit Post Engagement Evaluation Survey',
      date_created: '2024-08-21T02:34:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/_2BNxb1WKVHIbkOzG5fKVXlgjNvhwi2ca4nmoXwcej9bs_3D',
      has_important_question: true
    },
    {
      title: 'Fannie Mae - Volunteer Post Engagement Evaluation Survey August',
      date_created: '2024-08-21T02:22:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/_2BNxb1WKVHIbkOzG5fKVXlsexW9Hjkn8xj5Qpn4oOlfU_3D',
      has_important_question: true
    },
    {
      title: 'The Allstate Foundation January Flash Consulting Day Skills Survey',
      date_created: '2024-10-30T18:44:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/WGOxM4U7pZwpKs73QChVKitsMbMON4hdgJb_2B1COfECU_3D',
      has_important_question: false
    },
    {
      title: 'Novartis November 2024 - Volunteer Post Engagement Survey',
      date_created: '2024-10-22T20:01:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/xHK1RB4hQbAha_2FrtyEQmnPZIZTLh4SCWDTss_2FouJB9I_3D',
      has_important_question: true
    },
    {
      title: 'Volunteer Feedback Survey - NVIDIA 2024 Events',
      date_created: '2024-09-17T21:00:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/ekiljqp2WKbaahzkGhJbEwR4CTCAwQNSFcIPqp8THJE_3D',
      has_important_question: true
    },
    {
      title: 'Manulife December Flash Consulting Event Skills Survey', 
      date_created: '2024-10-16T18:01:00',
      analyze_url: 'https://www.surveymonkey.com/analyze/8sEjzvcyumBeDI4QdvSRaUnlALFYXSqsmsK1tEnVYu8_3D',
      has_important_question: false
    }
  ]
