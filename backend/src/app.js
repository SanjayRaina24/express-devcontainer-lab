import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());  // Needed for POST body parsing

// ---------------------------------------
// QUOTE DATA
// ---------------------------------------
let categories = ['successQuotes', 'perseveranceQuotes', 'happinessQuotes'];

let successQuotes = [
  {
    quote: 'Success is not final, failure is not fatal: It is the courage to continue that counts.',
    author: 'Winston S. Churchill'
  },
  {
    quote: 'The way to get started is to quit talking and begin doing.',
    author: 'Walt Disney'
  }
];

let perseveranceQuotes = [
  {
    quote: 'It’s not that I’m so smart, it’s just that I stay with problems longer.',
    author: 'Albert Einstein'
  },
  {
    quote: 'Perseverance is failing 19 times and succeeding the 20th.',
    author: 'Julie Andrews'
  }
];

let happinessQuotes = [
  {
    quote: 'Happiness is not something ready made. It comes from your own actions.',
    author: 'Dalai Lama'
  },
  {
    quote: 'For every minute you are angry you lose sixty seconds of happiness.',
    author: 'Ralph Waldo Emerson'
  }
];

app.get("/quotebook/categories", (req, res) => {
  let response = categories
    .map(c => `A possible category is ${c}`)
    .join("\n");

  res.type("text").send(response);
});

app.get("/quotebook/quote/:category", (req, res) => {
  const category = req.params.category;

  if (!categories.includes(category)) {
    return res.status(400).json({
      error: `no category listed for ${category}`
    });
  }

  // Access the array using bracket notation
  const quotesArray = {
    successQuotes,
    perseveranceQuotes,
    happinessQuotes
  }[category];

  const random = quotesArray[Math.floor(Math.random() * quotesArray.length)];
  res.json(random);
});

app.post("/quotebook/quote/new", (req, res) => {
  const { category, quote, author } = req.body;

  // Validate input
  if (!category || !quote || !author || !categories.includes(category)) {
    return res
      .status(400)
      .json({ error: "invalid or insufficient user input" });
  }

  // Push into correct category
  const targetArray = {
    successQuotes,
    perseveranceQuotes,
    happinessQuotes
  }[category];

  targetArray.push({ quote, author });

  res.type("text").send("Success!");
});


app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Hello from Express inside a Dev Container!", name: "Sanjay" });
});

app.get("/health", (req, res) => {
  res.status(200).send("healthy");
});

/**
 * /math/circle/:r
 * Example: /math/circle/1
 */
app.get("/math/circle/:r", (req, res) => {
  const r = parseFloat(req.params.r);

  if (isNaN(r)) {
    return res.status(400).json({ error: "Radius must be a number" });
  }

  const area = Math.PI * r * r;
  const circumference = 2 * Math.PI * r;

  res.json({
    area,
    circumference,
  });
});

/**
 * /math/rectangle/:width/:height
 * Example: /math/rectangle/5/5
 */
app.get("/math/rectangle/:width/:height", (req, res) => {
  const width = parseFloat(req.params.width);
  const height = parseFloat(req.params.height);

  if (isNaN(width) || isNaN(height)) {
    return res.status(400).json({ error: "Width and height must be numbers" });
  }

  const area = width * height;
  const perimeter = 2 * (width + height);

  res.json({
    area,
    perimeter,
  });
});

/**
 * /math/power/:base/:exponent
 * Optional query: ?root=true
 *
 * Examples:
 *   /math/power/4/2
 *   /math/power/4/2?root=true
 */
app.get("/math/power/:base/:exponent", (req, res) => {
  const base = parseFloat(req.params.base);
  const exponent = parseFloat(req.params.exponent);

  if (isNaN(base) || isNaN(exponent)) {
    return res.status(400).json({ error: "Base and exponent must be numbers" });
  }

  const result = Math.pow(base, exponent);

  const response = { result };

  if (req.query.root === "true") {
    response.root = Math.sqrt(base);
  }

  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
