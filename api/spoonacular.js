const axios = require("axios");

module.exports = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "❗ Mangler query-parameter" });
  }

  try {
    const response = await axios.get(
      "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch",
      {
        params: {
          query,
          number: 1,
          addRecipeInformation: true,
        },
        headers: {
          "X-RapidAPI-Key": process.env.SPOONACULAR_KEY,
          "X-RapidAPI-Host":
            "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
        },
      }
    );

    console.log("✅ Spoonacular-svar:", response.data);

    const recipe = response.data.results?.[0];

    if (!recipe) {
      return res.status(404).json({ error: "❌ Fant ingen oppskrift" });
    }

    const result = {
      title: recipe.title || "Ukjent tittel",
      image: recipe.image || "",
      ingredients: recipe.extendedIngredients?.map((i) => i.original) || [],
      steps: recipe.analyzedInstructions?.[0]?.steps?.map((s) => s.step) || [
        "Steg ikke tilgjengelig",
      ],
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "❌ Spoonacular-feil:",
      error.response?.data || error.message
    );
    return res
      .status(500)
      .json({ error: "Noe gikk galt med Spoonacular (se logs)" });
  }
};
