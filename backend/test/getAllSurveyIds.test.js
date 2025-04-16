const { getAllSurveyIds } = require('../server');
const fetchMock = require('jest-fetch-mock');

fetchMock.enableMocks();

describe('getAllSurveyIds', () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it.only('should fetch survey IDs from the SurveyMonkey API', async () => {
        const mockResponse = {
            data: [
                { id: '12345' },
                { id: '67890' }
            ]
        };

        fetch.mockResponseOnce(JSON.stringify(mockResponse));

        const surveyIds = await getAllSurveyIds();

        expect(fetch).toHaveBeenCalledWith(
            "https://api.surveymonkey.com/v3/surveys",
            expect.objectContaining({
                method: "GET",
                headers: expect.objectContaining({
                    Accept: "application/json",
                    Authorization: expect.stringContaining("Bearer")
                })
            })
        );

        expect(surveyIds).toEqual([12345, 67890]);
    });

    it('should handle errors gracefully', async () => {
        fetch.mockReject(new Error('API is down'));

        await expect(getAllSurveyIds()).resolves.toBeUndefined();
        expect(console.error).toHaveBeenCalledWith(
            'Error fetching Survey Monkey data:',
            expect.any(Error)
        );
    });
});