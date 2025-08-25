import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const port = 3000;

// Fixed: Added https:// and removed config
const API_URL = "https://www.thecocktaildb.com/api/json/v1/1/random.php";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

// Random cocktail route
app.get("/", async (req, res) => {
    try {
        const response = await axios.get(API_URL); // ✅ removed config
        const drink = response.data.drinks[0];
        res.render("index.ejs", { drink, error: null });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error Fetching Cocktail Data");
    }
});

// Search cocktails by name
app.post("/search", async (req, res) => {
  const cocktailName = req.body.cocktail;
  try {
    const response = await axios.get(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailName}`
    );
    const cocktails = response.data.drinks;

    if (!cocktails) {
      res.render("search.ejs", { cocktails: [] });
    } else {
      res.render("search.ejs", { cocktails: cocktails });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching cocktail data.");
  }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
