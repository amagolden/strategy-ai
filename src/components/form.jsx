import React, { useState } from "react";
import Response from "./response";


export default function StrategyForm() {
    const [selectedPreferences, setSelectedPreferences] = useState([]);
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [teamDescription, setTeamDescription] = useState('');


    const handleCheckboxChange = (option) => {
        setSelectedPreferences((prev) =>
        prev.includes(option)
            ? prev.filter((item) => item !== option) // Remove if already selected
            : [...prev, option] // Add if not selected
        );
    };

    const preferences = [
        "Vision Statement",
        "Mission Statement",
        "Goals & Objectives",
        "Strategies",
        "Key Performance Indicators (KPIs)",
    ];

    /*const standardPrompt = `Please generate a strategic plan that includes 5 annual objectives, key results, and timelines. Structure the response in the following JSON format:

    {
      "objectives": [
        {
          "objective": "Increase market share by 10%",
          "keyResults": [
            {
              "keyResult": "Launch new product line",
              "timeline": "Q2 2024"
            },
            {
              "keyResult": "Increase customer acquisition rate by 20%",
              "timeline": "Q3 2024"
            }
          ]
        },
        {
          "objective": "Reduce operational costs by 5%",
          "keyResults": [
            {
              "keyResult": "Implement new cost-saving software",
              "timeline": "Q1 2024"
            },
            {
              "keyResult": "Optimize supply chain logistics",
              "timeline": "Q4 2024"
            }
          ]
        }
      ]
    }

    Please ensure the JSON format is valid and clearly separated by each objective.`
*/

    const preferencePrompts = {
      "Vision Statement": `Provide a vision statement in JSON format like this: 
      {
        "Vision Statement": "Your vision here."
      }`,
      "Mission Statement": `Provide a mission statement in JSON format like this: 
      {
        "Mission Statement": "Your mission here."
      }`,
      "Goals & Objectives": `List goals and objectives in JSON format like this: 
      {
        "Goals": [
          { "Goal": "Increase market share", "Objective": "Expand to new markets by 2025" },
          { "Goal": "Improve customer satisfaction", "Objective": "Enhance customer support systems" }
        ]
      }`,
      "Strategies": `Outline strategies in JSON format like this: 
      {
        "Strategies": [
          { "Strategy": "Adopt a digital-first marketing approach" },
          { "Strategy": "Streamline supply chain operations" }
        ]
      }`,
      "Key Performance Indicators (KPIs)": `Provide KPIs in JSON format like this: 
      {
        "KPIs": [
          { "Metric": "Customer retention rate", "Target": "90%" },
          { "Metric": "Annual revenue growth", "Target": "15%" }
        ]
      }`,
    };

    const fetchOpenAiResponse = async () => {
        const selectedPrompts = selectedPreferences
          .map((pref) => preferencePrompts[pref])
          .join("\n");

        const customPrompt = `Based on the description of the team: "${teamDescription}", please provide the following in JSON format:
          ${selectedPrompts}`;

        setLoading(true);

        try {
        const result = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
            model: "gpt-3.5-turbo", 
            messages: [
                { role: "user", content: customPrompt }
            ],
            max_tokens: 1000,
            }),
        });

        const data = await result.json();
        //console.log("Raw API Response Content:", data.choices[0].message.content);

        // Try to parse the content as JSON
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(data.choices[0].message.content);
        } catch (parseError) {
            console.error("Response parsing error. Using fallback approach.", parseError);
        }

        //console.log("Final Parsed Response:", parsedResponse);
        setResponse(parsedResponse);

        } catch (error) {
        console.error('Error fetching data from OpenAI API:', error);
        } finally {
        setLoading(false);
        }
    };
    
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="border-b border-gray-900/10 pb-6">
          <h2 className="text-center text-xl font-semibold text-gray-900">
            Welcome to our Strategy Co-Pilot
          </h2>
          <p className="mt-1 text-center text-sm text-gray-600">
            We create custom strategic plans for your team based on your needs. We save you time so you can focus on getting things done.
          </p>
        </div>
  
        {/* Form and Output Section */}
        <div className="grid grid-cols-1 gap-6">
          {/* Form Column */}
          <form 
            onSubmit={(e) => {
                e.preventDefault();
                fetchOpenAiResponse();
              }}   
            className="space-y-6">
            <div className="border-b border-gray-900/10 pb-6">
              <h3 className="text-lg font-semibold text-gray-900">Strategic Preferences</h3>
              <fieldset className="mt-4 space-y-2">
                {preferences.map((preference) => (
                    <label key={preference} className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="preferences"
                        value={preference}
                        checked={selectedPreferences.includes(preference)}
                        onChange={() => handleCheckboxChange(preference)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <span>{preference}</span>
                    </label>
                ))}
                </fieldset>
            </div>

            {/* Team Description Section */}
            <div className="border-b border-gray-900/10 pb-6">
              <h3 className="text-lg font-semibold text-gray-900">Team Description</h3>
              <textarea
                name="teamDescription"
                placeholder="Describe your team, its goals, and any other relevant details."
                rows="4"
                className="mt-2 w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-600"
                onChange={(e) => setTeamDescription(e.target.value)}
              ></textarea>
            </div>
  
            <button
                type="submit"
                className="mt-4 w-full bg-indigo-600 text-white rounded-md px-3 py-2 hover:bg-indigo-500"
                disabled={loading}
                >
                {loading ? "Loading..." : "Get Plan"}
                </button>
            </form>

            {/* Display Strategic Plan */}
            <Response response={response} loading={loading} />
            {console.log(response)}
        </div>            
      </div>
    );
  }
  